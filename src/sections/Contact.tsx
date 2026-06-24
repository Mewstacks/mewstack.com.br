import Reveal from "../components/Reveal";
import Logo from "../components/Logo";

const INSTAGRAM = "https://instagram.com/meewstack";
const EMAIL = "germano@mewstack.com.br";
const WHATSAPP = "https://wa.me/5554996202127"; // (54) 99620-2127

export default function Contact() {
  return (
    <section id="contato" className="relative scroll-mt-24 overflow-clip bg-night text-paper">
      {/* soft ambient glow, top-right */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 right-[-6%] h-[44vh] w-[44vh] rounded-full opacity-20 blur-[120px]"
        style={{ background: "radial-gradient(circle, var(--color-pink) 0%, transparent 65%)" }}
      />
      <div className="relative mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
          <Reveal>
            <p className="mb-5 inline-flex items-center gap-2.5 font-medium text-pink-bright">
              <span className="live-dot" aria-hidden />
              Aberto para novos projetos
            </p>
            <h2 className="font-display text-[clamp(2.3rem,5.5vw,4rem)] leading-[0.98] font-semibold tracking-[-0.035em] text-paper">
              Vamos automatizar
              <br />o que te trava?
            </h2>
            <p className="mt-6 max-w-[46ch] leading-relaxed text-paper-soft">
              Me conta o processo que mais consome seu tempo. Em uma conversa
              curta a gente já identifica o que dá pra resolver primeiro.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-pink font-semibold"
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
          </Reveal>

          <Reveal delay={0.1} className="hidden justify-self-center lg:block">
            <Logo
              variant="white"
              alt="MewStack"
              className="w-56 animate-float"
            />
          </Reveal>
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
