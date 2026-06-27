import { useEffect, useState } from "react";
import Logo from "../components/Logo";
import { HEADER_CHAPTERS } from "../lib/chapters";

const LINKS = HEADER_CHAPTERS.map((c) => ({ href: `#${c.id}`, label: c.label }));

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 border-b transition-[background-color,box-shadow,border-color,backdrop-filter] duration-500 ease-[var(--ease-quart)] ${
        solid
          ? "border-cream-line bg-cream/80 shadow-[0_8px_30px_-12px_rgba(40,30,40,0.18)] backdrop-blur-xl backdrop-saturate-150"
          : "border-transparent bg-cream/0 backdrop-blur-[2px]"
      }`}
      style={{ zIndex: "var(--z-nav)" }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <a href="#top" className="flex items-center" aria-label="MewStack, início" onClick={() => setOpen(false)}>
          <Logo variant="horizontal" priority className="h-8 w-auto sm:h-9" alt="MewStack" />
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Seções">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-ink-soft transition-colors hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="#contato"
            className="btn btn-primary hidden text-sm sm:inline-flex"
          >
            Falar com a gente
            <span className="arrow" aria-hidden>→</span>
          </a>

          {/* mobile menu toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-cream-line text-ink md:hidden"
          >
            <span className="relative block h-3.5 w-5">
              <span
                className={`absolute left-0 block h-0.5 w-5 bg-ink transition-transform duration-300 ${open ? "top-1.5 rotate-45" : "top-0"}`}
              />
              <span
                className={`absolute left-0 top-1.5 block h-0.5 w-5 bg-ink transition-opacity duration-200 ${open ? "opacity-0" : "opacity-100"}`}
              />
              <span
                className={`absolute left-0 block h-0.5 w-5 bg-ink transition-transform duration-300 ${open ? "top-1.5 -rotate-45" : "top-3"}`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* mobile panel */}
      <nav
        id="mobile-menu"
        aria-label="Seções"
        className={`mx-3 origin-top overflow-hidden rounded-2xl border border-cream-line bg-cream-deep shadow-[0_20px_40px_-24px_rgba(40,30,40,0.5)] transition-[max-height,opacity] duration-300 ease-[var(--ease-quart)] md:hidden ${
          open ? "max-h-80 opacity-100" : "pointer-events-none max-h-0 opacity-0"
        }`}
      >
        <ul className="flex flex-col p-2">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-4 py-3 font-display text-lg font-medium text-ink transition-colors hover:bg-cream"
              >
                {l.label}
              </a>
            </li>
          ))}
          <li className="p-2">
            <a
              href="#contato"
              onClick={() => setOpen(false)}
              className="btn btn-primary w-full"
            >
              Falar com a gente
              <span className="arrow" aria-hidden>→</span>
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
