import { useRef } from "react";
import { ChevronDown, Check } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "../lib/gsap";
import { MOTION, reduceMotion } from "../lib/motion";
import Mascot from "../components/Mascot";

/* ── Hero: abertura cinematográfica que agora DIZ o que a MewStack faz em
   segundos. Entrada em camadas (badge → título linha a linha → apoio → CTAs →
   cue) e, no desktop, chips de automação "rodando agora" flutuam ao lado da
   copy — produto acontecendo, não decoração. Saída coordenada: copy e chips
   sobem/escalam/desvanecem entregando a tela ao próximo capítulo. */
export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const badge = q("[data-hero='badge']");
      const lines = q("[data-hero='line']");
      const sub = q("[data-hero='sub']");
      const ctas = q("[data-hero='ctas']");
      const chips = q("[data-hero='chip']");
      // Camada que envolve os chips: a ENTRADA anima cada chip, a SAÍDA (scrub)
      // anima a camada — nunca o mesmo elemento nos dois tweens, senão o scrub
      // parado em 0 re-aplica o valor inicial e engole a entrada.
      const chipsLayer = q("[data-hero='chips-layer']");
      const cue = q("[data-hero='cue']");
      const copy = q("[data-hero='copy']");
      const aurora = q("[data-hero='aurora']");

      if (reduceMotion()) {
        gsap.set([...badge, ...lines, ...sub, ...ctas, ...chips, ...cue], {
          clearProps: "all",
          opacity: 1,
          y: 0,
        });
        return;
      }

      const mm = gsap.matchMedia();
      mm.add({ isDesktop: MOTION.desktop, isMobile: MOTION.mobile }, (ctx) => {
        const { isMobile } = ctx.conditions as { isDesktop: boolean; isMobile: boolean };

        // Entrance — layered & cinematic, plays on load: the aurora swells in
        // first (the stage lights up), the badge settles, the title masks in
        // line by line, support copy + CTAs follow, the side chips pop last.
        gsap
          .timeline({ defaults: { ease: "power4.out" } })
          .from(
            aurora,
            { autoAlpha: 0, scale: 1.25, yPercent: -10, duration: 1.6, ease: "expo.out" },
            0,
          )
          .from(badge, { y: 22, opacity: 0, duration: 0.7 }, 0.15)
          .fromTo(
            lines,
            { clipPath: "inset(0 0 100% 0)", yPercent: 22, opacity: 1 },
            {
              clipPath: "inset(0 0 0% 0)",
              yPercent: 0,
              duration: 1.25,
              ease: MOTION.easeTitle,
              stagger: 0.16,
            },
            0.35,
          )
          .from(sub, { y: 18, opacity: 0, duration: 0.7 }, "-=0.55")
          .from(ctas, { y: 18, opacity: 0, duration: 0.7 }, "-=0.5")
          .from(
            chips,
            { y: 26, opacity: 0, scale: 0.92, duration: 0.8, stagger: 0.12 },
            "-=0.45",
          )
          .from(cue, { y: 16, opacity: 0, duration: 0.7 }, "-=0.4");

        // Exit / parallax — desktop only (avoids touch jank). Copy and chips
        // lift, scale down, defocus and fade, handing the screen to the next
        // chapter with real depth.
        if (!isMobile) {
          gsap.to([...copy, ...chipsLayer], {
            yPercent: MOTION.heroExitY,
            scale: MOTION.heroExitScale,
            opacity: 0,
            filter: `blur(${MOTION.exitBlur}px)`,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
          });
          gsap.fromTo(
            cue,
            { autoAlpha: 1 },
            {
              autoAlpha: 0,
              ease: "none",
              immediateRender: false,
              scrollTrigger: { trigger: el, start: "top top", end: "12% top", scrub: true },
            },
          );
          gsap.to(aurora, {
            yPercent: 38,
            scale: 1.18,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
          });
        }
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="top"
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-clip px-5 pt-28 pb-20 text-center sm:px-8"
    >
      {/* ── ambient structure: editorial grid + soft pink aurora ── */}
      <div
        aria-hidden
        className="grid-lines pointer-events-none absolute inset-0 -z-10 opacity-40 [mask-image:radial-gradient(ellipse_70%_55%_at_50%_0%,black,transparent_72%)]"
      />
      <div
        aria-hidden
        data-hero="aurora"
        className="aurora pointer-events-none absolute top-[-6%] left-1/2 -z-10 h-[64vh] w-[130vw] max-w-[1280px] -translate-x-1/2 rounded-full opacity-35 blur-[130px]"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%, var(--color-pink) 0%, transparent 70%)" }}
      />

      {/* ── automações "rodando agora" — produto, não decoração (desktop) ── */}
      <div
        aria-hidden
        data-hero="chips-layer"
        className="pointer-events-none absolute inset-0 hidden will-change-transform xl:block"
      >
        <div
          data-hero="chip"
          className="absolute top-[34%] left-[max(2rem,7vw)] w-52"
        >
          <div className="animate-float rounded-xl border border-cream-line bg-cream-deep/85 p-3.5 text-left shadow-[var(--shadow-card)] backdrop-blur-sm">
            <p className="mono flex items-center gap-2 text-[0.68rem] text-ink-soft">
              <span className="live-dot" aria-hidden />
              baixador-nfse · rodando
            </p>
            <p className="mt-2 font-display text-[1.05rem] font-semibold tracking-[-0.01em] text-ink">
              487 notas <span className="text-pink-deep">hoje</span>
            </p>
            <p className="mt-0.5 text-[0.72rem] text-ink-soft">sem ninguém abrir o portal</p>
          </div>
        </div>
        <div
          data-hero="chip"
          className="absolute top-[28%] right-[max(2rem,6vw)] w-56"
        >
          <div className="relative">
            <Mascot pose="typing" className="absolute -top-14 right-3 w-16" floatDelay="0.8s" />
            <div className="animate-float rounded-xl border border-cream-line bg-cream-deep/85 p-3.5 text-left shadow-[var(--shadow-card)] backdrop-blur-sm [animation-delay:0.5s]">
              <p className="mono text-[0.68rem] text-ink-soft">conciliação · 06/2026</p>
              <p className="mt-2 font-display text-[1.05rem] font-semibold tracking-[-0.01em] text-ink">
                98% <span className="text-pink-deep">sem divergência</span>
              </p>
              <ul className="mt-1.5 flex flex-col gap-1 text-[0.72rem] text-ink-soft">
                <li className="flex items-center gap-1.5">
                  <Check className="h-3 w-3 text-[oklch(0.46_0.13_150)]" strokeWidth={2.6} />
                  extrato × notas fiscais
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="h-3 w-3 text-[oklch(0.46_0.13_150)]" strokeWidth={2.6} />
                  relatório enviado às 07:00
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ── centered copy column ── */}
      <div data-hero="copy" className="mx-auto flex max-w-3xl flex-col items-center">
        <a
          href="#contato"
          data-hero="badge"
          className="group mb-7 inline-flex items-center gap-2.5 rounded-full border border-ink/8 bg-cream-deep/70 py-1.5 pr-2.5 pl-3.5 text-[0.82rem] font-medium tracking-[0.01em] text-ink-soft shadow-[var(--shadow-soft)] backdrop-blur-sm transition-colors hover:border-pink/30"
        >
          <span className="live-dot" aria-hidden />
          Estúdio de software &amp; dados
          <span className="rounded-full border border-ink/10 bg-cream px-2 py-0.5 text-[0.72rem] text-ink-soft transition-colors group-hover:border-pink/30 group-hover:text-pink-deep">
            aberto para projetos →
          </span>
        </a>

        <h1 className="font-display text-[clamp(2.5rem,6.8vw,4.9rem)] leading-[0.97] font-semibold tracking-[-0.04em]">
          <span data-hero="line" className="block text-ink-fade">
            Automações e sistemas
          </span>
          <span data-hero="line" className="block text-gradient">
            do jeito que sua empresa roda.
          </span>
        </h1>

        <p data-hero="sub" className="mt-6 max-w-[54ch] text-[1.02rem] leading-relaxed text-ink-soft">
          A gente entende seu processo real e cria a tecnologia ao redor dele —
          aplicações, integrações e rotinas que tiram o trabalho repetitivo do seu time.
        </p>

        <div data-hero="ctas" className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a href="#contato" className="btn btn-primary">
            Mostrar meu processo
            <span className="arrow" aria-hidden>→</span>
          </a>
          <a href="#contabil" className="btn btn-ghost">
            Ver na prática
          </a>
        </div>
      </div>

      {/* ── scroll cue: convida a descer e explorar ── */}
      <a
        href="#problema"
        data-hero="cue"
        aria-label="Explorar o que a gente faz"
        className="absolute bottom-7 left-1/2 -translate-x-1/2 inline-flex flex-col items-center gap-1.5 text-[0.72rem] font-medium tracking-[0.14em] text-ink-soft uppercase transition-colors hover:text-pink-deep"
      >
        explore
        <ChevronDown className="h-4 w-4 animate-bounce" strokeWidth={2} aria-hidden />
      </a>
    </section>
  );
}
