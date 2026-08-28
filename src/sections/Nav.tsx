import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Logo from "../components/Logo";
import { HEADER_CHAPTERS } from "../lib/chapters";
import { useChapterTheme } from "../lib/useChapterTheme";

const LINKS = HEADER_CHAPTERS.map((chapter, index) => ({
  id: chapter.id,
  label: chapter.label,
  index: String(index + 1).padStart(2, "0"),
}));

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const dark = useChapterTheme() === "dark" && !open;
  const onHome = useLocation().pathname === "/";

  /* The chapters only exist on the one-pager. On a service page the same nav
     has to leave the page first, so the anchor becomes a root-relative URL —
     RouteChrome scrolls to the hash once the home route has mounted. On home
     the bare hash is kept so LenisAnchors can animate the scroll. */
  const anchor = (id: string) => (onHome ? `#${id}` : `/#${id}`);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 20);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const surface = open
    ? "border-line bg-paper-high"
    : dark
      ? scrolled
        ? "border-night-line bg-night/85 backdrop-blur-xl"
        : "border-transparent bg-night/0"
      : scrolled
        ? "border-line bg-paper-high/85 backdrop-blur-xl"
        : "border-transparent bg-paper/0";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[var(--z-nav)] h-16 border-b transition-[background-color,border-color,backdrop-filter] duration-300 ${surface}`}
    >
      <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between px-5 sm:px-8">
        <a
          href={onHome ? "#top" : "/"}
          aria-label="MewStack, início"
          className="flex min-h-11 items-center"
          onClick={() => setOpen(false)}
        >
          <Logo
            variant={dark ? "horizontalDark" : "horizontal"}
            priority
            alt="MewStack"
            className="h-8 w-auto"
          />
        </a>

        <nav aria-label="Capítulos" className="hidden items-center gap-5 lg:flex xl:gap-7">
          {LINKS.map((link) => (
            <a
              key={link.id}
              href={anchor(link.id)}
              className={`group relative flex min-h-11 items-center gap-1.5 text-[0.78rem] font-medium ${
                dark ? "text-paper-on-night-soft" : "text-ink-soft"
              }`}
            >
              <span
                className={`mono text-[0.62rem] ${
                  dark ? "text-signal-bright" : "text-ink-faint"
                }`}
              >
                {link.index}
              </span>
              <span>{link.label}</span>
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-1 h-px origin-left scale-x-0 bg-signal transition-transform duration-200 group-hover:scale-x-100"
              />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={anchor("contato")}
            className={`btn hidden text-sm sm:inline-flex ${
              dark ? "btn-primary btn-inverse" : "btn-ghost"
            }`}
          >
            Fale com a gente
          </a>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            onClick={() => setOpen((value) => !value)}
            className={`flex h-11 w-11 items-center justify-center rounded-md border lg:hidden ${
              dark
                ? "border-night-line text-paper-on-night"
                : "border-line-strong text-ink"
            }`}
          >
            <span className="relative h-4 w-5">
              <span
                className={`absolute left-0 top-0.5 h-px w-5 bg-current transition-transform ${
                  open ? "translate-y-[6px] rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-[7px] h-px w-5 bg-current transition-opacity ${
                  open ? "opacity-0" : ""
                }`}
              />
              <span
                className={`absolute bottom-0.5 left-0 h-px w-5 bg-current transition-transform ${
                  open ? "-translate-y-[6px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      <nav
        id="mobile-menu"
        aria-label="Menu móvel"
        className={`border-b border-line bg-paper-high transition-[max-height,opacity] duration-300 lg:hidden ${
          open ? "max-h-[34rem] opacity-100" : "pointer-events-none max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <ul className="mx-auto max-w-[1200px] px-5 sm:px-8">
          {LINKS.map((link) => (
            <li key={link.id} className="border-b border-line last:border-0">
              <a
                href={anchor(link.id)}
                onClick={() => setOpen(false)}
                className="flex min-h-14 items-center gap-4 text-ink"
              >
                <span className="mono text-xs text-ink-faint">{link.index}</span>
                <span className="font-display text-xl">{link.label}</span>
              </a>
            </li>
          ))}
          <li className="py-4">
            <a
              href={anchor("contato")}
              onClick={() => setOpen(false)}
              className="btn btn-primary w-full"
            >
              Fale com a gente
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
