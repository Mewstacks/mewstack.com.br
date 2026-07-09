/* ── Mascote oficial da MewStack (gato + headset) em poses geradas a partir do
   asset da marca. Sempre decorativo: alt="" + aria-hidden — a informação nunca
   depende dele (a11y). Flutuação idle em CSS transform (GPU); o media query
   global de prefers-reduced-motion congela a animação. Entrada/parallax ficam a
   cargo dos atributos do capítulo (data-reveal / data-parallax) no wrapper. */

export type MascotPose =
  | "typing" // digitando no laptop — monitorando sistemas
  | "observing" // flutuando, observando algo abaixo
  | "jumping" // pulando entre etapas
  | "pointing" // apontando para um painel/explicação
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
      src={`/mascot/${pose}.webp`}
      alt=""
      aria-hidden
      loading="lazy"
      decoding="async"
      draggable={false}
      className={`pointer-events-none select-none ${still ? "" : "animate-float"} ${className}`}
      style={floatDelay ? { animationDelay: floatDelay } : undefined}
    />
  );
}
