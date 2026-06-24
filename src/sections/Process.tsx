import type { ReactElement } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Reveal from "../components/Reveal";

/* ── per-step mini visuals (lightweight CSS/SVG, the "machine" motif) ── */
function MapVisual(): ReactElement {
  return (
    <div className="grid h-full grid-cols-3 items-center gap-3 p-6">
      {["Planilhas", "PDFs", "WhatsApp", "Sistema legado", "E-mails", "APIs"].map((s) => (
        <div
          key={s}
          className="rounded-lg border border-cream-line bg-cream-deep px-2.5 py-2 text-center text-[0.72rem] font-medium text-ink-soft"
        >
          {s}
        </div>
      ))}
    </div>
  );
}

function BuildVisual(): ReactElement {
  const lines = [
    { w: "70%", tone: "add" },
    { w: "55%", tone: "neutral" },
    { w: "82%", tone: "neutral" },
    { w: "48%", tone: "add" },
    { w: "64%", tone: "neutral" },
  ];
  return (
    <div className="flex h-full flex-col justify-center gap-2 p-6 font-mono">
      {lines.map((l, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-3 text-[0.7rem] text-ink-soft/40">{i + 1}</span>
          <span
            className={`h-2.5 rounded-sm ${l.tone === "add" ? "bg-pink/35" : "bg-ink/12"}`}
            style={{ width: l.w }}
          />
        </div>
      ))}
    </div>
  );
}

function RunVisual(): ReactElement {
  const pts = [6, 10, 7, 14, 9, 16, 12, 18];
  const W = 220, H = 84;
  const path = pts
    .map((v, i) => `${i === 0 ? "M" : "L"}${(i / (pts.length - 1)) * W},${H - (v / 20) * H}`)
    .join(" ");
  return (
    <div className="flex h-full flex-col justify-center gap-3 p-6">
      <div className="flex items-center gap-2">
        <span className="live-dot" aria-hidden />
        <span className="text-[0.78rem] font-medium text-ink">Rodando · 99,9% no prazo</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-20 w-full" preserveAspectRatio="none">
        <path d={`${path} L${W},${H} L0,${H} Z`} fill="var(--color-pink)" opacity="0.1" />
        <path d={path} fill="none" stroke="var(--color-pink)" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

const STEPS: { n: string; title: string; desc: string; visual: ReactElement }[] = [
  {
    n: "01",
    title: "Mergulho",
    desc: "Entendo seu processo de ponta a ponta e mapeio exatamente onde o tempo — e o dinheiro — escapa.",
    visual: <MapVisual />,
  },
  {
    n: "02",
    title: "Construção",
    desc: "Software e rotinas sob medida, conectados às ferramentas que você já usa. Nada de retrabalho.",
    visual: <BuildVisual />,
  },
  {
    n: "03",
    title: "Operação",
    desc: "Roda sozinho, monitorado. Você não recebe planilha — recebe a decisão já pronta para aplicar.",
    visual: <RunVisual />,
  },
];

export default function Process() {
  const reduce = useReducedMotion();

  return (
    <section id="processo" className="mx-auto max-w-5xl scroll-mt-24 px-5 py-20 sm:px-8 lg:py-28">
      <Reveal className="max-w-2xl">
        <p className="eyebrow mb-6">processo</p>
        <h2 className="font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.02] font-semibold tracking-[-0.035em]">
          Da bagunça ao botão que roda sozinho.
        </h2>
      </Reveal>

      <div className="mt-16 flex flex-col gap-16 lg:gap-24">
        {STEPS.map((s, i) => {
          const reversed = i % 2 === 1;
          return (
            <div
              key={s.n}
              className={`flex flex-col items-center gap-8 md:gap-14 ${
                reversed ? "md:flex-row-reverse" : "md:flex-row"
              }`}
            >
              <motion.div
                initial={reduce ? false : { opacity: 0, x: reversed ? 30 : -30 }}
                whileInView={reduce ? {} : { opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="flex-1"
              >
                <div className="flex items-center gap-3">
                  <span className="mono font-display text-sm font-semibold text-pink-deep">{s.n}</span>
                  <span className="h-px flex-1 max-w-16 bg-cream-line" />
                </div>
                <h3 className="mt-4 font-display text-[1.8rem] font-semibold tracking-[-0.02em] sm:text-[2rem]">
                  {s.title}
                </h3>
                <p className="mt-3 max-w-[44ch] text-[1.05rem] leading-relaxed text-ink-soft">{s.desc}</p>
              </motion.div>

              <motion.div
                initial={reduce ? false : { opacity: 0, x: reversed ? -30 : 30 }}
                whileInView={reduce ? {} : { opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="card relative aspect-[16/10] w-full flex-1 overflow-hidden"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-25 blur-3xl"
                  style={{ background: "radial-gradient(circle, var(--color-pink) 0%, transparent 70%)" }}
                />
                <div className="relative h-full">{s.visual}</div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
