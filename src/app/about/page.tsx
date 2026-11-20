import Link from "next/link";
import { roles, skills } from "@/content/experience";
import { cta } from "@/content/nav";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/page-hero";
import { Button, Chip, Container } from "@/components/ui";
import { CtaBand } from "@/components/cta-band";

export const metadata = pageMetadata({
  title: "About & experience",
  description:
    "Swapnil Srivastav — full-stack developer at Adda247 with depth in SEO, Core Web Vitals, Meta and Google Ads, and analytics. Experience, skills and highlights.",
  path: "/about",
});

const strengths = [
  { title: "Ships full-stack", detail: "React and Next.js on the front, Node, MongoDB and MariaDB behind, deployed on AWS, Cloudflare or Vercel." },
  { title: "Thinks in search", detail: "Server rendering, structured data and crawlable pages are part of the build, not a later fix." },
  { title: "Proves speed with real users", detail: "Judges performance by Chrome's real-user field data, not one lucky Lighthouse run." },
  { title: "Measures everything", detail: "GA4, GTM, Meta Conversions API and Google Ads set up so every lead and sale is counted once, correctly." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Full-stack developer who also owns SEO, speed and tracking."
        lede={`I'm ${site.name}. At Adda247 I build features for a platform used by 3–10 lakh learners a day — and the systems that make it rank, load fast and measure results. I take on freelance projects for brands that want the same.`}
      >
        <div className="mt-8 flex flex-wrap gap-3 print:hidden">
          <Button href={cta.href}>{cta.label}</Button>
          <Button href="/work" variant="ghost">
            See case studies
          </Button>
          {/* TODO: add a "Download résumé (PDF)" button once the PDF is provided */}
        </div>
      </PageHero>

      <Container className="grid gap-16 pb-20 lg:grid-cols-12">
        <section aria-labelledby="exp-h" className="lg:col-span-7">
          <h2 id="exp-h" className="text-3xl font-semibold tracking-tight">
            Experience
          </h2>
          <ol className="relative mt-8 flex flex-col gap-10 border-l border-line pl-6">
            {roles.map((r) => (
              <li key={r.org} className="relative">
                <span aria-hidden className="absolute top-2 -left-[29px] size-2.5 rounded-full bg-cyan shadow-[0_0_10px_var(--cyan)]" />
                <p className="font-mono text-xs text-fg-faint">{r.period}</p>
                <h3 className="mt-1 text-xl font-semibold tracking-tight">
                  {r.title} <span className="text-fg-muted">· {r.org}</span>
                </h3>
                <p className="mt-2 text-pretty text-fg-muted">{r.summary}</p>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {r.highlights.map((h) => (
                    <li key={h.text} className="flex gap-3 text-pretty text-fg">
                      <span aria-hidden className="mt-0.5 text-cyan">→</span>
                      <span>
                        {h.text}{" "}
                        {h.caseStudy && (
                          <Link href={`/work/${h.caseStudy}`} className="text-sm whitespace-nowrap text-cyan underline-offset-4 hover:underline print:hidden">
                            Case study
                          </Link>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </section>

        <aside className="flex flex-col gap-10 lg:col-span-5">
          <section aria-labelledby="skills-h">
            <h2 id="skills-h" className="text-3xl font-semibold tracking-tight">
              Skills
            </h2>
            <dl className="mt-8 flex flex-col gap-5">
              {skills.map((g) => (
                <div key={g.group}>
                  <dt className="eyebrow">{g.group}</dt>
                  <dd className="mt-2 flex flex-wrap gap-1.5">
                    {g.items.map((s) => (
                      <Chip key={s}>{s}</Chip>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-labelledby="how-h" className="glass rounded-2xl p-6">
            <h2 id="how-h" className="text-xl font-semibold tracking-tight">
              How I work
            </h2>
            <ul className="mt-5 flex flex-col gap-4">
              {strengths.map((s) => (
                <li key={s.title}>
                  <p className="font-medium text-fg">{s.title}</p>
                  <p className="mt-0.5 text-sm text-pretty text-fg-muted">{s.detail}</p>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </Container>

      <CtaBand />
    </>
  );
}
