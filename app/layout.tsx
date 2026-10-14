import type { Metadata } from "next";
import { DM_Sans, Playfair_Display, Lora } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Scale Summit — Roundtables & Interactive Workshops for Founders",
  description:
    "Practical, zero-fluff frameworks to help bootstrapped founders escape commodity pricing, fix messaging, and scale client acquisition. Join free weekly Roundtables and deep-dive Interactive Workshops hosted by Darrin Guttman.",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${playfair.variable} ${lora.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-white text-ink">{children}</body>
    </html>
  );
}
