// Lenis smooth-scroll, desktop only (≥1024px), pauses when body scroll locks.
"use client";

import { useEffect, useState } from "react";
import Lenis from "lenis";

const DESKTOP = "(min-width: 1024px)";

export default function SmoothScroll() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP);
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const lenis = new Lenis({
      lerp: 0.09,
      smoothWheel: true,
      touchMultiplier: 1.6,
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    const lock = () => {
      document.body.style.overflow === "hidden"
        ? lenis.stop()
        : lenis.start();
    };

    const bodyObserver = new MutationObserver(lock);
    bodyObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ["style"],
    });

    return () => {
      cancelAnimationFrame(rafId);
      bodyObserver.disconnect();
      lenis.destroy();
    };
  }, [enabled]);

  return null;
}
