"use client";

import { lazy, Suspense, useEffect, useState } from "react";

// cmdk + its dialog only download the first time someone opens the palette,
// so it costs nothing on initial load.
const CommandPalette = lazy(() => import("./command-palette"));

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setLoaded(true);
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setLoaded(true);
          setOpen(true);
        }}
        onPointerEnter={() => setLoaded(true)}
        className="flex h-10 items-center gap-2 rounded-full border border-line px-3 text-fg-muted transition-colors hover:border-line-strong hover:text-fg"
      >
        <svg viewBox="0 0 16 16" className="size-4" aria-hidden>
          <circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <path d="m10.5 10.5 3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        <span className="sr-only">Open command menu</span>
        <kbd className="hidden font-mono text-[11px] sm:inline">⌘K</kbd>
      </button>
      {loaded && (
        <Suspense fallback={null}>
          <CommandPalette open={open} onOpenChange={setOpen} />
        </Suspense>
      )}
    </>
  );
}
