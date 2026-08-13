"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { NEWS } from "@/lib/data";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function NewsSection() {
  return (
    <section id="news" className="relative isolate scroll-mt-24 overflow-hidden bg-chalk">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 halftone opacity-[0.45]" />
        <div className="absolute inset-0 grain opacity-[0.04] mix-blend-overlay" />
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-green/10" />
        <div className="absolute -right-24 bottom-24 h-80 w-80 rounded-full bg-violet/10" />
        <div className="absolute left-1/3 bottom-10 h-40 w-40 rounded-full bg-red/10" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-display text-xs font-bold uppercase tracking-[0.25em] text-cobalt">
              Newsroom
            </p>
            <h2 className="mt-3 font-display text-4xl font-bold uppercase tracking-tight sm:text-5xl">
              In the loop.
            </h2>
          </div>
          <p className="max-w-sm text-sm text-ink/60">
            Drops, restocks and behind-the-scenes heat — straight from the
            studio to your feed.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
          {NEWS.map((item, index) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: index * 0.08, ease: EASE }}
              className="group cursor-pointer overflow-hidden rounded-2xl bg-white ring-1 ring-ink/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-chalk">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 halftone opacity-15" />
                <span
                  className="absolute left-3 top-3 px-2.5 py-1 font-display text-[11px] font-bold uppercase tracking-wider text-white"
                  style={{ backgroundColor: item.tagColor }}
                >
                  {item.tag}
                </span>
              </div>

              <div className="p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-ink/40">
                  {item.date}
                </p>
                <h3 className="mt-2 font-display text-lg font-bold uppercase leading-snug tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/55">
                  {item.excerpt}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
