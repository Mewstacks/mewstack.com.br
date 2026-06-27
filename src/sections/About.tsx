import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "../lib/gsap";
import { reduceMotion } from "../lib/motion";
import { useChapter } from "../lib/useChapter";

const STACK = [
  "Python",
  "Backend & APIs",
  "ETL / pipelines",
  "Automação",
  "SQL & bancos",
  "Data Engineering",
];

export default function About() {
  const root = useRef<HTMLElement>(null);
  useChapter(root);

  // The avatar is revealed by an expanding circular mask + a settling zoom —
  // a distinct entrance from the page's mask-and-rise default. Runs alongside
  // useChapter's text reveals (different element, different property).
  useGSAP(
    () => {
      const img = root.current?.querySelector<HTMLElement>("[data-avatar]");
      if (!img) return;
      if (reduceMotion()) {
        gsap.set(img, { clearProps: "all" });
        return;
      }
      gsap.set(img, { clipPath: "circle(0% at 50% 50%)", scale: 1.25 });
      ScrollTrigger.create({
        trigger: img,
        start: "top 82%",
        once: true,
        onEnter: () =>
          gsap.to(img, {
            clipPath: "circle(75% at 50% 50%)",
            scale: 1,
            duration: 1.2,
            ease: "expo.out",
          }),
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="estudio"
      className="mx-auto max-w-3xl scroll-mt-24 px-5 py-14 sm:px-8 lg:py-20"
    >
      <p data-reveal className="eyebrow mb-6">quem faz</p>

      <div data-reveal className="flex items-center gap-5">
          <div className="size-16 shrink-0 overflow-hidden rounded-full bg-cream-deep ring-2 ring-pink sm:size-20">
            <img
              src="/brand/founder.png"
              alt="Germano Argenta Dal Prá"
              data-avatar
              className="h-full w-full object-cover [object-position:50%_28%] will-change-transform"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
              Germano Argenta Dal&nbsp;Prá
            </h2>
            <p className="mt-0.5 font-medium text-pink-deep">
              CEO &amp; Data Engineer · MewStack
            </p>
          </div>
        </div>

      <p data-reveal className="mt-6 max-w-[58ch] leading-relaxed text-ink-soft">
        Engenheiro de dados e backend. Construo software, automações e
        pipelines que transformam dados bagunçados em decisão, do primeiro
        script ao sistema rodando em produção.
      </p>

      <ul data-reveal className="mt-6 flex flex-wrap gap-2">
        {STACK.map((t) => (
          <li
            key={t}
            className="rounded-full bg-cream-deep px-3 py-1 text-sm font-medium text-ink mono"
          >
            {t}
          </li>
        ))}
      </ul>
    </section>
  );
}
