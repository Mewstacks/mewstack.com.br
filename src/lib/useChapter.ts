import { useGSAP } from "@gsap/react";
import type { RefObject } from "react";
import { gsap, ScrollTrigger, SplitText } from "./gsap";
import { MOTION, reduceMotion } from "./motion";
import type { SceneVariant } from "./motion";

type ChapterOptions = {
  /** ScrollTrigger start for the reveal batches. Default "top 82%". */
  start?: string;
  /** Whether the section rises into focus ("from behind") as it arrives. Default true. */
  enter?: boolean;
  /** Whether the section recedes (lift/scale/fade/defocus) as it leaves. Default true. */
  exit?: boolean;
  /**
   * Scene-exit shape played as the next chapter takes over (desktop only):
   *  - "recede"       → the whole section lifts/scales/dims/defocuses (default).
   *  - "scaleHandoff" → a `[data-handoff]` element scales up and fades while the
   *                     section recedes more gently — the mockup "becomes" the
   *                     background of the next chapter. Falls back to recede if no
   *                     `[data-handoff]` is present.
   *  - "wipe"         → a `[data-wipe]` overlay sweeps across the seam via
   *                     clip-path. Falls back to recede if no `[data-wipe]`.
   */
  variant?: SceneVariant;
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
        const lineStagger = isMobile ? MOTION.lineStaggerMobile : MOTION.lineStagger;
        // Title leads; content follows a beat later (a chapter assembles itself,
        // heading → body, instead of popping all at once). options.start, when
        // given, overrides the content start.
        const titleStart = MOTION.revealTitleStart;
        const contentStart = options.start ?? MOTION.revealContentStart;

        // Titles — editorial reveal LINE BY LINE: SplitText wraps each line in a
        // clip mask and the lines rise in sequence, so the heading "writes
        // itself" instead of fading as a block. Text stays in the DOM (SEO/a11y),
        // and autoSplit re-splits on resize / late font load. Gradient-clipped
        // titles can't survive line-splitting, so those fall back to a single
        // block mask reveal.
        const splits: SplitText[] = [];
        titles.forEach((title) => {
          const cs = getComputedStyle(title);
          const clipped =
            (cs.webkitBackgroundClip || cs.backgroundClip) === "text";

          if (clipped) {
            gsap.set(title, { clipPath: "inset(0 0 100% 0)", y: y * 0.55, opacity: 1 });
            ScrollTrigger.create({
              trigger: title,
              start: titleStart,
              once: true,
              onEnter: () =>
                gsap.to(title, {
                  clipPath: "inset(0 0 0% 0)",
                  y: 0,
                  duration: MOTION.duration + 0.15,
                  ease: MOTION.easeTitle,
                  overwrite: true,
                }),
            });
            return;
          }

          splits.push(
            SplitText.create(title, {
              type: "lines",
              mask: "lines",
              autoSplit: true,
              onSplit: (self) =>
                gsap.from(self.lines, {
                  yPercent: 110,
                  duration: MOTION.lineDuration,
                  ease: MOTION.lineEase,
                  stagger: lineStagger,
                  scrollTrigger: { trigger: title, start: titleStart, once: true },
                }),
            }),
          );
        });

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
          const variant = options.variant ?? "recede";
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
            // Exit — the chosen scene variant. Each one is graceful: if its
            // marker element is missing, it degrades to the recede default so a
            // section can opt in by attribute alone.
            if (doExit) {
              tl.addLabel("exit");
              const handoff = variant === "scaleHandoff"
                ? root.querySelector<HTMLElement>("[data-handoff]")
                : null;
              const wipe = variant === "wipe"
                ? root.querySelector<HTMLElement>("[data-wipe]")
                : null;

              if (handoff) {
                // Mockup grows past the frame and dissolves while the section
                // recedes gently underneath — a depth hand-off to the next scene.
                // The root keeps its opacity (no dim): a charcoal "machine room"
                // dropping to 0.34 over the cream page reads as muddy grey, so the
                // depth here comes from scale + the handoff element fading, not a
                // see-through section.
                tl.to(
                  root,
                  {
                    yPercent: MOTION.exitY * 0.5,
                    scale: MOTION.exitScale,
                    duration: MOTION.exitWeight,
                  },
                  "exit",
                ).fromTo(
                  handoff,
                  { scale: 1 },
                  { scale: MOTION.handoffScale, opacity: 0, duration: MOTION.exitWeight },
                  "exit",
                );
              } else if (wipe) {
                // An overlay panel sweeps up across the seam (charcoal over
                // cream, etc.). The section itself stays put behind it.
                gsap.set(wipe, { clipPath: "inset(100% 0 0 0)" });
                tl.to(
                  wipe,
                  { clipPath: "inset(0% 0 0 0)", duration: MOTION.exitWeight },
                  "exit",
                );
              } else {
                tl.to(
                  root,
                  {
                    yPercent: MOTION.exitY,
                    scale: MOTION.exitScale,
                    opacity: MOTION.exitOpacity,
                    filter: `blur(${MOTION.exitBlur}px)`,
                    duration: MOTION.exitWeight,
                  },
                  "exit",
                );
              }
            }
          }
        }

        // Restore the original (un-split) title DOM when this media context tears
        // down (breakpoint change / unmount) — autoSplit handles re-splits.
        return () => splits.forEach((s) => s.revert());
      });

      return () => mm.revert();
    },
    { scope },
  );
}
