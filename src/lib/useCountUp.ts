import { useGSAP } from "@gsap/react";
import type { RefObject } from "react";
import { gsap, ScrollTrigger } from "./gsap";
import { MOTION, reduceMotion } from "./motion";

type CountOptions = {
  /** Format the running value into the text shown. Default: rounded integer. */
  format?: (value: number) => string;
};

/**
 * Counts an element's text from 0 up to `end` when it scrolls into view (once).
 * Animates a plain object and writes `textContent` each frame — no React state,
 * no re-renders. Under prefers-reduced-motion the final value is set instantly.
 */
export function useCountUp(
  ref: RefObject<HTMLElement | null>,
  end: number,
  options: CountOptions = {},
) {
  const format = options.format ?? ((v: number) => Math.round(v).toLocaleString("pt-BR"));

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      if (reduceMotion()) {
        el.textContent = format(end);
        return;
      }

      const obj = { v: 0 };
      el.textContent = format(0);

      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        once: true,
        onEnter: () =>
          gsap.to(obj, {
            v: end,
            duration: MOTION.countDuration,
            ease: MOTION.countEase,
            onUpdate: () => {
              el.textContent = format(obj.v);
            },
          }),
      });
    },
    { scope: ref, dependencies: [end] },
  );
}
