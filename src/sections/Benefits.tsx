import { useRef } from "react";
import {
  Keyboard,
  Zap,
  TriangleAlert,
  ShieldCheck,
  Files,
  Database,
  HelpCircle,
  Radar,
  CalendarX2,
  CalendarCheck2,
  Flame,
  Target,
  ArrowRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useChapter } from "../lib/useChapter";

/* ── Benefícios: o "o que muda na prática", em pares antes → depois. Cada card
   é uma troca concreta (não uma promessa): o estado manual riscado em cima, o
   estado automatizado embaixo com o ícone aceso. Visual > texto — uma linha
   por estado, sem parágrafo. */

type Swap = {
  before: { icon: LucideIcon; label: string };
  after: { icon: LucideIcon; label: string };
};

const SWAPS: Swap[] = [
  {
    before: { icon: Keyboard, label: "Digitação manual, todo dia" },
    after: { icon: Zap, label: "Importação automática" },
  },
  {
    before: { icon: TriangleAlert, label: "Erro descoberto no fechamento" },
    after: { icon: ShieldCheck, label: "Validação na entrada" },
  },
  {
    before: { icon: Files, label: "Dados em cinco planilhas" },
    after: { icon: Database, label: "Uma fonte só, centralizada" },
  },
  {
    before: { icon: HelpCircle, label: "“Cadê o status disso?”" },
    after: { icon: Radar, label: "Rastreável de ponta a ponta" },
  },
  {
    before: { icon: CalendarX2, label: "Fechamento imprevisível" },
    after: { icon: CalendarCheck2, label: "Progresso visível por etapa" },
  },
  {
    before: { icon: Flame, label: "Time apagando incêndio" },
    after: { icon: Target, label: "Time focado no que importa" },
  },
];

export default function Benefits() {
  const root = useRef<HTMLElement>(null);
  useChapter(root);

  return (
    <section
      ref={root}
      id="beneficios"
      className="relative scroll-mt-24 border-y border-[var(--line)] bg-cream-deep"
    >
      <div aria-hidden className="grain pointer-events-none absolute inset-0 opacity-60" />

      <div className="relative mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:py-20">
        <div className="max-w-2xl">
          <p data-reveal className="eyebrow mb-6">na prática</p>
          <h2
            data-reveal-title
            className="font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.02] font-semibold tracking-[-0.035em]"
          >
            O que muda quando a rotina roda sozinha.
          </h2>
        </div>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SWAPS.map((s) => {
            const Before = s.before.icon;
            const After = s.after.icon;
            return (
              <li key={s.after.label} data-reveal>
                <article className="card group flex h-full flex-col gap-3 p-5 transition-[border-color,box-shadow] duration-300 ease-[var(--ease-quart)] hover:border-pink/40 hover:shadow-[var(--shadow-glow)]">
                  {/* antes — riscado, apagado */}
                  <div className="flex items-center gap-2.5 text-ink-soft/80">
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--line)] bg-cream">
                      <Before className="h-4 w-4" strokeWidth={1.8} />
                    </span>
                    <span className="text-[0.9rem] line-through decoration-ink-soft/40 decoration-1">
                      {s.before.label}
                    </span>
                  </div>

                  {/* a troca */}
                  <span aria-hidden className="ml-[0.95rem] flex h-4 items-center">
                    <ArrowRight className="h-3.5 w-3.5 rotate-90 text-pink-deep" strokeWidth={2.2} />
                  </span>

                  {/* depois — aceso */}
                  <div className="flex items-center gap-2.5">
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-pink/15 text-pink-deep transition-colors group-hover:bg-pink/25">
                      <After className="h-4 w-4" strokeWidth={2} />
                    </span>
                    <span className="text-[0.94rem] font-semibold text-ink">{s.after.label}</span>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
