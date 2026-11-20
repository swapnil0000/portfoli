import { renderOg, ogSize } from "@/lib/og";
import { getStage, stages } from "@/content/solutions";

export const alt = "Growth solution";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return stages.map((s) => ({ slug: s.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const s = getStage((await params).slug)!;
  return renderOg({ eyebrow: `Solutions · ${s.index} · ${s.name}`, title: s.headline, footer: s.channels });
}
