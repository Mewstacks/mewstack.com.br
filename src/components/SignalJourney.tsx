import { useLayoutEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import SignalLine from "./SignalLine";
import { gsap, ScrollTrigger } from "../lib/gsap";
import { MOTION, reduceMotion } from "../lib/motion";
import { measurePath } from "../lib/pathMetrics";
import {
  SIGNAL_SEGMENT_SPECS,
  buildSignalSceneRoute,
  measureElementWithin,
  type BuiltSignalRoute,
  type SignalRouteAnchors,
  type SignalSceneId,
} from "../lib/signalJourney";

type LocalSignalScene = Exclude<SignalSceneId, "process">;

const sameRoute = (current: BuiltSignalRoute | null, next: BuiltSignalRoute) =>
  current?.path === next.path && current.viewBox === next.viewBox ? current : next;

const numberData = (element: HTMLElement | SVGElement, key: string) =>
  Number.parseFloat(element.getAttribute(key) ?? "0");

function setupStaticHero(section: HTMLElement, outerPath: SVGPathElement) {
  const veil = section.querySelector<SVGRectElement>("[data-hero-signal-veil]");
  const guides = gsap.utils.toArray<SVGPathElement>(
    "[data-hero-signal-guide]",
    section,
  );
  const dots = gsap.utils.toArray<SVGCircleElement>(
    "[data-hero-signal-dot]",
    section,
  );
  const innerLine = section.querySelector<SVGPathElement>("[data-hero-signal-line]");
  const flow = section.querySelector<SVGPathElement>("[data-hero-signal-flow]");

  gsap.set(outerPath, { strokeDasharray: "none", strokeDashoffset: 0, opacity: 1 });
  if (veil) gsap.set(veil, { opacity: MOTION.heroSignal.veilOpacity });
  gsap.set(guides, { opacity: 0 });
  gsap.set(dots, { opacity: 0 });
  if (innerLine) {
    gsap.set(innerLine, { strokeDasharray: "none", strokeDashoffset: 0, opacity: 0.8 });
  }
  if (flow) {
    gsap.set(flow, {
      opacity: MOTION.heroSignal.flowOpacity,
      strokeDashoffset: 0,
    });
  }
}

function createHeroTimeline(section: HTMLElement, outerPath: SVGPathElement) {
  const video = section.querySelector<HTMLVideoElement>("[data-hero-signal-video]");
  const veil = section.querySelector<SVGRectElement>("[data-hero-signal-veil]");
  const guides = gsap.utils.toArray<SVGPathElement>(
    "[data-hero-signal-guide]",
    section,
  );
  const dots = gsap.utils.toArray<SVGCircleElement>(
    "[data-hero-signal-dot]",
    section,
  );
  const innerLine = section.querySelector<SVGPathElement>("[data-hero-signal-line]");
  const flow = section.querySelector<SVGPathElement>("[data-hero-signal-flow]");
  if (!video || !veil || !innerLine || !flow || guides.length !== 2) return;

  const dial = MOTION.heroSignal;
  const outerLength = measurePath(outerPath).length;
  const innerLength = measurePath(innerLine).length;
  video.pause();

  gsap.set(outerPath, {
    strokeDasharray: outerLength,
    strokeDashoffset: outerLength * (1 - MOTION.signal.hero.initialDraw),
    opacity: 1,
  });
  gsap.set(veil, { opacity: 0 });
  guides.forEach((guide) => {
    const guideLength = measurePath(guide).length;
    gsap.set(guide, {
      opacity: dial.guideOpacity,
      strokeDasharray: guideLength,
      strokeDashoffset: guideLength,
    });
  });
  dots.forEach((dot) => {
    gsap.set(dot, {
      attr: {
        cx: numberData(dot, "data-start-x"),
        cy: numberData(dot, "data-start-y"),
      },
      opacity: dial.dotOpacity,
    });
  });
  gsap.set(innerLine, {
    strokeDasharray: innerLength,
    strokeDashoffset: innerLength,
    opacity: 0.8,
  });
  gsap.set(flow, { opacity: 0, strokeDashoffset: 0 });

  let pendingProgress = 0;
  let seekFrame = 0;
  const applySeek = () => {
    seekFrame = 0;
    if (video.readyState < 1 || !Number.isFinite(video.duration)) return;
    const mediaProgress = Math.max(
      0,
      Math.min(1, (pendingProgress - dial.handoffAt) / (1 - dial.handoffAt)),
    );
    const target = Math.min(video.duration, mediaProgress * video.duration);
    if (Math.abs(video.currentTime - target) >= dial.seekThreshold) {
      video.currentTime = target;
    }
  };
  const scheduleSeek = (progress: number) => {
    pendingProgress = progress;
    if (!seekFrame) seekFrame = window.requestAnimationFrame(applySeek);
  };

  const timeline = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      id: "signal:hero",
      trigger: section,
      start: MOTION.signal.hero.start,
      end: MOTION.signal.hero.end,
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => scheduleSeek(self.progress),
    },
  });

  timeline
    .to(
      outerPath,
      { strokeDashoffset: 0, duration: dial.handoffAt },
      0,
    )
    .to(
      veil,
      { opacity: dial.veilOpacity, duration: dial.veilSpan },
      dial.handoffAt,
    )
    .to(
      guides,
      { strokeDashoffset: 0, duration: dial.guideSpan },
      dial.handoffAt,
    )
    .to(
      innerLine,
      { strokeDashoffset: 0, duration: dial.lineSpan },
      dial.handoffAt,
    )
    .to(
      guides,
      { opacity: 0, duration: dial.guideFadeSpan },
      dial.guideFadeAt,
    )
    .to(
      flow,
      {
        opacity: dial.flowOpacity,
        strokeDashoffset: -(dial.flowSpacing + 1),
        duration: dial.flowSpan,
      },
      dial.flowAt,
    );

  dots.forEach((dot) => {
    const startX = numberData(dot, "data-start-x");
    const targetY = numberData(dot, "data-target-y");
    const collectAt = dial.handoffAt + (startX / 1200) * dial.dotWindow;

    timeline
      .to(
        dot,
        {
          attr: { cx: startX + dial.dotTravelX, cy: targetY },
          duration: dial.dotSpan,
          ease: "sine.inOut",
        },
        collectAt,
      )
      .to(
        dot,
        { opacity: 0, duration: dial.dotFadeSpan },
        collectAt + dial.dotSpan - dial.dotFadeSpan,
      );
  });

  const trigger = timeline.scrollTrigger;
  const onMetadata = () => scheduleSeek(trigger?.progress ?? 0);
  video.addEventListener("loadedmetadata", onMetadata);
  scheduleSeek(trigger?.progress ?? 0);

  return () => {
    window.cancelAnimationFrame(seekFrame);
    video.removeEventListener("loadedmetadata", onMetadata);
    video.pause();
    timeline.scrollTrigger?.kill();
    timeline.kill();
  };
}

