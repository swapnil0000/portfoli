import { renderOg, ogSize } from "@/lib/og";
import { stages } from "@/content/solutions";
import { site } from "@/lib/site";

export const alt = `${site.name} — ${site.role}`;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOg({
    eyebrow: `${site.name} · ${site.role}`,
    title: site.tagline,
    footer: stages.map((s) => s.name),
  });
}
