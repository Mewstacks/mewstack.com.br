import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "../lib/gsap";
import { MOTION, reduceMotion } from "../lib/motion";
import { useChapter } from "../lib/useChapter";

const STEPS = [
  {
    title: "Diagnóstico",
    label: "ENTENDER",
    description:
      "A gente acompanha o processo de ponta a ponta e encontra onde o tempo, o dado e a responsabilidade se perdem.",
  },
  {
    title: "Construção",
    label: "ORGANIZAR",
    description:
      "O fluxo vira software conectado às ferramentas que já fazem parte da rotina do time.",
  },
  {
    title: "Operação",
    label: "RODAR",
    description:
      "A entrega entra em produção com monitoramento, alerta e suporte para continuar útil depois do lançamento.",
  },
];

export default function Process() {
  const root = useRef<HTMLElement>(null);
  useChapter(root, { enter: false, exit: false });

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;
      const path = section.querySelector<SVGPathElement>("[data-process-path]");
      const nodes = gsap.utils.toArray<HTMLElement>("[data-process-node]", section);
      const labels = gsap.utils.toArray<HTMLElement>("[data-process-label]", section);
      const steps = gsap.utils.toArray<HTMLElement>("[data-process-step]", section);
      if (!path) return;

      if (reduceMotion()) {
        gsap.set(path, { strokeDashoffset: 0 });
        gsap.set([...nodes, ...labels, ...steps], { clearProps: "all", opacity: 1 });
        return;
      }

      const mm = gsap.matchMedia();
      mm.add(MOTION.desktop, () => {
        gsap.set(path, { strokeDasharray: 1, strokeDashoffset: 1 });
        gsap.set(nodes, { scale: 0.7, opacity: 0.28 });
        gsap.set(labels, { color: "var(--color-ink-faint)" });
        gsap.set(steps, { y: 24, opacity: 0.28 });

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 12%",
            end: "+=120%",
            scrub: true,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        timeline.to(path, { strokeDashoffset: 0, ease: "none", duration: 3 }, 0);
        STEPS.forEach((_, index) => {
          const at = 0.4 + index * 0.85;
          timeline
            .to(
              nodes[index],
              { scale: 1, opacity: 1, duration: 0.35, ease: "power2.out" },
              at,
            )
            .to(
              labels[index],
              { color: "var(--color-ink)", duration: 0.3 },
              at,
            )
            .to(
              steps[index],
              { y: 0, opacity: 1, duration: 0.45, ease: "power2.out" },
              at,
            );
        });
        timeline.to({}, { duration: 0.55 });

        return () => {
          timeline.scrollTrigger?.kill();
          timeline.kill();
        };
      });

      mm.add(MOTION.mobile, () => {
        gsap.set(path, { strokeDashoffset: 0 });
        gsap.set(nodes, { scale: 1, opacity: 1 });
        gsap.set(steps, { y: 18, opacity: 0 });
        ScrollTrigger.batch(steps, {
          start: "top 86%",
          onEnter: (batch) =>
            gsap.to(batch, {
              y: 0,
              opacity: 1,
              duration: 0.65,
              stagger: 0.08,
              ease: MOTION.ease,
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
      className="relative scroll-mt-24 overflow-clip border-y border-line bg-paper-lilac"
    >
      <div aria-hidden className="paper-vignette pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-[1200px] px-5 py-20 sm:px-8 lg:py-24">
        <div className="grid gap-6 lg:grid-cols-12">
          <p data-reveal className="section-index lg:col-span-3">
            <span>03</span>
            <span>o sinal se ordena</span>
          </p>
          <div className="lg:col-span-8 lg:col-start-5">
            <h2 data-reveal-title className="max-w-[12ch] text-h2 leading-[1.04]">
              Do processo vivido ao processo que roda.
            </h2>
            <p data-reveal className="mt-5 max-w-[56ch] text-ink-soft">
              Três etapas, uma linha de responsabilidade. Sem desaparecer depois
              do deploy e sem entregar uma caixa-preta.
            </p>
          </div>
        </div>

        <div className="relative mt-16 hidden md:block">
          <svg
            aria-hidden
            viewBox="0 0 900 200"
            preserveAspectRatio="none"
            className="h-36 w-full"
          >
            <path
              d="M0 100 C36 40 68 160 105 100 S174 40 210 100 C248 160 276 100 330 100 H900"
              fill="none"
              stroke="var(--color-line-strong)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
            <path
              data-process-path
              pathLength={1}
              d="M0 100 C36 40 68 160 105 100 S174 40 210 100 C248 160 276 100 330 100 H900"
              fill="none"
              stroke="var(--color-signal)"
              strokeWidth="1.5"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          {[10, 50, 90].map((left, index) => (
            <div
              key={left}
              className="absolute top-[72px] -translate-x-1/2"
              style={{ left: `${left}%` }}
            >
              <span
                data-process-node
                className="block h-3 w-3 rounded-full border border-signal bg-paper-lilac"
              />
              <span
                data-process-label
                className="mono absolute top-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[0.64rem] text-ink-faint"
              >
                {STEPS[index].label}
              </span>
            </div>
          ))}
        </div>

        <ol className="relative mt-12 grid gap-0 border-t border-line-strong md:mt-8 md:grid-cols-3 md:border-t-0">
          <span
            aria-hidden
            className="absolute top-0 bottom-0 left-[7px] w-px bg-line-strong md:hidden"
          />
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              data-process-step
              className="relative grid grid-cols-[1.5rem_1fr] gap-4 border-b border-line py-7 md:block md:border-t md:border-r md:border-b-0 md:px-6 md:py-8 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
            >
              <span className="relative z-10 mt-1 h-4 w-4 rounded-full border border-signal bg-paper-lilac md:hidden" />
              <div>
                <span className="mono text-[0.68rem] text-ink-faint">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 text-h3 leading-tight">{step.title}</h3>
                <p className="mt-3 max-w-[36ch] text-ink-soft">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
