"use client";

import { useRef, useState } from "react";
import { PlayOnView } from "./play-on-view";

export type Day = { d: string; c: number; i: number; ctr: number; p: number };
type Props = {
  daily: Day[];
  annotations: { d: string; label: string }[];
  panels: { key: "i" | "c"; title: string }[];
};

const W = 760, L = 44, R = 14, TOP = 52, PH = 132, GAP = 44, XAXIS = 26;
const fmtDate = (d: string) => new Date(`${d}T00:00:00Z`).toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "UTC" });
const compact = (n: number) => (n >= 1000 ? `${+(n / 1000).toFixed(1)}K` : String(n));
const niceMax = (v: number) => {
  const p = 10 ** Math.floor(Math.log10(v));
  return [1, 2, 2.5, 5, 10].map((m) => m * p).find((m) => m >= v)!;
};

// Small multiples on one time axis (never a dual axis): each panel has its own
// scale. Hover or arrow keys move a crosshair; the tooltip carries all four metrics.
export function TrendChart({ daily, annotations, panels }: Props) {
  const ref = useRef<SVGSVGElement>(null);
  const [idx, setIdx] = useState<number | null>(null);
  const n = daily.length;
  const H = TOP + panels.length * PH + (panels.length - 1) * GAP + XAXIS;
  const x = (i: number) => L + (i * (W - L - R)) / (n - 1);
  const panelTop = (k: number) => TOP + k * (PH + GAP);
  const indexOf = (d: string) => daily.findIndex((r) => r.d === d);
  const ticks = daily.map((r, i) => ({ r, i })).filter(({ r, i }) => i === 0 || i === n - 1 || r.d.endsWith("-01"));

  const pick = (clientX: number) => {
    const box = ref.current!.getBoundingClientRect();
    const sx = ((clientX - box.left) / box.width) * W;
    setIdx(Math.max(0, Math.min(n - 1, Math.round(((sx - L) / (W - L - R)) * (n - 1)))));
  };
  const day = idx === null ? null : daily[idx];

  return (
    <PlayOnView className="relative">
      <div
        tabIndex={0}
        role="group"
        aria-label="Daily Google Search clicks and impressions. Use left and right arrow keys to read each day."
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") setIdx((v) => Math.min(n - 1, (v ?? -1) + 1));
          if (e.key === "ArrowLeft") setIdx((v) => Math.max(0, (v ?? n) - 1));
          if (e.key === "Escape") setIdx(null);
        }}
        onBlur={() => setIdx(null)}
        className="rounded-xl outline-offset-4"
      >
        <svg
          ref={ref}
          viewBox={`0 0 ${W} ${H}`}
          className="block w-full touch-pan-y select-none"
          onPointerMove={(e) => pick(e.clientX)}
          onPointerDown={(e) => pick(e.clientX)}
          onPointerLeave={() => setIdx(null)}
          aria-hidden
        >
          {panels.map((p, k) => {
            const vals = daily.map((r) => r[p.key]);
            const max = niceMax(Math.max(...vals));
            const top = panelTop(k);
            const y = (v: number) => top + PH - (v / max) * PH;
            const line = daily.map((r, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(r[p.key]).toFixed(1)}`).join("");
            const area = `${line}L${x(n - 1)},${top + PH}L${x(0)},${top + PH}Z`;
            return (
              <g key={p.key}>
                <text x={L} y={top - 12} className="fill-fg text-[12px] font-medium">
                  {p.title}
                </text>
                {[0, max / 2, max].map((t) => (
                  <g key={t}>
                    <line x1={L} x2={W - R} y1={y(t)} y2={y(t)} stroke="var(--line)" strokeWidth={1} />
                    <text x={L - 8} y={y(t) + 4} textAnchor="end" className="fill-fg-faint font-mono text-[10px]">
                      {compact(t)}
                    </text>
                  </g>
                ))}
                <g className="wipe">
                  <path d={area} fill="var(--chart-accent)" opacity={0.12} />
                  <path d={line} fill="none" stroke="var(--chart-accent)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
                </g>
                {day && <circle cx={x(idx!)} cy={y(day[p.key])} r={4.5} fill="var(--chart-accent)" stroke="var(--base)" strokeWidth={2} />}
              </g>
            );
          })}

          {annotations.map((a, k) => {
            const i = indexOf(a.d);
            if (i < 0) return null;
            const right = x(i) > W * 0.78;
            return (
              <g key={a.d}>
                <line x1={x(i)} x2={x(i)} y1={TOP - 4} y2={H - XAXIS} stroke="var(--signal)" strokeWidth={1} strokeDasharray="3 4" />
                <text x={x(i) + (right ? -6 : 6)} y={TOP - 30 + (k % 2) * 13} textAnchor={right ? "end" : "start"} className="fill-signal font-mono text-[10px]">
                  {a.label}
                </text>
              </g>
            );
          })}

          {ticks.map(({ r, i }) => (
            <text key={r.d} x={x(i)} y={H - 8} textAnchor={i === 0 ? "start" : i === n - 1 ? "end" : "middle"} className="fill-fg-faint font-mono text-[10px]">
              {fmtDate(r.d)}
            </text>
          ))}

          {day && <line x1={x(idx!)} x2={x(idx!)} y1={TOP} y2={H - XAXIS} stroke="var(--line-strong)" strokeWidth={1} />}
        </svg>

        {day && (
          <div
            role="status"
            className="pointer-events-none absolute top-8 z-10 w-44 rounded-lg border border-line-strong bg-raised/95 px-3 py-2.5 text-xs shadow-xl shadow-black/50 backdrop-blur"
            style={{ left: `clamp(0px, calc(${(x(idx!) / W) * 100}% - 5.5rem), calc(100% - 11rem))` }}
          >
            <p className="font-mono text-fg-muted">{fmtDate(day.d)} 2026</p>
            <dl className="mt-1.5 grid grid-cols-[1fr_auto] gap-x-3 gap-y-0.5">
              <dt className="text-fg-muted">Impressions</dt>
              <dd className="text-right font-mono text-fg">{day.i}</dd>
              <dt className="text-fg-muted">Clicks</dt>
              <dd className="text-right font-mono text-fg">{day.c}</dd>
              <dt className="text-fg-muted">CTR</dt>
              <dd className="text-right font-mono text-fg">{day.ctr}%</dd>
              <dt className="text-fg-muted">Avg position</dt>
              <dd className="text-right font-mono text-fg">{day.p}</dd>
            </dl>
          </div>
        )}
      </div>
    </PlayOnView>
  );
}
