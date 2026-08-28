import { useEffect, useLayoutEffect, useRef } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { ReactLenis, useLenis } from "lenis/react";
import { ScrollTrigger } from "./lib/gsap";
import { reduceMotion } from "./lib/motion";
import SceneBackground from "./components/SceneBackground";
import Seo from "./components/Seo";
import Nav from "./sections/Nav";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import ServicePage from "./pages/ServicePage";
import { SERVICES } from "./lib/services";
import { homeSchema, serviceSchema } from "./lib/schema";

/* Bridges Lenis's smooth scroll into ScrollTrigger (so every scrubbed/pinned
   animation tracks the eased scroll) and drives the top progress bar. Lives
   inside <ReactLenis> so useLenis can reach the live instance. Transform-only. */
function ScrollChrome() {
  const bar = useRef<HTMLDivElement>(null);

  useLenis((lenis) => {
    // Dev-only: expose the live Lenis instance so preview/automation can drive
    // smooth scroll (native scrollTo is overridden by Lenis). Never ships.
    if (import.meta.env.DEV) (window as unknown as { __lenis?: unknown }).__lenis = lenis;
    ScrollTrigger.update();
    if (bar.current) {
      bar.current.style.transform = `scaleX(${lenis.progress || 0})`;
    }
  });

  // Recompute trigger positions once late assets (fonts/images) settle.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    const id = window.setTimeout(refresh, 300);
    window.addEventListener("load", refresh);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("load", refresh);
    };
  }, []);

  return (
    <div
      aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-[var(--z-overlay)] h-[2px]"
      >
      <div ref={bar} className="h-full w-full origin-left scale-x-0 bg-signal" />
    </div>
  );
}

/* Routes in-page #hash clicks through Lenis so they scroll smoothly to the right
   spot (the native jump fights Lenis's smoothing). The target position is summed
   from offsetTop (layout-based) instead of getBoundingClientRect, so it ignores
   the exit transforms the chapters apply — a section that's currently lifted/
   scaled as it leaves still resolves to its true position. Always rendered —
   anchors must work even under reduced motion (then instant). Keeps keyboard/SR
   focus moving to the target. */
const NAV_CLEARANCE = 96; // px the section sits below the viewport top (fixed nav)

function offsetFor(target: HTMLElement) {
  let y = -NAV_CLEARANCE;
  let node: HTMLElement | null = target;
  while (node) {
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return Math.max(0, Math.round(y));
}

function LenisAnchors() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return;
      const link = (e.target as HTMLElement).closest?.('a[href^="#"]');
      const href = link?.getAttribute("href");
      if (!href || href.length < 2) return;
      const target = document.querySelector<HTMLElement>(href);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(offsetFor(target));
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [lenis]);

  return null;
}

/* A route change swaps the whole page under Lenis and ScrollTrigger, neither of
   which watches the router. This resets the scroll position, honours a #hash
   carried across pages (the nav links back to /#processo from a service page)
   and rebuilds trigger positions for the new content. */
function RouteChrome() {
  const { pathname, hash } = useLocation();
  const lenis = useLenis();

  useLayoutEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);

  useEffect(() => {
    if (!hash) {
      const id = window.setTimeout(() => ScrollTrigger.refresh(), 120);
      return () => window.clearTimeout(id);
    }

    /* Landing on /#processo from a service page means the home page has to
       mount, lay out and load its media before the anchor's offset is even
       knowable. A single delayed scroll lands short, so this re-measures until
       the target actually sits under the nav — and stops the moment the visitor
       takes over the scroll themselves. */
    let attempts = 0;
    let timer = 0;
    let taken = false;
    const surrender = () => {
      taken = true;
    };
    window.addEventListener("wheel", surrender, { passive: true, once: true });
    window.addEventListener("touchstart", surrender, { passive: true, once: true });

    const attempt = () => {
      if (taken) return;
      const target = document.querySelector<HTMLElement>(hash);
      if (target) {
        ScrollTrigger.refresh();
        const y = offsetFor(target);
        if (Math.abs(window.scrollY - y) > 8) {
          if (lenis) lenis.scrollTo(y, { immediate: true });
          else window.scrollTo(0, y);
        } else {
          return;
        }
      }
      if (++attempts < 12) timer = window.setTimeout(attempt, 120);
    };
    timer = window.setTimeout(attempt, 60);

    return () => {
      taken = true;
      window.clearTimeout(timer);
      window.removeEventListener("wheel", surrender);
      window.removeEventListener("touchstart", surrender);
    };
  }, [pathname, hash, lenis]);

  return null;
}

export default function App() {
  const reduce = reduceMotion();

  // Releases the paint guard set in index.html. Layout effect, so it runs after
  // the chapters' own useGSAP effects have armed their reveals — the first
  // painted frame is the intro's starting state, never a half-applied one.
  useLayoutEffect(() => {
    document.documentElement.classList.remove("booting");
  }, []);

  useEffect(() => {
    document.documentElement.dataset.reducedMotion = reduce ? "true" : "false";
    return () => {
      delete document.documentElement.dataset.reducedMotion;
    };
  }, [reduce]);

  return (
    <ReactLenis
      root
      options={{
        lerp: reduce ? 1 : 0.09,
        duration: 1.1,
        smoothWheel: !reduce,
        touchMultiplier: 1.5,
      }}
    >
      <LenisAnchors />
      <RouteChrome />
      {!reduce && <ScrollChrome />}
      <SceneBackground />
      <a
        href="#conteudo"
        className="sr-only z-[var(--z-overlay)] focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:rounded-md focus:bg-ink focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-paper"
      >
        Pular para o conteúdo
      </a>
      <Nav />
      <main id="conteudo">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Seo
                  title="MewStack — Sistemas e automação sob medida em Caxias do Sul"
                  description="Estúdio de software em Caxias do Sul. Sistemas sob medida, automação de processos e integração de dados para a sua operação."
                  path="/"
                  schema={homeSchema()}
                />
                <Home />
              </>
            }
          />
          {SERVICES.map((service) => (
            <Route
              key={service.slug}
              path={`/${service.slug}`}
              element={
                <>
                  <Seo
                    title={service.metaTitle}
                    description={service.metaDescription}
                    path={`/${service.slug}`}
                    schema={serviceSchema(service)}
                  />
                  <ServicePage service={service} />
                </>
              }
            />
          ))}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </ReactLenis>
  );
}
