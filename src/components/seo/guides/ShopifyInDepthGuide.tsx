import { BookOpen } from "lucide-react";

export function ShopifyInDepthGuide() {
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
