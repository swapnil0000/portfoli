import { absoluteUrl, site } from "@/lib/site";
import { stages } from "@/content/solutions";
import { caseStudies } from "@/content/work";

// llms.txt: a plain-markdown map of the site for AI assistants.
export function GET() {
  const body = [
    `# ${site.name}`,
    "",
    `> ${site.description}`,
    "",
    "## Solutions",
    ...stages.map((s) => `- [${s.name}: ${s.headline}](${absoluteUrl(`/solutions/${s.slug}`)}): ${s.summary}`),
    "",
    "## Case studies",
    ...caseStudies.map((c) => `- [${c.client} — ${c.title}](${absoluteUrl(`/work/${c.slug}`)}): ${c.summary}`),
    "",
    "## Contact",
    `- [Start a project](${absoluteUrl("/contact")})`,
    "",
  ].join("\n");

  return new Response(body, { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}
