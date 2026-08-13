"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Plus, Star } from "lucide-react";
import { CATEGORY_META } from "@/lib/data";
import type { Product } from "@/types";

const EASE = [0.22, 1, 0.36, 1] as const;

interface ProductCardProps {
  product: Product;
  index: number;
  onSelect: (product: Product) => void;
}

export default function ProductCard({
  product,
  index,
  onSelect,
}: ProductCardProps) {
  const color = CATEGORY_META[product.category].color;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.5,
        delay: (index % 4) * 0.07,
        ease: EASE,
      }}
      onClick={() => onSelect(product)}
      className="group cursor-pointer overflow-hidden rounded-2xl bg-white ring-1 ring-ink/10 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card hover:ring-ink/20"
    >
      <div className="h-1.5" style={{ backgroundColor: color }} />

      <div className="relative aspect-square overflow-hidden bg-chalk">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 halftone opacity-20" />

        {product.isNew && (
          <span className="absolute left-3 top-3 -rotate-6 bg-orange px-3 py-1 font-display text-[11px] font-bold uppercase tracking-wider text-ink shadow-card">
            New drop
          </span>
        )}

        <span className="absolute bottom-3 left-3 bg-white px-2 py-0.5 font-display text-xs font-bold text-ink">
          №{String(index + 1).padStart(2, "0")}
        </span>

        <span className="absolute bottom-3 right-3 bg-ink/80 px-2 py-0.5 font-display text-[10px] font-semibold uppercase tracking-wider text-chalk">
          100% auth
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between text-xs">
          <span
            className="font-display font-bold uppercase tracking-wider"
            style={{ color }}
          >
            {product.brand}
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-ink/60">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            {product.rating}
          </span>
        </div>

        <h3 className="mt-1.5 truncate font-display text-xl font-bold uppercase tracking-tight">
          {product.name}
        </h3>

        <p className="mt-0.5 truncate text-xs text-ink/50">{product.tagline}</p>

        <div className="mt-3 flex items-center justify-between">
          <span className="font-display text-2xl font-bold">
            ${product.price}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
            aria-label={`Choose ${product.name}`}
            className="grid h-10 w-10 place-items-center bg-ink text-chalk transition-colors duration-300 hover:bg-cobalt active:scale-95"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
