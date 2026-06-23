# Design

## Theme

Bold & playful brand one-pager. Clean light world (official #F2F2F2) with charcoal "machine
room" sections punched in for rhythm. Hot pink is the live wire through both. The headset-cat
mascot (official logo art) is the recurring character. Color strategy: **Committed** — light +
charcoal carry large surfaces, hot pink is the high-energy accent.

Official palette (source: `cor da mew.jpeg`): **#FF7BAC pink · #262626 charcoal · #F2F2F2
light**. Token names stay `--color-cream*` for legacy reasons but hold the official light grey,
NOT a butter cream.

## Color (OKLCH)

- `--color-cream` body bg — `oklch(0.953 0 0)` (#F2F2F2 official light)
- `--color-cream-deep` raised white surface — `oklch(1 0 0)`; `--color-cream-line` `oklch(0.875 0 0)`
- `--color-ink` / `--color-night` text + charcoal sections — `oklch(0.268 0 0)` (#262626)
- `--color-ink-soft` secondary text on light — `oklch(0.44 0 0)` (≥4.5:1 on #F2F2F2)
- `--color-pink` brand hot pink, fills — `oklch(0.745 0.155 356)` (#FF7BAC)
- `--color-pink-bright` pink text on charcoal (AA large) — `oklch(0.80 0.14 354)`
- `--color-pink-deep` accessible pink text on light (large/semibold) — `oklch(0.555 0.205 356)`
- `--color-paper` text on charcoal — `oklch(0.953 0 0)`; `--color-paper-soft` `oklch(0.78 0 0)`

Contrast rules: ink-on-light ✔, paper-on-charcoal ✔. Brand #FF7BAC is NEVER text on light
(fails AA — use `--color-pink-deep`); `--color-pink-bright` for pink text on charcoal only.

## Typography

- Display: **Clash Display** (Fontshare) 600/700 — chunky, slightly idiosyncratic geometric;
  matches the brand's heavy wordmark, reads playful-bold not corporate.
- Body/UI: **Satoshi** (Fontshare) 400/500 — clean humanist neutral, contrast against the
  geometric display.
- Pairing axis: geometric-display vs humanist-body (deliberate, not two lookalike sans).
- Scale: fluid `clamp()`, ratio ≥1.25. Hero ≤ ~6rem. Display letter-spacing -0.03 to -0.04em.

## Components / Motifs

- Headset-cat mascot: the OFFICIAL logo PNGs (`public/brand/`: logo-horizontal, logo-stacked,
  icon, logo-white) via `Logo.tsx`. Favicon = `icon-profile.png`. White variant for charcoal
  sections. (An earlier hand-drawn SVG mascot was dropped in favor of the real marks.)
- "Machine" motifs: animated data pipeline, monospace-flavored data chips/tickers (sparingly,
  justified — this studio literally processes data), counters.
- Pink "live wire" hairlines and a pulsing status dot as a recurring brand tell.

## Layout

- Sticky slim nav. Single long scroll: Hero → Capabilities → Process (the machine) → Data
  manifesto (charcoal) → About Germano → Contact → Footer.
- Fluid `clamp()` spacing, asymmetric where it earns emphasis. No identical card grids.

## Motion

- Orchestrated hero entrance; mascot float; pink wire draw-in; staggered capability reveals;
  counter/ticker motion in Process. All transform/opacity/clip-path, GPU-friendly.
- Full `prefers-reduced-motion` fallback (instant/crossfade, no infinite loops).
