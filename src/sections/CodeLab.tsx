import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Loader2, Play, TerminalSquare } from "lucide-react";
import MediaFrame from "../components/MediaFrame";
import { reduceMotion } from "../lib/motion";
import { useChapter } from "../lib/useChapter";

type TokenType = "keyword" | "function" | "string" | "comment" | "operator" | "plain";
type CodeLine = [string, TokenType][];

type EditorTheme = {
  name: string;
  background: string;
  foreground: string;
  muted: string;
  border: string;
  tab: string;
  colors: Record<TokenType, string>;
};

const THEMES: EditorTheme[] = [
  {
    name: "MewStack",
    background: "var(--color-night)",
    foreground: "var(--color-paper-on-night)",
    muted: "var(--color-code-muted)",
    border: "var(--color-night-line)",
    tab: "var(--color-night-2)",
    colors: {
      keyword: "var(--color-signal-bright)",
      function: "var(--color-code-blue)",
      string: "var(--color-code-green)",
      comment: "var(--color-code-muted)",
      operator: "var(--color-paper-on-night-soft)",
      plain: "var(--color-paper-on-night)",
    },
  },
  {
    name: "Violeta",
    background: "var(--color-night-2)",
    foreground: "var(--color-paper-on-night)",
    muted: "var(--color-paper-on-night-soft)",
    border: "var(--color-night-line)",
    tab: "var(--color-night)",
    colors: {
      keyword: "var(--color-code-violet)",
      function: "var(--color-signal-bright)",
      string: "var(--color-code-amber)",
      comment: "var(--color-code-muted)",
      operator: "var(--color-paper-on-night-soft)",
      plain: "var(--color-paper-on-night)",
    },
  },
  {
    name: "Mono",
    background: "var(--color-night)",
    foreground: "var(--color-paper-on-night)",
    muted: "var(--color-code-muted)",
    border: "var(--color-night-line)",
    tab: "var(--color-night-2)",
    colors: {
      keyword: "var(--color-paper-on-night)",
      function: "var(--color-paper-on-night)",
      string: "var(--color-paper-on-night-soft)",
      comment: "var(--color-code-muted)",
      operator: "var(--color-paper-on-night-soft)",
      plain: "var(--color-paper-on-night)",
    },
  },
];

const INSTAGRAM = "https://instagram.com/meewstack";

const CODE: CodeLine[] = [
  [["from ", "keyword"], ["mewstack ", "plain"], ["import ", "keyword"], ["automatizar", "function"]],
  [],
  [["# tarefas chatas que ninguém merece fazer na mão", "comment"]],
  [["tarefas ", "plain"], ["= ", "operator"], ["[", "operator"], ['"digitar notas"', "string"], [", ", "operator"], ['"consultar ecac"', "string"], [", ", "operator"], ['"conciliar extratos"', "string"], ["]", "operator"]],
  [],
  [["@automatizar", "function"], ["(", "operator"], ["quando", "plain"], ["=", "operator"], ['"toda segunda às 08:00"', "string"], [")", "operator"]],
  [["def ", "keyword"], ["liberar_meu_tempo", "function"], ["():", "operator"]],
  [["    for ", "keyword"], ["tarefa ", "plain"], ["in ", "keyword"], ["tarefas", "plain"], [":", "operator"]],
  [["        print", "function"], ["(", "operator"], ['f"✓ {tarefa} agora roda sozinho"', "string"], [")", "operator"]],
  [["    return ", "keyword"], ['"tempo livre desbloqueado ✨"', "string"]],
  [],
  [["if ", "keyword"], ["__name__ ", "plain"], ["== ", "operator"], ['"__main__"', "string"], [":", "operator"]],
  [["    liberar_meu_tempo", "function"], ["()", "operator"]],
  [["    abrir", "function"], ["(", "operator"], ['"instagram.com/meewstack"', "string"], [")  ", "operator"], ["# ▶ vem ver mais", "comment"]],
];

const OUTPUT = [
  "$ python liberar_meu_tempo.py",
  "✓ digitar notas agora roda sozinho",
  "✓ consultar ecac agora roda sozinho",
  "✓ conciliar extratos agora roda sozinho",
  "tempo livre desbloqueado ✨",
  "→ abrindo instagram.com/meewstack …",
];

const outputColor = (line: string, theme: EditorTheme) => {
  if (line.startsWith("$")) return theme.muted;
  if (line.startsWith("✓")) return "var(--color-code-green)";
  if (line.startsWith("→")) return "var(--color-signal-bright)";
  return theme.foreground;
};

