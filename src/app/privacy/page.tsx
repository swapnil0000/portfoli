import { pageMetadata } from "@/lib/metadata";
import { InBuild, PageHero } from "@/components/page-hero";

export const metadata = pageMetadata({
  title: "Privacy policy",
  description: "How this site collects and uses data, including analytics, advertising pixels and consent choices.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Privacy" title={"Privacy policy"} lede={"Plain-language details on what this site measures and why. Final policy ships with tracking in Phase 4."} />
      <InBuild phase={4} items={["What’s collected (analytics, ads pixels, form data)", "Consent Mode v2 and DPDP consent choices", "Data retention and your rights", "Contact for data requests"]} />
    </>
  );
}
