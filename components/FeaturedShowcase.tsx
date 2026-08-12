"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CATEGORY_META, CATEGORY_ORDER, PRODUCTS } from "@/lib/data";
import type { Category } from "@/types";

const EASE = [0.22, 1, 0.36, 1] as const;

function heroFor(category: Category) {
  return PRODUCTS.find((p) => p.category === category && p.featured) ?? null;
}

export default function FeaturedShowcase() {
  const rows = CATEGORY_ORDER.map((c) => ({
    cat: CATEGORY_META[c],
    product: heroFor(c),
  }));

  return (
    <section id="spotlight" className="scroll-mt-24 bg-ink text-chalk">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-display text-xs font-bold uppercase tracking-[0.25em] text-cobalt">
              The drop
            </p>
            <h2 className="mt-3 font-display text-4xl font-bold uppercase tracking-tight sm:text-5xl">
              One pick per category.
            </h2>
          </div>
          <p className="max-w-sm text-sm text-chalk/60">
            The headline piece from every rack — open a category for the full
            lineup.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {rows.map((row, i) => {
            const { cat, product } = row;
            if (!product) return null;
            return (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
                className="group"
              >
                <Link
                  href={`/category/${cat.slug}`}
                  className="flex h-full flex-col overflow-hidden bg-chalk text-ink ring-1 ring-chalk/15 transition-colors hover:ring-chalk/40"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-chalk">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 halftone opacity-15" />
                    <span
                      className="absolute left-3 top-3 px-2.5 py-1 font-display text-[11px] font-bold uppercase tracking-wider text-white"
                      style={{ backgroundColor: cat.color }}
                    >
                      {cat.label}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col justify-between gap-3 border-t-4 border-chalk/10 p-4" style={{ borderTopColor: cat.color }}>
                    <div>
                      <p className="font-display text-lg font-bold uppercase leading-tight tracking-tight">
                        {product.name}
                      </p>
                      <p className="mt-0.5 text-sm text-ink/55">
                        ${product.price}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 font-display text-xs font-bold uppercase tracking-wider text-ink/60 transition-colors group-hover:text-ink">
                      Shop {cat.short}
                      <ArrowUpRight size={14} />
                    </span>
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