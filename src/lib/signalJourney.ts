export type SignalAnchorId =
  | "hero-media"
  | "problem-signal"
  | "services-signal"
  | "process-track"
  | "machine-frame"
  | "outcome-progress"
  | "outcome-terminal"
  | "about-signal"
  | "contact-horizon"
  | "contact-terminal";

export type SignalSceneId =
  | "hero"
  | "problem"
  | "services"
  | "process"
  | "machine"
  | "outcome"
  | "about"
  | "contact";

export type SignalSegmentSpec = {
  anchors: readonly SignalAnchorId[];
  /** Mirrors the breakpoint where the section itself changes composition. */
  layoutBreakpoint: 768 | 1024;
  triggerAnchor: SignalAnchorId | null;
};

export type SignalRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type SignalPoint = {
  x: number;
  y: number;
};

export type SignalRouteAnchors = Partial<Record<SignalAnchorId, SignalRect>>;

export type BuiltSignalRoute = {
  path: string;
  viewBox: string;
};

export type BuiltProcessRoute = BuiltSignalRoute & {
  nodeTargets: readonly SignalPoint[];
};

/**
 * Each scene owns a bounded appearance. These descriptors deliberately do not
 * describe cross-section entry/exit pairs: no segment depends on a neighbour.
 */
export const SIGNAL_SEGMENT_SPECS: Record<SignalSceneId, SignalSegmentSpec> = {
  hero: {
    anchors: ["hero-media"],
    layoutBreakpoint: 1024,
    triggerAnchor: null,
  },
  problem: {
    anchors: ["problem-signal"],
    layoutBreakpoint: 1024,
    triggerAnchor: "problem-signal",
  },
  services: {
    anchors: ["services-signal"],
    layoutBreakpoint: 1024,
    triggerAnchor: "services-signal",
  },
  process: {
    anchors: ["process-track"],
    layoutBreakpoint: 768,
    triggerAnchor: "process-track",
  },
  machine: {
    anchors: ["machine-frame"],
    layoutBreakpoint: 1024,
    triggerAnchor: "machine-frame",
  },
  outcome: {
    anchors: ["outcome-progress", "outcome-terminal"],
    layoutBreakpoint: 768,
    triggerAnchor: "outcome-progress",
  },
  about: {
    anchors: ["about-signal"],
    layoutBreakpoint: 1024,
    triggerAnchor: "about-signal",
  },
  contact: {
    anchors: ["contact-horizon", "contact-terminal"],
    layoutBreakpoint: 1024,
    triggerAnchor: "contact-horizon",
  },
};

const MAX_CONTENT = 1200;
const DESKTOP_GUTTER = 24;
const COMPACT_RAIL = 10;
const EDGE_BLEED = 2;

const n = (value: number) => Math.round(value * 10) / 10;

const centeredRail = (
  width: number,
  side: "left" | "right",
  breakpoint: number,
) => {
  if (width < breakpoint) {
    return side === "left" ? COMPACT_RAIL : width - COMPACT_RAIL;
  }
  const contentWidth = Math.min(width, MAX_CONTENT);
  const contentLeft = (width - contentWidth) / 2;
  return side === "left"
    ? contentLeft + DESKTOP_GUTTER
    : contentLeft + contentWidth - DESKTOP_GUTTER;
};

const centerY = (rect: SignalRect) => rect.y + rect.height / 2;

