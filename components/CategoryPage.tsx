"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import FilterBar from "./FilterBar";
import ProductGrid from "./ProductGrid";
import ProductModal from "./ProductModal";
import { useCart } from "@/context/CartContext";
import { CATEGORY_META, CATEGORY_ORDER, defaultSizeLabel } from "@/lib/data";
import type { CategoryMeta, Product, SortOption } from "@/types";

const EASE = [0.22, 1, 0.36, 1] as const;

interface CategoryPageProps {
  meta: CategoryMeta;
  products: Product[];
}

export default function CategoryPage({ meta, products }: CategoryPageProps) {
  const { addItem } = useCart();

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("featured");
  const [selected, setSelected] = useState<Product | null>(null);

  const filtered = useMemo(() => {
    let list = [...products];

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
  }, [products, search, sort]);

  const quickAdd = (product: Product) => {
    addItem(product, defaultSizeLabel(product), product.colors[0]);
  };

  const others = CATEGORY_ORDER.filter((c) => c !== meta.slug);

  return (
    <div>
      <section className="relative isolate overflow-hidden bg-ink text-chalk">
        <div aria-hidden className="absolute inset-0 -z-10">
          <div className="absolute inset-0 halftone-light opacity-40" />
          <div
            className="absolute -right-16 -top-16 h-64 w-64"
            style={{ backgroundColor: meta.color }}
          />
          <div className="absolute inset-0 grain opacity-[0.07] mix-blend-overlay" />
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-16 pt-32 sm:px-6 lg:px-8 lg:pb-20 lg:pt-40">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <div className="flex items-center gap-3 font-display text-xs font-bold uppercase tracking-[0.25em] text-chalk/50">
              <span
                className="h-3 w-3"
                style={{ backgroundColor: meta.color }}
              />
              SICKS · {meta.short}
            </div>

            <h1 className="mt-4 font-display text-[clamp(3.5rem,10vw,8rem)] font-bold uppercase leading-[0.9] tracking-tight">
              {meta.label}
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-6">
              <p className="max-w-md text-base text-chalk/65 sm:text-lg">
                {meta.tagline}
              </p>
              <p className="border-l-2 pl-4 font-display text-2xl font-bold text-chalk/80">
                {products.length}
                <span className="ml-2 text-xs font-semibold uppercase tracking-wider text-chalk/50">
                  models
                </span>
              </p>
            </div>
          </motion.div>
        </div>

        <div
          className="h-2"
          style={{ backgroundColor: meta.color }}
        />
      </section>

      <section className="bg-chalk">
        <div className="mx-auto max-w-7xl px-4 pb-20 pt-12 sm:px-6 lg:px-8 lg:pb-28">
          <FilterBar
            active={meta.slug}
            search={search}
            onSearch={setSearch}
            sort={sort}
            onSort={setSort}
          />

          <ProductGrid
            products={filtered}
            total={products.length}
            onSelect={setSelected}
            onQuickAdd={quickAdd}
            onClear={() => {
              setSearch("");
              setSort("featured");
            }}
          />

          <div className="mt-16 border-t-2 border-ink/10 pt-10">
            <p className="font-display text-xs font-bold uppercase tracking-[0.25em] text-ink/40">
              Keep browsing
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {others.map((c) => {
                const other = CATEGORY_META[c];
                return (
                  <Link
                    key={c}
                    href={`/category/${c}`}
                    className="group inline-flex items-center gap-2 border border-ink/20 bg-white px-4 py-2.5 font-display text-sm font-bold uppercase tracking-wide text-ink/70 transition hover:border-ink hover:text-ink"
                  >
                    <span
                      className="h-2.5 w-2.5"
                      style={{ backgroundColor: other.color }}
                    />
                    {other.label}
                    <ArrowUpRight
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

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
