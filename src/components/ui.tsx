import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

export function Container({ className, ...props }: ComponentProps<"div">) {
  return <div className={cx("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)} {...props} />;
}

type ButtonProps = ComponentProps<typeof Link> & { variant?: "primary" | "ghost" };

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return (
    <Link
      className={cx(
        "inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium transition-[transform,background-color,border-color] duration-300 ease-out-expo active:scale-[0.98]",
        variant === "primary"
          ? "bg-fg text-void hover:bg-white"
          : "border border-line-strong text-fg hover:border-cyan/60 hover:bg-glass-strong",
        className,
      )}
      {...props}
    />
  );
}

export function Chip({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full border border-line px-2.5 py-0.5 font-mono text-[11px] tracking-wide text-fg-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lede,
  as: Tag = "h2",
}: {
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  as?: "h1" | "h2";
}) {
  return (
    <div className="max-w-3xl">
      <p className="eyebrow">{eyebrow}</p>
      <Tag className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl">{title}</Tag>
      {lede && <p className="mt-4 text-base text-pretty text-fg-muted sm:text-lg">{lede}</p>}
    </div>
  );
}

// Mono "telemetry" readout used for metrics across the site.
export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-mono text-2xl font-medium tracking-tight text-fg sm:text-3xl">{value}</span>
      <span className="text-xs text-pretty text-fg-muted sm:text-sm">{label}</span>
    </div>
  );
}

export function LiveDot({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cx("inline-block size-1.5 animate-pulse-dot rounded-full bg-signal shadow-[0_0_8px_var(--signal)]", className)}
    />
  );
}

export { cx };
