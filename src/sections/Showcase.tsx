import { useRef, useState, type ReactNode } from "react";
import {
  FileText,
  Sheet,
  Calendar,
  SlidersHorizontal,
  ArrowDownToLine,
  ShieldCheck,
  Check,
  X,
  Download,
  PencilLine,
  GitCompare,
  FileCode2,
  Wand2,
  AlertTriangle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useChapter } from "../lib/useChapter";

/* ── Showcase: três telas de produto reais que a MewStack ship, num seletor de
   abas (mantém a página curta — uma tela por vez, mesmo vocabulário visual):
     1. Baixador de NFS-e do portal nacional.
     2. Editor de SPED & XML — você passa os requisitos, ele aplica e valida.
     3. Conciliador SPED × XML — confronta tags do XML com campos do SPED.
   Concreto > metáfora: arquivo de verdade, não diagrama. Tudo em `.console`,
   hairlines `border-cream-line`, mono chips e paleta da marca. */

type TabId = "nfse" | "editor" | "reconcile";

const TABS: { id: TabId; label: string; icon: LucideIcon; file: string; desc: ReactNode }[] = [
  {
    id: "nfse",
    label: "Baixar NFS-e",
    icon: Download,
    file: "baixador-nfse",
    desc: "Um robô baixa suas NFS-e direto do portal nacional, filtra por competência e exporta pra Excel ou PDF — sem ninguém abrir o site da prefeitura nota por nota.",
  },
  {
    id: "editor",
    label: "Editar SPED/XML",
    icon: PencilLine,
    file: "editor-sped-xml",
    desc: "Você descreve o que precisa mudar; o programa aplica nos registros do SPED e nas tags do XML e te mostra o antes → depois, já validado.",
  },
  {
    id: "reconcile",
    label: "Conciliar SPED×XML",
    icon: GitCompare,
    file: "conciliacao-sped-xml",
    desc: "O programa bate cada tag do XML contra o campo correspondente do SPED e aponta na hora onde os valores divergem — auditoria fiscal sem conferência manual.",
  },
];

/* ── data: NFS-e downloader ── */
type Status = "ok" | "proc";
type Note = { id: string; prestador: string; comp: string; valor: string; status: Status };

const NOTES: Note[] = [
  { id: "2025-000487", prestador: "MewStack Tecnologia", comp: "06/2025", valor: "4.250,00", status: "ok" },
  { id: "2025-000486", prestador: "Studio Alpha Ltda", comp: "06/2025", valor: "1.800,00", status: "ok" },
  { id: "2025-000485", prestador: "Contábil Souza ME", comp: "06/2025", valor: "920,00", status: "ok" },
  { id: "2025-000484", prestador: "Verde Engenharia", comp: "06/2025", valor: "7.640,50", status: "proc" },
  { id: "2025-000483", prestador: "Padaria Pão Quente", comp: "06/2025", valor: "320,00", status: "ok" },
  { id: "2025-000482", prestador: "Office Print Center", comp: "05/2025", valor: "1.145,00", status: "ok" },
];

/* ── data: editor requisitos ── */
const EDIT_REQS: { text: string; where: string }[] = [
  { text: "Corrigir CFOP 5102 → 6102", where: "registros C170 · saída interestadual" },
  { text: "Recalcular vICMS com alíquota 18%", where: "NF-e · grupo <ICMS>" },
  { text: "Ajustar CST 060 → 000", where: "registros C170" },
];

/* ── data: conciliação SPED × XML ── */
type Recon = { tag: string; campo: string; xml: string; sped: string; ok: boolean; delta?: string };
const RECON: Recon[] = [
  { tag: "<vProd>", campo: "C170 · VL_ITEM", xml: "4.250,00", sped: "4.250,00", ok: true },
  { tag: "<vDesc>", campo: "C170 · VL_DESC", xml: "0,00", sped: "0,00", ok: true },
  { tag: "<vICMS>", campo: "C170 · VL_ICMS", xml: "216,00", sped: "120,00", ok: false, delta: "96,00" },
  { tag: "<vPIS>", campo: "C170 · VL_PIS", xml: "27,30", sped: "27,30", ok: true },
  { tag: "<vCOFINS>", campo: "C170 · VL_COFINS", xml: "125,80", sped: "125,80", ok: true },
  { tag: "<vNF>", campo: "C100 · VL_DOC", xml: "4.619,10", sped: "4.523,10", ok: false, delta: "96,00" },
];

