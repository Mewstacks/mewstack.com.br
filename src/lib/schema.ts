import { SITE_ORIGIN } from "../components/Seo";
import type { Service } from "./services";

const ORGANIZATION = `${SITE_ORIGIN}/#organization`;

const AREA_SERVED = [
  { "@type": "City", name: "Caxias do Sul" },
  { "@type": "State", name: "Rio Grande do Sul" },
  { "@type": "Country", name: "Brasil" },
];

/* The site-wide Organization / ProfessionalService / WebSite graph is static in
   index.html, so the home route adds nothing and avoids describing itself
   twice. */
export function homeSchema(): Record<string, unknown>[] {
  return [];
}

export function serviceSchema(service: Service): Record<string, unknown>[] {
  const url = `${SITE_ORIGIN}/${service.slug}`;
  return [
    {
      "@type": "Service",
      "@id": `${url}#service`,
      name: service.label,
      description: service.metaDescription,
      serviceType: service.label,
      url,
      provider: { "@id": ORGANIZATION },
      areaServed: AREA_SERVED,
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Início", item: `${SITE_ORIGIN}/` },
        { "@type": "ListItem", position: 2, name: service.label, item: url },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: service.faq.map((entry) => ({
        "@type": "Question",
        name: entry.question,
        acceptedAnswer: { "@type": "Answer", text: entry.answer },
      })),
    },
  ];
}
