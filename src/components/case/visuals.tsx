import Image from "next/image";
import type { Visual } from "@/content/case-bodies";
import { Chip, cx } from "@/components/ui";
import { CommandCentre } from "./command-centre";
import { PlayOnView } from "./play-on-view";
import { TrendChart, type Day } from "./trend-chart";

export function CaseVisual({ visual }: { visual: Visual }) {
  switch (visual.kind) {
    case "bars":
      return <BarList {...visual} />;
    case "table":
      return <DataTable {...visual} />;
    case "vitals":
      return <Vitals {...visual} />;
    case "events":
      return <EventStream {...visual} />;
    case "command-centre":
      return <CommandCentre {...visual} />;
    case "architecture":
      return <Architecture {...visual} />;
    case "cwv":
      return <CwvPanel {...visual} />;
    case "gallery":
      return <Gallery {...visual} />;
    case "timeline":
      return <Timeline {...visual} />;
    case "waterfall":
      return <Waterfall {...visual} />;
    case "dashboard":
      return <Dashboard {...visual} />;
    case "trend":
      return (
        <Frame title={visual.title} caption={visual.caption} source={visual.source}>
          <TrendChart daily={visual.daily} annotations={visual.annotations} panels={visual.panels} />
          <WeeklyTable daily={visual.daily} />
        </Frame>
      );
    case "downloads":
      return <Downloads {...visual} />;
    case "journey":
      return <Journey {...visual} />;
  }
}

function Frame({ title, caption, source, children }: { title: string; caption?: string; source?: string; children: React.ReactNode }) {
  return (
    <figure className="glass reveal rounded-2xl p-5 sm:p-8">
      <figcaption>
        <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
        {caption && <p className="mt-1 text-sm text-pretty text-fg-muted">{caption}</p>}
      </figcaption>
      <div className="mt-6">{children}</div>
      {source && <p className="mt-6 border-t border-line pt-3 font-mono text-[11px] text-fg-faint">Source: {source}</p>}
    </figure>
  );
}

type Bars = Extract<Visual, { kind: "bars" }>;

// Horizontal bar list, single series in the emphasis form: the row that carries
// the story in the accent, the rest muted. Values are always printed, so the
// tooltip only adds the note, and the list itself is the accessible table view.
function BarList({ title, caption, source, rows }: Bars) {
  const max = Math.max(...rows.map((r) => r.value));
  return (
    <Frame title={title} caption={caption} source={source}>
      <ol className="flex flex-col gap-3.5">
        {rows.map((r) => (
          <li
            key={r.label}
            tabIndex={r.note ? 0 : undefined}
            className="group relative grid grid-cols-[minmax(0,7.5rem)_1fr_auto] items-center gap-3 rounded-md outline-offset-4 sm:grid-cols-[minmax(0,12rem)_1fr_auto] sm:gap-4"
          >
            <span className={cx("text-sm text-pretty", r.emphasis ? "text-fg" : "text-fg-muted")}>{r.label}</span>
            <span className="h-5">
              <span
                className="bar-grow block h-full rounded-r-[4px]"
                style={{ width: `${(r.value / max) * 100}%`, minWidth: 2, background: r.emphasis ? "var(--chart-accent)" : "var(--chart-muted)" }}
              />
            </span>
            <span className="font-mono text-sm text-fg">{r.display}</span>
            {r.note && (
              <span
                role="tooltip"
                className="pointer-events-none absolute right-0 bottom-full z-10 mb-2 rounded-lg border border-line-strong bg-raised px-3 py-2 text-xs text-fg opacity-0 shadow-xl shadow-black/50 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
              >
                {r.label}: {r.display} · {r.note}
              </span>
            )}
            {r.emphasis && r.note && <span className="col-span-3 -mt-1 text-xs text-fg-muted sm:col-start-2">↳ {r.note}</span>}
          </li>
        ))}
      </ol>
    </Frame>
  );
}

