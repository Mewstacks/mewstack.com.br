import { useGSAP } from "@gsap/react";
import type { RefObject } from "react";
import { gsap, ScrollTrigger } from "./gsap";
import { MOTION, reduceMotion } from "./motion";

/**
 * Turns vertical scroll into horizontal travel across a track (desktop only).
 *
 * The section pins to the viewport and the `track` slides from 0 to
 * `-(scrollWidth - clientWidth)` as the user scrolls, snapping onto each card.
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
        const cards = track.children.length;
        const lead = MOTION.horizontalLead; // settle-in beat before the slide

        // Snap points in scroll-progress space: the slide doesn't begin until
        // `ps`, so each card sits at ps + (1-ps)·k/(cards-1) — keeps the snap
        // landing exactly on a card even with the lead-in hold in front.
        const ps = lead / (1 + lead);
        const snapPts =
          cards > 1
            ? Array.from({ length: cards }, (_, k) => ps + (1 - ps) * (k / (cards - 1)))
            : null;

        gsap.set(track, { willChange: "transform" });

        // A timeline so the track can HOLD at x:0 for the first `lead` of the
        // pass, then travel. Arriving at the pinned section therefore settles
        // for a beat instead of lurching sideways on the first scroll tick.
        // The travel still maps 1:1 to scroll (ease:none), so it feels direct.
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => "+=" + Math.round(distance() * (1 + lead)),
            scrub: MOTION.horizontalScrub,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            snap: snapPts
              ? {
                  snapTo: snapPts,
                  duration: { min: 0.2, max: MOTION.horizontalSnapDuration },
                  ease: "power2.inOut",
                  delay: 0.06,
                }
              : undefined,
            onUpdate: (self) => {
              if (progressRef?.current) {
                progressRef.current.style.transform = `scaleX(${self.progress || 0})`;
              }
            },
          },
        });
        tl.to(track, { x: () => -distance(), ease: "none", duration: 1 }, lead);

        // Distance depends on measured widths — recompute once layout settles.
        ScrollTrigger.refresh();

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
