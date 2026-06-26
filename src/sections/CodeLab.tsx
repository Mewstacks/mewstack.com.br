import { useEffect, useRef, useState } from "react";
import { Play, Loader2, Check, ChevronDown, TerminalSquare } from "lucide-react";
import Reveal from "../components/Reveal";

/* Linear-style "code in the marketing page", taken further: a real-feeling
   VS Code editor the visitor can actually RUN. Pressing ▶ types a terminal
   output and then opens MewStack's Instagram — a playful payoff that also
   shows, concretely, the kind of routine the studio builds. Light page,
   dark IDE (the Linear/Supabase pattern). */
const INSTAGRAM = "https://instagram.com/meewstack";

type TokType = "kw" | "fn" | "str" | "num" | "com" | "op" | "builtin" | "fg";
type Line = [string, TokType][];

type Theme = {
  name: string;
  bg: string;
  fg: string;
  gutter: string;
  border: string;
  tab: string;
  caret: string;
  tok: Record<Exclude<TokType, "fg">, string>;
};

const THEMES: Theme[] = [
  {
    name: "MewStack",
    bg: "#1f1d22",
    fg: "#e8e4ec",
    gutter: "#6b6573",
    border: "#322e38",
    tab: "#28252d",
    caret: "#ff7bac",
    tok: { kw: "#ff7bac", builtin: "#c4a7ff", fn: "#6cc6ff", str: "#8fd98f", num: "#f0b860", com: "#6b6573", op: "#b9b3c2" },
  },
  {
    name: "Rosé Pine",
    bg: "#191724",
    fg: "#e0def4",
    gutter: "#6e6a86",
    border: "#26233a",
    tab: "#1f1d2e",
    caret: "#ebbcba",
    tok: { kw: "#c4a7e7", builtin: "#9ccfd8", fn: "#ebbcba", str: "#f6c177", num: "#f6c177", com: "#6e6a86", op: "#908caa" },
  },
  {
    name: "Mono",
    bg: "#1b1a1d",
    fg: "#d9d6dd",
    gutter: "#58555f",
    border: "#2b292f",
    tab: "#232227",
    caret: "#ff7bac",
    tok: { kw: "#ff7bac", builtin: "#d9d6dd", fn: "#d9d6dd", str: "#9b97a1", num: "#d9d6dd", com: "#58555f", op: "#85818b" },
  },
];

const CODE: Line[] = [
  [["from ", "kw"], ["mewstack ", "fg"], ["import ", "kw"], ["automatizar", "builtin"]],
  [],
  [["# tarefas chatas que ninguém merece fazer na mão", "com"]],
  [["tarefas ", "fg"], ["= ", "op"], ["[", "op"], ['"baixar notas"', "str"], [", ", "op"], ['"limpar planilha"', "str"], [", ", "op"], ['"enviar relatório"', "str"], ["]", "op"]],
  [],
  [["@automatizar", "fn"], ["(", "op"], ["quando", "fg"], ["=", "op"], ['"toda segunda às 08:00"', "str"], [")", "op"]],
  [["def ", "kw"], ["liberar_meu_tempo", "fn"], ["():", "op"]],
  [["    for ", "kw"], ["tarefa ", "fg"], ["in ", "kw"], ["tarefas", "fg"], [":", "op"]],
  [["        print", "builtin"], ["(", "op"], ['f"✓ {tarefa} agora roda sozinho"', "str"], [")", "op"]],
  [["    return ", "kw"], ['"tempo livre desbloqueado ✨"', "str"]],
  [],
  [["if ", "kw"], ["__name__ ", "builtin"], ["== ", "op"], ['"__main__"', "str"], [":", "op"]],
  [["    liberar_meu_tempo", "fn"], ["()", "op"]],
  [["    abrir", "builtin"], ["(", "op"], ['"instagram.com/meewstack"', "str"], [")  ", "op"], ["# ▶ vem ver mais", "com"]],
];

