import { useEffect, useRef } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import { ScrollTrigger } from "./lib/gsap";
import { reduceMotion } from "./lib/motion";
import Nav from "./sections/Nav";
import Hero from "./sections/Hero";
import Capabilities from "./sections/Capabilities";
import CodeLab from "./sections/CodeLab";
import Process from "./sections/Process";
import About from "./sections/About";
import Showcase from "./sections/Showcase";
import Contact from "./sections/Contact";

/* Bridges Lenis's smooth scroll into ScrollTrigger (so every scrubbed/pinned
   animation tracks the eased scroll) and drives the top progress bar. Lives
   inside <ReactLenis> so useLenis can reach the live instance. Transform-only. */
function ScrollChrome() {
  const bar = useRef<HTMLDivElement>(null);

  useLenis((lenis) => {
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
      <div ref={bar} className="h-full w-full origin-left scale-x-0 bg-pink" />
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
      let y = -NAV_CLEARANCE;
      let node: HTMLElement | null = target;
      while (node) {
        y += node.offsetTop;
        node = node.offsetParent as HTMLElement | null;
      }
      lenis.scrollTo(Math.max(0, Math.round(y)));
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [lenis]);

  return null;
}

export default function App() {
  const reduce = reduceMotion();

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
      {!reduce && <ScrollChrome />}
      <a
        href="#conteudo"
        className="sr-only z-[var(--z-overlay)] focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:rounded-full focus:bg-ink focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-cream"
      >
        Pular para o conteúdo
      </a>
      <Nav />
      <main id="conteudo">
        <Hero />
        <Capabilities />
        <CodeLab />
        <Process />
        <About />
        <Showcase />
        <Contact />
      </main>
    </ReactLenis>
  );
}
