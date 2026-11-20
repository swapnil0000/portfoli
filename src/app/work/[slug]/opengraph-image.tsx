import { renderOg, ogSize } from "@/lib/og";
import { caseStudies, getCaseStudy } from "@/content/work";

export const alt = "Case study";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const c = getCaseStudy((await params).slug)!;
  return renderOg({
    eyebrow: `Case study · ${c.client} · ${c.sector}`,
    title: c.title,
    footer: c.metrics.slice(0, 3).map((m) => m.value),
  });
}
