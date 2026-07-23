import type { CSSProperties, ReactNode } from "react";
import { reduceMotion } from "../lib/motion";

export type MediaCaption = {
  name: string;
  detail?: string;
  year?: string;
  type?: string;
};

type MediaFrameProps = {
  ratio?: string;
  caption?: MediaCaption;
  captionPosition?: "top" | "bottom";
  src?: string;
  videoSrc?: string;
  fit?: "cover" | "contain";
  standbyLabel?: string;
  title?: string;
  angle?: number;
  className?: string;
  onNight?: boolean;
  children?: ReactNode;
};

const CORNERS = ["tl", "tr", "br", "bl"] as const;

function Caption({
  caption,
  onNight,
}: {
  caption: MediaCaption;
  onNight: boolean;
}) {
  return (
    <div
      className={`mono flex min-h-8 min-w-0 items-center justify-between gap-3 border-y px-3 text-[0.65rem] leading-none sm:px-4 sm:text-[0.72rem] ${
        onNight
          ? "border-night-line text-paper-on-night-soft"
          : "border-line text-ink-faint"
      }`}
    >
      <p className="min-w-0 truncate">
        <span
          className={`font-medium ${
            onNight ? "text-paper-on-night" : "text-ink"
          }`}
        >
          {caption.name}
        </span>
        {caption.detail && <span> · {caption.detail}</span>}
      </p>
      <p className="flex shrink-0 items-center gap-2">
        {caption.year && <span>{caption.year}</span>}
        {caption.type === "●" ? (
          <span aria-hidden className="signal-dot" data-pulse="true" />
        ) : caption.type ? (
          <span
            className={`font-medium ${
              onNight ? "text-signal-bright" : "text-ink"
            }`}
          >
            {caption.type}
          </span>
        ) : null}
      </p>
    </div>
  );
}

function Standby({
  title,
  label,
  angle,
}: {
  title: string;
  label: string;
  angle: number;
}) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-night text-paper-on-night">
      <div className="grain pointer-events-none absolute inset-0 opacity-[0.045]" />
      <svg
        aria-hidden
        viewBox="0 0 1000 620"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <path
          d={
            angle > 0
              ? "M-80 540 C180 480 250 150 520 300 S820 590 1080 70"
              : "M-80 90 C180 160 330 540 560 300 S830 80 1080 520"
          }
          fill="none"
          stroke="var(--color-signal)"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <p className="absolute top-[14%] -left-[2%] max-w-[86%] font-display text-[clamp(2rem,8vw,6.8rem)] leading-[0.84] font-medium tracking-[-0.02em] text-paper-on-night opacity-90">
        {title}
      </p>
      <p className="mono absolute right-4 bottom-4 text-[0.58rem] tracking-[0.06em] text-paper-on-night-soft sm:text-[0.68rem]">
        {label}
      </p>
    </div>
  );
}

export default function MediaFrame({
  ratio,
  caption,
  captionPosition = "bottom",
  src,
  videoSrc,
  fit = "cover",
  standbyLabel = "CAPTURA EM PRODUÇÃO — EM BREVE",
  title = "Sinal em construção",
  angle = 1,
  className = "",
  onNight = false,
  children,
}: MediaFrameProps) {
  const reduce = reduceMotion();
  const style = ratio
    ? ({ "--frame-ratio": ratio } as CSSProperties)
    : undefined;
  const media = children ? (
    children
  ) : videoSrc ? (
    <video
      src={videoSrc}
      className={`h-full w-full ${fit === "contain" ? "object-contain" : "object-cover"}`}
      muted
      loop
      playsInline
      autoPlay={!reduce}
      controls={reduce}
      preload="none"
      aria-label={title}
    />
  ) : src ? (
    <img
      src={src}
      alt={title}
      className={`h-full w-full ${fit === "contain" ? "object-contain" : "object-cover"}`}
      loading="lazy"
      decoding="async"
    />
  ) : (
    <Standby title={title} label={standbyLabel} angle={angle} />
  );

  return (
    <figure style={style} className={`media-frame group min-w-0 ${className}`}>
      {caption && captionPosition === "top" && (
        <Caption caption={caption} onNight={onNight} />
      )}
      <div
        className={`viewport-bezel ${
          onNight ? "viewport-bezel-on-night" : ""
        } aspect-[var(--frame-ratio)]`}
      >
        {CORNERS.map((corner) => (
          <span
            key={corner}
            aria-hidden
            data-corner={corner}
            className="registration-mark"
          />
        ))}
        <div className="h-full w-full overflow-hidden rounded-[7px]">{media}</div>
      </div>
      {caption && captionPosition === "bottom" && (
        <Caption caption={caption} onNight={onNight} />
      )}
    </figure>
  );
}
