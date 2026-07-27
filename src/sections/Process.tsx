import { useLayoutEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import SignalLine from "../components/SignalLine";
import { gsap, ScrollTrigger } from "../lib/gsap";
import { MOTION, reduceMotion } from "../lib/motion";
import { measurePath } from "../lib/pathMetrics";
import {
  buildProcessRoute,
  measureElementWithin,
  type BuiltProcessRoute,
} from "../lib/signalJourney";
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
  const track = useRef<HTMLDivElement>(null);
  const line = useRef<SVGPathElement>(null);
  const [route, setRoute] = useState<BuiltProcessRoute | null>(null);
  useChapter(root, { enter: false, exit: false });

  useLayoutEffect(() => {
    const section = root.current;
    if (!section) return;

    let frame = 0;
    const measure = () => {
      const trackElement = track.current;
      const mobileNodes = Array.from(
        section.querySelectorAll<HTMLElement>("[data-process-mobile-node]"),
      );
      const next = buildProcessRoute({
        width: section.offsetWidth,
        height: section.offsetHeight,
        track:
          trackElement && trackElement.offsetWidth
            ? measureElementWithin(trackElement, section)
            : undefined,
        mobileStepYs: mobileNodes.map((node) => {
          const rect = measureElementWithin(node, section);
          return rect.y + rect.height / 2;
        }),
      });

      setRoute((current) =>
        current?.path === next.path && current.viewBox === next.viewBox
          ? current
          : next,
      );
    };
    const scheduleMeasure = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(measure);
    };

    measure();
    const observer = new ResizeObserver(scheduleMeasure);
    observer.observe(section);
    if (track.current) observer.observe(track.current);
    section
      .querySelectorAll<HTMLElement>("[data-process-step], [data-process-mobile-node]")
      .forEach((element) => observer.observe(element));
    window.addEventListener("resize", scheduleMeasure);
    ScrollTrigger.addEventListener("refresh", scheduleMeasure);
    void document.fonts.ready.then(scheduleMeasure);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", scheduleMeasure);
      ScrollTrigger.removeEventListener("refresh", scheduleMeasure);
    };
  }, []);

  useGSAP(
    () => {
      const section = root.current;
      const path = line.current;
      if (!section || !path || !route) return;
      const nodes = gsap.utils.toArray<HTMLElement>("[data-process-node]", section);
      const labels = gsap.utils.toArray<HTMLElement>("[data-process-label]", section);
      const steps = gsap.utils.toArray<HTMLElement>("[data-process-step]", section);
      const mobileNodes = gsap.utils.toArray<HTMLElement>(
        "[data-process-mobile-node]",
        section,
      );

      if (reduceMotion()) {
        gsap.set(path, { strokeDasharray: "none", strokeDashoffset: 0 });
        gsap.set([...nodes, ...labels, ...steps, ...mobileNodes], {
          clearProps: "all",
          opacity: 1,
        });
        return;
      }

      const mm = gsap.matchMedia();
      mm.add(MOTION.desktop, () => {
        const { length: pathLength, fractions } = measurePath(
          path,
          route.nodeTargets.map((point) => point.x),
        );
        gsap.set(path, {
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength,
        });
        gsap.set(nodes, { scale: 0.7, opacity: 0.28 });
        gsap.set(labels, { color: "var(--color-ink-faint)" });
        gsap.set(steps, { y: 24, opacity: 0.28 });

        // Sem pin: o trilho desenha enquanto a seção rola naturalmente.
        // Trigger no track (quando existe) pra a curva inteira ficar na viewport.
        const processTrigger = track.current ?? section;
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: processTrigger,
            start: MOTION.process.start,
            end: MOTION.process.end,
            scrub: MOTION.process.scrub,
            invalidateOnRefresh: true,
          },
        });
        const drawDuration = 1 - MOTION.process.settle;
        const { stepSpan } = MOTION.process;

        timeline.to(
          path,
          { strokeDashoffset: 0, ease: "none", duration: drawDuration },
          0,
        );
        STEPS.forEach((_, index) => {
          const at = Math.min(fractions[index] * drawDuration, 1 - stepSpan);
          timeline
            .to(
              nodes[index],
              { scale: 1, opacity: 1, duration: stepSpan, ease: "power1.out" },
              at,
            )
            .to(
              labels[index],
              { color: "var(--color-ink)", duration: stepSpan, ease: "none" },
              at,
            )
            .to(
              steps[index],
              { y: 0, opacity: 1, duration: stepSpan, ease: "power1.out" },
              at,
            );
        });
        timeline.to({}, { duration: MOTION.process.settle }, drawDuration);

        return () => {
          timeline.scrollTrigger?.kill();
          timeline.kill();
        };
      });

      mm.add(MOTION.mobile, () => {
        const { length: pathLength } = measurePath(path);
        gsap.set(path, {
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength,
        });
        gsap.set(mobileNodes, { scale: 0.72, opacity: 0.28 });
        gsap.set(steps, { y: 18, opacity: 0.32 });

        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top 84%",
            end: "bottom 30%",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        timeline.to(path, { strokeDashoffset: 0, duration: 0.86 }, 0);
        [0.2, 0.46, 0.69].forEach((at, index) => {
          timeline
            .to(
              mobileNodes[index],
              { scale: 1, opacity: 1, duration: 0.12 },
              at,
            )
            .to(
              steps[index],
              { y: 0, opacity: 1, duration: 0.12 },
              at,
            );
        });

        return () => {
          timeline.scrollTrigger?.kill();
          timeline.kill();
        };
      });

      return () => mm.revert();
    },
    {
      scope: root,
      dependencies: [
        route?.path,
        route?.nodeTargets.map((point) => `${point.x}:${point.y}`).join("|"),
      ],
      revertOnUpdate: true,
    },
  );

  return (
    <section
      ref={root}
      id="processo"
      className="relative scroll-mt-24 overflow-clip border-y border-line bg-paper-lilac"
    >
      <div aria-hidden className="paper-vignette pointer-events-none absolute inset-0" />
      {route && (
        <SignalLine
          ref={line}
          viewBox={route.viewBox}
          path={route.path}
          pathProps={{
            "data-process-path": true,
            "data-signal-route": "process",
          }}
          className="pointer-events-none absolute inset-0 z-[var(--z-wire)] h-full w-full"
        />
      )}

      <div className="relative z-[var(--z-content)] mx-auto max-w-[1200px] px-5 py-20 sm:px-8 lg:py-24">
        <div className="grid gap-6 lg:grid-cols-12">
          <p data-reveal className="section-index lg:col-span-3">
            <span>03</span>
            <span>processo</span>
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

        <div
          ref={track}
          data-signal-anchor="process-track"
          className="relative mt-16 hidden h-36 md:block"
        >
          {[10, 50, 90].map((left, index) => (
            <div
              key={left}
              className="absolute top-[66px] -translate-x-1/2"
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
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              data-process-step
              className="relative border-b border-line py-7 md:block md:border-t md:border-r md:border-b-0 md:px-6 md:py-8 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
            >
              <span
                data-process-mobile-node
                className="absolute top-8 left-[-18px] z-10 h-4 w-4 rounded-full border border-signal bg-paper-lilac md:hidden"
              />
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
