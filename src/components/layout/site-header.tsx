import Link from "next/link";
import { cta } from "@/content/nav";
import { site } from "@/lib/site";
import { Button } from "@/components/ui";
import { NavLinks } from "./nav-links";
import { MobileMenu } from "./mobile-menu";
import { CommandMenu } from "./command-menu";

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4" style={{ viewTransitionName: "site-header" }}>
      <div className="glass relative mx-auto flex h-14 max-w-6xl items-center gap-2 overflow-hidden rounded-full pr-2 pl-4 sm:pl-5">
        <span aria-hidden className="scroll-progress absolute inset-x-6 bottom-0 h-px" style={{ background: "var(--grad)" }} />
        <Link href="/" className="group flex items-center gap-2.5 font-medium tracking-tight">
          <Logo />
          <span className="text-sm">{site.shortName}</span>
          <span className="sr-only">Srivastav, home</span>
          <span className="hidden font-mono text-[11px] text-fg-faint lg:inline">/ tech &amp; growth</span>
        </Link>

        <NavLinks className="ml-auto hidden md:flex" />

        <div className="ml-auto flex items-center gap-1.5 md:ml-2">
          <CommandMenu />
          {/* Visibility lives on a wrapper: Button's own inline-flex would override `hidden`. */}
          <div className="hidden sm:block">
            <Button href={cta.href} className="h-10 px-4">
              {cta.label}
            </Button>
          </div>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}

function Logo() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" aria-hidden>
      <defs>
        <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--cyan)" />
          <stop offset="1" stopColor="var(--violet)" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="10.5" fill="none" stroke="url(#logo-g)" strokeWidth="1.5" />
      <path d="M15.5 8.6c-.8-1-2-1.6-3.5-1.6-2 0-3.4 1.1-3.4 2.6 0 3.4 7 1.8 7 5 0 1.5-1.5 2.6-3.6 2.6-1.6 0-2.9-.7-3.7-1.8" fill="none" stroke="var(--fg)" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