/* semantic accents (consistent with the existing status colors in this file) */
const GREEN = "oklch(0.46 0.13 150)";
const RED = "oklch(0.52 0.18 25)";

export default function Showcase() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState<TabId>("nfse");
  useChapter(root);

  const tab = TABS.find((t) => t.id === active)!;

  return (
    <section
      ref={root}
      id="exemplos"
      className="relative overflow-clip scroll-mt-24 px-5 pt-14 pb-16 sm:px-8 lg:pt-20 lg:pb-24"
    >
      {/* ── soft pink aurora behind the product shot ── */}
      <div
        aria-hidden
        data-parallax="1.4"
        className="aurora pointer-events-none absolute top-[18%] left-1/2 -z-10 h-[44vh] w-[120vw] max-w-[1000px] -translate-x-1/2 rounded-full opacity-25 blur-[120px]"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, var(--color-pink) 0%, transparent 70%)" }}
      />

      <div className="mx-auto max-w-2xl">
        <p data-reveal className="eyebrow mb-6">exemplos</p>
        <h2 data-reveal-title className="font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.04] font-semibold tracking-[-0.035em]">
          Exemplos do que a gente coloca pra rodar.
        </h2>

        {/* ── tab selector (segmented control) ── */}
        <div
          data-reveal
          role="tablist"
          aria-label="Exemplos de telas"
          className="mt-7 inline-flex flex-wrap gap-1 rounded-xl border border-cream-line bg-cream p-1"
        >
          {TABS.map((t) => {
            const on = active === t.id;
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setActive(t.id)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[0.8rem] font-medium transition-colors ${
                  on
                    ? "bg-cream-deep text-ink shadow-[var(--shadow-soft)]"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                <Icon className="h-3.5 w-3.5" strokeWidth={1.8} style={on ? { color: "var(--color-pink-deep)" } : undefined} />
                {t.label}
              </button>
            );
          })}
        </div>

        <p data-reveal className="mt-5 max-w-[50ch] text-ink-soft">
          {tab.desc}
        </p>
      </div>

      {/* ── active product shot ── */}
      <div data-reveal data-parallax="0.5" className="relative mx-auto mt-10 w-full max-w-5xl">
        <div className="console">
          <WindowChrome file={tab.file} />
          {active === "nfse" && <NfseScreen />}
          {active === "editor" && <EditorScreen />}
          {active === "reconcile" && <ReconcileScreen />}
        </div>
      </div>
    </section>
  );
}

/* ── shared mac-window chrome ── */
function WindowChrome({ file }: { file: string }) {
  return (
    <div className="flex h-10 items-center gap-1.5 border-b border-cream-line bg-cream px-4">
      <span className="win-dot bg-[#FF5F57]" />
      <span className="win-dot bg-[#FEBC2E]" />
      <span className="win-dot bg-[#28C840]" />
      <div className="flex flex-1 justify-center">
        <span className="mono rounded-md border border-cream-line bg-cream-deep px-3 py-1 text-[0.7rem] text-ink-soft">
          {file}
        </span>
      </div>
    </div>
  );
}

