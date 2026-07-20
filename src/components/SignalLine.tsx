import { useRef, type RefObject } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "../lib/gsap";
import { MOTION, reduceMotion } from "../lib/motion";
import { measurePath } from "../lib/pathMetrics";

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
  /** Curva do desenho: "power1.in" arranca devagar e se expande. */
  ease?: string;
  /** Duração do desenho quando draw="load". */
  duration?: number;
  delay?: number;
  /** Vídeo ao qual o desenho se acopla: o fio avança no tempo da mídia. */
  syncTo?: RefObject<HTMLVideoElement | null>;
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
  ease = "none",
  duration = 1.7,
  delay = 0.3,
  syncTo,
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

      const { length } = measurePath(line.current);
      gsap.set(line.current, {
        strokeDasharray: length,
        strokeDashoffset: length,
      });
      if (draw === "load") {
        const media = syncTo?.current;
        if (!media) {
          gsap.to(line.current, {
            strokeDashoffset: 0,
            duration,
            delay,
            ease: ease === "none" ? "power2.inOut" : ease,
          });
          return;
        }

        // Acoplado ao vídeo: o fio avança no relógio da mídia e termina no mesmo
        // instante que a linha reta desenhada sobre ela.
        const tween = gsap.to(line.current, {
          strokeDashoffset: 0,
          duration,
          ease: ease === "none" ? "sine.inOut" : ease,
          paused: true,
        });

        const sync = () => {
          if (Math.abs(tween.time() - media.currentTime) > MOTION.heroSignal.maxDrift) {
            tween.time(Math.min(media.currentTime, duration));
          }
        };
        const onPlaying = () => {
          tween.time(Math.min(media.currentTime, duration)).play();
        };
        const onPause = () => {
          if (!media.ended) tween.pause();
        };
        const onEnded = () => tween.progress(1);

        // Se o autoplay for barrado, o fio desenha sozinho em vez de ficar parado.
        const fallback = window.setTimeout(() => {
          if (media.paused && tween.paused()) tween.play();
        }, 1500);

        media.addEventListener("playing", onPlaying);
        media.addEventListener("pause", onPause);
        media.addEventListener("seeking", sync);
        media.addEventListener("timeupdate", sync);
        media.addEventListener("ended", onEnded);
        if (!media.paused) onPlaying();

        return () => {
          window.clearTimeout(fallback);
          media.removeEventListener("playing", onPlaying);
          media.removeEventListener("pause", onPause);
          media.removeEventListener("seeking", sync);
          media.removeEventListener("timeupdate", sync);
          media.removeEventListener("ended", onEnded);
          tween.kill();
        };
      }

      gsap.to(line.current, {
        strokeDashoffset: 0,
        ease,
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
