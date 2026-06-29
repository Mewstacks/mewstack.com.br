import { useRef } from "react";
import Logo from "../components/Logo";
import { useChapter } from "../lib/useChapter";
import { useMagnetic } from "../lib/useMagnetic";

const INSTAGRAM = "https://instagram.com/meewstack";
const EMAIL = "germano@mewstack.com.br";
const WHATSAPP = "https://wa.me/5554996202127"; // (54) 99620-2127

export default function Contact() {
  const root = useRef<HTMLElement>(null);
  useChapter(root, { exit: false });
  // Magnetic pull on the primary CTA (small target → classic, snappier effect).
  useMagnetic(root, "[data-magnetic]", { strength: 0.32, max: 16 });

  return (
    <section ref={root} id="contato" className="relative scroll-mt-24 overflow-clip bg-night text-paper">
      {/* soft ambient glow, top-right */}
      <div
        aria-hidden
        data-parallax="1.2"
        className="pointer-events-none absolute -top-20 right-[-6%] h-[44vh] w-[44vh] rounded-full opacity-20 blur-[120px]"
        style={{ background: "radial-gradient(circle, var(--color-pink) 0%, transparent 65%)" }}
      />
      <div className="relative mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
          <div>
            <p data-reveal className="mb-5 inline-flex items-center gap-2.5 font-medium text-pink-bright">
              <span className="live-dot" aria-hidden />
              Aberto para novos projetos
            </p>
            <h2 data-reveal-title className="font-display text-[clamp(2.3rem,5.5vw,4rem)] leading-[0.98] font-semibold tracking-[-0.035em] text-paper">
              Vamos automatizar
              <br />o que te trava?
            </h2>
            <p data-reveal className="mt-6 max-w-[46ch] leading-relaxed text-paper-soft">
              Me conta o processo que mais consome seu tempo. Em uma conversa
              curta a gente já identifica o que dá pra resolver primeiro.
            </p>

            <div data-reveal className="mt-10 flex flex-wrap gap-3">
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                data-magnetic
                className="btn btn-pink font-semibold will-change-transform"
              >
                Chamar no WhatsApp
                <span className="arrow" aria-hidden>→</span>
              </a>
              <a
                href={`mailto:${EMAIL}`}
                className="btn border border-night-line text-paper transition-colors duration-300 hover:border-paper/50 hover:bg-white/5"
              >
                {EMAIL}
              </a>
              <a
                href={INSTAGRAM}
                target="_blank"
                rel="noopener noreferrer"
                className="btn border border-night-line text-paper transition-colors duration-300 hover:border-paper/50 hover:bg-white/5"
              >
                @meewstack
              </a>
            </div>
          </div>

          <div data-reveal className="hidden justify-self-center lg:block">
            <Logo
              variant="white"
              alt="MewStack"
              className="w-56 animate-float"
            />
          </div>
        </div>
      </div>

      <footer className="border-t border-night-line">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-8 text-sm text-paper-soft sm:flex-row sm:px-8">
          <span className="font-display text-lg font-semibold tracking-[-0.02em] text-paper">
            Mew<span className="text-pink-bright">Stack</span>
          </span>
          <p>© {new Date().getFullYear()} MewStack · Software, automações &amp; dados</p>
          <a
            href="https://mewstack.com.br"
            className="transition-colors hover:text-paper"
          >
            mewstack.com.br
          </a>
        </div>
      </footer>
    </section>
  );
}
