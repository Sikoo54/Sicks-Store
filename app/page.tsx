"use client";

import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import FilterBar from "@/components/FilterBar";
import ProductGrid from "@/components/ProductGrid";
import ProductModal from "@/components/ProductModal";
import NewsSection from "@/components/NewsSection";
import FeaturedShowcase from "@/components/FeaturedShowcase";
import CategoryTiles from "@/components/CategoryTiles";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { FEATURED, defaultSizeLabel } from "@/lib/data";
import type { Product, SortOption } from "@/types";

export default function Home() {
  const { addItem } = useCart();

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

  const quickAdd = (product: Product) => {
    addItem(product, defaultSizeLabel(product), product.colors[0]);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <Hero />
        <Marquee />

        <section id="featured" className="scroll-mt-24 bg-chalk">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
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
              onQuickAdd={quickAdd}
              onClear={() => {
                setSearch("");
                setSort("featured");
              }}
            />
          </div>
        </section>

        <NewsSection />
        <FeaturedShowcase />
        <CategoryTiles />
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
