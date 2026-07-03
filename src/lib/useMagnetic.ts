import { useGSAP } from "@gsap/react";
import type { RefObject } from "react";
import { gsap } from "./gsap";
import { MOTION, reduceMotion } from "./motion";

type MagneticOptions = {
  /** Fraction of the pointer offset the element follows. Default MOTION.magneticStrength. */
  strength?: number;
  /** Hard cap (px) so the element never detaches from its slot. Default MOTION.magneticMax. */
  max?: number;
};

const clamp = (v: number, max: number) => Math.max(-max, Math.min(max, v));

/**
 * Magnetic hover: every element matching `selector` within `scope` drifts toward
 * the pointer and eases back on leave — a subtle premium microinteraction.
 *
 * Desktop + fine-pointer only (skipped on touch and under prefers-reduced-motion,
 * where a drifting target would be useless or unwanted). Uses gsap.quickTo for a
 * smooth, allocation-free follow; transform only.
 */
export function useMagnetic(
  scope: RefObject<HTMLElement | null>,
  selector: string,
  options: MagneticOptions = {},
) {
  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      if (reduceMotion()) return;
      if (!window.matchMedia("(pointer: fine) and (min-width: 768px)").matches) return;

      const strength = options.strength ?? MOTION.magneticStrength;
      const max = options.max ?? MOTION.magneticMax;
      const els = gsap.utils.toArray<HTMLElement>(selector, root);
      const cleanups: Array<() => void> = [];

      els.forEach((el) => {
        const xTo = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" });

        const onMove = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const dx = e.clientX - (r.left + r.width / 2);
          const dy = e.clientY - (r.top + r.height / 2);
          xTo(clamp(dx * strength, max));
          yTo(clamp(dy * strength, max));
        };
        const onLeave = () => {
          xTo(0);
          yTo(0);
        };

        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerleave", onLeave);
        cleanups.push(() => {
          el.removeEventListener("pointermove", onMove);
          el.removeEventListener("pointerleave", onLeave);
        });
      });

      return () => cleanups.forEach((fn) => fn());
    },
    { scope },
  );
}
