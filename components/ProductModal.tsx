// Product quick-view modal: color, size, qty selection → add to cart.
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Check, Minus, Plus, Star, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { CATEGORY_META, defaultSizeLabel, sizeLabel } from "@/lib/data";
import type { Product } from "@/types";

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const { addItem } = useCart();

  const [color, setColor] = useState(product.colors[0]);
  const [size, setSize] = useState<string | null>(
    defaultSizeLabel(product)
  );
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setColor(product.colors[0]);
    setSize(defaultSizeLabel(product));
    setQty(1);
  }, [product]);

  // Lock body scroll + close on Escape while open.
  useEffect(() => {
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  // Validate size, add to cart, close modal.
  const handleAdd = () => {
    if (!size) return;
    addItem(product, size, color, qty);
    onClose();
  };

  const categoryColor = CATEGORY_META[product.category].color;

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={product.name}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 24 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="relative z-10 w-full max-w-3xl overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-20 grid h-10 w-10 place-items-center rounded-full bg-white/80 text-ink backdrop-blur transition hover:bg-white"
        >
          <X size={20} />
        </button>

        <div className="grid max-h-[90vh] grid-cols-1 overflow-y-auto md:grid-cols-2">
          <div className="relative h-64 bg-chalk sm:h-80 md:h-full md:min-h-[28rem]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 halftone opacity-25" />
            {product.isNew && (
              <span className="absolute left-4 top-4 -rotate-6 bg-orange px-3 py-1 font-display text-xs font-bold uppercase tracking-wider text-ink shadow-card">
                New drop
              </span>
            )}
            <div
              className="absolute inset-x-0 bottom-0 h-1.5"
              style={{ backgroundColor: categoryColor }}
            />
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-2 font-display text-xs font-bold uppercase tracking-wider text-ink/50">
              <span style={{ color: categoryColor }}>{product.brand}</span>
              <span className="text-ink/20">•</span>
              <span>{CATEGORY_META[product.category].label}</span>
            </div>

            <h2 className="mt-2 flex items-center gap-3 font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">
              {product.name}
              {product.number && <span className="rounded bg-ink px-2.5 py-1 text-lg text-white">#{product.number}</span>}
            </h2>

            <p className="mt-2 text-sm text-ink/60">{product.tagline}</p>

            <div className="mt-2 flex items-center gap-2 text-sm">
              <span className="inline-flex items-center gap-1 font-semibold">
                <Star size={15} className="fill-amber-400 text-amber-400" />
                {product.rating}
              </span>
              <span className="text-ink/30">·</span>
              <span className="text-ink/50">In stock, ships fast</span>
            </div>

            <p className="mt-4 font-display text-4xl font-bold">
              ${product.price}
            </p>

            <div className="mt-6">
              <p className="font-display text-xs font-bold uppercase tracking-wider text-ink/60">
                Color
              </p>
              <div className="mt-2.5 flex flex-wrap gap-2.5">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    aria-label={`Color ${c}`}
                    className={`relative h-9 w-9 rounded-full border-2 transition duration-200 ${
                      color === c
                        ? "scale-110 border-ink"
                        : "border-transparent hover:scale-105"
                    }`}
                    style={{ backgroundColor: c }}
                  >
                    {color === c && (
                      <Check
                        size={14}
                        className="absolute inset-0 m-auto text-white mix-blend-difference"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {product.sizeType !== "none" && (
              <div className="mt-5">
                <div className="flex items-center justify-between">
                  <p className="font-display text-xs font-bold uppercase tracking-wider text-ink/60">
                    Size
                  </p>
                  <p className="text-xs text-ink/40">True to size</p>
                </div>
                <div className="mt-2.5 grid grid-cols-5 gap-2">
                  {product.sizes.map((s) => {
                    const label = sizeLabel(product, s);
                    return (
                      <button
                        key={label}
                        onClick={() => setSize(label)}
                        className={`rounded-lg border py-2 text-xs font-semibold transition ${
                          size === label
                            ? "border-ink bg-ink text-white"
                            : "border-ink/15 text-ink/70 hover:border-ink/40"
                        }`}
                      >
                        {label.replace("US ", "")}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mt-6 flex items-center gap-3">
              <div className="flex items-center rounded-lg border border-ink/15">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="p-3 transition hover:text-ink/60"
                >
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center text-sm font-bold">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(9, q + 1))}
                  aria-label="Increase quantity"
                  className="p-3 transition hover:text-ink/60"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                onClick={handleAdd}
                disabled={!size}
                className="flex-1 bg-ink py-3 font-display text-sm font-bold uppercase tracking-wider text-chalk transition hover:bg-cobalt disabled:cursor-not-allowed disabled:opacity-50"
              >
                Add to cart · ${product.price * qty}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
