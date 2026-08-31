// Grid of category tiles linking to each category page.
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { CATEGORY_META, CATEGORY_ORDER, productsByCategory } from "@/lib/data";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function CategoryTiles() {
  return (
    <section className="bg-ink">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-display text-xs font-bold uppercase tracking-[0.25em] text-orange">
              The full rack
            </p>
            <h2 className="mt-3 font-display text-4xl font-bold uppercase tracking-tight text-chalk sm:text-5xl">
              Shop by category.
            </h2>
          </div>
          <p className="max-w-sm text-sm text-chalk/55">
            Five sections, one drop. Pick your lane and rack up.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {CATEGORY_ORDER.map((category, index) => {
            const meta = CATEGORY_META[category];
            const count = productsByCategory(category).length;
            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: index * 0.06, ease: EASE }}
              >
                <Link
                  href={`/category/${category}`}
                  className="group relative flex h-44 flex-col justify-between overflow-hidden p-4 transition-transform duration-300 hover:-translate-y-1.5"
                  style={{ backgroundColor: meta.color }}
                >
                  <div className="absolute inset-0 halftone-light opacity-40" />
                  <div className="relative flex items-center justify-between">
                    <span className="grid h-9 w-9 place-items-center bg-ink font-display text-sm font-bold text-chalk">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <ArrowUpRight
                      size={22}
                      className="text-ink opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-100"
                    />
                  </div>
                  <div className="relative">
                    <p className="font-display text-3xl font-bold uppercase leading-none tracking-tight">
                      {meta.label}
                    </p>
                    <p className="mt-1 font-display text-xs font-semibold uppercase tracking-wider text-ink/70">
                      {count} models · {meta.short}
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
