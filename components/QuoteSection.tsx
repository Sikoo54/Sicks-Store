"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { courtSurgeImage } from "@/lib/data";

const EASE = [0.22, 1, 0.36, 1] as const;

const QUOTE =
  "Sneakers are not just shoes. They are the language of the streets — worn loud, earned slow, and never retired.";

export default function QuoteSection() {
  const words = QUOTE.split(" ");
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.82, 0.75, 0.82]);

  return (
    <section
      ref={ref}
      className="relative isolate flex min-h-screen items-center overflow-hidden bg-ink text-chalk"
    >
      <div aria-hidden className="absolute inset-0 -z-10">
        <motion.div
          style={{ y: imageY }}
          className="absolute -inset-y-[12%] inset-x-0"
        >
          <Image
            src={courtSurgeImage}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
        <motion.div
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 bg-ink/80"
        />
        <div className="absolute inset-0 halftone-light opacity-30" />
        <div className="absolute inset-0 grain opacity-[0.07] mix-blend-overlay" />
      </div>

      <div className="mx-auto w-full max-w-5xl px-4 py-24 sm:px-6 lg:px-8">
        <blockquote className="w-full">
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
            className="block font-display text-7xl leading-none text-orange"
            aria-hidden
          >
            &ldquo;
          </motion.span>

          <p className="mt-2 font-display text-[clamp(1.6rem,4.5vw,3.4rem)] font-bold uppercase leading-[1.05] tracking-tight">
            {words.map((word, i) => (
              <motion.span
                key={`${word}-${i}`}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.03, ease: EASE }}
                className="mr-[0.28em] inline-block"
              >
                {word}
              </motion.span>
            ))}
          </p>

          <motion.footer
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.6, ease: EASE }}
            className="mt-8 flex items-center gap-3"
          >
            <span className="h-4 w-4 bg-cobalt" />
            <cite className="font-display text-sm font-bold uppercase tracking-[0.25em] not-italic text-chalk/70">
              SICKS — Rack up or go home
            </cite>
          </motion.footer>
        </blockquote>
      </div>
    </section>
  );
}