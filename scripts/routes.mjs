/* Single source of truth for what gets prerendered and what lands in sitemap.xml.
   Adding an entry here makes `npm run build` snapshot that route to static HTML
   and list it in the sitemap — the two can't drift apart. */

export const SITE_ORIGIN = "https://mewstack.com.br";

export const ROUTES = [
  {
    path: "/",
    changefreq: "monthly",
    priority: "1.0",
  },
];
