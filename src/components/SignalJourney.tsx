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
  current?.path === next.path &&
  current.joinPath === next.joinPath &&
  current.exitPath === next.exitPath &&
  current.viewBox === next.viewBox
    ? current
    : next;

const numberData = (element: HTMLElement | SVGElement, key: string) =>
  Number.parseFloat(element.getAttribute(key) ?? "0");

function setupStaticHero(
  section: HTMLElement,
  outerPath: SVGPathElement,
  joinPath: SVGPathElement | null,
  exitPath: SVGPathElement,
) {
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
  if (joinPath) {
    gsap.set(joinPath, { strokeDasharray: "none", strokeDashoffset: 0, opacity: 1 });
  }
  gsap.set(exitPath, { strokeDasharray: "none", strokeDashoffset: 0, opacity: 1 });
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

function createHeroTimeline(
  section: HTMLElement,
  outerPath: SVGPathElement,
  joinPath: SVGPathElement | null,
  exitPath: SVGPathElement,
) {
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
  const joinLength = joinPath ? measurePath(joinPath).length : 0;
  const exitLength = measurePath(exitPath).length;
  const innerLength = measurePath(innerLine).length;
  video.pause();

  gsap.set(outerPath, {
    strokeDasharray: outerLength,
    strokeDashoffset: outerLength * (1 - MOTION.signal.hero.initialDraw),
    opacity: 1,
  });
  if (joinPath) {
    gsap.set(joinPath, {
      strokeDasharray: joinLength,
      strokeDashoffset: joinLength,
      opacity: 1,
    });
  }
  gsap.set(exitPath, {
    strokeDasharray: exitLength,
    strokeDashoffset: exitLength,
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
    // Mapeia só a janela pós-descida (join → saída) no seek do vídeo.
    const mediaProgress = Math.max(
      0,
      Math.min(1, (pendingProgress - dial.mediaFrom) / (1 - dial.mediaFrom)),
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

  const heroConfig = MOTION.signal.hero;

  // Uma timeline só, scrubada no scroll natural — sem pin. Trigger na seção
  // (não no media): em viewports altos o vídeo já nasce na tela; amarrar ao
  // media fazia a linha avançar no load. Aqui progresso 0 = topo do hero.
  const timeline = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      id: "signal:hero",
      trigger: section,
      start: heroConfig.start,
      end: heroConfig.end,
      scrub: heroConfig.scrub,
      invalidateOnRefresh: true,
      onUpdate: (self) => scheduleSeek(self.progress),
    },
  });

  timeline.fromTo(
    outerPath,
    { strokeDashoffset: outerLength },
    { strokeDashoffset: 0, duration: dial.descentSpan },
    0,
  );

  timeline
    .to(veil, { opacity: dial.veilOpacity, duration: dial.veilSpan }, dial.veilAt)
    .to(guides, { strokeDashoffset: 0, duration: dial.guideSpan }, dial.guideAt);
  if (joinPath) {
    timeline.to(
      joinPath,
      { strokeDashoffset: 0, duration: dial.joinSpan },
      dial.joinAt,
    );
  }
  timeline
    // Travessia só depois do join fechar — senão a linha do vídeo “sai sozinha”.
    .to(innerLine, { strokeDashoffset: 0, duration: dial.innerSpan }, dial.innerAt)
    .to(guides, { opacity: 0, duration: dial.guideFadeSpan }, dial.guideFadeAt)
    .to(
      exitPath,
      { strokeDashoffset: 0, duration: dial.exitSpan },
      dial.exitAt,
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
    const collectAt = dial.joinAt + 0.02 + (startX / 1200) * 0.18;

    timeline
      .to(
        dot,
        {
          attr: { cx: startX + dial.dotTravelX, cy: targetY },
          duration: 0.12,
          ease: "sine.inOut",
        },
        collectAt,
      )
      .to(dot, { opacity: 0, duration: 0.08 }, collectAt + 0.08);
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

export function SignalScene({
  scene,
  above = false,
}: {
  scene: LocalSignalScene;
  /** Eleva o overlay acima do conteúdo (linha passa por cima, ex.: equipe). */
  above?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const line = useRef<SVGPathElement>(null);
  const heroJoin = useRef<SVGPathElement>(null);
  const heroExit = useRef<SVGPathElement>(null);
  const [route, setRoute] = useState<BuiltSignalRoute | null>(null);

  useLayoutEffect(() => {
    const overlay = root.current;
    const section = overlay?.parentElement as HTMLElement | null;
    if (!overlay || !section) return;

    const spec = SIGNAL_SEGMENT_SPECS[scene];
    let frame = 0;
    const measure = () => {
      // Overlay is absolute inset-0 on the section, so section offset size matches
      // the SVG viewBox. Anchors are measured with offset* (ignores transforms).
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
    // Remeasure after hero entrance settles (GSAP from-y must not stay in path).
    const settle = window.setTimeout(scheduleMeasure, 1200);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(settle);
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
        if (scene === "hero" && heroExit.current) {
          setupStaticHero(
            section,
            path,
            heroJoin.current,
            heroExit.current,
          );
        } else {
          gsap.set(path, {
            strokeDasharray: "none",
            strokeDashoffset: 0,
            opacity: 1,
          });
        }
        return;
      }

      if (scene === "hero" && heroExit.current) {
        return createHeroTimeline(
          section,
          path,
          heroJoin.current,
          heroExit.current,
        );
      }

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
          // Contato: lag leve pra o traço “chegar” sem estalo no fim da página.
          scrub: scene === "contact" ? 1.15 : true,
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
      dependencies: [route?.path, route?.joinPath, route?.exitPath, scene],
      revertOnUpdate: true,
    },
  );

  return (
    <div
      ref={root}
      aria-hidden
      data-signal-scene={scene}
      className={`pointer-events-none absolute inset-0 ${
        above ? "z-[var(--z-wire-over)]" : "z-[var(--z-wire)]"
      }`}
    >
      {route && (
        <>
          <SignalLine
            ref={line}
            path={route.path}
            viewBox={route.viewBox}
            // opacity 0 por atributo: esconde a linha até o GSAP assumir o desenho
            // (e durante reverts do ScrollTrigger). Sem isso, o path aparece 100%
            // desenhado por um frame — a "saída" surgia antes da linha chegar.
            pathProps={{ "data-signal-route": scene, opacity: 0 }}
            className="absolute inset-0 h-full w-full"
          />
          {scene === "hero" && route.joinPath && (
            <SignalLine
              ref={heroJoin}
              path={route.joinPath}
              viewBox={route.viewBox}
              pathProps={{ "data-hero-signal-join": true, opacity: 0 }}
              className="absolute inset-0 h-full w-full"
            />
          )}
          {scene === "hero" && route.exitPath && (
            <SignalLine
              ref={heroExit}
              path={route.exitPath}
              viewBox={route.viewBox}
              pathProps={{ "data-hero-signal-exit": true, opacity: 0 }}
              className="absolute inset-0 h-full w-full"
            />
          )}
        </>
      )}
    </div>
  );
}