/* ════════════════════════ screen 1 — NFS-e downloader ════════════════════════ */
function NfseScreen() {
  return (
    <>
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
      <div className="relative flex" style={{ height: "min(500px, 64vw)" }}>
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
            <Field label="Discriminação" value="Automação de processos e processamento de dados." />

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

        {/* bottom fade-out into the page */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
          style={{ background: "linear-gradient(to top, var(--color-cream-deep) 8%, transparent 100%)" }}
        />
      </div>
    </>
  );
}

/* ════════════════════════ screen 2 — SPED & XML editor ════════════════════════ */
function EditorScreen() {
  return (
    <>
      {/* toolbar: action + status */}
      <div className="flex items-center gap-2 overflow-hidden border-b border-cream-line px-4 py-2.5">
        <span className="shrink-0 text-[0.82rem] font-medium text-ink">Editor de SPED &amp; XML</span>
        <span className="mono hidden shrink-0 text-[0.72rem] text-ink-soft sm:inline">2 arquivos · 1.482 registros</span>
        <div className="ml-auto hidden shrink-0 items-center gap-1.5 sm:flex">
          <span
            className="inline-flex items-center gap-1.5 rounded-lg border border-cream-line bg-cream-deep px-2.5 py-1.5 text-[0.72rem] font-medium"
            style={{ color: GREEN }}
          >
            <Check className="h-3.5 w-3.5" strokeWidth={2.4} />
            Validado
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-pink px-2.5 py-1.5 text-[0.72rem] font-semibold text-[oklch(0.22_0.03_356)]">
            <Wand2 className="h-3.5 w-3.5" strokeWidth={2} />
            Aplicar
          </span>
        </div>
      </div>

      {/* body: requisitos | diff */}
      <div className="grid md:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]" style={{ minHeight: "min(500px, 64vw)" }}>
        {/* requisitos */}
        <div className="border-b border-cream-line p-4 sm:p-5 md:border-r md:border-b-0">
          <p className="text-[0.66rem] font-medium tracking-wide text-ink-soft/70 uppercase">
            Requisitos que você passou
          </p>
          <ul className="mt-3 flex flex-col gap-2.5">
            {EDIT_REQS.map((r) => (
              <li
                key={r.text}
                className="flex items-start gap-2.5 rounded-xl border border-cream-line bg-cream-deep px-3 py-2.5"
              >
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-pink/15 text-pink-deep">
                  <Check className="h-3 w-3" strokeWidth={2.5} />
                </span>
                <div className="min-w-0">
                  <p className="text-[0.82rem] leading-snug text-ink">{r.text}</p>
                  <p className="mono mt-0.5 truncate text-[0.7rem] text-ink-soft">{r.where}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* diff */}
        <div className="min-w-0 p-4 sm:p-5">
          <p className="text-[0.66rem] font-medium tracking-wide text-ink-soft/70 uppercase">Antes → depois</p>
          <div className="mt-3 flex flex-col gap-3">
            {/* SPED block */}
            <div className="overflow-hidden rounded-xl border border-cream-line">
              <div className="flex items-center gap-2 border-b border-cream-line bg-cream px-3 py-1.5">
                <FileCode2 className="h-3.5 w-3.5 text-ink-soft" strokeWidth={1.8} />
                <span className="mono truncate text-[0.7rem] text-ink-soft">movimentacao.sped · C170</span>
              </div>
              <div className="bg-cream-deep py-1.5">
                <DiffRow sign="-">
                  {"|C170|1| |"}
                  <span style={{ color: RED }}>5102</span>
                  {"|6,00|UN|1.250,00|"}
                </DiffRow>
                <DiffRow sign="+">
                  {"|C170|1| |"}
                  <span className="font-semibold text-pink-deep">6102</span>
                  {"|6,00|UN|1.250,00|"}
                </DiffRow>
              </div>
            </div>

            {/* XML block */}
            <div className="overflow-hidden rounded-xl border border-cream-line">
              <div className="flex items-center gap-2 border-b border-cream-line bg-cream px-3 py-1.5">
                <FileCode2 className="h-3.5 w-3.5 text-ink-soft" strokeWidth={1.8} />
                <span className="mono truncate text-[0.7rem] text-ink-soft">{"nota-54321.xml · <ICMS>"}</span>
              </div>
              <div className="bg-cream-deep py-1.5">
                <DiffRow sign="-">
                  {"<vICMS>"}
                  <span style={{ color: RED }}>120,00</span>
                  {"</vICMS>"}
                </DiffRow>
                <DiffRow sign="+">
                  {"<vICMS>"}
                  <span className="font-semibold text-pink-deep">216,00</span>
                  {"</vICMS>"}
                </DiffRow>
              </div>
            </div>

            {/* status */}
            <div className="flex items-center gap-2 rounded-xl border border-cream-line bg-cream px-3 py-2 text-[0.76rem]">
              <span
                className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                style={{ background: "oklch(0.62 0.13 150 / 0.16)", color: GREEN }}
              >
                <Check className="h-3 w-3" strokeWidth={2.6} />
              </span>
              <span className="min-w-0 text-ink">
                3 alterações aplicadas e <span className="font-medium">validadas</span> · 0 erros
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* one diff line — marker | code, GPU-cheap tinted background */
function DiffRow({ sign, children }: { sign: "+" | "-"; children: ReactNode }) {
  const add = sign === "+";
  return (
    <div
      className="grid grid-cols-[1.25rem_minmax(0,1fr)] items-center gap-x-1 px-3"
      style={{ background: add ? "oklch(0.62 0.13 150 / 0.10)" : "oklch(0.58 0.17 25 / 0.09)" }}
    >
      <span className="mono select-none text-center text-[0.72rem]" style={{ color: add ? GREEN : RED }}>
        {sign}
      </span>
      <code className="mono block truncate text-[0.72rem] leading-[1.85] text-ink">{children}</code>
    </div>
  );
}

/* ════════════════════════ screen 3 — SPED × XML reconciler ════════════════════════ */
const RGRID =
  "grid grid-cols-[4.25rem_minmax(0,1fr)_minmax(0,1fr)_1.5rem] items-center gap-x-2 px-4 sm:grid-cols-[6.5rem_minmax(0,1fr)_5.5rem_5.5rem_7rem] sm:gap-x-3";

function ReconcileScreen() {
  return (
    <>
      {/* toolbar: summary */}
      <div className="flex items-center gap-2 overflow-hidden border-b border-cream-line px-4 py-2.5">
        <span className="shrink-0 text-[0.82rem] font-medium text-ink">Conciliação SPED × XML</span>
        <span className="mono hidden shrink-0 text-[0.72rem] text-ink-soft sm:inline">competência 06/2025</span>
        <div className="ml-auto hidden shrink-0 items-center gap-1.5 sm:flex">
          <span
            className="inline-flex items-center gap-1.5 rounded-lg border border-cream-line bg-cream-deep px-2.5 py-1.5 text-[0.72rem] font-medium"
            style={{ color: GREEN }}
          >
            <Check className="h-3.5 w-3.5" strokeWidth={2.4} />
            5/6 conferem
          </span>
          <span
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[0.72rem] font-semibold text-pink-deep"
            style={{ background: "oklch(0.745 0.155 356 / 0.14)" }}
          >
            <AlertTriangle className="h-3.5 w-3.5" strokeWidth={2} />
            1 divergência
          </span>
        </div>
      </div>

      {/* body: reconciliation table */}
      <div className="flex flex-col" style={{ minHeight: "min(500px, 64vw)" }}>
        {/* header */}
        <div
          className={`${RGRID} shrink-0 border-b border-cream-line py-2 text-[0.66rem] font-medium tracking-wide text-ink-soft/70 uppercase`}
        >
          <span>Tag · XML</span>
          <span className="hidden sm:block">Campo · SPED</span>
          <span className="text-right">XML (R$)</span>
          <span className="text-right">SPED (R$)</span>
          <span className="hidden text-right sm:block">Status</span>
        </div>

        {/* rows */}
        {RECON.map((r) => (
          <div
            key={r.tag}
            className={`${RGRID} border-b border-cream-line/60 py-2.5 ${r.ok ? "" : "bg-pink/[0.06]"}`}
          >
            <code className="mono truncate text-[0.74rem] text-ink">{r.tag}</code>
            <span className="mono hidden truncate text-[0.72rem] text-ink-soft sm:block">{r.campo}</span>
            <span className="mono text-right text-[0.78rem] tabular-nums text-ink">{r.xml}</span>
            <span
              className={`mono text-right text-[0.78rem] tabular-nums ${
                r.ok ? "text-ink" : "font-semibold text-pink-deep"
              }`}
            >
              {r.sped}
            </span>
            <span className="flex items-center justify-end gap-1 text-[0.74rem]">
              {r.ok ? (
                <>
                  <Check className="h-3.5 w-3.5 shrink-0" strokeWidth={2.4} style={{ color: GREEN }} />
                  <span className="hidden font-medium sm:inline" style={{ color: GREEN }}>
                    confere
                  </span>
                </>
              ) : (
                <>
                  <X className="h-3.5 w-3.5 shrink-0 text-pink-deep" strokeWidth={2.4} />
                  <span className="mono hidden font-semibold text-pink-deep sm:inline">Δ {r.delta}</span>
                </>
              )}
            </span>
          </div>
        ))}

        {/* totals footer */}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-cream-line bg-cream px-4 py-2.5 text-[0.78rem]">
          <span className="text-ink-soft">
            6 tags conferidas · <span className="font-medium text-ink">5 conferem</span> ·{" "}
            <span className="font-medium text-pink-deep">1 divergência</span>
          </span>
          <span className="mono text-ink-soft">
            Δ líquida <span className="font-semibold text-pink-deep">R$ 96,00</span>
          </span>
        </div>
      </div>
    </>
  );
}

/* ── shared bits (NFS-e detail panel) ── */
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
