type Variant = "horizontal" | "stacked" | "icon" | "white" | "vector";

const SRC: Record<Variant, string> = {
  horizontal: "/brand/logo-horizontal.png",
  stacked: "/brand/logo-stacked.png",
  icon: "/brand/icon.png",
  white: "/brand/logo-white.png",
  vector: "/brand/mascot.svg",
};

type LogoProps = {
  variant?: Variant;
  className?: string;
  alt?: string;
  priority?: boolean;
};

/** Official MewStack marks (the headset-cat). */
export default function Logo({
  variant = "horizontal",
  className,
  alt = "MewStack",
  priority = false,
}: LogoProps) {
  return (
    <img
      src={SRC[variant]}
      alt={alt}
      className={className}
      draggable={false}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
    />
  );
}
