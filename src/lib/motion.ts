/* ============================================================
   Motion config — the single dial for the whole scroll system.
   Tune the cinematic feel here; nothing else hardcodes timing.
   ============================================================ */
export const MOTION = {
  /* base reveal */
  duration: 0.9, // entrance duration (s)
  ease: "power3.out", // entrance easing
  stagger: 0.12, // gap between coordinated items (desktop)
  staggerMobile: 0.07,
  revealY: 42, // travel of a revealed item (px, desktop)
  revealYMobile: 22,

  /* parallax — higher = more drift. Per-element override via data-parallax="N" */
  parallax: 1, // base multiplier
  parallaxRange: 7, // max % an element drifts across its scroll pass (desktop)

  /* hero exit (cinematic hand-off to the next chapter) */
  heroExitY: -14, // % the hero copy lifts as it leaves
  heroExitScale: 0.96, // scale the hero settles to on exit

  /* process chapter (pinned scrub) */
  processPin: "+=120%", // how long the timeline section stays pinned

  /* breakpoint that separates "full" desktop choreography from "light" mobile */
  desktop: "(min-width: 768px)",
  mobile: "(max-width: 767px)",
} as const;

/** True when the visitor asked the OS to reduce motion. */
export const reduceMotion = (): boolean =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