const OUTPUT = [
  "$ python liberar_meu_tempo.py",
  "✓ baixar notas agora roda sozinho",
  "✓ limpar planilha agora roda sozinho",
  "✓ enviar relatório agora roda sozinho",
  "tempo livre desbloqueado ✨",
  "→ abrindo instagram.com/meewstack …",
];

const tokColor = (t: Theme, type: TokType) => (type === "fg" ? t.fg : t.tok[type]);
const termColor = (l: string, t: Theme) =>
  l.startsWith("$") ? t.gutter : l.startsWith("✓") ? "#7fd98f" : l.startsWith("→") ? t.tok.kw : t.fg;

export default function CodeLab() {
  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const [themeIdx, setThemeIdx] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [showTerm, setShowTerm] = useState(false);
  const [lines, setLines] = useState<string[]>([]);
  const timers = useRef<number[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);
  const theme = THEMES[themeIdx];

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => () => clearTimers(), []);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [menuOpen]);

  const finish = () => {
    window.open(INSTAGRAM, "_blank", "noopener,noreferrer");
    setRunning(false);
    setDone(true);
  };

  const run = () => {
    if (running) return;
    clearTimers();
    setLines([]);
    setDone(false);
    setRunning(true);
    setShowTerm(true);

    if (reduce) {
      setLines(OUTPUT);
      timers.current.push(window.setTimeout(finish, 550));
      return;
    }
    OUTPUT.forEach((l, i) => {
      timers.current.push(window.setTimeout(() => setLines((p) => [...p, l]), 320 + i * 340));
    });
    timers.current.push(window.setTimeout(finish, 320 + OUTPUT.length * 340 + 550));
  };

  return (
    <section id="rode" className="mx-auto max-w-5xl scroll-mt-24 px-5 py-14 sm:px-8 lg:py-20">
      <Reveal className="max-w-2xl">
        <p className="eyebrow mb-6">experimente</p>
        <h2 className="font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.04] font-semibold tracking-[-0.035em]">
          Não acredita que roda sozinho? Roda você mesmo.
        </h2>
        <p className="mt-5 max-w-[48ch] text-ink-soft">
          Aperta <span className="font-medium text-ink">▶ Executar</span>. É Python de
          verdade, curtinho, o mesmo tipo de rotina que a gente monta pra tirar o
          trabalho repetitivo das suas costas.
        </p>
      </Reveal>

      <Reveal delay={0.1} className="mt-8">
        <div
          className="overflow-hidden rounded-2xl shadow-[0_40px_90px_-50px_rgba(40,30,40,0.55)] ring-1 ring-black/5"
          style={{ background: theme.bg, border: `1px solid ${theme.border}` }}
        >
          {/* title bar */}
          <div
            className="flex items-center gap-3 px-4 py-2.5"
            style={{ borderBottom: `1px solid ${theme.border}` }}
          >
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full" style={{ background: "#ff5f57" }} />
              <span className="h-3 w-3 rounded-full" style={{ background: "#febc2e" }} />
              <span className="h-3 w-3 rounded-full" style={{ background: "#28c840" }} />
            </div>
            <div
              className="ml-2 hidden items-center gap-2 rounded-lg px-3 py-1 text-[0.78rem] sm:flex"
              style={{ background: theme.tab, color: theme.fg }}
            >
              <TerminalSquare className="h-3.5 w-3.5" strokeWidth={1.8} style={{ color: theme.tok.kw }} />
              liberar_meu_tempo.py
            </div>

            <div className="ml-auto flex items-center gap-2">
              {/* theme switcher (Linear-style, top-right) */}
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((v) => !v)}
                  aria-haspopup="listbox"
                  aria-expanded={menuOpen}
                  className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[0.74rem] transition-colors"
                  style={{ color: theme.gutter, border: `1px solid ${theme.border}` }}
                >
                  {theme.name}
                  <ChevronDown className="h-3.5 w-3.5" strokeWidth={2} />
                </button>
                {menuOpen && (
                  <ul
                    role="listbox"
                    className="absolute right-0 z-10 mt-1.5 w-36 overflow-hidden rounded-lg py-1 text-[0.78rem] shadow-xl"
                    style={{ background: theme.tab, border: `1px solid ${theme.border}` }}
                  >
                    {THEMES.map((t, i) => (
                      <li key={t.name}>
                        <button
                          type="button"
                          onClick={() => {
                            setThemeIdx(i);
                            setMenuOpen(false);
                          }}
                          className="flex w-full items-center justify-between px-3 py-1.5 text-left transition-colors hover:bg-white/5"
                          style={{ color: theme.fg }}
                        >
                          {t.name}
                          {i === themeIdx && <Check className="h-3.5 w-3.5" strokeWidth={2.4} style={{ color: theme.tok.kw }} />}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* run */}
              <button
                type="button"
                onClick={run}
                disabled={running}
                className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[0.78rem] font-semibold text-[#0b2912] transition-[transform,filter] duration-200 hover:brightness-105 active:translate-y-px disabled:opacity-70"
                style={{ background: "#4ade80" }}
              >
                {running ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2.4} />
                    Rodando…
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5 fill-current" strokeWidth={0} />
                    Executar
                  </>
                )}
              </button>
            </div>
          </div>

          {/* editor */}
          <div className="flex font-mono text-[0.74rem] leading-[1.65] sm:text-[0.84rem]">
            {/* gutter */}
            <div
              className="select-none px-3 py-4 text-right sm:px-4"
              style={{ color: theme.gutter, borderRight: `1px solid ${theme.border}` }}
            >
              {CODE.map((_, i) => (
                <div key={i}>{String(i + 1).padStart(2, "0")}</div>
              ))}
            </div>
            {/* code */}
            <pre className="min-w-0 flex-1 overflow-x-auto px-4 py-4" style={{ color: theme.fg }}>
              <code>
                {CODE.map((line, i) => (
                  <div key={i} className="whitespace-pre min-h-[1.65em]">
                    {line.map(([txt, type], j) => (
                      <span key={j} style={{ color: tokColor(theme, type) }}>
                        {txt}
                      </span>
                    ))}
                  </div>
                ))}
              </code>
            </pre>
          </div>

          {/* terminal */}
          {showTerm && (
            <div style={{ borderTop: `1px solid ${theme.border}` }}>
              <div
                className="flex items-center gap-2 px-4 py-2 text-[0.7rem] font-medium uppercase tracking-[0.14em]"
                style={{ color: theme.gutter }}
              >
                <TerminalSquare className="h-3.5 w-3.5" strokeWidth={1.8} />
                Terminal
              </div>
              <pre
                className="overflow-x-auto px-4 pb-4 font-mono text-[0.74rem] leading-relaxed sm:text-[0.82rem]"
                aria-live="polite"
              >
                {lines.map((l, i) => (
                  <div key={i} style={{ color: termColor(l, theme) }}>
                    {l}
                    {running && i === lines.length - 1 && (
                      <span className="ml-0.5 inline-block animate-pulse" style={{ color: theme.caret }}>
                        ▋
                      </span>
                    )}
                  </div>
                ))}
                {running && lines.length === 0 && (
                  <span className="inline-block animate-pulse" style={{ color: theme.caret }}>
                    ▋
                  </span>
                )}
              </pre>
            </div>
          )}
        </div>

        <p className="mt-3 text-center text-[0.8rem] text-ink-soft">
          {done ? "Aberto! 🐱 (se o navegador bloqueou o pop-up, é só liberar)" : "Sim, ao executar ele abre nosso Instagram. Pode rodar sem medo. 🐱"}
        </p>
      </Reveal>
    </section>
  );
}
