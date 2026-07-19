import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "../lib/gsap";
import { MOTION, reduceMotion } from "../lib/motion";

const FINAL_PATH =
  "M-40 347 C160 347 270 317 430 325 C590 333 700 371 850 354 C995 337 1085 334 1240 344";

const GUIDE_PATHS = [
  "M-60 246 C180 246 340 270 520 292 C730 318 930 326 1260 326",
  "M-60 450 C180 450 340 421 520 395 C730 368 930 360 1260 360",
] as const;

const COLLECTOR_DOTS = [
  { x: 105, y: 345, targetY: 346, radius: 2.4 },
  { x: 195, y: 292, targetY: 341, radius: 2.1 },
  { x: 290, y: 410, targetY: 332, radius: 2.8 },
  { x: 390, y: 280, targetY: 324, radius: 2.2 },
  { x: 500, y: 400, targetY: 330, radius: 2.5 },
  { x: 615, y: 305, targetY: 344, radius: 2.1 },
  { x: 720, y: 415, targetY: 360, radius: 2.9 },
  { x: 835, y: 300, targetY: 356, radius: 2.2 },
  { x: 945, y: 395, targetY: 347, radius: 2.6 },
  { x: 1060, y: 315, targetY: 339, radius: 2.1 },
  { x: 1150, y: 380, targetY: 342, radius: 2.5 },
] as const;

