import Reveal from "../components/Reveal";

const STEPS = [
  {
    n: "01",
    title: "Mergulho",
    desc: "Entendo seu processo de ponta a ponta e mapeio exatamente onde o tempo — e o dinheiro — escapa.",
  },
  {
    n: "02",
    title: "Construção",
    desc: "Software e rotinas sob medida, conectados às ferramentas que você já usa. Nada de retrabalho.",
  },
  {
    n: "03",
    title: "Operação",
    desc: "Roda sozinho, monitorado. Você não recebe planilha — recebe a decisão já pronta para aplicar.",
  },
];

export default function Process() {
  return (
    <section
      id="processo"
      className="mx-auto max-w-7xl scroll-mt-24 px-5 py-24 sm:px-8 lg:py-32"
    >
      <Reveal className="max-w-2xl">
        <h2 className="font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.02] font-semibold tracking-[-0.03em]">
          Da bagunça ao botão que roda sozinho.
        </h2>
      </Reveal>

      <div className="relative mt-16">
        {/* flowing pink wire connecting the steps (desktop) */}
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-7 hidden h-2 w-full lg:block"
          preserveAspectRatio="none"
          viewBox="0 0 1000 8"
        >
          <line x1="0" y1="4" x2="1000" y2="4" stroke="var(--color-cream-line)" strokeWidth="2" />
          <line
            x1="0"
            y1="4"
            x2="1000"
            y2="4"
            stroke="var(--color-pink)"
            strokeWidth="2"
            strokeDasharray="6 14"
            style={{ animation: "wire-flow 16s linear infinite" }}
          />
        </svg>

        <ol className="grid gap-12 lg:grid-cols-3 lg:gap-10">
          {STEPS.map((s, i) => (
            <Reveal as="li" key={s.n} delay={i * 0.12} className="relative">
              <span
                className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border border-cream-line bg-cream font-display text-lg font-semibold text-pink-deep mono"
              >
                {s.n}
              </span>
              <h3 className="mt-6 font-display text-2xl font-semibold tracking-[-0.02em]">
                {s.title}
              </h3>
              <p className="mt-3 max-w-[38ch] text-ink-soft">{s.desc}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
