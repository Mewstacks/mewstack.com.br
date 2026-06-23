import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

type CountUpProps = {
  to: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  decimals?: number;
  className?: string;
};

/** Counts from 0 to `to` once it scrolls into view. Respects reduced motion. */
export default function CountUp({
  to,
  suffix = "",
  prefix = "",
  duration = 1600,
  decimals = 0,
  className,
}: CountUpProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(reduce ? to : 0);

  useEffect(() => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let started = false;

    const run = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 4);
        setValue(to * eased);
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started) {
          started = true;
          run();
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to, duration, reduce]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}
