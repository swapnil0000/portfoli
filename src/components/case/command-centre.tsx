"use client";

import { useEffect, useRef, useState } from "react";
import { LiveDot } from "@/components/ui";

export type CommandCentreData = {
  sources: string[];
  notices: { org: string; kind: string; title: string }[];
  stats: { value: string; label: string }[];
  sweepSeconds: number; // the production cycle, shown as a countdown
  caption: string;
};

const FEED_SIZE = 5;
const FEED_INTERVAL_MS = 2600;
const RADAR_TURN_S = 5; // visual sweep speed, independent of the real 5-minute cycle

// A replay of the notice monitor, styled as a HUD. Radar, pipeline and marquee
// are pure CSS; JS only advances the feed and the countdown, and only while the
// panel is on screen with motion allowed.
export function CommandCentre({ sources, notices, stats, sweepSeconds, caption }: CommandCentreData) {
  const ref = useRef<HTMLDivElement>(null);
  const [tick, setTick] = useState(0);
  const [remaining, setRemaining] = useState(sweepSeconds);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let feed = 0;
    let clock = 0;
    const start = () => {
      if (feed) return;
      setActive(true);
      feed = window.setInterval(() => setTick((t) => t + 1), FEED_INTERVAL_MS);
      clock = window.setInterval(() => setRemaining((s) => (s <= 1 ? sweepSeconds : s - 1)), 1000);
    };
    const stop = () => {
      clearInterval(feed);
      clearInterval(clock);
      feed = clock = 0;
      setActive(false);
    };
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0.25 });
    io.observe(el);
    return () => {
      io.disconnect();
      stop();
    };
  }, [sweepSeconds]);

  // Newest first; each row's key is its position in the endless stream, so only
  // the incoming row mounts (and animates) on each tick.
  const rows = Array.from({ length: FEED_SIZE }, (_, i) => {
    const n = tick - i;
    return { n, ...notices[((n % notices.length) + notices.length) % notices.length] };
  });
  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");

  return (
    <figure ref={ref} className={`relative overflow-hidden rounded-3xl border border-line-strong bg-base ${active ? "" : "hud-paused"}`} style={{ ["--sweep" as string]: `${RADAR_TURN_S}s` }}>
      <div aria-hidden className="scanline pointer-events-none absolute inset-0" />
      <div aria-hidden className="absolute inset-x-0 top-0 h-px" style={{ background: "var(--grad)" }} />

      <div className="relative flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3 font-mono text-[11px] tracking-wide text-fg-muted uppercase">
        <span className="flex items-center gap-2 text-fg">
          <LiveDot /> SEO command centre · live replay
        </span>
        <span>
          Next sweep <span className="text-cyan tabular-nums">{mm}:{ss}</span>
        </span>
      </div>

      <div className="relative grid gap-px bg-line md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="flex flex-col items-center gap-5 bg-base p-6">
          <Radar count={sources.length} />
          <p className="text-center font-mono text-xs text-fg-muted">
            <span className="text-fg">{sources.length}</span> official sources ·{" "}
            <span className="text-fg">{sweepSeconds / 60}-min</span> cycle
          </p>
        </div>

        <div className="flex min-w-0 flex-col bg-base p-5 sm:p-6">
          <p className="eyebrow">Incoming notices</p>
          <ol aria-label="Recently detected notices" className="mt-4 flex flex-col gap-2">
            {rows.map((r, i) => (
              <li
                key={r.n}
                className={`feed-in rounded-xl border px-3.5 py-3 ${i === 0 ? "border-cyan/30 bg-glass" : "border-line"}`}
              >
                <div className="flex items-center justify-between gap-3 font-mono text-[11px]">
                  <span className="text-cyan">{r.org}</span>
                  <span className="text-fg-faint">{r.kind}</span>
                </div>
                <p className="mt-1 line-clamp-1 text-sm text-fg">{r.title}</p>
                <p className="mt-1.5 flex gap-3 font-mono text-[10px] text-fg-faint">
                  <span className={i === 0 ? "text-signal" : ""}>✓ email</span>
                  <span className={i === 0 ? "text-signal" : ""}>✓ google chat</span>
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <Pipeline />

      <div className="relative grid grid-cols-2 gap-px border-t border-line bg-line sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-base px-5 py-4">
            <p className="font-mono text-xl text-fg">{s.value}</p>
            <p className="mt-0.5 text-xs text-fg-muted">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="relative overflow-hidden border-t border-line py-2.5" aria-hidden>
        <div className="marquee flex w-max gap-6 font-mono text-[11px] whitespace-nowrap text-fg-faint">
          {[...sources, ...sources].map((s, i) => (
            <span key={i}>◇ {s}</span>
          ))}
        </div>
      </div>

      <figcaption className="relative border-t border-line px-5 py-3 font-mono text-[11px] text-fg-faint">{caption}</figcaption>
    </figure>
  );
}

// Blips placed on a golden-angle spiral; each flares as the sweep passes it
// (transform + opacity only, so the animation stays on the compositor).
function Radar({ count }: { count: number }) {
  const golden = 137.508;
  return (
    <div aria-hidden className="relative aspect-square w-full max-w-[17rem] overflow-hidden rounded-full border border-line-strong">
      {[0.33, 0.66].map((r) => (
        <div key={r} className="absolute top-1/2 left-1/2 rounded-full border border-line" style={{ width: `${r * 100}%`, height: `${r * 100}%`, transform: "translate(-50%,-50%)" }} />
      ))}
      <div className="absolute inset-y-0 left-1/2 w-px bg-line" />
      <div className="absolute inset-x-0 top-1/2 h-px bg-line" />
      <div className="radar-sweep absolute inset-0 rounded-full" />
      {Array.from({ length: count }, (_, i) => {
        const angle = (i * golden) % 360;
        const radius = 14 + 34 * Math.sqrt((i + 0.5) / count);
        const rad = ((angle - 90) * Math.PI) / 180;
        return (
          <span
            key={i}
            className="radar-blip absolute size-1.5 rounded-full bg-cyan"
            style={{
              left: `${50 + radius * Math.cos(rad)}%`,
              top: `${50 + radius * Math.sin(rad)}%`,
              // the sweep's bright edge sits ~51° ahead of its rotation
              ["--delay" as string]: `${(((angle - 51 + 360) % 360) / 360) * RADAR_TURN_S - RADAR_TURN_S}s`,
            }}
          />
        );
      })}
      <div className="absolute top-1/2 left-1/2 size-2 -translate-1/2 rounded-full bg-fg shadow-[0_0_14px_var(--cyan)]" />
    </div>
  );
}

const steps = [
  { name: "Detect", detail: "Page diff or SSC API" },
  { name: "Dedupe", detail: "One alert per organisation" },
  { name: "Alert", detail: "Email + Google Chat" },
  { name: "Publish", detail: "Content team goes first" },
];

function Pipeline() {
  return (
    <ol className="relative grid gap-4 border-t border-line p-5 sm:grid-cols-4 sm:gap-0 sm:p-6">
      {steps.map((s, i) => (
        <li key={s.name} className="relative flex items-center gap-3 sm:flex-col sm:items-start sm:gap-2 sm:pr-6">
          <span className="grid size-7 shrink-0 place-items-center rounded-full border border-cyan/40 font-mono text-[11px] text-cyan">{i + 1}</span>
          <span>
            <span className="block text-sm font-medium text-fg">{s.name}</span>
            <span className="block text-xs text-fg-muted">{s.detail}</span>
          </span>
          {i < steps.length - 1 && <span aria-hidden className="flow-line absolute top-3.5 right-2 left-10 hidden h-px sm:block" style={{ animationDelay: `${i * 0.6}s` }} />}
        </li>
      ))}
    </ol>
  );
}
