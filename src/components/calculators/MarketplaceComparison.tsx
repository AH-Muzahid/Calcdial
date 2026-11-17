"use client";

import { useState, useMemo, useEffect } from "react";
import { compareMarketplaces } from "@/lib/formulas/platform-comparison";
import { ETSY_FEE_PRESETS } from "@/data/fee-presets";
import { InputField } from "./InputField";
import { PresetSelector } from "./PresetSelector";
import { ComparisonTable } from "./ComparisonTable";
import { StickyResultBar } from "./StickyResultBar";
import { ShareButton } from "@/components/layout/ShareButton";
import { PrintButton } from "@/components/layout/PrintButton";
import { EmbedModal } from "@/components/layout/EmbedModal";
import { PillTabs } from "@/components/motion/pill-tabs";
import { trackEvent } from "@/lib/analytics";
import { formatCurrency } from "@/lib/utils";

export function MarketplaceComparison({ isEmbed = false }: { isEmbed?: boolean }) {
  const [viewMode, setViewMode] = useState<string>("per-order");
  const [sellingPrice, setSellingPrice] = useState<number>(38.00);
  const [cogs, setCogs] = useState<number>(10.50);
  const [shippingCharge, setShippingCharge] = useState<number>(4.99);
  const [shippingCost, setShippingCost] = useState<number>(4.50);
  const [country, setCountry] = useState<string>("us");
  const [monthlyOrders, setMonthlyOrders] = useState<number>(100);

  const comparison = useMemo(() => {
    return compareMarketplaces({
      sellingPrice,
      cogs,
      shippingCharge,
      shippingCost,
      country,
      monthlyOrders,
    });
  }, [sellingPrice, cogs, shippingCharge, shippingCost, country, monthlyOrders]);

  useEffect(() => {
    const timer = setTimeout(() => {
      trackEvent({
        name: "calculator_used",
        params: { tool_slug: "etsy-vs-shopify-vs-tiktok-shop-calculator", preset: country },
      });
    }, 1500);
    return () => clearTimeout(timer);
  }, [sellingPrice, country, monthlyOrders]);

  const countryOptions = ETSY_FEE_PRESETS.map((p) => ({
    id: p.id,
    label: `${p.country} (${p.currency})`,
  }));

  const viewTabs = [
    { id: "per-order", label: "Per-Order Comparison" },
    { id: "annual", label: "Annual Volume Projection" },
  ];

  const getFormattedSummary = () => {
    return `Marketplace Profit Comparison & Annual Projection (2026)
----------------------------------------
Item Retail Price:    $${sellingPrice.toFixed(2)}
Shipping Charged:     $${shippingCharge.toFixed(2)}
COGS & Carrier Post:  $${(cogs + shippingCost).toFixed(2)}
Monthly Order Volume: ${monthlyOrders} orders/mo
----------------------------------------
${comparison.results
  .map(
    (r) =>
      `${r.platform.padEnd(12)}: Net $${r.netProfit.toFixed(2)}/order (${r.netMarginPct}% margin) | Annual Net: $${r.annualProjection.netProfit.toLocaleString()}`
  )
  .join("\n")}
----------------------------------------
Winner: ${comparison.winner.platform} (Net Profit $${comparison.winner.netProfit.toFixed(2)}/order)
Annual Savings vs Etsy: $${comparison.annualSavingsWinnerVsEtsy.toLocaleString()}
Calculated on CalcDial: https://calcdial.com/tools/etsy-vs-shopify-vs-tiktok-shop-calculator`;
  };

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-8">
      {/* View Switcher Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between pb-6 border-b border-slate-100 gap-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-slate-900">
            Marketplace Head-to-Head Fee Audit
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare true seller take-home between Etsy, Shopify, and TikTok Shop
          </p>
        </div>
        <PillTabs
          tabs={viewTabs}
          value={viewMode}
          onValueChange={setViewMode}
          label="Comparison View Mode"
        />
      </div>

      {/* Input Cards Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Card 1: Retail Price & Shipping */}
        <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              1. Retail Price & Shipping
            </span>
            <span className="text-xs font-medium text-slate-500">Customer checkout</span>
          </div>
          <InputField
            label="Item Selling Price"
            value={sellingPrice}
            onChange={setSellingPrice}
            prefix="$"
            presets={[25, 38, 65, 110]}
          />
          <InputField
            label="Shipping Charged to Buyer"
            value={shippingCharge}
            onChange={setShippingCharge}
            prefix="$"
            helpText="Enter $0.00 if offering Free Shipping"
            presets={[0, 4.99, 7.50]}
          />
        </div>

        {/* Card 2: COGS & Carrier Postage */}
        <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              2. Unit Costs & Postage
            </span>
            <span className="text-xs font-medium text-slate-500">Raw seller outlay</span>
          </div>
          <InputField
            label="Product Cost (COGS)"
            value={cogs}
            onChange={setCogs}
            prefix="$"
            helpText="Landed manufacturing / supplier cost"
            presets={[5, 10.5, 20, 35]}
          />
          <InputField
            label="Out-of-Pocket Shipping Cost"
            value={shippingCost}
            onChange={setShippingCost}
            prefix="$"
            helpText="Postage label paid to carrier"
            presets={[3.5, 4.5, 8.0]}
          />
        </div>

        {/* Card 3: Volume & Region */}
        <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              3. Volume & Region
            </span>
            <span className="text-xs font-medium text-slate-500">Scale modeling</span>
          </div>
          <InputField
            label="Monthly Sales Volume (Orders)"
            value={monthlyOrders}
            onChange={setMonthlyOrders}
            helpText="Projected monthly orders across channels"
            presets={[25, 100, 250, 500]}
          />
          <PresetSelector
            label="Seller Country"
            selectedId={country}
            options={countryOptions}
            onSelect={setCountry}
            helpText="Etsy Payment processing region"
          />
        </div>
      </div>

      {/* Winner Recommendation Banner */}
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/70 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white font-black text-lg shadow-sm">
              ✓
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Most Profitable Channel:
                </span>
                <span className="rounded-full bg-emerald-200/80 px-2.5 py-0.5 text-xs font-black text-emerald-900">
                  {comparison.winner.platform}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-950 mt-1 font-medium leading-relaxed">
                {comparison.dataSnippet}
              </p>
            </div>
          </div>

          <div className="sm:text-right shrink-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
              Annual Extra Take-Home
            </span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-900 font-mono">
              +{formatCurrency(comparison.annualSavingsWinnerVsEtsy)}
            </div>
            <span className="text-[11px] text-emerald-700 font-medium">vs Etsy over 12 months</span>
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison Table */}
      <ComparisonTable
        results={comparison.results}
        showAnnual={viewMode === "annual"}
      />

      {/* Platform Cards Breakdown */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {comparison.results.map((r) => {
          const isWinner = r.platform === comparison.winner.platform;
          return (
            <div
              key={r.platform}
              className={`rounded-2xl border p-5 space-y-3 transition-all ${
                isWinner
                  ? "border-emerald-500 bg-emerald-50/20 shadow-md ring-1 ring-emerald-500/20"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-base">{r.platform}</h3>
                <span
                  className={`rounded-md px-2 py-0.5 text-xs font-bold font-mono ${
                    isWinner ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {r.effectiveFeePct}% fee
                </span>
              </div>

              <div className="space-y-1 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex justify-between">
                  <span>Gross Order:</span>
                  <span className="font-mono font-medium text-slate-800">
                    {formatCurrency(r.grossRevenue)}
                  </span>
                </div>
                <div className="flex justify-between text-rose-600">
                  <span>Platform Cut:</span>
                  <span className="font-mono font-semibold">
                    -{formatCurrency(r.totalPlatformFees)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Carrier & COGS:</span>
                  <span className="font-mono text-slate-700">
                    -{formatCurrency(cogs + shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 pt-1 border-t border-dashed border-slate-200">
                  <span>Real Net Profit:</span>
                  <span
                    className={`font-mono text-sm ${
                      r.netProfit >= 0 ? "text-emerald-700" : "text-rose-600"
                    }`}
                  >
                    {formatCurrency(r.netProfit)}
                  </span>
                </div>
              </div>

              <div className="mt-2 rounded-xl bg-slate-50 p-2.5 text-center text-xs border border-slate-100">
                <span className="text-slate-500 block text-[11px]">
                  Annual Profit ({monthlyOrders * 12} sales):
                </span>
                <span className="font-black text-slate-900 font-mono text-sm mt-0.5 block">
                  {formatCurrency(r.annualProjection.netProfit)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {!isEmbed && (
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <ShareButton
            toolSlug="etsy-vs-shopify-vs-tiktok-shop-calculator"
            getFormattedText={getFormattedSummary}
          />
          <div className="flex items-center gap-2">
            <PrintButton toolSlug="etsy-vs-shopify-vs-tiktok-shop-calculator" />
            <EmbedModal
              toolSlug="etsy-vs-shopify-vs-tiktok-shop-calculator"
              title="Etsy vs Shopify vs TikTok Shop Calculator"
            />
          </div>
        </div>
      )}

      {!isEmbed && (
        <StickyResultBar
          label={`Top Channel: ${comparison.winner.platform}`}
          value={comparison.winner.netProfit}
          subLabel="Annual Advantage"
          subValue={comparison.annualSavingsWinnerVsEtsy}
        />
      )}
    </div>
  );
}
