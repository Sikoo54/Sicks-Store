// Scrolling text strip: marketing words + category color separators.
"use client";

import { motion } from "framer-motion";
import { CATEGORY_META, CATEGORY_ORDER } from "@/lib/data";

const EASE = [0.22, 1, 0.36, 1] as const;

const WORDS = [
  "New drop every Friday",
  "Free shipping over $100",
  "30-day returns",
  "100% authentic",
  "FW26 is live",
  "Rack up or go home",
];

export default function Marquee() {
  const separators = CATEGORY_ORDER.map((c) => CATEGORY_META[c].color);

  return (
    <section aria-hidden className="relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: EASE }}
        className="relative -rotate-[1.5deg] scale-[1.02]"
      >
        <div className="group flex overflow-hidden border-y-4 border-ink bg-chalk py-3.5 shadow-card">
          <div className="flex w-max shrink-0 animate-marquee group-hover:[animation-play-state:paused]">
            {[...WORDS, ...WORDS].map((word, i) => (
              <span
                key={`${word}-${i}`}
                className="flex shrink-0 items-center gap-6 pr-6 font-display text-lg font-bold uppercase tracking-[0.15em] text-ink"
              >
                {word}
                <span
                  className="inline-block h-3 w-3"
                  style={{ backgroundColor: separators[i % separators.length] }}
                />
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
