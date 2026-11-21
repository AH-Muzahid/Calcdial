import { BookOpen } from "lucide-react";

export function EtsyInDepthGuide() {
  return (
      <article className="my-10 border-t border-b border-zinc-200 py-10 text-zinc-900 font-sans">
        {/* Header */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-600 mb-2">
            <BookOpen className="size-3.5" />
            <span>Seller Reference &amp; Methodology</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 leading-tight">
            How Etsy Fees Work in 2026: Mathematical Breakdown &amp; Margin Traps
          </h2>
          <p className="mt-2 text-sm sm:text-base text-zinc-700 leading-relaxed">
            A granular breakdown of Etsy’s current fee schedule, real-world deduction order, and three tactical pricing methods to protect seller take-home profits.
          </p>
        </div>

        {/* SECTION 1: How the 4 Fees Are Deducted */}
        <section className="mt-8 max-w-3xl space-y-4">
          <h3 className="text-lg sm:text-xl font-bold text-zinc-950 tracking-tight">
            1. The 4 Core Deductions on Every Order
          </h3>
          <p className="text-sm text-zinc-800 leading-relaxed">
            When an order is completed, Etsy does not take a single flat percentage. Instead, four distinct fee calculations execute in sequence before the net balance transfers to your bank:
          </p>

          <div className="space-y-4 pt-1">
            <div className="border-l-2 border-zinc-900 pl-4 py-0.5">
              <h4 className="text-sm font-bold text-zinc-950">
                Listing Fee: $0.20 USD per unit
              </h4>
              <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed mt-0.5">
                Assessed when a listing is created or renewed. Each listing lasts up to 4 months. If a customer purchases 3 units of an item in one transaction, you pay $0.20 for the original listing plus an auto-renewal fee of $0.20 for each of the 2 additional units ($0.60 total).
              </p>
            </div>

            <div className="border-l-2 border-zinc-900 pl-4 py-0.5">
              <h4 className="text-sm font-bold text-zinc-950">
                Transaction Fee: 6.5% on Gross Order Total
              </h4>
              <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed mt-0.5">
                Etsy assesses 6.5% on the entire buyer total—which includes the retail product price, optional gift wrap, and whatever shipping amount you charge the buyer.
              </p>
            </div>

            <div className="border-l-2 border-zinc-900 pl-4 py-0.5">
              <h4 className="text-sm font-bold text-zinc-950">
                Payment Processing: 3.0% + $0.25 (US Base)
              </h4>
              <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed mt-0.5">
                Deducted to process credit cards, PayPal, Apple Pay, and Klarna through Etsy Payments. Rates vary by merchant bank location (for example, 4.0% + £0.20 in the UK, 4.0% + €0.30 in Germany and France).
              </p>
            </div>

            <div className="border-l-2 border-zinc-900 pl-4 py-0.5">
              <h4 className="text-sm font-bold text-zinc-950">
                Offsite Ads Fee: 15% (Optional &lt;$10k) or 12% (Mandatory &ge;$10k)
              </h4>
              <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed mt-0.5">
                Only charged when a shopper clicks an Etsy-funded ad on Google, Facebook, Instagram, or Pinterest and purchases from your shop within 30 days. For shops earning under $10,000/yr, the fee is 15% (optional with opt-out). For shops exceeding $10,000/yr, Etsy rewards volume with a 12% discounted fee, but enrollment becomes permanently mandatory. Capped at $100 USD per order.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 2: Hidden Traps */}
        <section className="mt-10 max-w-3xl space-y-4">
          <h3 className="text-lg sm:text-xl font-bold text-zinc-950 tracking-tight">
            2. Four Hidden Traps That Erode Seller Margins
          </h3>
          <p className="text-sm text-zinc-800 leading-relaxed">
            Many new sellers budget for a ~10% platform cut, only to discover their true deductions exceed <strong>22% to 28%</strong>. These four rules explain where profit disappears:
          </p>

          <ul className="space-y-4 pt-1">
            <li className="space-y-1">
              <div className="text-sm font-bold text-zinc-950">
                Trap A: The 6.5% Cut on Buyer Postage
              </div>
              <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed">
                If an item sells for $30 with $10 shipping, Etsy takes 6.5% on the full $40 ($2.60). Even if postage costs you exactly $10 at the post office, you lose $0.65 of pure product profit to Etsy’s cut on shipping.
              </p>
            </li>

            <li className="space-y-1">
              <div className="text-sm font-bold text-zinc-950">
                Trap B: The Lifetime $10,000 Offsite Ads Lock-In
              </div>
              <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed">
                While shops under $10,000 can freely opt out of the 15% ad fee, crossing the $10,000 threshold locks your shop into permanent participation. Even though the rate drops from 15% to 12% as a volume discount, you can never opt out again, even if annual revenue drops below $10k in future years.
              </p>
            </li>

            <li className="space-y-1">
              <div className="text-sm font-bold text-zinc-950">
                Trap C: Country Regulatory Operating Fees
              </div>
              <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed">
                Sellers in specific countries face an additional statutory operating surcharge deducted from the order total: United Kingdom (0.32%), France (0.47%), Italy (0.32%), Spain (0.40%), and Turkey (2.07%).
              </p>
            </li>

            <li className="space-y-1">
              <div className="text-sm font-bold text-zinc-950">
                Trap D: Expired Stale Listing Overhead
              </div>
              <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed">
                Unsold items auto-renew every 4 months at $0.20 per SKU. A shop maintaining 300 slow-moving items spends $180 per year in renewal fees alone without generating a single transaction.
              </p>
            </li>
          </ul>
        </section>

        {/* SECTION 3: Actionable Tactics */}
        <section className="mt-10 max-w-3xl space-y-4">
          <h3 className="text-lg sm:text-xl font-bold text-zinc-950 tracking-tight">
            3. Three Practical Ways to Protect Take-Home Profit
          </h3>

          <div className="space-y-4 pt-1">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-zinc-950">
                Method 1: Shift to Multi-Packs and Variation Listings
              </h4>
              <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed">
                Low-priced items ($4 to $8) suffer disproportionately from fixed listing and processing fees ($0.45 fixed on an $8 order is 5.6% lost before percentage cuts). Group related items into 3-packs or create variation listings to raise your average order value (AOV) above $30.
              </p>
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-bold text-zinc-950">
                Method 2: Roll Postage Into Retail Price for Organic Placement
              </h4>
              <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed">
                Since Etsy charges 6.5% on shipping regardless, charging separate shipping offers zero financial savings. Incorporate average shipping into the item price ($45 free shipping instead of $38 + $7 shipping) to qualify for Etsy’s free shipping search priority while stabilizing fee math.
              </p>
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-bold text-zinc-950">
                Method 3: Build an Owned-Channel Funnel for Repeat Buyers
              </h4>
              <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed">
                Use Etsy as an initial customer discovery engine, but include a physical packaging insert directing buyers to your own Shopify storefront for future replenishment orders. On an owned store, you avoid Etsy’s 6.5% transaction cut and 12–15% offsite ads tax entirely.
              </p>
            </div>
          </div>
        </section>
      </article>
    );
}