export default function HeroSignalMedia() {
  const root = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const veil = useRef<SVGRectElement>(null);
  const line = useRef<SVGPathElement>(null);
  const flow = useRef<SVGPathElement>(null);
  const reduce = reduceMotion();

  useGSAP(
    () => {
      const media = video.current;
      const charcoal = veil.current;
      const finalLine = line.current;
      const flowDots = flow.current;
      const guides = gsap.utils.toArray<SVGPathElement>("[data-guide]", root.current);
      const collectorDots = gsap.utils.toArray<SVGCircleElement>(
        "[data-collector-dot]",
        root.current,
      );
      if (!media || !charcoal || !finalLine || !flowDots || guides.length !== 2) {
        return;
      }

      const length = finalLine.getTotalLength();

      if (reduce) {
        media.pause();
        gsap.set(charcoal, { opacity: MOTION.heroSignal.veilOpacity });
        gsap.set(guides, { opacity: 0 });
        gsap.set(collectorDots, { opacity: 0 });
        gsap.set(finalLine, {
          strokeDasharray: "none",
          strokeDashoffset: 0,
        });
        gsap.set(flowDots, { opacity: MOTION.heroSignal.flowOpacity });
        return;
      }

      gsap.set(charcoal, { opacity: 0 });
      guides.forEach((guide) => {
        const guideLength = guide.getTotalLength();
        gsap.set(guide, {
          opacity: MOTION.heroSignal.guideOpacity,
          strokeDasharray: guideLength,
          strokeDashoffset: guideLength,
        });
      });
      gsap.set(collectorDots, { opacity: MOTION.heroSignal.dotOpacity });
      gsap.set(finalLine, {
        strokeDasharray: length,
        strokeDashoffset: length,
      });
      gsap.set(flowDots, { opacity: 0, strokeDashoffset: 0 });

      const flowTween = gsap.to(flowDots, {
        strokeDashoffset: -(MOTION.heroSignal.flowSpacing + 1),
        duration: MOTION.heroSignal.flowDuration,
        ease: "none",
        repeat: -1,
        paused: true,
      });
      const sequence = gsap.timeline({ paused: true });
      const guideEnd =
        MOTION.heroSignal.guideStart + MOTION.heroSignal.guideDuration;
      const lineEnd = MOTION.heroSignal.lineStart + MOTION.heroSignal.lineDuration;

      sequence
        .to(
          charcoal,
          {
            opacity: MOTION.heroSignal.veilOpacity,
            duration: MOTION.heroSignal.veilDuration,
            ease: MOTION.heroSignal.ease,
          },
          MOTION.heroSignal.veilStart,
        )
        .to(
          guides,
          {
            strokeDashoffset: 0,
            duration: MOTION.heroSignal.guideDuration,
            ease: MOTION.heroSignal.ease,
          },
          MOTION.heroSignal.guideStart,
        )
        .to(
          guides,
          {
            opacity: 0,
            duration: MOTION.heroSignal.guideFadeDuration,
            ease: MOTION.heroSignal.ease,
          },
          guideEnd,
        )
        .to(
          finalLine,
          {
            strokeDashoffset: 0,
            duration: MOTION.heroSignal.lineDuration,
            ease: MOTION.heroSignal.ease,
          },
          MOTION.heroSignal.lineStart,
        )
        .set(flowDots, { opacity: MOTION.heroSignal.flowOpacity }, lineEnd)
        .call(() => flowTween.play(0), [], lineEnd);

      collectorDots.forEach((dot, index) => {
        const config = COLLECTOR_DOTS[index];
        if (!config) return;

        const progress = config.x / 1200;
        const guideArrival =
          MOTION.heroSignal.guideStart + progress * MOTION.heroSignal.guideDuration;
        const lineArrival =
          MOTION.heroSignal.lineStart + progress * MOTION.heroSignal.lineDuration;
        const collectAt = guideArrival - MOTION.heroSignal.dotAnticipation;
        const collectDuration = Math.max(
          MOTION.heroSignal.dotMinDuration,
          lineArrival - collectAt,
        );

        sequence
          .to(
            dot,
            {
              attr: { cx: config.x + MOTION.heroSignal.dotTravelX, cy: config.targetY },
              duration: collectDuration,
              ease: MOTION.heroSignal.ease,
            },
            collectAt,
          )
          .to(
            dot,
            {
              opacity: 0,
              duration: MOTION.heroSignal.dotFadeDuration,
              ease: MOTION.heroSignal.ease,
            },
            lineArrival - MOTION.heroSignal.dotFadeDuration,
          );
      });

      const sync = () => {
        if (Math.abs(sequence.time() - media.currentTime) > MOTION.heroSignal.maxDrift) {
          sequence.time(media.currentTime, false);
        }
      };
      const onPlaying = () => {
        sequence.time(media.currentTime, false).play();
        if (media.currentTime >= lineEnd) flowTween.play();
      };
      const onPause = () => {
        sequence.pause();
        if (!media.ended) flowTween.pause();
      };
      const onEnded = () => {
        sequence.progress(1, false);
        flowTween.play();
      };

      media.addEventListener("playing", onPlaying);
      media.addEventListener("pause", onPause);
      media.addEventListener("seeking", sync);
      media.addEventListener("timeupdate", sync);
      media.addEventListener("ended", onEnded);

      if (!media.paused) onPlaying();

      return () => {
        media.removeEventListener("playing", onPlaying);
        media.removeEventListener("pause", onPause);
        media.removeEventListener("seeking", sync);
        media.removeEventListener("timeupdate", sync);
        media.removeEventListener("ended", onEnded);
        sequence.kill();
        flowTween.kill();
      };
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      role="img"
      aria-label="Duas linhas-guia recolhem pontos dispersos e os organizam em uma única linha."
      className="relative h-full w-full overflow-hidden bg-night"
    >
      <video
        ref={video}
        src="/media/hero-signal.mp4"
        poster="/media/hero-signal-poster.jpg"
        className="h-full w-full object-cover"
        muted
        playsInline
        autoPlay={!reduce}
        preload="auto"
        aria-hidden="true"
        draggable={false}
      />

      <svg
        aria-hidden
        viewBox="0 0 1200 675"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        <rect
          ref={veil}
          x="0"
          y="0"
          width="1200"
          height="675"
          fill="var(--color-night)"
          opacity={reduce ? MOTION.heroSignal.veilOpacity : 0}
        />
        {GUIDE_PATHS.map((path) => (
          <path
            key={path}
            data-guide
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
            data-collector-dot
            data-target-y={dot.targetY}
            cx={dot.x}
            cy={dot.y}
            r={dot.radius}
            fill="var(--color-paper-on-night-soft)"
            opacity={reduce ? 0 : MOTION.heroSignal.dotOpacity}
          />
        ))}
        <path
          ref={line}
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
          ref={flow}
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