type Table = Extract<Visual, { kind: "table" }>;

function DataTable({ title, caption, source, columns, rows, emphasisRow }: Table) {
  return (
    <Frame title={title} caption={caption} source={source}>
      <div className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
        <table className="w-full min-w-[30rem] text-left text-sm">
          <thead>
            <tr className="border-b border-line-strong">
              {columns.map((c, i) => (
                <th key={c} scope="col" className={cx("py-2.5 pr-4 font-mono text-[11px] font-normal tracking-wide text-fg-faint uppercase", i > 0 && "text-right")}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, r) => (
              <tr key={row[0]} className={cx("border-b border-line", r === emphasisRow && "bg-glass-strong")}>
                {row.map((cell, i) =>
                  i === 0 ? (
                    <th key={i} scope="row" className="py-3 pr-4 font-normal text-fg">
                      {r === emphasisRow && <span aria-hidden className="mr-2 inline-block size-2 rounded-full" style={{ background: "var(--chart-accent)" }} />}
                      {cell}
                    </th>
                  ) : (
                    <td key={i} className="py-3 pr-4 text-right font-mono text-fg-muted tabular-nums">
                      {cell}
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Frame>
  );
}

type VitalsT = Extract<Visual, { kind: "vitals" }>;

const statusStyle = {
  good: { label: "Good", icon: "✓", color: "var(--signal)" },
  "needs-improvement": { label: "Needs improvement", icon: "!", color: "var(--amber)" },
  poor: { label: "Poor", icon: "✕", color: "var(--danger)" },
} as const;

function Status({ s }: { s: keyof typeof statusStyle }) {
  const st = statusStyle[s];
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-fg-muted">
      <span aria-hidden className="grid size-4 place-items-center rounded-full text-[10px] font-bold text-void" style={{ background: st.color }}>
        {st.icon}
      </span>
      {st.label}
    </span>
  );
}

function Vitals({ title, caption, source, items }: VitalsT) {
  return (
    <Frame title={title} caption={caption} source={source}>
      <dl className="grid gap-4 sm:grid-cols-2">
        {items.map((m) => (
          <div key={m.metric} className="rounded-xl border border-line p-5">
            <dt className="text-sm text-fg-muted">
              {m.metric} <span className="font-mono text-xs text-fg-faint">({m.abbr})</span>
            </dt>
            <dd className="mt-3">
              <span className="flex items-baseline gap-3 font-mono text-4xl font-medium tracking-tight">
                <span className="text-fg-faint line-through decoration-1">{m.before}</span>
                <span aria-hidden className="text-2xl text-fg-faint">→</span>
                <span className="text-fg">{m.after}</span>
              </span>
              <span className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
                <Status s={m.beforeStatus} />
                <span aria-hidden className="text-fg-faint">→</span>
                <Status s={m.afterStatus} />
              </span>
              <span className="mt-3 block text-xs text-fg-faint">{m.threshold}</span>
            </dd>
          </div>
        ))}
      </dl>
    </Frame>
  );
}

type Events = Extract<Visual, { kind: "events" }>;

// Funnel events rendered like a live event log.
function EventStream({ title, caption, source, events }: Events) {
  return (
    <Frame title={title} caption={caption} source={source}>
      <ol className="overflow-hidden rounded-xl border border-line bg-void font-mono text-xs">
        {events.map((e, i) => (
          <li key={e.name} className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-line px-4 py-3 last:border-b-0">
            <span className="w-6 text-fg-faint">{String(i + 1).padStart(2, "0")}</span>
            <span className="min-w-[13rem] text-cyan">{e.name}</span>
            <span className="flex-1 font-sans text-sm text-fg-muted">{e.step}</span>
            <span className="flex gap-1.5">
              {e.platforms.map((p) => (
                <Chip key={p}>{p}</Chip>
              ))}
            </span>
          </li>
        ))}
      </ol>
    </Frame>
  );
}

type Arch = Extract<Visual, { kind: "architecture" }>;

// Three-column system map; the connectors carry a moving pulse (CSS only).
function Architecture({ title, caption, columns }: Arch) {
  return (
    <Frame title={title} caption={caption}>
      <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-stretch">
        {columns.map((col, i) => (
          <div key={col.label} className="contents">
            <div className="rounded-xl border border-line bg-void/60 p-4">
              <p className="eyebrow">{col.label}</p>
              <ul className="mt-3 flex flex-col gap-2">
                {col.items.map((it) => (
                  <li key={it.name} className="rounded-lg border border-line bg-glass px-3 py-2">
                    <span className="block text-sm text-fg">{it.name}</span>
                    <span className="block font-mono text-[11px] text-fg-faint">{it.detail}</span>
                  </li>
                ))}
              </ul>
            </div>
            {i < columns.length - 1 && (
              <div aria-hidden className="flex items-center justify-center py-1 md:px-1 md:py-0">
                <span className="flow-line-v relative block h-8 w-px md:hidden" style={{ animationDelay: `${i * 0.8}s` }} />
                <span className="flow-line relative hidden h-px w-10 md:block" style={{ animationDelay: `${i * 0.8}s` }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </Frame>
  );
}

type Cwv = Extract<Visual, { kind: "cwv" }>;

// Each metric: p75 value, status (icon + label), and a stacked distribution bar
// in status colours with 2px surface gaps; percentages are printed beneath.
function CwvPanel({ title, caption, source, verdict, items }: Cwv) {
  return (
    <Frame title={title} caption={caption} source={source}>
      <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-signal/30 px-3 py-1 font-mono text-xs text-fg">
        <span aria-hidden className="text-signal">✓</span> Core Web Vitals assessment: {verdict}
      </p>
      <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((m) => (
          <div key={m.abbr} className="rounded-xl border border-line bg-void/60 p-4">
            <dt className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs text-fg">{m.abbr}</span>
              <Status s={m.status} />
            </dt>
            <dd>
              <span className="mt-1 block text-xs text-fg-faint">{m.name}</span>
              <span className="mt-3 block font-mono text-3xl tracking-tight text-fg">{m.value}</span>
              <span className="mt-4 flex h-2 gap-[2px] overflow-hidden rounded-full">
                {m.dist.map((pct, i) => (
                  <span
                    key={i}
                    className="bar-grow block h-full"
                    style={{ width: `${pct}%`, background: ["var(--signal)", "var(--amber)", "var(--danger)"][i] }}
                  />
                ))}
              </span>
              <span className="mt-2 block font-mono text-[11px] text-fg-muted">
                Good {m.dist[0]}% · NI {m.dist[1]}% · Poor {m.dist[2]}%
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </Frame>
  );
}

type GalleryT = Extract<Visual, { kind: "gallery" }>;

// Production screenshots in "device" frames; each opens full size.
function Gallery({ title, caption, images, frameLabel = "admin · seo dashboard" }: GalleryT) {
  return (
    <Frame title={title} caption={caption}>
      <ul className="grid gap-5 md:grid-cols-2">
        {images.map((img) => (
          <li key={img.caption}>
            <a href={img.src.src} target="_blank" rel="noopener" className="group block overflow-hidden rounded-xl border border-line-strong bg-void transition-colors hover:border-cyan/50">
              <span aria-hidden className="flex items-center gap-1.5 border-b border-line px-3 py-2">
                <span className="size-2 rounded-full bg-line-strong" />
                <span className="size-2 rounded-full bg-line-strong" />
                <span className="size-2 rounded-full bg-line-strong" />
                <span className="ml-2 font-mono text-[10px] text-fg-faint">{img.label ?? frameLabel}</span>
                <span className="ml-auto font-mono text-[10px] text-fg-faint transition-colors group-hover:text-cyan">open full size ↗</span>
              </span>
              <Image
                src={img.src}
                alt={img.alt}
                sizes="(min-width: 1024px) 420px, (min-width: 768px) 45vw, 100vw"
                placeholder="blur"
                className="block h-auto w-full transition-transform duration-700 ease-out-expo group-hover:scale-[1.02]"
              />
            </a>
            <p className="mt-2 text-xs text-fg-muted">{img.caption}</p>
          </li>
        ))}
      </ul>
    </Frame>
  );
}

type TimelineT = Extract<Visual, { kind: "timeline" }>;

const eventStyle = {
  release: { label: "Release", color: "var(--cyan)" },
  field: { label: "Real users · CrUX", color: "var(--signal)" },
  lab: { label: "Lab test", color: "var(--violet)" },
} as const;

// Releases interleaved with the real-user results that followed; the spine
// draws itself as the reader scrolls (CSS view timeline).
function Timeline({ title, caption, source, events }: TimelineT) {
  return (
    <Frame title={title} caption={caption} source={source}>
      <div className="mb-6 flex flex-wrap gap-x-5 gap-y-2">
        {Object.values(eventStyle).map((s) => (
          <span key={s.label} className="inline-flex items-center gap-2 font-mono text-[11px] text-fg-muted">
            <span aria-hidden className="size-2.5 rounded-full" style={{ background: s.color }} />
            {s.label}
          </span>
        ))}
      </div>
      <ol className="relative">
        <span aria-hidden className="absolute top-2 bottom-2 left-[5px] w-px bg-line" />
        <span aria-hidden className="timeline-spine absolute top-2 bottom-2 left-[5px] w-px" style={{ background: "linear-gradient(var(--cyan), var(--signal))" }} />
        {events.map((e) => {
          const st = eventStyle[e.type];
          return (
            <li key={e.date + e.title} className="reveal relative grid gap-1 pb-7 pl-8 last:pb-0 sm:grid-cols-[9rem_1fr] sm:gap-6">
              <span aria-hidden className="absolute top-1.5 left-0 size-[11px] rounded-full border-2 border-base" style={{ background: st.color, boxShadow: `0 0 0 1px ${st.color}` }} />
              <span className="font-mono text-xs text-fg-muted sm:pt-0.5">{e.date}</span>
              <span>
                <span className="block font-mono text-[10px] tracking-wide text-fg-faint uppercase">{st.label}</span>
                <span className="mt-1 block font-medium text-pretty text-fg">{e.title}</span>
                <span className="mt-1 block text-sm text-pretty text-fg-muted">{e.detail}</span>
              </span>
            </li>
          );
        })}
      </ol>
    </Frame>
  );
}

type WaterfallT = Extract<Visual, { kind: "waterfall" }>;

// Schematic request waterfall, before vs after. Bars grow in request order when
// the figure scrolls into view; the dashed marker is first meaningful paint.
function Waterfall({ title, caption, source, scenarios }: WaterfallT) {
  const span = Math.max(...scenarios.flatMap((s) => [...s.rows.map((r) => r.end), s.paintAt])) * 1.08;
  const pct = (v: number) => `${(v / span) * 100}%`;
  return (
    <Frame title={title} caption={caption} source={source}>
      <PlayOnView className="grid gap-6 lg:grid-cols-2">
        {scenarios.map((sc, si) => (
          <div key={sc.label} className="rounded-xl border border-line bg-void/60 p-4 sm:p-5">
            <div className="flex items-baseline justify-between gap-3">
              <p className="eyebrow">{sc.label}</p>
              <p className={cx("font-mono text-sm", si === scenarios.length - 1 ? "text-signal" : "text-fg-muted")}>{sc.result}</p>
            </div>
            <ul className="relative mt-5 flex flex-col gap-3">
              {sc.rows.map((r) => (
                <li key={r.name} className="grid grid-cols-[minmax(0,7.5rem)_1fr] items-center gap-3">
                  <span className="truncate font-mono text-[11px] text-fg-muted">{r.name}</span>
                  <span className="relative h-3.5">
                    <span
                      className="wf-bar absolute inset-y-0 origin-left rounded-[3px]"
                      style={{
                        left: pct(r.start),
                        width: pct(r.end - r.start),
                        background: r.blocking ? "var(--chart-muted)" : "var(--chart-accent)",
                        ["--delay" as string]: `${r.start * 0.35}s`,
                        ["--dur" as string]: `${(r.end - r.start) * 0.35}s`,
                      }}
                    />
                  </span>
                </li>
              ))}
              <li aria-hidden className="pointer-events-none absolute inset-y-0 right-0 left-[calc(7.5rem+0.75rem)]">
                <span
                  className="wf-mark absolute -inset-y-1 w-0 border-l border-dashed border-signal"
                  style={{ left: pct(sc.paintAt), ["--delay" as string]: `${sc.paintAt * 0.35}s` }}
                >
                  <span className="absolute -top-5 -translate-x-1/2 font-mono text-[10px] whitespace-nowrap text-signal">paint</span>
                </span>
              </li>
            </ul>
            <p className="mt-4 flex gap-4 font-mono text-[10px] text-fg-faint">
              <span className="inline-flex items-center gap-1.5">
                <span aria-hidden className="h-2 w-3 rounded-sm" style={{ background: "var(--chart-muted)" }} /> render-blocking
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span aria-hidden className="h-2 w-3 rounded-sm" style={{ background: "var(--chart-accent)" }} /> non-blocking
              </span>
            </p>
          </div>
        ))}
      </PlayOnView>
    </Frame>
  );
}

type DashboardT = Extract<Visual, { kind: "dashboard" }>;

// Verified numbers, grouped by the Google tool they come from, so a visitor can
// see the proof without opening anything.
function Dashboard({ title, caption, groups }: DashboardT) {
  return (
    <section aria-label={title} className="flex flex-col gap-4">
      <div>
        <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
        {caption && <p className="mt-1 text-sm text-pretty text-fg-muted">{caption}</p>}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {groups.map((g) => (
          <div key={g.source} data-spotlight className="glass reveal flex flex-col rounded-2xl p-5 sm:p-6">
            <p className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-2 text-sm font-medium text-fg">
                <span aria-hidden className="size-2 rounded-full bg-signal shadow-[0_0_8px_var(--signal)]" />
                {g.source}
              </span>
              <span className="font-mono text-[11px] text-fg-faint">{g.period}</span>
            </p>
            <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-5">
              {g.tiles.map((t) => (
                <div key={t.label}>
                  <dt className="sr-only">{t.label}</dt>
                  <dd>
                    <span className="block font-mono text-2xl tracking-tight text-fg sm:text-3xl">{t.value}</span>
                    <span className="mt-1 block text-xs text-pretty text-fg-muted">{t.label}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </section>
  );
}

// Accessible table view of the trend: weekly totals.
function WeeklyTable({ daily }: { daily: Day[] }) {
  const weeks: { from: string; to: string; c: number; i: number }[] = [];
  daily.forEach((r, k) => {
    if (k % 7 === 0) weeks.push({ from: r.d, to: r.d, c: 0, i: 0 });
    const w = weeks.at(-1)!;
    w.to = r.d;
    w.c += r.c;
    w.i += r.i;
  });
  const fmt = (d: string) => new Date(`${d}T00:00:00Z`).toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "UTC" });
  return (
    <details className="mt-4 text-sm">
      <summary className="cursor-pointer font-mono text-xs text-fg-muted hover:text-fg">View weekly data table</summary>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[22rem] text-left">
          <thead>
            <tr className="border-b border-line-strong font-mono text-[11px] text-fg-faint uppercase">
              <th scope="col" className="py-2 font-normal">Week</th>
              <th scope="col" className="py-2 text-right font-normal">Impressions</th>
              <th scope="col" className="py-2 text-right font-normal">Clicks</th>
            </tr>
          </thead>
          <tbody>
            {weeks.map((w) => (
              <tr key={w.from} className="border-b border-line">
                <th scope="row" className="py-2 font-normal text-fg-muted">
                  {fmt(w.from)} – {fmt(w.to)}
                </th>
                <td className="py-2 text-right font-mono text-fg tabular-nums">{w.i.toLocaleString("en-IN")}</td>
                <td className="py-2 text-right font-mono text-fg tabular-nums">{w.c.toLocaleString("en-IN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}

type DownloadsT = Extract<Visual, { kind: "downloads" }>;

function Downloads({ title, caption, files }: DownloadsT) {
  return (
    <Frame title={title} caption={caption}>
      <ul className="grid gap-2 sm:grid-cols-2">
        {files.map((f) => (
          <li key={f.href}>
            <a href={f.href} download className="group flex items-center justify-between gap-4 rounded-xl border border-line bg-void/60 px-4 py-3 transition-colors hover:border-cyan/50">
              <span>
                <span className="block font-mono text-sm text-fg">{f.label}</span>
                <span className="block text-xs text-fg-muted">{f.detail}</span>
              </span>
              <span aria-hidden className="font-mono text-xs text-fg-faint transition-colors group-hover:text-cyan">
                CSV ↓
              </span>
            </a>
          </li>
        ))}
      </ul>
    </Frame>
  );
}

type JourneyT = Extract<Visual, { kind: "journey" }>;

const actor = {
  customer: { label: "Customer", color: "var(--violet)" },
  auto: { label: "Automatic WhatsApp", color: "var(--signal)" },
  team: { label: "Team", color: "var(--cyan)" },
} as const;

// A customer's path through the system, phase by phase. A pulse travels down
// each phase's connector (transform-only, so it stays on the compositor).
function Journey({ title, caption, phases }: JourneyT) {
  return (
    <Frame title={title} caption={caption}>
      <div className="mb-6 flex flex-wrap gap-x-5 gap-y-2">
        {Object.values(actor).map((a) => (
          <span key={a.label} className="inline-flex items-center gap-2 font-mono text-[11px] text-fg-muted">
            <span aria-hidden className="size-2.5 rounded-full" style={{ background: a.color }} />
            {a.label}
          </span>
        ))}
      </div>
      <div className="grid gap-8 lg:grid-cols-3 lg:gap-6">
        {phases.map((ph, pi) => (
          <section key={ph.name} aria-label={ph.name}>
            <p className="font-mono text-xs tracking-wide text-fg-faint uppercase">
              {String(pi + 1).padStart(2, "0")} · {ph.name}
            </p>
            <ol className="relative mt-4 flex flex-col gap-3">
              <span aria-hidden className="flow-line-v absolute top-3 bottom-3 left-[11px] w-px" style={{ animationDelay: `${pi * 0.8}s` }} />
              {ph.steps.map((st) => {
                const a = actor[st.who];
                return (
                  <li key={st.title} className="reveal relative flex gap-3">
                    <span aria-hidden className="relative z-10 mt-3 grid size-6 shrink-0 place-items-center rounded-full border-2 border-base" style={{ background: a.color }} />
                    <div className="min-w-0 flex-1 rounded-xl border border-line bg-void/60 px-4 py-3">
                      <p className="flex flex-wrap items-baseline justify-between gap-x-3">
                        <span className="text-sm font-medium text-fg">{st.title}</span>
                        <span className="font-mono text-[11px] text-fg-faint">{st.when}</span>
                      </p>
                      <p className="mt-1 text-xs text-pretty text-fg-muted">{st.detail}</p>
                      <span className="sr-only">By: {a.label}</span>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </div>
    </Frame>
  );
}
