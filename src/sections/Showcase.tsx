import { motion, useReducedMotion } from "framer-motion";
import {
  FileText,
  Sheet,
  Calendar,
  SlidersHorizontal,
  ArrowDownToLine,
  ShieldCheck,
} from "lucide-react";
import Reveal from "../components/Reveal";

/* ── Showcase: um app de verdade que a MewStack ship — o baixador de NFS-e do
   portal nacional. Concreto > metáfora: filtra por emissão/competência, exporta
   pra Excel/PDF e abre a nota com os valores. Antes morava no Hero; agora vem
   no fim da rolagem como exemplo do que o estúdio constrói. */
type Status = "ok" | "proc";
type Note = {
  id: string;
  prestador: string;
  comp: string;
  valor: string;
  status: Status;
};

const NOTES: Note[] = [
  { id: "2025-000487", prestador: "MewStack Tecnologia", comp: "06/2025", valor: "4.250,00", status: "ok" },
  { id: "2025-000486", prestador: "Studio Alpha Ltda", comp: "06/2025", valor: "1.800,00", status: "ok" },
  { id: "2025-000485", prestador: "Contábil Souza ME", comp: "06/2025", valor: "920,00", status: "ok" },
  { id: "2025-000484", prestador: "Verde Engenharia", comp: "06/2025", valor: "7.640,50", status: "proc" },
  { id: "2025-000483", prestador: "Padaria Pão Quente", comp: "06/2025", valor: "320,00", status: "ok" },
  { id: "2025-000482", prestador: "Office Print Center", comp: "05/2025", valor: "1.145,00", status: "ok" },
];

