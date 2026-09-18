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
    // Timeline única no scroll natural (sem pin), scrubada ponta a ponta:
    // descida → join → travessia → saída, tudo preso ao progresso 0→1. Nada
    // desenha no load — scrollar pra cima desfaz o traço até sumir. A saída
    // só começa quando a travessia fecha (exitAt = innerAt + innerSpan), e a
    // coreografia inteira termina na primeira metade da janela: a linha sai
    // do vídeo enquanto o frame ainda passa pelo centro da viewport.
    descentSpan: 0.16,
    veilAt: 0.11,
    veilSpan: 0.07,
    guideAt: 0.11,
    guideSpan: 0.1,
    guideFadeAt: 0.44,
    guideFadeSpan: 0.06,
    joinAt: 0.16,
    joinSpan: 0.08,
    innerAt: 0.24,
    innerSpan: 0.2,
    flowAt: 0.48,
    flowSpan: 0.16,
    exitAt: 0.44,
    exitSpan: 0.16,
    // Progresso a partir do qual o vídeo acompanha o scrub (após a descida).
    mediaFrom: 0.16,
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
      // Janela termina com o frame ~no centro (bottom 45%): a coreografia
      // inteira (join→travessia→saída, ver heroSignal) fecha na primeira
      // metade, com o vídeo na zona de leitura — nunca "acima da tela".
      start: "top top",
      end: "bottom 45%",
      // Lag mínimo: tip suave sem “segurar” o scroll.
      scrub: 0.3,
    },
    // Demais cenas: scrub COLADO no scroll (scrub: true, zero lag). A janela
    // abre quando a âncora entra pela borda inferior e fecha ~no centro da
    // viewport: a ponta desenha dentro da zona de leitura, acompanhando o
    // ritmo do scroll — nunca “entra pela borda” no topo, e o traço está
    // completo antes da região do header.
    problem: {
      start: "top 95%",
      end: "top 45%",
    },
    // Trilho vertical: desenha enquanto os painéis 01→03 sobem; fecha com a
    // saída ainda dentro da viewport.
    services: {
      start: "top 95%",
      end: "bottom 62%",
    },
    machine: {
      start: "top 95%",
      end: "top 40%",
    },
    outcome: {
      start: "top 95%",
      end: "top 45%",
    },
    about: {
      start: "top 95%",
      end: "top 45%",
    },
    contact: {
      // Footer no fim da página: a hairline não alcança o centro da viewport —
      // fecha logo antes do limite de scroll do Lenis.
      start: "top 125%",
      end: "top 90%",
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
