import { useRef } from "react";
import MediaFrame from "../components/MediaFrame";
import { useChapter } from "../lib/useChapter";

type Service = {
  title: string;
  description: string;
  capabilities: string[];
  instrument: "wave" | "columns" | "terminal";
};

const SERVICES: Service[] = [
  {
    title: "Software & automações",
    description:
      "Aplicações, integrações e robôs que executam o fluxo real da sua operação sem pedir uma nova planilha no meio.",
    capabilities: ["SISTEMAS SOB MEDIDA", "APIs & INTEGRAÇÕES", "BOTS & ROTINAS"],
    instrument: "wave",
  },
  {
    title: "Dados que viram decisão",
    description:
      "A gente lê, valida e organiza documentos e bases dispersas até a informação chegar pronta para ser usada.",
    capabilities: ["ETL & LIMPEZA", "DOCUMENTOS", "RELATÓRIOS & ALERTAS"],
    instrument: "columns",
  },
  {
    title: "Operação contínua",
    description:
      "O processo roda com horário, monitoramento e resposta clara quando algo foge do esperado.",
    capabilities: ["AGENDAMENTO", "OBSERVABILIDADE", "SUPORTE TÉCNICO"],
    instrument: "terminal",
  },
];

function Instrument({ type }: { type: Service["instrument"] }) {
  if (type === "wave") {
    return (
      <div className="relative h-full bg-night">
        <svg
          aria-hidden
          viewBox="0 0 400 300"
          preserveAspectRatio="none"
          className="h-full w-full"
        >
          <path
            d="M-20 162 C30 162 45 94 85 94 S145 222 195 222 S255 78 305 78 S360 162 420 162"
            fill="none"
            stroke="var(--color-signal)"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M0 162 H400"
            fill="none"
            stroke="var(--color-night-line)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <span className="mono absolute top-4 left-4 text-[0.58rem] text-paper-on-night-soft">
          ROTINA · 08:00
        </span>
      </div>
    );
  }

  if (type === "columns") {
    return (
      <div className="relative flex h-full items-end justify-center gap-[5%] bg-night px-[14%] py-[14%]">
        {[38, 72, 52, 88, 64].map((height, index) => (
          <span
            key={height}
            className="relative block w-[12%] border border-night-line bg-night-2"
            style={{ height: `${height}%` }}
          >
            <span
              className="absolute inset-x-0 bottom-0 bg-signal-ghost"
              style={{ height: `${24 + index * 10}%` }}
            />
          </span>
        ))}
        <span className="mono absolute top-4 left-4 text-[0.58rem] text-paper-on-night-soft">
          5 FONTES · 1 LEITURA
        </span>
      </div>
    );
  }

  return (
    <div className="mono relative h-full bg-night p-5 text-[0.65rem] leading-[1.9] text-paper-on-night-soft">
      <p>
        <span className="text-signal-bright">mew</span> run rotina
      </p>
      <p>carregando entradas...</p>
      <p>validando 1.284 registros</p>
      <p className="text-paper-on-night">operação concluída</p>
      <span aria-hidden className="mt-1 inline-block h-3 w-1.5 bg-signal" />
    </div>
  );
}

export default function Capabilities() {
  const root = useRef<HTMLElement>(null);
  useChapter(root);

  return (
    <section
      ref={root}
      id="servicos"
      className="relative scroll-mt-24 overflow-clip bg-paper"
    >
      <div aria-hidden className="paper-vignette pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-[1200px] px-5 py-20 sm:px-8 lg:py-28">
        <div className="grid gap-6 lg:grid-cols-12">
          <p data-reveal className="section-index lg:col-span-3">
            <span>02</span>
            <span>domando o sinal</span>
          </p>
          <div className="lg:col-span-8 lg:col-start-5">
            <h2 data-reveal-title className="max-w-[13ch] text-h2 leading-[1.04]">
              Tecnologia no formato da sua operação.
            </h2>
            <p data-reveal className="mt-6 max-w-[58ch] text-lede text-ink-soft">
              O ponto de partida não é a ferramenta da moda. É entender o que
              precisa acontecer, com quem e em qual momento.
            </p>
          </div>
        </div>

        <div className="mt-14 border-t border-line-strong">
          {SERVICES.map((service, index) => (
            <article
              key={service.title}
              data-reveal
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
