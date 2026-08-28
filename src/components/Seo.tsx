import { useLayoutEffect } from "react";

export const SITE_ORIGIN = "https://mewstack.com.br";

type SeoProps = {
  title: string;
  description: string;
  /** Path with a leading slash, e.g. "/automacao-de-processos". */
  path: string;
  /** Extra schema.org nodes merged into the page's @graph. */
  schema?: Record<string, unknown>[];
};

function upsertMeta(selector: string, attr: "name" | "property", key: string) {
  let node = document.head.querySelector<HTMLMetaElement>(selector);
  if (!node) {
    node = document.createElement("meta");
    node.setAttribute(attr, key);
    document.head.appendChild(node);
  }
  return node;
}

/* Rewrites the head for the current route. Runs in a layout effect so the
   prerenderer, which serialises the DOM once React has mounted, captures the
   finished tags rather than index.html's defaults. */
export default function Seo({ title, description, path, schema }: SeoProps) {
  // The caller builds a fresh array every render, so depending on its identity
  // would re-run this on every render. The serialised form is the real input.
  const schemaJson = schema?.length
    ? JSON.stringify({ "@context": "https://schema.org", "@graph": schema })
    : "";

  useLayoutEffect(() => {
    const url = `${SITE_ORIGIN}${path}`;

    document.title = title;
    upsertMeta('meta[name="description"]', "name", "description").content = description;
    upsertMeta('meta[property="og:title"]', "property", "og:title").content = title;
    upsertMeta('meta[property="og:description"]', "property", "og:description").content =
      description;
    upsertMeta('meta[property="og:url"]', "property", "og:url").content = url;

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = url;

    // Kept in its own tag so the site-wide Organization/WebSite graph in
    // index.html stays untouched across client-side navigation.
    const ID = "route-schema";
    let node = document.getElementById(ID) as HTMLScriptElement | null;
    if (schemaJson) {
      if (!node) {
        node = document.createElement("script");
        node.type = "application/ld+json";
        node.id = ID;
        document.head.appendChild(node);
      }
      node.textContent = schemaJson;
    } else {
      node?.remove();
    }
  }, [title, description, path, schemaJson]);

  return null;
}
