// Newsroom: editorial dark list of news items (The rundown).
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { NEWS } from "@/lib/data";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function NewsSection() {
  return (
    <section id="news" className="relative isolate scroll-mt-24 overflow-hidden bg-ink text-chalk">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 halftone-light opacity-[0.16]" />
        <div className="absolute inset-0 grain opacity-[0.05] mix-blend-overlay" />
        <div className="absolute -left-24 top-8 h-80 w-80 rounded-full bg-cobalt/15 blur-3xl" />
        <div className="absolute -right-24 bottom-10 h-96 w-96 rounded-full bg-red/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-display text-xs font-bold uppercase tracking-[0.25em] text-chalk/50">
              Newsroom
            </p>
            <h2 className="mt-3 font-display text-4xl font-bold uppercase tracking-tight sm:text-5xl">
              The rundown.
            </h2>
          </div>
          <p className="max-w-sm text-sm text-chalk/60">
            Drops, restocks and behind-the-scenes heat — straight from the
            studio to your feed.
          </p>
        </div>

        <div className="mt-10 border-t border-chalk/10">
          {NEWS.map((item, index) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: index * 0.07, ease: EASE }}
              className="group relative grid cursor-pointer grid-cols-[88px_1fr] items-center gap-4 border-b border-chalk/10 py-4 transition-colors duration-300 hover:bg-chalk/5 sm:grid-cols-[auto_1fr_auto] sm:gap-8 sm:px-4 sm:py-6"
            >
              <span className="hidden font-display text-4xl font-bold text-chalk/20 transition-colors duration-300 group-hover:text-chalk/40 md:block">
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-xl bg-chalk/10 sm:aspect-[4/3] sm:w-44">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 88px, 176px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 halftone-light opacity-10" />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className="px-2.5 py-1 font-display text-[11px] font-bold uppercase tracking-wider text-white"
                    style={{ backgroundColor: item.tagColor }}
                  >
                    {item.tag}
                  </span>
                  <p className="text-xs font-semibold uppercase tracking-wider text-chalk/40">
                    {item.date}
                  </p>
                </div>
                <h3 className="mt-1.5 font-display text-base font-bold uppercase leading-snug tracking-tight transition-colors duration-300 group-hover:text-cobalt sm:mt-2 sm:text-2xl">
                  {item.title}
                </h3>
                <p className="mt-1 hidden line-clamp-2 text-sm leading-relaxed text-chalk/55 sm:mt-2 sm:block">
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