import { useRef } from "react";
import { Boxes, Workflow, Database, Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "../lib/gsap";
import { reduceMotion } from "../lib/motion";
import { useChapter } from "../lib/useChapter";
import { useMagnetic } from "../lib/useMagnetic";
import Mascot from "../components/Mascot";

/* ── Capabilities: primeira batida charcoal da narrativa — o visitante entra na
   "sala de máquinas" logo depois de reconhecer o problema. Fundo night com grid
   técnico e glow rosa; os 3 cards são painéis (night-2, hairline night-line) com
   cabeçalho mono, como módulos de um sistema. Ritmo Railway: cada seção é uma
   cena com atmosfera própria, não cards soltos em fundo branco. */

type Service = {
  icon: LucideIcon;
  title: string;
  mod: string; // cabeçalho mono do painel — o "nome do módulo"
  desc: string;
  checks: string[];
  span: string;
};

const SERVICES: Service[] = [
  {
    icon: Boxes,
    title: "Software & Automações",
    mod: "sistemas · sob-medida",
    desc: "Sistemas sob medida e robôs que executam suas rotinas, integrados ao que você já usa, sem planilha no meio do caminho.",
    checks: ["Sistemas sob medida", "Integrações & APIs", "Bots & scripts"],
    span: "md:col-span-7",
  },
  {
    icon: Workflow,
    title: "Rotinas Inteligentes",
    mod: "rotinas · agendadas",
    desc: "Tarefas repetitivas viram processos que rodam sozinhos: agendados, monitorados e com alerta quando algo foge do esperado.",
    checks: ["Pipelines agendados", "Monitoramento & alertas", "Relatórios automáticos"],
    span: "md:col-span-5",
  },
  {
    icon: Database,
    title: "Data Processing",
    mod: "dados · em-escala",
    desc: "Volume de documento que ninguém dá conta de conferir na mão. A gente lê, valida e organiza no formato que o seu time realmente usa.",
    checks: ["Limpeza & ETL", "Estruturação", "Dashboards", "Dado → decisão"],
    span: "md:col-span-12",
  },
];

export default function Capabilities() {
  const root = useRef<HTMLElement>(null);
  useChapter(root);
  // Subtle magnetic drift on the cards (desktop/fine-pointer) — depth without jank.
  useMagnetic(root, "[data-magnetic]", { strength: 0.12, max: 12 });

  // Mascote muda de humor com a cena: entra FOCADO (analisando o problema) e,
  // quando os cards de solução aparecem, comemora — crossfade + pop, reversível
  // ao voltar o scroll. Reduced motion: pose final estática, sem swap.
  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const focused = q("[data-cap='m-focused']");
      const celebrating = q("[data-cap='m-celebrating']");
      const cards = q("[data-cap='cards']");
      if (!focused.length || !celebrating.length || !cards.length) return;

      if (reduceMotion()) {
        gsap.set(focused, { autoAlpha: 0 });
        gsap.set(celebrating, { autoAlpha: 1 });
        return;
      }

      gsap.set(celebrating, { autoAlpha: 0, scale: 0.86, y: 8 });
      const swap = gsap
        .timeline({ paused: true, defaults: { ease: "power3.out", duration: 0.45 } })
        .to(focused, { autoAlpha: 0, scale: 0.9, y: -6 }, 0)
        .to(celebrating, { autoAlpha: 1, scale: 1, y: 0, ease: "back.out(2)" }, 0.12);

      ScrollTrigger.create({
        trigger: cards[0],
        start: "top 72%",
        onEnter: () => swap.play(),
        onLeaveBack: () => swap.reverse(),
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="servicos"
      className="relative scroll-mt-24 overflow-clip bg-night text-paper"
    >
      {/* ambiência sala de máquinas — grid técnico + glow rosa (mesma família da Accounting) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_85%_70%_at_50%_20%,black,transparent_80%)]"
        style={{
          backgroundImage:
            "linear-gradient(to right, oklch(1 0 0 / 0.045) 1px, transparent 1px), linear-gradient(to bottom, oklch(1 0 0 / 0.045) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <div
        aria-hidden
        data-parallax="1.15"
        className="pointer-events-none absolute -top-24 left-[-8%] -z-10 h-[42vh] w-[55vw] max-w-[700px] rounded-full opacity-25 blur-[130px]"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, var(--color-pink) 0%, transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:py-20">
        {/* mascote da cena — focado → comemorando (os dois empilhados p/ crossfade) */}
        <div aria-hidden className="pointer-events-none absolute top-10 right-2 hidden lg:block">
          <div className="grid [&>*]:col-start-1 [&>*]:row-start-1">
            <div data-cap="m-focused">
              <Mascot pose="focused" className="w-20" floatDelay="0.4s" />
            </div>
            <div data-cap="m-celebrating">
              <Mascot pose="celebrating" className="w-20" floatDelay="0.4s" />
            </div>
          </div>
        </div>
        <div className="max-w-2xl">
          <p data-reveal className="eyebrow mb-6 text-paper-soft">a solução</p>
          <h2
            data-reveal-title
            className="font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.02] font-semibold tracking-[-0.035em] text-paper"
          >
            A tecnologia se molda ao seu processo. Não o contrário.
          </h2>
          <p data-reveal className="mt-5 max-w-[52ch] text-paper-soft">
            Primeiro a gente entende como sua empresa funciona. Depois constrói em
            três frentes — sempre em cima do seu fluxo real:
          </p>
        </div>

        <div data-cap="cards" className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-12">
          {SERVICES.map((s) => {
            const Icon = s.icon;
            const wide = s.span === "md:col-span-12";
            return (
              <div data-reveal key={s.title} className={`sm:col-span-2 ${s.span}`}>
                <article
                  data-magnetic
                  className={`group relative h-full overflow-hidden rounded-2xl border border-night-line bg-night-2/60 shadow-[0_24px_60px_-32px_rgba(0,0,0,0.7)] transition-[border-color,box-shadow] duration-300 ease-[var(--ease-quart)] will-change-transform hover:border-pink/45 hover:shadow-[0_0_0_1px_oklch(0.745_0.155_356_/_0.2),0_24px_60px_-28px_oklch(0.745_0.155_356_/_0.35)]`}
                >
                  {/* cabeçalho mono do painel — módulo do sistema */}
                  <div className="flex items-center gap-2 border-b border-night-line/70 px-5 py-2.5 sm:px-6">
                    <span className="live-dot" aria-hidden />
                    <span className="mono text-[0.68rem] text-paper-soft">{s.mod}</span>
                    <span className="mono ml-auto text-[0.64rem] text-paper-soft/60">rodando</span>
                  </div>

                  {/* hover spotlight */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-25"
                    style={{ background: "radial-gradient(circle, var(--color-pink) 0%, transparent 70%)" }}
                  />

                  <div
                    className={`p-6 sm:p-7 ${
                      wide ? "flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between" : "flex flex-col"
                    }`}
                  >
                    <div className={wide ? "lg:max-w-[46ch]" : ""}>
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-night-line bg-night text-pink-bright">
                        <Icon className="h-5 w-5" strokeWidth={1.8} />
                      </span>
                      <h3 className="mt-5 font-display text-2xl font-semibold tracking-[-0.02em] text-paper transition-colors group-hover:text-pink-bright">
                        {s.title}
                      </h3>
                      <p className="mt-2.5 text-paper-soft">{s.desc}</p>
                    </div>

                    <ul className={`mt-6 grid gap-2.5 ${wide ? "shrink-0 sm:grid-cols-2 lg:mt-0" : ""}`}>
                      {s.checks.map((c) => (
                        <li key={c} className="flex items-center gap-2.5 text-[0.92rem] text-paper">
                          <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-pink/20 text-pink-bright">
                            <Check className="h-3 w-3" strokeWidth={2.5} />
                          </span>
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
