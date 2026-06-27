import { useEffect, useRef } from "react";
import { MOTION, reduceMotion } from "../lib/motion";

/* ── Cursor: a soft pink ring that trails the pointer with easing and swells
   over interactive targets. Desktop + fine-pointer only, and it never hides the
   native cursor (it sits on top, pointer-events:none) — purely decorative depth.
   Driven by a single rAF writing `transform`, so it costs no layout. CSS hides
   it on coarse pointers and under prefers-reduced-motion. */
export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = ref.current;
    if (!dot) return;
    if (reduceMotion()) return;
    if (typeof window.matchMedia === "function" && !window.matchMedia("(pointer: fine)").matches)
      return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;
    let raf = 0;
    let hover = false;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      dot.dataset.visible = "true";
    };
    const onOver = (e: PointerEvent) => {
      const t = (e.target as HTMLElement)?.closest?.(
        'a, button, [role="tab"], [role="button"], input, textarea, label, summary',
      );
      const inConsole = (e.target as HTMLElement)?.closest?.('.console');
      hover = !!t && !inConsole;
      dot.dataset.hover = hover ? "true" : "false";
    };
    const onLeave = () => {
      dot.dataset.visible = "false";
    };

    const loop = () => {
      x += (tx - x) * MOTION.cursorLerp;
      y += (ty - y) * MOTION.cursorLerp;
      const s = hover ? MOTION.cursorHoverScale : 1;
      dot.style.transform = `translate(${x}px, ${y}px) scale(${s})`;
      raf = requestAnimationFrame(loop);
    };
    loop();

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <div ref={ref} className="cursor-dot" aria-hidden />;
}
