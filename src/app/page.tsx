import Link from "next/link";
import { stages } from "@/content/solutions";
import { caseStudies } from "@/content/work";
import { roles, skills } from "@/content/experience";
import { cta } from "@/content/nav";
import { JsonLd, serviceSchema } from "@/lib/jsonld";
import { Button, Chip, Container, LiveDot, SectionHeading, Stat } from "@/components/ui";
import { CtaBand } from "@/components/cta-band";
import { WorkCard } from "@/components/work-card";
import { HeroField } from "@/components/hero/hero-field";
import { CommandCentre } from "@/components/case/command-centre";
import { caseBodies } from "@/content/case-bodies";

const proof = [
  { value: "3–10L", label: "daily users on the platform I engineer for" },
  { value: "41", label: "official exam sites my SEO dashboard checks every 5 minutes" },
  { value: "Poor → Good", label: "page stability on adda247.com, real-user data" },
  { value: "14%", label: "of failed orders recovered for a D2C client" },
];

const process = [
  { step: "Free discovery call", detail: "Tell me about your business, goals and what isn't working. 30 minutes, no obligation." },
  { step: "Audit & plan", detail: "I check your site, SEO, speed and tracking, then send a clear plan with scope and timeline." },
  { step: "Build & launch", detail: "Weekly updates and a preview link, so you see progress before anything goes live." },
  { step: "Measure & improve", detail: "Tracking shows what's working. I fix what isn't and hand over everything you need." },
];

