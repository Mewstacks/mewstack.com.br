import { motion, useReducedMotion } from "framer-motion";
import Reveal from "../components/Reveal";

/* ── Process: uma linha do tempo enxuta. Três nós numerados sobre um trilho
   (hairline + "live wire" rosa que desenha ao entrar na tela), do entendimento
   do problema à máquina rodando sozinha. Horizontal no desktop, vertical no
   mobile. Sem cards/visuais — o foco é a sequência. */
const STEPS = [
  {
    n: "01",
    title: "Diagnóstico",
    desc: "Entendo seu processo de ponta a ponta e mapeio exatamente onde o seu tempo e o seu dinheiro escapam.",
  },
  {
    n: "02",
    title: "Construção",
    desc: "Software e rotinas sob medida, conectados às ferramentas que você já usa. Nada de retrabalho.",
  },
  {
    n: "03",
    title: "Operação",
    desc: "Roda sozinho e monitorado. Você não recebe planilha, recebe a decisão já pronta para aplicar.",
  },
];

export default function Process() {
  const reduce = useReducedMotion();

  return (
    <section
      id="processo"
      className="mx-auto max-w-5xl scroll-mt-24 px-5 py-14 sm:px-8 lg:py-20"
    >
      <Reveal className="max-w-2xl">
        <p className="eyebrow mb-6">processo</p>
        <h2 className="font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.02] font-semibold tracking-[-0.035em]">
          Da bagunça ao botão que roda sozinho.
        </h2>
      </Reveal>

      {/* ── timeline ── */}
      <div className="relative mt-14 lg:mt-16">
        {/* desktop rail behind the nodes: hairline base + pink live wire drawing in */}
        <div
          aria-hidden
          className="absolute top-6 right-0 left-6 hidden h-px bg-cream-line md:block"
        />
        <motion.div
          aria-hidden
          className="absolute top-6 right-0 left-6 hidden h-px origin-left bg-pink md:block"
          initial={reduce ? false : { scaleX: 0 }}
          whileInView={reduce ? {} : { scaleX: 1 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        />

        <ol className="grid gap-x-8 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal
              as="li"
              key={s.n}
              delay={i * 0.12}
              className="relative flex gap-5 pb-9 last:pb-0 md:block md:pb-0"
            >
              {/* node column (vertical connector on mobile) */}
              <div className="relative flex flex-col items-center md:block">
                <span className="relative z-10 inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-cream-line bg-cream-deep font-display text-sm font-semibold tabular-nums text-pink-deep shadow-[var(--shadow-soft)]">
                  {s.n}
                </span>
                {i < STEPS.length - 1 && (
                  <span aria-hidden className="mt-2 w-px flex-1 bg-cream-line md:hidden" />
                )}
              </div>

              <div className="md:mt-6">
                <h3 className="font-display text-xl font-semibold tracking-[-0.02em] sm:text-[1.4rem]">
                  {s.title}
                </h3>
                <p className="mt-2.5 max-w-[34ch] text-[0.98rem] leading-relaxed text-ink-soft">
                  {s.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
