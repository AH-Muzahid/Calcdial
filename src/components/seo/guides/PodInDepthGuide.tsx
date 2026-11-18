import { BookOpen } from "lucide-react";

export function PodInDepthGuide() {
  return (
    <article className="my-10 border-t border-b border-zinc-200 py-10 text-zinc-900 font-sans">
      {/* Header */}
      <div className="max-w-3xl">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-600 mb-2">
          <BookOpen className="size-3.5" />
          <span>POD Merchant Reference &amp; Unit Economics Blueprint</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 leading-tight">
          How Print-on-Demand Profit Margins Work in 2026: Production Costs, Shipping Realities &amp; Platform Architecture
        </h2>
        <p className="mt-2 text-sm sm:text-base text-zinc-700 leading-relaxed">
          A definitive financial guide breaking down blank apparel and direct-to-garment (DTG) production costs across Printify, Gelato, and Printful, carrier postage traps, marketing customer acquisition cost (CAC) thresholds, and three battle-tested pricing tactics to lock in 30%+ net margins.
        </p>
      </div>

      {/* SECTION 1: The 4 Direct Cost Layers */}
      <section className="mt-8 max-w-3xl space-y-4">
        <h3 className="text-lg sm:text-xl font-bold text-zinc-950 tracking-tight">
          1. The 4 Direct Cost Layers of Every Print-on-Demand Order
        </h3>
        <p className="text-sm text-zinc-800 leading-relaxed">
          Unlike traditional e-commerce where inventory is purchased in bulk at deep wholesale discounts, print-on-demand operates on single-unit manufacturing economics. Every single order triggers four sequential cost deductions before a dime enters your bank account:
        </p>

        <div className="space-y-4 pt-1">
          <div className="border-l-2 border-zinc-900 pl-4 py-0.5">
            <h4 className="text-sm font-bold text-zinc-950">
              Base Blank &amp; DTG Printing Fee: $8.00 to $24.00+
            </h4>
            <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed mt-0.5">
              The manufacturing invoice billed directly by your print provider (Printify, Printful, or Gelato). This covers the wholesale blank garment (such as a Bella+Canvas 3001 unisex tee or a Gildan 18500 heavyweight hoodie) plus the ink, pre-treatment, direct-to-garment (DTG) digital printing, curing, and packaging labor. A standard t-shirt typically incurs $8.50 to $11.00 in base production, while premium hoodies run $20.00 to $26.00.
            </p>
          </div>

          <div className="border-l-2 border-zinc-900 pl-4 py-0.5">
            <h4 className="text-sm font-bold text-zinc-950">
              Provider Fulfillment Postage &amp; Packaging: $3.99 to $8.50
            </h4>
            <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed mt-0.5">
              The actual carrier postage invoiced by the print facility to ship the item via USPS Ground Advantage, DHL eCommerce, or UPS Mail Innovations. Unlike digital products or dropshipped poly-mailers from overseas, US domestic apparel postage is non-negotiable ($4.25 to $5.50 for tees, $7.50 to $9.50 for heavy outerwear).
            </p>
          </div>

          <div className="border-l-2 border-zinc-900 pl-4 py-0.5">
            <h4 className="text-sm font-bold text-zinc-950">
              Sales Channel &amp; Payment Processing Commissions: 2.9% to 15%+
            </h4>
            <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed mt-0.5">
              The fee charged by your storefront platform. Selling on Etsy incurs a combined ~9.5% + $0.45 (6.5% transaction fee + 3.0% + $0.25 payment processing + $0.20 listing fee) assessed on the <em>gross order total including shipping</em>. Independent Shopify stores with Shopify Payments pay only 2.9% + $0.30, while TikTok Shop currently charges 6.0% + $0.30.
            </p>
          </div>

          <div className="border-l-2 border-zinc-900 pl-4 py-0.5">
            <h4 className="text-sm font-bold text-zinc-950">
              Customer Acquisition Cost (CAC / Paid Ad Spend): $3.00 to $12.00+
            </h4>
            <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed mt-0.5">
              Unless your traffic is 100% organic through SEO or viral social video, acquiring paying shoppers via Meta Ads (Instagram/Facebook), TikTok Ads, or Etsy Promoted Listings requires dedicated ad spend. In competitive apparel and home decor niches, a blended acquisition cost of $4.00 to $8.00 per unit is standard.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: Provider Economics Comparison */}
      <section className="mt-10 max-w-3xl space-y-4">
        <h3 className="text-lg sm:text-xl font-bold text-zinc-950 tracking-tight">
          2. Printify vs. Printful vs. Gelato: Unit Economics Comparison
        </h3>
        <p className="text-sm text-zinc-800 leading-relaxed">
          Choosing the right production partner directly impacts your product margins and brand scalability. Each provider operates a fundamentally different fulfillment architecture:
        </p>

        <div className="space-y-4 pt-1">
          <div className="rounded-xl border border-zinc-200/90 bg-zinc-50/70 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-zinc-950">Printify (Decentralized Network Model)</span>
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">Lowest Base Costs</span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed">
              Printify does not own factories; it connects you with independent print providers (Monster Digital, SwiftPOD, Stoked On Printing, etc.). With the Printify Premium subscription ($29/mo), blank tee costs drop to ~$8.50 – $9.50. However, because different catalog items are printed by different vendors, multi-item carts risk being split into multiple shipments with separate shipping charges.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-200/90 bg-zinc-50/70 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-zinc-950">Printful (Vertically Integrated Model)</span>
              <span className="text-xs font-mono font-bold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-md">Consistent Premium Quality</span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed">
              Printful owns and operates its own fulfillment centers across the US, Mexico, Europe, and Australia. Base production costs are higher (~$13.50 – $15.00 for Bella+Canvas 3001), but DTG print consistency, embroidery execution, custom branding pack-ins, and automated multi-facility routing provide superior reliability for high-end D2C brands.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-200/90 bg-zinc-50/70 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-zinc-950">Gelato (Hyper-Local Distributed Production)</span>
              <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-100/80 px-2 py-0.5 rounded-md">Global Local Fulfillment</span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed">
              Gelato operates production hubs in 32+ countries. When an international customer orders, the item is produced locally in their country, drastically slashing international transit times and eliminating cross-border import customs duties. Gelato is particularly dominant for wall art, canvas, posters, and calendar printing.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: 4 Margin Traps */}
      <section className="mt-10 max-w-3xl space-y-4">
        <h3 className="text-lg sm:text-xl font-bold text-zinc-950 tracking-tight">
          3. Four Hidden Margin Traps That Blindside New POD Sellers
        </h3>
        <p className="text-sm text-zinc-800 leading-relaxed">
          The majority of beginner print-on-demand stores generate impressive gross revenue on Etsy or Shopify but finish the year with zero net profit. These four traps explain where margin leaks:
        </p>

        <ul className="space-y-4 pt-1">
          <li className="space-y-1">
            <div className="text-sm font-bold text-zinc-950">
              Trap A: The &ldquo;Free Shipping&rdquo; Margin Evaporation
            </div>
            <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed">
              Offering &ldquo;Free Shipping&rdquo; without increasing retail prices is catastrophic in print-on-demand. If you sell a t-shirt for $22.00 with free shipping, your print provider will still invoice you $4.75 for carrier postage. After paying $9.50 base production, $4.75 postage, and $2.30 in Etsy fees, your gross profit before ad spend is barely $5.45. A single $5.00 Meta ad click eliminates your entire net profit.
            </p>
          </li>

          <li className="space-y-1">
            <div className="text-sm font-bold text-zinc-950">
              Trap B: The Multi-Provider Split Shipment Penalty
            </div>
            <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed">
              If a customer buys an enamel mug and a hoodie in one transaction, and your mug is fulfilled by District Photo while the hoodie is fulfilled by SwiftPOD, Printify bills you two separate, full-price shipping charges (e.g., $5.50 + $7.50 = $13.00 total postage). If you only charged the buyer $6.00 shipping, you absorb a $7.00 surprise deficit out of your own pocket.
            </p>
          </li>

          <li className="space-y-1">
            <div className="text-sm font-bold text-zinc-950">
              Trap C: 100% Seller Liability on Returns &amp; Sizing Mistakes
            </div>
            <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed">
              Print-on-demand fulfillment facilities produce custom, on-demand goods and do not accept returns or offer refunds for customer sizing mistakes or buyer remorse. If a customer demands a return or exchange for a larger size, you must pay your print provider for a brand new item and postage out of pocket. Maintaining a 10% reprint contingency buffer in your retail markup is critical.
            </p>
          </li>

          <li className="space-y-1">
            <div className="text-sm font-bold text-zinc-950">
              Trap D: Etsy Offsite Ads Surcharge Squeeze
            </div>
            <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed">
              When an Etsy sale originates from an Etsy-funded Google or Facebook ad, Etsy assesses an additional 12% to 15% Offsite Ads commission on gross revenue. Combined with standard 6.5% transaction, 3% processing, and listing fees, total marketplace deductions exceed <strong>25% of the total checkout value</strong>. If your base product margin is under 40%, an Offsite Ads sale directly triggers a net financial loss.
            </p>
          </li>
        </ul>
      </section>

      {/* SECTION 4: Strategic Pricing Rules */}
      <section className="mt-10 max-w-3xl space-y-4">
        <h3 className="text-lg sm:text-xl font-bold text-zinc-950 tracking-tight">
          4. Three Mathematical Rules to Guarantee 30%+ Net Margins
        </h3>

        <div className="space-y-4 pt-1">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-zinc-950">
              Rule 1: The $30 Minimum Target Selling Price
            </h4>
            <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed">
              Do not compete on race-to-the-bottom pricing by listing apparel at $16 or $19. High-volume successful sellers price standard t-shirts at $28.00 to $34.00 and hoodies at $48.00 to $65.00 by positioning their designs within high-intent passionate niches (nurse gifts, hobbyists, commemorative graphics). A $30 retail price provides the $14+ gross margin cushion required to absorb ad spend and platform fees.
            </p>
          </div>

          <div className="space-y-1">
            <h4 className="text-sm font-bold text-zinc-950">
              Rule 2: Flat-Rate Postage Blending ($4.99 Standard Shipping)
            </h4>
            <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed">
              Instead of absorbing postage into zero-margin &ldquo;free shipping,&rdquo; charge a standard $4.99 flat-rate shipping fee at checkout. Shoppers are fully conditioned to pay modest carrier postage on custom apparel, and that $4.99 directly offsets the ~$4.50 to $5.20 print lab invoice—keeping 100% of your retail margin intact.
            </p>
          </div>

          <div className="space-y-1">
            <h4 className="text-sm font-bold text-zinc-950">
              Rule 3: Single-Provider Catalog Architecture
            </h4>
            <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed">
              Standardize your apparel and accessory catalog around a single primary print provider (e.g., SwiftPOD or Monster Digital on Printify) for compatible SKUs. When customers buy two or three shirts together, the print lab packages them in one poly-mailer, charging only $2.00 to $2.50 for the second item instead of full initial postage—instantly boosting multi-item order profitability by 35%+.
            </p>
          </div>
        </div>
      </section>
    </article>
  );
}
