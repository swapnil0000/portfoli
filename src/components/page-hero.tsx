import type { ReactNode } from "react";
import { Container } from "@/components/ui";

// Shared top-of-page block for inner pages.
export function PageHero({ eyebrow, title, lede, children }: { eyebrow: string; title: ReactNode; lede?: ReactNode; children?: ReactNode }) {
  return (
    <section className="relative isolate pt-36 pb-12 sm:pt-44 sm:pb-16">
      <div aria-hidden className="bg-grid absolute inset-0 -z-10 opacity-70" />
      <Container>
        <p className="eyebrow animate-rise">{eyebrow}</p>
        <h1 className="mt-4 max-w-4xl animate-lift text-4xl leading-[1.05] font-semibold tracking-[-0.03em] text-balance [animation-delay:80ms] sm:text-6xl">
          {title}
        </h1>
        {lede && <p className="mt-6 max-w-2xl animate-lift text-lg text-pretty text-fg-muted [animation-delay:160ms]">{lede}</p>}
        {children}
      </Container>
    </section>
  );
}

// Placeholder panel for sections scheduled in a later build phase.
export function InBuild({ phase, items }: { phase: number; items: string[] }) {
  return (
    <Container>
      <div className="glass rounded-2xl p-6 sm:p-8">
        <p className="font-mono text-xs text-amber">In build · Phase {phase}</p>
        <ul className="mt-4 grid gap-2 text-sm text-fg-muted sm:grid-cols-2">
          {items.map((i) => (
            <li key={i} className="flex gap-2">
              <span aria-hidden className="text-fg-faint">→</span>
              {i}
            </li>
          ))}
        </ul>
      </div>
    </Container>
  );
}
