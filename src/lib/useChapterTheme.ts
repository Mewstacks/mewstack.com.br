import { useEffect, useState } from "react";
import { CHAPTERS } from "./chapters";
import type { ChapterTheme } from "./chapters";

/**
 * Theme ("light" | "dark") of whichever chapter currently sits under the top of
 * the viewport — i.e. behind the fixed nav. Lets the nav flip its contrast (text,
 * logo, surface) when it floats over a charcoal "machine room" chapter, keeping
 * it legible (AA) throughout the scroll.
 *
 * Plain scroll/resize listeners (Lenis still emits native scroll), cheap
 * getBoundingClientRect probes — no GSAP needed.
 */
const PROBE = 72; // px below the viewport top — roughly the nav's mid-line

export function useChapterTheme(): ChapterTheme {
  const [theme, setTheme] = useState<ChapterTheme>("light");

  useEffect(() => {
    const sections = CHAPTERS.map((c) => ({
      theme: c.theme,
      el: document.getElementById(c.id),
    })).filter((s): s is { theme: ChapterTheme; el: HTMLElement } => !!s.el);

    const update = () => {
      let current: ChapterTheme = "light";
      for (const s of sections) {
        const r = s.el.getBoundingClientRect();
        if (r.top <= PROBE && r.bottom > PROBE) {
          current = s.theme;
          break;
        }
      }
      setTheme((prev) => (prev === current ? prev : current));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return theme;
}
