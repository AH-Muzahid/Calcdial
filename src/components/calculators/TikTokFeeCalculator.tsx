"use client";

import { useState, useMemo, useEffect } from "react";
import { calculateTikTokFees } from "@/lib/formulas/tiktok-fees";
import { TIKTOK_CATEGORY_PRESETS } from "@/data/fee-presets";
import { InputField } from "./InputField";
import { PresetSelector } from "./PresetSelector";
import { ResultCard } from "./ResultCard";
import { StickyResultBar } from "./StickyResultBar";
import { ShareButton } from "@/components/layout/ShareButton";
import { PrintButton } from "@/components/layout/PrintButton";
import { EmbedModal } from "@/components/layout/EmbedModal";
import { PillTabs } from "@/components/motion/pill-tabs";
import { trackEvent } from "@/lib/analytics";

export function TikTokFeeCalculator({ initialCategory = "beauty", isEmbed = false }: { initialCategory?: string; isEmbed?: boolean }) {
  const [mode, setMode] = useState<string>("profit");
  const [salePrice, setSalePrice] = useState<number>(30.00);
  const [shippingCharged, setShippingCharged] = useState<number>(0.00);
  const [category, setCategory] = useState<string>(initialCategory.toLowerCase());
  const [affiliatePct, setAffiliatePct] = useState<number>(10.0);
  const [cogs, setCogs] = useState<number>(8.50);
  const [shipping, setShipping] = useState<number>(4.00);
  const [targetMargin, setTargetMargin] = useState<number>(35);

  const handleReset = () => {
    setSalePrice(30.00);
    setShippingCharged(0.00);
    setCategory(initialCategory.toLowerCase());
    setAffiliatePct(10.0);
    setCogs(8.50);
    setShipping(4.00);
    setTargetMargin(35);
  };

  const result = useMemo(() => {
    return calculateTikTokFees({
      salePrice,
      shippingCharged,
      category,
      creatorAffiliatePct: affiliatePct,
      cogs,
      shippingCost: shipping,
      targetMarginPct: mode === "target" ? targetMargin : undefined,
    });
  }, [salePrice, shippingCharged, category, affiliatePct, cogs, shipping, mode, targetMargin]);

  useEffect(() => {
    const timer = setTimeout(() => {
      trackEvent({
        name: "calculator_used",
        params: { tool_slug: "tiktok-shop-fee-calculator", preset: category },
      });
    }, 1500);
    return () => clearTimeout(timer);
  }, [salePrice, category, affiliatePct, cogs]);

  const categoryOptions = TIKTOK_CATEGORY_PRESETS.map((p) => ({
    id: p.id,
    label: `${p.id.toUpperCase().replace("-", " ")} (${p.fees.referralPct}%)`,
  }));

  const modeTabs = [
    { id: "profit", label: "Calculate Net Profit" },
    { id: "target", label: "Target Margin Pricing" },
  ];

  const getFormattedSummary = () => {
    return `TikTok Shop Net Profit & Fee Architecture (2026)
----------------------------------------
Category:            ${category.toUpperCase()} (${result.referralRatePct}% fee)
Item Selling Price:  $${salePrice.toFixed(2)}
Shipping Charged:    $${shippingCharged.toFixed(2)}
Creator Affiliate:   ${affiliatePct}% ($${result.affiliateCommission.toFixed(2)})
TikTok Fixed Fee:    $0.30
Landed Cost (COGS):  $${cogs.toFixed(2)}
Fulfillment Postage: $${shipping.toFixed(2)}
----------------------------------------
Gross Revenue:       $${result.grossRevenue.toFixed(2)}
Total TikTok & Cuts: $${result.totalFees.toFixed(2)}
TikTok Bank Deposit: $${result.netPayout.toFixed(2)}
Total Product Costs: $${result.totalProductCosts.toFixed(2)}
----------------------------------------
REAL NET PROFIT:     $${result.netProfit.toFixed(2)} (${result.netMarginPct}% margin)
Break-Even Price:    $${result.breakEvenPrice.toFixed(2)}
----------------------------------------
Calculated on CalcDial: https://calcdial.com/tools/tiktok-shop-fee-calculator`;
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-xs">
      {/* Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-zinc-100 gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-zinc-950">
            TikTok Shop Profit & Fee Architecture
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Updated for 2026 category referral fee tiers and creator affiliate marketplace rates
          </p>
        </div>
        <div className="flex items-center gap-3">
          <PillTabs
            tabs={modeTabs}
            value={mode}
            onValueChange={setMode}
            label="TikTok Calculator Mode"
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

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7 space-y-6">

          {/* Group 1: 🏷️ Item Pricing & Shipping */}
          <div className="space-y-4 pb-6 border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <span className="flex size-5 items-center justify-center rounded-full bg-zinc-950 text-[10px] font-bold font-mono text-white">
                1
              </span>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-900">
                Product Pricing & Customer Shipping
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InputField
                label="Item Listing Price"
                value={salePrice}
                onChange={setSalePrice}
                prefix="$"
                helpText="Retail checkout price visible on TikTok"
                presets={[15, 24.99, 39.99, 59.99]}
              />
              <InputField
                label="Shipping Charged to Buyer"
                value={shippingCharged}
                onChange={setShippingCharged}
                prefix="$"
                helpText="Enter 0 for Free Shipping"
                presets={[0, 3.99, 5.99]}
              />
            </div>

            {mode === "target" && (
              <InputField
                label="Target Net Profit Margin %"
                value={targetMargin}
                onChange={setTargetMargin}
                suffix="%"
                presets={[20, 30, 45]}
              />
            )}
          </div>

          {/* Group 2: 📦 Landed COGS & Fulfillment */}
          <div className="space-y-4 pb-6 border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <span className="flex size-5 items-center justify-center rounded-full bg-zinc-950 text-[10px] font-bold font-mono text-white">
                2
              </span>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-900">
                Your Product Cost & Postage (COGS)
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InputField
                label="Landed Product Cost (COGS)"
                value={cogs}
                onChange={setCogs}
                prefix="$"
                helpText="Manufacturing or wholesale unit cost"
                presets={[5, 8.50, 15, 25]}
              />
              <InputField
                label="Fulfillment & Carrier Shipping"
                value={shipping}
                onChange={setShipping}
                prefix="$"
                helpText="Packaging, label, and postage cost"
                presets={[0, 3.50, 4.80, 7.50]}
              />
            </div>
          </div>

          {/* Group 3: 🛍️ Category Referral & Creator Affiliate */}
          <div className="space-y-4 pb-6 border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <span className="flex size-5 items-center justify-center rounded-full bg-zinc-950 text-[10px] font-bold font-mono text-white">
                3
              </span>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-900">
                Platform Referral & Creator Affiliate
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <PresetSelector
                label="Product Category (Referral Rate)"
                selectedId={category}
                options={categoryOptions}
                onSelect={setCategory}
                helpText="Standard 2026 TikTok Shop category commission rates"
              />

              <InputField
                label="Creator Affiliate Commission %"
                value={affiliatePct}
                onChange={setAffiliatePct}
                suffix="%"
                helpText="Set in TikTok Creator Marketplace (applied to item price)"
                presets={[5, 10, 15, 20]}
              />
            </div>
          </div>

          {!isEmbed && (
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <ShareButton
                toolSlug="tiktok-shop-fee-calculator"
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
                <PrintButton toolSlug="tiktok-shop-fee-calculator" />
                <EmbedModal toolSlug="tiktok-shop-fee-calculator" title="TikTok Shop Fee Calculator" />
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Verified Outputs */}
        <div className="lg:col-span-5">
          <ResultCard
            primaryLabel="Real Net Profit"
            primaryValue={result.netProfit}
            secondaryLabel="Total Deductions (Fees + COGS)"
            secondaryValue={result.totalDeductions}
            payoutLabel="TikTok Bank Settlement"
            payoutValue={result.netPayout}
            breakEvenPrice={result.breakEvenPrice}
            targetPriceForMargin={mode === "target" ? result.targetPriceForMargin : undefined}
            marginPct={result.netMarginPct}
            roiPct={result.roiPct}
            breakdown={result.breakdown}
          />
        </div>
      </div>

      {!isEmbed && (
        <StickyResultBar
          label="TikTok Profit"
          value={result.netProfit}
          subLabel="Net Margin"
          subValue={result.netMarginPct}
        />
      )}
    </div>
  );
}
