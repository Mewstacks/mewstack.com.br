import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "../lib/gsap";
import { MOTION, reduceMotion } from "../lib/motion";

const FINAL_PATH =
  "M-40 347 C160 347 270 317 430 325 C590 333 700 371 850 354 C995 337 1085 334 1240 344";

export default function HeroSignalMedia() {
  const root = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const veil = useRef<SVGRectElement>(null);
  const scan = useRef<SVGRectElement>(null);
  const line = useRef<SVGPathElement>(null);
  const flow = useRef<SVGPathElement>(null);
  const reduce = reduceMotion();

  useGSAP(
    () => {
      const media = video.current;
      const charcoal = veil.current;
      const sweep = scan.current;
      const finalLine = line.current;
      const flowDots = flow.current;
      if (!media || !charcoal || !sweep || !finalLine || !flowDots) return;

      const length = finalLine.getTotalLength();

      if (reduce) {
        media.pause();
        gsap.set(charcoal, { attr: { width: 1200 } });
        gsap.set(sweep, { opacity: 0 });
        gsap.set(finalLine, {
          strokeDasharray: "none",
          strokeDashoffset: 0,
        });
        gsap.set(flowDots, { opacity: MOTION.heroSignal.flowOpacity });
        return;
      }

      gsap.set(charcoal, { attr: { width: 0 } });
      gsap.set(sweep, { attr: { x: -260 }, opacity: 0 });
      gsap.set(finalLine, {
        strokeDasharray: length,
        strokeDashoffset: length,
      });
      gsap.set(flowDots, { opacity: 0, strokeDashoffset: 0 });

      const flowTween = gsap.to(flowDots, {
        strokeDashoffset: -MOTION.heroSignal.flowSpacing,
        duration: MOTION.heroSignal.flowDuration,
        ease: "none",
        repeat: -1,
        paused: true,
      });

      const collectEnd =
        MOTION.heroSignal.collectStart + MOTION.heroSignal.collectDuration;
      const sequence = gsap.timeline({ paused: true });

      sequence
        .to(
          charcoal,
          {
            attr: { width: 1200 },
            duration: MOTION.heroSignal.collectDuration,
            ease: MOTION.heroSignal.collectEase,
          },
          MOTION.heroSignal.collectStart,
        )
        .fromTo(
          sweep,
          { attr: { x: -260 }, opacity: 0 },
          {
            attr: { x: 1200 },
            opacity: MOTION.heroSignal.scanOpacity,
            duration: MOTION.heroSignal.collectDuration,
            ease: MOTION.heroSignal.collectEase,
          },
          MOTION.heroSignal.collectStart,
        )
        .to(
          finalLine,
          {
            strokeDashoffset: 0,
            duration: MOTION.heroSignal.collectDuration,
            ease: MOTION.heroSignal.collectEase,
          },
          MOTION.heroSignal.collectStart,
        )
        .to(
          sweep,
          {
            opacity: 0,
            duration: MOTION.heroSignal.scanFade,
          },
          collectEnd - MOTION.heroSignal.scanFade,
        )
        .set(flowDots, { opacity: MOTION.heroSignal.flowOpacity }, collectEnd)
        .call(() => flowTween.play(0), [], collectEnd);

      const sync = () => {
        if (Math.abs(sequence.time() - media.currentTime) > MOTION.heroSignal.maxDrift) {
          sequence.time(media.currentTime, false);
        }
      };
      const onPlaying = () => {
        sequence.time(media.currentTime, false).play();
        if (media.currentTime >= collectEnd) flowTween.play();
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
      aria-label="Pontos operacionais dispersos convergem em uma única linha organizada."
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
        <defs>
          <linearGradient id="hero-signal-scan" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="var(--color-signal)" stopOpacity="0" />
            <stop offset="0.5" stopColor="var(--color-signal)" stopOpacity="0.34" />
            <stop offset="1" stopColor="var(--color-signal)" stopOpacity="0" />
          </linearGradient>
        </defs>

        <rect
          ref={veil}
          x="0"
          y="0"
          width={reduce ? 1200 : 0}
          height="675"
          fill="var(--color-night)"
          opacity="0.96"
        />
        <rect
          ref={scan}
          x="-260"
          y="0"
          width="260"
          height="675"
          fill="url(#hero-signal-scan)"
          opacity="0"
        />
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
          strokeWidth="4"
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
