import { useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import { NAV_CHAPTERS } from "../lib/chapters";

/* ── ChapterNav: a side index of the page's chapters (desktop only). Each dot
   jumps to its section — the anchors are handled globally by LenisAnchors, so a
   plain <a href="#id"> already scrolls smoothly and moves focus. The active
   chapter is tracked with an IntersectionObserver (motion-independent, so it
   keeps working under prefers-reduced-motion), and a thin pink wire fills with
   the overall scroll progress. Purely presentational chrome — never traps the
   user; it's just a faster way to navigate the same anchors as the header. */
export default function ChapterNav() {
  const [active, setActive] = useState<string>(NAV_CHAPTERS[0]?.id ?? "");
  const fill = useRef<HTMLSpanElement>(null);

  // Track the chapter crossing the viewport's vertical center.
  useEffect(() => {
    const sections = NAV_CHAPTERS.map((c) => document.getElementById(c.id)).filter(
      (el): el is HTMLElement => !!el,
    );
    if (!sections.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // Drive the progress wire from Lenis (falls back to no-op without Lenis).
  useLenis((lenis) => {
    if (fill.current) {
      fill.current.style.transform = `scaleY(${lenis.progress || 0})`;
    }
  });

  return (
    <nav
      aria-label="Capítulos"
      className="fixed right-5 top-1/2 z-[var(--z-nav)] hidden -translate-y-1/2 lg:block"
    >
      {/* progress wire behind the dots */}
      <span
        aria-hidden
        className="absolute left-[7px] top-1 bottom-1 w-px bg-cream-line"
      />
      <span
        aria-hidden
        ref={fill}
        className="absolute left-[7px] top-1 bottom-1 w-px origin-top scale-y-0 bg-pink"
      />

      <ul className="relative flex flex-col gap-4">
        {NAV_CHAPTERS.map((c) => {
          const on = active === c.id;
          return (
            <li key={c.id} className="group relative flex items-center">
              <a
                href={`#${c.id}`}
                aria-current={on ? "true" : undefined}
                aria-label={c.label}
                className="relative flex h-4 w-4 items-center justify-center"
              >
                <span
                  className={`block rounded-full transition-all duration-300 ease-[var(--ease-quart)] ${
                    on
                      ? "h-3 w-3 bg-pink shadow-[0_0_0_4px_oklch(0.745_0.155_356_/_0.16)]"
                      : "h-1.5 w-1.5 bg-ink/25 group-hover:bg-ink/50"
                  }`}
                />
                {/* label flag, appears on hover/active */}
                <span
                  className={`pointer-events-none absolute right-6 whitespace-nowrap rounded-md border border-cream-line bg-cream-deep px-2.5 py-1 text-[0.72rem] font-medium text-ink shadow-[var(--shadow-soft)] transition-all duration-300 ease-[var(--ease-quart)] ${
                    on
                      ? "translate-x-0 opacity-100"
                      : "translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                  }`}
                >
                  {c.label}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
