import { useGSAP } from "@gsap/react";
import type { RefObject } from "react";
import { gsap } from "./gsap";
import { MOTION, reduceMotion } from "./motion";

type ChapterOptions = {
  /** ScrollTrigger start for the entrance timeline. Default "top 78%". */
  start?: string;
  /** Extra delay (s) before the entrance timeline begins. */
  delay?: number;
};

/**
 * Turns a section into a coordinated "chapter".
 *
 * Markup contract (no structural changes needed beyond attributes):
 *  - `data-reveal`   → element joins the entrance timeline, revealed in DOM
 *                      order with a stagger (eyebrow → title → text → cards).
 *  - `data-parallax` → element drifts subtly on transform as the section
 *                      passes (optional numeric value scales the intensity,
 *                      e.g. data-parallax="1.6"). Desktop only.
 *
 * Everything is transform/opacity only, plays once, is split desktop/mobile via
 * gsap.matchMedia, and self-cleans through useGSAP's context + mm.revert().
 * Under prefers-reduced-motion the content is simply left visible.
 */
export function useChapter(
  scope: RefObject<HTMLElement | null>,
  options: ChapterOptions = {},
) {
  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      const reveals = gsap.utils.toArray<HTMLElement>("[data-reveal]", root);

      // Reduced motion: ensure nothing is left hidden, do not animate.
      if (reduceMotion()) {
        gsap.set(reveals, { clearProps: "all", opacity: 1, y: 0 });
        return;
      }

      const mm = gsap.matchMedia();

      mm.add(
        { isDesktop: MOTION.desktop, isMobile: MOTION.mobile },
        (ctx) => {
          const { isMobile } = ctx.conditions as {
            isDesktop: boolean;
            isMobile: boolean;
          };

          if (reveals.length) {
            gsap.from(reveals, {
              opacity: 0,
              y: isMobile ? MOTION.revealYMobile : MOTION.revealY,
              duration: MOTION.duration,
              ease: MOTION.ease,
              delay: options.delay ?? 0,
              stagger: isMobile ? MOTION.staggerMobile : MOTION.stagger,
              scrollTrigger: {
                trigger: root,
                start: options.start ?? "top 78%",
                once: true,
              },
            });
          }

          // Parallax: desktop only, kept whisper-subtle.
          if (!isMobile) {
            gsap.utils
              .toArray<HTMLElement>("[data-parallax]", root)
              .forEach((el) => {
                const factor =
                  parseFloat(el.getAttribute("data-parallax") || "1") || 1;
                const range = MOTION.parallaxRange * factor;
                gsap.fromTo(
                  el,
                  { yPercent: range },
                  {
                    yPercent: -range,
                    ease: "none",
                    scrollTrigger: {
                      trigger: el,
                      start: "top bottom",
                      end: "bottom top",
                      scrub: true,
                    },
                  },
                );
              });
          }
        },
      );

      return () => mm.revert();
    },
    { scope },
  );
}
