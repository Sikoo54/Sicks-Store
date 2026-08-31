// Category pills + search + sort dropdown for product listings.
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Search, X } from "lucide-react";
import { CATEGORY_META, CATEGORY_ORDER } from "@/lib/data";
import type { Category, SortOption } from "@/types";

const EASE = [0.22, 1, 0.36, 1] as const;

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
];

interface FilterBarProps {
  active: Category | null;
  search: string;
  onSearch: (value: string) => void;
  sort: SortOption;
  onSort: (value: SortOption) => void;
}

export default function FilterBar({
  active,
  search,
  onSearch,
  sort,
  onSort,
}: FilterBarProps) {
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  // Close the sort menu on outside click.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const activeSort =
    SORT_OPTIONS.find((o) => o.value === sort)?.label ?? "Featured";

  return (
    <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap gap-2">
        {CATEGORY_ORDER.map((category) => {
          const isActive = active === category;
          const color = CATEGORY_META[category].color;
          return (
            <Link
              key={category}
              href={`/category/${category}`}
              className={`relative flex items-center gap-2 rounded-lg border px-4 py-2.5 font-display text-sm font-bold uppercase tracking-wide transition-colors duration-200 ${
                isActive
                  ? "border-ink bg-ink text-chalk"
                  : "border-ink/15 bg-white text-ink/70 hover:border-ink/40 hover:text-ink"
              }`}
            >
              <span className="h-2.5 w-2.5" style={{ backgroundColor: color }} />
              {CATEGORY_META[category].label}
              {isActive && (
                <motion.span
                  layoutId="filterPill"
                  className="absolute inset-0 border-2 border-ink"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
            </Link>
          );
        })}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="flex items-center gap-2 rounded-lg border border-ink/15 bg-white px-4 py-2.5 transition focus-within:border-ink/50">
          <Search size={16} className="shrink-0 text-ink/40" />
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search in this drop…"
            className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-ink/40"
            aria-label="Search products"
          />
          {search && (
            <button
              onClick={() => onSearch("")}
              aria-label="Clear search"
              className="text-ink/40 transition hover:text-ink"
            >
              <X size={14} />
            </button>
          )}
        </label>

        <div ref={sortRef} className="relative">
          <button
            onClick={() => setSortOpen((v) => !v)}
            className="flex w-full items-center justify-between gap-2 rounded-lg border border-ink/15 bg-white px-4 py-2.5 text-sm font-semibold transition hover:border-ink/40 sm:w-52"
          >
            {activeSort}
            <motion.span
              animate={{ rotate: sortOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={16} className="text-ink/50" />
            </motion.span>
          </button>

          <AnimatePresence>
            {sortOpen && (
              <motion.ul
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                transition={{ duration: 0.18, ease: EASE }}
                className="absolute right-0 top-full z-30 mt-2 w-full min-w-52 rounded-2xl bg-white p-1.5 shadow-card ring-1 ring-ink/10"
              >
                {SORT_OPTIONS.map((option) => (
                  <li key={option.value}>
                    <button
                      onClick={() => {
                        onSort(option.value);
                        setSortOpen(false);
                      }}
                      className={`w-full rounded-lg px-4 py-2.5 text-left text-sm font-semibold transition ${
                        sort === option.value
                          ? "bg-ink text-white"
                          : "text-ink/70 hover:bg-chalk hover:text-ink"
                      }`}
                    >
                      {option.label}
                    </button>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
