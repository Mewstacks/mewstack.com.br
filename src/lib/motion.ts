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
    // Pin: join completa → só então a linha interna. Sem a interna “sair sozinha”.
    handoffAt: 0.38,
    veilSpan: 0.12,
    guideSpan: 0.2,
    guideFadeAt: 0.62,
    guideFadeSpan: 0.1,
    lineSpan: 0.32,
    // Plug-in na borda do vídeo (path de join separado).
    joinAt: 0,
    joinSpan: 0.22,
    // Travessia começa depois do join fechar (evita gap no frame).
    innerAt: 0.2,
    innerSpan: 0.36,
    dotWindow: 0.22,
    dotSpan: 0.1,
    dotFadeSpan: 0.05,
    flowAt: 0.72,
    flowSpan: 0.2,
    // Saída logo após a travessia interna.
    exitAt: 0.55,
    exitSpan: 0.34,
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
      // Vídeo no centro: join + travessia + saída num pin enxuto.
      start: "center center",
      end: "+=120%",
      initialDraw: 0.012,
      // Lag leve no scrub: suaviza tip-lag sem “segurar” o pin.
      scrub: 0.85,
    },
    // Janela travada ao TOPO da âncora (que fica na altura da linha): o desenho
    // acontece enquanto a linha atravessa a viewport (de ~85% a ~15% da altura),
    // então dá pra ver o surgimento e o traço completo sem a tela atropelar.
    problem: {
      start: "top 85%",
      end: "top 15%",
      initialDraw: 0,
    },
    // Trilho vertical: o desenho precisa TERMINAR com a saída ainda na
    // viewport. `bottom 12%` completava o traço com endY já fora da tela.
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
      // Footer no fim da página: a hairline só sobe até ~88–90vh. Janela
      // larga (entra abaixo da viewport → pousa no rodapé) pra não estalar,
      // e ainda completar antes do limite do Lenis.
      start: "top 135%",
      end: "top 92%",
      initialDraw: 0,
    },
  },

  process: {
    scrub: true,
    end: "+=105%",
    stepSpan: 0.13,
    // A linha precisa cruzar o último nó (RODAR) bem antes do fim do pin: com
    // settle curto o scrub ainda estava desenhando quando a seção soltava.
    settle: 0.26,
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
