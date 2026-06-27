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

  /* reveal hierarchy — the title leads, the content follows a beat later, so a
     chapter assembles itself (heading → body/image) instead of popping at once.
     Earlier % = triggers sooner as the section rises into view. */
  revealTitleStart: "top 84%", // titles lead
  revealContentStart: "top 76%", // content/images follow

  /* section entrance (the incoming chapter rises into focus "from behind") */
  enterScale: 0.955, // scale the section grows from as it takes the screen

  /* section exit (the chapter recedes — drops behind — as the next takes over) */
  exitY: -9, // % the leaving section lifts
  exitScale: 0.96, // scale it settles to while leaving (more recede = more depth)
  exitOpacity: 0.34, // opacity floor as it leaves
  exitBlur: 5, // px the section defocuses into the background (desktop only)

  /* handoff timeline shape (proportional weights inside one scrubbed timeline) */
  enterWeight: 1, // share of the pass spent rising into focus
  holdWeight: 2.4, // share held at rest (the "scene" itself)
  exitWeight: 1.2, // share spent receding for the next chapter

  /* parallax — higher = more drift. Per-element override via data-parallax="N" */
  parallax: 1,
  parallaxRange: 18, // max % an element drifts across its pass (desktop)

  /* hero exit (cinematic hand-off to the next chapter) */
  heroExitY: -26, // % the hero copy lifts as it leaves
  heroExitScale: 0.9, // scale the hero settles to on exit

  /* breakpoint that separates "full" desktop choreography from "light" mobile */
  desktop: "(min-width: 768px)",
  mobile: "(max-width: 767px)",
} as const;

/** True when the visitor asked the OS to reduce motion. */
export const reduceMotion = (): boolean =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
