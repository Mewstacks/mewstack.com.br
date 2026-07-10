/* ── Mascote oficial da MewStack — criatura-espírito rosa (#FF7BAC) com headset,
   gerada no Higgsfield (Nano Banana) a partir de um design 100% original.
   Sempre decorativo: alt="" + aria-hidden — a informação nunca depende dele
   (a11y). Flutuação idle em CSS transform (GPU); o media query global de
   prefers-reduced-motion congela a animação. Entrada/parallax/deslocamentos
   ficam a cargo de wrappers (data-reveal / data-parallax / GSAP) — nunca
   empilhe transform estático no className do próprio Mascot (o float
   sobrescreve); flips/offsets vão num wrapper. */

export type MascotPose =
  | "idle" // flutuando de frente — presença calma (Hero)
  | "looking" // olhando para baixo, curioso (Problem, Showcase)
  | "focused" // modo técnico, mão no headset (CodeLab)
  | "pointing" // apontando uma etapa/painel (Process, Accounting)
  | "celebrating" // comemorando de braços pra cima (Capabilities, Contact)
  | "waving"; // acenando, convidando

type MascotProps = {
  pose: MascotPose;
  /** Largura tailwind (ex.: "w-16 sm:w-20"). */
  className?: string;
  /** Atraso da flutuação idle, para dessincronizar múltiplos mascotes. */
  floatDelay?: string;
  /** Desliga a flutuação idle (ex.: quando o wrapper já anima). */
  still?: boolean;
};

export default function Mascot({ pose, className = "w-16", floatDelay, still }: MascotProps) {
  return (
    <img
      src={`/mascot/mascot-${pose}.webp`}
      alt=""
      aria-hidden
      loading="lazy"
      decoding="async"
      draggable={false}
      className={`pointer-events-none select-none drop-shadow-[0_12px_20px_rgba(40,20,35,0.18)] ${still ? "" : "animate-float"} ${className}`}
      style={floatDelay ? { animationDelay: floatDelay } : undefined}
    />
  );
}
