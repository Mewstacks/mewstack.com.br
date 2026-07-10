import { useRef } from "react";
import {
  Repeat2,
  TriangleAlert,
  Table2,
  EyeOff,
  Check,
  ArrowRight,
  ArrowDown,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useChapter } from "../lib/useChapter";
import Mascot from "../components/Mascot";

/* ── Problema: o capítulo que faz o visitante se reconhecer. Storytelling
   visual, não texto: uma planilha "antes" (bagunçada, com erro e retrabalho)
   vira, atravessando a live wire rosa, uma rotina "depois" rodando sozinha.
   Banda branca (cream-deep) com hairlines — dá o "preenchimento" de fundo sem
   sair da paleta. Mascote observa a bagunça de cima (desktop). */

const PAINS: { icon: LucideIcon; label: string }[] = [
  { icon: Repeat2, label: "Retrabalho manual" },
  { icon: TriangleAlert, label: "Erro de digitação" },
  { icon: Table2, label: "Planilhas espalhadas" },
  { icon: EyeOff, label: "Status invisível" },
];

/* linhas da planilha "antes" — a bagunça reconhecível */
const BEFORE_ROWS: { c1: string; c2: string; c3: string; bad?: boolean }[] = [
  { c1: "NF 2025-0487", c2: "4.250,00", c3: "ok" },
  { c1: "NF 2025-0486", c2: "1.800,00", c3: "digitar de novo", bad: true },
  { c1: "NF 2025-0485", c2: "#REF!", c3: "fórmula quebrou", bad: true },
  { c1: "NF 2025-0485", c2: "920,00", c3: "duplicada?", bad: true },
  { c1: "Extrato jun", c2: "—", c3: "valor não bate", bad: true },
];

/* passos da rotina "depois" — o mesmo trabalho, rodando sozinho */
const AFTER_STEPS = [
  "487 notas importadas do portal",
  "Dados extraídos e validados",
  "Extrato conciliado com as notas",
  "Relatório no seu e-mail, 07:00",
];

