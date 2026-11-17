import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 text-gray-600 print:hidden">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded bg-emerald-600 text-xs font-bold text-white">
                CD
              </span>
              <span className="font-bold text-gray-900">CalcDial</span>
            </div>
            <p className="text-sm text-gray-500">
              100% free, client-side seller profit and platform fee calculators. Updated quarterly for 2026 platform schedules.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-900">Calculators</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/tools/etsy-fee-calculator" className="hover:text-emerald-600">
                  Etsy Fee Calculator
                </Link>
              </li>
              <li>
                <Link href="/tools/pod-profit-calculator" className="hover:text-emerald-600">
                  POD Profit Calculator
                </Link>
              </li>
              <li>
                <Link href="/tools/tiktok-shop-fee-calculator" className="hover:text-emerald-600">
                  TikTok Shop Calculator
                </Link>
              </li>
              <li>
                <Link href="/tools/shopify-profit-calculator" className="hover:text-emerald-600">
                  Shopify & ROAS Calculator
                </Link>
              </li>
              <li>
                <Link href="/tools/etsy-vs-shopify-vs-tiktok-shop-calculator" className="hover:text-emerald-600">
                  Marketplace Comparison
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-900">Seller Guides</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/guides/how-to-calculate-etsy-fees-2026" className="hover:text-emerald-600">
                  Calculate Etsy Fees 2026
                </Link>
              </li>
              <li>
                <Link href="/guides/etsy-vs-shopify-vs-tiktok-shop-comparison" className="hover:text-emerald-600">
                  Etsy vs. Shopify vs. TikTok
                </Link>
              </li>
              <li>
                <Link href="/guides/pod-pricing-strategy-offsite-ads" className="hover:text-emerald-600">
                  POD Pricing Strategy
                </Link>
              </li>
              <li>
                <Link href="/guides/pass-payment-processing-fees-to-clients" className="hover:text-emerald-600">
                  Client Invoice Gross-Up
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-900">Legal & Trust</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-emerald-600">
                  About Us & Methodology
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-emerald-600">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-emerald-600">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-emerald-600">
                  Terms of Service & Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} CalcDial. All calculations are estimates for educational and commercial planning purposes and do not constitute official accounting or financial advice.
        </div>
      </div>
    </footer>
  );
}
