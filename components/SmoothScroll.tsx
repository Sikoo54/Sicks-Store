"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll() {
  useEffect(() => {
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
  }, []);

  return null;
}
