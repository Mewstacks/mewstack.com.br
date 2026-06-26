import Reveal from "../components/Reveal";

const STACK = [
  "Python",
  "Backend & APIs",
  "ETL / pipelines",
  "Automação",
  "SQL & bancos",
  "Data Engineering",
];

export default function About() {
  return (
    <section
      id="estudio"
      className="mx-auto max-w-3xl scroll-mt-24 px-5 py-14 sm:px-8 lg:py-20"
    >
      <Reveal>
        <p className="eyebrow mb-6">quem faz</p>

        <div className="flex items-center gap-5">
          <div className="size-16 shrink-0 overflow-hidden rounded-full bg-cream-deep ring-2 ring-pink sm:size-20">
            <img
              src="/brand/founder.png"
              alt="Germano Argenta Dal Prá"
              className="h-full w-full object-cover [object-position:50%_28%]"
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

        <p className="mt-6 max-w-[58ch] leading-relaxed text-ink-soft">
          Engenheiro de dados e backend. Construo software, automações e
          pipelines que transformam dados bagunçados em decisão, do primeiro
          script ao sistema rodando em produção.
        </p>

        <ul className="mt-6 flex flex-wrap gap-2">
          {STACK.map((t) => (
            <li
              key={t}
              className="rounded-full bg-cream-deep px-3 py-1 text-sm font-medium text-ink mono"
            >
              {t}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
