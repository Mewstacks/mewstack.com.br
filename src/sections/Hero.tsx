import { useRef } from "react";
import { ChevronDown } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "../lib/gsap";
import { MOTION, reduceMotion } from "../lib/motion";

/* ── Hero: intro mínima, agora como abertura cinematográfica.
   Entrada em camadas (badge → título linha a linha → cue), e saída coordenada:
   ao rolar, a cópia sobe/escala/desvanece e a aurora faz parallax, entregando
   a tela para o próximo capítulo. Tudo transform/opacity. */
export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const badge = q("[data-hero='badge']");
      const lines = q("[data-hero='line']");
      const cue = q("[data-hero='cue']");
      const copy = q("[data-hero='copy']");
      const aurora = q("[data-hero='aurora']");

      if (reduceMotion()) {
        gsap.set([...badge, ...lines, ...cue], { clearProps: "all", opacity: 1, y: 0 });
        return;
      }

      const mm = gsap.matchMedia();
      mm.add({ isDesktop: MOTION.desktop, isMobile: MOTION.mobile }, (ctx) => {
        const { isMobile } = ctx.conditions as { isDesktop: boolean; isMobile: boolean };

        // Entrance — layered & cinematic, plays on load: the aurora swells in
        // first (the stage lights up), the badge settles, the title masks in
        // line by line, the cue arrives last.
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
          .from(cue, { y: 16, opacity: 0, duration: 0.7 }, "-=0.35");

        // Exit / parallax — desktop only (avoids touch jank). The copy lifts,
        // scales down, defocuses and fades, handing the screen to the next
        // chapter with real depth.
        if (!isMobile) {
          gsap.to(copy, {
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

        <h1 className="font-display text-[clamp(2.6rem,7.2vw,5.2rem)] leading-[0.95] font-semibold tracking-[-0.04em]">
          <span data-hero="line" className="block text-ink-fade">
            Seus dados já sabem
          </span>
          <span data-hero="line" className="block text-gradient">
            a gente revela.
          </span>
        </h1>
      </div>

      {/* ── scroll cue: convida a descer e explorar ── */}
      <a
        href="#servicos"
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
