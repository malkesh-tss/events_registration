import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Scale Summit — Roundtables & Interactive Workshops for Founders",
  description:
    "Practical, zero-fluff frameworks to help bootstrapped founders escape commodity pricing, fix messaging, and scale client acquisition. Join free weekly Roundtables and deep-dive Interactive Workshops hosted by Darrin Guttman.",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-white text-ink">{children}</body>
    </html>
  );
}
