import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import MediaFrame from "../components/MediaFrame";
import SignalLine from "../components/SignalLine";
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

      const mm = gsap.matchMedia();
      mm.add(MOTION.desktop, () => {
        gsap.to("[data-hero-stage]", {
          yPercent: -5,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });
      return () => mm.revert();
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
      <SignalLine
        draw="load"
        viewBox="0 0 1200 950"
        path="M42 -20 L42 115 C42 170 16 190 42 238 C75 298 35 365 42 432 C48 490 110 505 238 505 L360 505 C430 505 455 548 520 548"
        className="pointer-events-none absolute inset-y-0 left-1/2 z-[var(--z-wire)] hidden h-full w-full max-w-[1200px] -translate-x-1/2 lg:block"
      />
      <SignalLine
        draw="load"
        viewBox="0 0 40 900"
        path="M20 -20 L20 900"
        className="pointer-events-none absolute inset-y-0 left-0 z-[var(--z-wire)] h-full w-10 lg:hidden"
      />

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
          className="mono mb-8 flex flex-wrap gap-x-5 gap-y-1 text-[0.64rem] tracking-[0.06em] text-ink-faint lg:col-span-2 lg:col-start-11 lg:row-start-1 lg:mb-0 lg:flex-col lg:items-end lg:text-right"
        >
          <span>EST. 2024 · POA/BR</span>
          <span>SOFTWARE · AUTOMAÇÕES · DADOS</span>
        </div>

        <h1
          data-hero
          className="col-span-full max-w-[14ch] text-hero leading-[0.98] text-ink lg:col-span-10 lg:col-start-1"
        >
          Seu processo, enfim, ganha <em className="font-wonk">sinal.</em>
        </h1>

        <p
          data-hero
          className="mt-7 max-w-[52ch] text-lede leading-[1.55] text-ink-soft lg:col-span-6 lg:col-start-1 lg:mt-9"
        >
          A MewStack transforma rotinas manuais e dados espalhados em software
          sob medida — simples de operar, monitorado e pronto para trabalhar todo dia.
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
          data-hero-stage
          className="relative z-[-1] mt-12 min-w-0 lg:col-span-10 lg:col-start-3 lg:row-start-5 lg:mt-8"
        >
          <MediaFrame
            ratio="16 / 9"
            captionPosition="top"
            caption={{
              name: "MEWSTACK — OPERAÇÃO",
              detail: "SINAL 01 / AO VIVO",
              type: "●",
            }}
            title="Operação MewStack em standby"
          >
            <div className="relative h-full overflow-hidden bg-night text-paper-on-night">
              <div className="grain pointer-events-none absolute inset-0 opacity-[0.045]" />
              <svg
                aria-hidden
                viewBox="0 0 1200 675"
                preserveAspectRatio="none"
                className="absolute inset-0 h-full w-full"
              >
                <path
                  className="standby-wave"
                  d="M-40 350 C70 350 105 238 180 238 S292 452 380 452 S505 180 590 180 S720 405 805 405 S930 285 1005 285 S1128 350 1240 350"
                  fill="none"
                  stroke="var(--color-signal)"
                  strokeWidth="2"
                  strokeDasharray="18 14"
                  vectorEffect="non-scaling-stroke"
                />
                <path
                  d="M0 350 H1200"
                  fill="none"
                  stroke="var(--color-night-line)"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
              <div className="mono absolute top-5 left-5 text-[0.58rem] tracking-[0.06em] text-paper-on-night-soft sm:top-8 sm:left-8 sm:text-[0.7rem]">
                <span className="signal-dot mr-2" data-pulse="true" />
                AGUARDANDO SINAL
              </div>
              <div className="mono absolute right-5 bottom-5 text-right text-[0.52rem] leading-relaxed tracking-[0.05em] text-paper-on-night-soft sm:right-8 sm:bottom-8 sm:text-[0.66rem]">
                <p>30°01&apos;59&quot;S · 51°13&apos;48&quot;W</p>
                <p>CANAL 01 · STANDBY</p>
              </div>
            </div>
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
