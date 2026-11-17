import Link from "next/link";
import { CalcDialLogo } from "./CalcDialLogo";

export function Footer() {
  return (
    <footer className="border-t border-black/[0.06] bg-white text-zinc-600 print:hidden mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="space-y-4">
            <CalcDialLogo />
            <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed">
              100% private, client-side financial calculations for independent e-commerce sellers. Zero tracking, zero server-side storage.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-black bg-black/[0.03] px-3 py-1 rounded-full border border-black/[0.06] w-fit">
              <span className="size-1.5 rounded-full bg-black" />
              <span>UPDATED Q1 2026</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-black">
              Calculators
            </h4>
            <ul className="mt-3 space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/tools/etsy-fee-calculator" className="hover:text-black transition-colors">
                  Etsy Fee Calculator
                </Link>
              </li>
              <li>
                <Link href="/tools/pod-profit-calculator" className="hover:text-black transition-colors">
                  Print-on-Demand Profit
                </Link>
              </li>
              <li>
                <Link href="/tools/tiktok-shop-fee-calculator" className="hover:text-black transition-colors">
                  TikTok Shop Calculator
                </Link>
              </li>
              <li>
                <Link href="/tools/shopify-profit-calculator" className="hover:text-black transition-colors">
                  Shopify & ROAS Engine
                </Link>
              </li>
              <li>
                <Link href="/tools/etsy-vs-shopify-vs-tiktok-shop-calculator" className="hover:text-black transition-colors">
                  Marketplace Comparison
                </Link>
              </li>
              <li>
                <Link href="/tools/stripe-vs-paypal-fee-calculator" className="hover:text-black transition-colors">
                  Stripe vs PayPal Calculator
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-black">
              Seller Guides
            </h4>
            <ul className="mt-3 space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/guides/how-to-calculate-etsy-fees-2026" className="hover:text-black transition-colors">
                  Calculate Etsy Fees 2026
                </Link>
              </li>
              <li>
                <Link href="/guides/etsy-vs-shopify-vs-tiktok-shop-comparison" className="hover:text-black transition-colors">
                  Etsy vs Shopify vs TikTok
                </Link>
              </li>
              <li>
                <Link href="/guides/pod-pricing-strategy-offsite-ads" className="hover:text-black transition-colors">
                  POD Pricing Strategy
                </Link>
              </li>
              <li>
                <Link href="/guides/pass-payment-processing-fees-to-clients" className="hover:text-black transition-colors">
                  Client Invoice Gross-Up
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-black">
              Trust & Legal
            </h4>
            <ul className="mt-3 space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/about" className="hover:text-black transition-colors">
                  About CalcDial & Math
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-black transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-black transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-black transition-colors">
                  Terms of Service & Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-black/[0.06] pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 gap-4">
          <p>© {new Date().getFullYear()} CalcDial. Engineered for high precision.</p>
          <p className="text-center sm:text-right">
            Independent utility. Not affiliated with Etsy, Inc., Shopify Inc., or ByteDance Ltd.
          </p>
        </div>
      </div>
    </footer>
  );
}
