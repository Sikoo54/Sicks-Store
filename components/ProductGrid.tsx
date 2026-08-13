"use client";

import { motion } from "framer-motion";
import { SearchX } from "lucide-react";
import ProductCard from "./ProductCard";
import type { Product } from "@/types";

interface ProductGridProps {
  products: Product[];
  total: number;
  onSelect: (product: Product) => void;
  onClear: () => void;
}

export default function ProductGrid({
  products,
  total,
  onSelect,
  onClear,
}: ProductGridProps) {
  return (
    <div className="mt-10">
      <p className="text-sm text-ink/60">
        Showing{" "}
        <span className="font-bold text-ink">{products.length}</span> of{" "}
        <span className="font-bold text-ink">{total}</span> models
      </p>

      {products.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-6 flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-ink/20 bg-white/60 px-8 py-20 text-center"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="grid h-16 w-16 place-items-center bg-ink text-chalk"
          >
            <SearchX size={28} />
          </motion.div>
          <h3 className="font-display text-2xl font-bold uppercase">
            No matches here.
          </h3>
          <p className="max-w-sm text-sm text-ink/60">
            Clear your search or sort to see the full drop again.
          </p>
          <button
            onClick={onClear}
            className="mt-2 bg-ink px-6 py-2.5 font-display text-sm font-bold uppercase tracking-wide text-chalk transition hover:bg-cobalt"
          >
            Clear filters
          </button>
        </motion.div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}
