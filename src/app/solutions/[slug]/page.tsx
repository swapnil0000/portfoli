import Link from "next/link";
import { notFound } from "next/navigation";
import { getStage, stages } from "@/content/solutions";
import { caseStudies } from "@/content/work";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbSchema, JsonLd, personId } from "@/lib/jsonld";
import { PageHero } from "@/components/page-hero";
import { Button, Chip, Container } from "@/components/ui";
import { CtaBand } from "@/components/cta-band";
import { CaseTitle } from "@/components/case-title";

export function generateStaticParams() {
  return stages.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/solutions/[slug]">) {
  const s = getStage((await params).slug);
  if (!s) return {};
  return pageMetadata({ title: `${s.name}: ${s.headline}`, description: s.summary, path: `/solutions/${s.slug}`, image: `/solutions/${s.slug}/opengraph-image` });
}

export default async function StagePage({ params }: PageProps<"/solutions/[slug]">) {
  const s = getStage((await params).slug);
  if (!s) notFound();
  const proof = caseStudies.filter((c) => c.stages.includes(s.slug));
  const next = stages[(stages.indexOf(s) + 1) % stages.length];

  return (
    <>
      <PageHero eyebrow={`Solutions · ${s.index} · ${s.name}`} title={s.headline} lede={s.summary}>
        <div className="mt-8 flex flex-wrap gap-1.5">
          {s.channels.map((c) => (
            <Chip key={c}>{c}</Chip>
          ))}
        </div>
      </PageHero>

      <Container className="grid gap-12 pb-20 lg:grid-cols-2">
        <section>
          <h2 className="eyebrow">What you get</h2>
          <ul className="mt-6 flex flex-col">
            {s.deliverables.map((d) => (
              <li key={d} className="flex gap-3 border-t border-line py-4 text-fg">
                <span aria-hidden className="font-mono text-cyan">+</span>
                {d}
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="eyebrow">Where I&apos;ve done it</h2>
          <ul className="mt-6 flex flex-col gap-3">
            {proof.map((c) => (
              <li key={c.slug}>
                <Link href={`/work/${c.slug}`} data-spotlight className="glass block rounded-2xl p-5 transition-colors hover:border-line-strong">
                  <p className="font-medium">{c.client}</p>
                  <p className="mt-1 text-sm text-fg-muted">
                    <CaseTitle slug={c.slug}>{c.title}</CaseTitle>
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </Container>

      <section className="border-y border-line bg-base/60 py-20">
        <Container>
          <h2 className="eyebrow reveal">How it works</h2>
          <ol className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {s.process.map((p, n) => (
              <li key={p.step} className="reveal relative border-t border-line-strong pt-6">
                <span aria-hidden className="absolute -top-px left-0 h-px w-10" style={{ background: "var(--grad)" }} />
                <span className="font-mono text-xs text-fg-faint">Step {n + 1}</span>
                <h3 className="mt-2 text-lg font-semibold tracking-tight">{p.step}</h3>
                <p className="mt-2 text-sm text-pretty text-fg-muted">{p.detail}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="py-20">
        <Container className="grid gap-10 lg:grid-cols-12">
          <h2 className="reveal text-3xl font-semibold tracking-tight lg:col-span-4">Questions, answered.</h2>
          <div className="lg:col-span-8">
            {s.faqs.map((f) => (
              <details key={f.q} className="reveal group border-t border-line py-5 last:border-b">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium tracking-tight [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span aria-hidden className="font-mono text-cyan transition-transform duration-300 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl text-pretty text-fg-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      <Container className="pb-8">
        <Link
          href={`/solutions/${next.slug}`}
          data-spotlight
          className="glass group flex items-center justify-between gap-6 rounded-2xl p-6 transition-colors hover:border-line-strong sm:p-8"
        >
          <span>
            <span className="eyebrow">Next stage · {next.index}</span>
            <span className="mt-2 block text-2xl font-semibold tracking-tight">{next.name}</span>
          </span>
          <span aria-hidden className="text-2xl text-fg-muted transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </Link>
        <div className="mt-6 flex justify-center">
          <Button href="/solutions" variant="ghost">
            All solutions
          </Button>
        </div>
      </Container>

      <CtaBand />
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: s.headline,
            description: s.summary,
            serviceType: s.name,
            provider: { "@id": personId },
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: s.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
          },
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Solutions", path: "/solutions" },
            { name: s.name, path: `/solutions/${s.slug}` },
          ]),
        ]}
      />
    </>
  );
}
