import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://calcdial.com"),
  title: {
    default: "CalcDial — High-Accuracy Seller Fee & Profit Calculators",
    template: "%s | CalcDial",
  },
  description:
    "Free, instant e-commerce fee and profit calculators for Etsy, Shopify, TikTok Shop, and Print-on-Demand sellers. 100% client-side with zero tracking lag.",
  keywords: [
    "etsy fee calculator",
    "shopify profit calculator",
    "tiktok shop fee calculator",
    "print on demand margin calculator",
    "stripe vs paypal fees",
  ],
  authors: [{ name: "CalcDial Editorial Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://calcdial.com",
    siteName: "CalcDial",
    title: "CalcDial — High-Accuracy Seller Fee & Profit Calculators",
    description:
      "Instant, client-side seller profit and platform fee calculators updated for 2026 platform fee schedules.",
  },
  twitter: {
    card: "summary_large_image",
    title: "CalcDial — Seller Fee & Profit Calculators",
    description: "Calculate Etsy, Shopify, and TikTok Shop fees with 100% precision.",
  },
};

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const AD_NETWORK = process.env.NEXT_PUBLIC_AD_NETWORK || "adsense";
const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_ID;
const GROW_SITE_ID = process.env.NEXT_PUBLIC_GROW_SITE_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${jetbrainsMono.variable} scroll-smooth`}>
      <body className="min-h-screen bg-[#fbfbfd] text-slate-900 font-sans antialiased flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
        {/* Google Analytics 4 */}
        {GA_ID && <GoogleAnalytics gaId={GA_ID} />}

        {/* Modular Monetization Scripts: AdSense vs Grow by Mediavine */}
        {AD_NETWORK === "adsense" && ADSENSE_ID && (
          <Script
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`}
            strategy="afterInteractive"
            crossOrigin="anonymous"
          />
        )}

        {(AD_NETWORK === "grow" || AD_NETWORK === "journey") && GROW_SITE_ID && (
          <Script
            src={`https://assets.grow.me/grow-me.js?site-id=${GROW_SITE_ID}`}
            strategy="afterInteractive"
          />
        )}

        <Header />
        <main className="flex-1 pb-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
