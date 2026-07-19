import { useRef, type RefObject } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "../lib/gsap";
import { MOTION, reduceMotion } from "../lib/motion";

type SignalLineProps = {
  path: string;
  viewBox: string;
  className?: string;
  triggerRef?: RefObject<HTMLElement | null>;
  draw?: "load" | "scroll" | "static";
  strokeWidth?: number;
  scrub?: number | boolean;
  start?: string;
  end?: string;
};

export default function SignalLine({
  path,
  viewBox,
  className = "",
  triggerRef,
  draw = "scroll",
  strokeWidth = 1.5,
  scrub = MOTION.signal.scrub,
  start = MOTION.signal.start,
  end = MOTION.signal.end,
}: SignalLineProps) {
  const svg = useRef<SVGSVGElement>(null);
  const line = useRef<SVGPathElement>(null);

  useGSAP(
    () => {
      if (!line.current || draw === "static" || reduceMotion()) {
        if (line.current) {
          gsap.set(line.current, { strokeDasharray: "none", strokeDashoffset: 0 });
        }
        return;
      }

      const length = line.current.getTotalLength();
      gsap.set(line.current, {
        strokeDasharray: length,
        strokeDashoffset: length,
      });
      if (draw === "load") {
        gsap.to(line.current, {
          strokeDashoffset: 0,
          duration: 1.7,
          delay: 0.3,
          ease: "power2.inOut",
        });
        return;
      }

      gsap.to(line.current, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: triggerRef?.current ?? svg.current,
          start,
          end,
          scrub,
        },
      });
    },
    { scope: svg },
  );

  return (
    <svg
      ref={svg}
      aria-hidden
      viewBox={viewBox}
      preserveAspectRatio="none"
      className={className}
    >
      <path
        ref={line}
        d={path}
        fill="none"
        stroke="var(--color-signal)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
