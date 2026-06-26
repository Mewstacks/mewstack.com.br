import { useGSAP } from "@gsap/react";
import type { RefObject } from "react";
import { gsap, ScrollTrigger } from "./gsap";
import { MOTION, reduceMotion } from "./motion";

type ChapterOptions = {
  /** ScrollTrigger start for the reveal batches. Default "top 82%". */
  start?: string;
  /** Whether the section recedes (lift/scale/fade) as it leaves. Default true. */
  exit?: boolean;
};

/**
 * Turns a section into a coordinated, cinematic "chapter" with a full
 * enter → hold → exit arc.
 *
 * Markup contract (attributes only — no structural changes required):
 *  - `data-reveal-title` → mask reveal (clip-path sweep + rise), leads the scene.
 *  - `data-reveal`       → joins the staggered enter (opacity + rise + scale).
 *                          Items that scroll in together are revealed as a group
 *                          (ScrollTrigger.batch) — never random, never too early.
 *  - `data-parallax`     → drifts on transform as the section passes. Optional
 *                          numeric value scales intensity (e.g. data-parallax="1.6").
 *
 * Exit: the whole section lifts, scales down and dims as it leaves the top,
 * so the next chapter "takes over" with overlap (crossfade-ish depth).
 *
 * Transform/opacity (+ one-shot clip-path on titles) only, split desktop/mobile
 * via gsap.matchMedia, self-cleaning through useGSAP + mm.revert(). Under
 * prefers-reduced-motion everything is simply left visible.
 */
export function useChapter(
  scope: RefObject<HTMLElement | null>,
  options: ChapterOptions = {},
) {
  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      const titles = gsap.utils.toArray<HTMLElement>("[data-reveal-title]", root);
      const reveals = gsap.utils.toArray<HTMLElement>("[data-reveal]", root);

      if (reduceMotion()) {
        gsap.set([...titles, ...reveals], { clearProps: "all", opacity: 1, y: 0 });
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
        const start = options.start ?? "top 82%";

        // Titles — mask reveal (clip sweep + rise).
        if (titles.length) {
          gsap.set(titles, {
            clipPath: "inset(0 0 100% 0)",
            y: y * 0.55,
            opacity: 1,
          });
          ScrollTrigger.batch(titles, {
            start,
            onEnter: (batch) =>
              gsap.to(batch, {
                clipPath: "inset(0 0 0% 0)",
                y: 0,
                duration: MOTION.duration + 0.15,
                ease: MOTION.easeTitle,
                stagger,
                overwrite: true,
              }),
          });
        }

        // Other content — staggered rise + scale.
        if (reveals.length) {
          gsap.set(reveals, { opacity: 0, y, scale: MOTION.revealScale });
          ScrollTrigger.batch(reveals, {
            start,
            onEnter: (batch) =>
              gsap.to(batch, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: MOTION.duration,
                ease: MOTION.ease,
                stagger,
                overwrite: true,
              }),
          });
        }

        // Desktop-only depth: parallax layers + section exit.
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

          // Exit: the chapter recedes as the next one takes the screen.
          if (options.exit !== false) {
            gsap.to(root, {
              yPercent: MOTION.exitY,
              scale: MOTION.exitScale,
              opacity: MOTION.exitOpacity,
              ease: "none",
              scrollTrigger: {
                trigger: root,
                start: "bottom 65%",
                end: "bottom top",
                scrub: true,
              },
            });
          }
        }
      });

      return () => mm.revert();
    },
    { scope },
  );
}
