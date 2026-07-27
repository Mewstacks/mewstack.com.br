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
  /** Hero only: quarter-turn into the media left edge (drawn during pin). */
  joinPath?: string;
  exitPath?: string;
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
    /** Hairline do footer — ver MOTION.signal.contact para a janela de scrub. */
    triggerAnchor: "contact-horizon",
  },
};

const MAX_CONTENT = 1200;
const DESKTOP_GUTTER = 24;
const COMPACT_RAIL = 10;
const EDGE_BLEED = 2;

/**
 * Matches `HeroSignalMedia` viewBox + FINAL_PATH edge crossings.
 * Outer connectors must meet these Y ratios or the join reads as broken.
 * Mid-path may curve (gentle vertical progress while scrubbing); edge
 * tangents stay near-horizontal so join/exit seams don't step.
 */
export const HERO_SIGNAL_MEDIA = {
  viewWidth: 1200,
  viewHeight: 675,
  /** Inner line at the left edge (x ≈ 0). */
  yLeft: 347,
  /** Inner line at the right edge — exit seam for the outer connector. */
  yRight: 344,
} as const;

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

type CubicCurve = {
  c1: SignalPoint;
  c2: SignalPoint;
  end: SignalPoint;
};

/**
 * Keeps consecutive cubic curves tangent to one another. `strokeLinejoin`
 * rounds the paint at a join, but it cannot hide a cusp created by two handles
 * pointing in different directions — which is what caused the sharp folds in
 * the Hero signal.
 */
