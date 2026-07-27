export const MOTION = {
  duration: 0.88,
  ease: "power3.out",
  easeTitle: "expo.out",
  stagger: 0.1,
  staggerMobile: 0.06,
  revealY: 36,
  revealYMobile: 22,
  revealScale: 0.98,
  revealTitleStart: "top 86%",
  revealContentStart: "top 80%",

  enterScale: 0.985,
  exitY: -5,
  exitScale: 0.985,
  exitOpacity: 0.5,
  exitBlur: 0,
  enterWeight: 1,
  holdWeight: 2.8,
  exitWeight: 1,

  parallax: 1,
  parallaxRange: 10,
  heroExitY: -12,
  heroExitScale: 0.97,
  heroSignal: {
    veilOpacity: 0.98,
    guideOpacity: 0.34,
    dotOpacity: 0.72,
    dotTravelX: 14,
    flowSpacing: 430,
    flowOpacity: 0.48,
    // Timeline única no scroll natural (sem pin). Pesos relativos ao progresso 0→1.
    // Descida ocupa a primeira metade; join/travessia/saída fecham com o vídeo ainda na tela.
    descentSpan: 0.42,
    veilAt: 0.4,
    veilSpan: 0.07,
    guideAt: 0.4,
    guideSpan: 0.1,
    guideFadeAt: 0.68,
    guideFadeSpan: 0.06,
    joinAt: 0.4,
    joinSpan: 0.09,
    innerAt: 0.48,
    innerSpan: 0.18,
    flowAt: 0.72,
    flowSpan: 0.12,
    exitAt: 0.62,
    exitSpan: 0.2,
    // Progresso a partir do qual o vídeo acompanha o scrub (após a descida).
    mediaFrom: 0.4,
    seekThreshold: 1 / 30,
  },
  wipeDuration: 0.8,
  wipeEase: "expo.inOut",
  handoffScale: 1.05,

  horizontalScrub: true,

  bgFade: 0.8,
  bgFadeNight: 1.1,
  bgEase: "power2.inOut",

  lineStagger: 0.09,
  lineStaggerMobile: 0.055,
  lineY: 24,
  lineDuration: 0.9,
  lineEase: "expo.out",

  magneticStrength: 0.12,
  magneticLerp: 0.18,
  magneticMax: 12,

  signal: {
    hero: {
      // Scroll natural na própria seção: progresso 0 no topo (sem pin).
      // Fecha a saída antes do hero sumir — bottom 40% mantém o frame na viewport.
      start: "top top",
      end: "bottom 40%",
      initialDraw: 0.012,
      // Lag mínimo: tip suave sem “segurar” o scroll.
      scrub: 0.3,
    },
    // Janela no TOPO da âncora: desenho enquanto a linha atravessa a viewport.
    problem: {
      start: "top 85%",
      end: "top 15%",
      initialDraw: 0,
    },
    // Trilho vertical: o desenho precisa TERMINAR com a saída ainda na viewport.
    services: {
      start: "top 78%",
      end: "bottom 68%",
      initialDraw: 0,
    },
    machine: {
      start: "top 80%",
      end: "top 20%",
      initialDraw: 0,
    },
    outcome: {
      start: "top 90%",
      end: "top 40%",
      initialDraw: 0,
    },
    about: {
      start: "top 85%",
      end: "top 15%",
      initialDraw: 0,
    },
    contact: {
      // Footer no fim da página: janela larga pra completar antes do limite do Lenis.
      start: "top 135%",
      end: "top 92%",
      initialDraw: 0,
    },
  },

  process: {
    scrub: 0.35,
    // Desktop sem pin: janela larga o bastante pra ver a curva inteira e os nós.
    start: "top 78%",
    end: "top 22%",
    stepSpan: 0.13,
    // Folga no fim pra o último nó (RODAR) acender com a linha ainda visível.
    settle: 0.12,
  },

  instrument: {
    start: "top 85%",
    end: "bottom 12%",
    typeDuration: 0.9,
    lineGap: 0.35,
    holdLoop: 2.2,
    drawStagger: 0.08,
    pulseDuration: 2.4,
    barRise: 0.7,
    barStagger: 0.09,
  },

  desktop: "(min-width: 768px)",
  mobile: "(max-width: 767px)",
} as const;

export type SceneVariant = "recede" | "wipe" | "scaleHandoff";

export const reduceMotion = (): boolean => {
  if (typeof window === "undefined") return false;
  const devOverride =
    import.meta.env.DEV &&
    new URLSearchParams(window.location.search).has("reduced-motion");
  return (
    devOverride ||
    (typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  );
};
