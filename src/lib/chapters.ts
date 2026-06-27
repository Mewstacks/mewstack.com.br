/* ============================================================
   Chapters — single source of truth for the page's narrative.
   Consumed by Nav (desktop + mobile menu) and ChapterNav (the
   side index). Keeping ids/labels here means a section can be
   added/reordered in one place and the navigation follows.

   - id      → the section's DOM id (anchor target, no `#`).
   - label   → human label shown in nav.
   - theme   → surface tone of the section; lets the side rail flip
               its own contrast when sitting over a dark chapter.
   - nav     → appears as a dot in the side chapter rail (Hero is the
               implicit "top", so it's excluded from the rail).
   - header  → appears in the compact top header nav (kept concise;
               Contact lives as the CTA button, not a header link).
   ============================================================ */
export type ChapterTheme = "light" | "dark";

export type Chapter = {
  id: string;
  label: string;
  theme: ChapterTheme;
  nav: boolean;
  header: boolean;
};

export const CHAPTERS: readonly Chapter[] = [
  { id: "top", label: "Início", theme: "light", nav: false, header: false },
  { id: "servicos", label: "Serviços", theme: "light", nav: true, header: true },
  { id: "rode", label: "Rode", theme: "light", nav: true, header: false },
  { id: "processo", label: "Processo", theme: "light", nav: true, header: true },
  { id: "estudio", label: "Estúdio", theme: "light", nav: true, header: true },
  { id: "exemplos", label: "Exemplos", theme: "light", nav: true, header: true },
  { id: "numeros", label: "Números", theme: "light", nav: true, header: false },
  { id: "contato", label: "Contato", theme: "dark", nav: true, header: false },
] as const;

/** Chapters shown as dots in the side chapter rail. */
export const NAV_CHAPTERS = CHAPTERS.filter((c) => c.nav);

/** Chapters shown as links in the compact top header. */
export const HEADER_CHAPTERS = CHAPTERS.filter((c) => c.header);
