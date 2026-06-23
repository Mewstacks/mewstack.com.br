import Reveal from "../components/Reveal";

/**
 * PLACEHOLDER projects — swap these for real work (title, blurb, tags, year, and
 * ideally a `thumb` image path in /public). The bento spans alternate so the grid
 * never reads as a uniform card wall.
 */
type Project = {
  title: string;
  blurb: string;
  tags: string[];
  year: string;
  span: "wide" | "single";
};

const PROJECTS: Project[] = [
  {
    title: "Pipeline fiscal automatizado",
    blurb: "Notas fiscais em PDF viram um painel de impostos atualizado sozinho, todo dia.",
    tags: ["Python", "ETL", "BI"],
    year: "2025",
    span: "wide",
  },
  {
    title: "Bot de atendimento no WhatsApp",
    blurb: "Triagem e respostas automáticas integradas ao CRM.",
    tags: ["Automação", "API"],
    year: "2025",
    span: "single",
  },
  {
    title: "Extrator PDF → planilha",
    blurb: "Documentos não estruturados viram dados limpos e prontos.",
    tags: ["Data Processing"],
    year: "2024",
    span: "single",
  },
  {
    title: "Painel de vendas em tempo real",
    blurb: "Várias fontes consolidadas numa decisão única, ao vivo.",
    tags: ["SQL", "Dashboard", "Realtime"],
    year: "2024",
    span: "wide",
  },
];

export default function Projects() {
  return (
    <section
      id="projetos"
      className="mx-auto max-w-7xl scroll-mt-24 px-5 py-24 sm:px-8 lg:py-32"
    >
      <Reveal className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="max-w-2xl font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.02] font-semibold tracking-[-0.03em]">
          Coisas que já tiraram alguém do trabalho manual.
        </h2>
        <p className="font-display text-sm text-ink-soft mono">// trabalhos selecionados</p>
      </Reveal>

      <ul className="mt-12 grid gap-4 lg:grid-cols-3">
        {PROJECTS.map((p, i) => (
          <Reveal
            as="li"
            key={p.title}
            delay={i * 0.07}
            className={p.span === "wide" ? "lg:col-span-2" : "lg:col-span-1"}
          >
            <article className="group relative flex h-full min-h-72 flex-col justify-between overflow-hidden rounded-3xl bg-night p-7 text-paper">
              {/* mascot watermark */}
              <img
                src="/brand/mascot.svg"
                alt=""
                aria-hidden
                className="pointer-events-none absolute -right-10 -bottom-12 w-52 opacity-[0.07] transition-transform duration-500 ease-[var(--ease-quart)] group-hover:scale-110 group-hover:opacity-[0.12]"
              />
              {/* pink glow on hover */}
              <div
                aria-hidden
                className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-40"
                style={{ background: "var(--color-pink)" }}
              />

              <div className="relative flex items-center justify-between">
                <span className="rounded-full border border-night-line px-3 py-1 text-xs font-medium text-paper-soft mono">
                  {p.year}
                </span>
                <span className="text-xs font-medium text-paper-soft mono opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  exemplo
                </span>
              </div>

              <div className="relative">
                <h3 className="font-display text-2xl font-semibold tracking-[-0.02em] text-paper sm:text-[1.7rem]">
                  {p.title}
                </h3>
                <p className="mt-2 max-w-[44ch] text-paper-soft">{p.blurb}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <li
                      key={t}
                      className="rounded-full bg-night-2 px-3 py-1 text-xs font-medium text-paper mono"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </Reveal>
        ))}
      </ul>

      <Reveal delay={0.1} className="mt-6 text-sm text-ink-soft">
        Projetos ilustrativos. Quer ver o seu aqui?{" "}
        <a href="#contato" className="font-medium text-pink-deep underline underline-offset-4">
          Vamos conversar
        </a>
        .
      </Reveal>
    </section>
  );
}
