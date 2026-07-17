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
