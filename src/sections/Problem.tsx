import { useRef } from "react";
import { Check, Minus } from "lucide-react";
import { SignalScene } from "../components/SignalJourney";
import { useChapter } from "../lib/useChapter";

const BLOCKERS = [
  "Tarefas repetitivas e manuais",
  "Informações dispersas",
  "Processos lentos e difíceis de acompanhar",
  "Retrabalho e risco de erro",
];

const DELIVERIES = [
  "Automações sob medida",
  "Sistemas e aplicações web",
  "Integrações entre ferramentas e dados",
  "Processos centralizados, claros e escaláveis",
];

function ComparisonList({
  items,
  variant,
}: {
  items: string[];
  variant: "problem" | "solution";
}) {
  const Icon = variant === "problem" ? Minus : Check;

  return (
    <ul className="mt-7 border-t border-line-strong">
      {items.map((item, index) => (
        <li
          key={item}
          className="grid min-w-0 grid-cols-[2rem_1fr] gap-3 border-b border-line py-4 sm:grid-cols-[2.5rem_1fr]"
        >
          <span
            aria-hidden
            className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded-full border ${
              variant === "solution"
                ? "border-signal bg-signal-ghost text-signal-deep"
                : "border-line-strong text-ink-faint"
            }`}
          >
            <Icon className="h-3.5 w-3.5" strokeWidth={2} />
          </span>
          <div className="min-w-0">
            <span className="mono text-[0.62rem] text-ink-faint">
              {String(index + 1).padStart(2, "0")}
            </span>
            <p className="mt-1 text-base leading-relaxed text-ink">{item}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function Problem() {
  const root = useRef<HTMLElement>(null);
  useChapter(root, { enter: false, exit: false });

  return (
    <section
      ref={root}
      id="problema"
      className="relative scroll-mt-24 overflow-clip border-y border-line bg-paper-rose"
    >
      <div aria-hidden className="paper-vignette pointer-events-none absolute inset-0" />
      <SignalScene scene="problem" />
      <div className="relative z-[var(--z-content)] mx-auto max-w-[1200px] px-5 py-20 sm:px-8 lg:py-28">
        <div className="grid gap-6 lg:grid-cols-12">
          <p data-reveal className="section-index lg:col-span-3">
            <span>01</span>
            <span>o problema</span>
          </p>
          <div className="lg:col-span-8 lg:col-start-5">
            <h2 data-reveal-title className="max-w-[13ch] text-h2 leading-[1.04] text-ink">
              Quando as ferramentas não se conectam, o time vira a integração.
            </h2>
            <p data-reveal className="mt-6 max-w-[62ch] text-lede text-ink-soft">
              O custo aparece em tarefas repetitivas, informação dispersa,
              processos lentos e retrabalho. A solução começa organizando o fluxo,
              não adicionando mais uma ferramenta solta.
            </p>
          </div>
        </div>

        <div
          aria-hidden
          data-signal-anchor="problem-signal"
          className="h-24 sm:h-28 lg:h-32"
        />

        <div
          data-reveal
          data-signal-anchor="problem-flow"
          className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_5rem_minmax(0,1fr)] lg:items-stretch lg:gap-0"
        >
          <article className="min-w-0 border border-line-strong bg-paper-rose/95 p-5 shadow-[var(--shadow-soft)] sm:p-7 lg:rounded-l-lg">
            <div className="mono flex items-center justify-between gap-4 text-[0.66rem] text-ink-faint">
              <span>SITUAÇÃO ATUAL</span>
              <span>RUÍDO</span>
            </div>
            <h3 className="mt-5 max-w-[18ch] text-h3 leading-tight text-ink">
              O que trava sua operação hoje
            </h3>
            <p className="mt-3 max-w-[46ch] text-[0.94rem] leading-relaxed text-ink-soft">
              O time compensa falhas de fluxo com atenção, memória e esforço manual.
            </p>
            <ComparisonList items={BLOCKERS} variant="problem" />
          </article>

          <div
            aria-hidden
            className="relative flex min-h-16 items-center justify-center lg:min-h-0"
          >
            <span className="absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2 bg-line-strong lg:top-1/2 lg:right-0 lg:bottom-auto lg:left-0 lg:h-px lg:w-full lg:translate-x-0" />
            <span className="relative flex h-9 w-9 items-center justify-center rounded-full border border-signal bg-paper-rose shadow-[var(--shadow-signal)]">
              <span className="h-1.5 w-1.5 rounded-full bg-signal" />
            </span>
          </div>

          <article className="min-w-0 border border-line-strong bg-paper-high/95 p-5 shadow-[var(--shadow-soft)] sm:p-7 lg:rounded-r-lg">
            <div className="mono flex items-center justify-between gap-4 text-[0.66rem] text-ink-faint">
              <span>COM A MEWSTACK</span>
              <span>FLUXO</span>
            </div>
            <h3 className="mt-5 max-w-[18ch] text-h3 leading-tight text-ink">
              O que a MewStack constrói
            </h3>
            <p className="mt-3 max-w-[46ch] text-[0.94rem] leading-relaxed text-ink-soft">
              Software sob medida para automatizar, centralizar e dar visibilidade à operação.
            </p>
            <ComparisonList items={DELIVERIES} variant="solution" />
          </article>
        </div>
      </div>
    </section>
  );
}
