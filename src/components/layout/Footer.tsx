import Link from "next/link";
import React from "react";
import { CalcDialLogo } from "./CalcDialLogo";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200/80 bg-white text-zinc-600 print:hidden mt-auto overflow-hidden font-sans">
      <div className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        {/* Top Section: 4 Link Columns + Brand Column */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 lg:gap-8">
          {/* Column 1: Calculators */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-950 font-sans">
              Calculators
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/tools/etsy-fee-calculator" prefetch={false} className="text-zinc-500 hover:text-blue-600 transition-colors">
                  Etsy Fee Calculator
                </Link>
              </li>
              <li>
                <Link href="/tools/shopify-profit-calculator" prefetch={false} className="text-zinc-500 hover:text-blue-600 transition-colors">
                  Shopify & ROAS Engine
                </Link>
              </li>
              <li>
                <Link href="/tools/tiktok-shop-fee-calculator" prefetch={false} className="text-zinc-500 hover:text-blue-600 transition-colors">
                  TikTok Shop Calculator
                </Link>
              </li>
              <li>
                <Link href="/tools/stripe-vs-paypal-fee-calculator" prefetch={false} className="text-zinc-500 hover:text-blue-600 transition-colors">
                  Stripe vs PayPal
                </Link>
              </li>
              <li>
                <Link href="/tools/pod-profit-calculator" prefetch={false} className="text-zinc-500 hover:text-blue-600 transition-colors">
                  Print-on-Demand Profit
                </Link>
              </li>
              <li>
                <Link href="/tools/etsy-vs-shopify-vs-tiktok-shop-calculator" prefetch={false} className="text-zinc-500 hover:text-blue-600 transition-colors">
                  Marketplace Comparison
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Seller Guides */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-950 font-sans">
              Seller Guides
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/guides/how-to-calculate-etsy-fees-2026" prefetch={false} className="text-zinc-500 hover:text-blue-600 transition-colors">
                  Etsy Fees in 2026
                </Link>
              </li>
              <li>
                <Link href="/guides/etsy-vs-shopify-vs-tiktok-shop-comparison" prefetch={false} className="text-zinc-500 hover:text-blue-600 transition-colors">
                  Etsy vs Shopify vs TikTok
                </Link>
              </li>
              <li>
                <Link href="/guides/pod-pricing-strategy-offsite-ads" prefetch={false} className="text-zinc-500 hover:text-blue-600 transition-colors">
                  POD Pricing Strategy
                </Link>
              </li>
              <li>
                <Link href="/guides/pass-payment-processing-fees-to-clients" prefetch={false} className="text-zinc-500 hover:text-blue-600 transition-colors">
                  Invoice Gross-Up Guide
                </Link>
              </li>
              <li>
                <Link href="/#fee-traps" prefetch={false} className="text-zinc-500 hover:text-blue-600 transition-colors">
                  Platform Fee Traps
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Platforms */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-950 font-sans">
              Platforms
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/tools/etsy-fee-calculator" prefetch={false} className="text-zinc-500 hover:text-blue-600 transition-colors">
                  Etsy Marketplace
                </Link>
              </li>
              <li>
                <Link href="/tools/shopify-profit-calculator" prefetch={false} className="text-zinc-500 hover:text-blue-600 transition-colors">
                  Shopify Stores
                </Link>
              </li>
              <li>
                <Link href="/tools/tiktok-shop-fee-calculator" prefetch={false} className="text-zinc-500 hover:text-blue-600 transition-colors">
                  TikTok Shop
                </Link>
              </li>
              <li>
                <Link href="/tools/stripe-vs-paypal-fee-calculator" prefetch={false} className="text-zinc-500 hover:text-blue-600 transition-colors">
                  Stripe Payments
                </Link>
              </li>
              <li>
                <Link href="/tools/stripe-vs-paypal-fee-calculator" prefetch={false} className="text-zinc-500 hover:text-blue-600 transition-colors">
                  PayPal Commerce
                </Link>
              </li>
              <li>
                <Link href="/tools/pod-profit-calculator" prefetch={false} className="text-zinc-500 hover:text-blue-600 transition-colors">
                  Printify POD
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Trust & Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-950 font-sans">
              Trust & Legal
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/about" prefetch={false} className="text-zinc-500 hover:text-blue-600 transition-colors">
                  About CalcDial
                </Link>
              </li>
              <li>
                <Link href="/terms" prefetch={false} className="text-zinc-500 hover:text-blue-600 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" prefetch={false} className="text-zinc-500 hover:text-blue-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" prefetch={false} className="text-zinc-500 hover:text-blue-600 transition-colors">
                  Calculation Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/contact" prefetch={false} className="text-zinc-500 hover:text-blue-600 transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5 & 6: Brand Column (Spans 2 columns on lg) */}
          <div className="col-span-2 sm:col-span-2 md:col-span-4 lg:col-span-2 flex flex-col justify-start">
            {/* Unified Brand Logo Component */}
            <CalcDialLogo />

            {/* Accurate Brand Description */}
            <p className="mt-3.5 text-xs sm:text-sm text-zinc-500 leading-relaxed font-normal max-w-sm">
              Independent, high-precision fee calculators & margin forecasting for online sellers. 100% private, client-side math with zero tracking.
            </p>

            {/* Fee Schedule Status Badge */}
            <div className="mt-4 flex items-center gap-2 text-[11px] font-mono text-zinc-600 bg-zinc-100/90 px-3 py-1 rounded-full border border-zinc-200/80 w-fit">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>UPDATED FOR 2026 FEE SCHEDULES</span>
            </div>

            {/* Social Icons Row (rounded-xl) */}
            <div className="mt-5 flex items-center gap-2.5">
              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="flex size-8 items-center justify-center rounded-xl border border-zinc-200/70 bg-white hover:border-[#0A66C2]/30 hover:bg-[#0A66C2]/10 text-zinc-500 hover:text-[#0A66C2] transition-all hover:scale-105 shadow-2xs"
              >
                <svg className="size-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.47 1.47 0 0 0 1.47-1.47c0-.82-.66-1.48-1.47-1.48s-1.47.66-1.47 1.48c0 .81.65 1.47 1.47 1.47m1.39 9.74v-8.37H5.07v8.37h2.78Z" />
                </svg>
              </a>

              {/* Twitter / X */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                className="flex size-8 items-center justify-center rounded-xl border border-zinc-200/70 bg-white hover:border-zinc-400 hover:bg-zinc-100 text-zinc-500 hover:text-black transition-all hover:scale-105 shadow-2xs"
              >
                <svg className="size-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* GitHub */}
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="flex size-8 items-center justify-center rounded-xl border border-zinc-200/70 bg-white hover:border-zinc-400 hover:bg-zinc-100 text-zinc-500 hover:text-black transition-all hover:scale-105 shadow-2xs"
              >
                <svg className="size-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Divider Line */}
        <div className="mt-14 border-t border-zinc-200/80 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm text-zinc-500 gap-3">
          <p>© {new Date().getFullYear()} CalcDial. All rights reserved.</p>
          <p className="text-zinc-400 text-xs text-center sm:text-right">
            Independent utility. Not affiliated with Etsy, Shopify, TikTok, Stripe, or PayPal.
          </p>
        </div>

        {/* Bottom Giant Watermark Text with Radial Gradient Mask */}
        <div className="relative mt-8 sm:mt-10 overflow-hidden select-none pointer-events-none text-center flex justify-center [mask-image:linear-gradient(to_bottom,black_20%,transparent_90%)]">
          <span className="text-[13vw] font-black tracking-tighter leading-none text-zinc-950/[0.03] uppercase block whitespace-nowrap -mb-[2.5vw] font-sans">
            CalcDial
          </span>
        </div>
      </div>
    </footer>
  );
}
