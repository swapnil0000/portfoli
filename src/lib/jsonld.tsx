import type { Person, WebSite, WithContext, ProfessionalService, BreadcrumbList } from "schema-dts";
import { absoluteUrl, site } from "./site";
import { stages } from "@/content/solutions";

export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      // Escape "<" so content can never close the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export const personId = absoluteUrl("/#person");
const sameAs = Object.values(site.links).filter(Boolean);

export const personSchema: WithContext<Person> = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": personId,
  name: site.name,
  jobTitle: site.role,
  description: site.description,
  url: site.url,
  sameAs,
  knowsAbout: [
    "Web development",
    "Mobile app design",
    "Backend and API development",
    "Cloud and DevOps",
    "E-commerce and payments",
    "UI/UX design",
    "Technical SEO",
    "Core Web Vitals",
    "Google Analytics 4",
    "Google Tag Manager",
    "Meta Conversions API",
    "Google Ads",
    "Next.js",
    "React",
    "Node.js",
  ],
};

export const websiteSchema: WithContext<WebSite> = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": absoluteUrl("/#website"),
  url: site.url,
  name: site.name,
  description: site.description,
  inLanguage: "en-IN",
  publisher: { "@id": personId },
};

export const serviceSchema: WithContext<ProfessionalService> = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": absoluteUrl("/#service"),
  name: `${site.name} — Tech & growth consulting`,
  url: site.url,
  description: site.tagline,
  founder: { "@id": personId },
  areaServed: "Worldwide",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Growth solutions",
    itemListElement: stages.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.headline, description: s.summary, url: absoluteUrl(`/solutions/${s.slug}`) },
    })),
  },
};

export function breadcrumbSchema(items: { name: string; path: string }[]): WithContext<BreadcrumbList> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}
