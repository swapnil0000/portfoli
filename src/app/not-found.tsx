import { Button, Container } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="relative isolate pt-44 pb-24">
      <div aria-hidden className="bg-grid absolute inset-0 -z-10" />
      <Container>
        <p className="font-mono text-sm text-danger">404 · signal lost</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">This page isn&apos;t on the map.</h1>
        <p className="mt-4 max-w-lg text-fg-muted">Try the command menu (⌘K) or head back to base.</p>
        <Button href="/" className="mt-8">
          Back to home
        </Button>
      </Container>
    </section>
  );
}
