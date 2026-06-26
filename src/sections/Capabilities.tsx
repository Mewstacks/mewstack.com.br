import { useRef } from "react";
import { Boxes, Workflow, Database, Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useChapter } from "../lib/useChapter";

type Service = {
  icon: LucideIcon;
  title: string;
  desc: string;
  checks: string[];
  span: string;
};

const SERVICES: Service[] = [
  {
    icon: Boxes,
    title: "Software & Automações",
    desc: "Sistemas sob medida e robôs que executam suas rotinas, integrados ao que você já usa, sem planilha no meio do caminho.",
    checks: ["Sistemas sob medida", "Integrações & APIs", "Bots & scripts"],
    span: "md:col-span-7",
  },
  {
    icon: Workflow,
    title: "Rotinas Inteligentes",
    desc: "Tarefas repetitivas viram processos que rodam sozinhos: agendados, monitorados e com alerta quando algo foge do esperado.",
    checks: ["Pipelines agendados", "Monitoramento & alertas", "Relatórios automáticos"],
    span: "md:col-span-5",
  },
  {
    icon: Database,
    title: "Data Processing",
    desc: "Volume de documento que ninguém dá conta de conferir na mão. A gente lê, valida e organiza no formato que o seu time realmente usa.",
    checks: ["Limpeza & ETL", "Estruturação", "Dashboards", "Dado → decisão"],
    span: "md:col-span-12",
  },
];

export default function Capabilities() {
  const root = useRef<HTMLElement>(null);
  useChapter(root);

  return (
    <section ref={root} id="servicos" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-14 sm:px-8 lg:py-20">
      <div className="max-w-2xl">
        <p data-reveal className="eyebrow mb-6">serviços</p>
        <h2 data-reveal className="font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.02] font-semibold tracking-[-0.035em]">
          Três frentes, um objetivo: te devolver tempo e clareza.
        </h2>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-12">
        {SERVICES.map((s) => {
          const Icon = s.icon;
          const wide = s.span === "md:col-span-12";
          return (
            <div data-reveal key={s.title} className={`sm:col-span-2 ${s.span}`}>
              <article
                className={`card group relative h-full overflow-hidden p-7 transition-[transform,border-color,box-shadow] duration-300 ease-[var(--ease-quart)] hover:-translate-y-1 hover:border-pink/40 hover:shadow-[var(--shadow-glow)] hover:ring-1 hover:ring-pink/15 sm:p-8 ${
                  wide ? "flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between" : "flex flex-col"
                }`}
              >
                {/* hover spotlight */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-30"
                  style={{ background: "radial-gradient(circle, var(--color-pink) 0%, transparent 70%)" }}
                />

                <div className={wide ? "lg:max-w-[46ch]" : ""}>
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-ink/8 bg-cream text-pink-deep shadow-[var(--shadow-soft)]">
                    <Icon className="h-5 w-5" strokeWidth={1.8} />
                  </span>
                  <h3 className="mt-5 font-display text-2xl font-semibold tracking-[-0.02em] transition-colors group-hover:text-pink-deep">
                    {s.title}
                  </h3>
                  <p className="mt-2.5 text-ink-soft">{s.desc}</p>
                </div>

                <ul className={`mt-6 grid gap-2.5 ${wide ? "shrink-0 sm:grid-cols-2 lg:mt-0" : ""}`}>
                  {s.checks.map((c) => (
                    <li key={c} className="flex items-center gap-2.5 text-[0.92rem] text-ink">
                      <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-pink/15 text-pink-deep">
                        <Check className="h-3 w-3" strokeWidth={2.5} />
                      </span>
                      {c}
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          );
        })}
      </div>
    </section>
  );
}
