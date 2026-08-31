// Global cart state: items, drawer open/close, persistence + toasts.
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
  isCheckingOut: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Product, size: string, color: string, qty?: number) => void;
  removeItem: (uid: string) => void;
  updateQty: (uid: string, qty: number) => void;
  clearCart: () => void;
  checkout: () => Promise<void>;
}

const STORAGE_KEY = "sicks-cart";

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const hydratedRef = useRef(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Restore cart from localStorage on first mount (client-only).
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

  // Persist cart to localStorage whenever it changes.
  useEffect(() => {
    if (!hydratedRef.current) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // storage may be unavailable — ignore
    }
  }, [items]);

  // Toast notification, auto-dismissed after 2.4s.
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

  // Add product; merge quantity if same size+color already in cart.
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

  // Update quantity; qty ≤ 0 removes the line item.
  const updateQty = useCallback((uid: string, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.uid !== uid)
        : prev.map((i) => (i.uid === uid ? { ...i, qty } : i))
    );
  }, []);

  const cartCount = useMemo(
    () => items.reduce((n, i) => n + i.qty, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((n, i) => n + i.product.price * i.qty, 0),
    [items]
  );

  // Midtrans checkout: minta Snap token ke /api/midtrans/token lalu buka popup Snap.
  const checkout = useCallback(async () => {
    if (items.length === 0) {
      showToast("Cart masih kosong.");
      return;
    }
    if (isCheckingOut) return;
    setIsCheckingOut(true);
    try {
      const shipping = subtotal >= 100 || subtotal === 0 ? 0 : 9;
      const total = subtotal + shipping;

      const res = await fetch("/api/midtrans/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, total }),
      });
      const data = await res.json();
      if (!res.ok) {
        // Fallback: kalau Midtrans belum dikonfigurasi, beri pesan jelas.
        const msg = data?.error || "Gagal membuat pembayaran.";
        // Jika env belum di-set, tetap beri pengalaman demo: anggap sukses.
        if (msg.includes("MIDTRANS_SERVER_KEY")) {
          showToast("Midtrans belum dikonfigurasi — mode demo: order dianggap sukses.");
          setItems([]);
          setIsOpen(false);
          return;
        }
        showToast(msg);
        return;
      }

      const token: string | undefined = data.token;
      if (!token) {
        showToast("Token Midtrans tidak diterima.");
        return;
      }

      // Pastikan Snap.js sudah ter-load.
      if (!window.snap) {
        showToast("Memuat Midtrans... coba lagi sebentar.");
        return;
      }

      window.snap.pay(token, {
        onSuccess: () => {
          setItems([]);
          setIsOpen(false);
          showToast("Pembayaran berhasil — thanks for shopping SICKS!");
        },
        onPending: () => {
          showToast("Menunggu pembayaran — selesaikan di popup Midtrans.");
        },
        onError: () => {
          showToast("Pembayaran gagal — coba lagi.");
        },
        onClose: () => {
          showToast("Popup ditutup — pembayaran dibatalkan.");
        },
      });
    } catch (e) {
      showToast("Terjadi kesalahan jaringan saat checkout.");
    } finally {
      setIsCheckingOut(false);
    }
  }, [items, subtotal, isCheckingOut, showToast]);

  const value = useMemo(
    () => ({
      items,
      isOpen,
      cartCount,
      subtotal,
      toast,
      isCheckingOut,
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
      isCheckingOut,
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

// Hook accessor; throws if used outside the provider.
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
