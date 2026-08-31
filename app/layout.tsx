// Root layout: fonts, cart state, navbar, global UI and navigation helpers.
import type { Metadata } from "next";
import { Barlow_Condensed, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import AppUI from "@/components/AppUI";
import ScrollToTop from "@/components/ScrollToTop";
import PrefetchCategories from "@/components/PrefetchCategories";
import MidtransScript from "@/components/MidtransScript";

// Brand fonts, self-hosted via next/font (no FOUT / layout shift).
const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-display",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SICKS — Gear that goes hard",
  description:
    "Shoes, jerseys, shorts, shirts and match-day extras. Fresh drops every Friday at SICKS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${barlowCondensed.variable} ${spaceGrotesk.variable}`}>
      <body>
        <CartProvider>
          <ScrollToTop />
          <PrefetchCategories />
          <Navbar />
          {children}
          <AppUI />
          <MidtransScript />
        </CartProvider>
      </body>
    </html>
  );
}
