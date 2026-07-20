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
  // Deslocamento em px do vídeo do hero (e do fio) ao longo da seção.
  heroStageParallax: 28,
  heroExitY: -12,
  heroExitScale: 0.97,
  heroSignal: {
    veilStart: 0.95,
    veilDuration: 2.8,
    veilOpacity: 0.98,
    guideStart: 1.25,
    guideDuration: 4.65,
    guideOpacity: 0.34,
    guideFadeDuration: 0.9,
    lineStart: 1.75,
    lineDuration: 5.05,
    dotOpacity: 0.72,
    dotAnticipation: 0.16,
    dotMinDuration: 0.62,
    dotFadeDuration: 0.34,
    dotTravelX: 14,
    flowSpacing: 430,
    flowDuration: 8.5,
    flowOpacity: 0.48,
    ease: "sine.inOut",
    maxDrift: 0.2,
  },
  wipeDuration: 0.8,
  wipeEase: "expo.inOut",
  handoffScale: 1.05,

  horizontalExtraVw: 8,
  horizontalLead: 0.1,
  horizontalSnapDuration: 0.45,
  horizontalScrub: 0.9,

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
    scrub: 0.6,
    start: "top 78%",
    end: "bottom 34%",
  },

  process: {
    scrub: 0.5,
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
    breatheAmp: 0.03,
    breatheDuration: 2.6,
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
