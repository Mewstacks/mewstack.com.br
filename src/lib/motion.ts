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

  /* scene-exit variants — the exit shape a chapter uses as the next takes over.
     "recede" is the original (lift+scale+dim+blur). Variants keep the page from
     feeling like one repeated transition. Tuned per family, all transform/opacity
     (+ a one-shot clip-path on the wipe overlay). */
  wipeDuration: 0.9, // s — overlay clip-path sweep covering/revealing the seam
  wipeEase: "expo.inOut",
  handoffScale: 1.12, // scale a [data-handoff] element grows to as it leaves

  /* horizontal gallery — vertical scroll becomes a horizontal track (desktop).
     lead holds the track still for a beat on entry so arriving at the section
     doesn't immediately yank sideways; snap settles onto the nearest card;
     scrub smooths the travel (higher = softer, a touch more lag). */
  horizontalExtraVw: 8, // vw of breathing room past the last card
  horizontalLead: 0.12, // share of the pass spent settled before the slide starts
  horizontalSnapDuration: 0.55, // s — max settle onto nearest card (scales with distance)
  horizontalScrub: 1.1, // scrub smoothing for the track

  /* count-up — number stats animate from 0 on enter */
  countDuration: 1.8, // s
  countEase: "power2.out",

  /* custom cursor — a soft trailing dot (desktop, pointer:fine only) */
  cursorLerp: 0.18, // follow smoothing (0..1, higher = snappier)
  cursorSize: 12, // px — resting diameter
  cursorHoverScale: 2.6, // grows over interactive targets

  /* breakpoint that separates "full" desktop choreography from "light" mobile */
  desktop: "(min-width: 768px)",
  mobile: "(max-width: 767px)",
} as const;

/** Scene-exit variant a chapter plays as the next one takes over. */
export type SceneVariant = "recede" | "wipe" | "scaleHandoff";

/** True when the visitor asked the OS to reduce motion. */
export const reduceMotion = (): boolean =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
