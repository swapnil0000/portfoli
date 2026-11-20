"use client";

import { useEffect, useRef } from "react";

// Plays a figure's CSS sequence once, when it scrolls into view. Without JS the
// content simply shows in its final state: `data-armed` (set on mount) hides it,
// `data-play` runs the animation and `data-done` pins the final state.
const DONE_AFTER_MS = 3000;

export function PlayOnView({ className, children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.dataset.armed = "";
    let done = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        el.dataset.play = "";
        io.disconnect();
        // Guaranteed end state: even if the browser throttles the animation
        // (background tab, low-power mode), content is fully shown afterwards.
        done = window.setTimeout(() => (el.dataset.done = ""), DONE_AFTER_MS);
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(done);
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
