"use client";

import { useState, useMemo, useEffect } from "react";
import { compareMarketplaces, PlatformResult } from "@/lib/formulas/platform-comparison";
import { ETSY_FEE_PRESETS } from "@/data/fee-presets";
import { InputField } from "./InputField";
import { PresetSelector } from "./PresetSelector";
import { ComparisonTable } from "./ComparisonTable";
import { StickyResultBar } from "./StickyResultBar";
import { ContextualToolBridge } from "./ContextualToolBridge";
import { ShareButton } from "@/components/layout/ShareButton";
import { PrintButton } from "@/components/layout/PrintButton";
import { EmbedModal } from "@/components/layout/EmbedModal";
import { PillTabs } from "@/components/motion/pill-tabs";
import { trackEvent } from "@/lib/analytics";
import { formatCurrency } from "@/lib/utils";

export function MarketplaceComparison({ isEmbed = false }: { isEmbed?: boolean }) {
  const [sellingPrice, setSellingPrice] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search).get("price");
      if (p && !isNaN(parseFloat(p))) return parseFloat(p);
    }
    return 38.00;
  });
  const [shippingCharge, setShippingCharge] = useState<number>(4.99);
  const [cogs, setCogs] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const c = new URLSearchParams(window.location.search).get("cost");
      if (c && !isNaN(parseFloat(c))) return parseFloat(c);
    }
    return 10.50;
  });
  const [shippingCost, setShippingCost] = useState<number>(4.50);
  const [monthlyOrders, setMonthlyOrders] = useState<number>(100);
  const [country, setCountry] = useState<string>("us");
  const [viewMode, setViewMode] = useState<string>("per-order");

  const handleReset = () => {
    setSellingPrice(38.00);
    setShippingCharge(4.99);
    setCogs(10.50);
    setShippingCost(4.50);
    setMonthlyOrders(100);
    setCountry("us");
    setViewMode("per-order");
  };

  const comparison = useMemo(() => {
    return compareMarketplaces({
      sellingPrice,
      shippingCharge,
      cogs,
      shippingCost,
      monthlyOrders,
      country,
    });
  }, [sellingPrice, shippingCharge, cogs, shippingCost, monthlyOrders, country]);

  useEffect(() => {
    const timer = setTimeout(() => {
      trackEvent({
        name: "calculator_used",
        params: { tool_slug: "etsy-vs-shopify-vs-tiktok-shop-calculator", preset: country },
      });
    }, 1500);
    return () => clearTimeout(timer);
  }, [sellingPrice, cogs, monthlyOrders, country]);

  const countryOptions = ETSY_FEE_PRESETS.map((p) => ({
    id: p.id,
    label: `${p.country} (${p.currency})`,
  }));

  const viewTabs = [
    { id: "per-order", label: "Per-Order Comparison" },
    { id: "annual", label: "Annual Volume Projection" },
  ];

  const getFormattedSummary = () => {
    return `Etsy vs Shopify vs TikTok Shop Comparison (2026)
----------------------------------------
Item Retail Price:   $${sellingPrice.toFixed(2)}
Shipping Charged:    $${shippingCharge.toFixed(2)}
COGS & Postage:      $${(cogs + shippingCost).toFixed(2)}
Monthly Volume:      ${monthlyOrders} orders/mo
----------------------------------------
MOST PROFITABLE:     ${comparison.winner.platform} (Net Profit: $${comparison.winner.netProfit.toFixed(2)}/order)
Extra vs Etsy:       +$${comparison.annualSavingsWinnerVsEtsy.toLocaleString()}/yr
----------------------------------------
Etsy Net Profit:     $${comparison.results.find((r: PlatformResult) => r.platform === "Etsy")?.netProfit.toFixed(2)} (Effective Fee: ${comparison.results.find((r: PlatformResult) => r.platform === "Etsy")?.effectiveFeePct}%)
Shopify Net Profit:  $${comparison.results.find((r: PlatformResult) => r.platform === "Shopify")?.netProfit.toFixed(2)} (Effective Fee: ${comparison.results.find((r: PlatformResult) => r.platform === "Shopify")?.effectiveFeePct}%)
TikTok Net Profit:   $${comparison.results.find((r: PlatformResult) => r.platform === "TikTok Shop")?.netProfit.toFixed(2)} (Effective Fee: ${comparison.results.find((r: PlatformResult) => r.platform === "TikTok Shop")?.effectiveFeePct}%)
----------------------------------------
Calculated on CalcDial: https://calcdial.com/tools/etsy-vs-shopify-vs-tiktok-shop-calculator`;
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-xs space-y-8">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-zinc-100 gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-zinc-950">
            3-Way Platform Profit Engine
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Compare Etsy, Shopify, and TikTok Shop side-by-side on identical order economics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <PillTabs
            tabs={viewTabs}
            value={viewMode}
            onValueChange={setViewMode}
            label="Comparison View Mode"
          />
          <button
            type="button"
            onClick={handleReset}
            className="hidden sm:inline-flex items-center gap-1 text-xs font-mono text-zinc-400 hover:text-zinc-900 transition-colors cursor-pointer"
            title="Reset to defaults"
          >
            <span>↺</span>
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Input Cards Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 pb-6 border-b border-zinc-100">
        {/* Card 1: Retail Price & Shipping */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="flex size-5 items-center justify-center rounded-full bg-zinc-950 text-[10px] font-bold font-mono text-white">
              1
            </span>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-900">
              Retail Price & Shipping
            </h3>
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
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="flex size-5 items-center justify-center rounded-full bg-zinc-950 text-[10px] font-bold font-mono text-white">
              2
            </span>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-900">
              Unit Costs & Postage
            </h3>
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
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="flex size-5 items-center justify-center rounded-full bg-zinc-950 text-[10px] font-bold font-mono text-white">
              3
            </span>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-900">
              Volume & Region
            </h3>
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
      <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-950 text-white font-bold text-sm shadow-xs">
              ✓
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">
                  Most Profitable Channel:
                </span>
                <span className="rounded-full bg-zinc-950 px-2.5 py-0.5 text-xs font-mono font-bold text-white">
                  {comparison.winner.platform}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-700 mt-1 font-medium leading-relaxed">
                {comparison.dataSnippet}
              </p>
            </div>
          </div>

          <div className="sm:text-right shrink-0">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500">
              Annual Extra Take-Home
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-zinc-950 font-mono">
              +{formatCurrency(comparison.annualSavingsWinnerVsEtsy)}
            </div>
            <span className="text-[11px] text-zinc-400 font-mono">vs Etsy over 12 months</span>
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
        {comparison.results.map((r: PlatformResult) => {
          const isWinner = r.platform === comparison.winner.platform;
          return (
            <div
              key={r.platform}
              className={`rounded-xl border p-5 space-y-3 transition-all ${
                isWinner
                  ? "border-zinc-900 bg-zinc-50 shadow-xs ring-1 ring-zinc-900/10"
                  : "border-zinc-200 bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-zinc-950 text-base">{r.platform}</h3>
                <span
                  className={`rounded-md px-2 py-0.5 text-xs font-bold font-mono ${
                    isWinner ? "bg-zinc-950 text-white" : "bg-zinc-100 text-zinc-700"
                  }`}
                >
                  {r.effectiveFeePct}% fee
                </span>
              </div>

              <div className="space-y-1 text-xs text-zinc-600 pt-2 border-t border-zinc-100">
                <div className="flex justify-between">
                  <span>Gross Order:</span>
                  <span className="font-mono font-medium text-zinc-900">
                    {formatCurrency(r.grossRevenue)}
                  </span>
                </div>
                <div className="flex justify-between text-zinc-700">
                  <span>Platform Cut:</span>
                  <span className="font-mono font-semibold">
                    -{formatCurrency(r.totalPlatformFees)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Carrier & COGS:</span>
                  <span className="font-mono text-zinc-500">
                    -{formatCurrency(cogs + shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-zinc-950 pt-1 border-t border-dashed border-zinc-200">
                  <span>Real Net Profit:</span>
                  <span
                    className={`font-mono text-sm ${
                      r.netProfit >= 0 ? "text-zinc-950 font-extrabold" : "text-rose-600"
                    }`}
                  >
                    {formatCurrency(r.netProfit)}
                  </span>
                </div>
              </div>

              <div className="mt-2 rounded-lg bg-zinc-50 p-2.5 text-center text-xs border border-zinc-100">
                <span className="text-zinc-400 block text-[11px] font-mono">
                  Annual Profit ({monthlyOrders * 12} sales):
                </span>
                <span className="font-bold text-zinc-950 font-mono text-sm mt-0.5 block">
                  {formatCurrency(r.annualProjection.netProfit)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Contextual Next Tool Bridge */}
      {!isEmbed && (
        <ContextualToolBridge
          currentTool="etsy-vs-shopify-vs-tiktok-shop-calculator"
          price={sellingPrice}
          cost={cogs}
        />
      )}

      {!isEmbed && (
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <ShareButton
            toolSlug="etsy-vs-shopify-vs-tiktok-shop-calculator"
            getFormattedText={getFormattedSummary}
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-mono text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950 transition-colors"
            >
              <span>↺</span>
              <span>Reset Form</span>
            </button>
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
