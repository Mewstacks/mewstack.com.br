import Reveal from "../components/Reveal";

/* ampere BentoGrid "FIG 0.2" pattern: big lead paragraph + 3 mono-labelled
   pillars. Folds in the data-belief from the old Manifesto. */
const PILLARS = [
  {
    fig: "FIG 01",
    title: "Construído pro seu problema",
    desc: "Nada de template. Cada projeto começa no processo real que te trava — e termina num sistema feito sob medida pra ele.",
  },
  {
    fig: "FIG 02",
    title: "A máquina trabalha sozinha",
    desc: "Rotinas agendadas, monitoradas e com alerta quando algo foge do esperado. Você não opera a esteira: ela roda.",
  },
  {
    fig: "FIG 03",
    title: "Dado vira decisão",
    desc: "PDF, CSV, export de sistema legado — entram crus e saem como a decisão pronta pra aplicar, não como mais uma planilha.",
  },
];

export default function Pillars() {
  return (
    <section className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20 sm:px-8 lg:py-28">
      <Reveal>
        <p className="text-[clamp(1.3rem,2.4vw,1.6rem)] font-medium leading-snug tracking-[-0.015em] text-ink max-w-[60ch]">
          Uma nova espécie de estúdio: metade engenharia de software, metade
          engenharia de dados. A gente constrói a máquina que faz o trabalho
          chato no seu lugar —{" "}
          <span className="text-ink-soft">
            do primeiro script ao sistema rodando em produção.
          </span>
        </p>
      </Reveal>

      <div className="mt-14 grid gap-x-12 gap-y-10 border-t border-cream-line pt-12 md:grid-cols-3">
        {PILLARS.map((p, i) => (
          <Reveal key={p.fig} delay={i * 0.08} className="flex flex-col gap-2">
            <span className="fig mb-1">{p.fig}</span>
            <h3 className="font-display text-xl font-semibold tracking-[-0.02em]">{p.title}</h3>
            <p className="text-[0.95rem] leading-relaxed text-ink-soft">{p.desc}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
