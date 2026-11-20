import { caseStudies } from "@/content/work";
import { pageMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/page-hero";
import { Container } from "@/components/ui";
import { CtaBand } from "@/components/cta-band";
import { WorkCard } from "@/components/work-card";

export const metadata = pageMetadata({
  title: "Work — case studies",
  description:
    "Case studies in web development, SEO, website speed, Meta and Google Ads, and tracking — for Adda247, D2C brands and creators.",
  path: "/work",
});

export default function WorkPage() {
  return (
    <>
      <PageHero
        eyebrow="Work"
        title="Real projects, real numbers."
        lede="Two flagship projects from my job at Adda247, then freelance work for D2C brands and creators. Each case study starts with a three-line summary."
      />
      <Container className="grid gap-4 pb-12 sm:grid-cols-2 lg:grid-cols-3">
        {caseStudies.map((c) => (
          <WorkCard key={c.slug} c={c} />
        ))}
      </Container>
      <CtaBand />
    </>
  );
}
