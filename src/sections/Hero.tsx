import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";

/* ── Hero: intro mínima. Só o badge e o título — sem pitch, sem botões.
   A ideia é convidar o visitante a descer e desbravar o que a MewStack faz
   por conta própria. Os produtos reais aparecem mais pra baixo na rolagem. */
export default function Hero() {
  const reduce = useReducedMotion();

  const rise = (delay: number) =>
    reduce
      ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const },
        };

  return (
    <section
      id="top"
      className="relative flex min-h-[86vh] flex-col items-center justify-center overflow-clip px-5 pt-32 pb-16 text-center sm:px-8"
    >
      {/* ── ambient structure: editorial grid + soft pink aurora ── */}
      <div
        aria-hidden
        className="grid-lines pointer-events-none absolute inset-0 -z-10 opacity-40 [mask-image:radial-gradient(ellipse_70%_55%_at_50%_0%,black,transparent_72%)]"
      />
      <div
        aria-hidden
        className="aurora pointer-events-none absolute top-[-8%] left-1/2 -z-10 h-[52vh] w-[120vw] max-w-[1100px] -translate-x-1/2 rounded-full opacity-30 blur-[120px]"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%, var(--color-pink) 0%, transparent 70%)" }}
      />

      {/* ── centered copy column ── */}
      <div className="mx-auto flex max-w-3xl flex-col items-center">
        <motion.a
          href="#contato"
          {...rise(0)}
          className="group mb-7 inline-flex items-center gap-2.5 rounded-full border border-ink/8 bg-cream-deep/70 py-1.5 pr-2.5 pl-3.5 text-[0.82rem] font-medium tracking-[0.01em] text-ink-soft shadow-[var(--shadow-soft)] backdrop-blur-sm transition-colors hover:border-pink/30"
        >
          <span className="live-dot" aria-hidden />
          Estúdio de software &amp; dados
          <span className="rounded-full border border-ink/10 bg-cream px-2 py-0.5 text-[0.72rem] text-ink-soft transition-colors group-hover:border-pink/30 group-hover:text-pink-deep">
            aberto para projetos →
          </span>
        </motion.a>

        <motion.h1
          {...rise(0.08)}
          className="font-display text-[clamp(2.6rem,7.2vw,5.2rem)] leading-[0.95] font-semibold tracking-[-0.04em]"
        >
          <span className="text-ink-fade">Seus dados já sabem</span>
          <br />
          <span className="text-gradient">a gente revela.</span>
        </motion.h1>
      </div>

      {/* ── scroll cue: convida a descer e explorar ── */}
      <motion.a
        href="#servicos"
        {...rise(0.24)}
        aria-label="Explorar o que a gente faz"
        className="absolute bottom-7 left-1/2 -translate-x-1/2 inline-flex flex-col items-center gap-1.5 text-[0.72rem] font-medium tracking-[0.14em] text-ink-soft uppercase transition-colors hover:text-pink-deep"
      >
        explore
        <ChevronDown className="h-4 w-4 animate-bounce" strokeWidth={2} aria-hidden />
      </motion.a>
    </section>
  );
}
