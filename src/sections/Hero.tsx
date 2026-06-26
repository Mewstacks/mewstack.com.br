import { motion, useReducedMotion } from "framer-motion";
import {
  FileText,
  Sheet,
  Calendar,
  SlidersHorizontal,
  ArrowDownToLine,
  ShieldCheck,
} from "lucide-react";

/* ── Hero product shot: MewStack's NFS-e downloader ──
   A real-feeling app that pulls NFS-e from the portal nacional, lets you
   filter by emissão/competência, export to Excel/PDF, and opens a note with
   its full values. Concrete > metaphor — this is the kind of software the
   studio ships, translated to a Linear-style hero mockup (light mode). */
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

export default function Hero() {
  const reduce = useReducedMotion();

  const rise = (delay: number) =>
    reduce
      ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const },
        };

  return (
    <section id="top" className="relative overflow-clip px-5 pt-32 pb-0 sm:px-8 lg:pt-36">
      {/* ── ambient structure: editorial grid + soft pink aurora ── */}
      <div
        aria-hidden
        className="grid-lines pointer-events-none absolute inset-0 -z-10 opacity-40 [mask-image:radial-gradient(ellipse_70%_55%_at_50%_0%,black,transparent_72%)]"
      />
      <div
        aria-hidden
        className="aurora pointer-events-none absolute top-[-14%] left-1/2 -z-10 h-[52vh] w-[120vw] max-w-[1100px] -translate-x-1/2 rounded-full opacity-30 blur-[120px]"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%, var(--color-pink) 0%, transparent 70%)" }}
      />

      {/* ── centered copy column ── */}
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <motion.a
          href="#processo"
          {...rise(0)}
          className="group mb-7 inline-flex items-center gap-2.5 rounded-full border border-ink/8 bg-cream-deep/70 py-1.5 pr-2.5 pl-3.5 text-[0.82rem] font-medium tracking-[0.01em] text-ink-soft shadow-[var(--shadow-soft)] backdrop-blur-sm transition-colors hover:border-pink/30"
        >
          <span className="live-dot" aria-hidden />
          Estúdio de software &amp; dados
          <span className="rounded-full border border-ink/10 bg-cream px-2 py-0.5 text-[0.72rem] text-ink-soft transition-colors group-hover:border-pink/30 group-hover:text-pink-deep">
            aberto para projetos →
          </span>
        </motion.a>

        <motion.h1
          {...rise(0.08)}
          className="font-display text-[clamp(2.6rem,7.2vw,5.2rem)] leading-[0.95] font-semibold tracking-[-0.04em]"
        >
          <span className="text-ink-fade">Seus dados já sabem</span>
          <br />
          <span className="text-gradient">a gente revela.</span>
        </motion.h1>

      </div>

      {/* ── NFS-e downloader mockup (Linear hero product shot, light mode) ── */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 48 }}
        animate={reduce ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.36, ease: [0.16, 1, 0.3, 1] }}
        className="relative mx-auto mt-16 w-full max-w-5xl sm:mt-20"
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