export default function Home() {
  return (
    <>
      <Hero />
      <Audiences />

      <section aria-labelledby="proof-heading" className="border-y border-line bg-base/60">
        <h2 id="proof-heading" className="sr-only">
          Results
        </h2>
        <Container className="grid grid-cols-2 gap-x-6 gap-y-8 py-10 lg:grid-cols-4">
          {proof.map((p) => (
            <Stat key={p.label} {...p} />
          ))}
        </Container>
      </section>

      <FeaturedProject />

      <section id="work" className="scroll-mt-24 py-20 sm:py-28">
        <Container>
          <div className="reveal flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading eyebrow="Selected work" title="Real projects, real numbers." lede="Each card opens a short case study: the problem, what I did, and the result." />
            <Button href="/work" variant="ghost" className="shrink-0 self-start sm:self-auto">
              All {caseStudies.length} case studies
            </Button>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {caseStudies.slice(0, 6).map((c) => (
              <WorkCard key={c.slug} c={c} />
            ))}
          </div>
        </Container>
      </section>

      <section id="services" className="scroll-mt-24 border-y border-line bg-base/60 py-20 sm:py-28">
        <Container>
          <div className="reveal">
            <SectionHeading
              eyebrow="Services"
              title="What I can do for your business."
              lede="Pick one service or combine them. Because one person does all of it, your website, SEO, ads and tracking actually work together."
            />
          </div>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stages.map((s) => (
              <li key={s.slug} className="reveal">
                <Link href={`/solutions/${s.slug}`} data-spotlight className="glass group flex h-full flex-col rounded-2xl p-6 transition-colors hover:border-line-strong">
                  <h3 className="text-xl font-semibold tracking-tight">{s.name}</h3>
                  <p className="mt-1 text-sm text-fg-muted">{s.headline}</p>
                  <ul className="mt-5 flex flex-col gap-2 text-sm text-fg">
                    {s.deliverables.slice(0, 3).map((d) => (
                      <li key={d} className="flex gap-2">
                        <span aria-hidden className="text-cyan">✓</span>
                        {d}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-auto pt-6 text-sm text-fg-muted transition-colors group-hover:text-fg">
                    Learn more <span aria-hidden>→</span>
                  </span>
                </Link>
              </li>
            ))}
            <li className="reveal">
              <Link
                href={cta.href}
                className="group flex h-full flex-col justify-between rounded-2xl border border-dashed border-cyan/40 p-6 transition-colors hover:bg-glass"
              >
                <span>
                  <span className="text-xl font-semibold tracking-tight">Not sure what you need?</span>
                  <span className="mt-2 block text-sm text-fg-muted">Tell me what&apos;s not working. I&apos;ll suggest where to start — free.</span>
                </span>
                <span className="mt-6 text-sm text-cyan">
                  Book a discovery call <span aria-hidden>→</span>
                </span>
              </Link>
            </li>
          </ul>
        </Container>
      </section>

      <section id="experience" className="scroll-mt-24 py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="reveal lg:col-span-5">
            <SectionHeading eyebrow="For hiring teams" title="Experience at a glance." lede="Full-stack engineer who also owns SEO, performance and tracking — so features ship fast, rank and get measured." />
            <Button href="/about" className="mt-8">
              Full experience & skills
            </Button>
          </div>
          <div className="flex flex-col gap-4 lg:col-span-7">
            {roles.map((r) => (
              <article key={r.org} className="glass reveal rounded-2xl p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-lg font-semibold tracking-tight">
                    {r.title} <span className="text-fg-muted">· {r.org}</span>
                  </h3>
                  <span className="font-mono text-xs text-fg-faint">{r.period}</span>
                </div>
                <p className="mt-2 text-sm text-pretty text-fg-muted">{r.summary}</p>
              </article>
            ))}
            <div className="reveal flex flex-wrap gap-1.5 pt-2">
              {skills.flatMap((g) => g.items.slice(0, 3)).map((s) => (
                <Chip key={s}>{s}</Chip>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-line py-20 sm:py-28">
        <Container>
          <div className="reveal">
            <SectionHeading eyebrow="For businesses" title="How a project works." />
          </div>
          <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((p, n) => (
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

      <CtaBand />
      <JsonLd data={serviceSchema} />
    </>
  );
}

function Hero() {
  return (
    <section className="relative isolate overflow-hidden pt-36 pb-24 sm:pt-44 sm:pb-32">
      <div aria-hidden className="bg-grid absolute inset-0 -z-20" />
      <div
        aria-hidden
        className="absolute -top-48 left-1/2 -z-20 h-[38rem] w-[60rem] max-w-[160vw] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(closest-side, rgb(94 242 255 / 0.35), rgb(155 123 255 / 0.18), transparent)" }}
      />
      <HeroField />
      <Container>
        <p className="inline-flex h-7 animate-rise items-center gap-2 rounded-full border border-line bg-void/40 px-3 font-mono text-xs text-fg-muted backdrop-blur-sm">
          <LiveDot /> Available for freelance projects · India &amp; remote
        </p>
        <h1 className="mt-8 max-w-5xl animate-lift text-[clamp(2.4rem,6.5vw,5.25rem)] leading-[1.03] font-semibold tracking-[-0.035em] text-balance [animation-delay:80ms]">
          I build fast websites that <span className="text-grad">rank on Google</span> and track every sale.
        </h1>
        <p className="mt-6 max-w-2xl animate-lift text-lg text-pretty text-fg-muted [animation-delay:160ms] sm:text-xl">
          I&apos;m Swapnil Srivastav — a full-stack developer at Adda247 who also handles SEO, site speed, Meta &amp; Google Ads and
          tracking. One person, from code to customers.
        </p>
        <div className="mt-10 flex animate-rise flex-wrap gap-3 [animation-delay:240ms]">
          <Button href={cta.href}>{cta.label}</Button>
          <Button href="#work" variant="ghost">
            See my work
          </Button>
        </div>
      </Container>
    </section>
  );
}

// Two clear paths, so each visitor knows where to go next.
function Audiences() {
  const paths = [
    {
      eyebrow: "Hiring?",
      title: "Full-stack engineer with SEO & performance depth",
      points: ["Software Engineer at Adda247 since Nov 2024", "React · Next.js · Node.js · SEO · Core Web Vitals · GA4", "Ships to a platform with 3–10 lakh daily users"],
      primary: { href: "/about", label: "View experience" },
      secondary: { href: "#work", label: "See projects" },
    },
    {
      eyebrow: "Need a project?",
      title: "One developer for your website, SEO, ads and tracking",
      points: ["New website or app — or fix the one you have", "Rank on Google and load fast on real phones", "Meta & Google Ads with tracking you can trust"],
      primary: { href: cta.href, label: cta.label },
      secondary: { href: "#services", label: "See services" },
    },
  ];
  return (
    <section aria-label="Choose your path" className="relative z-10 -mt-10 pb-16">
      <Container className="grid gap-4 md:grid-cols-2">
        {paths.map((p) => (
          <article key={p.eyebrow} data-spotlight className="glass flex flex-col rounded-2xl p-6 sm:p-8">
            <p className="font-mono text-xs tracking-wide text-cyan uppercase">{p.eyebrow}</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-balance">{p.title}</h2>
            <ul className="mt-5 flex flex-col gap-2 text-sm text-fg-muted">
              {p.points.map((pt) => (
                <li key={pt} className="flex gap-2">
                  <span aria-hidden className="text-cyan">✓</span>
                  {pt}
                </li>
              ))}
            </ul>
            <div className="mt-auto flex flex-wrap gap-3 pt-8">
              <Button href={p.primary.href}>{p.primary.label}</Button>
              <Button href={p.secondary.href} variant="ghost">
                {p.secondary.label}
              </Button>
            </div>
          </article>
        ))}
      </Container>
    </section>
  );
}

function FeaturedProject() {
  const hud = caseBodies["seo-command-centre"].evidence?.visuals.find((v) => v.kind === "command-centre");
  if (!hud || hud.kind !== "command-centre") return null;
  return (
    <section className="py-20 sm:py-28">
      <Container className="grid items-center gap-12 lg:grid-cols-12">
        <div className="reveal min-w-0 lg:col-span-5">
          <SectionHeading
            eyebrow="Featured project"
            title="An SEO dashboard that spots exam news in 5 minutes."
            lede="Built for Adda247: it watches 41 official exam websites and alerts the content team instantly, so they publish before competitors. It also tracks rankings, competitors, site health and real-user speed."
          />
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/work/seo-command-centre">Read the case study</Button>
            <Button href={cta.href} variant="ghost">
              Build one for my site
            </Button>
          </div>
        </div>
        <div className="min-w-0 lg:col-span-7">
          <CommandCentre {...hud} />
        </div>
      </Container>
    </section>
  );
}
