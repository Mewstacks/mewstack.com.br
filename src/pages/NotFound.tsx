import { useLayoutEffect } from "react";
import { Link } from "react-router-dom";

/* Client-side counterpart to public/404.html. A direct hit on a missing path is
   answered by Apache with the static file and a real 404 status; this only runs
   when the router lands here after an in-page navigation. */
export default function NotFound() {
  useLayoutEffect(() => {
    document.title = "Página não encontrada — MewStack";
    let robots = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement("meta");
      robots.name = "robots";
      document.head.appendChild(robots);
    }
    robots.content = "noindex";
    return () => robots?.remove();
  }, []);

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-clip bg-paper">
      <div className="relative z-[var(--z-content)] mx-auto w-full max-w-[1200px] px-5 py-32 sm:px-8">
        <p className="section-index mb-7">
          <span>404</span>
        </p>
        <h1 className="max-w-[14ch] text-[clamp(2.2rem,5.6vw,4.4rem)] leading-[1.02] tracking-[-0.02em] text-ink">
          Essa página não existe.
        </h1>
        <Link to="/" className="btn btn-primary mt-10">
          Voltar ao início
        </Link>
      </div>
    </section>
  );
}
