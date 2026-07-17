import { useSceneBackground } from "../lib/useSceneBackground";

export default function SceneBackground() {
  useSceneBackground();

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <div data-scene-tone="paper" className="absolute inset-0 bg-paper opacity-100" />
      <div data-scene-tone="paper-lilac" className="absolute inset-0 bg-paper-lilac opacity-0" />
      <div data-scene-tone="paper-rose" className="absolute inset-0 bg-paper-rose opacity-0" />
      <div data-scene-tone="night" className="absolute inset-0 bg-night opacity-0" />
      <div className="grain absolute inset-0 opacity-[0.025]" />
    </div>
  );
}
