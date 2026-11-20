import { BookOpen } from "lucide-react";

export function TikTokInDepthGuide() {
  return (
    <article className="my-10 border-t border-b border-zinc-200 py-10 text-zinc-900 font-sans">
      {/* Header */}
      <div className="max-w-3xl">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-600 mb-2">
          <BookOpen className="size-3.5" />
          <span>TikTok Shop Seller Blueprint &amp; Financial Architecture (2026 Edition)</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 leading-tight">
          How TikTok Shop Fees, Creator Affiliate Commissions &amp; Profit Margins Work in 2026
        </h2>
        <p className="mt-2 text-sm sm:text-base text-zinc-700 leading-relaxed">
          A granular economic breakdown of TikTok Shop&apos;s category referral rates, merchant transaction processing fees, creator marketplace affiliate commissions, logistics co-pay subsidies, and strategies to protect 30%+ net margins on high-velocity viral products.
        </p>
      </div>

      {/* SECTION 1: The 3 Core Fee Layers */}
      <section className="mt-8 max-w-3xl space-y-4">
        <h3 className="text-lg sm:text-xl font-bold text-zinc-950 tracking-tight">
          1. The Three Primary Cost Layers on Every TikTok Shop Sale
        </h3>
        <p className="text-sm text-zinc-800 leading-relaxed">
          Unlike traditional marketplaces that assess an isolated referral commission, selling on TikTok Shop combines native social content distribution with retail commerce. Before payout settlement funds reach your business bank account, three distinct deduction layers are calculated:
        </p>

        <div className="space-y-4 pt-1">
          <div className="border-l-2 border-zinc-900 pl-4 py-0.5">
            <h4 className="text-sm font-bold text-zinc-950">
              A. Category Referral Commission: 5.0% to 6.0%
            </h4>
            <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed mt-0.5">
              Following the expiration of TikTok&apos;s early 2% seller introductory promotions, standard US referral rates are fixed at <strong>6.0%</strong> across major volume categories (Beauty &amp; Personal Care, Apparel &amp; Fashion, Home &amp; Kitchen, Health, Sports, Food, and Pet Supplies) and <strong>5.0%</strong> for Electronics and Mobile Devices. This fee is calculated strictly on the item listing price visible at checkout.
            </p>
          </div>

          <div className="border-l-2 border-zinc-900 pl-4 py-0.5">
            <h4 className="text-sm font-bold text-zinc-950">
              B. Payment Processing Fee: 1.8% + $0.30 per Order
            </h4>
            <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed mt-0.5">
              To cover electronic payment gateway authorization, fraud prevention protocols, and banking network settlement, TikTok Shop deducts <strong>1.8% + $0.30</strong> per completed paid order. For lower-priced items under $15, this transaction fee represents a significant share of top-line revenue that sellers must factor into their unit economics.
            </p>
          </div>

          <div className="border-l-2 border-zinc-900 pl-4 py-0.5">
            <h4 className="text-sm font-bold text-zinc-950">
              C. Creator Affiliate Marketplace Commission: 10% to 20%
            </h4>
            <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed mt-0.5">
              The engine driving viral product discovery is the TikTok Creator Marketplace (Affiliate Open &amp; Targeted Collaborations). When a creator tags your product in a video or live stream that converts a shopper, TikTok automatically splits off their commission from the customer purchase price. While rates are merchant-configurable, competitive benchmarks range between <strong>10% and 20%</strong>. Setting below 10% drastically reduces creator sample requests, while exceeding 20% risks negative net margins.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: Shipping, FBT & Logistics Co-Pays */}
      <section className="mt-10 max-w-3xl space-y-4">
        <h3 className="text-lg sm:text-xl font-bold text-zinc-950 tracking-tight">
          2. Fulfillment Logistics: Merchant Shipping, FBT &amp; Co-Pay Subsidies
        </h3>
        <p className="text-sm text-zinc-800 leading-relaxed">
          Order fulfillment represents the largest out-of-pocket operational cost for TikTok Shop merchants. Sellers operate under two primary models:
        </p>

        <ul className="space-y-4 pt-1">
          <li className="space-y-1">
            <div className="text-sm font-bold text-zinc-950">
              Model 1: Shipped by Merchant (FBM / 3PL)
            </div>
            <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed">
              Merchants purchase postage labels through TikTok Shipping (leveraging negotiated USPS and UPS rates) or ship via an external 3PL warehouse. TikTok enforces strict Service Level Agreements (SLAs): orders must be handed over to the carrier within <strong>2 business days</strong> with a valid on-time dispatch rate exceeding 95%. Violations trigger late dispatch penalty points and account probation.
            </p>
          </li>

          <li className="space-y-1">
            <div className="text-sm font-bold text-zinc-950">
              Model 2: Fulfilled by TikTok (FBT)
            </div>
            <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed">
              Merchants store inventory in TikTok-managed fulfillment centers. TikTok handles picking, packing, rapid 2-day delivery, and customer service inquiries. In exchange, merchants pay storage fees per cubic foot plus order fulfillment handling fees ($2.50 to $4.80 depending on parcel weight and size). FBT listings receive algorithmic delivery badges that boost checkout conversion rates by up to 28%.
            </p>
          </li>

          <li className="space-y-1">
            <div className="text-sm font-bold text-zinc-950">
              TikTok Logistics Co-Pay Subsidies &amp; Free Shipping Badges
            </div>
            <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed">
              To drive consumer adoption, TikTok frequently funds promotional shipping vouchers (such as &ldquo;Free Shipping on Orders $20+&rdquo;). In qualifying campaigns, TikTok covers carrier postage up to a predetermined threshold (e.g., $3.50 to $5.00), leaving the merchant with zero out-of-pocket postage expenses for subsidized orders. When running native store promotions without TikTok co-pays, merchants absorb full postage costs.
            </p>
          </li>
        </ul>
      </section>

      {/* SECTION 3: Four Profit Traps That Kill TikTok Shop Margins */}
      <section className="mt-10 max-w-3xl space-y-4">
        <h3 className="text-lg sm:text-xl font-bold text-zinc-950 tracking-tight">
          3. Four Hidden Traps That Erode TikTok Shop Margins
        </h3>
        <p className="text-sm text-zinc-800 leading-relaxed">
          Viral sales spikes often disguise severe unit economic losses. Merchants frequently run into these four margin-destroying traps:
        </p>

        <ul className="space-y-4 pt-1">
          <li className="space-y-1">
            <div className="text-sm font-bold text-zinc-950">
              Trap A: The Affiliate + Spark Ads Double Spend
            </div>
            <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed">
              When a creator video gains organic traction, merchants frequently boost it using Spark Ads through TikTok Ads Manager. If a merchant pays a 15% affiliate commission to the creator AND spends $12.00 per acquisition in paid ad spend on a $35.00 product, marketing costs alone total <strong>$17.25 (49.3% of revenue)</strong>, almost guaranteeing a net loss after COGS and shipping.
            </p>
          </li>

          <li className="space-y-1">
            <div className="text-sm font-bold text-zinc-950">
              Trap B: Non-Refundable Processing on High Return Rates
            </div>
            <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed">
              Apparel and fashion items on TikTok Shop regularly encounter return rates of 15% to 25% due to impulse buying habits. While TikTok credits back the 6% referral commission upon customer refund, the $0.30 fixed transaction fee, original outbound carrier shipping, and reverse return postage are unrecoverable sunk costs.
            </p>
          </li>

          <li className="space-y-1">
            <div className="text-sm font-bold text-zinc-950">
              Trap C: Free Product Sample Seeding Drain
            </div>
            <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed">
              Sending 100 free inventory samples to creators without requiring minimum follower counts or historical GMV criteria costs $1,500 to $2,500 in COGS and postage. If only 12% of those creators actually post videos and fewer than 3 generate sales, sample seeding becomes an unamortized balance sheet liability.
            </p>
          </li>

          <li className="space-y-1">
            <div className="text-sm font-bold text-zinc-950">
              Trap D: Low-Ticket Order Fee Drag
            </div>
            <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed">
              On an $11.00 item with $3.50 carrier postage and $3.00 product COGS, the 6% referral fee ($0.66), flat $0.30 transaction fee, and a 15% affiliate cut ($1.65) leave only $1.89 in net profit—a razor-thin margin vulnerable to a single customer return or lost parcel.
            </p>
          </li>
        </ul>
      </section>

      {/* SECTION 4: Three Mathematical Strategies to Protect 30%+ Margins */}
      <section className="mt-10 max-w-3xl space-y-4">
        <h3 className="text-lg sm:text-xl font-bold text-zinc-950 tracking-tight">
          4. Three Mathematical Rules to Guarantee 30%+ Net Margins
        </h3>

        <div className="space-y-4 pt-1">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-zinc-950">
              Rule 1: The 4× Landed Markup Rule for Social Commerce
            </h4>
            <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed">
              To support both TikTok&apos;s 6% platform referral fee and a competitive 15% creator affiliate commission while fulfilling carrier shipping, price your product at a minimum of <strong>4.0× your landed unit cost (COGS)</strong>. An item manufactured for $8.00 should be listed at $32.00 or higher. This creates $24.00 of gross contribution margin, absorbing $6.72 in platform/affiliate fees and $4.50 in fulfillment while netting $10.78 (33.7% net profit).
            </p>
          </div>

          <div className="space-y-1">
            <h4 className="text-sm font-bold text-zinc-950">
              Rule 2: Two-Pack &amp; Three-Pack Bundling to Elevate AOV
            </h4>
            <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed">
              Instead of selling a single unit for $16.00 where packaging and the $0.30 fixed fee erode margins, bundle two units for $28.00 or three for $39.00. Carrier shipping increases only marginally (e.g., from $4.10 to $5.20), cutting fulfillment cost per unit by 35% and dramatically increasing the creator&apos;s dollar commission payout, making your listing far more attractive in Creator Marketplace.
            </p>
          </div>

          <div className="space-y-1">
            <h4 className="text-sm font-bold text-zinc-950">
              Rule 3: Tiered Creator Commission Structuring
            </h4>
            <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed">
              Rather than offering a blanket 20% commission on public open collaboration, set your baseline Open Collaboration rate at 10% to 12%. Reserve 15% to 20% for Targeted Collaborations offered exclusively to vetted creators with verified track records of generating over $5,000 in monthly GMV and high-converting live streams.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 5: Category Referral Fee Schedule Table */}
      <section className="mt-10 max-w-3xl space-y-4">
        <h3 className="text-lg sm:text-xl font-bold text-zinc-950 tracking-tight">
          5. TikTok Shop Category Fee &amp; Commission Reference Table (2026)
        </h3>
        <p className="text-sm text-zinc-800 leading-relaxed">
          Standard category referral rates and standard affiliate commission benchmarks for US sellers:
        </p>

        <div className="overflow-x-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/80 text-zinc-900 font-bold">
                <th className="py-2.5 px-3">Product Category</th>
                <th className="py-2.5 px-3 text-right">Referral Fee</th>
                <th className="py-2.5 px-3 text-right">Flat Transaction Fee</th>
                <th className="py-2.5 px-3 text-right">Avg. Affiliate Rate</th>
                <th className="py-2.5 px-3">Margin Health Benchmark</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-800 font-mono">
              <tr className="hover:bg-zinc-50/50">
                <td className="py-2 px-3 font-bold text-zinc-950">Beauty &amp; Personal Care</td>
                <td className="py-2 px-3 text-right font-bold text-zinc-950">6.0%</td>
                <td className="py-2 px-3 text-right">$0.30</td>
                <td className="py-2 px-3 text-right text-purple-700 font-bold">15% – 20%</td>
                <td className="py-2 px-3 font-sans text-emerald-700 font-bold">High (65%+ Gross Margins)</td>
              </tr>
              <tr className="hover:bg-zinc-50/50">
                <td className="py-2 px-3 font-bold text-zinc-950">Apparel &amp; Fashion</td>
                <td className="py-2 px-3 text-right font-bold text-zinc-950">6.0%</td>
                <td className="py-2 px-3 text-right">$0.30</td>
                <td className="py-2 px-3 text-right text-purple-700 font-bold">12% – 18%</td>
                <td className="py-2 px-3 font-sans text-amber-700 font-medium">Moderate (Watch Return Rates)</td>
              </tr>
              <tr className="hover:bg-zinc-50/50">
                <td className="py-2 px-3 font-bold text-zinc-950">Electronics &amp; Gadgets</td>
                <td className="py-2 px-3 text-right font-bold text-emerald-700">5.0%</td>
                <td className="py-2 px-3 text-right">$0.30</td>
                <td className="py-2 px-3 text-right text-purple-700 font-bold">8% – 12%</td>
                <td className="py-2 px-3 font-sans text-amber-700 font-medium">Narrow (Needs Higher AOV)</td>
              </tr>
              <tr className="hover:bg-zinc-50/50">
                <td className="py-2 px-3 font-bold text-zinc-950">Home &amp; Kitchen</td>
                <td className="py-2 px-3 text-right font-bold text-zinc-950">6.0%</td>
                <td className="py-2 px-3 text-right">$0.30</td>
                <td className="py-2 px-3 text-right text-purple-700 font-bold">10% – 15%</td>
                <td className="py-2 px-3 font-sans text-emerald-600 font-bold">Strong Viral Potential</td>
              </tr>
              <tr className="hover:bg-zinc-50/50">
                <td className="py-2 px-3 font-bold text-zinc-950">Health &amp; Supplements</td>
                <td className="py-2 px-3 text-right font-bold text-zinc-950">6.0%</td>
                <td className="py-2 px-3 text-right">$0.30</td>
                <td className="py-2 px-3 text-right text-purple-700 font-bold">15% – 20%</td>
                <td className="py-2 px-3 font-sans text-emerald-700 font-bold">High LTV / Reorder Rates</td>
              </tr>
              <tr className="hover:bg-zinc-50/50">
                <td className="py-2 px-3 font-bold text-zinc-950">Toys, Hobbies &amp; Games</td>
                <td className="py-2 px-3 text-right font-bold text-zinc-950">6.0%</td>
                <td className="py-2 px-3 text-right">$0.30</td>
                <td className="py-2 px-3 text-right text-purple-700 font-bold">10% – 15%</td>
                <td className="py-2 px-3 font-sans text-zinc-700 font-medium">Seasonal Peaks (Q4)</td>
              </tr>
              <tr className="hover:bg-zinc-50/50">
                <td className="py-2 px-3 font-bold text-zinc-950">Sports &amp; Outdoors</td>
                <td className="py-2 px-3 text-right font-bold text-zinc-950">6.0%</td>
                <td className="py-2 px-3 text-right">$0.30</td>
                <td className="py-2 px-3 text-right text-purple-700 font-bold">10% – 15%</td>
                <td className="py-2 px-3 font-sans text-emerald-600 font-bold">Solid Margin Health</td>
              </tr>
              <tr className="hover:bg-zinc-50/50">
                <td className="py-2 px-3 font-bold text-zinc-950">Food &amp; Beverage</td>
                <td className="py-2 px-3 text-right font-bold text-zinc-950">6.0%</td>
                <td className="py-2 px-3 text-right">$0.30</td>
                <td className="py-2 px-3 text-right text-purple-700 font-bold">10% – 15%</td>
                <td className="py-2 px-3 font-sans text-emerald-600 font-bold">High Reorder Potential</td>
              </tr>
              <tr className="hover:bg-zinc-50/50">
                <td className="py-2 px-3 font-bold text-zinc-950">Pet Supplies</td>
                <td className="py-2 px-3 text-right font-bold text-zinc-950">6.0%</td>
                <td className="py-2 px-3 text-right">$0.30</td>
                <td className="py-2 px-3 text-right text-purple-700 font-bold">12% – 15%</td>
                <td className="py-2 px-3 font-sans text-emerald-600 font-bold">High Creator Engagement</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </article>
  );
}
