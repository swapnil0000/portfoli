import { stages } from "@/content/solutions";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/page-hero";
import { Container } from "@/components/ui";
import { BriefForm } from "@/components/contact/brief-form";

export const metadata = pageMetadata({
  title: "Start a project",
  description: "Tell me about your business and what isn't working. I reply within one working day with next steps and a free discovery call.",
  path: "/contact",
});

const next = [
  { title: "I read your brief", detail: "And look at your website, SEO, speed and tracking before we talk." },
  { title: "Free 30-minute call", detail: "We go through goals, what's broken and what's possible." },
  { title: "A clear proposal", detail: "Scope, timeline and cost in writing — no surprises." },
];

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Start a project" title="Tell me where you're stuck." lede="Two minutes to fill in. I reply within one working day — whether it's a new website, better rankings, faster pages, or ads and tracking that make sense." />
      <Container className="grid gap-10 pb-24 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <BriefForm email={site.email} whatsapp={site.whatsapp} services={stages.map((s) => s.name)} />
        </div>
        <aside className="lg:col-span-4">
          <h2 className="eyebrow">What happens next</h2>
          <ol className="mt-6 flex flex-col gap-6">
            {next.map((n, i) => (
              <li key={n.title} className="flex gap-4">
                <span className="grid size-8 shrink-0 place-items-center rounded-full border border-cyan/40 font-mono text-xs text-cyan">{i + 1}</span>
                <span>
                  <span className="block font-medium text-fg">{n.title}</span>
                  <span className="mt-0.5 block text-sm text-pretty text-fg-muted">{n.detail}</span>
                </span>
              </li>
            ))}
          </ol>
          {site.links.linkedin && (
            <p className="mt-10 text-sm text-fg-muted">
              Prefer LinkedIn?{" "}
              <a href={site.links.linkedin} target="_blank" rel="noopener me" className="text-cyan underline-offset-4 hover:underline">
                Message me there
              </a>
              .
            </p>
          )}
        </aside>
      </Container>
    </>
  );
}
