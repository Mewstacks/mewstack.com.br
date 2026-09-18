import { useEffect, useRef } from "react";
import { useLenis } from "lenis/react";
import { X } from "lucide-react";
import type { MediaCaption } from "./MediaFrame";

type LightboxProps = {
  open: boolean;
  src: string;
  alt: string;
  width?: number;
  height?: number;
  caption?: MediaCaption;
  onClose: () => void;
};

/* Ampliação de uma captura de case. <dialog> nativo em showModal: top layer
   acima do pin do Showcase, foco preso, Esc fecha e o foco volta ao gatilho.
   O Lenis para enquanto está aberto — senão a roda rola a página por baixo. */
export default function Lightbox({
  open,
  src,
  alt,
  width,
  height,
  caption,
  onClose,
}: LightboxProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (open && !el.open) {
      el.showModal();
      lenis?.stop();
    } else if (!open && el.open) {
      el.close();
    }
  }, [open, lenis]);

  useEffect(() => {
    if (!open) return;
    return () => lenis?.start();
  }, [open, lenis]);

  return (
    <dialog
      ref={dialog}
      aria-label={alt}
      data-lenis-prevent
      className="lightbox"
      onClose={onClose}
      onClick={(event) => {
        // Clique fora da imagem (no fundo ou nas margens) fecha.
        if (!(event.target as HTMLElement).closest("img, button, .lightbox-caption")) onClose();
      }}
    >
      {open && (
        <div className="lightbox-body">
          <div className="lightbox-scroller">
            <img
              src={src}
              alt={alt}
              width={width}
              height={height}
              className="lightbox-image"
              decoding="async"
            />
          </div>
          {caption && (
            <div className="lightbox-caption mono flex min-w-0 items-center justify-between gap-3 text-[0.68rem] text-paper-on-night-soft sm:text-[0.74rem]">
              <p className="min-w-0 truncate">
                <span className="font-medium text-paper-on-night">{caption.name}</span>
                {caption.detail && <span> · {caption.detail}</span>}
              </p>
              <span className="shrink-0 sm:hidden">arraste para ver →</span>
              {caption.type && (
                <span className="hidden shrink-0 font-medium text-signal-bright sm:inline">
                  {caption.type}
                </span>
              )}
            </div>
          )}
        </div>
      )}
      <button
        type="button"
        onClick={onClose}
        aria-label="Fechar imagem ampliada"
        className="lightbox-close"
      >
        <X aria-hidden size={20} strokeWidth={1.75} />
      </button>
    </dialog>
  );
}
