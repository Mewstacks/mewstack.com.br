/* ============================================================
   Motion config — the single dial for the whole scroll system.
   Bolder, cinematic feel. Tune everything here; nothing else
   hardcodes timing/intensity.
   ============================================================ */
export const MOTION = {
  /* base reveal (enter) */
  duration: 1.05, // entrance duration (s)
  ease: "power3.out", // entrance easing
  easeTitle: "expo.out", // mask/clip title reveal easing
  stagger: 0.14, // gap between coordinated items (desktop)
  staggerMobile: 0.08,
  revealY: 64, // travel of a revealed item (px, desktop)
  revealYMobile: 30,
  revealScale: 0.94, // items start slightly scaled down

  /* section exit (the chapter recedes as the next takes over) */
  exitY: -8, // % the leaving section lifts
  exitScale: 0.97, // scale it settles to while leaving
  exitOpacity: 0.32, // opacity floor as it leaves

  /* parallax — higher = more drift. Per-element override via data-parallax="N" */
  parallax: 1,
  parallaxRange: 15, // max % an element drifts across its pass (desktop)

  /* hero exit (cinematic hand-off to the next chapter) */
  heroExitY: -26, // % the hero copy lifts as it leaves
  heroExitScale: 0.9, // scale the hero settles to on exit

  /* process chapter (pinned scrub) */
  processPin: "+=115%", // how long the timeline section stays pinned

  /* breakpoint that separates "full" desktop choreography from "light" mobile */
  desktop: "(min-width: 768px)",
  mobile: "(max-width: 767px)",
} as const;

/** True when the visitor asked the OS to reduce motion. */
export const reduceMotion = (): boolean =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
