"use client";

import { useState } from "react";
import { cx } from "@/components/ui";

type Props = { email: string; whatsapp: string; services: string[] };

const businessTypes = ["Startup / SaaS", "E-commerce / D2C", "Education / coaching", "Creator / personal brand", "Agency", "Other"];
const sizes = ["Small — a quick fix or one page", "Medium — a website or campaign setup", "Large — a full product or ongoing work", "Not sure yet"];
const timelines = ["As soon as possible", "Within a month", "1–3 months", "Flexible"];

// The brief is assembled client-side and handed to email or WhatsApp, so the
// form works without a backend. (Phase 4 adds server delivery + lead tracking.)
export function BriefForm({ email, whatsapp, services }: Props) {
  const [picked, setPicked] = useState<string[]>([]);
  const [sent, setSent] = useState(false);

  const toggle = (s: string) => setPicked((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));

  const compose = (form: HTMLFormElement) => {
    const f = new FormData(form);
    const lines = [
      `Name: ${f.get("name")}`,
      `Contact: ${f.get("contact")}`,
      `Business: ${f.get("business")}`,
      `Website: ${f.get("website") || "—"}`,
      `Needs: ${picked.join(", ") || "Not sure yet"}`,
      `Project size: ${f.get("size")}`,
      `Timeline: ${f.get("timeline")}`,
      "",
      String(f.get("message") || ""),
    ];
    return { subject: `Project enquiry — ${f.get("name")}`, body: lines.join("\n") };
  };

  const send = (via: "email" | "whatsapp", form: HTMLFormElement | null) => {
    if (!form || !form.reportValidity()) return;
    const { subject, body } = compose(form);
    const url =
      via === "email"
        ? `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
        : `https://wa.me/${whatsapp}?text=${encodeURIComponent(`${subject}\n\n${body}`)}`;
    window.open(url, via === "email" ? "_self" : "_blank", "noopener");
    setSent(true);
  };

  const field = "mt-2 w-full rounded-xl border border-line-strong bg-void/60 px-4 py-3 text-fg outline-none transition-colors placeholder:text-fg-faint focus:border-cyan/60";
  const label = "text-sm font-medium text-fg";
  const unavailable = !email && !whatsapp;

  return (
    <form
      className="glass flex flex-col gap-6 rounded-2xl p-6 sm:p-8"
      onSubmit={(e) => {
        e.preventDefault();
        send(email ? "email" : "whatsapp", e.currentTarget);
      }}
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <label className={label}>
          Your name
          <input name="name" required autoComplete="name" className={field} placeholder="Priya Sharma" />
        </label>
        <label className={label}>
          Email or phone
          <input name="contact" required autoComplete="email" className={field} placeholder="you@company.com" />
        </label>
        <label className={label}>
          Type of business
          <select name="business" required className={field} defaultValue="">
            <option value="" disabled>
              Choose one
            </option>
            {businessTypes.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </label>
        <label className={label}>
          Website (if you have one)
          <input name="website" type="url" inputMode="url" className={field} placeholder="https://" />
        </label>
      </div>

      <fieldset>
        <legend className={label}>What do you need help with?</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {services.map((s) => {
            const on = picked.includes(s);
            return (
              <button
                key={s}
                type="button"
                aria-pressed={on}
                onClick={() => toggle(s)}
                className={cx(
                  "rounded-full border px-4 py-2 text-sm transition-colors",
                  on ? "border-cyan/60 bg-cyan/10 text-fg" : "border-line-strong text-fg-muted hover:text-fg",
                )}
              >
                {on && <span aria-hidden>✓ </span>}
                {s}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="grid gap-6 sm:grid-cols-2">
        <label className={label}>
          Project size
          <select name="size" required className={field} defaultValue="">
            <option value="" disabled>
              Choose one
            </option>
            {sizes.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <label className={label}>
          Timeline
          <select name="timeline" required className={field} defaultValue="">
            <option value="" disabled>
              Choose one
            </option>
            {timelines.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
      </div>

      <label className={label}>
        What&apos;s going on?
        <textarea name="message" required rows={5} className={field} placeholder="What's not working today, and what would success look like?" />
      </label>

      <div className="flex flex-wrap items-center gap-3">
        {email && (
          <button type="submit" className="inline-flex h-12 items-center rounded-full bg-fg px-6 font-medium text-void transition-colors hover:bg-white">
            Send by email
          </button>
        )}
        {whatsapp && (
          <button
            type={email ? "button" : "submit"}
            onClick={email ? (e) => send("whatsapp", e.currentTarget.form) : undefined}
            className="inline-flex h-12 items-center rounded-full border border-line-strong px-6 font-medium text-fg transition-colors hover:border-signal/60"
          >
            Send on WhatsApp
          </button>
        )}
        {unavailable && <p className="text-sm text-amber">Contact details are being set up — check back soon.</p>}
        {sent && (
          <p role="status" className="text-sm text-signal">
            Opening your app with the brief filled in. I reply within one working day.
          </p>
        )}
      </div>
    </form>
  );
}