const roundedCubicPath = (
  start: SignalPoint,
  source: readonly CubicCurve[],
  maxHandle: number,
) => {
  const curves = source.map((curve) => ({
    c1: { ...curve.c1 },
    c2: { ...curve.c2 },
    end: { ...curve.end },
  }));

  for (let index = 0; index < curves.length - 1; index += 1) {
    const current = curves[index];
    const next = curves[index + 1];
    const join = current.end;
    const incoming = {
      x: join.x - current.c2.x,
      y: join.y - current.c2.y,
    };
    const outgoing = {
      x: next.c1.x - join.x,
      y: next.c1.y - join.y,
    };
    const incomingLength = Math.hypot(incoming.x, incoming.y);
    const outgoingLength = Math.hypot(outgoing.x, outgoing.y);
    if (incomingLength === 0 || outgoingLength === 0) continue;

    const direction = {
      x: incoming.x / incomingLength + outgoing.x / outgoingLength,
      y: incoming.y / incomingLength + outgoing.y / outgoingLength,
    };
    const directionLength = Math.hypot(direction.x, direction.y);
    if (directionLength < 0.001) continue;

    const dx = direction.x / directionLength;
    const dy = direction.y / directionLength;
    // Keep a minimum handle so short segments don't collapse into cusps.
    const minHandle = Math.min(maxHandle * 0.35, 18);
    const incomingHandle = Math.max(
      minHandle,
      Math.min(incomingLength, maxHandle),
    );
    const outgoingHandle = Math.max(
      minHandle,
      Math.min(outgoingLength, maxHandle),
    );

    current.c2 = {
      x: join.x - dx * incomingHandle,
      y: join.y - dy * incomingHandle,
    };
    next.c1 = {
      x: join.x + dx * outgoingHandle,
      y: join.y + dy * outgoingHandle,
    };
  }

  return [
    `M${n(start.x)} ${n(start.y)}`,
    ...curves.map(
      ({ c1, c2, end }) =>
        `C${n(c1.x)} ${n(c1.y)} ${n(c2.x)} ${n(c2.y)} ${n(end.x)} ${n(end.y)}`,
    ),
  ].join(" ");
};

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
    const { viewHeight, yLeft: yLeftRatio, yRight: yRightRatio } =
      HERO_SIGNAL_MEDIA;
    // Join Y must track the inner SVG line (preserveAspectRatio=none).
    const mediaY = media.y + media.height * (yLeftRatio / viewHeight);
    const mediaYRight = media.y + media.height * (yRightRatio / viewHeight);
    const mediaLeft = media.x;
    const mediaRight = media.x + media.width;
    // Inset past the rounded bezel clip so the outer tip overlaps the inner
    // stroke at the frame edge (avoids the visible gap in the join).
    const joinLeft = mediaLeft + (compact ? 10 : 14);

    const curve = (
      c1x: number,
      c1y: number,
      c2x: number,
      c2y: number,
      x: number,
      y: number,
    ): CubicCurve => ({
      c1: { x: c1x, y: c1y },
      c2: { x: c2x, y: c2y },
      end: { x, y },
    });

    // Loops invade the text column (z-wire is behind content). Compact mirrors
    // desktop rhythm: wave → loop → wave → loop so the stroke feels alive while
    // scrolling — not a straight rail.
    const A = compact ? 46 : 82;
    const rail = compact
      ? Math.max(42, Math.min(56, width * 0.13))
      : Math.max(Math.max(14, left - 38), A + 8);
    const approachRail = compact
      ? Math.max(18, mediaLeft - 4)
      : rail;

    // Um laço que se cruza, descendo. Compact: swing right into copy.
    const loop = (cy: number, span: number, amp = A) => {
      const leftAmp = compact ? amp * 0.3 : amp;
      const rightAmp = compact ? amp * 1.25 : amp;
      return [
        curve(
          rail - leftAmp,
          cy - span * 0.5,
          rail - leftAmp,
          cy + span * 0.18,
          rail + rightAmp * 0.5,
          cy,
        ),
        curve(
          rail + rightAmp * 1.15,
          cy - span * 0.12,
          rail + rightAmp * 1.1,
          cy - span * 0.95,
          rail + rightAmp * 0.12,
          cy - span * 0.78,
        ),
        curve(
          rail - leftAmp * 0.7,
          cy - span * 0.62,
          rail - leftAmp * 0.3,
          cy + span * 0.58,
          rail,
          cy + span * 0.82,
        ),
      ];
    };

    const wave = (fromY: number, toY: number, swing: number, amp = A) => {
      const leftSwing = compact ? swing * 0.4 : swing;
      const rightSwing = compact ? swing * 1.05 : swing;
      return curve(
        rail + amp * rightSwing,
        fromY + (toY - fromY) * 0.4,
        rail - amp * leftSwing,
        fromY + (toY - fromY) * 0.7,
        rail,
        toY,
      );
    };

    const room = Math.max(compact ? 240 : 280, media.y - (compact ? 16 : 48));

    const descent: CubicCurve[] = compact
      ? [
          wave(0, room * 0.1, 0.8),
          ...loop(room * 0.18, Math.min(72, room * 0.22)),
          wave(room * 0.26, room * 0.34, 1),
          ...loop(room * 0.42, Math.min(68, room * 0.2)),
          wave(room * 0.5, room * 0.58, 0.95),
          ...loop(room * 0.66, Math.min(64, room * 0.18)),
          wave(room * 0.74, room * 0.82, 0.85),
          ...loop(room * 0.88, Math.min(56, room * 0.14), A * 0.85),
          curve(
            rail + A * 0.25,
            room * 0.94,
            approachRail + (rail - approachRail) * 0.4,
            mediaY - 24,
            approachRail,
            mediaY - 12,
          ),
        ]
      : [
          wave(0, height * 0.09, 0.7),
          ...loop(height * 0.16, height * 0.055),
          wave(height * 0.21, height * 0.27, 0.9),
          ...loop(height * 0.34, height * 0.055),
          wave(height * 0.39, height * 0.45, 0.9),
          ...loop(height * 0.52, height * 0.05),
          curve(
            rail + A * 0.4,
            height * 0.6,
            rail,
            mediaY - 94,
            rail,
            mediaY - 64,
          ),
        ];

    // Join starts exactly where descent ends (no seam between the two paths).
    const descentEndY = compact ? mediaY - 12 : mediaY - 64;
    const gap = Math.max(4, joinLeft - approachRail);
    const join: CubicCurve[] = [
      curve(
        approachRail,
        descentEndY + (mediaY - descentEndY) * 0.55,
        approachRail,
        mediaY,
        approachRail + gap * (compact ? 0.4 : 0.36),
        mediaY,
      ),
      curve(
        approachRail + gap * (compact ? 0.72 : 0.72),
        mediaY,
        joinLeft - (compact ? 1.5 : 44),
        mediaY,
        joinLeft,
        mediaY,
      ),
    ];

    // Saída: path próprio. Mantém Y flat PAST a borda do frame — se a onda
    // começar ainda sob o vídeo, na costura aparece o “degrau” (interna baixa,
    // saída já subindo).
    const eg = Math.max(8, width + EDGE_BLEED - mediaRight);
    const ea = compact ? Math.min(26, Math.max(12, media.height * 0.14)) : 28;
    const exitY = mediaYRight;
    // Ponto visível na costura = borda direita do frame (não o inset interno).
    const seamX = mediaRight;
    const flat = Math.max(compact ? 14 : 28, eg * 0.35);
    const exit: CubicCurve[] =
      compact && eg < 40
        ? [
            curve(seamX + flat * 0.45, exitY, seamX + flat, exitY, seamX + flat + 4, exitY),
            curve(
              seamX + flat + eg * 0.35,
              exitY + ea * 0.35,
              width - 10,
              exitY + ea * 0.9,
              width + EDGE_BLEED,
              exitY + ea * 0.55,
            ),
          ]
        : [
            // Trecho reto horizontal até sair do frame com folga.
            curve(
              seamX + flat * 0.4,
              exitY,
              seamX + flat * 0.75,
              exitY,
              seamX + flat,
              exitY,
            ),
            curve(
              seamX + flat + eg * 0.2,
              exitY - ea * 0.7,
              seamX + flat + eg * 0.4,
              exitY + ea * 0.55,
              seamX + flat + eg * 0.58,
              exitY,
            ),
            curve(
              seamX + flat + eg * 0.75,
              exitY - ea * 0.25,
              width - 6,
              exitY,
              width + EDGE_BLEED,
              exitY,
            ),
          ];

    return {
      viewBox,
      path: roundedCubicPath(
        { x: rail, y: -EDGE_BLEED },
        descent,
        compact ? 48 : 96,
      ),
      joinPath: roundedCubicPath(
        { x: approachRail, y: descentEndY },
        join,
        compact ? 22 : 72,
      ),
      exitPath: roundedCubicPath(
        { x: seamX, y: exitY },
        exit,
        compact ? 18 : 48,
      ),
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
      height: compact ? 420 : 560,
    };
    // Trilho vertical ondulado com tangentes contínuas (roundedCubicPath) —
    // cubics soltos geravam as “quebras” angulares perto dos 01/03.
    const startY = stage.y + (compact ? 4 : 8);
    const endY = stage.y + stage.height * (compact ? 0.82 : 0.8);
    const rail = left;
    const bulge = compact ? 26 : 28;
    const settle = startY + (compact ? 64 : 128);
    const mid = settle + (endY - settle) * 0.38;
    const mid2 = settle + (endY - settle) * 0.66;
    const preExit = endY - (compact ? 52 : 40);
    const exitBulge = compact ? 34 : 28;

    const curve = (
      c1x: number,
      c1y: number,
      c2x: number,
      c2y: number,
      x: number,
      y: number,
    ): CubicCurve => ({
      c1: { x: c1x, y: c1y },
      c2: { x: c2x, y: c2y },
      end: { x, y },
    });

    const segments: CubicCurve[] = [
      curve(
        rail + bulge * 0.5,
        startY + 8,
        rail + bulge * 0.85,
        startY + (compact ? 30 : 40),
        rail + bulge * 0.55,
        startY + (compact ? 54 : 70),
      ),
      curve(
        rail + bulge * 0.2,
        startY + (compact ? 72 : 96),
        rail + 6,
        settle - 16,
        rail,
        settle,
      ),
      // Ondas suaves — sem inversões bruscas de direção (evita cotovelo).
      curve(
        rail + bulge * 0.55,
        settle + (mid - settle) * 0.35,
        rail + bulge * 0.55,
        settle + (mid - settle) * 0.7,
        rail + bulge * 0.3,
        mid,
      ),
      curve(
        rail + bulge * 0.55,
        mid + (mid2 - mid) * 0.35,
        rail + bulge * 0.1,
        mid + (mid2 - mid) * 0.7,
        rail + bulge * 0.35,
        mid2,
      ),
      curve(
        rail + bulge * 0.55,
        mid2 + (preExit - mid2) * 0.4,
        rail + bulge * 0.15,
        mid2 + (preExit - mid2) * 0.75,
        rail + bulge * 0.25,
        preExit,
      ),
      curve(
        rail + exitBulge * 0.4,
        preExit + (endY - preExit) * 0.45,
        rail * 0.5,
        endY,
        -EDGE_BLEED,
        endY + (compact ? 2 : 0),
      ),
    ];

    return {
      viewBox,
      path: roundedCubicPath(
        { x: -EDGE_BLEED, y: startY },
        segments,
        compact ? 48 : 72,
      ),
    };
  }

  if (scene === "machine") {
    const frame = anchors["machine-frame"] ?? {
      x: compact ? 20 : left,
      y: height * 0.43,
      width: compact ? width - 40 : right - left,
      height: height * 0.45,
    };
    // Entra na borda esquerda do editor, desce POR TRÁS do card e sai do canto
    // inferior direito. Inset leve nas bordas pra o join ler contínuo sob o bezel.
    const frameRight = frame.x + frame.width;
    const entryY = frame.y + (compact ? 28 : 38);
    const exitY = frame.y + frame.height * (compact ? 0.86 : 0.92);
    const outY = Math.min(height - 16, exitY + (compact ? 56 : 120));
    const approach = compact ? 10 : 16;
    const inset = compact ? 2.5 : 4;

    return {
      viewBox,
      path: [
        `M${-EDGE_BLEED} ${n(entryY - approach)}`,
        `C${n(frame.x * 0.42)} ${n(entryY - approach * 0.25)} ${n(frame.x - (compact ? 2 : 8))} ${n(entryY)} ${n(frame.x + inset)} ${n(entryY)}`,
        `C${n(frame.x + frame.width * 0.22)} ${n(entryY + (exitY - entryY) * 0.3)} ${n(frame.x + frame.width * 0.7)} ${n(entryY + (exitY - entryY) * 0.78)} ${n(frameRight - inset)} ${n(exitY)}`,
        `C${n(frameRight + (compact ? 28 : 80))} ${n(exitY + (outY - exitY) * 0.55)} ${n(width - (compact ? 14 : 28))} ${n(outY)} ${n(width + EDGE_BLEED)} ${n(outY)}`,
      ].join(" "),
    };
  }

  if (scene === "outcome") {
    // Atravessa a seção borda a borda na altura da linha de progresso.
    // Compact: ondulação maior pra ler como o fio do desktop.
    const progress = anchors["outcome-progress"] ?? {
      x: left,
      y: height * 0.34,
      width: right - left,
      height: 20,
    };
    const y = centerY(progress);
    const a = compact ? 18 : 12;

    return {
      viewBox,
      path: [
        `M${-EDGE_BLEED} ${n(y)}`,
        `C${n(width * 0.18)} ${n(y - a)} ${n(width * 0.3)} ${n(y + a * 1.1)} ${n(width * 0.48)} ${n(y)}`,
        `C${n(width * 0.66)} ${n(y - a * 1.05)} ${n(width * 0.8)} ${n(y + a)} ${n(width + EDGE_BLEED)} ${n(y)}`,
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
  // Centro da border-t (1px) — mesmo eixo do ponto HTML (top:-0.5px + translate).
  const horizonY = horizon.y + 0.5;
  // Centro do dot: logo.right + ml-2.5 (10px) + metade de size-1.5 (3px).
  const targetX = terminal.x + terminal.width + 13;

  // Chega reta no footer: horizontal limpa da borda direita até o ponto.
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
  // Offset geometry ignores transforms (hero entrance translateY, GSAP pin).
  // getBoundingClientRect was baking the entrance y:28 into the hero join.
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