export function SignalScene({ scene }: { scene: LocalSignalScene }) {
  const root = useRef<HTMLDivElement>(null);
  const line = useRef<SVGPathElement>(null);
  const [route, setRoute] = useState<BuiltSignalRoute | null>(null);

  useLayoutEffect(() => {
    const overlay = root.current;
    const section = overlay?.parentElement as HTMLElement | null;
    if (!overlay || !section) return;

    const spec = SIGNAL_SEGMENT_SPECS[scene];
    let frame = 0;
    const measure = () => {
      if (!section.offsetWidth || !section.offsetHeight) return;
      const anchors: SignalRouteAnchors = {};

      spec.anchors.forEach((anchorId) => {
        const anchor = section.querySelector<HTMLElement>(
          `[data-signal-anchor="${anchorId}"]`,
        );
        if (anchor) anchors[anchorId] = measureElementWithin(anchor, section);
      });

      const next = buildSignalSceneRoute(
        scene,
        section.offsetWidth,
        section.offsetHeight,
        anchors,
      );
      setRoute((current) => sameRoute(current, next));
    };
    const scheduleMeasure = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(measure);
    };

    measure();
    const observer = new ResizeObserver(scheduleMeasure);
    observer.observe(section);
    spec.anchors.forEach((anchorId) => {
      const anchor = section.querySelector<HTMLElement>(
        `[data-signal-anchor="${anchorId}"]`,
      );
      if (anchor) observer.observe(anchor);
    });
    window.addEventListener("resize", scheduleMeasure);
    ScrollTrigger.addEventListener("refresh", scheduleMeasure);
    void document.fonts.ready.then(scheduleMeasure);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", scheduleMeasure);
      ScrollTrigger.removeEventListener("refresh", scheduleMeasure);
    };
  }, [scene]);

  useLayoutEffect(() => {
    if (!route) return;
    const frame = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => window.cancelAnimationFrame(frame);
  }, [route]);

  useGSAP(
    () => {
      const overlay = root.current;
      const section = overlay?.parentElement as HTMLElement | null;
      const path = line.current;
      if (!overlay || !section || !path || !route) return;

      if (reduceMotion()) {
        if (scene === "hero") setupStaticHero(section, path);
        else {
          gsap.set(path, {
            strokeDasharray: "none",
            strokeDashoffset: 0,
            opacity: 1,
          });
        }
        return;
      }

      if (scene === "hero") return createHeroTimeline(section, path);

      const spec = SIGNAL_SEGMENT_SPECS[scene];
      const trigger = spec.triggerAnchor
        ? section.querySelector<HTMLElement>(
            `[data-signal-anchor="${spec.triggerAnchor}"]`,
          ) ?? section
        : section;
      const config = MOTION.signal[scene];
      const { length } = measurePath(path);

      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length * (1 - config.initialDraw),
        opacity: config.initialDraw > 0 ? 1 : 0,
      });

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          id: `signal:${scene}`,
          trigger,
          start: config.start,
          end: config.end,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
      if (config.initialDraw === 0) timeline.set(path, { opacity: 1 }, 0.001);
      timeline.to(path, { strokeDashoffset: 0, duration: 1 }, 0);

      return () => {
        timeline.scrollTrigger?.kill();
        timeline.kill();
      };
    },
    {
      scope: root,
      dependencies: [route?.path, scene],
      revertOnUpdate: true,
    },
  );

  return (
    <div
      ref={root}
      aria-hidden
      data-signal-scene={scene}
      className="pointer-events-none absolute inset-0 z-[var(--z-wire)]"
    >
      {route && (
        <SignalLine
          ref={line}
          path={route.path}
          viewBox={route.viewBox}
          pathProps={{ "data-signal-route": scene }}
          className="absolute inset-0 h-full w-full"
        />
      )}
    </div>
  );
}
