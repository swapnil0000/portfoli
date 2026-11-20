import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { stages } from "@/content/solutions";
import { caseStudies } from "@/content/work";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", "/work", "/solutions", "/about", "/contact", "/privacy"];
  return [
    ...pages.map((p) => ({ url: absoluteUrl(p), changeFrequency: "monthly" as const, priority: p === "/" ? 1 : 0.7 })),
    ...stages.map((s) => ({ url: absoluteUrl(`/solutions/${s.slug}`), changeFrequency: "monthly" as const, priority: 0.8 })),
    ...caseStudies.map((c) => ({ url: absoluteUrl(`/work/${c.slug}`), changeFrequency: "monthly" as const, priority: 0.9 })),
  ];
}
