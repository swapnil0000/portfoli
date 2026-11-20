"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cta, primaryNav } from "@/content/nav";
import { cx } from "@/components/ui";
import { isActive } from "./nav-links";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((o) => !o)}
        className="grid size-10 place-items-center rounded-full border border-line text-fg"
      >
        <span className="relative block h-3 w-4">
          <span className={cx("absolute left-0 h-px w-4 bg-current transition-transform duration-300", open ? "top-1.5 rotate-45" : "top-0")} />
          <span className={cx("absolute left-0 h-px w-4 bg-current transition-transform duration-300", open ? "top-1.5 -rotate-45" : "top-3")} />
        </span>
      </button>

      <div
        id="mobile-menu"
        hidden={!open}
        className="fixed inset-x-3 top-[4.5rem] bottom-3 overflow-y-auto rounded-3xl border border-line bg-base/95 p-6 backdrop-blur-xl"
      >
        <nav aria-label="Mobile">
          <ul className="flex flex-col">
            {primaryNav.map((item, i) => (
              <li key={item.href} className="border-b border-line">
                <Link
                  href={item.href}
                  onNavigate={() => setOpen(false)}
                  aria-current={isActive(pathname, item.href) ? "page" : undefined}
                  className="flex items-baseline justify-between py-4 text-2xl font-medium tracking-tight aria-[current=page]:text-cyan"
                >
                  {item.label}
                  <span className="font-mono text-xs text-fg-faint">0{i + 1}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Link
          href={cta.href}
          onNavigate={() => setOpen(false)}
          className="mt-8 flex h-12 items-center justify-center rounded-full bg-fg font-medium text-void"
        >
          {cta.label}
        </Link>
      </div>
    </div>
  );
}
