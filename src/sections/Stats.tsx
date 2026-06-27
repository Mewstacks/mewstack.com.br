import { useRef } from "react";
import { useChapter } from "../lib/useChapter";
import { useCountUp } from "../lib/useCountUp";

/* ── Stats: a quiet "by the numbers" beat between the product gallery and the
   call to action. Numbers count up from zero as they enter (once), reinforcing
   the studio's output without a heavy visual.

   NOTE: the figures below are honest placeholders — swap for real studio
   metrics during review. Shape stays the same. */
type Stat = {
  end: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
};

const STATS: Stat[] = [
  { end: 12000, prefix: "+", label: "documentos processados sem ninguém digitar" },
  { end: 480, suffix: "h", label: "de trabalho repetitivo economizadas por mês" },
  { end: 9, label: "rotinas rodando sozinhas em produção" },
  { end: 99.9, suffix: "%", decimals: 1, label: "de precisão na conferência fiscal" },
];

export default function Stats() {
  const root = useRef<HTMLElement>(null);
  useChapter(root);

  return (
    <section
      ref={root}
      id="numeros"
      className="mx-auto max-w-6xl scroll-mt-24 px-5 py-14 sm:px-8 lg:py-20"
    >
      <div className="max-w-2xl">
        <p data-reveal className="eyebrow mb-6">
          em números
        </p>
        <h2
          data-reveal-title
          className="font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.04] font-semibold tracking-[-0.035em]"
        >
          O que sai do piloto automático.
        </h2>
      </div>

      <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-x-10 lg:grid-cols-4">
        {STATS.map((s) => (
          <StatItem key={s.label} {...s} />
        ))}
      </dl>
    </section>
  );
}

function StatItem({ end, prefix, suffix, decimals, label }: Stat) {
  const num = useRef<HTMLSpanElement>(null);
  useCountUp(
    num,
    end,
    decimals
      ? { format: (v) => v.toFixed(decimals).replace(".", ",") }
      : undefined,
  );

  return (
    <div data-reveal className="border-t border-cream-line pt-5">
      <dd className="font-display text-[clamp(2.6rem,6vw,4rem)] font-semibold leading-none tracking-[-0.04em] text-pink-deep">
        {prefix && <span>{prefix}</span>}
        <span ref={num} className="tabular-nums">
          0
        </span>
        {suffix && <span>{suffix}</span>}
      </dd>
      <dt className="mt-3 max-w-[24ch] text-[0.92rem] leading-relaxed text-ink-soft">
        {label}
      </dt>
    </div>
  );
}
