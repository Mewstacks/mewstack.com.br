import { useGSAP } from "@gsap/react";
import { CHAPTERS, type ChapterTone } from "./chapters";
import { gsap } from "./gsap";
import { MOTION, reduceMotion } from "./motion";

const TONES: ChapterTone[] = ["paper", "paper-lilac", "paper-rose", "night"];

export function useSceneBackground() {
  useGSAP(() => {
    const layers = new Map(
      TONES.map((tone) => [
        tone,
        document.querySelector<HTMLElement>(`[data-scene-tone="${tone}"]`),
      ]),
    );
    if ([...layers.values()].some((layer) => !layer)) return;

    const sections = CHAPTERS.map((chapter) => ({
      tone: chapter.tone,
      el: document.getElementById(chapter.id),
    })).filter(
      (section): section is { tone: ChapterTone; el: HTMLElement } => !!section.el,
    );
    if (!sections.length) return;

    let current: ChapterTone = "paper";
    const setters = new Map(
      TONES.map((tone) => [
        tone,
        gsap.quickTo(layers.get(tone)!, "opacity", {
          duration: MOTION.bgFade,
          ease: MOTION.bgEase,
        }),
      ]),
    );

    const paint = (tone: ChapterTone) => {
      if (tone === current) return;
      const instant = reduceMotion();
      TONES.forEach((candidate) => {
        const target = candidate === tone ? 1 : 0;
        if (instant) {
          gsap.set(layers.get(candidate)!, { opacity: target });
        } else {
          setters.get(candidate)!(target);
        }
      });
      current = tone;
    };

    const update = () => {
      const probe = window.innerHeight * 0.5;
      let tone: ChapterTone = "paper";
      for (const section of sections) {
        const bounds = section.el.getBoundingClientRect();
        if (bounds.top <= probe && bounds.bottom > probe) {
          tone = section.tone;
          break;
        }
      }
      paint(tone);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
}
