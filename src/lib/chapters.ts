/* ============================================================
   Chapters — single source of truth for the page's narrative.
   Consumed by Nav (header + mobile menu) and the reactive scroll
   background (useSceneBackground reads each chapter's `theme` to
   crossfade the page tone). Keeping ids/labels/themes here means a
   section can be added/reordered in one place and nav + tone follow.

   - id      → the section's DOM id (anchor target, no `#`).
   - label   → human label shown in nav.
   - theme   → surface tone of the section ("light" cream | "dark"
               charcoal). Drives the reactive background crossfade and
               lets the nav flip its contrast over a dark chapter.
   - nav     → eligible for a dot-style chapter index (Hero is the
               implicit "top", so it's excluded).
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
  { id: "rode", label: "Rode", theme: "dark", nav: true, header: false },
  { id: "processo", label: "Processo", theme: "light", nav: true, header: true },
  { id: "estudio", label: "Estúdio", theme: "light", nav: true, header: true },
  { id: "exemplos", label: "Exemplos", theme: "light", nav: true, header: true },
  { id: "contato", label: "Contato", theme: "dark", nav: true, header: false },
] as const;

/** Chapters shown as dots in the side chapter rail. */
export const NAV_CHAPTERS = CHAPTERS.filter((c) => c.nav);

/** Chapters shown as links in the compact top header. */
export const HEADER_CHAPTERS = CHAPTERS.filter((c) => c.header);
