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
    handoffAt: 0.48,
    veilSpan: 0.16,
    guideSpan: 0.3,
    guideFadeAt: 0.76,
    guideFadeSpan: 0.12,
    lineSpan: 0.38,
    dotWindow: 0.28,
    dotSpan: 0.12,
    dotFadeSpan: 0.06,
    flowAt: 0.88,
    flowSpan: 0.12,
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
      start: "top top",
      end: "bottom top",
      initialDraw: 0.012,
    },
    problem: {
      start: "top 78%",
      end: "bottom 42%",
      initialDraw: 0,
    },
    services: {
      start: "top 82%",
      end: "top 52%",
      initialDraw: 0,
    },
    machine: {
      start: "top 82%",
      end: "top 48%",
      initialDraw: 0,
    },
    outcome: {
      start: "top 84%",
      end: "top 55%",
      initialDraw: 0,
    },
    contact: {
      start: "top 97%",
      end: "bottom bottom",
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
