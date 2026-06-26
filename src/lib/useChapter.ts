import { useGSAP } from "@gsap/react";
import type { RefObject } from "react";
import { gsap, ScrollTrigger } from "./gsap";
import { MOTION, reduceMotion } from "./motion";

type ChapterOptions = {
  /** ScrollTrigger start for the reveal batches. Default "top 84%". */
  start?: string;
};

/**
 * Turns a section into a coordinated "chapter".
 *
 * Markup contract (only attributes — no structural changes required):
 *  - `data-reveal`   → joins the reveal system. Elements that scroll into view
 *                      together are revealed as one staggered group (via
 *                      ScrollTrigger.batch), so a heading leads and its cards
 *                      follow as a scene — never random, never too early.
 *  - `data-parallax` → drifts subtly on transform as the section passes.
 *                      Optional numeric value scales intensity
 *                      (e.g. data-parallax="1.6"). Desktop only.
 *
 * Transform/opacity only, split desktop/mobile via gsap.matchMedia, and
 * self-cleaning through useGSAP's context + mm.revert(). Under
 * prefers-reduced-motion the content is simply left visible.
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

      if (reduceMotion()) {
        gsap.set(reveals, { clearProps: "all", opacity: 1, y: 0 });
        return;
      }

      const mm = gsap.matchMedia();

      mm.add({ isDesktop: MOTION.desktop, isMobile: MOTION.mobile }, (ctx) => {
        const { isMobile } = ctx.conditions as {
          isDesktop: boolean;
          isMobile: boolean;
        };
        const y = isMobile ? MOTION.revealYMobile : MOTION.revealY;
        const stagger = isMobile ? MOTION.staggerMobile : MOTION.stagger;

        if (reveals.length) {
          gsap.set(reveals, { opacity: 0, y });
          ScrollTrigger.batch(reveals, {
            start: options.start ?? "top 84%",
            onEnter: (batch) =>
              gsap.to(batch, {
                opacity: 1,
                y: 0,
                duration: MOTION.duration,
                ease: MOTION.ease,
                stagger,
                overwrite: true,
              }),
          });
        }

        // Parallax: desktop only, whisper-subtle.
        if (!isMobile) {
          gsap.utils
            .toArray<HTMLElement>("[data-parallax]", root)
            .forEach((el) => {
              const factor = parseFloat(el.getAttribute("data-parallax") || "1") || 1;
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
      });

      return () => mm.revert();
    },
    { scope },
  );
}