export function buildSignalSceneRoute(
  scene: Exclude<SignalSceneId, "process">,
  width: number,
  height: number,
  anchors: SignalRouteAnchors,
): BuiltSignalRoute {
  const spec = SIGNAL_SEGMENT_SPECS[scene];
  const compact = width < spec.layoutBreakpoint;
  const left = centeredRail(width, "left", spec.layoutBreakpoint);
  const right = centeredRail(width, "right", spec.layoutBreakpoint);
  const viewBox = `0 0 ${n(width)} ${n(height)}`;

  if (scene === "hero") {
    const media = anchors["hero-media"] ?? {
      x: compact ? 20 : width * 0.24,
      y: height * 0.62,
      width: compact ? width - 40 : width * 0.66,
      height: height * 0.28,
    };
    const mediaY = media.y + media.height * (347 / 675);
    const mediaLeft = media.x;
    const mediaRight = media.x + media.width;
    // Laços grandes: a linha desce BEM desalinhada, com laços que se cruzam. Ela
    // fica atrás do conteúdo (z-wire), então pode invadir a coluna de texto. O
    // rail é empurrado pra direita o suficiente pra os laços não vazarem à esquerda.
    const A = compact ? 30 : 82;
    const rail = Math.max(compact ? left : Math.max(14, left - 38), A + 8);

    // Um laço que se cruza, descendo, centrado em `cy` sobre o `rail`.
    const loop = (cy: number, span: number) =>
      [
        `C${n(rail - A)} ${n(cy - span * 0.5)} ${n(rail - A)} ${n(cy + span * 0.18)} ${n(rail + A * 0.5)} ${n(cy)}`,
        `C${n(rail + A * 1.25)} ${n(cy - span * 0.12)} ${n(rail + A * 1.2)} ${n(cy - span * 0.95)} ${n(rail + A * 0.15)} ${n(cy - span * 0.78)}`,
        `C${n(rail - A * 0.65)} ${n(cy - span * 0.62)} ${n(rail - A * 0.4)} ${n(cy + span * 0.6)} ${n(rail)} ${n(cy + span * 0.82)}`,
      ].join(" ");

    const wave = (fromY: number, toY: number, swing: number) =>
      `C${n(rail + A * swing)} ${n(fromY + (toY - fromY) * 0.4)} ${n(rail - A * swing)} ${n(fromY + (toY - fromY) * 0.7)} ${n(rail)} ${n(toY)}`;

    const descent = compact
      ? [
          `M${n(rail)} ${-EDGE_BLEED}`,
          wave(0, height * 0.12, 0.7),
          loop(height * 0.19, 90),
          wave(height * 0.22, mediaY - 200, 0.85),
          loop(mediaY - 150, 90),
          wave(mediaY - 118, mediaY - 44, 0.6),
        ]
      : [
          `M${n(rail)} ${-EDGE_BLEED}`,
          wave(0, height * 0.09, 0.7),
          loop(height * 0.16, height * 0.055),
          wave(height * 0.21, height * 0.27, 0.9),
          loop(height * 0.34, height * 0.055),
          wave(height * 0.39, height * 0.45, 0.9),
          loop(height * 0.52, height * 0.05),
          `C${n(rail + A * 0.4)} ${n(height * 0.6)} ${n(rail)} ${n(mediaY - 94)} ${n(rail)} ${n(mediaY - 64)}`,
        ];

    // Saída ondulada: sai do vídeo (borda direita) e serpenteia até a BORDA
    // DIREITA do site. Subpath separado, desenhado por último (createHeroTimeline).
    const eg = width + EDGE_BLEED - mediaRight;
    const ea = compact ? 20 : 34;
    const exit = [
      `M${n(mediaRight)} ${n(mediaY)}`,
      `C${n(mediaRight + eg * 0.16)} ${n(mediaY - ea)} ${n(mediaRight + eg * 0.32)} ${n(mediaY + ea)} ${n(mediaRight + eg * 0.46)} ${n(mediaY)}`,
      `C${n(mediaRight + eg * 0.58)} ${n(mediaY - ea * 1.3)} ${n(mediaRight + eg * 0.74)} ${n(mediaY - ea * 1.25)} ${n(mediaRight + eg * 0.82)} ${n(mediaY - ea * 0.35)}`,
      `C${n(mediaRight + eg * 0.9)} ${n(mediaY + ea * 0.5)} ${n(mediaRight + eg * 0.98)} ${n(mediaY)} ${n(width + EDGE_BLEED)} ${n(mediaY)}`,
    ];

    return {
      viewBox,
      path: [
        ...descent,
        // Quarto de volta suave: sai da vertical (controle reto abaixo do rail) e
        // chega horizontal na borda esquerda do vídeo, tangente à linha interna.
        `C${n(rail)} ${n(mediaY - (compact ? 22 : 32))} ${n(rail)} ${n(mediaY)} ${n(rail + (mediaLeft - rail) * (compact ? 0.5 : 0.36))} ${n(mediaY)}`,
        `C${n(rail + (mediaLeft - rail) * 0.72)} ${n(mediaY)} ${n(mediaLeft - (compact ? 10 : 44))} ${n(mediaY)} ${n(mediaLeft)} ${n(mediaY)}`,
        ...exit,
      ].join(" "),
    };
  }

  if (scene === "problem") {
    const stage = anchors["problem-signal"] ?? {
      x: left,
      y: height * 0.36,
      width: right - left,
      height: compact ? 96 : 120,
    };
    const y = centerY(stage);
    const a = compact ? 26 : 38;

    return {
      viewBox,
      path: [
        `M${n(width + EDGE_BLEED)} ${n(y - 6)}`,
        `C${n(width * 0.95)} ${n(y - a * 0.55)} ${n(width * 0.86)} ${n(y + a * 1.1)} ${n(width * 0.78)} ${n(y + a * 0.15)}`,
        `C${n(width * 0.7)} ${n(y - a * 0.8)} ${n(width * 0.61)} ${n(y - a * 1.15)} ${n(width * 0.54)} ${n(y + a * 0.25)}`,
        `C${n(width * 0.47)} ${n(y + a * 1.65)} ${n(width * 0.4)} ${n(y + a * 1.1)} ${n(width * 0.34)} ${n(y - a * 0.2)}`,
        `C${n(width * 0.28)} ${n(y - a * 1.5)} ${n(width * 0.18)} ${n(y + a * 1.3)} ${n(width * 0.13)} ${n(y + a * 0.1)}`,
        `C${n(width * 0.08)} ${n(y - a * 1.1)} ${n(left * 0.5)} ${n(y + a * 0.45)} ${-EDGE_BLEED} ${n(y + a * 0.18)}`,
      ].join(" "),
    };
  }

  if (scene === "services") {
    const stage = anchors["services-signal"] ?? {
      x: left,
      y: height * 0.36,
      width: right - left,
      height: 120,
    };
    const y = stage.y;
    const reach = Math.min(stage.x + (compact ? 110 : 180), width * 0.42);
    // Aparece na esquerda, desce um pouco ondulando (excursão pra direita e de
    // volta) e sai de novo pela esquerda, mais abaixo. A descida faz o traço
    // acompanhar o scroll (não fica horizontal parado).
    const drop = compact ? 76 : 120;
    const a = compact ? 12 : 18;

    return {
      viewBox,
      path: [
        `M${-EDGE_BLEED} ${n(y)}`,
        `C${n(reach * 0.28)} ${n(y + a)} ${n(reach * 0.5)} ${n(y + drop * 0.28 - a)} ${n(reach * 0.62)} ${n(y + drop * 0.4)}`,
        `C${n(reach * 0.8)} ${n(y + drop * 0.55 + a)} ${n(reach)} ${n(y + drop * 0.5)} ${n(reach)} ${n(y + drop * 0.62)}`,
        `C${n(reach)} ${n(y + drop * 0.75)} ${n(reach * 0.7)} ${n(y + drop * 0.7 - a)} ${n(reach * 0.5)} ${n(y + drop * 0.82)}`,
        `C${n(reach * 0.28)} ${n(y + drop * 0.94 + a)} ${n(reach * 0.14)} ${n(y + drop - a)} ${-EDGE_BLEED} ${n(y + drop)}`,
      ].join(" "),
    };
  }

  if (scene === "machine") {
    const frame = anchors["machine-frame"] ?? {
      x: compact ? 20 : left,
      y: height * 0.43,
      width: compact ? width - 40 : right - left,
      height: height * 0.45,
    };
    // Entra pela esquerda, mergulha na faixa do frame e cruza horizontalmente
    // POR TRÁS do card (overlay em z-wire < z-content: o editor sólido a esconde)
    // e emerge no outro lado, chegando reta na BORDA DIREITA do site.
    const frameRight = frame.x + frame.width;
    const bandY = frame.y + (compact ? 42 : 54);

    return {
      viewBox,
      path: [
        `M${-EDGE_BLEED} ${n(bandY - (compact ? 34 : 52))}`,
        `C${n(left * 0.5)} ${n(bandY - 30)} ${n(frame.x - (compact ? 4 : 18))} ${n(bandY - 12)} ${n(frame.x + (compact ? 6 : 12))} ${n(bandY)}`,
        `C${n(frame.x + frame.width * 0.33)} ${n(bandY)} ${n(frame.x + frame.width * 0.66)} ${n(bandY)} ${n(frameRight - (compact ? 6 : 12))} ${n(bandY)}`,
        `C${n(right + (compact ? 4 : 22))} ${n(bandY)} ${n(width - (compact ? 10 : 48))} ${n(bandY)} ${n(width + EDGE_BLEED)} ${n(bandY)}`,
      ].join(" "),
    };
  }

  if (scene === "outcome") {
    // Já alinhada: aparece e atravessa a seção borda a borda, só levemente
    // ondulada, na altura da linha de progresso.
    const progress = anchors["outcome-progress"] ?? {
      x: left,
      y: height * 0.34,
      width: right - left,
      height: 20,
    };
    const y = centerY(progress);
    const a = compact ? 8 : 12;

    return {
      viewBox,
      path: [
        `M${-EDGE_BLEED} ${n(y)}`,
        `C${n(width * 0.2)} ${n(y - a)} ${n(width * 0.32)} ${n(y + a)} ${n(width * 0.5)} ${n(y)}`,
        `C${n(width * 0.68)} ${n(y - a)} ${n(width * 0.8)} ${n(y + a)} ${n(width + EDGE_BLEED)} ${n(y)}`,
      ].join(" "),
    };
  }

  if (scene === "about") {
    // Passa POR CIMA da equipe (overlay acima do conteúdo), logo ACIMA das fotos
    // (não no meio), só bem levemente ondulada.
    const stage = anchors["about-signal"] ?? {
      x: left,
      y: height * 0.5,
      width: right - left,
      height: 200,
    };
    const y = stage.y - (compact ? 8 : 12);
    const a = compact ? 6 : 9;

    return {
      viewBox,
      path: [
        `M${-EDGE_BLEED} ${n(y)}`,
        `C${n(width * 0.22)} ${n(y - a)} ${n(width * 0.34)} ${n(y + a)} ${n(width * 0.5)} ${n(y)}`,
        `C${n(width * 0.66)} ${n(y - a)} ${n(width * 0.78)} ${n(y + a)} ${n(width + EDGE_BLEED)} ${n(y)}`,
      ].join(" "),
    };
  }

  const horizon = anchors["contact-horizon"] ?? {
    x: 0,
    y: height * 0.76,
    width,
    height: 1,
  };
  const terminal = anchors["contact-terminal"] ?? {
    x: left,
    y: horizon.y + 32,
    width: compact ? 132 : 144,
    height: 32,
  };
  const horizonY = horizon.y;
  const targetX = terminal.x + terminal.width + (compact ? 12 : 16);

  // Chega reta no footer: horizontal limpa da borda direita até o logo.
  return {
    viewBox,
    path: [
      `M${n(width + EDGE_BLEED)} ${n(horizonY)}`,
      `L${n(targetX)} ${n(horizonY)}`,
    ].join(" "),
  };
}

