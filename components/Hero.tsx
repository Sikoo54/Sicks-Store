"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Flame } from "lucide-react";
import { HERO_IMAGE, PRODUCTS } from "@/lib/data";

const EASE = [0.22, 1, 0.36, 1] as const;

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

const CATEGORY_COUNT = new Set(PRODUCTS.map((p) => p.category)).size;

const STATS = [
  { value: `${PRODUCTS.length}`, label: "Models" },
  { value: `${CATEGORY_COUNT}`, label: "Categories" },
  { value: "4.8", label: "Avg. rating" },
];

export default function Hero() {
  const goToFeatured = () => {
    const el = document.getElementById("featured");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const goToNews = () => {
    const el = document.getElementById("news");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="top"
      className="relative isolate overflow-hidden bg-ink text-chalk"
    >
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 halftone-light opacity-40" />
        <div className="absolute -top-24 right-0 h-72 w-72 bg-cobalt" />
        <div className="absolute bottom-8 left-0 h-48 w-48 bg-orange" />
        <div className="absolute inset-0 grain opacity-[0.07] mix-blend-overlay" />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-4 pb-24 pt-32 sm:px-6 lg:grid-cols-2 lg:px-8 lg:pb-32 lg:pt-36"
      >
        <div>
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 border border-chalk/20 bg-white/5 px-3.5 py-1.5 font-display text-xs font-semibold uppercase tracking-[0.2em]"
          >
            <span className="h-2 w-2 bg-cobalt" />
            FW26 · New drop live
          </motion.div>

          <motion.h1
            className="mt-7 font-display font-bold uppercase leading-[0.9] tracking-tight"
          >
            <span className="block text-[clamp(3.5rem,10vw,8rem)]">
              Rack up.
            </span>
            <span className="mt-3 block text-[clamp(2.2rem,6vw,4.5rem)]">
              <span className="inline-block bg-cobalt px-4 py-1  text-chalk">
                The drop
              </span>{" "}
              <span className="inline-block bg-orange px-4 py-1  text-chalk  ">
                is live.
              </span>
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-md text-base leading-relaxed text-chalk/65 sm:text-lg"
          >
            Fresh shoes, jerseys, shorts, tees and match-day extras — engineered
            hard, dropped loud, every Friday.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <button
              onClick={goToFeatured}
              className="group inline-flex items-center gap-2 bg-cobalt px-7 py-3.5 font-display text-sm font-bold uppercase tracking-wider text-white transition hover:bg-ink-soft active:scale-[0.98]"
            >
              Shop the drop
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
            <button
              onClick={goToNews}
              className="inline-flex items-center gap-2 border border-chalk/25 px-7 py-3.5 font-display text-sm font-bold uppercase tracking-wider text-chalk transition hover:bg-chalk/10"
            >
              <Flame size={16} className="text-orange" />
              Latest news
            </button>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-12 grid w-full max-w-md grid-cols-3 divide-x divide-chalk/10 border-t border-chalk/10 pt-6"
          >
            {STATS.map((stat) => (
              <div key={stat.label} className="px-4 first:pl-0">
                <p className="font-display text-3xl font-bold">{stat.value}</p>
                <p className="mt-0.5 font-display text-xs font-semibold uppercase tracking-wider text-chalk/50">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        <div
          className="relative mx-auto w-full max-w-md lg:max-w-none"
        >
          <div
            aria-hidden
            className="absolute -inset-8 -z-10 halftone-light opacity-60"
          />

          <div className="relative">
            <div className="relative animate-float-y">
              <div className="relative aspect-[4/5] overflow-hidden ring-4 ring-cobalt">
                <Image
                  src={HERO_IMAGE}
                  alt="SICKS flagship sneaker"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 halftone opacity-30" />
              </div>
            </div>

            <div className="absolute -right-4 top-8 w-36 -rotate-6 animate-float-y bg-orange px-4 py-3 font-display font-bold uppercase leading-tight text-ink shadow-card sm:-right-8">
              New drop
              <span className="block text-xs font-semibold tracking-wider opacity-70">
                FW26
              </span>
            </div>

            <div className="absolute -left-4 bottom-10 w-40 rotate-3 bg-chalk px-4 py-3 text-ink shadow-card sm:-left-8">
              <p className="text-[10px] font-bold uppercase tracking-wider text-ink/50">
                Vapor Glide
              </p>
              <p className="font-display text-2xl font-bold">$149</p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
