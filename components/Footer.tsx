"use client";

import { motion } from "framer-motion";
import { Dribbble, Instagram, Twitter, Youtube } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

const SUPPORT_LINKS = ["Shipping", "Returns", "Size guide", "Contact"];

const WHY_SICKS = [
  "Free shipping over $100",
  "30-day easy returns",
  "Authentic guarantee",
  "Secure checkout",
  "Ships worldwide",
];

const SOCIALS = [
  { label: "Instagram", icon: Instagram },
  { label: "Twitter", icon: Twitter },
  { label: "YouTube", icon: Youtube },
  { label: "Dribbble", icon: Dribbble },
];

export default function Footer() {
  return (
    <footer id="footer" className="relative overflow-hidden bg-ink text-chalk">
      <div aria-hidden className="absolute inset-0 halftone-light opacity-20" />

      <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-6 lg:px-8 lg:pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="flex items-center gap-2 font-display text-4xl font-bold tracking-tight">
              <span className="h-4 w-4 bg-cobalt" />
              SICKS
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-chalk/55">
              Shoes, jerseys, shorts, tees and match-day extras. Engineered
              hard, dropped loud, every Friday.
            </p>

            <div className="mt-6 flex items-center gap-2">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  aria-label={social.label}
                  className="grid h-10 w-10 place-items-center border border-chalk/15 text-chalk/70 transition hover:border-cobalt hover:bg-cobalt hover:text-white"
                >
                  <social.icon size={17} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-chalk/40">
              Why SICKS
            </p>
            <ul className="mt-4 space-y-2.5">
              {WHY_SICKS.map((item) => (
                <li key={item}>
                  <span className="flex items-center gap-2 text-sm text-chalk/65">
                    <span className="text-cobalt">✓</span>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-chalk/40">
              Support
            </p>
            <ul className="mt-4 space-y-2.5">
              {SUPPORT_LINKS.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="text-sm text-chalk/65 transition hover:text-chalk"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mt-14 select-none border-t border-chalk/10 pt-6 text-center font-display font-bold leading-none tracking-tight"
        >
          <span className="block text-chalk/10 text-[clamp(4rem,14vw,11rem)]">
            SICKS
          </span>
        </motion.div>

        <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-chalk/10 pt-6 text-xs text-chalk/40 sm:flex-row">
          <p>© 2026 SICKS. All rights reserved.</p>
          <p>Rack up or go home.</p>
        </div>
      </div>
    </footer>
  );
}
