import type { Metadata } from "next";
import { Barlow_Condensed, Space_Grotesk } from "next/font/google";
import "./globals.css";
import "lenis/dist/lenis.css";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import AppUI from "@/components/AppUI";

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
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
        <SmoothScrollProvider>
          <CartProvider>
            <Navbar />
            {children}
            <AppUI />
          </CartProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
