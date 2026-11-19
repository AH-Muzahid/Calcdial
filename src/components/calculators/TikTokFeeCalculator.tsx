"use client";

import { useState, useMemo, useEffect } from "react";
import { calculateTikTokFees } from "@/lib/formulas/tiktok-fees";
import { TIKTOK_CATEGORY_PRESETS } from "@/data/fee-presets";
import { CustomSelect, CustomSelectOption } from "@/components/common/CustomSelect";
import { StickyResultBar } from "./StickyResultBar";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import {
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  ArrowRight,
} from "lucide-react";
import { PixelButton } from "@/components/ui/PixelButton";

interface TikTokFeeCalculatorProps {
  initialCategory?: string;
  isEmbed?: boolean;
}

const CATEGORY_NAMES: Record<string, string> = {
  beauty: "Beauty & Personal Care",
  apparel: "Apparel & Shoes",
  electronics: "Phones & Electronics",
  "home-garden": "Home & Kitchen",
  health: "Health & Supplements",
  toys: "Toys & Games",
  sports: "Sports & Outdoors",
  food: "Food & Beverage",
  pets: "Pet Supplies",
  accessories: "Fashion Accessories",
};

const categoryOptions: CustomSelectOption[] = TIKTOK_CATEGORY_PRESETS.map((p) => ({
  value: p.id,
  label: `${CATEGORY_NAMES[p.id] || p.id} (${p.fees.referralPct?.toFixed(1) ?? "6.0"}%)`,
}));

const PRESETS = [20, 30, 45, 60, 85, 120];
const AFFILIATE_PRESETS = [0, 10, 15, 20];

const formatAmount = (val: number) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val);
};

