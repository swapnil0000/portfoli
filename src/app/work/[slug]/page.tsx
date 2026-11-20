import Link from "next/link";
import { notFound } from "next/navigation";
import { caseStudies, getCaseStudy } from "@/content/work";
import { caseBodies } from "@/content/case-bodies";
import { getStage } from "@/content/solutions";
import { pageMetadata } from "@/lib/metadata";
import { absoluteUrl } from "@/lib/site";
import { breadcrumbSchema, JsonLd, personId } from "@/lib/jsonld";
import { PageHero } from "@/components/page-hero";
import { Chip, Container, Stat } from "@/components/ui";
import { CtaBand } from "@/components/cta-band";
import { CaseTitle } from "@/components/case-title";
import { CaseVisual } from "@/components/case/visuals";

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">) {
  const c = getCaseStudy((await params).slug);
  if (!c) return {};
  return pageMetadata({ title: `${c.client} case study`, description: `${c.title}. ${c.summary}`, path: `/work/${c.slug}`, image: `/work/${c.slug}/opengraph-image` });
}

export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const c = getCaseStudy((await params).slug);
  if (!c) notFound();
  const body = caseBodies[c.slug];
  const next = caseStudies[(caseStudies.indexOf(c) + 1) % caseStudies.length];

  const evidence = body.evidence && (
    <Section id="evidence" title="The evidence">
                <p className="text-lg text-pretty text-fg-muted">{body.evidence.intro}</p>
                {body.evidence.visuals.map((v) => (
                  <CaseVisual key={v.title} visual={v} />
                ))}
                {body.evidence.findings && (
                  <div className="reveal">
                    <h3 className="eyebrow">What the data showed</h3>
                    <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                      {body.evidence.findings.map((f) => (
                        <li key={f} className="border-t border-line-strong pt-4 text-pretty text-fg">
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Section>
  );

  const toc = [
    ...(body.evidence && body.evidenceFirst ? [{ id: "evidence", label: "The evidence" }] : []),
    { id: "context", label: "Context" },
    { id: "shipped", label: "What I shipped" },
    ...(body.evidence && !body.evidenceFirst ? [{ id: "evidence", label: "The evidence" }] : []),
    { id: "results", label: "Results" },
    ...(body.next ? [{ id: "next", label: "What's next" }] : []),
  ];

  return (
    <article>
      <PageHero eyebrow={`${c.client} · ${c.sector} · ${c.period}`} title={<CaseTitle slug={c.slug}>{c.title}</CaseTitle>} lede={c.summary}>
        <div className="mt-8 flex flex-wrap gap-1.5">
          {c.stages.map((s) => (
            <Link key={s} href={`/solutions/${s}`}>
              <Chip className="transition-colors hover:border-cyan/50 hover:text-fg">{getStage(s)?.name}</Chip>
            </Link>
          ))}
        </div>
      </PageHero>

      <Container className="pb-8">
        <dl className="grid gap-px overflow-hidden rounded-2xl border border-line-strong bg-line md:grid-cols-3">
          {[
            ["The problem", c.tldr.problem, "text-amber"],
            ["What I did", c.tldr.did, "text-cyan"],
            ["The result", c.tldr.result, "text-signal"],
          ].map(([label, text, tone]) => (
            <div key={label} className="bg-base p-6">
              <dt className={`font-mono text-xs tracking-wide uppercase ${tone}`}>{label}</dt>
              <dd className="mt-2 text-pretty text-fg">{text}</dd>
            </div>
          ))}
        </dl>
      </Container>

      {c.metrics.length > 0 && (
        <Container className="pb-8">
          <div className="grid grid-cols-2 gap-8 border-y border-line py-8 sm:grid-cols-3">
            {c.metrics.map((m) => (
              <Stat key={m.label} {...m} />
            ))}
          </div>
        </Container>
      )}

      <Container className="grid gap-12 py-12 lg:grid-cols-12">
        <aside className="hidden lg:col-span-3 lg:block">
          <nav aria-label="On this page" className="sticky top-28">
            <p className="eyebrow">On this page</p>
            <ul className="mt-4 flex flex-col gap-2 border-l border-line text-sm">
              {toc.map((t) => (
                <li key={t.id}>
                  <a href={`#${t.id}`} className="-ml-px block border-l border-transparent pl-4 text-fg-muted transition-colors hover:border-cyan hover:text-fg">
                    {t.label}
                  </a>
                </li>
              ))}
            </ul>
            <p className="eyebrow mt-10">Stack</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {c.stack.map((s) => (
                <Chip key={s}>{s}</Chip>
              ))}
            </div>
          </nav>
        </aside>

        <div className="flex min-w-0 flex-col gap-20 lg:col-span-9">
          {body.evidenceFirst && evidence}

          <Section id="context" title="Context">
            {body.context.map((p) => (
              <p key={p} className="text-lg text-pretty text-fg-muted">
                {p}
              </p>
            ))}
            <div className="glass rounded-2xl p-5">
              <p className="eyebrow">My role</p>
              <p className="mt-2 text-pretty text-fg">{body.role}</p>
            </div>
          </Section>

          <Section id="shipped" title="What I shipped">
            <ol className="flex flex-col gap-4">
              {body.workstreams.map((w, n) => (
                <li key={w.title} data-spotlight className="glass reveal rounded-2xl p-6 sm:p-8">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-xs text-fg-faint">{String(n + 1).padStart(2, "0")}</span>
                    <Chip>{getStage(w.stage)?.name}</Chip>
                  </div>
                  <h3 className="mt-4 text-xl font-semibold tracking-tight sm:text-2xl">{w.title}</h3>
                  <ul className="mt-4 flex flex-col gap-2.5">
                    {w.points.map((p) => (
                      <li key={p} className="flex gap-3 text-pretty text-fg-muted">
                        <span aria-hidden className="mt-0.5 font-mono text-cyan">+</span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </Section>

          {!body.evidenceFirst && evidence}

          <Section id="results" title="Results">
            <ul className="flex flex-col">
              {body.results.map((r) => (
                <li key={r} className="reveal flex gap-4 border-t border-line py-4 text-lg text-pretty last:border-b">
                  <span aria-hidden className="font-mono text-signal">✓</span>
                  {r}
                </li>
              ))}
            </ul>
          </Section>

          {body.next && (
            <Section id="next" title="What's next">
              <ul className="flex flex-col gap-3">
                {body.next.map((n) => (
                  <li key={n} className="reveal flex gap-3 text-pretty text-fg-muted">
                    <span aria-hidden className="font-mono text-amber">→</span>
                    {n}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          <div className="lg:hidden">
            <p className="eyebrow">Stack</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {c.stack.map((s) => (
                <Chip key={s}>{s}</Chip>
              ))}
            </div>
          </div>
        </div>
      </Container>

      <Container className="pb-8">
        <Link
          href={`/work/${next.slug}`}
          data-spotlight
          className="glass group flex items-center justify-between gap-6 rounded-2xl p-6 transition-colors hover:border-line-strong sm:p-8"
        >
          <span className="min-w-0">
            <span className="eyebrow">Next case study · {next.client}</span>
            <span className="mt-2 block text-xl font-semibold tracking-tight text-balance sm:text-2xl">{next.title}</span>
          </span>
          <span aria-hidden className="text-2xl text-fg-muted transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </Link>
      </Container>

      <CtaBand />
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: c.title,
            description: c.summary,
            url: absoluteUrl(`/work/${c.slug}`),
            image: absoluteUrl(`/work/${c.slug}/opengraph-image`),
            author: { "@id": personId },
            about: { "@type": "Organization", name: c.client },
            keywords: c.stack.join(", "),
          },
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Work", path: "/work" },
            { name: c.client, path: `/work/${c.slug}` },
          ]),
        ]}
      />
    </article>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="flex scroll-mt-28 flex-col gap-6">
      <h2 id={`${id}-h`} className="text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {children}
    </section>
  );
}
