import Link from "next/link";
import type { CaseStudy } from "@/content/work";
import { getStage } from "@/content/solutions";
import { Chip, cx } from "@/components/ui";
import { CaseTitle } from "@/components/case-title";

// Case-study card: a "thumbnail" panel led by the headline metric, then the
// plain-English title, what I did, and the services involved.
export function WorkCard({ c, className }: { c: CaseStudy; className?: string }) {
  const lead = c.metrics[0];
  return (
    <Link
      href={`/work/${c.slug}`}
      data-spotlight
      className={cx("glass reveal group flex flex-col overflow-hidden rounded-2xl transition-colors hover:border-line-strong", className)}
    >
      <div className="relative isolate flex min-h-36 flex-col justify-end overflow-hidden border-b border-line p-5 sm:p-6">
        <div aria-hidden className="bg-grid absolute inset-0 -z-10 opacity-80" />
        <div
          aria-hidden
          className="absolute -top-16 -right-10 -z-10 size-48 rounded-full opacity-40 blur-3xl transition-opacity duration-500 group-hover:opacity-70"
          style={{ background: "radial-gradient(closest-side, var(--cyan), var(--violet), transparent)" }}
        />
        <p className="font-mono text-[11px] text-fg-muted">{c.client}</p>
        {lead ? (
          <p className="mt-2">
            <span className="block font-mono text-3xl tracking-tight text-fg">{lead.value}</span>
            <span className="text-xs text-fg-muted">{lead.label}</span>
          </p>
        ) : (
          <p className="mt-2 text-sm text-fg-muted">{c.sector}</p>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="text-lg font-semibold tracking-tight text-balance">
          <CaseTitle slug={c.slug}>{c.title}</CaseTitle>
        </h3>
        <p className="mt-2 text-sm text-pretty text-fg-muted">{c.tldr.did}</p>
        <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-5">
          {c.stages.slice(0, 3).map((s) => (
            <Chip key={s}>{getStage(s)?.name}</Chip>
          ))}
          <span aria-hidden className="ml-auto text-fg-muted transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}
