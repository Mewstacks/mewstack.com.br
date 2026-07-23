import { forwardRef, type SVGProps } from "react";

type DataAttributes = {
  [key: `data-${string}`]: string | number | boolean | undefined;
};

export type SignalLineProps = {
  path: string;
  viewBox: string;
  className?: string;
  strokeWidth?: number;
  pathProps?: Omit<
    SVGProps<SVGPathElement>,
    "d" | "fill" | "stroke" | "strokeWidth" | "ref"
  > &
    DataAttributes;
};

const SignalLine = forwardRef<SVGPathElement, SignalLineProps>(function SignalLine(
  {
    path,
    viewBox,
    className = "",
    strokeWidth = 1.5,
    pathProps,
  },
  ref,
) {
  return (
    <svg
      aria-hidden
      viewBox={viewBox}
      preserveAspectRatio="none"
      className={className}
    >
      <path
        {...pathProps}
        ref={ref}
        d={path}
        fill="none"
        stroke="var(--color-signal)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
});

export default SignalLine;
