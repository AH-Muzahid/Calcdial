import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import { AppShell } from "@/components/layout/AppShell";
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
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: [
      { url: "/favicon-180x180.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-VHNNXPTG88";
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "GTM-TL8KG9ZG";
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID || "zgp4pbvmi1";
const AD_NETWORK = process.env.NEXT_PUBLIC_AD_NETWORK || "adsense";
const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_ID;
const GROW_SITE_ID = process.env.NEXT_PUBLIC_GROW_SITE_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${jetbrainsMono.variable} light`}
      style={{ colorScheme: "light" }}
      suppressHydrationWarning
    >
      <body
        className="min-h-screen bg-[#fafafa] text-zinc-950 font-sans antialiased selection:bg-black selection:text-white"
        suppressHydrationWarning
      >
        {/* Google Analytics 4 (gtag.js) */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_ID}');
                `,
              }}
            />
          </>
        )}

        {/* Google Tag Manager Container */}
        {GTM_ID && (
          <Script
            id="gtm-container"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`}
          />
        )}

        {/* Microsoft Clarity */}
        {CLARITY_ID && (
          <Script
            id="microsoft-clarity"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(c,l,a,r,i,t,y){
                    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "${CLARITY_ID}");
              `,
            }}
          />
        )}

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

        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
