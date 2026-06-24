import { ReactLenis } from "lenis/react";
import Nav from "./sections/Nav";
import Hero from "./sections/Hero";
import CodeLab from "./sections/CodeLab";
import Pillars from "./sections/Pillars";
import Capabilities from "./sections/Capabilities";
import Projects from "./sections/Projects";
import Process from "./sections/Process";
import About from "./sections/About";
import Contact from "./sections/Contact";

export default function App() {
  return (
    <ReactLenis
      root
      options={{ lerp: 0.09, duration: 1.1, smoothWheel: true, touchMultiplier: 1.5 }}
    >
      <a
        href="#conteudo"
        className="sr-only z-[var(--z-overlay)] focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:rounded-full focus:bg-ink focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-cream"
      >
        Pular para o conteúdo
      </a>
      <Nav />
      <main id="conteudo">
        <Hero />
        <Pillars />
        <CodeLab />
        <Capabilities />
        <Process />
        <Projects />
        <About />
        <Contact />
      </main>
    </ReactLenis>
  );
}
