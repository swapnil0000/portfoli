import { ViewTransition } from "react";

// Shared-element morph: a case study's title flies from the list into the
// case-study page heading during navigation (no-op without browser support).
export function CaseTitle({ slug, children }: { slug: string; children: React.ReactNode }) {
  return (
    <ViewTransition name={`case-${slug}`}>
      <span className="inline-block">{children}</span>
    </ViewTransition>
  );
}
