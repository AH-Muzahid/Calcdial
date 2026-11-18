"use client";

import { useState } from "react";
import { ETSY_FEE_PRESETS, POD_ITEM_PRESETS, TIKTOK_CATEGORY_PRESETS, SHOPIFY_GATEWAY_PRESETS } from "@/data/fee-presets";

interface FeeScheduleTableProps {
  toolSlug: string;
}

export function FeeScheduleTable({ toolSlug }: FeeScheduleTableProps) {
  const [activeTab, setActiveTab] = useState<"global" | "ads" | "comparison">("global");

  if (toolSlug !== "etsy-fee-calculator" && 
      toolSlug !== "pod-profit-calculator" && 
      toolSlug !== "tiktok-shop-fee-calculator" && 
      toolSlug !== "shopify-profit-calculator") {
    return null;
  }

  return (
    <section className="my-8 rounded-2xl border border-zinc-200/90 bg-white p-5 sm:p-6 shadow-2xs font-sans">
      {/* Header & Clean Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
        <div>
          <h3 className="text-base sm:text-lg font-bold tracking-tight text-zinc-950">
            {toolSlug === "etsy-fee-calculator" && "2026 Etsy Fee Schedule & International Reference"}
            {toolSlug === "pod-profit-calculator" && "Print-on-Demand Base Costs & Target Margins"}
            {toolSlug === "tiktok-shop-fee-calculator" && "TikTok Shop Category Referral Rates"}
            {toolSlug === "shopify-profit-calculator" && "Shopify Gateway Processing Comparison"}
          </h3>
          <p className="mt-0.5 text-xs text-zinc-500">
            Current verified seller fee rates and platform policies.
          </p>
        </div>

        {/* Clean, Subtle Pill Tabs */}
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

      {/* Shopify Gateway Comparison */}
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
    </section>
  );
}
