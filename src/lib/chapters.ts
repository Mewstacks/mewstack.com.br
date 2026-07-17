export type ChapterTheme = "light" | "dark";
export type ChapterTone = "paper" | "paper-lilac" | "paper-rose" | "night";

export type Chapter = {
  id: string;
  label: string;
  theme: ChapterTheme;
  tone: ChapterTone;
  nav: boolean;
  header: boolean;
};

export const CHAPTERS: readonly Chapter[] = [
  { id: "top", label: "Início", theme: "light", tone: "paper", nav: false, header: false },
  { id: "problema", label: "Problema", theme: "light", tone: "paper-rose", nav: true, header: true },
  { id: "servicos", label: "Serviços", theme: "light", tone: "paper", nav: true, header: true },
  { id: "processo", label: "Processo", theme: "light", tone: "paper-lilac", nav: true, header: true },
  { id: "rode", label: "Lab", theme: "dark", tone: "night", nav: true, header: true },
  { id: "exemplos", label: "Cases", theme: "light", tone: "paper", nav: true, header: true },
  { id: "estudio", label: "Equipe", theme: "light", tone: "paper-rose", nav: true, header: false },
  { id: "contato", label: "Contato", theme: "dark", tone: "night", nav: true, header: false },
] as const;

export const NAV_CHAPTERS = CHAPTERS.filter((chapter) => chapter.nav);
export const HEADER_CHAPTERS = CHAPTERS.filter((chapter) => chapter.header);
