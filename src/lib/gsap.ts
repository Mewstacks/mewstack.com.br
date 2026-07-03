/* Single GSAP entry point: registers ScrollTrigger once and re-exports the
   pieces the app uses. Importing from here (instead of "gsap" directly) keeps
   plugin registration in one place and avoids double-registration warnings. */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export { gsap, ScrollTrigger, SplitText };
