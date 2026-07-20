import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import MediaFrame from "../components/MediaFrame";
import HeroSignalMedia from "../components/HeroSignalMedia";
import SignalLine from "../components/SignalLine";
import { gsap, ScrollTrigger } from "../lib/gsap";
import { MOTION, reduceMotion } from "../lib/motion";

/* Altura relativa, dentro do vídeo, em que a linha rosa reta do HeroSignalMedia
   toca a borda esquerda (FINAL_PATH começa em y=347 de um viewBox de 675). */
const MEDIA_LINE_Y = 347 / 675;

/* O fio começa a se desenhar junto com o vídeo e fecha no mesmo instante em que a
   linha reta de dentro dele termina — os dois viram um traço só. */
const WIRE_DURATION =
  MOTION.heroSignal.lineStart + MOTION.heroSignal.lineDuration;

const round = (value: number) => Math.round(value);

/* Posição de layout dentro da seção: soma a cadeia de offsetParent para ignorar
   o translate do reveal de entrada (getBoundingClientRect o incluiria). */
const offsetWithin = (element: HTMLElement, ancestor: HTMLElement) => {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = element;
  while (node && node !== ancestor) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { x, y };
};

/* O fio original, no viewBox de sempre (1200x950): a descida ondulada pela margem
   esquerda é a mesma. Só a curva final é recalculada, para o cotovelo abrir na
   altura da linha do vídeo em vez de sumir atrás da moldura. */
const WIRE_VIEWBOX = "0 0 1200 950";
const WIRE_RAIL =
  "M42 -20 L42 115 C42 170 16 190 42 238 C75 298 35 365 42 432";

const buildWire = (endX: number, endY: number) =>
  `${WIRE_RAIL} C48 ${round(432 + (endY - 432) * 0.55)} 110 ${endY} ${endX} ${endY} L${endX + 140} ${endY}`;

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement | null>(null);
  const [wire, setWire] = useState<string | null>(null);

  useEffect(() => {
    const section = root.current;
    const stageEl = stage.current;
    if (!section || !stageEl) return;

    let lastSignature = "";

    const measure = () => {
      video.current = stageEl.querySelector("video");
      const media = stageEl.querySelector("svg");
      const box = section.getBoundingClientRect();
      // O fio só existe no layout lg, onde o vídeo fica ao lado da coluna de texto.
      if (!media || box.width < 1024) {
        lastSignature = "";
        setWire(null);
        return;
      }
      const frame = media.getBoundingClientRect();
      const stageBox = stageEl.getBoundingClientRect();
      const stageOffset = offsetWithin(stageEl, section);
      // Ponto de encontro em px da seção → unidades do viewBox de 1200x950, que o
      // SVG estica com preserveAspectRatio="none".
      const svgWidth = Math.min(box.width, 1200);
      const scaleX = svgWidth / 1200;
      const scaleY = box.height / 950;
      const endX = round(
        (stageOffset.x + (frame.left - stageBox.left) - (box.width - svgWidth) / 2) /
          scaleX,
      );
      const endY = round(
        (stageOffset.y + (frame.top - stageBox.top) + frame.height * MEDIA_LINE_Y) /
          scaleY,
      );
      const path = buildWire(endX, endY);
      if (path === lastSignature) return;
      lastSignature = path;
      setWire(path);
      ScrollTrigger.refresh();
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

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

  // Parallax em pixels (não yPercent) e aplicado também ao fio: os dois precisam
  // deslizar juntos para a emenda com a linha do vídeo continuar exata.
  useGSAP(
    () => {
      const section = root.current;
      if (!section || reduceMotion()) return;

      const mm = gsap.matchMedia();
      mm.add(MOTION.desktop, () => {
        // fromTo + immediateRender:false: o reveal de entrada ainda está mexendo
        // no y do palco, e um `to` capturaria esse valor intermediário.
        gsap.fromTo(
          "[data-hero-stage], [data-hero-wire]",
          { y: 0 },
          {
            y: -MOTION.heroStageParallax,
            ease: "none",
            immediateRender: false,
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [wire], revertOnUpdate: true },
  );

  return (
    <section
      ref={root}
      id="top"
      className="relative min-h-[100svh] overflow-clip bg-paper pt-28 pb-20 sm:pt-32 lg:pt-36 lg:pb-24"
    >
      <div aria-hidden className="paper-vignette pointer-events-none absolute inset-0" />
      {wire && (
        <div
          data-hero-wire
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[var(--z-wire)] hidden lg:block"
        >
          <SignalLine
            key={wire}
            draw="load"
            syncTo={video}
            duration={WIRE_DURATION}
            viewBox={WIRE_VIEWBOX}
            path={wire}
            className="mx-auto block h-full w-full max-w-[1200px]"
          />
        </div>
      )}
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
          A MewStack cria automações, aplicações web e sistemas sob medida que
          organizam processos, conectam dados e reduzem trabalho manual.
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
          ref={stage}
          data-hero
          data-hero-stage
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
