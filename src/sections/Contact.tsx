import { useRef, type MouseEvent } from "react";
import Logo from "../components/Logo";
import { SignalScene } from "../components/SignalJourney";
import { NAV_CHAPTERS } from "../lib/chapters";
import { useChapter } from "../lib/useChapter";
import { useMagnetic } from "../lib/useMagnetic";

const INSTAGRAM_USER = "meewstack";
const INSTAGRAM = `https://www.instagram.com/${INSTAGRAM_USER}/`;
const INSTAGRAM_APP = `instagram://user?username=${INSTAGRAM_USER}`;
const EMAIL = "vendas@mewstack.com.br";
const WHATSAPP = "https://wa.me/5554996573455";

function isIOS() {
  if (typeof navigator === "undefined") return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1)
  );
}

function openInstagram(event: MouseEvent<HTMLAnchorElement>) {
  if (!isIOS()) return;
  event.preventDefault();
  const startedAt = Date.now();
  const fallback = window.setTimeout(() => {
    if (Date.now() - startedAt < 1200) window.location.href = INSTAGRAM;
  }, 700);
  const cancel = () => window.clearTimeout(fallback);
  window.addEventListener("pagehide", cancel, { once: true });
  window.addEventListener("blur", cancel, { once: true });
  window.location.href = INSTAGRAM_APP;
}

export default function Contact() {
  const root = useRef<HTMLElement>(null);
  useChapter(root, { exit: false });
  useMagnetic(root, "[data-contact-magnetic]", { strength: 0.12, max: 10 });

  return (
    <section
      ref={root}
      id="contato"
      className="relative scroll-mt-24 overflow-clip bg-night text-paper-on-night"
    >
      <SignalScene scene="contact" />

      <div className="relative z-[var(--z-content)] mx-auto max-w-[1200px] px-5 py-24 sm:px-8 lg:py-32">
        <div className="grid gap-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p data-reveal className="section-index section-index-dark mb-8">
              <span>07</span>
              <span aria-hidden className="signal-dot" data-pulse="true" />
              <span>aberto para projetos</span>
            </p>
            <h2
              data-reveal-title
              className="max-w-[12ch] text-[clamp(2.6rem,6vw,5rem)] leading-[0.98] text-paper-on-night"
            >
              Mostra o processo. A gente encontra o <em className="font-wonk">sinal.</em>
            </h2>
            <p
              data-reveal
              className="mt-7 max-w-[48ch] text-lede text-paper-on-night-soft"
            >
              Em uma conversa curta, mapeamos o que hoje depende de repetição,
              improviso ou conferência manual — e por onde vale começar.
            </p>

            <div data-reveal className="mt-9 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                data-contact-magnetic
                className="btn btn-primary btn-inverse w-full will-change-transform sm:w-auto"
              >
                Chamar no WhatsApp
              </a>
              <a href={`mailto:${EMAIL}`} className="text-link min-h-11 py-2 text-paper-on-night">
                {EMAIL}
              </a>
              <a
                href={INSTAGRAM}
                target="_blank"
                rel="noopener noreferrer"
                onClick={openInstagram}
                className="text-link min-h-11 py-2 text-paper-on-night"
                aria-label="Instagram da MewStack"
              >
                @meewstack
              </a>
            </div>
          </div>

          <div data-reveal className="justify-self-start lg:justify-self-end">
            <Logo
              variant="white"
              alt="MewStack"
              className="w-48 sm:w-64 lg:w-72"
            />
          </div>
        </div>
      </div>

      <footer
        data-signal-anchor="contact-horizon"
        className="relative z-[var(--z-content)] border-t border-night-line"
      >
        <div className="mx-auto grid max-w-[1200px] gap-8 px-5 py-8 text-paper-on-night-soft sm:px-8 lg:grid-cols-[auto_1fr_auto] lg:items-center">
          <div data-signal-anchor="contact-terminal" className="relative w-fit">
            <span
              aria-hidden
              className="absolute -top-[35px] -right-4 h-1.5 w-1.5 rounded-full bg-signal"
            />
            <Logo
              variant="horizontalDark"
              alt="MewStack"
              className="h-8 w-auto"
            />
          </div>
          <nav
            aria-label="Índice do rodapé"
            className="mono flex flex-wrap gap-x-4 gap-y-2 text-[0.62rem] lg:justify-center"
          >
            {NAV_CHAPTERS.map((chapter, index) => (
              <a
                key={chapter.id}
                href={`#${chapter.id}`}
                className="transition-colors duration-200 hover:text-signal-bright"
              >
                {String(index + 1).padStart(2, "0")} {chapter.label}
              </a>
            ))}
          </nav>
          <div className="text-sm lg:text-right">
            <p>© {new Date().getFullYear()} MewStack</p>
            <a
              href="https://mewstack.com.br"
              className="transition-colors duration-200 hover:text-paper-on-night"
            >
              mewstack.com.br
            </a>
          </div>
        </div>
      </footer>
    </section>
  );
}
