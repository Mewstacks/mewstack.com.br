import Hero from "../sections/Hero";
import Problem from "../sections/Problem";
import Capabilities from "../sections/Capabilities";
import Process from "../sections/Process";
import CodeLab from "../sections/CodeLab";
import Showcase from "../sections/Showcase";
import About from "../sections/About";
import Contact from "../sections/Contact";

/* The one-pager, unchanged. Chapter order is fixed and the signal journey is
   built around it — see AGENTS.md. */
export default function Home() {
  return (
    <>
      <Hero />
      <Problem />
      <Capabilities />
      <Process />
      <CodeLab />
      <Showcase />
      <About />
      <Contact />
    </>
  );
}
