import { useRef } from "react";
import { Link } from "react-router-dom";
import { Check, Minus } from "lucide-react";
import MediaFrame from "../components/MediaFrame";
import Contact from "../sections/Contact";
import { useChapter } from "../lib/useChapter";
import type { Service } from "../lib/services";

/* Service detail page. Reuses the chapter reveals, the tone rhythm and the
   type scale of the one-pager so a visitor who lands here from search meets the
   same studio, not a landing page bolted on the side. */
export default function ServicePage({ service }: { service: Service }) {
  const intro = useRef<HTMLElement>(null);
  const friction = useRef<HTMLElement>(null);
  const scope = useRef<HTMLElement>(null);
  const proof = useRef<HTMLElement>(null);
  const faq = useRef<HTMLElement>(null);

  useChapter(intro, { enter: false, exit: false });
  useChapter(friction, { enter: false, exit: false });
  useChapter(scope, { enter: false, exit: false });
  useChapter(proof, { enter: false, exit: false });
  useChapter(faq, { enter: false, exit: false });

  return (
    <>
      <section
        ref={intro}
        id="top"
        className="relative scroll-mt-24 overflow-clip bg-paper"
      >
        <div
          aria-hidden
          className="paper-vignette pointer-events-none absolute inset-0"
        />
        <div className="relative z-[var(--z-content)] mx-auto max-w-[1200px] px-5 pb-16 pt-32 sm:px-8 lg:pb-24 lg:pt-40">
          <nav
            aria-label="Trilha"
            className="mono mb-8 flex flex-wrap items-center gap-2 text-[0.66rem] text-ink-faint"
          >
            <Link to="/" className="transition-colors duration-200 hover:text-signal-deep">
              Início
            </Link>
            <span aria-hidden>·</span>
            <span className="text-ink">{service.label}</span>
          </nav>

          <p data-reveal className="section-index mb-7">
            <span aria-hidden className="signal-dot" data-pulse="true" />
            <span>{service.eyebrow}</span>
          </p>

          {/* data-reveal, not data-reveal-title: the line-by-line SplitText
              reveal is driven by a scroll trigger, and this heading is already
              inside the viewport on load, so the trigger fires mid-split and
              leaves the lines frozen part-way. The home page never hits this
              because its only above-the-fold heading runs its own timeline. */}
          <h1
            data-reveal
            className="max-w-[16ch] text-[clamp(2.2rem,5.6vw,4.4rem)] leading-[1.02] tracking-[-0.02em] text-ink"
          >
            {service.h1}
          </h1>

          <p data-reveal className="mt-7 max-w-[58ch] text-lede leading-[1.55] text-ink-soft">
            {service.lede}
          </p>

          <div data-reveal className="mt-10 flex flex-wrap items-center gap-3">
            <Link to="/#contato" className="btn btn-primary">
              Fale com a gente
            </Link>
            <Link to="/#processo" className="btn btn-ghost">
              Ver o processo
            </Link>
          </div>
        </div>
      </section>

      <section
        ref={friction}
        className="relative scroll-mt-24 overflow-clip border-y border-line bg-paper-rose"
      >
        <div
          aria-hidden
          className="paper-vignette pointer-events-none absolute inset-0"
        />
        <div className="relative z-[var(--z-content)] mx-auto max-w-[1200px] px-5 py-20 sm:px-8 lg:py-28">
          <div className="grid gap-6 lg:grid-cols-12">
            <p data-reveal className="section-index lg:col-span-3">
              <span>01</span>
              <span>o problema</span>
            </p>
            <div className="lg:col-span-8 lg:col-start-5">
              <h2 data-reveal-title className="max-w-[16ch] text-h2 leading-[1.04] text-ink">
                {service.friction.title}
              </h2>
              <ul data-reveal className="mt-8 border-t border-line-strong">
                {service.friction.items.map((item, index) => (
                  <li
                    key={item}
                    className="grid min-w-0 grid-cols-[2rem_1fr] gap-3 border-b border-line py-4 sm:grid-cols-[2.5rem_1fr]"
                  >
                    <span
                      aria-hidden
                      className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full border border-line-strong text-ink-faint"
                    >
                      <Minus className="h-3.5 w-3.5" strokeWidth={2} />
                    </span>
                    <div className="min-w-0">
                      <span className="mono text-[0.62rem] text-ink-faint">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <p className="mt-1 text-base leading-relaxed text-ink">{item}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section ref={scope} className="relative scroll-mt-24 overflow-clip bg-paper">
        <div className="relative z-[var(--z-content)] mx-auto max-w-[1200px] px-5 py-20 sm:px-8 lg:py-28">
          <div className="grid gap-6 lg:grid-cols-12">
            <p data-reveal className="section-index lg:col-span-3">
              <span>02</span>
              <span>o escopo</span>
            </p>
            <div className="lg:col-span-8 lg:col-start-5">
              <h2 data-reveal-title className="max-w-[16ch] text-h2 leading-[1.04] text-ink">
                {service.scope.title}
              </h2>
            </div>
          </div>

          <div data-reveal className="mt-12 border-t border-line-strong">
            {service.scope.items.map((item, index) => (
              <article
                key={item.name}
                className="group grid min-w-0 gap-4 border-b border-line py-7 transition-[border-color] duration-200 hover:border-signal md:grid-cols-[1fr_7fr] lg:grid-cols-[1fr_5fr_6fr] lg:items-baseline lg:gap-8"
              >
                <span className="mono text-2xl text-ink-faint lg:self-start">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="text-h3 leading-tight text-ink">{item.name}</h3>
                <p className="min-w-0 max-w-[56ch] text-ink-soft">{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {service.proof && (
        <section
          ref={proof}
          className="relative scroll-mt-24 overflow-clip border-y border-line bg-paper-lilac"
        >
          <div className="relative z-[var(--z-content)] mx-auto max-w-[1200px] px-5 py-20 sm:px-8 lg:py-28">
            <div className="grid gap-6 lg:grid-cols-12">
              <p data-reveal className="section-index lg:col-span-3">
                <span>03</span>
                <span>em produção</span>
              </p>
              <div className="lg:col-span-8 lg:col-start-5">
                <h2 data-reveal-title className="max-w-[18ch] text-h2 leading-[1.04] text-ink">
                  Uma tela real, de um sistema em uso.
                </h2>
              </div>
            </div>
            <div data-reveal className="mt-12">
              <MediaFrame
                ratio={`${service.proof.width} / ${service.proof.height}`}
                src={service.proof.src}
                width={service.proof.width}
                height={service.proof.height}
                title={service.proof.alt}
                fit="contain"
                caption={{ name: service.proof.caption, detail: service.label }}
                captionNameAs="h3"
              />
            </div>
          </div>
        </section>
      )}

      <section ref={faq} className="relative scroll-mt-24 overflow-clip bg-paper">
        <div className="relative z-[var(--z-content)] mx-auto max-w-[1200px] px-5 py-20 sm:px-8 lg:py-28">
          <div className="grid gap-6 lg:grid-cols-12">
            <p data-reveal className="section-index lg:col-span-3">
              <span>{service.proof ? "04" : "03"}</span>
              <span>dúvidas</span>
            </p>
            <div className="lg:col-span-8 lg:col-start-5">
              <h2 data-reveal-title className="max-w-[16ch] text-h2 leading-[1.04] text-ink">
                O que costumam perguntar
              </h2>
              <dl data-reveal className="mt-8 border-t border-line-strong">
                {service.faq.map((entry) => (
                  <div key={entry.question} className="border-b border-line py-6">
                    <dt className="font-display text-h3 font-medium leading-tight tracking-[-0.01em] text-ink">{entry.question}</dt>
                    <dd className="mt-3 max-w-[62ch] leading-relaxed text-ink-soft">
                      {entry.answer}
                    </dd>
                  </div>
                ))}
              </dl>

              <p data-reveal className="mono mt-10 flex items-center gap-2 text-[0.66rem] text-ink-faint">
                <span
                  aria-hidden
                  className="flex h-5 w-5 items-center justify-center rounded-full border border-signal bg-signal-ghost text-signal-deep"
                >
                  <Check className="h-3 w-3" strokeWidth={2.5} />
                </span>
                <span>Diagnóstico antes de proposta. Sempre.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <Contact />
    </>
  );
}
