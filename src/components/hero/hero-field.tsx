"use client";

import { useEffect, useRef, useState } from "react";

type NavigatorHints = Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };

// Decorative WebGL backdrop. It never competes with the page: the renderer is
// fetched only after `load` + idle (first interaction on touch devices), and
// skipped entirely on Data Saver.
export function HeroField() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const nav = navigator as NavigatorHints;
    if (nav.connection?.saveData) return;

    let destroyed = false;
    let field: { destroy: () => void } | null = null;
    let idleId = 0;

    const boot = async () => {
      const { createField } = await import("./field-renderer");
      if (destroyed || !ref.current) return;
      field = createField(ref.current, {
        animate: !matchMedia("(prefers-reduced-motion: reduce)").matches,
        dense: innerWidth >= 768 && (nav.deviceMemory ?? 8) >= 4,
      });
      if (field) setReady(true);
    };
    const schedule = () => {
      idleId = "requestIdleCallback" in window ? requestIdleCallback(() => void boot(), { timeout: 2500 }) : (setTimeout as Window["setTimeout"])(boot, 200);
    };

    // Touch devices: wait for the first scroll/tap so shader compilation never
    // competes with the initial load on slower phones.
    const touchEvents = ["scroll", "touchstart", "pointerdown", "keydown"] as const;
    const onFirstInteraction = () => {
      touchEvents.forEach((t) => window.removeEventListener(t, onFirstInteraction));
      schedule();
    };
    const afterLoad = () => {
      if (matchMedia("(pointer: coarse)").matches) {
        touchEvents.forEach((t) => window.addEventListener(t, onFirstInteraction, { once: true, passive: true }));
      } else schedule();
    };

    if (document.readyState === "complete") afterLoad();
    else window.addEventListener("load", afterLoad, { once: true });

    return () => {
      destroyed = true;
      window.removeEventListener("load", afterLoad);
      touchEvents.forEach((t) => window.removeEventListener(t, onFirstInteraction));
      if ("cancelIdleCallback" in window) cancelIdleCallback(idleId);
      else clearTimeout(idleId);
      field?.destroy();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute inset-0 -z-10 size-full transition-opacity duration-[1600ms] ease-out-expo [mask-image:linear-gradient(to_bottom,transparent_52%,#000_76%,#000_90%,transparent_100%)] ${ready ? "opacity-100" : "opacity-0"}`}
    />
  );
}
