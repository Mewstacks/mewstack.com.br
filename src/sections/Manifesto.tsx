import Reveal from "../components/Reveal";
import CountUp from "../components/CountUp";

const STATS = [
  { value: 100, suffix: "%", label: "das rotinas entregues sob monitoramento" },
  { value: 0, suffix: "", label: "planilhas atualizadas na unha" },
  { static: "24/7", label: "as rotinas trabalham enquanto você não está" },
];

export default function Manifesto() {
  return (
    <section className="bg-night text-paper">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-24 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:py-32">
        {/* statement */}
        <Reveal>
          <p className="mb-5 font-medium text-pink-bright">O poder que você já tem</p>
          <h2 className="font-display text-[clamp(2.1rem,4.5vw,3.4rem)] leading-[1.04] font-semibold tracking-[-0.03em] text-paper">
            Transformamos dados não estruturados em decisões{" "}
            <span className="text-pink-bright">altamente aplicáveis.</span>
          </h2>
          <p className="mt-6 max-w-[48ch] leading-relaxed text-paper-soft">
            O dado que resolve seu problema quase sempre já existe — perdido em
            exportações, PDFs e sistemas que não conversam. Nosso trabalho é
            revelar esse poder e colocá-lo para rodar.
          </p>

          {/* search-bar motif */}
          <div className="mt-9 flex max-w-md items-center gap-3 rounded-full border border-night-line bg-night-2 px-5 py-3.5">
            <span className="font-display text-base text-paper italic">
              Como eliminar o trabalho repetitivo?
            </span>
            <span
              aria-hidden
              className="ml-auto inline-block h-5 w-px bg-pink-bright [animation:ping_1.1s_steps(1)_infinite]"
            />
          </div>
        </Reveal>

        {/* stats */}
        <Reveal delay={0.1} className="grid gap-px overflow-hidden rounded-2xl border border-night-line bg-night-line sm:grid-cols-3 lg:grid-cols-1">
          {STATS.map((s) => (
            <div key={s.label} className="bg-night p-7">
              <div className="font-display text-[clamp(2.4rem,5vw,3.4rem)] font-semibold tracking-[-0.03em] text-pink-bright mono">
                {"static" in s ? (
                  s.static
                ) : (
                  <CountUp to={s.value!} suffix={s.suffix} />
                )}
              </div>
              <p className="mt-1 text-paper-soft">{s.label}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
