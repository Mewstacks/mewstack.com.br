export type SignalAnchorId =
  | "hero-media"
  | "problem-signal"
  | "services-signal"
  | "process-track"
  | "machine-frame"
  | "outcome-progress"
  | "outcome-terminal"
  | "contact-horizon"
  | "contact-terminal";

export type SignalSceneId =
  | "hero"
  | "problem"
  | "services"
  | "process"
  | "machine"
  | "outcome"
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
    const safeRail = compact ? left : Math.max(14, left - 38);
    const wideLoopAmplitude = Math.min(
      28,
      Math.max(10, left - safeRail - 10),
    );

    return {
      viewBox,
      path: compact
        ? [
            `M${safeRail} ${-EDGE_BLEED}`,
            `C${safeRail - 4} ${n(height * 0.13)} ${safeRail + 4} ${n(height * 0.28)} ${safeRail + 1} ${n(mediaY - 190)}`,
            `C${safeRail - 12} ${n(mediaY - 171)} ${safeRail - 10} ${n(mediaY - 140)} ${safeRail + 9} ${n(mediaY - 142)}`,
            `C${safeRail + 34} ${n(mediaY - 145)} ${safeRail + 34} ${n(mediaY - 176)} ${safeRail + 10} ${n(mediaY - 173)}`,
            `C${safeRail - 9} ${n(mediaY - 158)} ${safeRail - 8} ${n(mediaY - 119)} ${safeRail + 8} ${n(mediaY - 118)}`,
            `C${safeRail + 32} ${n(mediaY - 116)} ${safeRail + 30} ${n(mediaY - 145)} ${safeRail + 10} ${n(mediaY - 139)}`,
            `C${safeRail + 2} ${n(mediaY - 112)} ${safeRail} ${n(mediaY - 76)} ${safeRail} ${n(mediaY - 54)}`,
            `C${safeRail} ${n(mediaY - 32)} ${n(mediaLeft - 12)} ${n(mediaY)} ${n(mediaLeft)} ${n(mediaY)}`,
          ].join(" ")
        : [
            `M${n(safeRail)} ${-EDGE_BLEED}`,
            `C${n(safeRail - wideLoopAmplitude)} ${n(height * 0.05)} ${n(safeRail + wideLoopAmplitude * 0.86)} ${n(height * 0.08)} ${n(safeRail + 2)} ${n(height * 0.14)}`,
            `C${n(safeRail - wideLoopAmplitude * 1.07)} ${n(height * 0.18)} ${n(safeRail - wideLoopAmplitude * 1.14)} ${n(height * 0.25)} ${n(safeRail + 1)} ${n(height * 0.24)}`,
            `C${n(safeRail + wideLoopAmplitude * 1.1)} ${n(height * 0.23)} ${n(safeRail + wideLoopAmplitude * 1.07)} ${n(height * 0.16)} ${n(safeRail + 2)} ${n(height * 0.17)}`,
            `C${n(safeRail - wideLoopAmplitude * 0.96)} ${n(height * 0.24)} ${n(safeRail - wideLoopAmplitude * 1.04)} ${n(height * 0.33)} ${n(safeRail)} ${n(height * 0.32)}`,
            `C${n(safeRail + wideLoopAmplitude)} ${n(height * 0.31)} ${n(safeRail + wideLoopAmplitude * 0.96)} ${n(height * 0.25)} ${n(safeRail + 1)} ${n(height * 0.27)}`,
            `C${n(safeRail - wideLoopAmplitude * 0.79)} ${n(height * 0.35)} ${n(safeRail + wideLoopAmplitude * 0.71)} ${n(height * 0.41)} ${n(safeRail)} ${n(height * 0.47)}`,
            `C${n(safeRail - wideLoopAmplitude * 0.54)} ${n(height * 0.52)} ${n(safeRail)} ${n(mediaY - 94)} ${n(safeRail)} ${n(mediaY - 70)}`,
            `C${n(safeRail)} ${n(mediaY - 46)} ${n(mediaLeft - 58)} ${n(mediaY - 12)} ${n(mediaLeft)} ${n(mediaY)}`,
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
    const reach = Math.min(stage.x + (compact ? 86 : 132), width * 0.34);

    return {
      viewBox,
      path: [
        `M${-EDGE_BLEED} ${n(y - 30)}`,
        `C${n(stage.x * 0.42)} ${n(y - 29)} ${n(reach - 24)} ${n(y)} ${n(reach)} ${n(y)}`,
        `C${n(reach + 20)} ${n(y)} ${n(stage.x * 0.5)} ${n(y - 12)} ${-EDGE_BLEED} ${n(y - 14)}`,
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
    const targetX = frame.x + frame.width - (compact ? 7 : 10);
    const targetY = frame.y + (compact ? 37 : 40);

    return {
      viewBox,
      path: [
        `M${n(width + EDGE_BLEED)} ${n(targetY - (compact ? 34 : 58))}`,
        `C${n(width - (compact ? 8 : 44))} ${n(targetY - 30)} ${n(right + (compact ? 0 : 18))} ${n(targetY - 16)} ${n(right - (compact ? 4 : 12))} ${n(targetY - 7)}`,
        `C${n(right - (compact ? 7 : 28))} ${n(targetY - 3)} ${n(targetX + 16)} ${n(targetY)} ${n(targetX)} ${n(targetY)}`,
      ].join(" "),
    };
  }

  if (scene === "outcome") {
    const progress = anchors["outcome-progress"] ?? {
      x: left,
      y: height * 0.34,
      width: right - left,
      height: 20,
    };
    const terminal = anchors["outcome-terminal"] ?? {
      x: progress.x + (compact ? 42 : 58),
      y: progress.y,
      width: progress.width - (compact ? 84 : 116),
      height: progress.height,
    };
    const targetX = terminal.x;
    const targetY = centerY(terminal);

    return {
      viewBox,
      path: [
        `M${-EDGE_BLEED} ${n(targetY + (compact ? 25 : 34))}`,
        `C${n(targetX * 0.34)} ${n(targetY + (compact ? 24 : 33))} ${n(targetX * 0.58)} ${n(targetY + 17)} ${n(targetX - 22)} ${n(targetY + 8)}`,
        `C${n(targetX - 12)} ${n(targetY + 4)} ${n(targetX - 7)} ${n(targetY)} ${n(targetX)} ${n(targetY)}`,
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

  return {
    viewBox,
    path: [
      `M${n(width + EDGE_BLEED)} ${n(horizonY - (compact ? 22 : 30))}`,
      `C${n(width - (compact ? 20 : 54))} ${n(horizonY - 22)} ${n(right + (compact ? 0 : 20))} ${n(horizonY - 5)} ${n(right - (compact ? 7 : 12))} ${n(horizonY)}`,
      `C${n(right - (compact ? 46 : 110))} ${n(horizonY)} ${n(targetX + (compact ? 70 : 210))} ${n(horizonY)} ${n(targetX)} ${n(horizonY)}`,
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