export function TikTokFeeCalculator({
  initialCategory = "beauty",
  isEmbed = false,
}: TikTokFeeCalculatorProps) {
  const [mode, setMode] = useState<"profit" | "target">("profit");

  const [priceStr, setPriceStr] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search).get("price");
      if (p && !isNaN(parseFloat(p))) return parseFloat(p).toFixed(2);
    }
    return "30.00";
  });

  const [shippingChargedStr, setShippingChargedStr] = useState<string>("0.00");
  const [cogsStr, setCogsStr] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const c = new URLSearchParams(window.location.search).get("cost");
      if (c && !isNaN(parseFloat(c))) return parseFloat(c).toFixed(2);
    }
    return "8.50";
  });

  const [shippingCostStr, setShippingCostStr] = useState<string>("4.00");
  const [category, setCategory] = useState<string>(initialCategory.toLowerCase());
  const [includeAffiliate, setIncludeAffiliate] = useState<boolean>(true);
  const [affiliatePctStr, setAffiliatePctStr] = useState<string>("10");
  const [targetMarginStr, setTargetMarginStr] = useState<string>("35");

  const [showItemized, setShowItemized] = useState<boolean>(false);
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);

  const salePrice = Math.max(0, parseFloat(priceStr) || 0);
  const shippingCharged = Math.max(0, parseFloat(shippingChargedStr) || 0);
  const cogs = Math.max(0, parseFloat(cogsStr) || 0);
  const shippingCost = Math.max(0, parseFloat(shippingCostStr) || 0);
  const affiliatePct = includeAffiliate ? Math.max(0, parseFloat(affiliatePctStr) || 0) : 0;
  const targetMargin = Math.max(0, parseFloat(targetMarginStr) || 0);

  const result = useMemo(() => {
    return calculateTikTokFees({
      salePrice,
      shippingCharged,
      cogs,
      shippingCost,
      category,
      creatorAffiliatePct: affiliatePct,
      targetMarginPct: mode === "target" ? targetMargin : undefined,
    });
  }, [salePrice, shippingCharged, cogs, shippingCost, category, affiliatePct, targetMargin, mode]);

  const recommendedPrice = result.targetPriceForMargin ?? result.breakEvenPrice;

  const reverseAnalysis = useMemo(() => {
    return calculateTikTokFees({
      salePrice: recommendedPrice,
      shippingCharged,
      cogs,
      shippingCost,
      category,
      creatorAffiliatePct: affiliatePct,
    });
  }, [recommendedPrice, shippingCharged, cogs, shippingCost, category, affiliatePct]);

  const handleReset = () => {
    setPriceStr("30.00");
    setShippingChargedStr("0.00");
    setCogsStr("8.50");
    setShippingCostStr("4.00");
    setCategory(initialCategory.toLowerCase());
    setIncludeAffiliate(true);
    setAffiliatePctStr("10");
    setTargetMarginStr("35");
  };

  // Proportions
  const grossRev = result.grossRevenue > 0 ? result.grossRevenue : Math.max(0.01, salePrice + shippingCharged);
  const profitWidth = Math.min(100, Math.max(0, (result.netProfit / grossRev) * 100));
  const feesWidth = Math.min(100, Math.max(0, (result.totalFees / grossRev) * 100));
  const costWidth = Math.min(100, Math.max(0, ((cogs + shippingCost) / grossRev) * 100));

  const handleCopySummary = () => {
    trackEvent({
      name: "result_copied",
      params: { tool_slug: "tiktok-shop-fee-calculator", method: "clipboard" },
    });

    const isStandard = mode === "profit";
    const text = isStandard
      ? `TikTok Shop Fee & Margin Summary (2026):
----------------------------------------
Sale Price:             $${salePrice.toFixed(2)}
Buyer Shipping:         $${shippingCharged.toFixed(2)}
Gross Revenue:          $${result.grossRevenue.toFixed(2)}
----------------------------------------
Category:               ${CATEGORY_NAMES[category] || category}
TikTok Total Fees:      $${result.totalFees.toFixed(2)}
Creator Affiliate Cut:  $${result.affiliateCommission.toFixed(2)} (${affiliatePct}%)
Product COGS:           $${cogs.toFixed(2)}
Carrier Postage:        $${shippingCost.toFixed(2)}
----------------------------------------
TikTok Bank Payout:     $${result.netPayout.toFixed(2)}
REAL NET PROFIT:        $${result.netProfit.toFixed(2)} (${result.netMarginPct.toFixed(1)}% margin)
Break-Even Floor Price: $${result.breakEvenPrice.toFixed(2)}
----------------------------------------
Calculated via CalcDial (https://calcdial.pages.dev/tools/tiktok-shop-fee-calculator)`
      : `TikTok Shop Target Price Finder (2026):
----------------------------------------
Target Margin:          ${targetMargin}%
Recommended Price:      $${recommendedPrice.toFixed(2)}
Estimated Net Profit:   $${reverseAnalysis.netProfit.toFixed(2)} (${reverseAnalysis.netMarginPct.toFixed(1)}% margin)
TikTok Bank Payout:     $${reverseAnalysis.netPayout.toFixed(2)}
Total Platform Fees:    $${reverseAnalysis.totalFees.toFixed(2)}
Total Direct Costs:     $${(cogs + shippingCost).toFixed(2)}
----------------------------------------
Calculated via CalcDial (https://calcdial.pages.dev/tools/tiktok-shop-fee-calculator)`;

    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  return (
    <div className="w-full">
      {/* Outer Calculator Shell — Flat, Clean, Zero Gradients */}
      <div className="rounded-2xl border border-zinc-200/90 bg-white p-4 sm:p-6 shadow-sm">
        {/* Top Control Bar: Mode Switcher & Reset */}
        <div className="flex flex-wrap items-center justify-between pb-4 mb-4 border-b border-zinc-100 gap-2">
          <div className="inline-flex rounded-lg bg-zinc-100 p-1 text-xs font-sans font-semibold">
            <button
              type="button"
              onClick={() => setMode("profit")}
              className={cn(
                "px-3.5 py-1.5 rounded-md transition-all cursor-pointer text-xs flex items-center gap-1.5",
                mode === "profit"
                  ? "bg-white text-zinc-950 font-bold shadow-2xs"
                  : "text-zinc-600 hover:text-zinc-950"
              )}
            >
              Standard Profit
            </button>
            <button
              type="button"
              onClick={() => setMode("target")}
              className={cn(
                "px-3.5 py-1.5 rounded-md transition-all cursor-pointer text-xs flex items-center gap-1.5",
                mode === "target"
                  ? "bg-white text-zinc-950 font-bold shadow-2xs"
                  : "text-zinc-600 hover:text-zinc-950"
              )}
            >
              Target Price Finder
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold text-zinc-500 bg-zinc-100 px-2.5 py-1 rounded-md">
              USD ($)
            </span>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
          {/* ========================================================= */}
          {/* LEFT CARD: Pricing & Product Cost Inputs                  */}
          {/* ========================================================= */}
          <div className="flex flex-col justify-between rounded-xl border border-zinc-200/90 bg-zinc-50/50 p-4 sm:p-5">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-200/70">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                  {mode === "profit" ? "Pricing & Direct Costs" : "Target Margin Goal"}
                </span>
                <button
                  type="button"
                  onClick={handleReset}
                  className="size-7 inline-flex items-center justify-center rounded-md text-zinc-400 hover:text-zinc-900 hover:bg-zinc-200/60 transition-colors cursor-pointer"
                  title="Reset to defaults"
                  aria-label="Reset to defaults"
                >
                  <RotateCcw className="size-3.5" />
                </button>
              </div>

              {mode === "profit" ? (
                <>
                  {/* 2-Column Row: Sale Price & Item Cost (1 col on mobile, 2 cols on sm+) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="tiktok-sale-price" className="text-xs font-bold text-zinc-900 block mb-1">
                        Sale Price
                      </label>
                      <div className="relative flex items-center min-h-10 rounded-lg border border-zinc-300 bg-white px-2.5 transition-all focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
                        <span className="text-xs font-mono font-bold text-zinc-500 select-none mr-1">$</span>
                        <input
                          id="tiktok-sale-price"
                          type="number"
                          inputMode="decimal"
                          min={0}
                          step="any"
                          value={priceStr}
                          onChange={(e) => setPriceStr(e.target.value)}
                          onBlur={() => {
                            const num = parseFloat(priceStr);
                            if (!isNaN(num) && num >= 0) setPriceStr(num.toFixed(2));
                            else if (!priceStr) setPriceStr("0.00");
                          }}
                          placeholder="0.00"
                          className="w-full bg-transparent font-mono font-bold text-sm text-zinc-950 focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="tiktok-cogs" className="text-xs font-bold text-zinc-900 block mb-1">
                        Item Cost (COGS)
                      </label>
                      <div className="relative flex items-center min-h-10 rounded-lg border border-zinc-300 bg-white px-2.5 transition-all focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
                        <span className="text-xs font-mono font-bold text-zinc-500 select-none mr-1">$</span>
                        <input
                          id="tiktok-cogs"
                          type="number"
                          inputMode="decimal"
                          min={0}
                          step="any"
                          value={cogsStr}
                          onChange={(e) => setCogsStr(e.target.value)}
                          onBlur={() => {
                            const num = parseFloat(cogsStr);
                            if (!isNaN(num) && num >= 0) setCogsStr(num.toFixed(2));
                            else if (!cogsStr) setCogsStr("0.00");
                          }}
                          placeholder="0.00"
                          className="w-full bg-transparent font-mono font-bold text-sm text-zinc-950 focus:outline-hidden"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Presets — Single line horizontal row without wrapping, NO redundant "Presets:" label */}
                  <div className="overflow-x-auto no-scrollbar py-0.5">
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                      {PRESETS.map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPriceStr(p.toFixed(2))}
                          className={cn(
                            "px-2.5 py-1 min-h-7 rounded-lg text-[11px] font-mono font-semibold transition-all cursor-pointer shrink-0",
                            salePrice === p
                              ? "bg-[#2b5cfd] text-white shadow-xs font-bold"
                              : "bg-white border border-zinc-200/90 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
                          )}
                        >
                          ${p}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2-Column Row: Shipping Charged & Carrier Postage (1 col on mobile, 2 cols on sm+) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label htmlFor="tiktok-shipping-charged" className="text-xs font-bold text-zinc-900 block mb-1">
                        Buyer Shipping Fee
                      </label>
                      <div className="relative flex items-center min-h-10 rounded-lg border border-zinc-300 bg-white px-2.5 transition-all focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
                        <span className="text-xs font-mono font-bold text-zinc-500 select-none mr-1">$</span>
                        <input
                          id="tiktok-shipping-charged"
                          type="number"
                          inputMode="decimal"
                          min={0}
                          step="any"
                          value={shippingChargedStr}
                          onChange={(e) => setShippingChargedStr(e.target.value)}
                          placeholder="0.00"
                          className="w-full bg-transparent font-mono font-bold text-sm text-zinc-950 focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="tiktok-shipping-cost" className="text-xs font-bold text-zinc-900 block mb-1">
                        Carrier Cost Paid
                      </label>
                      <div className="relative flex items-center min-h-10 rounded-lg border border-zinc-300 bg-white px-2.5 transition-all focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
                        <span className="text-xs font-mono font-bold text-zinc-500 select-none mr-1">$</span>
                        <input
                          id="tiktok-shipping-cost"
                          type="number"
                          inputMode="decimal"
                          min={0}
                          step="any"
                          value={shippingCostStr}
                          onChange={(e) => setShippingCostStr(e.target.value)}
                          placeholder="0.00"
                          className="w-full bg-transparent font-mono font-bold text-sm text-zinc-950 focus:outline-hidden"
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                /* Target Margin Mode */
                <div className="space-y-3">
                  <div className="rounded-lg border border-zinc-200/80 bg-white p-3 space-y-2">
                    <span className="text-xs font-bold text-zinc-900 block">Desired Net Margin Goal</span>
                    <div className="relative flex items-center min-h-10 rounded-lg border border-zinc-300 bg-white px-2.5 transition-all focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
                      <span className="text-xs font-mono font-bold text-zinc-500 select-none mr-1">%</span>
                      <input
                        type="number"
                        inputMode="decimal"
                        min={1}
                        max={95}
                        value={targetMarginStr}
                        onChange={(e) => setTargetMarginStr(e.target.value)}
                        placeholder="35"
                        className="w-full bg-transparent font-mono font-bold text-sm text-zinc-950 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  {/* 2-Column Row: Cost Inputs (1 col on mobile, 2 cols on sm+) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-zinc-900 block mb-1">Item Cost (COGS)</label>
                      <div className="relative flex items-center min-h-10 rounded-lg border border-zinc-300 bg-white px-2.5 transition-all focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
                        <span className="text-xs font-mono font-bold text-zinc-500 select-none mr-1">$</span>
                        <input
                          type="number"
                          value={cogsStr}
                          onChange={(e) => setCogsStr(e.target.value)}
                          className="w-full bg-transparent font-mono font-bold text-sm text-zinc-950 focus:outline-hidden"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-zinc-900 block mb-1">Carrier Postage</label>
                      <div className="relative flex items-center min-h-10 rounded-lg border border-zinc-300 bg-white px-2.5 transition-all focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
                        <span className="text-xs font-mono font-bold text-zinc-500 select-none mr-1">$</span>
                        <input
                          type="number"
                          value={shippingCostStr}
                          onChange={(e) => setShippingCostStr(e.target.value)}
                          className="w-full bg-transparent font-mono font-bold text-sm text-zinc-950 focus:outline-hidden"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Category Selector */}
              <div className="flex flex-col gap-1 pt-1">
                <label className="text-xs font-bold text-zinc-900">Product Category</label>
                <CustomSelect
                  value={category}
                  options={categoryOptions}
                  onChange={(val) => setCategory(val)}
                />
              </div>

              {/* Creator Affiliate Toggle Card */}
              <div className="rounded-lg border border-zinc-200/80 bg-white p-2.5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-xs font-bold text-zinc-900 block truncate">
                    Include Creator Affiliate Commission
                  </span>
                  <span className="text-[10px] text-zinc-500 font-sans block truncate">
                    TikTok Creator Marketplace cut
                  </span>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={includeAffiliate}
                  onClick={() => setIncludeAffiliate(!includeAffiliate)}
                  className={cn(
                    "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden",
                    includeAffiliate ? "bg-blue-600" : "bg-zinc-200"
                  )}
                >
                  <span
                    className={cn(
                      "pointer-events-none inline-block size-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out",
                      includeAffiliate ? "translate-x-4" : "translate-x-0"
                    )}
                  />
                </button>
              </div>

              {/* Affiliate % options if active */}
              {includeAffiliate && (
                <div className="flex items-center justify-between text-xs px-2.5 py-1.5 bg-white rounded-lg border border-zinc-200/70">
                  <span className="text-zinc-700 font-semibold">Affiliate Rate:</span>
                  <div className="flex items-center gap-1.5">
                    {AFFILIATE_PRESETS.map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => setAffiliatePctStr(pct.toString())}
                        className={cn(
                          "px-2 py-0.5 text-[11px] font-mono font-bold rounded cursor-pointer",
                          affiliatePct === pct
                            ? "bg-blue-600 text-white"
                            : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                        )}
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT CARD: Live Results Card                             */}
          {/* ========================================================= */}
          <div className="flex flex-col justify-between rounded-xl border border-zinc-200/90 bg-zinc-50/70 p-4 sm:p-5">
            {mode === "profit" ? (
              <div>
                <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-zinc-200/70">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    Net Take-Home
                  </span>
                  <span
                    className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold font-mono border",
                      result.netProfit >= 0
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200/70"
                        : "bg-rose-50 text-rose-700 border-rose-200/70"
                    )}
                  >
                    {result.netMarginPct.toFixed(1)}% margin
                  </span>
                </div>

                {/* Big Profit Hero Metric */}
                <div>
                  <div
                    className={cn(
                      "text-2xl sm:text-3xl lg:text-4xl font-extrabold font-mono tracking-tight",
                      result.netProfit >= 0 ? "text-emerald-600" : "text-rose-600"
                    )}
                  >
                    ${result.netProfit.toFixed(2)}
                  </div>
                  <span className="text-[11px] text-zinc-500 font-sans block mt-0.5">
                    Est. TikTok Shop payout: ${result.netPayout.toFixed(2)}
                  </span>
                </div>

                {/* 3-Color Segmented Ratio Bar */}
                <div className="mt-3.5 mb-3">
                  <div className="h-2 w-full rounded-full bg-zinc-200/80 overflow-hidden flex">
                    <div
                      style={{ width: `${profitWidth}%` }}
                      className="bg-emerald-500 h-full transition-all duration-300"
                      title="Net Profit"
                    />
                    <div
                      style={{ width: `${feesWidth}%` }}
                      className="bg-rose-500 h-full transition-all duration-300"
                      title="Platform Fees & Affiliate"
                    />
                    <div
                      style={{ width: `${costWidth}%` }}
                      className="bg-zinc-400 h-full transition-all duration-300"
                      title="Item Landed Cost & Shipping"
                    />
                  </div>

                  {/* Micro Legend */}
                  <div className="flex items-center justify-between text-[10px] text-zinc-500 mt-1.5 font-sans">
                    <span className="flex items-center gap-1 font-medium">
                      <span className="size-1.5 rounded-full bg-emerald-500" />
                      Profit ({result.netMarginPct.toFixed(0)}%)
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <span className="size-1.5 rounded-full bg-rose-500" />
                      Fees ({((result.totalFees / grossRev) * 100).toFixed(0)}%)
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <span className="size-1.5 rounded-full bg-zinc-400" />
                      Direct Costs
                    </span>
                  </div>
                </div>

                {/* Clean Tabular Line Item Breakdown */}
                <div className="space-y-1.5 text-xs font-sans py-2.5 border-t border-zinc-200/70">
                  <div className="flex justify-between text-zinc-600">
                    <span className="flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-zinc-400" />
                      Gross Revenue:
                    </span>
                    <span className="font-mono font-semibold text-zinc-900">
                      ${result.grossRevenue.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span className="flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-rose-500" />
                      TikTok Total Fees:
                    </span>
                    <span className="font-mono font-semibold text-rose-600">
                      -${result.totalFees.toFixed(2)}
                    </span>
                  </div>
                  {includeAffiliate && result.affiliateCommission > 0 && (
                    <div className="flex justify-between text-zinc-600">
                      <span className="flex items-center gap-1.5">
                        <span className="size-1.5 rounded-full bg-rose-400" />
                        Creator Commission ({affiliatePct}%):
                      </span>
                      <span className="font-mono font-semibold text-rose-600">
                        -${result.affiliateCommission.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-zinc-600">
                    <span className="flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-zinc-400" />
                      Break-Even Floor Price:
                    </span>
                    <span className="font-mono font-semibold text-zinc-900">
                      ${result.breakEvenPrice.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Collapsible Itemized Fee Details */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setShowItemized(!showItemized)}
                    className="w-full flex items-center justify-between py-1.5 text-[11px] font-semibold text-zinc-500 hover:text-zinc-950 transition-colors cursor-pointer border-t border-zinc-200/60"
                  >
                    <span>Itemized Fee Breakdown</span>
                    {showItemized ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
                  </button>

                  {showItemized && (
                    <div className="mt-1 divide-y divide-zinc-200/50 text-xs font-mono space-y-0.5 animate-in fade-in duration-150">
                      <div className="flex justify-between py-1 text-zinc-600">
                        <span>Referral Fee ({result.referralRatePct}%)</span>
                        <span className="font-semibold text-zinc-900">${result.referralFee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between py-1 text-zinc-600">
                        <span>Payment Processing</span>
                        <span className="font-semibold text-zinc-900">${result.paymentProcessingFee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between py-1 text-zinc-600">
                        <span>Product Landed Cost</span>
                        <span className="font-semibold text-zinc-900">${cogs.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between py-1 text-zinc-600">
                        <span>Carrier Postage</span>
                        <span className="font-semibold text-zinc-900">${shippingCost.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Reverse Target Margin Result */
              <div>
                <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-zinc-200/70">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
                    Recommended Retail Price
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold font-mono bg-blue-50 text-blue-700 border border-blue-200/70">
                    Target {reverseAnalysis.netMarginPct.toFixed(1)}% margin
                  </span>
                </div>

                <div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-mono tracking-tight text-blue-600">
                    ${recommendedPrice.toFixed(2)}
                  </div>
                  <span className="text-[11px] text-zinc-500 font-sans block mt-0.5">
                    Est. net profit: ${reverseAnalysis.netProfit.toFixed(2)}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs font-sans py-2.5 my-3 border-y border-zinc-200/70">
                  <div className="flex justify-between text-zinc-600">
                    <span>TikTok Platform Fees:</span>
                    <span className="font-mono font-semibold text-rose-600">-${reverseAnalysis.totalFees.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span>TikTok Deposit:</span>
                    <span className="font-mono font-semibold text-zinc-900">${reverseAnalysis.netPayout.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span>Total Direct Costs:</span>
                    <span className="font-mono font-semibold text-zinc-700">-${(cogs + shippingCost).toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setPriceStr(recommendedPrice.toFixed(2));
                    setMode("profit");
                  }}
                  className="w-full py-2 px-3 min-h-10 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-xs font-bold font-sans flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <span>Apply ${recommendedPrice.toFixed(2)} to Standard View</span>
                  <ArrowRight className="size-3.5" />
                </button>
              </div>
            )}

            {/* Pixel Button Action for Copy Summary */}
            <div className="mt-4 pt-3 border-t border-zinc-200/70">
              <PixelButton
                type="button"
                onClick={handleCopySummary}
                className="w-full h-10 px-4 text-xs font-semibold font-sans justify-center"
              >
                {copiedSummary ? (
                  <span className="flex items-center gap-1.5 text-emerald-200">
                    <Check className="size-4 text-emerald-300" />
                    Summary Copied to Clipboard!
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <Copy className="size-3.5" />
                    Copy Calculation Breakdown
                  </span>
                )}
              </PixelButton>
            </div>
          </div>
        </div>
      </div>

      {/* Persistent Mobile Bottom Bar */}
      {!isEmbed && (
        <StickyResultBar
          label={mode === "profit" ? "Net Profit" : "Target Price"}
          value={mode === "profit" ? result.netProfit : recommendedPrice}
          subLabel={mode === "profit" ? "Margin" : "Est. Profit"}
          subValue={mode === "profit" ? result.netMarginPct : undefined}
          productCost={cogs + shippingCost}
          totalFees={mode === "profit" ? result.totalFees : reverseAnalysis.totalFees}
        />
      )}
    </div>
  );
}
