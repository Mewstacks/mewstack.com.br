import { useEffect, useRef } from "react";
import { MOTION, reduceMotion } from "../lib/motion";
import { HERO_SIGNAL_MEDIA } from "../lib/signalJourney";

const { viewWidth, viewHeight, yLeft, yRight } = HERO_SIGNAL_MEDIA;

/**
 * Inner stroke across the media plate.
 * Entry/exit Y are locked to HERO_SIGNAL_MEDIA so outer join/exit stay flush.
 * Mid-path dips gently (~5–6°) so scroll progress reads as vertical motion —
 * never a long flat lateral crawl (keep flat runs ≤ ~25% of viewWidth).
 */
const FINAL_PATH = [
  `M0 ${yLeft}`,
  `C130 ${yLeft} 210 356 300 370`,
  "C400 386 500 408 620 412",
  "C740 416 840 386 960 358",
  `C1060 346 1140 ${yRight} 1200 ${yRight}`,
].join(" ");

const GUIDE_PATHS = [
  "M-60 246 C180 246 340 278 520 318 C730 352 930 360 1260 348",
  "M-60 450 C180 450 340 430 520 410 C730 398 930 372 1260 350",
] as const;

const COLLECTOR_DOTS = [
  { x: 105, y: 345, targetY: 352, radius: 2.4 },
  { x: 195, y: 292, targetY: 360, radius: 2.1 },
  { x: 290, y: 410, targetY: 368, radius: 2.8 },
  { x: 390, y: 280, targetY: 384, radius: 2.2 },
  { x: 500, y: 400, targetY: 402, radius: 2.5 },
  { x: 615, y: 305, targetY: 412, radius: 2.1 },
  { x: 720, y: 415, targetY: 410, radius: 2.9 },
  { x: 835, y: 300, targetY: 386, radius: 2.2 },
  { x: 945, y: 395, targetY: 360, radius: 2.6 },
  { x: 1060, y: 315, targetY: 346, radius: 2.1 },
  { x: 1150, y: 380, targetY: 344, radius: 2.5 },
] as const;

/**
 * Presentation and media loading only. SignalScene owns the single scroll
 * timeline that drives this SVG, the outside connector and video seeking.
 */
const HERO_VIDEO = "/media/hero-signal.mp4";

export default function HeroSignalMedia() {
  const root = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const reduce = reduceMotion();

  useEffect(() => {
    const container = root.current;
    const media = video.current;
    if (reduce || !container || !media) return;

    // The source is attached here rather than in the markup. With src set up
    // front, `preload="metadata"` starts a fetch and the load() below restarts
    // it from byte zero — the 3.5 MB file came down twice (measured: 7.2 MB of
    // video on a single page load).
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        if (!media.src) {
          media.src = HERO_VIDEO;
          media.preload = "auto";
          media.load();
        }
        observer.disconnect();
      },
      { rootMargin: "100% 0px" },
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, [reduce]);

  return (
    <div
      ref={root}
      data-signal-anchor="hero-media"
      role="img"
      aria-label="Duas linhas-guia recolhem pontos dispersos e os organizam em uma única linha."
      className="relative h-full w-full overflow-hidden bg-night"
    >
      {reduce ? (
        <img
          data-hero-signal-poster
          src="/media/hero-signal-poster.webp"
          width={1200}
          height={675}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
          draggable={false}
        />
      ) : (
        <video
          ref={video}
          data-hero-signal-video
          poster="/media/hero-signal-poster.webp"
          className="h-full w-full object-cover"
          muted
          playsInline
          preload="none"
          aria-hidden="true"
          draggable={false}
        />
      )}

      <svg
        aria-hidden
        viewBox={`0 0 ${viewWidth} ${viewHeight}`}
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        <rect
          data-hero-signal-veil
          x="0"
          y="0"
          width={viewWidth}
          height={viewHeight}
          fill="var(--color-night)"
          opacity={reduce ? MOTION.heroSignal.veilOpacity : 0}
        />
        {GUIDE_PATHS.map((path) => (
          <path
            key={path}
            data-hero-signal-guide
            d={path}
            fill="none"
            stroke="var(--color-dusk)"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="1400"
            strokeDashoffset={reduce ? 0 : 1400}
            opacity={reduce ? 0 : MOTION.heroSignal.guideOpacity}
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {COLLECTOR_DOTS.map((dot) => (
          <circle
            key={`${dot.x}-${dot.y}`}
            data-hero-signal-dot
            data-start-x={dot.x}
            data-start-y={dot.y}
            data-target-y={dot.targetY}
            cx={dot.x}
            cy={dot.y}
            r={dot.radius}
            fill="var(--color-paper-on-night-soft)"
            opacity={reduce ? 0 : MOTION.heroSignal.dotOpacity}
          />
        ))}
        <path
          data-hero-signal-line
          d={FINAL_PATH}
          fill="none"
          stroke="var(--color-signal)"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={reduce ? undefined : 1400}
          strokeDashoffset={reduce ? 0 : 1400}
          opacity="0.8"
          vectorEffect="non-scaling-stroke"
        />
        <path
          data-hero-signal-flow
          d={FINAL_PATH}
          fill="none"
          stroke="var(--color-signal)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`1 ${MOTION.heroSignal.flowSpacing}`}
          opacity={reduce ? MOTION.heroSignal.flowOpacity : 0}
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div className="grain pointer-events-none absolute inset-0 opacity-[0.035]" />
    </div>
  );
}
