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
              <Link href="/calculators" className="hover:text-blue-600 transition-colors">
                Calculators
              </Link>
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/calculators" prefetch={false} className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                  All Calculators Directory →
                </Link>
              </li>
              <li>
                <Link href="/tools/etsy-fee-calculator" prefetch={false} className="text-zinc-500 hover:text-blue-600 transition-colors">
                  Etsy Fee Calculator
                </Link>
              </li>
              <li>
                <Link href="/tools/shopify-profit-calculator" prefetch={false} className="text-zinc-500 hover:text-blue-600 transition-colors">
                  Shopify Profit &amp; ROAS Calculator
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
                <Link href="/comparisons" prefetch={false} className="text-zinc-500 hover:text-blue-600 transition-colors">
                  All Comparisons Hub
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Seller Guides */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-950 font-sans">
              <Link href="/guides" className="hover:text-blue-600 transition-colors">
                Seller Guides
              </Link>
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/guides" prefetch={false} className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                  All Guides Directory →
                </Link>
              </li>
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
                  Terms of Service &amp; Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" prefetch={false} className="text-zinc-500 hover:text-blue-600 transition-colors">
                  Privacy Policy
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
              Independent, high-precision fee calculators &amp; margin forecasting for online sellers. Client-side math, with analytics that help us improve the site.
            </p>

            {/* Fee Schedule Status Badge */}
            <div className="mt-4 flex items-center gap-2 text-[11px] font-mono text-zinc-600 bg-zinc-100/90 px-3 py-1 rounded-full border border-zinc-200/80 w-fit">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>UPDATED FOR 2026 FEE SCHEDULES</span>
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
