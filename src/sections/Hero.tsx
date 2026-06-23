import { motion, useReducedMotion, type Variants } from "framer-motion";
import Logo from "../components/Logo";

const DATA_CHIPS = [
  { label: "CSV", x: "-8%", y: "12%", d: 0 },
  { label: "PDF", x: "82%", y: "4%", d: 0.4 },
  { label: "API", x: "90%", y: "62%", d: 0.8 },
  { label: "SQL", x: "-12%", y: "68%", d: 1.2 },
  { label: "WhatsApp", x: "60%", y: "92%", d: 1.6 },
];

const TAGLINE = [
  "Software & Automações",
  "Rotinas Inteligentes",
  "Data Processing",
];

export default function Hero() {
  const reduce = useReducedMotion();

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
  };
  const item: Variants = reduce
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 20 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
        },
      };

  return (
    <section
      id="top"
      className="relative overflow-clip px-5 pt-28 pb-0 sm:px-8 lg:pt-36"
    >
      {/* soft pink field behind the mascot */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/4 right-[-10%] -z-10 h-[60vh] w-[60vh] rounded-full opacity-60 blur-[80px]"
        style={{ background: "radial-gradient(circle, var(--color-pink) 0%, transparent 65%)" }}
      />

      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        {/* ---- copy ---- */}
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.p
            variants={item}
            className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-cream-line bg-cream-deep/60 px-3.5 py-1.5 text-sm font-medium text-ink-soft"
          >
            <span className="live-dot" aria-hidden />
            Estúdio de software &amp; dados · aberto para projetos
          </motion.p>

          <motion.h1
            variants={item}
            className="font-display text-[clamp(2.6rem,7.5vw,5.4rem)] leading-[0.95] font-semibold tracking-[-0.035em]"
          >
            Seus dados já
            <br />
            sabem a resposta.
            <br />
            <span className="text-pink-deep">A gente revela.</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-7 max-w-[46ch] text-[1.075rem] leading-relaxed text-ink-soft"
          >
            A MewStack transforma dados não estruturados em decisões de negócio
            aplicáveis — e elimina o trabalho repetitivo com software sob medida
            e rotinas inteligentes.
          </motion.p>

          <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#contato"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-base font-medium text-cream transition-transform duration-300 ease-[var(--ease-quart)] hover:-translate-y-0.5"
            >
              Começar um projeto
              <span aria-hidden>→</span>
            </a>
            <a
              href="#processo"
              className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-6 py-3 text-base font-medium text-ink transition-colors duration-300 hover:border-ink/50"
            >
              Ver como funciona
            </a>
          </motion.div>
        </motion.div>

        {/* ---- mascot rig ---- */}
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.92 }}
          animate={reduce ? {} : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto aspect-square w-full max-w-[30rem]"
        >
          <div className={reduce ? "" : "animate-float h-full w-full"}>
            <Logo
              variant="vector"
              priority
              alt="Mascote MewStack — gato com headset de atendimento"
              className="h-full w-full object-contain drop-shadow-[0_30px_50px_rgba(40,30,40,0.18)]"
            />
          </div>

          {/* orbiting source-data chips flowing into the cat */}
          {DATA_CHIPS.map((c) => (
            <motion.span
              key={c.label}
              className="mono absolute rounded-lg border border-ink/15 bg-cream-deep px-2.5 py-1 text-xs font-medium text-ink shadow-[0_6px_16px_rgba(40,30,40,0.10)]"
              style={{ left: c.x, top: c.y }}
              initial={reduce ? false : { opacity: 0, scale: 0.6 }}
              animate={
                reduce
                  ? {}
                  : { opacity: 1, scale: 1, y: [0, -8, 0] }
              }
              transition={{
                opacity: { delay: 0.6 + c.d * 0.12, duration: 0.5 },
                scale: { delay: 0.6 + c.d * 0.12, duration: 0.5 },
                y: { duration: 4 + c.d, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              {c.label}
            </motion.span>
          ))}
        </motion.div>
      </div>

      {/* tagline marquee — echoes the brand mark */}
      <div className="relative mt-16 overflow-hidden border-y border-cream-line py-3.5 sm:mt-24">
        <div
          className={`flex w-max ${reduce ? "" : "[animation:marquee_28s_linear_infinite]"}`}
        >
          {[0, 1].map((dup) => (
            <ul
              key={dup}
              aria-hidden={dup === 1}
              className="flex shrink-0 items-center"
            >
              {TAGLINE.concat(TAGLINE).map((t, i) => (
                <li key={i} className="flex items-center">
                  <span className="px-6 font-display text-lg font-medium tracking-[-0.02em] text-ink">
                    {t}
                  </span>
                  <span className="text-pink" aria-hidden>✦</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
