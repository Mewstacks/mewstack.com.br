/* Comprimento de traço em pixels renderizados.
 *
 * Com `vector-effect: non-scaling-stroke` o navegador aplica strokeDasharray no
 * espaço já transformado, enquanto `getTotalLength()` responde no espaço do
 * viewBox. Em SVG com `preserveAspectRatio="none"` (escala x ≠ escala y) os dois
 * não batem e o desenho para antes do fim do caminho. Amostrar o path pela CTM
 * devolve o comprimento que o dash realmente enxerga.
 */

const SAMPLES = 400;

type PathMetrics = {
  /** Comprimento em px renderizados: use em strokeDasharray/strokeDashoffset. */
  length: number;
  /** Fração do comprimento em que a ponta cruza cada x do viewBox. */
  fractions: number[];
};

export function measurePath(
  path: SVGPathElement,
  targetsX: number[] = [],
): PathMetrics {
  const total = path.getTotalLength();
  const matrix = path.getScreenCTM();
  if (!matrix || total === 0) {
    return { length: total, fractions: targetsX.map(() => 1) };
  }

  const cumulative: number[] = [];
  const userX: number[] = [];
  let length = 0;
  let previous: DOMPoint | null = null;

  for (let index = 0; index <= SAMPLES; index += 1) {
    const point = path.getPointAtLength((total * index) / SAMPLES);
    const screen = point.matrixTransform(matrix);
    if (previous) {
      length += Math.hypot(screen.x - previous.x, screen.y - previous.y);
    }
    previous = screen;
    cumulative.push(length);
    userX.push(point.x);
  }

  const fractions = targetsX.map((target) => {
    const index = userX.findIndex((x) => x >= target);
    if (index < 0 || length === 0) return 1;
    return cumulative[index] / length;
  });

  return { length, fractions };
}
