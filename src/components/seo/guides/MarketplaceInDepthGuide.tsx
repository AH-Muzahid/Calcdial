import { BookOpen } from "lucide-react";

export function MarketplaceInDepthGuide() {
  return (
      <article className="my-10 border-t border-b border-zinc-200 py-10 text-zinc-900 font-sans">
        {/* Header */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-600 mb-2">
            <BookOpen className="size-3.5" />
            <span>Channel Economics &amp; Strategy Blueprint (2026 Edition)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 leading-tight">
            Etsy vs. Shopify vs. TikTok Shop: Complete 2026 Seller Fee Breakdown, True Net Profit Margins &amp; Multi-Channel Strategy
          </h2>
          <p className="mt-2 text-sm sm:text-base text-zinc-700 leading-relaxed">
            A definitive financial guide analyzing per-order transaction take-rates, organic discovery taxes versus direct customer acquisition (CAC), and the exact monthly revenue thresholds for expanding to an independent storefront.
          </p>
        </div>

        {/* SECTION 1: The Raw Math of Every $100 Sale */}
        <section className="mt-8 max-w-3xl space-y-4">
          <h3 className="text-lg sm:text-xl font-bold text-zinc-950 tracking-tight">
            1. The Raw Math: How a $100 Order Is Split Across Each Platform
          </h3>
          <p className="text-sm text-zinc-800 leading-relaxed">
            While each platform markets different headline rates, the true cash that hits your bank account depends on the cumulative combination of transaction percentages, fixed order fees, listing fees, and processing surcharges:
          </p>

          <div className="space-y-4 pt-1">
            <div className="border-l-2 border-emerald-600 pl-4 py-0.5">
              <h4 className="text-sm font-bold text-zinc-950">
                Shopify (Basic Plan): 2.9% + 30¢ = $3.20 Total Platform Cut (Keep $96.80)
              </h4>
              <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed mt-0.5">
                When using Shopify Payments, Shopify charges zero listing fees and zero marketplace commissions. You only pay standard merchant credit card processing (2.9% + $0.30 on the Basic plan, lowering to 2.7% + $0.30 on the Shopify plan). On a $100 sale, you retain <strong>$96.80</strong> before unit production costs.
              </p>
            </div>

            <div className="border-l-2 border-zinc-900 pl-4 py-0.5">
              <h4 className="text-sm font-bold text-zinc-950">
                TikTok Shop: 6.0% + 1.8% + 30¢ = $8.10 Total Cut (Keep $91.90 before Creator Cuts)
              </h4>
              <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed mt-0.5">
                TikTok Shop assesses a 6.0% category referral fee across most retail categories, plus a 1.8% + $0.30 payment processing fee. If you fulfill orders organically through your own profile videos or live streams, platform deductions total $8.10. However, if a TikTok affiliate creator drives the sale, you must also pay their agreed affiliate commission (typically 10% to 20%), which reduces net take-home to <strong>$71.90 – $81.90</strong>.
              </p>
            </div>

            <div className="border-l-2 border-orange-500 pl-4 py-0.5">
              <h4 className="text-sm font-bold text-zinc-950">
                Etsy: 6.5% + 3% + 25¢ + 20¢ = $9.95 Standard Cut (Keep $90.05, or $75.05 with Ads)
              </h4>
              <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed mt-0.5">
                Etsy stacks multiple fee layers on every sale: a $0.20 listing fee, a 6.5% transaction commission assessed on both retail price and buyer shipping, plus 3.0% + $0.25 payment processing (US). On a standard $100 sale, baseline fees consume $9.95. If that buyer clicked an Etsy Offsite Ad within 30 days, an additional 15% ($15.00) is deducted, leaving you with only <strong>$75.05</strong>.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 2: Marketplace Discovery Tax vs Direct CAC */}
        <section className="mt-10 max-w-3xl space-y-4">
          <h3 className="text-lg sm:text-xl font-bold text-zinc-950 tracking-tight">
            2. The Great Trade-Off: Marketplace Discovery Tax vs. Direct-to-Consumer CAC
          </h3>
          <p className="text-sm text-zinc-800 leading-relaxed">
            The fundamental choice between marketplaces (Etsy, TikTok Shop) and standalone e-commerce (Shopify) comes down to how you pay for customer traffic:
          </p>

          <div className="rounded-xl border border-zinc-200 bg-zinc-50/80 p-4 space-y-2 text-xs sm:text-sm">
            <h4 className="font-bold text-zinc-950">The Break-Even CAC Formula:</h4>
            <p className="font-mono text-zinc-900 bg-white p-2.5 rounded-lg border border-zinc-200">
              Maximum Tolerable CAC on Shopify = Retail Price × (Marketplace Effective Fee % − Shopify Fee %)
            </p>
            <p className="text-zinc-700 leading-relaxed">
              If an Etsy sale carries an effective 12% fee ($6.00 on a $50 item) and Shopify carries a 3.5% fee ($1.75), you have a <strong>$4.25 margin surplus</strong> per order on Shopify. If you can acquire customers via paid ads or social media for less than $4.25, Shopify is more profitable on day one. Crucially, all repeat customer purchases and email campaigns on Shopify carry $0 in acquisition cost, rapidly compounding store profit.
            </p>
          </div>
        </section>

        {/* SECTION 3: When to Migrate to Shopify */}
        <section className="mt-10 max-w-3xl space-y-4">
          <h3 className="text-lg sm:text-xl font-bold text-zinc-950 tracking-tight">
            3. The Revenue Tipping Point: When Does Shopify Become Cheaper?
          </h3>
          <p className="text-sm text-zinc-800 leading-relaxed">
            Because Shopify charges a flat monthly SaaS subscription ($39/mo for Basic) while Etsy and TikTok Shop charge variable transaction fees, there is a clear mathematical tipping point where Shopify becomes significantly more cost-effective:
          </p>

          <div className="overflow-x-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50/80 text-zinc-700 font-semibold">
                  <th className="py-2.5 px-3 rounded-l-lg">Monthly Revenue</th>
                  <th className="py-2.5 px-3">Etsy Platform Fees (~11.5%)</th>
                  <th className="py-2.5 px-3">Shopify Total Cost ($39 + ~3.2%)</th>
                  <th className="py-2.5 px-3 text-right rounded-r-lg">Net Shopify Savings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-zinc-800 font-mono">
                <tr className="hover:bg-zinc-50/60">
                  <td className="py-2.5 px-3 font-semibold font-sans text-zinc-950">$500 / month</td>
                  <td className="py-2.5 px-3 text-zinc-700">$57.50</td>
                  <td className="py-2.5 px-3 text-zinc-700">$55.00</td>
                  <td className="py-2.5 px-3 text-right font-bold text-emerald-600">+$2.50 / mo</td>
                </tr>
                <tr className="hover:bg-zinc-50/60">
                  <td className="py-2.5 px-3 font-semibold font-sans text-zinc-950">$1,500 / month</td>
                  <td className="py-2.5 px-3 text-zinc-700">$172.50</td>
                  <td className="py-2.5 px-3 text-zinc-700">$87.00</td>
                  <td className="py-2.5 px-3 text-right font-bold text-emerald-600">+$85.50 / mo</td>
                </tr>
                <tr className="hover:bg-zinc-50/60">
                  <td className="py-2.5 px-3 font-semibold font-sans text-zinc-950">$3,000 / month</td>
                  <td className="py-2.5 px-3 text-zinc-700">$345.00</td>
                  <td className="py-2.5 px-3 text-zinc-700">$135.00</td>
                  <td className="py-2.5 px-3 text-right font-bold text-emerald-600">+$210.00 / mo ($2,520/yr)</td>
                </tr>
                <tr className="hover:bg-zinc-50/60 bg-emerald-50/30">
                  <td className="py-2.5 px-3 font-semibold font-sans text-zinc-950">$8,000 / month</td>
                  <td className="py-2.5 px-3 text-rose-600 font-bold">$920.00</td>
                  <td className="py-2.5 px-3 text-zinc-700">$295.00</td>
                  <td className="py-2.5 px-3 text-right font-extrabold text-emerald-600">+$625.00 / mo ($7,500/yr)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 4: The 2026 Hybrid Playbook */}
        <section className="mt-10 max-w-3xl space-y-4">
          <h3 className="text-lg sm:text-xl font-bold text-zinc-950 tracking-tight">
            4. The Multi-Channel &ldquo;Hub &amp; Spoke&rdquo; Playbook for Maximum Margin
          </h3>
          <p className="text-sm text-zinc-800 leading-relaxed">
            The most profitable modern brands do not choose just one channel; they deploy a disciplined multi-channel funnel:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="rounded-xl border border-zinc-200 bg-white p-3.5 space-y-1.5 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-orange-600 block">
                Spoke 1: Etsy
              </span>
              <h4 className="text-xs sm:text-sm font-bold text-zinc-950">Search Engine Discovery</h4>
              <p className="text-xs text-zinc-700 leading-relaxed">
                Use Etsy for organic keyword search and high-intent gift shoppers. Price items 10%–15% higher to absorb marketplace commission fees.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white p-3.5 space-y-1.5 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-zinc-950 block">
                Spoke 2: TikTok Shop
              </span>
              <h4 className="text-xs sm:text-sm font-bold text-zinc-950">Viral Impulse Engine</h4>
              <p className="text-xs text-zinc-700 leading-relaxed">
                Leverage short-form video and affiliate creator live streams to generate high-velocity order spikes on trending impulse products ($15–$40).
              </p>
            </div>

            <div className="rounded-xl border border-emerald-300 bg-emerald-50/30 p-3.5 space-y-1.5 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-emerald-700 block">
                The Central Hub: Shopify
              </span>
              <h4 className="text-xs sm:text-sm font-bold text-zinc-950">Lifetime Customer Value</h4>
              <p className="text-xs text-zinc-700 leading-relaxed">
                Include packaging inserts with warranty QR codes directing marketplace buyers to your Shopify store for re-orders with 0% marketplace commission.
              </p>
            </div>
          </div>
        </section>
      </article>
    );
}
