"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { CATEGORY_META, CATEGORY_ORDER, PRODUCTS } from "@/lib/data";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Navbar() {
  const { cartCount, openCart } = useCart();
  const pathname = usePathname();
  const router = useRouter();

  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const isHome = pathname === "/";

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        CATEGORY_META[p.category].label.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [query]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const toggleSearch = () => {
    setSearchOpen((v) => {
      const next = !v;
      if (next) setTimeout(() => inputRef.current?.focus(), 80);
      return next;
    });
  };

  const goToCategory = (href: string) => {
    setQuery("");
    setSearchOpen(false);
    setMenuOpen(false);
    router.push(href);
  };

  const navLinks = [
    { label: "Home", href: "/", active: isHome },
    ...CATEGORY_ORDER.map((c) => ({
      label: CATEGORY_META[c].label,
      href: `/category/${c}`,
      active: pathname.startsWith(`/category/${c}`),
    })),
  ];

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: EASE }}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || menuOpen
          ? "border-b border-white/10 bg-ink/90 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 text-chalk sm:px-6 lg:px-8">
        <Link
          href="/"
          onClick={() => setMenuOpen(false)}
          className="flex items-center gap-2 font-display text-2xl font-bold tracking-tight"
          aria-label="SICKS home"
        >
          <span className="grid h-3.5 w-3.5 place-items-center">
            <span className="h-full w-full bg-cobalt" />
          </span>
          SICKS
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`rounded-lg px-3 py-1.5 font-display text-sm font-semibold uppercase tracking-wide transition ${
                link.active
                  ? "bg-chalk text-ink"
                  : "text-chalk/65 hover:text-chalk"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div ref={searchRef} className="relative">
            <motion.div
              animate={{ width: searchOpen ? 240 : 42 }}
              transition={{ type: "spring", bounce: 0, duration: 0.5 }}
              className="flex items-center overflow-hidden rounded-lg border border-white/15 bg-white/5"
            >
              <button
                onClick={toggleSearch}
                className="grid h-10 w-10 shrink-0 place-items-center text-chalk/80 transition hover:text-chalk"
                aria-label={searchOpen ? "Close search" : "Open search"}
              >
                <Search size={18} />
              </button>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSearchOpen(true);
                }}
                placeholder="Search the drop…"
                className="w-full bg-transparent pr-3 text-sm text-chalk outline-none placeholder:text-chalk/40"
                aria-label="Search products"
              />
            </motion.div>

            <AnimatePresence>
              {searchOpen && query.trim() !== "" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-80 overflow-hidden rounded-2xl bg-white text-ink shadow-card ring-1 ring-ink/10"
                >
                  {results.length > 0 ? (
                    <ul>
                      {results.map((p) => (
                        <li key={p.id}>
                          <button
                            onClick={() => goToCategory(`/category/${p.category}`)}
                            className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-chalk"
                          >
                            <span
                              className="h-2.5 w-2.5 shrink-0"
                              style={{
                                backgroundColor: CATEGORY_META[p.category].color,
                              }}
                            />
                            <span className="min-w-0 flex-1">
                              <span className="block truncate font-display text-sm font-bold uppercase">
                                {p.name}
                              </span>
                              <span className="block text-xs text-ink/50">
                                {CATEGORY_META[p.category].label} · ${p.price}
                              </span>
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="px-4 py-6 text-center">
                      <p className="font-display text-sm font-bold uppercase">
                        No matches
                      </p>
                      <p className="mt-1 text-xs text-ink/50">
                        Try &quot;shoes&quot;, &quot;jersey&quot; or a colorway.
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {searchOpen && query.trim() === "" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-72 rounded-2xl bg-white p-2 text-ink shadow-card ring-1 ring-ink/10"
                >
                  <p className="px-3 pb-1 pt-2 text-[11px] font-bold uppercase tracking-wider text-ink/40">
                    Jump to a category
                  </p>
                  {CATEGORY_ORDER.map((c) => (
                    <button
                      key={c}
                      onClick={() => goToCategory(`/category/${c}`)}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-chalk"
                    >
                      <span
                        className="h-2.5 w-2.5 shrink-0"
                        style={{ backgroundColor: CATEGORY_META[c].color }}
                      />
                      <span className="font-display text-sm font-bold uppercase">
                        {CATEGORY_META[c].label}
                      </span>
                      <span className="ml-auto text-xs text-ink/40">
                        {PRODUCTS.filter((p) => p.category === c).length}
                      </span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={openCart}
            className="relative grid h-10 w-10 place-items-center rounded-lg text-chalk/80 transition hover:bg-white/10 hover:text-chalk"
            aria-label="Open cart"
          >
            <ShoppingBag size={20} />
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-cobalt px-1 text-[11px] font-bold text-white"
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-lg text-chalk/80 transition hover:bg-white/10 hover:text-chalk lg:hidden"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden border-t border-white/10 bg-ink/95 backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-4 text-chalk">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 font-display text-lg font-bold uppercase transition ${
                    link.active ? "bg-chalk text-ink" : "hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
