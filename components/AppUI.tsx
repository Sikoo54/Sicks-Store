// Global overlays mounted once: cart drawer + toast.
"use client";

import { AnimatePresence } from "framer-motion";
import CartDrawer from "./CartDrawer";
import Toast from "./Toast";
import { useCart } from "@/context/CartContext";

export default function AppUI() {
  const { isOpen } = useCart();

  return (
    <>
      <AnimatePresence>{isOpen && <CartDrawer />}</AnimatePresence>
      <Toast />
    </>
  );
}