export default function Showcase() {
  const reduce = useReducedMotion();

  return (
    <section
      id="exemplos"
      className="relative overflow-clip scroll-mt-24 px-5 pt-16 pb-20 sm:px-8 lg:pt-24 lg:pb-28"
    >
      {/* ── soft pink aurora behind the product shot ── */}
      <div
        aria-hidden
        className="aurora pointer-events-none absolute top-[18%] left-1/2 -z-10 h-[44vh] w-[120vw] max-w-[1000px] -translate-x-1/2 rounded-full opacity-25 blur-[120px]"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, var(--color-pink) 0%, transparent 70%)" }}
      />

      <Reveal className="mx-auto max-w-2xl">
        <p className="eyebrow mb-6">exemplos</p>
        <h2 className="font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.04] font-semibold tracking-[-0.035em]">
          Um exemplo do que a gente coloca pra rodar.
        </h2>
        <p className="mt-5 max-w-[48ch] text-ink-soft">
          Tipo este: um robô que baixa suas NFS-e direto do portal nacional,
          filtra por competência e exporta pra Excel ou PDF — sem ninguém abrir
          o site da prefeitura nota por nota.
        </p>
      </Reveal>

      {/* ── NFS-e downloader mockup (Linear-style product shot, light mode) ── */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 48 }}
        whileInView={reduce ? {} : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative mx-auto mt-12 w-full max-w-5xl"
      >
        <div className="console">
          {/* window chrome */}
          <div className="flex h-10 items-center gap-1.5 border-b border-cream-line bg-cream px-4">
            <span className="win-dot bg-[#FF5F57]" />
            <span className="win-dot bg-[#FEBC2E]" />
            <span className="win-dot bg-[#28C840]" />
            <div className="flex flex-1 justify-center">
              <span className="mono rounded-md border border-cream-line bg-cream-deep px-3 py-1 text-[0.7rem] text-ink-soft">
                mewstack.com.br
              </span>
            </div>
          </div>

          {/* toolbar: filters + export */}
          <div className="flex items-center gap-2 overflow-hidden border-b border-cream-line px-4 py-2.5">
            <span className="shrink-0 text-[0.82rem] font-medium text-ink">Notas de serviço</span>
            <span className="mono hidden shrink-0 text-[0.72rem] text-ink-soft sm:inline">487 sincronizadas</span>

            <div className="ml-auto flex shrink-0 items-center gap-1.5">
              <span className="hidden items-center gap-1.5 rounded-lg border border-cream-line bg-cream-deep px-2.5 py-1.5 text-[0.72rem] text-ink-soft lg:inline-flex">
                <Calendar className="h-3.5 w-3.5" strokeWidth={1.8} />
                Emissão · Jun/2025
              </span>
              <span className="hidden items-center gap-1.5 rounded-lg border border-cream-line bg-cream-deep px-2.5 py-1.5 text-[0.72rem] text-ink-soft lg:inline-flex">
                <SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={1.8} />
                Competência · 06/2025
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-cream-line bg-cream-deep px-2.5 py-1.5 text-[0.72rem] font-medium text-ink-soft">
                <Sheet className="h-3.5 w-3.5" strokeWidth={1.8} style={{ color: "#0f9d58" }} />
                Excel
              </span>
              <span className="hidden items-center gap-1.5 rounded-lg border border-cream-line bg-cream-deep px-2.5 py-1.5 text-[0.72rem] font-medium text-ink-soft sm:inline-flex">
                <FileText className="h-3.5 w-3.5" strokeWidth={1.8} style={{ color: "#e2483d" }} />
                PDF
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-pink px-2.5 py-1.5 text-[0.72rem] font-semibold text-[oklch(0.22_0.03_356)]">
                <ArrowDownToLine className="h-3.5 w-3.5" strokeWidth={2} />
                Baixar do portal
              </span>
            </div>
          </div>

          {/* body: list + open-note detail */}
          <div className="flex" style={{ height: "min(500px, 64vw)" }}>
            {/* list */}
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="grid shrink-0 grid-cols-[1fr_5rem] items-center gap-x-3 border-b border-cream-line px-4 py-2 text-[0.68rem] font-medium tracking-wide text-ink-soft/70 uppercase sm:grid-cols-[6rem_1fr_4rem_5rem]">
                <span className="hidden sm:block">Número</span>
                <span>Prestador</span>
                <span className="hidden sm:block">Comp.</span>
                <span className="text-right">Valor (R$)</span>
              </div>

              {NOTES.map((n, i) => {
                const open = i === 0;
                return (
                  <div
                    key={n.id}
                    className={`relative grid grid-cols-[1fr_5rem] items-center gap-x-3 border-b border-cream-line/60 px-4 py-2.5 sm:grid-cols-[6rem_1fr_4rem_5rem] ${
                      open ? "bg-pink/8" : ""
                    }`}
                  >
                    {open && <span aria-hidden className="absolute inset-y-0 left-0 w-0.5 bg-pink" />}
                    <span className="mono hidden truncate text-[0.72rem] text-ink-soft/70 sm:block">{n.id}</span>
                    <span className="flex min-w-0 items-center gap-2">
                      <span
                        aria-hidden
                        title={n.status === "ok" ? "Autorizada" : "Processando"}
                        className="h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ background: n.status === "ok" ? "oklch(0.62 0.13 150)" : "oklch(0.75 0.14 75)" }}
                      />
                      <span className={`truncate text-[0.82rem] ${open ? "font-medium text-ink" : "text-ink"}`}>
                        {n.prestador}
                      </span>
                    </span>
                    <span className="mono hidden text-[0.72rem] text-ink-soft sm:block">{n.comp}</span>
                    <span className="mono text-right text-[0.8rem] tabular-nums text-ink">{n.valor}</span>
                  </div>
                );
              })}
            </div>

            {/* open note detail (right) */}
            <aside className="hidden w-[42%] max-w-sm shrink-0 flex-col overflow-y-auto border-l border-cream-line bg-cream/50 md:flex">
              <div className="flex items-center justify-between border-b border-cream-line px-5 py-3">
                <div>
                  <p className="mono text-[0.72rem] text-ink-soft">NFS-e</p>
                  <p className="font-display text-[0.95rem] font-semibold tracking-[-0.01em] text-ink">2025-000487</p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[oklch(0.62_0.13_150_/_0.14)] px-2.5 py-1 text-[0.7rem] font-medium text-[oklch(0.46_0.13_150)]">
                  <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2} />
                  Autorizada
                </span>
              </div>

              <div className="flex flex-col gap-3.5 px-5 py-4 text-[0.78rem]">
                <Field label="Prestador" value="MewStack Tecnologia LTDA" sub="CNPJ 54.321.000/0001-09" />
                <Field label="Tomador" value="Cliente Exemplo S.A." sub="CNPJ 12.345.678/0001-90" />
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Emissão" value="12/06/2025" />
                  <Field label="Competência" value="06/2025" />
                </div>
                <Field
                  label="Discriminação"
                  value="Automação de processos e processamento de dados."
                />

                {/* values */}
                <div className="mt-1 rounded-xl border border-cream-line bg-cream-deep p-3.5">
                  <Row k="Valor dos serviços" v="R$ 4.250,00" />
                  <Row k="ISS (3%)" v="− R$ 127,50" muted />
                  <div className="my-2 h-px bg-cream-line" />
                  <div className="flex items-center justify-between">
                    <span className="text-[0.8rem] font-medium text-ink">Valor líquido</span>
                    <span className="font-display text-[1.05rem] font-semibold tracking-[-0.01em] text-pink-deep">R$ 4.122,50</span>
                  </div>
                </div>

                <div className="mt-1 flex gap-2">
                  <span className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-cream-line bg-cream-deep py-2 text-[0.74rem] font-medium text-ink-soft">
                    <FileText className="h-3.5 w-3.5" strokeWidth={1.8} style={{ color: "#e2483d" }} />
                    Baixar PDF
                  </span>
                  <span className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-cream-line bg-cream-deep py-2 text-[0.74rem] font-medium text-ink-soft">
                    <Sheet className="h-3.5 w-3.5" strokeWidth={1.8} style={{ color: "#0f9d58" }} />
                    Exportar Excel
                  </span>
                </div>
              </div>
            </aside>
          </div>

          {/* bottom fade-out into the page */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
            style={{ background: "linear-gradient(to top, var(--color-cream) 8%, transparent 100%)" }}
          />
        </div>
      </motion.div>
    </section>
  );
}

function Field({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div>
      <p className="text-[0.68rem] font-medium tracking-wide text-ink-soft/70 uppercase">{label}</p>
      <p className="mt-0.5 text-[0.82rem] text-ink">{value}</p>
      {sub && <p className="mono text-[0.7rem] text-ink-soft">{sub}</p>}
    </div>
  );
}

function Row({ k, v, muted }: { k: string; v: string; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between py-0.5 text-[0.8rem]">
      <span className="text-ink-soft">{k}</span>
      <span className={`mono tabular-nums ${muted ? "text-ink-soft" : "text-ink"}`}>{v}</span>
    </div>
  );
}
