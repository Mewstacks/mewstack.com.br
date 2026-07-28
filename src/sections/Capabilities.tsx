import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import MediaFrame from "../components/MediaFrame";
import { SignalScene } from "../components/SignalJourney";
import { gsap, ScrollTrigger } from "../lib/gsap";
import { MOTION, reduceMotion } from "../lib/motion";
import { useChapter } from "../lib/useChapter";

type Service = {
  title: string;
  description: string;
  capabilities: string[];
  instrument: "terminal" | "blueprint" | "columns";
};

const SERVICES: Service[] = [
  {
    title: "Automações e integrações",
    description:
      "Tarefas repetitivas passam a rodar sozinhas e as ferramentas que hoje não se falam começam a trocar informação entre si. Sem redigitar, sem copiar e colar.",
    capabilities: ["ROTINAS AUTOMÁTICAS", "APIs & INTEGRAÇÕES", "AGENDAMENTOS"],
    instrument: "terminal",
  },
  {
    title: "Aplicações web e sistemas internos",
    description:
      "Um software desenhado para o jeito que o negócio funciona, que centraliza a operação em um lugar só, no lugar da planilha esticada e do sistema genérico adaptado na marra.",
    capabilities: ["SISTEMAS SOB MEDIDA", "PORTAIS INTERNOS", "FLUXOS DO SEU JEITO"],
    instrument: "blueprint",
  },
  {
    title: "Dados e monitoramento",
    description:
      "A informação espalhada vira uma leitura só, organizada e confiável, com alertas que avisam quando algo foge do esperado, antes de virar problema.",
    capabilities: ["ORGANIZAÇÃO DE DADOS", "RELATÓRIOS & LEITURAS", "ALERTAS"],
    instrument: "columns",
  },
];

const BAR_HEIGHTS = [38, 72, 52, 88, 64];

