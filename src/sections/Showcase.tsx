import { useRef } from "react";
import MediaFrame from "../components/MediaFrame";
import { useChapter } from "../lib/useChapter";
import { useHorizontalGallery } from "../lib/useHorizontalGallery";

const CASES = [
  {
    title: "NFS-e sem cliques",
    caption: {
      name: "OPERAÇÃO FISCAL",
      detail: "Python · integração portal",
      year: "2026",
      type: "AUTOMAÇÃO",
    },
    angle: 1,
  },
  {
    title: "Dados reconciliados",
    caption: {
      name: "CONCILIAÇÃO",
      detail: "ETL · validação",
      year: "2026",
      type: "DADOS",
    },
    angle: -1,
  },
  {
    title: "Sistema no fluxo certo",
    caption: {
      name: "PORTAL OPERACIONAL",
      detail: "React · API",
      year: "2026",
      type: "SISTEMA",
    },
    angle: 1,
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
      <div className="relative mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-12">
          <p data-reveal className="section-index lg:col-span-3">
            <span>05</span>
            <span>o que sai da máquina</span>
          </p>
          <div className="lg:col-span-8 lg:col-start-5">
            <h2 data-reveal-title className="max-w-[12ch] text-h2 leading-[1.04]">
              Resultado real merece captura real.
            </h2>
            <p data-reveal className="mt-5 max-w-[68ch] text-ink-soft">
              Os cases estão prontos para receber as gravações de produto.
              Enquanto isso, cada frame mostra com transparência o que está em produção.
            </p>
          </div>
        </div>
        <div data-reveal className="mt-6 flex items-center gap-4 md:mt-4">
          <span className="mono text-[0.65rem] text-ink-faint">01</span>
          <span className="h-px flex-1 overflow-hidden bg-line">
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

      <div className="h-scroll relative mt-6 w-full md:mt-0 md:overflow-visible">
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
              key={item.title}
              className="case-frame transition-shadow duration-200 hover:shadow-[var(--shadow-signal)]"
              caption={item.caption}
              title={item.title}
              standbyLabel="CAPTURA EM PRODUÇÃO — EM BREVE"
              angle={item.angle}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
