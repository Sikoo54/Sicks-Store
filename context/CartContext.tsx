"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { CartItem, Product } from "@/types";

interface ToastState {
  message: string;
  id: number;
}

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  cartCount: number;
  subtotal: number;
  toast: ToastState | null;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Product, size: string, color: string, qty?: number) => void;
  removeItem: (uid: string) => void;
  updateQty: (uid: string, qty: number) => void;
  clearCart: () => void;
  checkout: () => void;
}

const STORAGE_KEY = "sicks-cart";

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const hydratedRef = useRef(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {
      // ignore corrupted storage
    }
    hydratedRef.current = true;
  }, []);

  useEffect(() => {
    if (!hydratedRef.current) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // storage may be unavailable — ignore
    }
  }, [items]);

  const showToast = useCallback((message: string) => {
    const id = Date.now();
    setToast({ message, id });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => {
      setToast((t) => (t && t.id === id ? null : t));
    }, 2400);
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addItem = useCallback(
    (product: Product, size: string, color: string, qty = 1) => {
      const uid = `${product.id}-${size}-${color}`;
      setItems((prev) => {
        const existing = prev.find((i) => i.uid === uid);
        if (existing) {
          return prev.map((i) =>
            i.uid === uid ? { ...i, qty: i.qty + qty } : i
          );
        }
        return [...prev, { uid, product, size, color, qty }];
      });
      showToast(`${product.name} added to cart`);
    },
    [showToast]
  );

  const removeItem = useCallback(
    (uid: string) => setItems((prev) => prev.filter((i) => i.uid !== uid)),
    []
  );

  const clearCart = useCallback(() => setItems([]), []);

  const updateQty = useCallback((uid: string, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.uid !== uid)
        : prev.map((i) => (i.uid === uid ? { ...i, qty } : i))
    );
  }, []);

  const checkout = useCallback(() => {
    setItems([]);
    setIsOpen(false);
    showToast("Order placed — thanks for shopping SICKS.");
  }, [showToast]);

  const cartCount = useMemo(
    () => items.reduce((n, i) => n + i.qty, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((n, i) => n + i.product.price * i.qty, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      isOpen,
      cartCount,
      subtotal,
      toast,
      openCart,
      closeCart,
      addItem,
      removeItem,
      updateQty,
      clearCart,
      checkout,
    }),
    [
      items,
      isOpen,
      cartCount,
      subtotal,
      toast,
      openCart,
      closeCart,
      addItem,
      removeItem,
      updateQty,
      clearCart,
      checkout,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
