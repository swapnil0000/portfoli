import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const ogSize = { width: 1200, height: 630 };

// Shared 1200×630 share card so every page previews consistently on
// LinkedIn, WhatsApp and X.
export function renderOg({ eyebrow, title, footer }: { eyebrow: string; title: string; footer?: string[] }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "radial-gradient(ellipse at 50% -10%, #12324a 0%, #04050a 60%)",
          color: "#e9edf7",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 26, color: "#9aa3b8" }}>
          <div style={{ width: 12, height: 12, borderRadius: 12, background: "#3dffa8" }} />
          {eyebrow}
        </div>
        <div style={{ display: "flex", fontSize: title.length > 60 ? 60 : 76, fontWeight: 700, letterSpacing: -2, lineHeight: 1.08 }}>
          {title}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#636c82" }}>
          <div style={{ display: "flex", gap: 28 }}>
            {(footer ?? []).map((f) => (
              <span key={f}>{f}</span>
            ))}
          </div>
          <span style={{ color: "#5ef2ff" }}>{site.name}</span>
        </div>
      </div>
    ),
    ogSize,
  );
}
