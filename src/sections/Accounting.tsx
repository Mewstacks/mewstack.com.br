import { useEffect, useRef } from "react";
import {
  Inbox,
  ScanSearch,
  GitCompare,
  BellRing,
  CalendarCheck,
  FileBarChart,
  Check,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useChapter } from "../lib/useChapter";
import { reduceMotion } from "../lib/motion";
import Mascot from "../components/Mascot";

/* ── Automação contábil: o caso de uso concreto, em vídeo. Segunda batida
   charcoal da narrativa ("sala de máquinas"). O vídeo é uma demo de sistema
   fictício (gerado no Higgsfield) rodando o fluxo documento → leitura →
   conciliação → fechamento. Performance: preload="none" + poster, play/pause
   via IntersectionObserver (nunca roda fora da tela), e sob
   prefers-reduced-motion vira imagem estática. */

const VIDEO = "/media/contabil.mp4";
const POSTER = "/media/contabil-poster.webp";

const FLOW: { icon: LucideIcon; label: string; desc: string }[] = [
  { icon: Inbox, label: "Entrada", desc: "notas e extratos chegam sozinhos" },
  { icon: ScanSearch, label: "Leitura", desc: "CNPJ, valor e categoria extraídos" },
  { icon: GitCompare, label: "Conciliação", desc: "banco × fiscal, lado a lado" },
  { icon: BellRing, label: "Alertas", desc: "divergência apontada na hora" },
  { icon: CalendarCheck, label: "Fechamento", desc: "progresso visível por etapa" },
  { icon: FileBarChart, label: "Relatório", desc: "indicadores prontos, sem montar" },
];

export default function Accounting() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const reduce = reduceMotion();
  useChapter(root);

  // Roda só com o vídeo em cena — economiza bateria/dados e mantém o scroll leve.
  useEffect(() => {
    const v = video.current;
    if (!v || reduce) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.25 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [reduce]);

  return (
    <section
      ref={root}
      id="contabil"
      className="relative scroll-mt-24 overflow-clip bg-night text-paper"
    >
      {/* ambiência sala de máquinas — grid técnico + glow rosa */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_80%_60%_at_50%_30%,black,transparent_78%)]"
        style={{
          backgroundImage:
            "linear-gradient(to right, oklch(1 0 0 / 0.045) 1px, transparent 1px), linear-gradient(to bottom, oklch(1 0 0 / 0.045) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <div
        aria-hidden
        data-parallax="1.1"
        className="pointer-events-none absolute -top-16 right-[-10%] -z-10 h-[40vh] w-[60vw] max-w-[720px] rounded-full opacity-25 blur-[130px]"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, var(--color-pink) 0%, transparent 70%)" }}
      />

      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:py-20">
        <div className="max-w-2xl">
          <p data-reveal className="eyebrow mb-6 text-paper-soft">automação contábil</p>
          <h2
            data-reveal-title
            className="font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.04] font-semibold tracking-[-0.035em] text-paper"
          >
            Do documento ao fechamento, sem digitar nada.
          </h2>
          <p data-reveal className="mt-5 max-w-[52ch] text-paper-soft">
            É assim que fica na tela: notas, extratos e lançamentos entrando, sendo
            lidos, validados e conciliados — num fluxo desenhado pro jeito que o seu
            financeiro funciona.
          </p>
        </div>

        {/* ── demo em vídeo ── */}
        <div data-reveal className="relative mt-9 lg:mt-11">
          <div className="overflow-hidden rounded-2xl border border-night-line bg-night-2 shadow-[0_40px_90px_-50px_rgba(0,0,0,0.8)]">
            <div className="flex h-10 items-center gap-1.5 border-b border-night-line px-4">
              <span className="win-dot bg-[#FF5F57]" />
              <span className="win-dot bg-[#FEBC2E]" />
              <span className="win-dot bg-[#28C840]" />
              <span className="mono ml-2 truncate text-[0.7rem] text-paper-soft">
                fechamento-junho · demonstração
              </span>
              <span className="mono ml-auto hidden shrink-0 items-center gap-2 text-[0.68rem] text-paper-soft sm:flex">
                <span className="live-dot" aria-hidden />
                automação rodando
              </span>
            </div>

            {reduce ? (
              <img
                src={POSTER}
                alt="Painel de automação contábil: fila de documentos recebidos, campos classificados automaticamente e conciliação bancária concluída."
                className="block w-full"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <video
                ref={video}
                className="block w-full"
                muted
                loop
                playsInline
                preload="none"
                poster={POSTER}
                aria-label="Demonstração animada: documentos fiscais entram no sistema, dados são extraídos e conciliados, e o fechamento mensal chega a 100%."
              >
                <source src={VIDEO} type="video/mp4" />
              </video>
            )}
          </div>

          {/* chips de status ao redor do vídeo (desktop) — o fluxo "vazando" da tela */}
          <div
            aria-hidden
            data-parallax="1.4"
            className="pointer-events-none absolute -top-4 right-6 hidden items-center gap-2 rounded-xl border border-night-line bg-night-2/90 px-3 py-2 text-[0.74rem] font-medium text-paper shadow-xl backdrop-blur-sm lg:flex"
          >
            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[oklch(0.62_0.13_150_/_0.25)] text-[oklch(0.75_0.13_150)]">
              <Check className="h-2.5 w-2.5" strokeWidth={3} />
            </span>
            487 documentos processados
          </div>
          <div
            aria-hidden
            data-parallax="0.8"
            className="pointer-events-none absolute -bottom-4 right-14 hidden items-center gap-2 rounded-xl border border-night-line bg-night-2/90 px-3 py-2 text-[0.74rem] font-medium text-paper shadow-xl backdrop-blur-sm lg:flex"
          >
            <span className="mono text-pink-bright">100%</span>
            fechamento concluído
          </div>

          {/* mascote apresentando a demo (desktop) — flip no wrapper, nunca no Mascot */}
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-8 -left-4 hidden -scale-x-100 xl:block"
          >
            <Mascot pose="pointing" className="w-24" floatDelay="1.2s" />
          </div>
        </div>

        {/* ── o fluxo por trás do vídeo, em 6 batidas ── */}
        <ol className="relative mt-9 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:mt-11 lg:grid-cols-6">
          {FLOW.map((f, i) => {
            const Icon = f.icon;
            return (
              <li
                key={f.label}
                data-reveal
                className="relative rounded-xl border border-night-line bg-night-2/60 p-3.5"
              >
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-night-line bg-night text-pink-bright">
                    <Icon className="h-3.5 w-3.5" strokeWidth={1.9} />
                  </span>
                  <span className="mono text-[0.64rem] text-paper-soft">0{i + 1}</span>
                </div>
                <p className="mt-2.5 text-[0.9rem] font-semibold text-paper">{f.label}</p>
                <p className="mt-1 text-[0.76rem] leading-snug text-paper-soft">{f.desc}</p>
              </li>
            );
          })}
        </ol>

        {/* mini-CTA do capítulo */}
        <div data-reveal className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-4">
          <a href="#contato" className="btn btn-pink font-semibold">
            Quero esse fluxo na minha empresa
            <span className="arrow" aria-hidden>→</span>
          </a>
          <p className="text-[0.86rem] text-paper-soft">
            Sistema fictício — o seu é desenhado em cima do seu processo.
          </p>
        </div>
      </div>
    </section>
  );
}
