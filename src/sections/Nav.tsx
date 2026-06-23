import { useEffect, useState } from "react";
import Logo from "../components/Logo";

const LINKS = [
  { href: "#servicos", label: "Serviços" },
  { href: "#projetos", label: "Projetos" },
  { href: "#processo", label: "Processo" },
  { href: "#estudio", label: "Estúdio" },
];

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
      className="fixed inset-x-0 top-0 transition-[background,box-shadow,backdrop-filter] duration-500"
      style={{ zIndex: "var(--z-nav)" }}
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 sm:px-8 ${
          solid ? "bg-cream/85 shadow-[0_1px_0_var(--color-cream-line)] backdrop-blur-md" : ""
        }`}
      >
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
            className="group hidden items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-cream transition-transform duration-300 ease-[var(--ease-quart)] hover:-translate-y-0.5 sm:inline-flex"
          >
            <span className="live-dot" aria-hidden />
            Falar com a gente
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
              className="flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 font-medium text-cream"
            >
              <span className="live-dot" aria-hidden />
              Falar com a gente
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
