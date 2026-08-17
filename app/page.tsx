"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence } from "framer-motion";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import FilterBar from "@/components/FilterBar";
import ProductGrid from "@/components/ProductGrid";
import ProductModal from "@/components/ProductModal";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import { FEATURED } from "@/lib/data";

const QuoteSection = dynamic(() => import("@/components/QuoteSection"), {
  ssr: false,
});
const FeaturedShowcase = dynamic(
  () => import("@/components/FeaturedShowcase"),
  { ssr: false }
);
const NewsSection = dynamic(() => import("@/components/NewsSection"), {
  ssr: false,
});
const CategoryTiles = dynamic(() => import("@/components/CategoryTiles"), {
  ssr: false,
});
import type { Product, SortOption } from "@/types";

export default function Home() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("featured");
  const [selected, setSelected] = useState<Product | null>(null);

  const products = useMemo(() => {
    let list = [...FEATURED];

    const query = search.trim().toLowerCase();
    if (query) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query)
      );
    }

    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        list.sort((a, b) => Number(b.isNew) - Number(a.isNew));
        break;
    }

    return list;
  }, [search, sort]);

  return (
    <div className="flex min-h-screen flex-col">
      <SmoothScroll />
      <main className="flex-1">
        <Hero />
        <Marquee />

        <NewsSection />

        <section id="featured" className="relative isolate scroll-mt-24 overflow-hidden bg-chalk">
          <div aria-hidden className="absolute inset-0 -z-10">
            <div className="absolute inset-0 halftone-dense opacity-[0.12]" />
            <div className="absolute inset-0 halftone opacity-[0.45]" />
            <div className="absolute inset-0 grain opacity-[0.04] mix-blend-overlay" />
            <div className="absolute -right-20 top-16 h-72 w-72 rounded-full bg-cobalt/10" />
            <div className="absolute -left-24 bottom-24 h-80 w-80 rounded-full bg-orange/10" />
            <div className="absolute right-1/4 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-violet/10" />
            <div className="absolute left-1/4 top-10 h-28 w-28 rounded-full bg-cobalt/15" />
            <div className="absolute left-[10%] top-1/3 h-48 w-48 rounded-full bg-orange/15" />
            <div className="absolute left-2/3 bottom-8 h-24 w-24 rounded-full bg-violet/15" />
            <div className="absolute left-[40%] bottom-16 h-14 w-14 rounded-full bg-green/15" />
          </div>

          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="relative">
                <div
                  aria-hidden
                  className="halftone-dense absolute -left-6 -top-4 -z-10 h-40 w-64 opacity-30"
                />
                <p className="font-display text-xs font-bold uppercase tracking-[0.25em] text-cobalt">
                  The weekly drop
                </p>
                <h2 className="mt-3 font-display text-4xl font-bold uppercase tracking-tight sm:text-5xl">
                  Featured this week.
                </h2>
              </div>
              <p className="max-w-sm text-sm text-ink/60">
                The pieces moving fastest right now — search, sort and lock
                yours in before it&apos;s gone.
              </p>
            </div>

            <FilterBar
              active={null}
              search={search}
              onSearch={setSearch}
              sort={sort}
              onSort={setSort}
            />

            <ProductGrid
              products={products}
              total={FEATURED.length}
              onSelect={setSelected}
              onClear={() => {
                setSearch("");
                setSort("featured");
              }}
            />
          </div>
        </section>

        <FeaturedShowcase />
        <CategoryTiles />
        <QuoteSection />
      </main>

      <Footer />

      <AnimatePresence>
        {selected && (
          <ProductModal
            key={selected.id}
            product={selected}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
