import { useGSAP } from "@gsap/react";
import type { RefObject } from "react";
import { gsap, ScrollTrigger } from "./gsap";
import { MOTION, reduceMotion } from "./motion";

type ChapterOptions = {
  /** ScrollTrigger start for the reveal batches. Default "top 82%". */
  start?: string;
  /** Whether the section rises into focus ("from behind") as it arrives. Default true. */
  enter?: boolean;
  /** Whether the section recedes (lift/scale/fade/defocus) as it leaves. Default true. */
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
        // Title leads; content follows a beat later (a chapter assembles itself,
        // heading → body, instead of popping all at once). options.start, when
        // given, overrides the content start.
        const titleStart = MOTION.revealTitleStart;
        const contentStart = options.start ?? MOTION.revealContentStart;

        // Titles — mask reveal (clip sweep + rise), leading the scene.
        if (titles.length) {
          gsap.set(titles, {
            clipPath: "inset(0 0 100% 0)",
            y: y * 0.55,
            opacity: 1,
          });
          ScrollTrigger.batch(titles, {
            start: titleStart,
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

        // Other content — staggered rise + scale, a beat behind the title.
        if (reveals.length) {
          gsap.set(reveals, { opacity: 0, y, scale: MOTION.revealScale });
          ScrollTrigger.batch(reveals, {
            start: contentStart,
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

          // Chapter handoff — ONE scrubbed timeline owns the section's own
          // transform across its whole pass: rise into focus (from behind, a
          // touch smaller) → hold the scene → recede (lift, scale down, dim,
          // defocus) so the next chapter takes over with overlap. Because a
          // single timeline drives the root, entrance and exit never fight
          // over the same properties. transformOrigin "center top" glues the
          // top edge to the previous chapter while it grows, so no background
          // sliver opens at the seam (matters for the charcoal Contact rising
          // over the light sections).
          const doEnter = options.enter !== false;
          const doExit = options.exit !== false;
          if (doEnter || doExit) {
            gsap.set(root, {
              transformOrigin: "center top",
              willChange: "transform",
            });
            const tl = gsap.timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: root,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            });

            if (doEnter) {
              tl.fromTo(
                root,
                { scale: MOTION.enterScale },
                { scale: 1, duration: MOTION.enterWeight },
              );
            }
            // Hold the scene at rest (no transform churn through the middle).
            tl.to(root, { duration: MOTION.holdWeight });
            if (doExit) {
              tl.to(root, {
                yPercent: MOTION.exitY,
                scale: MOTION.exitScale,
                opacity: MOTION.exitOpacity,
                filter: `blur(${MOTION.exitBlur}px)`,
                duration: MOTION.exitWeight,
              });
            }
          }
        }
      });

      return () => mm.revert();
    },
    { scope },
  );
}
