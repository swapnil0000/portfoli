import { cta } from "@/content/nav";
import { Button, Container } from "@/components/ui";

export function CtaBand() {
  return (
    <section className="py-12">
      <Container>
        <div className="glass relative overflow-hidden rounded-3xl px-6 py-14 text-center sm:px-12 sm:py-20">
          <div aria-hidden className="absolute inset-x-0 top-0 h-px" style={{ background: "var(--grad)" }} />
          <p className="eyebrow">Next step</p>
          <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Tell me where growth is stuck. I&apos;ll show you what&apos;s fixable.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-fg-muted">
            Every engagement is scoped after a short discovery call — no templates, no guesswork pricing.
          </p>
          <Button href={cta.href} className="mt-8">
            {cta.label}
          </Button>
        </div>
      </Container>
    </section>
  );
}
