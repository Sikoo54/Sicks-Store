// Slide-in cart drawer: items, qty controls, shipping progress + checkout.
"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

const FREE_SHIPPING_THRESHOLD = 100;

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    updateQty,
    removeItem,
    subtotal,
    checkout,
    isCheckingOut,
  } = useCart();

  // Lock page scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const shipping =
    subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 9;
  const total = subtotal + shipping;

  return (
    <motion.div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={closeCart}
        className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
      />

      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 34 }}
        className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-chalk shadow-2xl"
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between border-b border-ink/10 bg-white px-5 py-4">
          <h2 className="font-display text-xl font-bold uppercase">
            Your cart
            {items.length > 0 && (
              <span className="ml-2 text-sm font-semibold text-ink/50">
                ({items.length} {items.length === 1 ? "item" : "items"})
              </span>
            )}
          </h2>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="grid h-9 w-9 place-items-center rounded-lg text-ink/60 transition hover:bg-chalk hover:text-ink"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="grid h-20 w-20 place-items-center bg-ink text-chalk"
              >
                <ShoppingBag size={32} />
              </motion.div>
              <div>
                <h3 className="font-display text-xl font-bold uppercase">
                  Cart is empty
                </h3>
                <p className="mt-1 text-sm text-ink/55">
                  Fresh gear is waiting. Go grab something.
                </p>
              </div>
              <button
                onClick={closeCart}
                className="mt-2 inline-flex items-center gap-2 bg-ink px-6 py-3 font-display text-sm font-bold uppercase tracking-wide text-chalk transition hover:bg-cobalt"
              >
                Browse the drop <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <ul className="space-y-3">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.li
                    key={item.uid}
                    layout
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 40, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <div className="flex gap-3 rounded-2xl bg-white p-3 ring-1 ring-ink/10">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden bg-chalk">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>

                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-display text-base font-bold uppercase leading-tight">
                              {item.product.name}
                            </p>
                            <p className="mt-1 text-xs text-ink/50">
                              {item.size} ·{" "}
                              <span
                                className="inline-block h-2.5 w-2.5 rounded-full align-middle"
                                style={{ backgroundColor: item.color }}
                              />
                            </p>
                          </div>
                          <button
                            onClick={() => removeItem(item.uid)}
                            aria-label={`Remove ${item.product.name}`}
                            className="text-ink/40 transition hover:text-ink"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <div className="mt-auto flex items-center justify-between pt-2">
                          <div className="flex items-center rounded-lg border border-ink/10">
                            <button
                              onClick={() => updateQty(item.uid, item.qty - 1)}
                              aria-label="Decrease quantity"
                              className="p-1.5 transition hover:text-ink/60"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-7 text-center text-xs font-bold">
                              {item.qty}
                            </span>
                            <button
                              onClick={() => updateQty(item.uid, item.qty + 1)}
                              aria-label="Increase quantity"
                              className="p-1.5 transition hover:text-ink/60"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <span className="font-display text-base font-bold">
                            ${(item.product.price * item.qty).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-ink/10 bg-white px-5 py-5">
            <div className="flex items-center gap-2 text-xs font-medium text-ink/55">
              <Truck size={15} className="text-cobalt" />
              {shipping === 0
                ? "You've unlocked free shipping"
                : `Free shipping over $${FREE_SHIPPING_THRESHOLD}`}
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between text-ink/60">
                <span>Subtotal</span>
                <span className="font-semibold text-ink">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between text-ink/60">
                <span>Shipping</span>
                <span className="font-semibold text-ink">
                  {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-ink/10 pt-3">
                <span className="font-display font-bold uppercase">Total</span>
                <span className="font-display text-xl font-bold">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={checkout}
              disabled={isCheckingOut}
              className="group mt-4 flex w-full items-center justify-center gap-2 bg-cobalt py-4 font-display text-sm font-bold uppercase tracking-wider text-white transition hover:bg-ink active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isCheckingOut ? (
                "Memproses..."
              ) : (
                <>
                  Checkout · ${total.toFixed(2)}
                  <ArrowRight
                    size={18}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </>
              )}
            </button>
            <p className="mt-2 text-center text-[11px] text-ink/40">
              Pembayaran aman via Midtrans Snap
            </p>
          </div>
        )}
      </motion.aside>
    </motion.div>
  );
}
