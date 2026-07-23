import { useRef } from "react";
import { SignalScene } from "../components/SignalJourney";
import { useChapter } from "../lib/useChapter";

type Member = {
  name: string;
  role: string;
  photo?: string;
  objectPosition?: string;
  bio: string;
  skills: string[];
};

const TEAM: Member[] = [
  {
    name: "Germano Argenta Dal Prá",
    role: "CEO & Data Engineer",
    photo: "/brand/founder.png",
    objectPosition: "50% 100%",
    bio: "Transforma dados bagunçados em pipelines, serviços e sistemas que sobrevivem ao mundo real da operação.",
    skills: ["Python", "Backend", "ETL", "Automação"],
  },
  {
    name: "Pedro Henrique Gasparin Machado",
    role: "Full-Stack Developer",
    photo: "/brand/team-dev.jpeg",
    objectPosition: "68% 32%",
    bio: "Leva o produto da arquitetura à tela, conectando APIs, interfaces rápidas e acabamento de alto nível.",
    skills: ["Django", "React", "TypeScript", "UI"],
  },
  {
    name: "Vinicius Alves Motta",
    role: "DevOps & Support Manager",
    photo: "/brand/team-devops.jpeg",
    objectPosition: "50% 30%",
    bio: "Mantém deploy, infraestrutura e suporte funcionando para o sistema continuar confiável depois da entrega.",
    skills: ["DevOps", "Docker", "Cloud", "Suporte"],
  },
  {
    name: "Lorenzo Facchin",
    role: "Comercial & Social Media",
    photo: "/brand/team-sales.jpeg",
    objectPosition: "50% 30%",
    bio: "Faz a ponte entre problema, produto e conversa comercial sem transformar tecnologia em jargão.",
    skills: ["Vendas B2B", "Conteúdo", "Relacionamento"],
  },
];

export default function About() {
  const root = useRef<HTMLElement>(null);
  useChapter(root);

  return (
    <section
      ref={root}
      id="estudio"
      className="relative scroll-mt-24 overflow-clip border-y border-line bg-paper-rose"
    >
      <div aria-hidden className="paper-vignette pointer-events-none absolute inset-0" />
      <SignalScene scene="about" above />
      <div className="relative z-[var(--z-content)] mx-auto max-w-[1200px] px-5 py-20 sm:px-8 lg:py-28">
        <div className="grid gap-6 lg:grid-cols-12">
          <p data-reveal className="section-index lg:col-span-3">
            <span>06</span>
            <span>quem opera</span>
          </p>
          <div className="lg:col-span-8 lg:col-start-5">
            <h2 data-reveal-title className="max-w-[13ch] text-h2 leading-[1.04]">
              Produto bom tem gente responsável do outro lado.
            </h2>
            <p data-reveal className="mt-5 max-w-[56ch] text-ink-soft">
              Um time pequeno, direto e próximo do trabalho — da primeira conversa
              ao sistema rodando em produção.
            </p>
          </div>
        </div>

        <div
          data-signal-anchor="about-signal"
          className="mt-12 grid gap-x-5 gap-y-12 md:grid-cols-2 lg:grid-cols-4"
        >
          {TEAM.map((member) => (
            <article key={member.name} data-reveal className="min-w-0">
              <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-line-strong bg-paper-lilac">
                {member.photo ? (
                  <>
                    <img
                      src={member.photo}
                      alt={`Retrato de ${member.name}`}
                      style={{ objectPosition: member.objectPosition }}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 bg-paper-rose/15 mix-blend-multiply"
                    />
                  </>
                ) : (
                  <span className="flex h-full items-center justify-center font-display text-6xl text-ink-faint">
                    {member.name
                      .split(" ")
                      .slice(0, 2)
                      .map((part) => part[0])
                      .join("")}
                  </span>
                )}
              </div>
              <h3 className="mt-5 text-h3 leading-tight text-ink">{member.name}</h3>
              <p className="mono mt-2 text-[0.68rem] font-medium text-ink">
                {member.role}
              </p>
              <p className="mt-4 text-[0.94rem] leading-relaxed text-ink-soft">
                {member.bio}
              </p>
              <p className="mono mt-4 text-[0.62rem] leading-relaxed text-ink-faint">
                {member.skills.join(" · ")}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
