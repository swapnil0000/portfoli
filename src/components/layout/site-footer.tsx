import Link from "next/link";
import { primaryNav, cta } from "@/content/nav";
import { stages } from "@/content/solutions";
import { site } from "@/lib/site";
import { Container, LiveDot } from "@/components/ui";

export function SiteFooter() {
  const social = Object.entries(site.links).filter(([, href]) => href);
  return (
    <footer className="mt-32 border-t border-line">
      <Container className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-2">
          <p className="text-lg font-medium tracking-tight">{site.name}</p>
          <p className="mt-2 max-w-sm text-sm text-fg-muted">{site.tagline}</p>
          <p className="mt-6 inline-flex items-center gap-2 font-mono text-xs text-fg-muted">
            <LiveDot /> Taking on new projects
          </p>
        </div>
        <FooterCol title="Site" links={[...primaryNav, cta]} />
        <FooterCol title="Solutions" links={stages.map((s) => ({ href: `/solutions/${s.slug}`, label: s.name }))} />
      </Container>
      <Container className="flex flex-col gap-3 border-t border-line py-6 text-xs text-fg-faint sm:flex-row sm:items-center sm:justify-between">
        <p>© {site.name}. Built with Next.js — fast by design.</p>
        <div className="flex gap-4">
          {social.map(([name, href]) => (
            <a key={name} href={href} target="_blank" rel="noopener me" className="capitalize hover:text-fg">
              {name}
            </a>
          ))}
          <Link href="/privacy" className="hover:text-fg">
            Privacy
          </Link>
        </div>
      </Container>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <p className="eyebrow">{title}</p>
      <ul className="mt-4 flex flex-col gap-2.5 text-sm">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-fg-muted transition-colors hover:text-fg">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
