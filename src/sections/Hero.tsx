import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import MediaFrame from "../components/MediaFrame";
import HeroSignalMedia from "../components/HeroSignalMedia";
import { SignalScene } from "../components/SignalJourney";
import { gsap } from "../lib/gsap";
import { MOTION, reduceMotion } from "../lib/motion";

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;
      const items = gsap.utils.toArray<HTMLElement>("[data-hero]", section);

      if (reduceMotion()) {
        gsap.set(items, { clearProps: "all", opacity: 1 });
        return;
      }

      gsap
        .timeline({ defaults: { ease: MOTION.ease } })
        .from(items, {
          y: 28,
          opacity: 0,
          duration: 0.9,
          stagger: 0.1,
          delay: 0.12,
        });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="top"
      className="relative min-h-[100svh] overflow-clip bg-paper pt-28 pb-20 sm:pt-32 lg:pt-36 lg:pb-24"
    >
      <div aria-hidden className="paper-vignette pointer-events-none absolute inset-0" />
      <SignalScene scene="hero" />

      <div className="relative z-[var(--z-content)] mx-auto grid max-w-[1200px] grid-cols-1 px-5 sm:px-8 lg:grid-cols-12 lg:gap-x-6">
        <div
          data-hero
          className="section-index mb-7 lg:col-span-3 lg:col-start-1 lg:mb-9"
        >
          <span>00</span>
          <span>bancada do estúdio</span>
        </div>

        <div
          data-hero
          className="mono mb-8 flex gap-x-5 gap-y-1 text-[0.64rem] tracking-[0.06em] text-ink-faint lg:col-span-4 lg:col-start-9 lg:row-start-1 lg:mb-0 lg:items-start lg:justify-end lg:text-right"
        >
          <span className="whitespace-nowrap">SOFTWARE · AUTOMAÇÕES · DADOS</span>
        </div>

        <h1
          data-hero
          className="col-span-full max-w-[14ch] text-hero leading-[0.98] text-ink lg:col-span-10 lg:col-start-1"
        >
          Seus dados já sabem, <em className="font-wonk">a gente revela.</em>
        </h1>

        <p
          data-hero
          className="mt-7 max-w-[52ch] text-lede leading-[1.55] text-ink-soft lg:col-span-6 lg:col-start-1 lg:mt-9"
        >
          A MewStack cria automações, aplicações web, sistemas internos e
          integrações sob medida para centralizar processos, conectar dados e
          reduzir tarefas repetitivas.
        </p>

        <div
          data-hero
          className="mt-7 flex flex-col gap-3 sm:flex-row lg:col-span-6 lg:col-start-1"
        >
          <a href="#contato" className="btn btn-primary w-full sm:w-auto">
            Fale com a gente
          </a>
          <a href="#processo" className="btn btn-ghost w-full sm:w-auto">
            Ver o processo
          </a>
        </div>

        <div
          data-hero
          className="relative z-[-1] mt-12 min-w-0 lg:col-span-10 lg:col-start-3 lg:row-start-5 lg:mt-8"
        >
          <MediaFrame
            ratio="16 / 9"
            captionPosition="top"
            caption={{
              name: "MEWSTACK — OPERAÇÃO",
              type: "●",
            }}
            title="Operação MewStack organizando sinais dispersos"
          >
            <HeroSignalMedia />
          </MediaFrame>
        </div>

        <a
          data-hero
          href="#problema"
          aria-label="Continuar para o problema"
          className="mono mt-9 inline-flex min-h-11 w-fit items-center gap-3 text-[0.66rem] text-ink-faint lg:col-span-2 lg:col-start-1"
        >
          continuar
          <span aria-hidden className="h-6 w-px bg-line-strong" />
        </a>
      </div>
    </section>
  );
}
