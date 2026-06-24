import { ArrowRight, FileText, MessageCircle, Database, FileSpreadsheet } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Reveal from "../components/Reveal";

/* Honest, concrete input → output transformations — the tangible thing MewStack
   does, without claiming a delivered portfolio. Light, restrained surfaces:
   no fake years/tags, no dark card-wall, no mascot watermark. */
type Shift = {
  icon: LucideIcon;
  from: string;
  to: string;
};

const SHIFTS: Shift[] = [
  {
    icon: FileText,
    from: "Pasta de PDFs de nota fiscal",
    to: "Painel de impostos que se atualiza sozinho, todo dia",
  },
  {
    icon: MessageCircle,
    from: "Pedidos soltos no WhatsApp",
    to: "Tudo organizado direto no seu CRM, sem digitar",
  },
  {
    icon: Database,
    from: "Export de sistema legado em CSV",
    to: "Base limpa e estruturada, pronta pra consultar",
  },
  {
    icon: FileSpreadsheet,
    from: "Planilhas de comissão espalhadas",
    to: "Um número consolidado e conferido sozinho",
  },
];

export default function Projects() {
  return (
    <section id="projetos" className="mx-auto max-w-5xl scroll-mt-24 px-5 py-16 sm:px-8 lg:py-24">
      <Reveal className="max-w-2xl">
        <p className="eyebrow mb-6">o que muda</p>
        <h2 className="font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.04] font-semibold tracking-[-0.035em]">
          O que entra bagunçado, sai como decisão.
        </h2>
        <p className="mt-5 max-w-[48ch] text-ink-soft">
          O tipo de transformação que a MewStack monta — fonte crua de um lado,
          rotina rodando sozinha do outro.
        </p>
      </Reveal>

      <ul className="mt-12 grid gap-3 sm:grid-cols-2">
        {SHIFTS.map((s, i) => {
          const Icon = s.icon;
          return (
            <Reveal as="li" key={s.from} delay={i * 0.07}>
              <article className="card group h-full p-6 transition-[transform,border-color] duration-300 ease-[var(--ease-quart)] hover:-translate-y-0.5 hover:border-pink/30 sm:p-7">
                <div className="flex items-start gap-4">
                  <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-ink/8 bg-cream text-ink-soft transition-colors duration-300 group-hover:text-pink-deep">
                    <Icon className="h-4 w-4" strokeWidth={1.8} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[0.95rem] text-ink-soft">{s.from}</p>
                    <div className="my-2.5 flex items-center gap-2 text-pink-deep">
                      <ArrowRight className="h-4 w-4 shrink-0" strokeWidth={2} />
                      <span className="h-px flex-1 bg-cream-line" />
                    </div>
                    <p className="font-display text-[1.05rem] font-semibold leading-snug tracking-[-0.01em] text-ink">
                      {s.to}
                    </p>
                  </div>
                </div>
              </article>
            </Reveal>
          );
        })}
      </ul>

      <Reveal delay={0.1} className="mt-6 text-sm text-ink-soft">
        Quer ver a sua rotina aqui?{" "}
        <a href="#contato" className="font-medium text-pink-deep underline underline-offset-4">
          Vamos conversar
        </a>
        .
      </Reveal>
    </section>
  );
}
