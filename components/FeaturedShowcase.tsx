"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Play } from "lucide-react";
import { useEffect, useRef } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

function LazyVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!el.src) el.src = "/videos/showcase.mp4";
            el.play().catch(() => {});
          } else {
            el.pause();
          }
        });
      },
      { rootMargin: "300px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className="h-full w-full object-cover"
      autoPlay
      muted
      loop
      playsInline
      preload="none"
      poster="/images/hero.jpg"
    />
  );
}

export default function FeaturedShowcase() {
  return (
    <section id="spotlight" className="scroll-mt-24 bg-ink text-chalk">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-display text-xs font-bold uppercase tracking-[0.25em] text-cobalt">
              In motion
            </p>
            <h2 className="mt-3 font-display text-4xl font-bold uppercase tracking-tight sm:text-5xl">
              Built to be worn.
            </h2>
          </div>
          <p className="max-w-sm text-sm text-chalk/60">
            Rack up or go home — SICKS gear lives on the street, not on the
            shelf.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="relative mt-10 aspect-video overflow-hidden bg-ink ring-1 ring-chalk/15"
        >
          <div className="absolute inset-0">
            <Image
              src="/images/hero.jpg"
              alt=""
              fill
              priority={false}
              sizes="(max-width: 768px) 100vw, 75vw"
              className="object-cover opacity-90"
            />
          </div>
          <div className="absolute inset-0">
            <LazyVideo />
          </div>
          <div className="absolute inset-0 bg-ink/35" />
          <div className="absolute inset-0 halftone opacity-15" />
          <div className="absolute inset-0 grain opacity-[0.06] mix-blend-overlay" />

          <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10">
            <div className="inline-flex w-fit items-center gap-2 bg-cobalt px-3 py-1 font-display text-[11px] font-bold uppercase tracking-wider text-white">
              New drop
            </div>
            <h3 className="mt-3 max-w-lg font-display text-3xl font-bold uppercase leading-none tracking-tight sm:text-5xl">
              Take them off.
              <br />
              Just kidding.
            </h3>
            <Link
              href="/category/shoes"
              className="mt-5 inline-flex w-fit items-center gap-2 bg-chalk px-6 py-3 font-display text-sm font-bold uppercase tracking-wide text-ink transition-colors hover:bg-cobalt hover:text-white"
            >
              <Play size={16} fill="currentColor" />
              Shop the drop
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}