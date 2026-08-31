// Bottom-center toast showing cart feedback messages.
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function Toast() {
  const { toast } = useCart();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[80] flex justify-center px-4">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 24, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="flex items-center gap-3 border-2 border-cobalt bg-ink px-5 py-3 font-display text-sm font-bold uppercase tracking-wide text-chalk shadow-card"
          >
            <CheckCircle2 size={18} className="text-cobalt" />
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
