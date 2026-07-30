// Screenshot harness: captura a linha rosa em posições de scroll.
// Uso: node output/shot.mjs <outdir> <width> <height> <label:scrollY ...>
// scrollY = pixels absolutos, ou "frac:0.25" (fração do documento), ou "hero" (topo).
import { chromium } from "playwright-core";
import fs from "node:fs";

const [, , outdir = "output/shots", w = "1440", h = "900", ...specs] = process.argv;
fs.mkdirSync(outdir, { recursive: true });

const browser = await chromium.launch({
  executablePath:
    process.env.HOME +
    "/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell",
});
const page = await browser.newPage({
  viewport: { width: Number(w), height: Number(h) },
  deviceScaleFactor: 1,
});
await page.goto("http://127.0.0.1:5173/", { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
// espera a descida do hero terminar (delay .4 + 3.2s)
await page.waitForTimeout(4200);

const scrollTo = async (y) => {
  await page.evaluate((target) => {
    const lenis = window.__lenis;
    if (lenis) lenis.scrollTo(target, { immediate: true });
    else window.scrollTo(0, target);
  }, y);
  // deixa o scrub (0.3s) + lenis assentar
  await page.waitForTimeout(900);
};

for (const spec of specs.length ? specs : ["hero"]) {
  const [label, raw] = spec.includes(":") ? spec.split(":") : [spec, spec];
  let y = 0;
  if (raw === "hero") y = 0;
  else if (label === "frac") {
    y = await page.evaluate(
      (f) => (document.documentElement.scrollHeight - innerHeight) * f,
      Number(raw),
    );
  } else if (label === "y") y = Number(raw);
  await scrollTo(y);
  await page.screenshot({ path: `${outdir}/${label}-${raw}.png` });
  console.log("shot", label, raw, "at y=", y);
}
await browser.close();
