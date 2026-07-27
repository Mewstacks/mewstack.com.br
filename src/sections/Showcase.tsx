import { useRef } from "react";
import MediaFrame from "../components/MediaFrame";
import { SignalScene } from "../components/SignalJourney";
import { useChapter } from "../lib/useChapter";
import { useHorizontalGallery } from "../lib/useHorizontalGallery";

const CASES = [
  {
    key: "operacao-fiscal",
    src: "/media/cases/operacao-fiscal.png",
    title:
      "Dashboard de operação fiscal com obrigações, upload de recibos, consulta de NFS-e e checklist mensal",
    caption: {
      name: "OPERAÇÃO FISCAL CENTRALIZADA",
      detail: "Dashboard · NFS-e · checklist",
      type: "AUTOMAÇÃO",
    },
  },
  {
    key: "plataforma-tributaria",
    src: "/media/cases/plataforma-tributaria.png",
    title:
      "Aplicação web tributária com acesso a uma plataforma fiscal e ferramentas para validação e adaptação",
    caption: {
      name: "PLATAFORMA TRIBUTÁRIA",
      detail: "Aplicação web · API fiscal",
      type: "APLICAÇÃO WEB",
    },
  },
  {
    key: "distribuicao-multicanal",
    src: "/media/cases/distribuicao-multicanal.png",
    title:
      "Sistema interno de promoções com coleta de ofertas, filtros e distribuição para WhatsApp e Telegram",
    caption: {
      name: "DISTRIBUIÇÃO MULTICANAL",
      detail: "Coleta · filtros · envios",
      type: "INTEGRAÇÃO",
    },
  },
];

export default function Showcase() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLSpanElement>(null);

  useChapter(root, { enter: false, exit: false });
  useHorizontalGallery(root, track, progress);

  return (
    <section
      ref={root}
      id="exemplos"
      className="relative scroll-mt-24 overflow-hidden bg-paper py-20 md:flex md:h-screen md:flex-col md:justify-center md:pt-10 md:pb-0"
    >
      <div aria-hidden className="paper-vignette pointer-events-none absolute inset-0" />
      {/* z: texto (25) > linha (20) > cards (10) */}
      <SignalScene scene="outcome" above />

      <div className="relative z-[25] mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-12">
          <p data-reveal className="section-index lg:col-span-3">
            <span>05</span>
            <span>o que sai da máquina</span>
          </p>
          <div className="lg:col-span-8 lg:col-start-5">
            <h2 data-reveal-title className="max-w-[12ch] text-h2 leading-[1.04]">
              Sistemas reais, feitos para operações reais.
            </h2>
            <p data-reveal className="mt-5 max-w-[68ch] text-ink-soft">
              Automação fiscal, plataforma web e distribuição multicanal —
              produtos diferentes, com a mesma obsessão por clareza, integração e fluxo.
            </p>
          </div>
        </div>
        <div
          data-reveal
          data-signal-anchor="outcome-progress"
          className="mt-6 flex items-center gap-4 md:mt-4"
        >
          <span className="mono text-[0.65rem] text-ink-faint">01</span>
          <span
            data-signal-anchor="outcome-terminal"
            className="h-px flex-1 overflow-hidden bg-line"
          >
            <span
              ref={progress}
              className="block h-full w-full origin-left scale-x-0 bg-signal"
            />
          </span>
          <span className="mono text-[0.65rem] text-ink-faint">
            {String(CASES.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      <div
        data-signal-anchor="outcome-track"
        className="h-scroll relative z-[var(--z-content)] mt-6 w-full md:mt-0 md:overflow-visible"
      >
        <div
          ref={track}
          className="h-track"
          style={{
            paddingInlineStart:
              "max(1.25rem, calc((100vw - 1200px) / 2 + 2rem))",
            paddingInlineEnd:
              "max(1.25rem, calc((100vw - 1200px) / 2 + 2rem))",
          }}
        >
          {CASES.map((item) => (
            <MediaFrame
              key={item.key}
              className="case-frame transition-shadow duration-200 hover:shadow-[var(--shadow-signal)]"
              caption={item.caption}
              title={item.title}
              src={item.src}
              fit="contain"
              ratio="1918 / 991"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
