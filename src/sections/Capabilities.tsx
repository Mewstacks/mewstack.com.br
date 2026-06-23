import Reveal from "../components/Reveal";

const SERVICES = [
  {
    title: "Software & Automações",
    desc: "Sistemas sob medida e robôs que executam suas rotinas — integrados ao que você já usa, sem planilha no meio do caminho.",
    tags: ["Sistemas sob medida", "Integrações", "Bots & scripts", "APIs"],
  },
  {
    title: "Rotinas Inteligentes",
    desc: "Tarefas repetitivas viram processos que rodam sozinhos: agendados, monitorados e com alerta quando algo foge do esperado.",
    tags: ["Pipelines agendados", "Monitoramento", "Alertas", "Relatórios"],
  },
  {
    title: "Data Processing",
    desc: "Dados crus — PDF, CSV, exportações, sistemas legados — limpos, estruturados e transformados em decisão que você consegue aplicar.",
    tags: ["Limpeza & ETL", "Estruturação", "Dashboards", "Dados → decisão"],
  },
];

export default function Capabilities() {
  return (
    <section
      id="servicos"
      className="mx-auto max-w-7xl scroll-mt-24 px-5 py-24 sm:px-8 lg:py-32"
    >
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        {/* sticky intro */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <h2 className="font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.02] font-semibold tracking-[-0.03em]">
              Três frentes, um objetivo: te devolver tempo e clareza.
            </h2>
            <p className="mt-5 max-w-[40ch] text-ink-soft">
              Nascemos do desejo de eliminar processos repetitivos. Cada projeto
              começa no seu problema real — não num template.
            </p>
          </Reveal>
        </div>

        {/* divided service list */}
        <ul className="flex flex-col">
          {SERVICES.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 0.08}>
              <article
                className="group border-t border-cream-line py-8 transition-colors duration-300 last:border-b hover:bg-cream-deep/50"
              >
                <h3 className="font-display text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
                  {s.title}
                </h3>
                <p className="mt-3 max-w-[52ch] text-ink-soft">{s.desc}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {s.tags.map((t) => (
                    <li
                      key={t}
                      className="rounded-full border border-ink/15 px-3 py-1 text-sm text-ink"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
