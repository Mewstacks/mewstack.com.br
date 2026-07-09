import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "../lib/gsap";
import { MOTION, reduceMotion } from "../lib/motion";
import Mascot from "../components/Mascot";

/* ── Process: o capítulo-assinatura. No desktop a timeline é "scrubada" pelo
   scroll: a live wire rosa preenche o trilho e cada nó acende com seu texto, em
   sequência, conforme a seção sobe pela tela. Sem pin — assim, pular pra cá por
   um anchor cai numa timeline já preenchida (o scrub reflete a posição), em vez
   de um frame vazio pré-pin. No mobile, timeline vertical com reveal em stagger.
   Título por mask reveal. Tudo transform/opacity (+ clip pontual). */
const STEPS = [
  {
    n: "01",
    title: "Entender",
    desc: "Mapeamos seu processo com quem vive ele todo dia — onde trava, onde escapa tempo.",
  },
  {
    n: "02",
    title: "Desenhar",
    desc: "Desenhamos o fluxo ideal: o que sai do manual, o que valida, o que roda sozinho.",
  },
  {
    n: "03",
    title: "Construir",
    desc: "Criamos a automação ou o sistema sob medida — moldado ao fluxo, não o contrário.",
  },
  {
    n: "04",
    title: "Integrar",
    desc: "Conectamos às ferramentas que você já usa. Nada de trocar tudo pra começar.",
  },
  {
    n: "05",
    title: "Acompanhar",
    desc: "Monitorado e com alerta. A gente ajusta e melhora junto com a sua operação.",
  },
];

export default function Process() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const eyebrow = q("[data-pro='eyebrow']");
      const title = q("[data-pro='title']");
      const rail = q("[data-pro='rail']");
      const nodes = q("[data-pro='node']");
      const steps = q("[data-pro='step']");

      if (reduceMotion()) {
        gsap.set([...eyebrow, ...title, ...steps, ...nodes], {
          opacity: 1,
          y: 0,
          scale: 1,
          clipPath: "none",
        });
        gsap.set(rail, { scaleX: 1 });
        return;
      }

      const mm = gsap.matchMedia();

      // Header reveal — eyebrow rises, title masks in. Both breakpoints.
      gsap.set(eyebrow, { opacity: 0, y: MOTION.revealY * 0.5 });
      gsap.set(title, { clipPath: "inset(0 0 100% 0)", y: MOTION.revealY * 0.5, opacity: 1 });
      ScrollTrigger.create({
        trigger: el,
        start: "top 78%",
        once: true,
        onEnter: () => {
          gsap.to(eyebrow, { opacity: 1, y: 0, duration: MOTION.duration, ease: MOTION.ease });
          gsap.to(title, {
            clipPath: "inset(0 0 0% 0)",
            y: 0,
            duration: MOTION.duration + 0.2,
            ease: MOTION.easeTitle,
          });
        },
      });

      // Desktop: the signature beat — the section PINS and the timeline is
      // scrubbed in place: the pink wire fills the rail and each node ignites
      // with its step, one after another, as the user scrolls. pinSpacing keeps
      // the document height intact, so the #processo anchor still lands at the
      // start of the pinned beat (LenisAnchors resolves to the pin-spacer top).
      mm.add(MOTION.desktop, () => {
        gsap.set(rail, { scaleX: 0, transformOrigin: "left center" });
        gsap.set(nodes, { scale: 0.5, opacity: 0.25 });
        gsap.set(steps, { opacity: 0, y: 36 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top 16%",
            end: "+=120%",
            scrub: true,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
          },
        });

        tl.to(rail, { scaleX: 1, ease: "none", duration: 3 }, 0);
        // Nodes ignite spread across the rail fill, whatever the step count.
        const gap = 2.2 / Math.max(STEPS.length - 1, 1);
        STEPS.forEach((_, i) => {
          const at = 0.3 + i * gap;
          tl.to(nodes[i], { scale: 1, opacity: 1, ease: "back.out(1.7)", duration: 0.5 }, at).to(
            steps[i],
            { opacity: 1, y: 0, ease: "power3.out", duration: 0.6 },
            at,
          );
        });
        // tail hold so the finished timeline lingers a touch before unpinning.
        tl.to({}, { duration: 0.6 });
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
      className="mx-auto max-w-6xl scroll-mt-24 px-5 py-14 sm:px-8 lg:py-20"
    >
      <div className="max-w-2xl">
        <p data-pro="eyebrow" className="eyebrow mb-6">
          como funciona
        </p>
        <h2
          data-pro="title"
          className="font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.02] font-semibold tracking-[-0.035em]"
        >
          Da bagunça ao botão que roda sozinho.
        </h2>
      </div>

      {/* ── timeline ── */}
      <div className="relative mt-14 lg:mt-16">
        {/* faint editorial grid — reinforces the "precision" of the machine */}
        <div
          aria-hidden
          className="grid-lines pointer-events-none absolute -inset-x-6 -top-8 bottom-0 -z-10 opacity-60 [mask-image:radial-gradient(ellipse_72%_82%_at_28%_24%,black,transparent_82%)]"
        />
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
        {/* mascote saltando o trilho rumo à última etapa (desktop) */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-16 right-[6%] hidden lg:block"
        >
          <Mascot pose="jumping" className="w-20" floatDelay="0.6s" />
        </div>

        <ol className="grid gap-x-6 md:grid-cols-5">
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
                <h3 className="font-display text-xl font-semibold tracking-[-0.02em] md:text-[1.2rem]">
                  {s.title}
                </h3>
                <p className="mt-2.5 max-w-[34ch] text-[0.98rem] leading-relaxed text-ink-soft md:text-[0.88rem]">
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
