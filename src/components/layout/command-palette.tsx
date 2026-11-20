"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { primaryNav, cta } from "@/content/nav";
import { stages } from "@/content/solutions";
import { zones } from "@/content/capabilities";
import { caseStudies } from "@/content/work";
import { site } from "@/lib/site";

type Props = { open: boolean; onOpenChange: (open: boolean) => void };

export default function CommandPalette({ open, onOpenChange }: Props) {
  const router = useRouter();

  const run = (fn: () => void) => {
    onOpenChange(false);
    fn();
  };
  const go = (href: string) => run(() => router.push(href));

  return (
    <Command.Dialog
      open={open}
      onOpenChange={onOpenChange}
      label="Command menu"
      loop
      overlayClassName="fixed inset-0 z-[60] bg-void/70 backdrop-blur-sm"
      contentClassName="fixed top-[12vh] left-1/2 z-[61] w-[min(40rem,calc(100vw-2rem))] -translate-x-1/2 overflow-hidden rounded-2xl border border-line-strong bg-raised/95 shadow-2xl shadow-black/60 backdrop-blur-xl"
    >
      <Dialog.Title className="sr-only">Command menu</Dialog.Title>
      <Dialog.Description className="sr-only">Search pages, case studies and actions.</Dialog.Description>
      <Command.Input
        placeholder="Jump to a page, case study or action…"
        className="h-14 w-full border-b border-line bg-transparent px-5 text-base text-fg outline-none placeholder:text-fg-faint"
      />
      <Command.List className="max-h-[min(60vh,26rem)] overflow-y-auto overscroll-contain p-2">
        <Command.Empty className="px-3 py-8 text-center text-sm text-fg-muted">No results.</Command.Empty>

        <Group heading="Navigate">
          <Item onSelect={() => go("/")} hint="/">Home</Item>
          {primaryNav.map((n) => (
            <Item key={n.href} onSelect={() => go(n.href)} hint={n.href}>
              {n.label}
            </Item>
          ))}
        </Group>

        <Group heading="Solutions">
          {stages.map((s) => (
            <Item key={s.slug} value={`${s.name} ${s.headline}`} onSelect={() => go(`/solutions/${s.slug}`)} hint={s.index}>
              {s.name} <span className="text-fg-faint">— {s.headline}</span>
            </Item>
          ))}
        </Group>

        <Group heading="Tech zones">
          {zones.map((z) => (
            <Item key={z.slug} value={`${z.name} ${z.tech.join(" ")}`} onSelect={() => go(`/solutions#zone-${z.slug}`)}>
              {z.name}
            </Item>
          ))}
        </Group>

        <Group heading="Case studies">
          {caseStudies.map((c) => (
            <Item key={c.slug} value={`${c.client} ${c.sector}`} onSelect={() => go(`/work/${c.slug}`)} hint={c.sector}>
              {c.client}
            </Item>
          ))}
        </Group>

        <Group heading="Actions">
          <Item onSelect={() => go(cta.href)}>{cta.label}</Item>
          <Item onSelect={() => run(() => navigator.clipboard?.writeText(window.location.href))}>Copy link to this page</Item>
          <Item onSelect={() => run(() => window.open(site.links.github, "_blank", "noopener"))} hint="↗">
            GitHub
          </Item>
        </Group>
      </Command.List>
    </Command.Dialog>
  );
}

function Group({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <Command.Group
      heading={heading}
      className="mb-1 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:tracking-[0.14em] [&_[cmdk-group-heading]]:text-fg-faint [&_[cmdk-group-heading]]:uppercase"
    >
      {children}
    </Command.Group>
  );
}

function Item({
  children,
  hint,
  ...props
}: React.ComponentProps<typeof Command.Item> & { hint?: string }) {
  return (
    <Command.Item
      className="flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm text-fg-muted data-[selected=true]:bg-glass-strong data-[selected=true]:text-fg"
      {...props}
    >
      <span className="truncate">{children}</span>
      {hint && <span className="shrink-0 font-mono text-[11px] text-fg-faint">{hint}</span>}
    </Command.Item>
  );
}
