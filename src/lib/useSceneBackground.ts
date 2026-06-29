import { useGSAP } from "@gsap/react";
import { gsap } from "./gsap";
import { MOTION, reduceMotion } from "./motion";
import { CHAPTERS } from "./chapters";

/**
 * Reactive page background — the global tone crossfades cream↔charcoal as the
 * chapter occupying the viewport center changes theme (see `chapters.ts`), so
 * the scroll reads as one continuous story instead of a stack of boxes.
 *
 * Drives the OPACITY of a stacked charcoal layer over a cream base
 * (`[data-scene-overlay]`, rendered by `SceneBackground`) — GPU-cheap, never
 * `background-color` (which repaints). Dark chapters still carry their own solid
 * background, so text contrast is always correct; the overlay smooths the seams
 * and fills behind transparent light chapters.
 *
 * Geometry recomputed from getBoundingClientRect on each scroll (same robust
 * approach as the nav's theme probe) — immune to pin/anchor-jump refresh
 * ordering, which made an onToggle-per-trigger version stick. Under
 * prefers-reduced-motion there's no crossfade; the overlay stays clear.
 */
export function useSceneBackground() {
  useGSAP(() => {
    const overlay = document.querySelector<HTMLElement>("[data-scene-overlay]");
    if (!overlay) return;

    const sections = CHAPTERS.map((c) => ({
      dark: c.theme === "dark",
      el: document.getElementById(c.id),
    })).filter((s): s is { dark: boolean; el: HTMLElement } => !!s.el);
    if (!sections.length) return;

    if (reduceMotion()) {
      gsap.set(overlay, { opacity: 0 });
      return;
    }

    const fade = gsap.quickTo(overlay, "opacity", {
      duration: MOTION.bgFade,
      ease: MOTION.bgEase,
    });

    let last = -1;
    const update = () => {
      const probe = window.innerHeight * 0.5; // viewport center = dominant chapter
      let dark = false;
      for (const s of sections) {
        const r = s.el.getBoundingClientRect();
        if (r.top <= probe && r.bottom > probe) {
          dark = s.dark;
          break;
        }
      }
      const target = dark ? 1 : 0;
      if (target !== last) {
        last = target;
        fade(target);
      }
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
}
