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
  const mediaEl =
    section.querySelector<HTMLElement>('[data-signal-anchor="hero-media"]') ??
    section;
  // Fração do path onde começa o subpath de saída (borda direita do vídeo → borda
  // direita do site). O outer é desenhado em duas etapas: descida até o vídeo e,
  // no fim, a saída — para a linha "sair do vídeo e encontrar a outra borda".
  const secBox = section.getBoundingClientRect();
  const mediaRightX = mediaEl.getBoundingClientRect().right - secBox.left;
  const { length: outerLength, fractions: outerFractions } = measurePath(
    outerPath,
    [mediaRightX],
  );
  const exitLength = outerLength * (1 - (outerFractions[0] ?? 1));
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
    // pendingProgress é o progresso da FASE 2 (pin), já mapeado direto no vídeo.
    const mediaProgress = Math.max(0, Math.min(1, pendingProgress));
    const target = Math.min(video.duration, mediaProgress * video.duration);
    if (Math.abs(video.currentTime - target) >= dial.seekThreshold) {
      video.currentTime = target;
    }
  };
  const scheduleSeek = (progress: number) => {
    pendingProgress = progress;
    if (!seekFrame) seekFrame = window.requestAnimationFrame(applySeek);
  };

  // FASE 1 — a descida desenha junto com o scroll natural (SEM pin), enquanto o
  // vídeo sobe até o centro da tela. A linha "vem descendo" desde o topo e a tela
  // não atropela o início. Desenha o outer só até a conexão (a saída fica
  // escondida em exitLength).
  const descentTl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      id: "signal:hero-descent",
      trigger: mediaEl,
      start: "top 75%",
      end: "center center",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });
  descentTl.fromTo(
    outerPath,
    { strokeDashoffset: outerLength },
    { strokeDashoffset: exitLength, duration: 1 },
    0,
  );

  // FASE 2 — pin: segura a tela com o vídeo enquadrado e toca a conexão, a
  // travessia interna do vídeo e, SÓ NO FIM, a saída pela borda direita.
  const timeline = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      id: "signal:hero",
      trigger: mediaEl,
      start: "center center",
      end: MOTION.signal.hero.end,
      scrub: true,
      pin: section,
      pinSpacing: true,
      refreshPriority: 20,
      invalidateOnRefresh: true,
      onUpdate: (self) => scheduleSeek(self.progress),
    },
  });

  timeline
    .to(veil, { opacity: dial.veilOpacity, duration: 0.24 }, 0)
    .to(guides, { strokeDashoffset: 0, duration: 0.42 }, 0.04)
    // Linha interna atravessa o vídeo cedo (termina ~0.58).
    .to(innerLine, { strokeDashoffset: 0, duration: 0.5 }, 0.08)
    .to(guides, { opacity: 0, duration: 0.18 }, 0.6)
    // SAÍDA pela borda direita só depois da travessia interna terminar — nunca
    // antes de a linha chegar/atravessar o vídeo.
    .to(outerPath, { strokeDashoffset: 0, duration: 0.24 }, 0.74)
    .to(
      flow,
      {
        opacity: dial.flowOpacity,
        strokeDashoffset: -(dial.flowSpacing + 1),
        duration: 0.26,
      },
      0.72,
    );

  dots.forEach((dot) => {
    const startX = numberData(dot, "data-start-x");
    const targetY = numberData(dot, "data-target-y");
    const collectAt = 0.04 + (startX / 1200) * 0.4;

    timeline
      .to(
        dot,
        {
          attr: { cx: startX + dial.dotTravelX, cy: targetY },
          duration: 0.2,
          ease: "sine.inOut",
        },
        collectAt,
      )
      .to(dot, { opacity: 0, duration: 0.1 }, collectAt + 0.1);
  });

  const trigger = timeline.scrollTrigger;
  const onMetadata = () => scheduleSeek(trigger?.progress ?? 0);
  video.addEventListener("loadedmetadata", onMetadata);
  scheduleSeek(trigger?.progress ?? 0);

  // O pin do hero introduz espaçamento antes de todas as seções seguintes.
  // Ordena e recalcula só depois deste trigger existir para que os starts/ends
  // a jusante incluam o spacer.
  const refreshFrame = window.requestAnimationFrame(() => {
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
  });

  return () => {
    window.cancelAnimationFrame(seekFrame);
    window.cancelAnimationFrame(refreshFrame);
    video.removeEventListener("loadedmetadata", onMetadata);
    video.pause();
    descentTl.scrollTrigger?.kill();
    descentTl.kill();
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
      className={`pointer-events-none absolute inset-0 ${
        above ? "z-[var(--z-wire-over)]" : "z-[var(--z-wire)]"
      }`}
    >
      {route && (
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
      )}
    </div>
  );
}
