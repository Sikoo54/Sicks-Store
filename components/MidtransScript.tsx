// Loads Midtrans Snap.js once, using the client key from env.
// Sandbox vs production URL is chosen by MIDTRANS_IS_PRODUCTION.
"use client";

import Script from "next/script";

export default function MidtransScript() {
  const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
  const isProduction = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true";

  if (!clientKey) return null;

  const src = isProduction
    ? "https://app.midtrans.com/snap/snap.js"
    : "https://app.sandbox.midtrans.com/snap/snap.js";

  return (
    <Script
      src={src}
      data-client-key={clientKey}
      strategy="afterInteractive"
    />
  );
}

// Helper type for window.snap (injected by Snap.js).
declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        opts: {
          onSuccess?: (result: unknown) => void;
          onPending?: (result: unknown) => void;
          onError?: (result: unknown) => void;
          onClose?: () => void;
        }
      ) => void;
    };
  }
}
