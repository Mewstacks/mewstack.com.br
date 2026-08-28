/* Post-build step: turns the client-rendered SPA into real HTML on disk.
 *
 * Why this works without touching the motion system: under
 * prefers-reduced-motion the site already renders itself fully static.
 * useChapter() bails out at the top with `clearProps + opacity: 1` instead of
 * running SplitText, and Capabilities' instrument timeline returns before the
 * `gsap.set(texts, { text: "" })` that blanks the terminal lines. So a snapshot
 * taken with reduced motion emulated carries whole headings (no SplitText
 * line-wrapper divs), the terminal copy intact, and nothing at opacity 0 —
 * the same content a sighted visitor ends up with, not a hidden-text trick.
 *
 * Crawlers that never execute JS (GPTBot, ClaudeBot, PerplexityBot) and
 * Googlebot's first pass both read these files directly.
 */
import { preview } from "vite";
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ROUTES, SITE_ORIGIN } from "./routes.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const outDir = join(root, "dist");
const PORT = 4183;
const MAX_PAGES = 200;

/* Runs inside the page. Strips the bits of the live DOM that are runtime state
 * rather than content, then writes the per-route head tags. */
function serialize({ canonical, title, description }) {
  // App.tsx stamps this on mount; index.css keys `animation: none !important`
  // off it. Baked into the file it would freeze motion for every visitor until
  // React boots and corrects it.
  document.documentElement.removeAttribute("data-reduced-motion");

  // Belt and braces: App drops this on mount, but if it ever survived into the
  // file it would hide the animated content from crawlers that do not run
  // scripts.
  document.documentElement.classList.remove("booting");

  // GSAP's reduced-motion path leaves `opacity: 1` plus cleared transforms on
  // every reveal. Drop only those properties — inline colors, heights and
  // object-position set in JSX are real styling and must survive.
  const RUNTIME_PROPS = [
    "opacity",
    "transform",
    "translate",
    "rotate",
    "scale",
    "visibility",
  ];
  for (const el of document.querySelectorAll("[style]")) {
    for (const prop of RUNTIME_PROPS) el.style.removeProperty(prop);
    if (!el.getAttribute("style")) el.removeAttribute("style");
  }

  // LenisAnchors parks tabindex="-1" on whatever was last scrolled to.
  for (const el of document.querySelectorAll('[tabindex="-1"]')) {
    el.removeAttribute("tabindex");
  }

  const head = document.head;
  const upsert = (selector, make) => {
    let node = head.querySelector(selector);
    if (!node) {
      node = make();
      head.appendChild(node);
    }
    return node;
  };

  upsert('link[rel="canonical"]', () => {
    const l = document.createElement("link");
    l.setAttribute("rel", "canonical");
    return l;
  }).setAttribute("href", canonical);

  upsert('meta[property="og:url"]', () => {
    const m = document.createElement("meta");
    m.setAttribute("property", "og:url");
    return m;
  }).setAttribute("content", canonical);

  if (title) {
    document.title = title;
    const og = head.querySelector('meta[property="og:title"]');
    if (og) og.setAttribute("content", title);
  }
  if (description) {
    const d = head.querySelector('meta[name="description"]');
    if (d) d.setAttribute("content", description);
    const og = head.querySelector('meta[property="og:description"]');
    if (og) og.setAttribute("content", description);
  }

  return "<!doctype html>\n" + document.documentElement.outerHTML + "\n";
}

/* Routes are discovered by crawling the site's own internal links, seeded from
   routes.mjs. A linked page is therefore always prerendered and always in the
   sitemap — the two cannot drift apart, and an unlinked page would not rank
   anyway. */
const SKIP_EXT = /\.[a-z0-9]{2,5}$/i;
function normalise(href) {
  if (!href || !href.startsWith("/") || href.startsWith("//")) return null;
  const path = href.split("#")[0].split("?")[0];
  if (!path || SKIP_EXT.test(path)) return null;
  return path === "/" ? "/" : path.replace(/\/+$/, "");
}

const server = await preview({
  root,
  preview: { port: PORT, strictPort: true, open: false },
  logLevel: "warn",
});

const browser = await chromium.launch();
const context = await browser.newContext({
  reducedMotion: "reduce",
  viewport: { width: 1440, height: 900 },
  locale: "pt-BR",
});

const seeds = new Map(ROUTES.map((r) => [r.path, r]));
const queue = [...seeds.keys()];
const seen = new Set(queue);

// Snapshot everything before writing: the preview server is still serving out
// of dist/, and overwriting index.html mid-run would poison later routes.
const snapshots = [];

try {
  while (queue.length && snapshots.length < MAX_PAGES) {
    const path = queue.shift();
    const page = await context.newPage();
    await page.goto(`http://localhost:${PORT}${path}`, {
      waitUntil: "networkidle",
      timeout: 60_000,
    });
    await page.waitForFunction(
      () => (document.getElementById("root")?.childElementCount ?? 0) > 0,
      null,
      { timeout: 30_000 },
    );
    await page.evaluate(() => document.fonts.ready);
    // Let layout-measuring effects (Process/SignalJourney route state) commit.
    await page.waitForTimeout(400);

    const hrefs = await page.evaluate(() =>
      [...document.querySelectorAll("a[href]")].map((a) => a.getAttribute("href")),
    );
    for (const href of hrefs) {
      const next = normalise(href);
      if (next && !seen.has(next)) {
        seen.add(next);
        queue.push(next);
      }
    }

    const route = seeds.get(path) ?? { path, changefreq: "monthly", priority: "0.8" };
    const html = await page.evaluate(serialize, {
      canonical: SITE_ORIGIN + path,
      title: route.title ?? null,
      description: route.description ?? null,
    });
    snapshots.push({ route, html });
    await page.close();
  }
  if (queue.length) {
    console.warn(`prerender  stopped at ${MAX_PAGES} pages, ${queue.length} left queued`);
  }
} finally {
  await browser.close();
  await server.close();
}

for (const { route, html } of snapshots) {
  const file =
    route.path === "/"
      ? join(outDir, "index.html")
      : join(outDir, route.path.replace(/^\/+/, ""), "index.html");
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, html, "utf8");
  const h2 = (html.match(/<h2[\s>]/g) ?? []).length;
  const title = (html.match(/<title>([^<]*)<\/title>/) ?? [, ""])[1];
  console.log(
    `prerender  ${route.path.padEnd(26)} ${String(Math.round(html.length / 1024)).padStart(4)} KB  ${String(h2).padStart(2)} h2  ${title.slice(0, 46)}`,
  );
}

const lastmod = new Date().toISOString().slice(0, 10);
const sitemap =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  snapshots
    .map(
      ({ route: r }) =>
        "  <url>\n" +
        `    <loc>${SITE_ORIGIN}${r.path}</loc>\n` +
        `    <lastmod>${lastmod}</lastmod>\n` +
        `    <changefreq>${r.changefreq}</changefreq>\n` +
        `    <priority>${r.priority}</priority>\n` +
        "  </url>",
    )
    .join("\n") +
  "\n</urlset>\n";
await writeFile(join(outDir, "sitemap.xml"), sitemap, "utf8");
console.log(`sitemap    ${snapshots.length} URL(s) -> dist/sitemap.xml`);
