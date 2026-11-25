import Link from "next/link";
import React from "react";
import { CalcDialLogo } from "./CalcDialLogo";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200/80 bg-white text-zinc-600 print:hidden mt-auto overflow-hidden font-sans">
      <div className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        {/* Top Section: 4 Link Columns + Brand Column */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
          {/* Column 1: Calculators */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-950 font-sans">
              <Link href="/calculators" className="hover:text-[#2b5cfd] transition-colors">
                Calculators
              </Link>
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/calculators" prefetch={false} className="font-semibold text-[#2b5cfd] hover:text-[#2554f6] transition-colors">
                  All Calculators Directory →
                </Link>
              </li>
              <li>
                <Link href="/tools/etsy-fee-calculator" prefetch={false} className="text-zinc-500 hover:text-[#2b5cfd] transition-colors">
                  Etsy Fee Calculator
                </Link>
              </li>
              <li>
                <Link href="/tools/shopify-profit-calculator" prefetch={false} className="text-zinc-500 hover:text-[#2b5cfd] transition-colors">
                  Shopify Profit &amp; ROAS Calculator
                </Link>
              </li>
              <li>
                <Link href="/tools/tiktok-shop-fee-calculator" prefetch={false} className="text-zinc-500 hover:text-[#2b5cfd] transition-colors">
                  TikTok Shop Calculator
                </Link>
              </li>
              <li>
                <Link href="/tools/stripe-vs-paypal-fee-calculator" prefetch={false} className="text-zinc-500 hover:text-[#2b5cfd] transition-colors">
                  Stripe vs PayPal
                </Link>
              </li>
              <li>
                <Link href="/tools/pod-profit-calculator" prefetch={false} className="text-zinc-500 hover:text-[#2b5cfd] transition-colors">
                  Print-on-Demand Profit
                </Link>
              </li>
              <li>
                <Link href="/comparisons" prefetch={false} className="text-zinc-500 hover:text-[#2b5cfd] transition-colors">
                  All Comparisons Hub
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Seller Guides */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-950 font-sans">
              <Link href="/guides" className="hover:text-[#2b5cfd] transition-colors">
                Seller Guides
              </Link>
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/guides" prefetch={false} className="font-semibold text-[#2b5cfd] hover:text-[#2554f6] transition-colors">
                  All Guides Directory →
                </Link>
              </li>
              <li>
                <Link href="/guides/how-to-calculate-etsy-fees-2026" prefetch={false} className="text-zinc-500 hover:text-[#2b5cfd] transition-colors">
                  Etsy Fees in 2026
                </Link>
              </li>
              <li>
                <Link href="/guides/etsy-vs-shopify-vs-tiktok-shop-comparison" prefetch={false} className="text-zinc-500 hover:text-[#2b5cfd] transition-colors">
                  Etsy vs Shopify vs TikTok
                </Link>
              </li>
              <li>
                <Link href="/guides/pod-pricing-strategy-offsite-ads" prefetch={false} className="text-zinc-500 hover:text-[#2b5cfd] transition-colors">
                  POD Pricing Strategy
                </Link>
              </li>
              <li>
                <Link href="/guides/pass-payment-processing-fees-to-clients" prefetch={false} className="text-zinc-500 hover:text-[#2b5cfd] transition-colors">
                  Invoice Gross-Up Guide
                </Link>
              </li>
              <li>
                <Link href="/#fee-traps" prefetch={false} className="text-zinc-500 hover:text-[#2b5cfd] transition-colors">
                  Platform Fee Traps
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Platforms */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-950 font-sans">
              Platforms
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/tools/etsy-fee-calculator" prefetch={false} className="text-zinc-500 hover:text-[#2b5cfd] transition-colors">
                  Etsy Marketplace
                </Link>
              </li>
              <li>
                <Link href="/tools/shopify-profit-calculator" prefetch={false} className="text-zinc-500 hover:text-[#2b5cfd] transition-colors">
                  Shopify Stores
                </Link>
              </li>
              <li>
                <Link href="/tools/tiktok-shop-fee-calculator" prefetch={false} className="text-zinc-500 hover:text-[#2b5cfd] transition-colors">
                  TikTok Shop
                </Link>
              </li>
              <li>
                <Link href="/tools/stripe-vs-paypal-fee-calculator" prefetch={false} className="text-zinc-500 hover:text-[#2b5cfd] transition-colors">
                  Stripe Payments
                </Link>
              </li>
              <li>
                <Link href="/tools/stripe-vs-paypal-fee-calculator" prefetch={false} className="text-zinc-500 hover:text-[#2b5cfd] transition-colors">
                  PayPal Commerce
                </Link>
              </li>
              <li>
                <Link href="/tools/pod-profit-calculator" prefetch={false} className="text-zinc-500 hover:text-[#2b5cfd] transition-colors">
                  Printify POD
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Trust & Legal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-950 font-sans">
              Trust &amp; Legal
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/about" prefetch={false} className="text-zinc-500 hover:text-[#2b5cfd] transition-colors">
                  About CalcDial
                </Link>
              </li>
              <li>
                <Link href="/terms" prefetch={false} className="text-zinc-500 hover:text-[#2b5cfd] transition-colors">
                  Terms of Service &amp; Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" prefetch={false} className="text-zinc-500 hover:text-[#2b5cfd] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" prefetch={false} className="text-zinc-500 hover:text-[#2b5cfd] transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5 & 6: Brand Column */}
          <div className="col-span-2 sm:col-span-2 md:col-span-4 lg:col-span-2 flex flex-col justify-start">
            <CalcDialLogo />

            <p className="mt-4 text-sm text-zinc-500 leading-relaxed font-normal max-w-sm">
              Independent, high-precision fee calculators &amp; margin forecasting for online sellers. Client-side math, with analytics that help us improve the site.
            </p>

            {/* Social / Source Link */}
            <div className="mt-4 flex items-center gap-2">
              <a
                href="https://github.com/AH-Muzahid/Calcdial"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub Repository"
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-200/90 bg-white hover:border-zinc-400 hover:bg-zinc-50 text-zinc-600 hover:text-zinc-950 transition-all shadow-2xs text-xs font-semibold font-sans"
              >
                <svg className="size-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span>GitHub Source</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="mt-16 border-t border-zinc-200/80 pt-8 pb-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© {new Date().getFullYear()} CalcDial. All rights reserved.</p>
          <p className="text-zinc-400 text-xs text-center sm:text-right">
            Independent utility. Not affiliated with Etsy, Shopify, TikTok, Stripe, or PayPal.
          </p>
        </div>
      </div>
    </footer>
  );
}
