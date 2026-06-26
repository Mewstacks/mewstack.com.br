import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "../lib/gsap";
import { MOTION, reduceMotion } from "../lib/motion";

/* ── Process: o capítulo-assinatura. No desktop a seção é fixada (pin) e, à
   medida que o usuário rola, a timeline é "scrubada": a live wire rosa preenche
   o trilho e cada nó acende com seu texto, em sequência. No mobile vira uma
   timeline vertical com reveal em stagger (sem pin). Tudo transform/opacity. */
const STEPS = [
  {
    n: "01",
    title: "Diagnóstico",
    desc: "Entendo seu processo de ponta a ponta e mapeio exatamente onde o seu tempo e o seu dinheiro escapam.",
  },
  {
    n: "02",
    title: "Construção",
    desc: "Software e rotinas sob medida, conectados às ferramentas que você já usa. Nada de retrabalho.",
  },
  {
    n: "03",
    title: "Operação",
    desc: "Roda sozinho e monitorado. Você não recebe planilha, recebe a decisão já pronta para aplicar.",
  },
];

export default function Process() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const head = q("[data-pro='head']");
      const rail = q("[data-pro='rail']");
      const nodes = q("[data-pro='node']");
      const steps = q("[data-pro='step']");

      if (reduceMotion()) {
        gsap.set([...head, ...steps, ...nodes], { opacity: 1, y: 0, scale: 1 });
        gsap.set(rail, { scaleX: 1 });
        return;
      }

      const mm = gsap.matchMedia();

      // Header reveal — both breakpoints.
      gsap.set(head, { opacity: 0, y: MOTION.revealY });
      ScrollTrigger.batch(head, {
        start: "top 80%",
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: MOTION.duration,
            ease: MOTION.ease,
            stagger: MOTION.stagger,
            overwrite: true,
          }),
      });

      // Desktop: pin + scrub the whole timeline.
      mm.add(MOTION.desktop, () => {
        gsap.set(rail, { scaleX: 0, transformOrigin: "left center" });
        gsap.set(nodes, { scale: 0.55, opacity: 0.3 });
        gsap.set(steps, { opacity: 0, y: 32 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: MOTION.processPin,
            scrub: true,
            pin: true,
            anticipatePin: 1,
          },
        });

        tl.to(rail, { scaleX: 1, ease: "none", duration: 3 }, 0);
        [0, 1, 2].forEach((i) => {
          const at = 0.3 + i * 0.85;
          tl.to(nodes[i], { scale: 1, opacity: 1, ease: "back.out(1.6)", duration: 0.5 }, at).to(
            steps[i],
            { opacity: 1, y: 0, ease: "power3.out", duration: 0.6 },
            at,
          );
        });
      });

      // Mobile: no pin — reveal steps as they enter.
      mm.add(MOTION.mobile, () => {
        gsap.set(nodes, { scale: 1, opacity: 1 });
        gsap.set(steps, { opacity: 0, y: MOTION.revealYMobile });
        ScrollTrigger.batch(steps, {
          start: "top 85%",
          onEnter: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power3.out",
              stagger: MOTION.stagger,
              overwrite: true,
            }),
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="processo"
      className="mx-auto flex min-h-[60vh] max-w-5xl flex-col justify-center scroll-mt-24 px-5 py-14 sm:px-8 lg:py-20"
    >
      <div className="max-w-2xl">
        <p data-pro="head" className="eyebrow mb-6">
          processo
        </p>
        <h2
          data-pro="head"
          className="font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.02] font-semibold tracking-[-0.035em]"
        >
          Da bagunça ao botão que roda sozinho.
        </h2>
      </div>

      {/* ── timeline ── */}
      <div className="relative mt-14 lg:mt-16">
        {/* desktop rail behind the nodes: hairline base + pink live wire (scrubbed) */}
        <div
          aria-hidden
          className="absolute top-6 right-0 left-6 hidden h-px bg-cream-line md:block"
        />
        <div
          aria-hidden
          data-pro="rail"
          className="absolute top-6 right-0 left-6 hidden h-px origin-left scale-x-0 bg-pink md:block"
        />

        <ol className="grid gap-x-8 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <li
              key={s.n}
              className="relative flex gap-5 pb-9 last:pb-0 md:block md:pb-0"
            >
              {/* node column (vertical connector on mobile) */}
              <div className="relative flex flex-col items-center md:block">
                <span
                  data-pro="node"
                  className="relative z-10 inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-cream-line bg-cream-deep font-display text-sm font-semibold tabular-nums text-pink-deep shadow-[var(--shadow-soft)]"
                >
                  {s.n}
                </span>
                {i < STEPS.length - 1 && (
                  <span aria-hidden className="mt-2 w-px flex-1 bg-cream-line md:hidden" />
                )}
              </div>

              <div data-pro="step" className="md:mt-6">
                <h3 className="font-display text-xl font-semibold tracking-[-0.02em] sm:text-[1.4rem]">
                  {s.title}
                </h3>
                <p className="mt-2.5 max-w-[34ch] text-[0.98rem] leading-relaxed text-ink-soft">
                  {s.desc}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