export function buildProcessRoute({
  width,
  height,
  track,
  mobileStepYs,
}: {
  width: number;
  height: number;
  track?: SignalRect;
  mobileStepYs: readonly number[];
}): BuiltProcessRoute {
  const left = centeredRail(width, "left", 768);

  if (width < 768) {
    const [first, second, third] = mobileStepYs.length === 3
      ? mobileStepYs
      : [height * 0.5, height * 0.68, height * 0.86];
    const exitY = Math.min(height - 20, third + 96);

    return {
      viewBox: `0 0 ${n(width)} ${n(height)}`,
      nodeTargets: [
        { x: left, y: first },
        { x: left, y: second },
        { x: left, y: third },
      ],
      path: [
        `M${-EDGE_BLEED} ${n(first - 54)}`,
        `C${left + 8} ${n(first - 48)} ${left + 10} ${n(first - 20)} ${left} ${n(first)}`,
        `C${left - 7} ${n(first + (second - first) * 0.3)} ${left + 7} ${n(first + (second - first) * 0.64)} ${left} ${n(second)}`,
        `C${left - 3.5} ${n(second + (third - second) * 0.36)} ${left + 3.5} ${n(second + (third - second) * 0.68)} ${left} ${n(third)}`,
        `C${left} ${n(third + 54)} ${n(width * 0.72)} ${n(exitY)} ${n(width + EDGE_BLEED)} ${n(exitY)}`,
      ].join(" "),
    };
  }

  const right = centeredRail(width, "right", 768);
  const routeTrack = track ?? {
    x: left,
    y: height * 0.52,
    width: right - left,
    height: 144,
  };
  const trackY = routeTrack.y + routeTrack.height / 2;
  const scale = routeTrack.width / 900;
  const x = (value: number) => routeTrack.x + value * scale;
  const y = (value: number) => trackY + (value - 100) * (routeTrack.height / 200);
  const nodes = [90, 450, 810].map((value) => ({ x: x(value), y: trackY }));

  return {
    viewBox: `0 0 ${n(width)} ${n(height)}`,
    nodeTargets: nodes,
    path: [
      `M${-EDGE_BLEED} ${n(trackY)}`,
      `C${n(routeTrack.x - 48)} ${n(trackY - 38)} ${n(routeTrack.x - 24)} ${n(trackY + 34)} ${n(routeTrack.x)} ${n(trackY)}`,
      `C${n(x(30))} ${n(y(42))} ${n(x(60))} ${n(y(158))} ${n(x(90))} ${n(trackY)}`,
      `C${n(x(145))} ${n(y(44))} ${n(x(210))} ${n(y(146))} ${n(x(270))} ${n(trackY)}`,
      `C${n(x(330))} ${n(y(72))} ${n(x(390))} ${n(y(120))} ${n(x(450))} ${n(trackY)}`,
      `C${n(x(500))} ${n(y(88))} ${n(x(540))} ${n(y(104))} ${n(x(570))} ${n(trackY)}`,
      `C${n(x(680))} ${n(trackY)} ${n(x(800))} ${n(trackY)} ${n(x(900))} ${n(trackY)}`,
      `C${n(x(900) + 24)} ${n(trackY)} ${n(right + 20)} ${n(trackY)} ${n(width + EDGE_BLEED)} ${n(trackY)}`,
    ].join(" "),
  };
}

export function measureElementWithin(
  element: HTMLElement,
  ancestor: HTMLElement,
): SignalRect {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = element;

  while (node && node !== ancestor) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }

  return {
    x,
    y,
    width: element.offsetWidth,
    height: element.offsetHeight,
  };
}