export default function Problem() {
  const root = useRef<HTMLElement>(null);
  useChapter(root);

  return (
    <section
      ref={root}
      id="problema"
      className="relative scroll-mt-24 border-y border-[var(--line)] bg-cream-deep"
    >
      {/* grain sutil + grid editorial — banda com estrutura, não chapada */}
      <div aria-hidden className="grain pointer-events-none absolute inset-0 opacity-60" />
      <div
        aria-hidden
        className="grid-lines pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_75%_70%_at_50%_30%,black,transparent_80%)]"
      />

      <div className="relative mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:py-20">
        <div className="max-w-2xl">
          <p data-reveal className="eyebrow mb-6">o problema</p>
          <h2
            data-reveal-title
            className="font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.02] font-semibold tracking-[-0.035em]"
          >
            Todo mês, a mesma rotina manual.
          </h2>
          <p data-reveal className="mt-5 max-w-[52ch] text-ink-soft">
            Planilha que vai e volta por e-mail, alguém digitando de novo, um número
            que não bate e ninguém sabe onde travou. A diferença entre isso e um
            fluxo que roda sozinho é menor do que parece:
          </p>
        </div>

        {/* ── antes → depois ── */}
        <div className="relative mt-10 grid items-center gap-5 md:mt-14 md:grid-cols-[1fr_auto_1fr] md:gap-6">
          {/* mascote analisando a bagunça de cima (desktop) */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-16 left-[30%] z-10 hidden -translate-x-1/2 lg:block"
            data-parallax="1.3"
          >
            <Mascot pose="looking" className="w-20" />
          </div>

          {/* ANTES — a planilha de todo dia */}
          <figure data-reveal className="min-w-0">
            <figcaption className="fig mb-2.5 text-ink-soft">antes · na mão</figcaption>
            <div className="overflow-hidden rounded-2xl border border-[var(--line-strong)] bg-cream shadow-[var(--shadow-card)]">
              <div className="flex h-9 items-center gap-1.5 border-b border-cream-line bg-cream-deep px-3.5">
                <span className="win-dot bg-[#FF5F57]" />
                <span className="win-dot bg-[#FEBC2E]" />
                <span className="win-dot bg-[#28C840]" />
                <span className="mono ml-2 truncate text-[0.68rem] text-ink-soft">
                  controle_financeiro_FINAL_v7(3).xlsx
                </span>
              </div>
              <div className="p-1.5">
                {BEFORE_ROWS.map((r, i) => (
                  <div
                    key={i}
                    className={`grid grid-cols-[minmax(0,1.2fr)_5rem_minmax(0,1fr)] items-center gap-x-3 rounded-lg px-2.5 py-[0.42rem] text-[0.76rem] ${
                      r.bad ? "bg-[oklch(0.58_0.17_25_/_0.07)]" : ""
                    }`}
                  >
                    <span className="mono truncate text-ink">{r.c1}</span>
                    <span
                      className={`mono text-right tabular-nums ${
                        r.c2 === "#REF!" ? "font-semibold text-[oklch(0.52_0.18_25)]" : "text-ink"
                      }`}
                    >
                      {r.c2}
                    </span>
                    <span
                      className={`truncate text-right ${
                        r.bad ? "font-medium text-[oklch(0.52_0.18_25)]" : "text-ink-soft"
                      }`}
                    >
                      {r.c3}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between border-t border-cream-line px-3.5 py-2 text-[0.7rem] text-ink-soft">
                <span>editada por 4 pessoas hoje</span>
                <span className="mono">última versão? ninguém sabe</span>
              </div>
            </div>
          </figure>

          {/* a travessia — live wire rosa */}
          <div aria-hidden className="flex items-center justify-center md:h-full">
            <span className="hidden h-px w-14 bg-pink md:block lg:w-20" />
            <span className="hidden rounded-full border border-pink/30 bg-pink/10 p-2 text-pink-deep md:block">
              <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
            </span>
            <span className="rounded-full border border-pink/30 bg-pink/10 p-2 text-pink-deep md:hidden">
              <ArrowDown className="h-4 w-4" strokeWidth={2.2} />
            </span>
          </div>

          {/* DEPOIS — a mesma rotina, rodando sozinha */}
          <figure data-reveal className="min-w-0">
            <figcaption className="fig mb-2.5">depois · com a MewStack</figcaption>
            <div className="overflow-hidden rounded-2xl border border-night-line bg-night text-paper shadow-[0_24px_60px_-30px_rgba(40,30,40,0.5)]">
              <div className="flex h-9 items-center gap-2 border-b border-night-line px-3.5">
                <span className="live-dot" aria-hidden />
                <span className="mono truncate text-[0.68rem] text-paper-soft">
                  rotina-fechamento · rodando
                </span>
                <span className="mono ml-auto shrink-0 text-[0.66rem] text-paper-soft">06/2026</span>
              </div>
              <ul className="p-1.5">
                {AFTER_STEPS.map((s) => (
                  <li
                    key={s}
                    className="flex items-center gap-2.5 rounded-lg px-2.5 py-[0.52rem] text-[0.8rem]"
                  >
                    <span className="inline-flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-[oklch(0.62_0.13_150_/_0.2)] text-[oklch(0.75_0.13_150)]">
                      <Check className="h-3 w-3" strokeWidth={2.6} />
                    </span>
                    {s}
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between border-t border-night-line px-3.5 py-2 text-[0.7rem] text-paper-soft">
                <span>ninguém digitou nada</span>
                <span className="mono">próxima execução · 18:00</span>
              </div>
            </div>
          </figure>
        </div>

        {/* ── dores que o visitante reconhece ── */}
        <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 md:mt-12">
          {PAINS.map((p) => {
            const Icon = p.icon;
            return (
              <li
                key={p.label}
                data-reveal
                className="flex items-center gap-2.5 rounded-xl border border-[var(--line)] bg-cream px-3.5 py-3 text-[0.86rem] font-medium text-ink"
              >
                <Icon className="h-4 w-4 shrink-0 text-pink-deep" strokeWidth={1.9} />
                {p.label}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
