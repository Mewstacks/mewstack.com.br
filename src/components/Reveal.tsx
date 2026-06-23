import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode, CSSProperties } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "section" | "li" | "span";
  style?: CSSProperties;
};

/**
 * Entrance that plays once on mount and always settles VISIBLE. Resting state is
 * visible (reduced motion renders plain, animations only ease toward the visible
 * state), so content never gets stranded behind a transition that didn't fire.
 */
export default function Reveal({
  children,
  className,
  delay = 0,
  y = 22,
  as = "div",
  style,
}: RevealProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    const Tag = as;
    return (
      <Tag className={className} style={style}>
        {children}
      </Tag>
    );
  }

  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </MotionTag>
  );
}
