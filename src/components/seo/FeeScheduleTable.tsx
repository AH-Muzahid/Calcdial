"use client";

import { useState } from "react";
import { ETSY_FEE_PRESETS, POD_ITEM_PRESETS, TIKTOK_CATEGORY_PRESETS, SHOPIFY_GATEWAY_PRESETS, PAYMENT_CURRENCY_PRESETS } from "@/data/fee-presets";

interface FeeScheduleTableProps {
  toolSlug: string;
}

export function FeeScheduleTable({ toolSlug }: FeeScheduleTableProps) {
  const [activeTab, setActiveTab] = useState<"global" | "ads" | "comparison">("global");

  if (toolSlug !== "etsy-fee-calculator" && 
      toolSlug !== "pod-profit-calculator" && 
      toolSlug !== "tiktok-shop-fee-calculator" && 
      toolSlug !== "shopify-profit-calculator" &&
      toolSlug !== "etsy-vs-shopify-vs-tiktok-shop-calculator" &&
      toolSlug !== "stripe-vs-paypal-fee-calculator") {
    return null;
  }

  return (
    <section className="my-8 rounded-2xl border border-zinc-200/90 bg-white p-3.5 sm:p-5 shadow-2xs font-sans">
      {/* Header & Clean Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
        <div>
          <h3 className="text-base sm:text-lg font-bold tracking-tight text-zinc-950">
            {toolSlug === "etsy-fee-calculator" && "2026 Etsy Fee Schedule & International Reference"}
            {toolSlug === "pod-profit-calculator" && "Print-on-Demand Base Costs & Target Margins"}
            {toolSlug === "tiktok-shop-fee-calculator" && "TikTok Shop Category Referral Rates"}
            {toolSlug === "shopify-profit-calculator" && "Shopify Gateway Processing Comparison"}
            {toolSlug === "etsy-vs-shopify-vs-tiktok-shop-calculator" && "2026 3-Way Platform Fee Schedule & Comparison Reference"}
            {toolSlug === "stripe-vs-paypal-fee-calculator" && "2026 Stripe vs PayPal Processing Fee Matrix & Surcharge Reference"}
          </h3>
          <p className="mt-0.5 text-xs text-zinc-500">
            Current verified seller fee rates and platform policies.
          </p>
        </div>

        {/* Clean, Subtle Pill Tabs */}
        {toolSlug === "stripe-vs-paypal-fee-calculator" && (
          <div className="flex items-center rounded-lg bg-zinc-100 p-1 text-xs font-semibold self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab("global")}
              className={`rounded-md px-3 py-1.5 transition-all cursor-pointer ${
                activeTab === "global" 
                  ? "bg-white text-zinc-950 font-bold shadow-2xs" 
                  : "text-zinc-600 hover:text-zinc-950"
              }`}
            >
              Fee Matrix
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("ads")}
              className={`rounded-md px-3 py-1.5 transition-all cursor-pointer ${
                activeTab === "ads" 
                  ? "bg-white text-zinc-950 font-bold shadow-2xs" 
                  : "text-zinc-600 hover:text-zinc-950"
              }`}
            >
              Payouts by Ticket Size
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("comparison")}
              className={`rounded-md px-3 py-1.5 transition-all cursor-pointer ${
                activeTab === "comparison" 
                  ? "bg-white text-zinc-950 font-bold shadow-2xs" 
                  : "text-zinc-600 hover:text-zinc-950"
              }`}
            >
              International Currencies
            </button>
          </div>
        )}
        {toolSlug === "etsy-vs-shopify-vs-tiktok-shop-calculator" && (
          <div className="flex items-center rounded-lg bg-zinc-100 p-1 text-xs font-semibold self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab("global")}
              className={`rounded-md px-3 py-1.5 transition-all cursor-pointer ${
                activeTab === "global" 
                  ? "bg-white text-zinc-950 font-bold shadow-2xs" 
                  : "text-zinc-600 hover:text-zinc-950"
              }`}
            >
              Fee Matrix
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("ads")}
              className={`rounded-md px-3 py-1.5 transition-all cursor-pointer ${
                activeTab === "ads" 
                  ? "bg-white text-zinc-950 font-bold shadow-2xs" 
                  : "text-zinc-600 hover:text-zinc-950"
              }`}
            >
              Payouts by Price Tier
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("comparison")}
              className={`rounded-md px-3 py-1.5 transition-all cursor-pointer ${
                activeTab === "comparison" 
                  ? "bg-white text-zinc-950 font-bold shadow-2xs" 
                  : "text-zinc-600 hover:text-zinc-950"
              }`}
            >
              Platform Comparison
            </button>
          </div>
        )}

        {toolSlug === "etsy-fee-calculator" && (
          <div className="flex items-center rounded-lg bg-zinc-100 p-1 text-xs font-semibold self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab("global")}
              className={`rounded-md px-3 py-1.5 transition-all cursor-pointer ${
                activeTab === "global" 
                  ? "bg-white text-zinc-950 font-bold shadow-2xs" 
                  : "text-zinc-600 hover:text-zinc-950"
              }`}
            >
              Country Rates
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("ads")}
              className={`rounded-md px-3 py-1.5 transition-all cursor-pointer ${
                activeTab === "ads" 
                  ? "bg-white text-zinc-950 font-bold shadow-2xs" 
                  : "text-zinc-600 hover:text-zinc-950"
              }`}
            >
              Offsite Ads Tiers
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("comparison")}
              className={`rounded-md px-3 py-1.5 transition-all cursor-pointer ${
                activeTab === "comparison" 
                  ? "bg-white text-zinc-950 font-bold shadow-2xs" 
                  : "text-zinc-600 hover:text-zinc-950"
              }`}
            >
              Platform Compare
            </button>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* ETSY FEE TABLES                                           */}
      {/* ========================================================= */}
      {toolSlug === "etsy-fee-calculator" && (
        <div className="mt-4">
          {/* TAB 1: Global Country-by-Country Schedule */}
          {activeTab === "global" && (
            <div className="overflow-x-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50/80 text-zinc-700 font-semibold">
                    <th className="py-2.5 px-3 rounded-l-lg">Country / Settlement</th>
                    <th className="py-2.5 px-3">Listing Fee</th>
                    <th className="py-2.5 px-3">Transaction Cut</th>
                    <th className="py-2.5 px-3">Payment Processing</th>
                    <th className="py-2.5 px-3">Regulatory Surcharge</th>
                    <th className="py-2.5 px-3 text-right rounded-r-lg">Total on $50 Sale</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-zinc-800">
                  {ETSY_FEE_PRESETS.map((preset) => {
                    const samplePrice = 50.0;
                    const sampleShipping = 5.0;
                    const totalRev = samplePrice + sampleShipping;
                    const listingFee = preset.fees.listingFee;
                    const txFee = totalRev * (preset.fees.transactionPct / 100);
                    const procFee = totalRev * (preset.fees.processingPct / 100) + preset.fees.processingFixed;
                    const regFee = totalRev * (preset.fees.regulatoryPct / 100);
                    const totalSampleFees = listingFee + txFee + procFee + regFee;
                    const effectivePct = (totalSampleFees / totalRev) * 100;

                    return (
                      <tr key={preset.id} className="hover:bg-zinc-50/60 transition-colors">
                        <td className="py-2.5 px-3 font-semibold text-zinc-950">
                          {preset.country}{" "}
                          <span className="font-mono text-zinc-400 font-normal text-[11px]">
                            ({preset.currency})
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-zinc-700">
                          ${preset.fees.listingFee.toFixed(2)} USD
                        </td>
                        <td className="py-2.5 px-3 font-mono font-semibold text-zinc-900">
                          {preset.fees.transactionPct}%
                        </td>
                        <td className="py-2.5 px-3 font-mono text-zinc-700">
                          {preset.fees.processingPct}% + {preset.currencySymbol}{preset.fees.processingFixed.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 font-mono">
                          {preset.fees.regulatoryPct > 0 ? (
                            <span className="font-semibold text-amber-700">
                              {preset.fees.regulatoryPct}%
                            </span>
                          ) : (
                            <span className="text-zinc-400">None</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-zinc-950">
                          {preset.currencySymbol}{totalSampleFees.toFixed(2)}{" "}
                          <span className="text-zinc-400 font-normal text-[11px]">
                            ({effectivePct.toFixed(1)}%)
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 2: Offsite Ads Tier Breakdown */}
          {activeTab === "ads" && (
            <div className="space-y-4">
              <div className="overflow-x-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-zinc-200 bg-zinc-50/80 text-zinc-700 font-semibold">
                      <th className="py-2.5 px-3 rounded-l-lg">Trailing 12-Month Sales</th>
                      <th className="py-2.5 px-3">Ad Rate on Attributed Order</th>
                      <th className="py-2.5 px-3">Participation Status</th>
                      <th className="py-2.5 px-3">Attribution Cookie Window</th>
                      <th className="py-2.5 px-3 text-right rounded-r-lg">Fee Cap per Order</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 text-zinc-800">
                    <tr className="hover:bg-zinc-50/60">
                      <td className="py-3 px-3 font-semibold text-zinc-950">
                        Under $10,000 USD / year
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-amber-600">
                        15.0%
                      </td>
                      <td className="py-3 px-3 font-medium text-emerald-700">
                        Optional (You may opt out)
                      </td>
                      <td className="py-3 px-3 font-mono text-zinc-700">
                        30 Calendar Days
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-zinc-950">
                        $100.00 USD
                      </td>
                    </tr>
                    <tr className="hover:bg-zinc-50/60">
                      <td className="py-3 px-3 font-semibold text-zinc-950">
                        $10,000 USD or More / year
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-blue-600">
                        12.0%
                      </td>
                      <td className="py-3 px-3 font-semibold text-rose-700">
                        Mandatory (Lifetime enrollment)
                      </td>
                      <td className="py-3 px-3 font-mono text-zinc-700">
                        30 Calendar Days
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-zinc-950">
                        $100.00 USD
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-xs text-zinc-500 leading-relaxed pl-1">
                * Note: Once shop revenue reaches $10,000 USD in any continuous 12-month period, enrollment in Offsite Ads is permanently mandatory at 12%.
              </p>
            </div>
          )}

          {/* TAB 3: Cross-Platform Comparison */}
          {activeTab === "comparison" && (
            <div className="overflow-x-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50/80 text-zinc-700 font-semibold">
                    <th className="py-2.5 px-3 rounded-l-lg">Platform</th>
                    <th className="py-2.5 px-3">Listing Fees</th>
                    <th className="py-2.5 px-3">Platform Cut</th>
                    <th className="py-2.5 px-3">Payment Processing</th>
                    <th className="py-2.5 px-3">Monthly Subscription</th>
                    <th className="py-2.5 px-3 text-right rounded-r-lg">Typical Take Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-zinc-800">
                  <tr className="hover:bg-zinc-50/60">
                    <td className="py-3 px-3 font-semibold text-zinc-950">Etsy</td>
                    <td className="py-3 px-3 font-mono text-zinc-700">$0.20 per item</td>
                    <td className="py-3 px-3 font-mono text-zinc-700">6.5%</td>
                    <td className="py-3 px-3 font-mono text-zinc-700">3.0% + $0.25 (US)</td>
                    <td className="py-3 px-3 font-mono text-zinc-700">$0.00</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-amber-700">12% to 28%</td>
                  </tr>
                  <tr className="hover:bg-zinc-50/60">
                    <td className="py-3 px-3 font-semibold text-zinc-950">Shopify</td>
                    <td className="py-3 px-3 font-mono text-zinc-700">$0.00</td>
                    <td className="py-3 px-3 font-mono text-zinc-700">0.0% (Shopify Payments)</td>
                    <td className="py-3 px-3 font-mono text-zinc-700">2.9% + $0.30 (Basic)</td>
                    <td className="py-3 px-3 font-mono text-zinc-700">$39.00 / month</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-emerald-700">3% to 5% (at volume)</td>
                  </tr>
                  <tr className="hover:bg-zinc-50/60">
                    <td className="py-3 px-3 font-semibold text-zinc-950">TikTok Shop</td>
                    <td className="py-3 px-3 font-mono text-zinc-700">$0.00</td>
                    <td className="py-3 px-3 font-mono text-zinc-700">6.0% referral</td>
                    <td className="py-3 px-3 font-mono text-zinc-700">Included in referral</td>
                    <td className="py-3 px-3 font-mono text-zinc-700">$0.00</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-zinc-900">6% to 20%</td>
                  </tr>
                  <tr className="hover:bg-zinc-50/60">
                    <td className="py-3 px-3 font-semibold text-zinc-950">Amazon Handmade</td>
                    <td className="py-3 px-3 font-mono text-zinc-700">$0.00</td>
                    <td className="py-3 px-3 font-mono text-zinc-700">15.0% referral fee</td>
                    <td className="py-3 px-3 font-mono text-zinc-700">Included in 15%</td>
                    <td className="py-3 px-3 font-mono text-zinc-700">Waived ($39.99 free)</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-zinc-900">~15.0%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* POD Benchmarks */}
      {toolSlug === "pod-profit-calculator" && (
        <div className="mt-4 overflow-x-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/80 text-zinc-700 font-semibold">
                <th className="py-2.5 px-3 rounded-l-lg">Catalog Product</th>
                <th className="py-2.5 px-3">Avg Production Base</th>
                <th className="py-2.5 px-3">Fulfillment Shipping</th>
                <th className="py-2.5 px-3">Recommended Retail</th>
                <th className="py-2.5 px-3 text-right rounded-r-lg">Target Net Margin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-800">
              {POD_ITEM_PRESETS.map((item) => (
                <tr key={item.id} className="hover:bg-zinc-50/60">
                  <td className="py-2.5 px-3 font-semibold text-zinc-950 capitalize">
                    {item.id.replace("-", " ")}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-zinc-700">${item.fees.baseCost.toFixed(2)}</td>
                  <td className="py-2.5 px-3 font-mono text-zinc-700">${item.fees.defaultShipping.toFixed(2)}</td>
                  <td className="py-2.5 px-3 font-mono text-zinc-700">
                    ${(item.fees.baseCost * 2.5).toFixed(2)} – ${(item.fees.baseCost * 3.5).toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600">35% – 55%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TikTok Shop Category Fees */}
      {toolSlug === "tiktok-shop-fee-calculator" && (
        <div className="mt-4 overflow-x-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/80 text-zinc-700 font-semibold">
                <th className="py-2.5 px-3 rounded-l-lg">Product Category</th>
                <th className="py-2.5 px-3">Referral Fee %</th>
                <th className="py-2.5 px-3">Payment Processing</th>
                <th className="py-2.5 px-3">Affiliate Commission</th>
                <th className="py-2.5 px-3 text-right rounded-r-lg">Effective Platform Cut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-800">
              {TIKTOK_CATEGORY_PRESETS.map((cat) => (
                <tr key={cat.id} className="hover:bg-zinc-50/60">
                  <td className="py-2.5 px-3 font-semibold text-zinc-950 capitalize">
                    {cat.id.replace("-", " & ")}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-semibold text-zinc-950">{cat.fees.referralPct}%</td>
                  <td className="py-2.5 px-3 font-mono text-zinc-500">Included in referral</td>
                  <td className="py-2.5 px-3 font-mono text-zinc-700">10% – 20%</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-zinc-950">16% – 26%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 3-Way Platform Comparison Tables */}
      {toolSlug === "etsy-vs-shopify-vs-tiktok-shop-calculator" && activeTab === "global" && (
        <div className="mt-4 overflow-x-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/80 text-zinc-700 font-semibold">
                <th className="py-2.5 px-3 rounded-l-lg">Fee Component</th>
                <th className="py-2.5 px-3">Etsy (2026)</th>
                <th className="py-2.5 px-3">TikTok Shop (2026)</th>
                <th className="py-2.5 px-3 text-right rounded-r-lg">Shopify (Basic)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-800">
              <tr className="hover:bg-zinc-50/60">
                <td className="py-2.5 px-3 font-semibold text-zinc-950">Listing Fee</td>
                <td className="py-2.5 px-3 font-mono text-zinc-700">$0.20 per item (4 mo)</td>
                <td className="py-2.5 px-3 font-mono text-emerald-700 font-medium">$0.00 (Unlimited)</td>
                <td className="py-2.5 px-3 text-right font-mono text-emerald-700 font-medium">$0.00 (Unlimited)</td>
              </tr>
              <tr className="hover:bg-zinc-50/60">
                <td className="py-2.5 px-3 font-semibold text-zinc-950">Platform Commission</td>
                <td className="py-2.5 px-3 font-mono text-rose-600 font-semibold">6.5% on gross total</td>
                <td className="py-2.5 px-3 font-mono text-zinc-700">6.0% category referral</td>
                <td className="py-2.5 px-3 text-right font-mono text-emerald-700 font-medium">0.0% (Shopify Payments)</td>
              </tr>
              <tr className="hover:bg-zinc-50/60">
                <td className="py-2.5 px-3 font-semibold text-zinc-950">Payment Processing</td>
                <td className="py-2.5 px-3 font-mono text-zinc-700">3.0% + $0.25 (US)</td>
                <td className="py-2.5 px-3 font-mono text-zinc-700">1.8% + $0.30</td>
                <td className="py-2.5 px-3 text-right font-mono text-zinc-700">2.9% + $0.30</td>
              </tr>
              <tr className="hover:bg-zinc-50/60">
                <td className="py-2.5 px-3 font-semibold text-zinc-950">Marketing / Ads Tax</td>
                <td className="py-2.5 px-3 font-mono text-rose-600">12%–15% (Offsite Ads)</td>
                <td className="py-2.5 px-3 font-mono text-zinc-700">10%–20% (Creator cut)</td>
                <td className="py-2.5 px-3 text-right font-mono text-zinc-700">Self-funded (0% platform tax)</td>
              </tr>
              <tr className="hover:bg-zinc-50/60">
                <td className="py-2.5 px-3 font-semibold text-zinc-950">Monthly Base Plan</td>
                <td className="py-2.5 px-3 font-mono text-emerald-700 font-medium">$0 / month</td>
                <td className="py-2.5 px-3 font-mono text-emerald-700 font-medium">$0 / month</td>
                <td className="py-2.5 px-3 text-right font-mono text-zinc-700">$39 / month</td>
              </tr>
              <tr className="hover:bg-zinc-50/60 bg-zinc-50/40">
                <td className="py-2.5 px-3 font-bold text-zinc-950">Typical Effective Cut</td>
                <td className="py-2.5 px-3 font-mono font-bold text-rose-600">10.5% – 25.0%</td>
                <td className="py-2.5 px-3 font-mono font-semibold text-zinc-800">7.8% – 20.0%</td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600">2.9% – 3.5%</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {toolSlug === "etsy-vs-shopify-vs-tiktok-shop-calculator" && activeTab === "ads" && (
        <div className="mt-4 overflow-x-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/80 text-zinc-700 font-semibold">
                <th className="py-2.5 px-3 rounded-l-lg">Retail Order</th>
                <th className="py-2.5 px-3">Etsy Payout (Cut)</th>
                <th className="py-2.5 px-3">TikTok Shop Payout</th>
                <th className="py-2.5 px-3">Shopify Payout</th>
                <th className="py-2.5 px-3 text-right rounded-r-lg">Shopify Advantage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-800">
              <tr className="hover:bg-zinc-50/60">
                <td className="py-2.5 px-3 font-semibold text-zinc-950">$15.00 Order</td>
                <td className="py-2.5 px-3 font-mono text-zinc-700">$13.08 (12.8% fee)</td>
                <td className="py-2.5 px-3 font-mono text-zinc-700">$13.80 (8.0% fee)</td>
                <td className="py-2.5 px-3 font-mono font-semibold text-zinc-950">$14.26 (4.9% fee)</td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600">+$1.18 (+9.0%)</td>
              </tr>
              <tr className="hover:bg-zinc-50/60">
                <td className="py-2.5 px-3 font-semibold text-zinc-950">$35.00 Order</td>
                <td className="py-2.5 px-3 font-mono text-zinc-700">$30.93 (11.6% fee)</td>
                <td className="py-2.5 px-3 font-mono text-zinc-700">$32.27 (7.8% fee)</td>
                <td className="py-2.5 px-3 font-mono font-semibold text-zinc-950">$33.68 (3.8% fee)</td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600">+$2.75 (+8.9%)</td>
              </tr>
              <tr className="hover:bg-zinc-50/60">
                <td className="py-2.5 px-3 font-semibold text-zinc-950">$75.00 Order</td>
                <td className="py-2.5 px-3 font-mono text-zinc-700">$66.62 (11.2% fee)</td>
                <td className="py-2.5 px-3 font-mono text-zinc-700">$69.20 (7.7% fee)</td>
                <td className="py-2.5 px-3 font-mono font-semibold text-zinc-950">$72.52 (3.3% fee)</td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600">+$5.90 (+8.9%)</td>
              </tr>
              <tr className="hover:bg-zinc-50/60">
                <td className="py-2.5 px-3 font-semibold text-zinc-950">$150.00 Order</td>
                <td className="py-2.5 px-3 font-mono text-zinc-700">$133.55 (11.0% fee)</td>
                <td className="py-2.5 px-3 font-mono text-zinc-700">$138.50 (7.7% fee)</td>
                <td className="py-2.5 px-3 font-mono font-semibold text-zinc-950">$145.35 (3.1% fee)</td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600">+$11.80 (+8.8%)</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {toolSlug === "etsy-vs-shopify-vs-tiktok-shop-calculator" && activeTab === "comparison" && (
        <div className="mt-4 overflow-x-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/80 text-zinc-700 font-semibold">
                <th className="py-2.5 px-3 rounded-l-lg">Dimension</th>
                <th className="py-2.5 px-3">Etsy</th>
                <th className="py-2.5 px-3">TikTok Shop</th>
                <th className="py-2.5 px-3 text-right rounded-r-lg">Shopify</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-800">
              <tr className="hover:bg-zinc-50/60">
                <td className="py-2.5 px-3 font-semibold text-zinc-950">Built-In Traffic</td>
                <td className="py-2.5 px-3 text-zinc-700">High (90M+ intent buyers)</td>
                <td className="py-2.5 px-3 text-zinc-700">Massive (Algorithmic FYP)</td>
                <td className="py-2.5 px-3 text-right text-zinc-500">None (Self-driven ads/SEO)</td>
              </tr>
              <tr className="hover:bg-zinc-50/60">
                <td className="py-2.5 px-3 font-semibold text-zinc-950">Customer Data Ownership</td>
                <td className="py-2.5 px-3 text-zinc-500">Masked (No marketing access)</td>
                <td className="py-2.5 px-3 text-zinc-500">Restricted to in-app buyers</td>
                <td className="py-2.5 px-3 text-right text-emerald-700 font-semibold">100% Owned (Email/SMS list)</td>
              </tr>
              <tr className="hover:bg-zinc-50/60">
                <td className="py-2.5 px-3 font-semibold text-zinc-950">Store Branding Control</td>
                <td className="py-2.5 px-3 text-zinc-600">Standard template banner</td>
                <td className="py-2.5 px-3 text-zinc-600">In-app showcase profile</td>
                <td className="py-2.5 px-3 text-right text-emerald-700 font-semibold">100% Custom domain &amp; design</td>
              </tr>
              <tr className="hover:bg-zinc-50/60">
                <td className="py-2.5 px-3 font-semibold text-zinc-950">Best Product Sweet Spot</td>
                <td className="py-2.5 px-3 text-zinc-700">Handmade, vintage, craft ($20–$60)</td>
                <td className="py-2.5 px-3 text-zinc-700">Viral gadgets, beauty ($15–$40)</td>
                <td className="py-2.5 px-3 text-right text-zinc-700">Scaling brands, repeat subscriptions</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      {toolSlug === "shopify-profit-calculator" && (
        <div className="mt-4 overflow-x-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/80 text-zinc-700 font-semibold">
                <th className="py-2.5 px-3 rounded-l-lg">Payment Gateway</th>
                <th className="py-2.5 px-3">Processing Rate</th>
                <th className="py-2.5 px-3">Fixed Fee</th>
                <th className="py-2.5 px-3">3rd-Party Platform Surcharge</th>
                <th className="py-2.5 px-3 text-right rounded-r-lg">Cost on $100 Order</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-800">
              {SHOPIFY_GATEWAY_PRESETS.map((gw) => {
                const sample = 100.0;
                const cost = sample * (gw.fees.ratePct / 100) + gw.fees.fixedFee + sample * (gw.fees.transactionPct / 100);
                return (
                  <tr key={gw.id} className="hover:bg-zinc-50/60">
                    <td className="py-2.5 px-3 font-semibold text-zinc-950 capitalize">{gw.id.replace("-", " ")}</td>
                    <td className="py-2.5 px-3 font-mono text-zinc-700">{gw.fees.ratePct}%</td>
                    <td className="py-2.5 px-3 font-mono text-zinc-700">${gw.fees.fixedFee.toFixed(2)}</td>
                    <td className="py-2.5 px-3 font-mono">
                      {gw.fees.transactionPct > 0 ? (
                        <span className="font-semibold text-rose-600">+{gw.fees.transactionPct}%</span>
                      ) : (
                        <span className="text-emerald-700 font-medium">0.0% (Waived)</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-zinc-950">${cost.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ========================================================= */}
      {/* STRIPE VS PAYPAL FEE TABLES                               */}
      {/* ========================================================= */}
      {toolSlug === "stripe-vs-paypal-fee-calculator" && activeTab === "global" && (
        <div className="mt-4 overflow-x-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/80 text-zinc-700 font-semibold">
                <th className="py-2.5 px-3 rounded-l-lg">Payment Channel / Fee Category</th>
                <th className="py-2.5 px-3">Stripe Rate</th>
                <th className="py-2.5 px-3">PayPal Rate</th>
                <th className="py-2.5 px-3">Cost Variance</th>
                <th className="py-2.5 px-3 text-right rounded-r-lg">Recommended Advantage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-800">
              <tr className="hover:bg-zinc-50/60">
                <td className="py-2.5 px-3 font-semibold text-zinc-950">Online Card Checkout (eCommerce)</td>
                <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">2.90% + $0.30</td>
                <td className="py-2.5 px-3 font-mono text-zinc-700">3.49% + $0.49</td>
                <td className="py-2.5 px-3 font-mono text-zinc-600">+0.59% + $0.19 on PayPal</td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600">Stripe (+0.59% + $0.19)</td>
              </tr>
              <tr className="hover:bg-zinc-50/60">
                <td className="py-2.5 px-3 font-semibold text-zinc-950">Client Invoicing (B2B / Freelance)</td>
                <td className="py-2.5 px-3 font-mono text-zinc-700">3.30% + $0.30</td>
                <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">2.99% + $0.49</td>
                <td className="py-2.5 px-3 font-mono text-zinc-600">Stripe +0.31% / PayPal +$0.19</td>
                <td className="py-2.5 px-3 text-right font-mono font-semibold text-zinc-900">PayPal &gt;$61 / Stripe &lt;$61</td>
              </tr>
              <tr className="hover:bg-zinc-50/60">
                <td className="py-2.5 px-3 font-semibold text-zinc-950">International Payment Card</td>
                <td className="py-2.5 px-3 font-mono text-zinc-700">+1.50%</td>
                <td className="py-2.5 px-3 font-mono text-zinc-700">+1.50%</td>
                <td className="py-2.5 px-3 font-mono text-zinc-500">Equal surcharge</td>
                <td className="py-2.5 px-3 text-right font-mono text-zinc-500">Tie (1.50%)</td>
              </tr>
              <tr className="hover:bg-zinc-50/60">
                <td className="py-2.5 px-3 font-semibold text-zinc-950">Currency Conversion (FX Margin)</td>
                <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">+1.00%</td>
                <td className="py-2.5 px-3 font-mono text-rose-600">+3.00% to 4.00%</td>
                <td className="py-2.5 px-3 font-mono text-rose-600">PayPal +2.0% – 3.0% spread</td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600">Stripe (Saves 2.0%+)</td>
              </tr>
              <tr className="hover:bg-zinc-50/60">
                <td className="py-2.5 px-3 font-semibold text-zinc-950">ACH Direct Debit (US Bank)</td>
                <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">0.80% (Capped at $5.00)</td>
                <td className="py-2.5 px-3 font-mono text-zinc-400">Not Supported for Invoicing</td>
                <td className="py-2.5 px-3 font-mono text-zinc-600">Stripe max $5 fee</td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600">Stripe (Save $100s B2B)</td>
              </tr>
              <tr className="hover:bg-zinc-50/60">
                <td className="py-2.5 px-3 font-semibold text-zinc-950">Chargeback / Dispute Surcharge</td>
                <td className="py-2.5 px-3 font-mono text-emerald-700">$15.00 (Refunded if won)</td>
                <td className="py-2.5 px-3 font-mono text-zinc-700">$20.00 (Non-refundable)</td>
                <td className="py-2.5 px-3 font-mono text-zinc-600">PayPal +$5.00 penalty</td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600">Stripe ($15 vs $20)</td>
              </tr>
              <tr className="hover:bg-zinc-50/60">
                <td className="py-2.5 px-3 font-semibold text-zinc-950">Instant Bank Payout</td>
                <td className="py-2.5 px-3 font-mono text-emerald-700">1.00% (Min $0.50)</td>
                <td className="py-2.5 px-3 font-mono text-zinc-700">1.75% (Min $0.25, Max $25)</td>
                <td className="py-2.5 px-3 font-mono text-zinc-600">PayPal +0.75% higher</td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600">Stripe (1.0% vs 1.75%)</td>
              </tr>
              <tr className="hover:bg-zinc-50/60 bg-zinc-50/40">
                <td className="py-2.5 px-3 font-bold text-zinc-950">Standard Payout Timeline</td>
                <td className="py-2.5 px-3 font-mono text-zinc-800">2-Day Rolling (Free)</td>
                <td className="py-2.5 px-3 font-mono text-zinc-800">1–3 Business Days to Bank</td>
                <td className="py-2.5 px-3 font-mono text-zinc-500">Automated bank deposit</td>
                <td className="py-2.5 px-3 text-right font-mono text-zinc-600">Comparable</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {toolSlug === "stripe-vs-paypal-fee-calculator" && activeTab === "ads" && (
        <div className="mt-4 overflow-x-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/80 text-zinc-700 font-semibold">
                <th className="py-2.5 px-3 rounded-l-lg">Checkout Order Amount</th>
                <th className="py-2.5 px-3">Stripe Fee (Effective %)</th>
                <th className="py-2.5 px-3">Stripe Net Payout</th>
                <th className="py-2.5 px-3">PayPal Fee (Effective %)</th>
                <th className="py-2.5 px-3">PayPal Net Payout</th>
                <th className="py-2.5 px-3 text-right rounded-r-lg">Stripe Advantage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-800">
              <tr className="hover:bg-zinc-50/60">
                <td className="py-2.5 px-3 font-semibold text-zinc-950">$15.00 Payment</td>
                <td className="py-2.5 px-3 font-mono text-zinc-700">$0.74 (4.90%)</td>
                <td className="py-2.5 px-3 font-mono font-semibold text-zinc-900">$14.26</td>
                <td className="py-2.5 px-3 font-mono text-zinc-700">$1.01 (6.76%)</td>
                <td className="py-2.5 px-3 font-mono text-zinc-700">$13.99</td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600">+$0.27 (+1.9%)</td>
              </tr>
              <tr className="hover:bg-zinc-50/60">
                <td className="py-2.5 px-3 font-semibold text-zinc-950">$35.00 Payment</td>
                <td className="py-2.5 px-3 font-mono text-zinc-700">$1.32 (3.76%)</td>
                <td className="py-2.5 px-3 font-mono font-semibold text-zinc-900">$33.68</td>
                <td className="py-2.5 px-3 font-mono text-zinc-700">$1.71 (4.89%)</td>
                <td className="py-2.5 px-3 font-mono text-zinc-700">$33.29</td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600">+$0.39 (+1.2%)</td>
              </tr>
              <tr className="hover:bg-zinc-50/60">
                <td className="py-2.5 px-3 font-semibold text-zinc-950">$75.00 Payment</td>
                <td className="py-2.5 px-3 font-mono text-zinc-700">$2.48 (3.30%)</td>
                <td className="py-2.5 px-3 font-mono font-semibold text-zinc-900">$72.52</td>
                <td className="py-2.5 px-3 font-mono text-zinc-700">$3.11 (4.14%)</td>
                <td className="py-2.5 px-3 font-mono text-zinc-700">$71.89</td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600">+$0.63 (+0.9%)</td>
              </tr>
              <tr className="hover:bg-zinc-50/60">
                <td className="py-2.5 px-3 font-semibold text-zinc-950">$150.00 Payment</td>
                <td className="py-2.5 px-3 font-mono text-zinc-700">$4.65 (3.10%)</td>
                <td className="py-2.5 px-3 font-mono font-semibold text-zinc-900">$145.35</td>
                <td className="py-2.5 px-3 font-mono text-zinc-700">$5.73 (3.82%)</td>
                <td className="py-2.5 px-3 font-mono text-zinc-700">$144.27</td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600">+$1.08 (+0.7%)</td>
              </tr>
              <tr className="hover:bg-zinc-50/60">
                <td className="py-2.5 px-3 font-semibold text-zinc-950">$500.00 Payment</td>
                <td className="py-2.5 px-3 font-mono text-zinc-700">$14.80 (2.96%)</td>
                <td className="py-2.5 px-3 font-mono font-semibold text-zinc-900">$485.20</td>
                <td className="py-2.5 px-3 font-mono text-zinc-700">$17.94 (3.59%)</td>
                <td className="py-2.5 px-3 font-mono text-zinc-700">$482.06</td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600">+$3.14 (+0.6%)</td>
              </tr>
              <tr className="hover:bg-zinc-50/60">
                <td className="py-2.5 px-3 font-semibold text-zinc-950">$1,500.00 Payment</td>
                <td className="py-2.5 px-3 font-mono text-zinc-700">$43.80 (2.92%)</td>
                <td className="py-2.5 px-3 font-mono font-semibold text-zinc-900">$1,456.20</td>
                <td className="py-2.5 px-3 font-mono text-zinc-700">$52.84 (3.52%)</td>
                <td className="py-2.5 px-3 font-mono text-zinc-700">$1,447.16</td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600">+$9.04 (+0.6%)</td>
              </tr>
              <tr className="hover:bg-zinc-50/60">
                <td className="py-2.5 px-3 font-semibold text-zinc-950">$5,000.00 Payment</td>
                <td className="py-2.5 px-3 font-mono text-zinc-700">$145.30 (2.91%)</td>
                <td className="py-2.5 px-3 font-mono font-semibold text-zinc-900">$4,854.70</td>
                <td className="py-2.5 px-3 font-mono text-zinc-700">$174.99 (3.50%)</td>
                <td className="py-2.5 px-3 font-mono text-zinc-700">$4,825.01</td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600">+$29.69 (+0.6%)</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {toolSlug === "stripe-vs-paypal-fee-calculator" && activeTab === "comparison" && (
        <div className="mt-4 overflow-x-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/80 text-zinc-700 font-semibold">
                <th className="py-2.5 px-3 rounded-l-lg">Settlement Country</th>
                <th className="py-2.5 px-3">Currency</th>
                <th className="py-2.5 px-3">Stripe Domestic Rate</th>
                <th className="py-2.5 px-3">PayPal Domestic Rate</th>
                <th className="py-2.5 px-3">Cross-Border FX Margin</th>
                <th className="py-2.5 px-3 text-right rounded-r-lg">Stripe Advantage (per 1,000 units)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-800">
              {PAYMENT_CURRENCY_PRESETS.map((preset) => {
                const sample = 1000.0;
                const stripeCost = sample * (preset.fees.domesticRate / 100) + preset.fees.domesticFixed;
                const paypalRate = preset.id === "gbp" || preset.id === "eur" ? 2.9 : 3.49;
                const paypalFixed = preset.id === "gbp" ? 0.30 : preset.id === "eur" ? 0.39 : 0.49;
                const paypalCost = sample * (paypalRate / 100) + paypalFixed;
                const diff = paypalCost - stripeCost;

                return (
                  <tr key={preset.id} className="hover:bg-zinc-50/60">
                    <td className="py-2.5 px-3 font-semibold text-zinc-950">{preset.country}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-zinc-700">
                      {preset.currency} ({preset.currencySymbol})
                    </td>
                    <td className="py-2.5 px-3 font-mono text-zinc-900">
                      {preset.fees.domesticRate}% + {preset.currencySymbol}{preset.fees.domesticFixed.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-zinc-700">
                      {paypalRate}% + {preset.currencySymbol}{paypalFixed.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-zinc-600">
                      Stripe 1.0% vs PayPal 3.0%+
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600">
                      {diff > 0 ? `+${preset.currencySymbol}${diff.toFixed(2)}` : `${preset.currencySymbol}${diff.toFixed(2)}`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
