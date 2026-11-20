import { NextResponse, type NextRequest } from "next/server";
import { caseStudies } from "@/content/work";
import { stages } from "@/content/solutions";

// With streaming, notFound() inside a page arrives after the 200 header is sent
// (a soft 404). Reject unknown slugs here so crawlers get a real 404 status.
const known: Record<string, Set<string>> = {
  work: new Set(caseStudies.map((c) => c.slug)),
  solutions: new Set(stages.map((s) => s.slug)),
};

export function proxy(request: NextRequest) {
  const [, section, slug] = request.nextUrl.pathname.split("/");
  if (!known[section]?.has(slug)) {
    return NextResponse.rewrite(new URL("/_404", request.url));
  }
}

export const config = {
  matcher: ["/work/:slug", "/solutions/:slug"],
};
