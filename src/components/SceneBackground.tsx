import { useSceneBackground } from "../lib/useSceneBackground";

/* The page's reactive backdrop: a charcoal layer stacked over a cream base,
   whose opacity is crossfaded by `useSceneBackground` as dark chapters pass.
   Fixed and behind all content (-z-10); purely decorative (aria-hidden). */
export default function SceneBackground() {
  useSceneBackground();
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-cream" />
      <div data-scene-overlay className="absolute inset-0 bg-night opacity-0" />
    </div>
  );
}
