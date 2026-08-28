/* Generates the static brand assets the <head> references but the repo never had:
 * the social share card, a real favicon.ico (so /favicon.ico stops returning the
 * SPA's HTML), and a right-sized apple-touch-icon. Run on demand, not per build —
 * the outputs are committed. */
import { chromium } from "playwright";
import { readFile, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const pub = join(root, "public");

/* Pages built with setContent() sit on an opaque origin and are refused
   file:// subresources, so every asset is inlined instead of linked. */
const MIME = { ".png": "image/png", ".woff2": "font/woff2", ".jpg": "image/jpeg" };
const asset = async (p) =>
  `data:${MIME[extname(p)]};base64,${(await readFile(join(pub, p))).toString("base64")}`;

const OG_HTML = `
<style>
  @font-face {
    font-family: "Fraunces";
    src: url("${await asset("fonts/fraunces-variable.woff2")}") format("woff2");
    font-weight: 100 900;
  }
  @font-face {
    font-family: "Fraunces";
    src: url("${await asset("fonts/fraunces-variable-italic.woff2")}") format("woff2");
    font-weight: 100 900;
    font-style: italic;
  }
  @font-face {
    font-family: "Geist Mono";
    src: url("${await asset("fonts/geist-mono-variable.woff2")}") format("woff2");
    font-weight: 100 900;
  }
  * { margin: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px;
    background: oklch(0.215 0.022 290);
    color: oklch(0.955 0.008 340);
    font-family: "Fraunces", Georgia, serif;
    display: flex; flex-direction: column; justify-content: space-between;
    padding: 68px 76px;
  }
  .frame {
    position: absolute; inset: 34px;
    border: 1px solid oklch(0.96 0.012 320 / 0.13);
    border-radius: 10px;
  }
  img { align-self: flex-start; height: 56px; width: auto; }
  h1 {
    font-size: 82px; line-height: 1.06; letter-spacing: -0.022em;
    font-weight: 500;
  }
  em { display: block; font-style: italic; color: oklch(0.8 0.14 354); }
  .foot {
    display: flex; justify-content: space-between; align-items: baseline;
    font-family: "Geist Mono", monospace; font-size: 20px;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: oklch(0.775 0.012 330);
  }
  .foot b { color: oklch(0.8 0.14 354); font-weight: 500; }
</style>
<div class="frame"></div>
<img src="${await asset("brand/logo-horizontal-dark.png")}" />
<h1>Seus dados já sabem, <em>a gente revela.</em></h1>
<div class="foot">
  <span>Software · Automações · Dados</span>
  <b>mewstack.com.br</b>
</div>
`;

/* Renders one <img> at an exact pixel size and screenshots it — a resizer that
   costs no extra dependency, since Playwright is already here for prerendering. */
const iconHtml = async (size, background) => `
<style>
  * { margin: 0 }
  body { background: ${background} }
  .pad {
    width: ${size}px; height: ${size}px;
    display: flex; align-items: center; justify-content: center;
    padding: ${Math.round(size * 0.06)}px;
    box-sizing: border-box;
  }
  /* brand/icon.png is 1773x1365 — contain, never a forced square, or the
     mascot comes out squashed by 30%. */
  img { max-width: 100%; max-height: 100%; object-fit: contain }
</style>
<div class="pad"><img src="${await asset("brand/icon.png")}" /></div>
`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });

await page.setContent(OG_HTML);
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(200);
await page.screenshot({
  path: join(pub, "og.jpg"),
  type: "jpeg",
  quality: 88,
  clip: { x: 0, y: 0, width: 1200, height: 630 },
});

const shot = async (size, background) => {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(await iconHtml(size, background ?? "transparent"));
  await page.waitForTimeout(100);
  return page.locator(".pad").screenshot({
    type: "png",
    omitBackground: !background,
  });
};

const png32 = await shot(32);
// iOS composites an apple-touch-icon over black, so this one gets the paper
// ground baked in rather than an alpha channel.
await writeFile(join(pub, "brand", "apple-touch-icon.png"), await shot(180, "#f6f1f3"));
await writeFile(join(pub, "brand", "icon-512.png"), await shot(512));

/* PNG-in-ICO: 6-byte ICONDIR + 16-byte ICONDIRENTRY, then the PNG verbatim.
   Every browser that matters has read this since IE11. */
const dir = Buffer.alloc(22);
dir.writeUInt16LE(0, 0); // reserved
dir.writeUInt16LE(1, 2); // type: icon
dir.writeUInt16LE(1, 4); // one image
dir.writeUInt8(32, 6); // width
dir.writeUInt8(32, 7); // height
dir.writeUInt8(0, 8); // palette: none
dir.writeUInt8(0, 9); // reserved
dir.writeUInt16LE(1, 10); // color planes
dir.writeUInt16LE(32, 12); // bits per pixel
dir.writeUInt32LE(png32.length, 14);
dir.writeUInt32LE(22, 18); // offset of the PNG payload
await writeFile(join(pub, "favicon.ico"), Buffer.concat([dir, png32]));

await browser.close();
console.log("og.jpg · favicon.ico · brand/apple-touch-icon.png · brand/icon-512.png");
