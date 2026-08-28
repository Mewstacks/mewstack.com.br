/* Re-encodes raster assets to WebP through Chromium's own encoder, so the repo
   gains no image-tooling dependency. The site already ships oklch() colours,
   which browsers adopted later than WebP — a <picture> fallback would be dead
   weight. */
import { chromium } from "playwright";
import { readFile, writeFile, stat } from "node:fs/promises";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const pub = join(fileURLToPath(new URL("..", import.meta.url)), "public");
const TARGETS = [
  ["media/cases/plataforma-tributaria.png", 0.82],
  ["media/cases/distribuicao-multicanal.png", 0.82],
  ["media/cases/operacao-fiscal.png", 0.82],
  ["media/hero-signal-poster.jpg", 0.8],
  ["brand/founder-v2.jpeg", 0.82],
  ["brand/team-dev.jpeg", 0.82],
  ["brand/team-devops-v4.jpeg", 0.82],
  ["brand/logo-white.png", 0.9],
];
const MIME = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg" };

const browser = await chromium.launch();
const page = await browser.newPage();
let before = 0, after = 0;

for (const [rel, quality] of TARGETS) {
  const src = join(pub, rel);
  const buf = await readFile(src);
  const dataUrl = `data:${MIME[extname(rel)]};base64,${buf.toString("base64")}`;

  const out = await page.evaluate(
    async ([url, q]) => {
      const img = new Image();
      img.src = url;
      await img.decode();
      const c = document.createElement("canvas");
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      c.getContext("2d").drawImage(img, 0, 0);
      return {
        w: img.naturalWidth,
        h: img.naturalHeight,
        data: c.toDataURL("image/webp", q).split(",")[1],
      };
    },
    [dataUrl, quality],
  );

  const webp = Buffer.from(out.data, "base64");
  const dest = src.replace(/\.(png|jpe?g)$/i, ".webp");
  await writeFile(dest, webp);
  before += buf.length;
  after += webp.length;
  const pct = Math.round((1 - webp.length / buf.length) * 100);
  console.log(
    `${rel.padEnd(40)} ${out.w}x${out.h}  ${String(Math.round(buf.length / 1024)).padStart(5)} KB -> ${String(Math.round(webp.length / 1024)).padStart(4)} KB  (-${pct}%)`,
  );
}

await browser.close();
console.log(
  `\ntotal ${Math.round(before / 1024)} KB -> ${Math.round(after / 1024)} KB  (-${Math.round((1 - after / before) * 100)}%)`,
);
