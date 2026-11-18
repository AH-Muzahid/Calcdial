import { BookOpen } from "lucide-react";

interface InDepthGuideProps {
  toolSlug: string;
}

export function InDepthGuide({ toolSlug }: InDepthGuideProps) {
  // Support both Etsy and Shopify in-depth guides
  if (toolSlug === "shopify-profit-calculator") {
    return (
      <article className="my-10 border-t border-b border-zinc-200 py-10 text-zinc-900 font-sans">
        {/* Header */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-600 mb-2">
            <BookOpen className="size-3.5" />
            <span>Store Owner Reference &amp; Financial Methodology</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 leading-tight">
            How Shopify Fees &amp; Profit Margins Work in 2026: Mathematical Breakdown, Gateway Fees &amp; Break-Even ROAS
          </h2>
          <p className="mt-2 text-sm sm:text-base text-zinc-700 leading-relaxed">
            A granular financial breakdown of Shopify store deductions, third-party payment gateway penalties, customer acquisition cost (CAC) economics, and three battle-tested pricing tactics to safeguard 30%+ net margins.
          </p>
        </div>

        {/* SECTION 1: Direct Order Deductions */}
        <section className="mt-8 max-w-3xl space-y-4">
          <h3 className="text-lg sm:text-xl font-bold text-zinc-950 tracking-tight">
            1. The 4 Direct Deductions on Every Shopify Order
          </h3>
          <p className="text-sm text-zinc-800 leading-relaxed">
            Unlike marketplaces like Etsy or Amazon that assess a single blended referral commission, an independent Shopify store operates on four distinct direct unit cost layers before cash lands in your bank account:
          </p>

          <div className="space-y-4 pt-1">
            <div className="border-l-2 border-zinc-900 pl-4 py-0.5">
              <h4 className="text-sm font-bold text-zinc-950">
                Payment Processing: 2.9% + 30¢ (Basic) down to 2.5% + 30¢ (Advanced)
              </h4>
              <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed mt-0.5">
                Assessed on total checkout revenue (retail price + buyer shipping + sales tax). On the Basic Shopify plan ($39/mo), US domestic credit cards incur 2.9% + 30¢. Upgrading to the Shopify plan ($105/mo) reduces this to 2.7% + 30¢, and Advanced ($399/mo) lowers it to 2.5% + 30¢. International cards carry an extra 1.0% to 1.5% cross-border surcharge.
              </p>
            </div>

            <div className="border-l-2 border-zinc-900 pl-4 py-0.5">
              <h4 className="text-sm font-bold text-zinc-950">
                The 3rd-Party Gateway Penalty Tax: 0.6% to 2.0%
              </h4>
              <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed mt-0.5">
                Shopify waives additional platform fees if you use native Shopify Payments. However, if you connect an external processor (Stripe, PayPal Express, Authorize.Net, Amazon Pay, or Klarna), Shopify assesses an extra transaction surcharge: 2.0% on Basic, 1.0% on Shopify, and 0.6% on Advanced. A merchant using PayPal on the Basic plan pays PayPal’s fee (3.49% + 49¢) plus Shopify’s 2.0% surcharge = <strong>5.49% + 49¢ total per transaction!</strong>
              </p>
            </div>

            <div className="border-l-2 border-zinc-900 pl-4 py-0.5">
              <h4 className="text-sm font-bold text-zinc-950">
                Landed Cost of Goods Sold (COGS) &amp; Carrier Postage
              </h4>
              <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed mt-0.5">
                The true direct unit cost (raw materials, factory manufacturing, freight customs, and branded packaging inserts) plus the actual postage paid to shipping carriers (USPS Ground Advantage, UPS, DHL, FedEx) to fulfill the order.
              </p>
            </div>

            <div className="border-l-2 border-zinc-900 pl-4 py-0.5">
              <h4 className="text-sm font-bold text-zinc-950">
                Customer Acquisition Cost (CAC / Paid Ad Spend)
              </h4>
              <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed mt-0.5">
                The amortized marketing spend required across Meta (Facebook &amp; Instagram), Google Shopping, or TikTok Ads to convert one paying customer. In competitive D2C niches, customer acquisition costs typically consume 25% to 40% of the gross product price.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 2: Hidden Margin Traps */}
        <section className="mt-10 max-w-3xl space-y-4">
          <h3 className="text-lg sm:text-xl font-bold text-zinc-950 tracking-tight">
            2. Four Hidden Traps That Erode Shopify Store Margins
          </h3>
          <p className="text-sm text-zinc-800 leading-relaxed">
            Many first-time store owners focus solely on top-line revenue, only to discover their actual take-home profit is near zero. These four real-world traps explain where margin leaks:
          </p>

          <ul className="space-y-4 pt-1">
            <li className="space-y-1">
              <div className="text-sm font-bold text-zinc-950">
                Trap A: Non-Refundable Processing Fees on Returns &amp; Cancellations
              </div>
              <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed">
                When a customer returns an order or requests a cancellation, payment processors (including Shopify Payments and Stripe) do not refund the credit card transaction fee (2.9% + 30¢). On a $100 order that gets returned, you lose $3.20 out of pocket. For stores with a 10% return rate, unrecovered transaction fees quietly drain 0.3% to 0.5% of total annual top-line revenue.
              </p>
            </li>

            <li className="space-y-1">
              <div className="text-sm font-bold text-zinc-950">
                Trap B: The 3rd-Party Gateway Double-Dip
              </div>
              <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed">
                Store owners who enable PayPal Express or alternate checkout methods without enabling Shopify Payments often fail to realize they are paying two independent transaction fees on the exact same dollar: PayPal’s merchant discount rate plus Shopify’s 2.0% platform penalty.
              </p>
            </li>

            <li className="space-y-1">
              <div className="text-sm font-bold text-zinc-950">
                Trap C: The "Blended ROAS" Fallacy on Meta &amp; TikTok Ads
              </div>
              <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed">
                Evaluating ad performance using account-wide blended ROAS instead of calculating SKU-level break-even thresholds is the primary reason scaling brands burn cash. If a product has a 55% gross margin, any ad campaign generating lower than 1.82x ROAS is directly losing money on every single sale.
              </p>
            </li>

            <li className="space-y-1">
              <div className="text-sm font-bold text-zinc-950">
                Trap D: SaaS App Stack Overhead at Low Order Volumes
              </div>
              <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed">
                A typical store installs 6 to 10 apps: email flows ($45/mo), review widgets ($29/mo), upsell popups ($19/mo), and landing page builders ($39/mo) totaling $150 to $250/month. If your store only fulfills 150 orders in a given month, fixed app subscriptions add $1.33 of overhead per unit sold.
              </p>
            </li>
          </ul>
        </section>

        {/* SECTION 3: Actionable Tactics */}
        <section className="mt-10 max-w-3xl space-y-4">
          <h3 className="text-lg sm:text-xl font-bold text-zinc-950 tracking-tight">
            3. Three Mathematical Rules to Guarantee 30%+ Net Margins
          </h3>

          <div className="space-y-4 pt-1">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-zinc-950">
                Rule 1: The 3.5× Landed Markup Rule for Paid Traffic
              </h4>
              <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed">
                To safely acquire customers via paid social ads while maintaining a 30% bottom-line net profit, set your retail selling price at least 3.5× to 4× your landed unit cost (COGS). If an item costs $12.00 landed, pricing it at $48.00 leaves a healthy $36.00 gross contribution margin—allowing up to $14.00 for customer acquisition (CAC) and still netting over $15.00 clean profit.
              </p>
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-bold text-zinc-950">
                Rule 2: Free Shipping Thresholds &amp; AOV Bundling
              </h4>
              <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed">
                Because credit card processors deduct a fixed 30¢ on every transaction, low-ticket orders ($15 to $20) suffer disproportionately. Setting a free shipping threshold 20% to 30% above your median average order value (e.g. "$65 Free Shipping") encourages multi-item carts, dilutes fixed fees, and increases cash profit per order.
              </p>
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-bold text-zinc-950">
                Rule 3: The Plan Upgrade Tipping Point Math
              </h4>
              <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed">
                Upgrading from Basic Shopify ($39/mo) to the regular Shopify plan ($105/mo) costs an extra $66/month. However, it lowers credit card processing from 2.9% to 2.7% (a 0.2% savings) and 3rd-party fees from 2.0% to 1.0% (a 1.0% savings). If your store processes more than $6,600/month with external gateways or ~$16,500/month via Shopify Payments, the fee savings exceed the plan cost difference—generating immediate net savings.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 4: Break-Even ROAS Quick Reference Table */}
        <section className="mt-10 max-w-3xl space-y-4">
          <h3 className="text-lg sm:text-xl font-bold text-zinc-950 tracking-tight">
            4. Break-Even ROAS Quick Reference Table
          </h3>
          <p className="text-sm text-zinc-800 leading-relaxed">
            Use this benchmark table to quickly determine the minimum advertising return required on Meta, TikTok, or Google Ads based on your product’s gross margin:
          </p>

          <div className="overflow-x-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50/80 text-zinc-900 font-bold">
                  <th className="py-2.5 px-3">Gross Margin %</th>
                  <th className="py-2.5 px-3 text-right">Min. Break-Even ROAS</th>
                  <th className="py-2.5 px-3 text-right">Max CAC % of Retail</th>
                  <th className="py-2.5 px-3">Margin Health Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-zinc-800 font-mono">
                <tr className="hover:bg-zinc-50/50">
                  <td className="py-2 px-3 font-bold text-zinc-950">80% Margin</td>
                  <td className="py-2 px-3 text-right text-emerald-700 font-extrabold">1.25x ROAS</td>
                  <td className="py-2 px-3 text-right">Up to 80%</td>
                  <td className="py-2 px-3 font-sans text-emerald-700 font-bold">Exceptional (High Ad Scalability)</td>
                </tr>
                <tr className="hover:bg-zinc-50/50">
                  <td className="py-2 px-3 font-bold text-zinc-950">70% Margin</td>
                  <td className="py-2 px-3 text-right text-emerald-700 font-extrabold">1.43x ROAS</td>
                  <td className="py-2 px-3 text-right">Up to 70%</td>
                  <td className="py-2 px-3 font-sans text-emerald-600 font-bold">Healthy D2C Benchmark</td>
                </tr>
                <tr className="hover:bg-zinc-50/50">
                  <td className="py-2 px-3 font-bold text-zinc-950">60% Margin</td>
                  <td className="py-2 px-3 text-right text-zinc-950 font-bold">1.67x ROAS</td>
                  <td className="py-2 px-3 text-right">Up to 60%</td>
                  <td className="py-2 px-3 font-sans text-zinc-700 font-medium">Standard E-Commerce</td>
                </tr>
                <tr className="hover:bg-zinc-50/50">
                  <td className="py-2 px-3 font-bold text-zinc-950">50% Margin</td>
                  <td className="py-2 px-3 text-right text-amber-700 font-bold">2.00x ROAS</td>
                  <td className="py-2 px-3 text-right">Up to 50%</td>
                  <td className="py-2 px-3 font-sans text-amber-700 font-medium">Narrow Margin (Needs High AOV)</td>
                </tr>
                <tr className="hover:bg-zinc-50/50">
                  <td className="py-2 px-3 font-bold text-zinc-950">40% Margin</td>
                  <td className="py-2 px-3 text-right text-red-600 font-bold">2.50x ROAS</td>
                  <td className="py-2 px-3 text-right">Up to 40%</td>
                  <td className="py-2 px-3 font-sans text-red-600 font-medium">High Risk Under Paid Ads</td>
                </tr>
                <tr className="hover:bg-zinc-50/50">
                  <td className="py-2 px-3 font-bold text-zinc-950">30% Margin</td>
                  <td className="py-2 px-3 text-right text-red-700 font-extrabold">3.33x ROAS</td>
                  <td className="py-2 px-3 text-right">Up to 30%</td>
                  <td className="py-2 px-3 font-sans text-red-700 font-bold">Critical (Requires Organic Traffic)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </article>
    );
  }

  // Etsy In-Depth Guide
  if (toolSlug === "etsy-fee-calculator") {
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
                Offsite Ads Fee: 12% to 15% (Attributed Sales Only)
              </h4>
              <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed mt-0.5">
                Only charged when a shopper clicks an Etsy-funded ad on Google, Facebook, Instagram, or Pinterest and purchases from your shop within 30 days. Capped at $100 USD per order.
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
                Once your shop achieves $10,000 USD in gross revenue over any rolling 12-month period, participation in Etsy Offsite Ads becomes mandatory at a 12% rate. Etsy terms state you can never opt out again, even if annual revenue drops below $10k in subsequent years.
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

  return null;
}
