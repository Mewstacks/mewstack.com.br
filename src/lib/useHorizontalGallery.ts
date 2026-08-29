import { useGSAP } from "@gsap/react";
import type { RefObject } from "react";
import { gsap } from "./gsap";
import { MOTION, reduceMotion } from "./motion";

/**
 * Turns vertical scroll into horizontal travel across a track (desktop only).
 *
 * The section pins to the viewport and the `track` slides from 0 to
 * `-(scrollWidth - clientWidth)` as the user scrolls.
 * pinSpacing keeps the document height intact so anchors still resolve, and
 * `invalidateOnRefresh` re-measures the distance on resize / late asset load.
 *
 * Mobile and prefers-reduced-motion get NO pin — the markup falls back to a
 * native `scroll-snap` carousel (see `.h-snap` in index.css), so the content is
 * always reachable without scroll hijacking.
 *
 * @param sectionRef  the section to pin.
 * @param trackRef    the flex row that translates horizontally.
 * @param progressRef optional element whose scaleX mirrors track progress.
 */
export function useHorizontalGallery(
  sectionRef: RefObject<HTMLElement | null>,
  trackRef: RefObject<HTMLElement | null>,
  progressRef?: RefObject<HTMLElement | null>,
) {
  useGSAP(
    () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;
      if (reduceMotion()) return; // native CSS scroll-snap handles it

      const mm = gsap.matchMedia();

      mm.add(MOTION.desktop, () => {
        const distance = () => Math.max(0, track.scrollWidth - section.clientWidth);

        gsap.set(track, { willChange: "transform" });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => "+=" + Math.round(distance()),
            scrub: MOTION.horizontalScrub,
            pin: true,
            pinSpacing: true,
            // Pin by translating instead of switching to position: fixed.
            // Nothing moves on screen either way, but Chrome's layout
            // instability API counts the relative -> fixed swap as the element
            // travelling a full viewport, which alone put CLS at ~1.99 on this
            // page. Transform pinning is invisible to that metric.
            pinType: "transform",
            refreshPriority: 0,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (progressRef?.current) {
                progressRef.current.style.transform = `scaleX(${self.progress || 0})`;
              }
            },
          },
        });
        tl.to(track, { x: () => -distance(), ease: "none", duration: 1 });

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );
}