function Instrument({ type }: { type: Service["instrument"] }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el || reduceMotion()) return;

      const dial = MOTION.instrument;
      const master = gsap.timeline({ paused: true });

      if (type === "terminal") {
        const texts = gsap.utils.toArray<HTMLElement>("[data-term-text]", el);
        const carets = gsap.utils.toArray<HTMLElement>("[data-term-caret]", el);
        const chip = el.querySelector<HTMLElement>("[data-term-chip]");
        const fullLines = texts.map((line) => line.textContent ?? "");

        gsap.set(texts, { text: "" });
        gsap.set(carets, { autoAlpha: 0 });
        if (chip) gsap.set(chip, { autoAlpha: 0 });

        master.set(texts, { text: "" }, 0);
        master.set(carets, { autoAlpha: 0 }, 0);
        if (chip) master.set(chip, { autoAlpha: 0, y: 4 }, 0);

        let cursor = 0.2;
        fullLines.forEach((full, index) => {
          const duration = Math.max(0.35, (full.length / 26) * dial.typeDuration);
          master.set(carets[index], { autoAlpha: 1 }, cursor);
          master.to(
            texts[index],
            { text: full, duration, ease: "none" },
            cursor,
          );
          cursor += duration;
          if (index < fullLines.length - 1) {
            master.set(carets[index], { autoAlpha: 0 }, cursor);
            cursor += dial.lineGap;
          }
        });

        if (chip) {
          master.to(
            chip,
            { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out" },
            cursor + 0.25,
          );
        }
        master.to(
          carets[carets.length - 1],
          {
            opacity: 0,
            duration: dial.holdLoop / 5,
            ease: "steps(1)",
            yoyo: true,
            repeat: 4,
          },
          cursor + 0.35,
        );
      }

      if (type === "blueprint") {
        const rects = gsap.utils.toArray<SVGPathElement>("[data-bp-rect]", el);
        const accent = el.querySelector<SVGPathElement>("[data-bp-accent]");
        const pulse = el.querySelector<SVGPathElement>("[data-bp-pulse]");

        const prime = (target: SVGPathElement) => {
          const length = target.getTotalLength();
          gsap.set(target, { strokeDasharray: length, strokeDashoffset: length });
        };
        rects.forEach(prime);
        if (accent) prime(accent);
        if (pulse) gsap.set(pulse, { autoAlpha: 0 });

        master.to(rects, {
          strokeDashoffset: 0,
          duration: 0.65,
          ease: "power2.inOut",
          stagger: dial.drawStagger,
        });
        if (accent) {
          master.to(
            accent,
            { strokeDashoffset: 0, duration: 0.7, ease: "power2.out" },
            "-=0.25",
          );
        }
        if (pulse) {
          master.to(pulse, { autoAlpha: 0.9, duration: 0.4 });
          master.fromTo(
            pulse,
            { strokeDashoffset: 0 },
            {
              strokeDashoffset: -91,
              duration: dial.pulseDuration,
              ease: "power1.inOut",
            },
          );
        }
      }

      if (type === "columns") {
        const bars = gsap.utils.toArray<HTMLElement>("[data-col-bar]", el);
        const ghosts = gsap.utils.toArray<HTMLElement>("[data-col-ghost]", el);

        gsap.set(bars, { scaleY: 0 });
        gsap.set(ghosts, { scaleY: 0 });

        master.to(bars, {
          scaleY: 1,
          duration: dial.barRise,
          ease: "power3.out",
          stagger: dial.barStagger,
        });
        master.to(
          ghosts,
          {
            scaleY: 1,
            duration: 0.5,
            ease: "power2.out",
            stagger: dial.barStagger,
          },
          "-=0.4",
        );
      }

      ScrollTrigger.create({
        trigger: el,
        start: dial.start,
        end: dial.end,
        once: true,
        onEnter: () => master.play(0),
      });
    },
    { scope: root },
  );

  if (type === "terminal") {
    return (
      <div
        ref={root}
        className="mono relative h-full bg-night p-5 text-[0.65rem] leading-[1.9] text-paper-on-night-soft"
      >
        <p>
          <span className="text-signal-bright">mew</span>
          <span data-term-text> run rotina</span>
          <span
            data-term-caret
            aria-hidden
            className="ml-1 inline-block h-3 w-1.5 bg-signal align-middle opacity-0"
          />
        </p>
        <p>
          <span data-term-text>conectando ferramentas...</span>
          <span
            data-term-caret
            aria-hidden
            className="ml-1 inline-block h-3 w-1.5 bg-signal align-middle opacity-0"
          />
        </p>
        <p>
          <span data-term-text>sincronizando planilha e sistema</span>
          <span
            data-term-caret
            aria-hidden
            className="ml-1 inline-block h-3 w-1.5 bg-signal align-middle opacity-0"
          />
        </p>
        <p className="text-paper-on-night">
          <span data-term-text>rotina concluída</span>
          <span
            data-term-caret
            aria-hidden
            className="ml-1 inline-block h-3 w-1.5 bg-signal align-middle"
          />
        </p>
        <span
          data-term-chip
          className="mono mt-3 inline-flex h-6 items-center border border-night-line px-2 text-[0.58rem] tracking-[0.06em] text-paper-on-night"
        >
          OK · PRÓXIMA 08:00
        </span>
      </div>
    );
  }

  if (type === "blueprint") {
    return (
      <div ref={root} className="relative h-full bg-night">
        <svg
          aria-hidden
          viewBox="0 0 400 300"
          preserveAspectRatio="none"
          className="h-full w-full"
        >
          {[
            "M24 40 H376 V66 H24 Z",
            "M24 80 H112 V276 H24 Z",
            "M128 80 H376 V140 H128 Z",
            "M128 154 H376 V214 H128 Z",
            "M128 228 H376 V276 H128 Z",
          ].map((d) => (
            <path
              key={d}
              data-bp-rect
              d={d}
              fill="none"
              stroke="var(--color-night-line)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          <path
            data-bp-accent
            d="M-10 180 H68 V110 H410"
            fill="none"
            stroke="var(--color-signal)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          <path
            data-bp-pulse
            d="M-10 180 H68 V110 H410"
            fill="none"
            stroke="var(--color-signal-bright)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="1 90"
            vectorEffect="non-scaling-stroke"
            className="opacity-0"
          />
        </svg>
        <span className="mono absolute top-4 left-4 text-[0.58rem] text-paper-on-night-soft">
          SOB MEDIDA · EM USO
        </span>
      </div>
    );
  }

  return (
    <div
      ref={root}
      className="relative flex h-full items-end justify-center gap-[5%] bg-night px-[14%] pt-[18%] pb-[14%]"
    >
      {BAR_HEIGHTS.map((height, index) => (
        <span
          key={height}
          data-col-bar
          className="relative block w-[12%] origin-bottom border border-night-line bg-night-2"
          style={{ height: `${height}%` }}
        >
          <span
            data-col-ghost
            className="absolute inset-x-0 bottom-0 origin-bottom bg-signal-ghost"
            style={{ height: `${24 + index * 10}%` }}
          />
        </span>
      ))}
      <span className="mono absolute top-4 left-4 flex items-center gap-2 text-[0.58rem] text-paper-on-night-soft">
        <span aria-hidden className="signal-dot" />
        5 FONTES · 1 LEITURA · AO VIVO
      </span>
    </div>
  );
}

export default function Capabilities() {
  const root = useRef<HTMLElement>(null);
  useChapter(root, { enter: false, exit: false });

  return (
    <section
      ref={root}
      id="servicos"
      className="relative scroll-mt-24 overflow-clip bg-paper"
    >
      <div aria-hidden className="paper-vignette pointer-events-none absolute inset-0" />
      {/* z: intro (25) > linha (20) > cards/exemplos (10) */}
      <SignalScene scene="services" above />
      <div className="relative z-[25] mx-auto max-w-[1200px] px-5 pt-20 sm:px-8 lg:pt-28">
        <div className="grid gap-6 lg:grid-cols-12">
          <p data-reveal className="section-index lg:col-span-3">
            <span>02</span>
            <span>a solução</span>
          </p>
          <div className="lg:col-span-8 lg:col-start-5">
            <h2 data-reveal-title className="max-w-[13ch] text-h2 leading-[1.04]">
              Tecnologia no formato da sua operação.
            </h2>
            <p data-reveal className="mt-6 max-w-[58ch] text-lede text-ink-soft">
              O ponto de partida não é a ferramenta da moda. É o que precisa
              acontecer na sua operação, e o software certo para isso.
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-[var(--z-content)] mx-auto max-w-[1200px] px-5 pb-20 sm:px-8 lg:pb-28">
        <div
          data-signal-anchor="services-signal"
          className="mt-14 border-t border-line-strong"
        >
          {SERVICES.map((service, index) => (
            <article
              key={service.title}
              data-reveal
              data-signal-anchor={`service-${index + 1}`}
              className="group grid min-w-0 gap-7 border-b border-line py-8 transition-[border-color] duration-200 hover:border-signal md:grid-cols-[1fr_7fr] lg:grid-cols-[1fr_6fr_5fr] lg:items-center lg:gap-8 lg:py-10"
            >
              <span className="mono text-2xl text-ink-faint lg:self-start">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <h3 className="text-h3 leading-tight text-ink">{service.title}</h3>
                <p className="mt-3 max-w-[56ch] text-ink-soft">
                  {service.description}
                </p>
                <p className="mono mt-5 flex flex-wrap gap-x-4 gap-y-2 text-[0.66rem] text-ink-faint">
                  {service.capabilities.map((capability) => (
                    <span key={capability}>{capability}</span>
                  ))}
                </p>
              </div>
              <MediaFrame
                ratio="4 / 3"
                title={`Instrumento de ${service.title}`}
                className="min-w-0 transition-shadow duration-200 group-hover:shadow-[var(--shadow-signal)] md:col-start-2 lg:col-start-auto"
              >
                <Instrument type={service.instrument} />
              </MediaFrame>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
