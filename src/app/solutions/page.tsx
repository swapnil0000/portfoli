import Link from "next/link";
import { stages } from "@/content/solutions";
import { zones } from "@/content/capabilities";
import { getCaseStudy } from "@/content/work";
import { pageMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/page-hero";
import { Chip, Container, SectionHeading } from "@/components/ui";
import { CtaBand } from "@/components/cta-band";

export const metadata = pageMetadata({
  title: "Services — websites, SEO, speed, ads and tracking",
  description:
    "Web and app development, backend and cloud, e-commerce, real-time video and admin systems — plus technical SEO, Meta and Google Ads, conversion optimisation and end-to-end tracking.",
  path: "/solutions",
});

export default function SolutionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Everything your website needs to bring in customers."
        lede="Pick one service or combine them. Every project starts with a free discovery call and a quick audit of what's holding your site back."
      />

      <Container className="flex flex-col gap-4 pb-12">
        {stages.map((s) => (
          <Link
            key={s.slug}
            href={`/solutions/${s.slug}`}
            data-spotlight
            className="glass reveal group grid gap-6 rounded-2xl p-6 transition-colors hover:border-line-strong sm:p-8 lg:grid-cols-12"
          >
            <div className="lg:col-span-4">
              <span className="font-mono text-xs text-fg-faint">{s.index}</span>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">{s.name}</h2>
              <p className="mt-1 text-fg-muted">{s.headline}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {s.channels.map((c) => (
                  <Chip key={c}>{c}</Chip>
                ))}
              </div>
            </div>
            <ul className="grid gap-2 text-sm text-fg-muted sm:grid-cols-2 lg:col-span-8">
              {s.deliverables.map((d) => (
                <li key={d} className="flex gap-2 border-t border-line pt-3">
                  <span aria-hidden className="text-cyan">+</span>
                  {d}
                </li>
              ))}
            </ul>
          </Link>
        ))}
      </Container>

      <section className="py-24">
        <Container>
          <div className="reveal">
            <SectionHeading
              eyebrow="Tech I work with"
              title="Whatever your stack, it's covered."
              lede="Everything here is something I've shipped to production — follow the links for the proof."
            />
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {zones.map((z, i) => (
              <article key={z.slug} id={`zone-${z.slug}`} data-spotlight className="glass reveal scroll-mt-28 rounded-2xl p-6 sm:p-8">
                <span className="font-mono text-xs text-fg-faint">Z{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight">{z.name}</h3>
                <p className="mt-2 text-sm text-pretty text-fg-muted">{z.summary}</p>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {z.tech.map((t) => (
                    <Chip key={t}>{t}</Chip>
                  ))}
                </div>
                <p className="mt-6 border-t border-line pt-4 text-sm text-fg-muted">
                  <span className="eyebrow mr-2">Proof</span>
                  {z.proof.map((slug, j) => (
                    <span key={slug}>
                      {j > 0 && <span className="text-fg-faint"> · </span>}
                      <Link href={`/work/${slug}`} className="text-fg underline decoration-line-strong underline-offset-4 hover:decoration-cyan">
                        {getCaseStudy(slug)?.client}
                      </Link>
                    </span>
                  ))}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
