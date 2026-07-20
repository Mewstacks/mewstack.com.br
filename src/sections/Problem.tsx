import { useRef } from "react";
import { Check } from "lucide-react";
import SignalLine from "../components/SignalLine";
import { useChapter } from "../lib/useChapter";

const LEDGER = [
  ["controle_FINAL_v7(3).xlsx", "uma fonte única, sempre atualizada"],
  ["retrabalho manual", "rotina executada e monitorada"],
  ["dado preso no WhatsApp", "informação disponível para decidir"],
  ["status que ninguém enxerga", "alerta antes do problema crescer"],
];

const PAINS = [
  "O time redigita a mesma informação em sistemas diferentes.",
  "O fechamento depende da pessoa que conhece a planilha.",
  "Documento chega em PDF, foto, e-mail e mensagem.",
  "A decisão aparece tarde porque o dado ainda está sendo organizado.",
];

export default function Problem() {
  const root = useRef<HTMLElement>(null);
  useChapter(root);

  return (
    <section
      ref={root}
      id="problema"
      className="relative scroll-mt-24 overflow-clip border-y border-line bg-paper-rose"
    >
      <div aria-hidden className="paper-vignette pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-[1200px] px-5 py-20 sm:px-8 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[7fr_5fr] lg:gap-16">
          <div className="min-w-0">
            <p data-reveal className="section-index mb-7">
              <span>01</span>
              <span>o problema</span>
            </p>
            <h2
              data-reveal-title
              className="max-w-[12ch] text-h2 leading-[1.04] text-ink"
            >
              O trabalho não é confuso. As ferramentas é que se perderam.
            </h2>
            <p data-reveal className="mt-6 max-w-[58ch] text-lede text-ink-soft">
              Quando planilha, sistema legado, documento e conversa não se conectam,
              alguém vira a integração. É aí que o tempo escapa e o erro aparece.
            </p>
          </div>

          <div
            data-reveal
            className="relative min-h-72 border-y border-line lg:min-h-[24rem]"
          >
            <div className="mono absolute top-4 left-0 text-[0.65rem] text-ink-faint">
              ENTRADA · CAÓTICA
            </div>
            <div className="mono absolute right-0 bottom-4 text-[0.65rem] text-ink-faint">
              SAÍDA · ORDENADA
            </div>
            <SignalLine
              triggerRef={root}
              viewBox="0 0 520 390"
              path="M80 -20 C80 35 250 24 198 88 C150 146 38 75 62 173 C88 280 345 87 408 168 C463 239 265 271 318 326 C351 360 438 348 438 410"
              className="absolute inset-0 h-full w-full"
            />
            <span
              aria-hidden
              className="absolute top-[21%] left-[36%] h-2 w-2 rounded-full border border-signal bg-paper-rose"
            />
            <span
              aria-hidden
              className="absolute right-[14%] bottom-[15%] h-2 w-2 rounded-full bg-signal"
            />
          </div>
        </div>

        <div data-reveal className="mt-16 border-t border-line-strong">
          <div className="mono grid grid-cols-[1fr_auto_1fr] gap-3 border-b border-line py-3 text-[0.68rem] text-ink-faint sm:gap-8">
            <span>ANTES</span>
            <span aria-hidden>→</span>
            <span>DEPOIS</span>
          </div>
          {LEDGER.map(([before, after]) => (
            <div
              key={before}
              className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 border-b border-line py-4 sm:gap-8"
            >
              <span className="mono min-w-0 break-words text-[0.74rem] text-ink-faint line-through decoration-line-strong sm:text-[0.82rem]">
                {before}
              </span>
              <span aria-hidden className="h-px w-4 bg-signal sm:w-10" />
              <span className="flex min-w-0 items-start gap-2 text-[0.92rem] text-ink sm:text-base">
                <Check
                  aria-hidden
                  className="mt-1 h-4 w-4 shrink-0 text-signal-deep"
                  strokeWidth={2}
                />
                {after}
              </span>
            </div>
          ))}
        </div>

        <ol className="mt-16 border-t border-line-strong">
          {PAINS.map((pain, index) => (
            <li
              key={pain}
              data-reveal
              className="grid grid-cols-[2.5rem_1fr] gap-4 border-b border-line py-5 sm:grid-cols-[4rem_1fr]"
            >
              <span className="mono text-[0.7rem] text-ink-faint">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="max-w-[62ch] text-base text-ink">{pain}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
