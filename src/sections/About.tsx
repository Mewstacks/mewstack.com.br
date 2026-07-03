import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "../lib/gsap";
import { reduceMotion } from "../lib/motion";
import { useChapter } from "../lib/useChapter";

type Member = {
  name: string;
  role: string;
  photo: string;
  objectPosition: string;
  bio: string;
  stack: string[];
};

const TEAM: Member[] = [
  {
    name: "Germano Argenta Dal Prá",
    role: "CEO & Data Engineer",
    photo: "/brand/founder.png",
    objectPosition: "50% 28%",
    bio: "Engenheiro de dados e backend. Construo software, automações e pipelines que transformam dados bagunçados em decisão, do primeiro script ao sistema rodando em produção.",
    stack: [
      "Python",
      "Backend & APIs",
      "ETL / pipelines",
      "Automação",
      "SQL & bancos",
      "Data Engineering",
    ],
  },
  {
    name: "Pedro Henrique Gasparin Machado",
    role: "Full-Stack Developer",
    photo: "/brand/team-dev.jpeg",
    objectPosition: "68% 32%",
    bio: "Desenvolvedor full-stack: do backend em Python à interface no navegador. Modelo APIs, integro serviços e transformo produto em tela. Web rápida, acessível e com acabamento de alto nível.",
    stack: [
      "Python",
      "Django",
      "APIs REST",
      "React",
      "TypeScript",
      "Front-end & UI",
    ],
  },
  {
    name: "Lorenzo Facchin",
    role: "Comercial & Social Media",
    photo: "/brand/team-sales.jpeg",
    objectPosition: "50% 30%",
    bio: "A ponte entre o que a gente constrói e quem precisa disso. Cuido das vendas, do relacionamento e da presença da MewStack nas redes, conteúdo que explica o produto sem enrolar.",
    stack: [
      "Vendas B2B",
      "Social Media",
      "Conteúdo",
      "Copywriting",
      "Relacionamento",
      "Growth",
    ],
  },
];

export default function About() {
  const root = useRef<HTMLElement>(null);
  useChapter(root);

  // Each avatar is revealed by an expanding circular mask + a settling zoom —
  // a distinct entrance from the page's mask-and-rise default. Runs alongside
  // useChapter's text reveals (different element, different property).
  useGSAP(
    () => {
      const imgs = gsap.utils.toArray<HTMLElement>("[data-avatar]");
      if (!imgs.length) return;
      if (reduceMotion()) {
        gsap.set(imgs, { clearProps: "all" });
        return;
      }
      imgs.forEach((img) => {
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
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="estudio"
      className="mx-auto max-w-6xl scroll-mt-24 px-5 py-14 sm:px-8 lg:py-20"
    >
      <p data-reveal className="eyebrow mb-6">quem faz</p>

      <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:grid-rows-[auto_auto_auto] md:gap-x-8 md:gap-y-0">
        {TEAM.map((m) => (
          <div
            key={m.name}
            data-reveal
            className="md:grid md:row-span-3 md:grid-rows-subgrid"
          >
            {/* items-start keeps every name pinned to the same top line so a
                longer name (more lines) grows downward instead of shifting the
                header off from its neighbours. */}
            <div className="flex items-start gap-5">
              <div className="size-16 shrink-0 overflow-hidden rounded-full bg-cream-deep ring-2 ring-pink sm:size-20">
                <img
                  src={m.photo}
                  alt={m.name}
                  data-avatar
                  style={{ objectPosition: m.objectPosition }}
                  className="h-full w-full object-cover will-change-transform"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="min-w-0">
                <h2 className="font-display text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
                  {m.name}
                </h2>
                {/* Single line, consistent across every card. */}
                <p className="mt-1 truncate font-medium text-pink-deep">
                  {m.role}
                </p>
              </div>
            </div>

            <p className="mt-6 max-w-[58ch] leading-relaxed text-ink-soft">
              {m.bio}
            </p>

            {/* content-start + items-start stop the pills from being stretched
                to fill the (subgrid-equalised) skills row, so every card keeps
                the same compact pill size. */}
            <ul className="mt-6 flex flex-wrap content-start items-start gap-2">
              {m.stack.map((t) => (
                <li
                  key={t}
                  className="rounded-full bg-cream-deep px-3 py-1 text-sm font-medium text-ink mono"
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