export default function CodeLab() {
  const root = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);
  const [themeIndex, setThemeIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState<string[]>([]);
  const theme = THEMES[themeIndex];

  useChapter(root, { variant: "scaleHandoff" });

  const clearTimers = () => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
  };

  useEffect(() => () => clearTimers(), []);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: MouseEvent) => {
      if (menu.current && !menu.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [menuOpen]);

  const finish = () => {
    window.open(INSTAGRAM, "_blank", "noopener,noreferrer");
    setRunning(false);
  };

  const run = () => {
    if (running) return;
    clearTimers();
    setOutput([]);
    setRunning(true);

    if (reduceMotion()) {
      setOutput(OUTPUT);
      timers.current.push(window.setTimeout(finish, 550));
      return;
    }

    OUTPUT.forEach((line, index) => {
      timers.current.push(
        window.setTimeout(() => {
          setOutput((current) => [...current, line]);
        }, 220 + index * 320),
      );
    });
    timers.current.push(
      window.setTimeout(finish, 220 + OUTPUT.length * 320 + 480),
    );
  };

  return (
    <section
      ref={root}
      id="rode"
      className="relative scroll-mt-24 overflow-clip bg-night text-paper-on-night"
    >
      <div className="relative mx-auto max-w-[1200px] px-5 py-20 sm:px-8 lg:py-28">
        <div className="grid gap-6 lg:grid-cols-12">
          <p data-reveal className="section-index section-index-dark lg:col-span-3">
            <span>04</span>
            <span>dentro da máquina</span>
          </p>
          <div className="lg:col-span-8 lg:col-start-5">
            <h2
              data-reveal-title
              className="max-w-[13ch] text-h2 leading-[1.04] text-paper-on-night"
            >
              A rotina deixa de ser promessa quando você aperta executar.
            </h2>
            <p
              data-reveal
              className="mt-6 max-w-[56ch] text-paper-on-night-soft"
            >
              Aperta <span className="font-medium text-paper-on-night">Executar</span>. É
              Python de verdade, curtinho, o mesmo tipo de rotina que a gente monta pra
              tirar o trabalho repetitivo das suas costas. No fim, ele abre o nosso
              Instagram.
            </p>
          </div>
        </div>

        <div data-reveal data-handoff className="mt-12 will-change-transform">
          <MediaFrame
            ratio="auto"
            captionPosition="top"
            onNight
            caption={{
              name: "LAB — EXECUTÁVEL",
              detail: "Python 3 · liberar_meu_tempo.py",
              type: "ATIVO",
            }}
          >
            <div
              className="min-w-0 overflow-hidden"
              style={{ background: theme.background, color: theme.foreground }}
            >
              <div
                className="flex min-h-14 min-w-0 items-center gap-3 px-3 sm:px-4"
                style={{ borderBottom: `1px solid ${theme.border}` }}
              >
                <div
                  className="mono hidden min-w-0 items-center gap-2 rounded-md px-3 py-1.5 text-[0.72rem] sm:flex"
                  style={{ background: theme.tab, color: theme.foreground }}
                >
                  <TerminalSquare
                    aria-hidden
                    className="h-3.5 w-3.5 shrink-0 text-signal-bright"
                  />
                  <span className="truncate">liberar_meu_tempo.py</span>
                </div>

                <div className="ml-auto flex items-center gap-2">
                  <div ref={menu} className="relative">
                    <button
                      type="button"
                      aria-haspopup="listbox"
                      aria-expanded={menuOpen}
                      onClick={() => setMenuOpen((value) => !value)}
                      className="mono flex min-h-11 items-center gap-1.5 rounded-md border border-night-line px-2.5 text-[0.68rem]"
                      style={{ color: theme.muted }}
                    >
                      {theme.name}
                      <ChevronDown aria-hidden className="h-3.5 w-3.5" />
                    </button>
                    {menuOpen && (
                      <ul
                        role="listbox"
                        className="absolute right-0 z-20 mt-1 w-36 overflow-hidden rounded-md border border-night-line bg-night-2 py-1 text-[0.76rem] shadow-[var(--shadow-viewport)]"
                      >
                        {THEMES.map((item, index) => (
                          <li key={item.name}>
                            <button
                              type="button"
                              role="option"
                              aria-selected={index === themeIndex}
                              onClick={() => {
                                setThemeIndex(index);
                                setMenuOpen(false);
                              }}
                              className="flex min-h-11 w-full items-center justify-between px-3 text-left text-paper-on-night transition-colors hover:bg-signal-ghost"
                            >
                              {item.name}
                              {index === themeIndex && (
                                <Check
                                  aria-hidden
                                  className="h-4 w-4 text-signal-bright"
                                />
                              )}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={run}
                    disabled={running}
                    aria-label={running ? "Automação em execução" : "Executar automação"}
                    className="flex min-h-11 items-center gap-2 rounded-md bg-paper-on-night px-3 text-[0.76rem] font-semibold text-night transition-colors hover:bg-paper-high disabled:opacity-60"
                  >
                    {running ? (
                      <Loader2 aria-hidden className="h-4 w-4 animate-spin" />
                    ) : (
                      <Play aria-hidden className="h-4 w-4 fill-current" />
                    )}
                    <span className="hidden sm:inline">
                      {running ? "Rodando…" : "Executar"}
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex min-w-0 font-mono text-[0.7rem] leading-[1.7] sm:text-[0.8rem]">
                <div
                  aria-hidden
                  className="select-none px-3 py-5 text-right sm:px-4"
                  style={{ color: theme.muted, borderRight: `1px solid ${theme.border}` }}
                >
                  {CODE.map((_, index) => (
                    <div key={index}>{String(index + 1).padStart(2, "0")}</div>
                  ))}
                </div>
                <pre className="min-w-0 flex-1 overflow-x-auto px-4 py-5">
                  <code>
                    {CODE.map((line, index) => (
                      <div key={index} className="min-h-[1.7em] whitespace-pre">
                        {line.map(([text, type], tokenIndex) => (
                          <span key={tokenIndex} style={{ color: theme.colors[type] }}>
                            {text}
                          </span>
                        ))}
                      </div>
                    ))}
                  </code>
                </pre>
              </div>

              {(output.length > 0 || running) && (
                <div
                  className="min-h-36 px-4 py-4 font-mono text-[0.72rem] leading-relaxed sm:text-[0.8rem]"
                  style={{ borderTop: `1px solid ${theme.border}` }}
                  aria-live="polite"
                >
                  <p className="mono mb-2 text-[0.62rem]" style={{ color: theme.muted }}>
                    TERMINAL
                  </p>
                  {output.map((line) => (
                    <p
                      key={line}
                      style={{ color: outputColor(line, theme) }}
                    >
                      {line}
                    </p>
                  ))}
                  {running && <span className="inline-block h-3 w-1.5 bg-signal" />}
                </div>
              )}
            </div>
          </MediaFrame>
        </div>
      </div>
    </section>
  );
}
