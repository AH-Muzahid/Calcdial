"use client";

import { useState, useMemo, useEffect } from "react";
import { calculateTikTokFees } from "@/lib/formulas/tiktok-fees";
import { TIKTOK_CATEGORY_PRESETS } from "@/data/fee-presets";
import { CustomSelect, CustomSelectOption } from "@/components/common/CustomSelect";
import { StickyResultBar } from "./StickyResultBar";
import { ShareButton } from "@/components/layout/ShareButton";
import { PrintButton } from "@/components/layout/PrintButton";
import { EmbedModal } from "@/components/layout/EmbedModal";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import {
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  DollarSign,
  Percent,
  TrendingUp,
  ShieldAlert,
} from "lucide-react";

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

const AFFILIATE_PRESETS = [0, 10, 15, 20];
const TARGET_MARGIN_PRESETS = [20, 30, 35, 50];

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
  // Mode Switcher: "profit" (Standard Profit) vs "target" (Target Margin)
  const [mode, setMode] = useState<"profit" | "target">("profit");

  // Input states as strings for clean numeric editing
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
  const [affiliatePctStr, setAffiliatePctStr] = useState<string>("10");
  const [targetMarginStr, setTargetMarginStr] = useState<string>("35");

  // Accordion & Copy states
  const [showItemized, setShowItemized] = useState<boolean>(false);
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);

  // Parse numeric values safely
  const salePrice = Math.max(0, parseFloat(priceStr) || 0);
  const shippingCharged = Math.max(0, parseFloat(shippingChargedStr) || 0);
  const cogs = Math.max(0, parseFloat(cogsStr) || 0);
  const shippingCost = Math.max(0, parseFloat(shippingCostStr) || 0);
  const affiliatePct = Math.max(0, parseFloat(affiliatePctStr) || 0);
  const targetMargin = Math.max(0, parseFloat(targetMarginStr) || 0);

  // Core calculations
  const result = useMemo(() => {
    return calculateTikTokFees({
      salePrice,
      shippingCharged,
      category,
      creatorAffiliatePct: affiliatePct,
      cogs,
      shippingCost,
      targetMarginPct: mode === "target" ? targetMargin : undefined,
    });
  }, [salePrice, shippingCharged, category, affiliatePct, cogs, shippingCost, mode, targetMargin]);

  // Target Margin Price recommendation
  const targetPrice = result.targetPriceForMargin ?? result.breakEvenPrice;

  // Analysis result when selling at the recommended targetPrice
  const targetResult = useMemo(() => {
    return calculateTikTokFees({
      salePrice: targetPrice,
      shippingCharged,
      category,
      creatorAffiliatePct: affiliatePct,
      cogs,
      shippingCost,
    });
  }, [targetPrice, shippingCharged, category, affiliatePct, cogs, shippingCost]);

  // The active result shown on the dashboard depending on mode
  const activeRes = mode === "profit" ? result : targetResult;

  // Analytics event tracking
  useEffect(() => {
    const timer = setTimeout(() => {
      trackEvent({
        name: "calculator_used",
        params: {
          tool_slug: "tiktok-shop-fee-calculator",
          preset: `${category}-${affiliatePct}%`,
        },
      });
    }, 1500);
    return () => clearTimeout(timer);
  }, [salePrice, category, affiliatePct, cogs, mode]);

  const handleReset = () => {
    setPriceStr("30.00");
    setShippingChargedStr("0.00");
    setCogsStr("8.50");
    setShippingCostStr("4.00");
    setCategory(initialCategory.toLowerCase());
    setAffiliatePctStr("10");
    setTargetMarginStr("35");
    setMode("profit");
  };

  // Visual Breakdown Progress Bar Percentages
  const grossRev = activeRes.grossRevenue > 0 ? activeRes.grossRevenue : Math.max(0.01, activeRes.totalDeductions);
  const cogsShare = Math.min(100, Math.max(0, (activeRes.cogs / grossRev) * 100));
  const shippingShare = Math.min(100, Math.max(0, (activeRes.shippingCost / grossRev) * 100));
  const referralShare = Math.min(100, Math.max(0, (activeRes.referralFee / grossRev) * 100));
  const processingFeeShare = Math.min(100, Math.max(0, (activeRes.paymentProcessingFee / grossRev) * 100));
  const affiliateShare = Math.min(100, Math.max(0, (activeRes.affiliateCommission / grossRev) * 100));
  const profitShare = Math.max(0, Math.min(100, (activeRes.netProfit / grossRev) * 100));

  const getFormattedSummary = () => {
    const isProfitMode = mode === "profit";
    const active = isProfitMode ? result : targetResult;
    const priceDisplay = isProfitMode ? salePrice : targetPrice;

    return isProfitMode
      ? `TikTok Shop Net Profit & Fee Architecture (2026)
----------------------------------------
Category:            ${category.toUpperCase()} (${active.referralRatePct}% fee)
Item Selling Price:  $${priceDisplay.toFixed(2)}
Shipping Charged:    $${shippingCharged.toFixed(2)}
Creator Affiliate:   ${affiliatePct}% ($${active.affiliateCommission.toFixed(2)})
Payment Processing:  $${active.paymentProcessingFee.toFixed(2)} (1.8% + $0.30)
Landed Cost (COGS):  $${cogs.toFixed(2)}
Fulfillment Postage: $${shippingCost.toFixed(2)}
----------------------------------------
Gross Revenue:       $${active.grossRevenue.toFixed(2)}
Total TikTok & Cuts: $${active.totalFees.toFixed(2)}
TikTok Bank Deposit: $${active.netPayout.toFixed(2)}
Total Product Costs: $${active.totalProductCosts.toFixed(2)}
----------------------------------------
REAL NET PROFIT:     $${active.netProfit.toFixed(2)} (${active.netMarginPct}% margin)
Break-Even Price:    $${active.breakEvenPrice.toFixed(2)}
----------------------------------------
Calculated on CalcDial: ${typeof window !== "undefined" ? window.location.href : "https://calcdial.pages.dev/tools/tiktok-shop-fee-calculator"}`
      : `TikTok Shop Target Price Finder (2026)
----------------------------------------
Category:            ${category.toUpperCase()} (${active.referralRatePct}% fee)
Target Net Margin:   ${targetMargin}%
Recommended Price:   $${targetPrice.toFixed(2)}
Shipping Charged:    $${shippingCharged.toFixed(2)}
Creator Affiliate:   ${affiliatePct}% ($${active.affiliateCommission.toFixed(2)})
Payment Processing:  $${active.paymentProcessingFee.toFixed(2)} (1.8% + $0.30)
Landed Cost (COGS):  $${cogs.toFixed(2)}
Fulfillment Postage: $${shippingCost.toFixed(2)}
----------------------------------------
Estimated Net Profit:$${active.netProfit.toFixed(2)} (${active.netMarginPct}% margin)
TikTok Bank Deposit: $${active.netPayout.toFixed(2)}
Total Deductions:    $${active.totalDeductions.toFixed(2)}
Break-Even Floor:    $${active.breakEvenPrice.toFixed(2)}
----------------------------------------
Calculated on CalcDial: ${typeof window !== "undefined" ? window.location.href : "https://calcdial.pages.dev/tools/tiktok-shop-fee-calculator"}`;
  };

  const handleCopySummary = () => {
    navigator.clipboard.writeText(getFormattedSummary());
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  return (
    <div>
      {/* 2-Column Responsive Layout: Left Input Card, Right Results Card */}
      <div className="grid grid-cols-1 gap-4 lg:gap-5 lg:grid-cols-12 items-start">
        {/* ========================================================= */}
        {/* LEFT CARD: Interactive Input Controls                     */}
        {/* ========================================================= */}
        <div className="lg:col-span-7 rounded-xl sm:rounded-2xl border border-zinc-200/90 bg-white p-3.5 sm:p-5 shadow-xs space-y-4">
          {/* Header & Mode Switcher */}
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100 gap-2">
            {/* Segmented Pill Tab Switcher */}
            <div className="inline-flex rounded-lg bg-zinc-100 p-0.5 text-xs font-sans">
              <button
                type="button"
                onClick={() => setMode("profit")}
                className={cn(
                  "min-h-11 px-3.5 py-2 rounded-md font-semibold transition-all cursor-pointer text-xs whitespace-nowrap flex items-center justify-center",
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
                  "min-h-11 px-3.5 py-2 rounded-md font-semibold transition-all cursor-pointer text-xs whitespace-nowrap flex items-center justify-center",
                  mode === "target"
                    ? "bg-white text-zinc-950 font-bold shadow-2xs"
                    : "text-zinc-600 hover:text-zinc-950"
                )}
              >
                Target Margin
              </button>
            </div>

            {/* Reset Button */}
            <button
              type="button"
              onClick={handleReset}
              className="min-h-11 min-w-11 px-2.5 inline-flex items-center justify-center gap-1 text-xs font-sans font-medium text-zinc-500 hover:text-zinc-950 transition-colors cursor-pointer rounded-lg hover:bg-zinc-100"
              title="Reset values to defaults"
              aria-label="Reset values to defaults"
            >
              <RotateCcw className="size-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* Product Category Preset Selector */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-zinc-950">
                Product Category
              </label>
              <span className="text-[10px] text-zinc-400 font-sans">
                TikTok Shop 2026 category referral fee
              </span>
            </div>
            <CustomSelect
              value={category}
              options={categoryOptions}
              onChange={(val) => setCategory(val)}
            />
          </div>

          {/* ========================================================= */}
          {/* SECTION 1: Item Pricing & Customer Shipping / Target Goal */}
          {/* ========================================================= */}
          {mode === "profit" ? (
            <div className="space-y-3 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Item Selling Price */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <label htmlFor="tiktok-sale-price" className="text-[11px] font-bold text-zinc-950 cursor-pointer">
                      Item Selling Price <span className="text-rose-600">*</span>
                    </label>
                    <span className="text-[10px] text-zinc-400 font-sans">
                      Retail price
                    </span>
                  </div>
                  <div className="relative flex items-center rounded-lg border border-zinc-300 bg-white min-h-11 transition-all hover:border-zinc-400 focus-within:border-zinc-950 focus-within:ring-1 focus-within:ring-zinc-950">
                    <span className="pl-3 pr-1 text-xs sm:text-sm font-mono font-bold text-zinc-600 select-none">
                      $
                    </span>
                    <input
                      id="tiktok-sale-price"
                      name="salePrice"
                      aria-label="Item Selling Price"
                      type="number"
                      inputMode="decimal"
                      min={0}
                      step="any"
                      value={priceStr}
                      onChange={(e) => setPriceStr(e.target.value)}
                      onFocus={(e) => {
                        if (e.target.value === "0.00" || e.target.value === "0") {
                          e.target.select();
                        }
                      }}
                      onBlur={() => {
                        const num = parseFloat(priceStr);
                        if (!isNaN(num) && num >= 0) setPriceStr(num.toFixed(2));
                        else if (!priceStr) setPriceStr("0.00");
                      }}
                      placeholder="0.00"
                      className="h-11 min-h-11 w-full rounded-lg bg-transparent px-2 text-xs sm:text-sm font-mono font-bold text-zinc-950 placeholder-zinc-400 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Shipping Charged to Buyer */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <label htmlFor="tiktok-shipping-charged" className="text-[11px] font-bold text-zinc-950 cursor-pointer">
                      Shipping Charged
                    </label>
                    <span className="text-[10px] text-zinc-400 font-sans">
                      Leave 0 for Free Shipping
                    </span>
                  </div>
                  <div className="relative flex items-center rounded-lg border border-zinc-300 bg-white min-h-11 transition-all hover:border-zinc-400 focus-within:border-zinc-950 focus-within:ring-1 focus-within:ring-zinc-950">
                    <span className="pl-3 pr-1 text-xs sm:text-sm font-mono font-bold text-zinc-600 select-none">
                      $
                    </span>
                    <input
                      id="tiktok-shipping-charged"
                      name="shippingCharged"
                      aria-label="Shipping Charged to Buyer"
                      type="number"
                      inputMode="decimal"
                      min={0}
                      step="any"
                      value={shippingChargedStr}
                      onChange={(e) => setShippingChargedStr(e.target.value)}
                      onFocus={(e) => {
                        if (e.target.value === "0.00" || e.target.value === "0") {
                          e.target.select();
                        }
                      }}
                      onBlur={() => {
                        const num = parseFloat(shippingChargedStr);
                        if (!isNaN(num) && num >= 0) setShippingChargedStr(num.toFixed(2));
                        else if (!shippingChargedStr) setShippingChargedStr("0.00");
                      }}
                      placeholder="0.00"
                      className="h-11 min-h-11 w-full rounded-lg bg-transparent px-2 text-xs sm:text-sm font-mono font-bold text-zinc-950 placeholder-zinc-400 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* TARGET MARGIN PRICING INPUTS */
            <div className="space-y-3 pt-1">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <label htmlFor="tiktok-target-margin" className="text-[11px] font-bold text-zinc-950 block cursor-pointer">
                      Target Net Margin % <span className="text-rose-600">*</span>
                    </label>
                    <span className="text-[10px] text-zinc-400 font-sans block">
                      Target margin after fees, affiliate cut &amp; postage
                    </span>
                  </div>

                  {/* Preset Pills for Target Margin */}
                  <div className="inline-flex shrink-0 rounded-lg bg-zinc-100 p-0.5 text-xs font-semibold">
                    {TARGET_MARGIN_PRESETS.map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setTargetMarginStr(m.toString())}
                        className={cn(
                          "min-h-9 px-2.5 py-1 rounded-md transition-all cursor-pointer whitespace-nowrap text-xs flex items-center justify-center",
                          parseFloat(targetMarginStr) === m
                            ? "bg-blue-600 text-white font-bold shadow-2xs"
                            : "text-zinc-600 hover:text-zinc-950"
                        )}
                      >
                        {m}%
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative flex items-center rounded-lg border border-zinc-300 bg-white min-h-11 transition-all hover:border-zinc-400 focus-within:border-zinc-950 focus-within:ring-1 focus-within:ring-zinc-950">
                  <span className="pl-3 pr-1 text-xs sm:text-sm font-mono font-bold text-zinc-600 select-none">
                    %
                  </span>
                  <input
                    id="tiktok-target-margin"
                    name="targetMargin"
                    aria-label="Target Net Margin %"
                    type="number"
                    inputMode="decimal"
                    min={1}
                    max={80}
                    step="any"
                    value={targetMarginStr}
                    onChange={(e) => setTargetMarginStr(e.target.value)}
                    onFocus={(e) => e.target.select()}
                    placeholder="35"
                    className="h-11 min-h-11 w-full rounded-lg bg-transparent px-2 text-xs sm:text-sm font-mono font-bold text-zinc-950 placeholder-zinc-400 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Shipping Charged to Buyer (Target mode) */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <label htmlFor="tiktok-target-shipping-charged" className="text-[11px] font-bold text-zinc-950 cursor-pointer">
                    Shipping Charged to Buyer
                  </label>
                  <span className="text-[10px] text-zinc-400 font-sans">
                    Leave 0 if offering Free Shipping
                  </span>
                </div>
                <div className="relative flex items-center rounded-lg border border-zinc-300 bg-white min-h-11 transition-all hover:border-zinc-400 focus-within:border-zinc-950 focus-within:ring-1 focus-within:ring-zinc-950">
                  <span className="pl-3 pr-1 text-xs sm:text-sm font-mono font-bold text-zinc-600 select-none">
                    $
                  </span>
                  <input
                    id="tiktok-target-shipping-charged"
                    name="targetShippingCharged"
                    aria-label="Shipping Charged to Buyer"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step="any"
                    value={shippingChargedStr}
                    onChange={(e) => setShippingChargedStr(e.target.value)}
                    placeholder="0.00"
                    className="h-11 min-h-11 w-full rounded-lg bg-transparent px-2 text-xs sm:text-sm font-mono font-bold text-zinc-950 placeholder-zinc-400 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* SECTION 2: Landed Unit Costs (COGS & Postage)             */}
          {/* ========================================================= */}
          <div className="pt-2 border-t border-zinc-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Product Cost / COGS */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <label htmlFor="tiktok-cogs" className="text-[11px] font-bold text-zinc-950 cursor-pointer">
                    Item Cost (COGS)
                  </label>
                  <span className="text-[10px] text-zinc-400 font-sans">
                    Landed manufacturing/unit cost
                  </span>
                </div>
                <div className="relative flex items-center rounded-lg border border-zinc-300 bg-white min-h-11 transition-all hover:border-zinc-400 focus-within:border-zinc-950 focus-within:ring-1 focus-within:ring-zinc-950">
                  <span className="pl-3 pr-1 text-xs sm:text-sm font-mono font-bold text-zinc-600 select-none">
                    $
                  </span>
                  <input
                    id="tiktok-cogs"
                    name="cogs"
                    aria-label="Item Cost (COGS)"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step="any"
                    value={cogsStr}
                    onChange={(e) => setCogsStr(e.target.value)}
                    onFocus={(e) => {
                      if (e.target.value === "0.00" || e.target.value === "0") {
                        e.target.select();
                      }
                    }}
                    onBlur={() => {
                      const num = parseFloat(cogsStr);
                      if (!isNaN(num) && num >= 0) setCogsStr(num.toFixed(2));
                      else if (!cogsStr) setCogsStr("0.00");
                    }}
                    placeholder="0.00"
                    className="h-11 min-h-11 w-full rounded-lg bg-transparent px-2 text-xs sm:text-sm font-mono font-bold text-zinc-950 placeholder-zinc-400 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Fulfillment Postage */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <label htmlFor="tiktok-shipping-cost" className="text-[11px] font-bold text-zinc-950 cursor-pointer">
                    Fulfillment Postage
                  </label>
                  <span className="text-[10px] text-zinc-400 font-sans">
                    Carrier shipping label &amp; box
                  </span>
                </div>
                <div className="relative flex items-center rounded-lg border border-zinc-300 bg-white min-h-11 transition-all hover:border-zinc-400 focus-within:border-zinc-950 focus-within:ring-1 focus-within:ring-zinc-950">
                  <span className="pl-3 pr-1 text-xs sm:text-sm font-mono font-bold text-zinc-600 select-none">
                    $
                  </span>
                  <input
                    id="tiktok-shipping-cost"
                    name="shippingCost"
                    aria-label="Fulfillment Postage"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step="any"
                    value={shippingCostStr}
                    onChange={(e) => setShippingCostStr(e.target.value)}
                    onFocus={(e) => {
                      if (e.target.value === "0.00" || e.target.value === "0") {
                        e.target.select();
                      }
                    }}
                    onBlur={() => {
                      const num = parseFloat(shippingCostStr);
                      if (!isNaN(num) && num >= 0) setShippingCostStr(num.toFixed(2));
                      else if (!shippingCostStr) setShippingCostStr("0.00");
                    }}
                    placeholder="0.00"
                    className="h-11 min-h-11 w-full rounded-lg bg-transparent px-2 text-xs sm:text-sm font-mono font-bold text-zinc-950 placeholder-zinc-400 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* SECTION 3: Creator Affiliate Commission                   */}
          {/* ========================================================= */}
          <div className="pt-2 border-t border-zinc-100 space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="tiktok-affiliate-pct" className="text-[11px] font-bold text-zinc-950 cursor-pointer">
                Creator Affiliate Commission %
              </label>
              <span className="text-[10px] text-zinc-400 font-sans">
                TikTok Creator Marketplace commission rate
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Segmented Pill Selector for Standard Affiliate Tiers */}
              <div className="inline-flex rounded-lg bg-zinc-100 p-0.5 text-xs font-semibold shrink-0">
                {AFFILIATE_PRESETS.map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => setAffiliatePctStr(rate.toString())}
                    className={cn(
                      "min-h-9 px-2.5 py-1 rounded-md transition-all cursor-pointer whitespace-nowrap text-xs flex items-center justify-center",
                      parseFloat(affiliatePctStr) === rate
                        ? "bg-blue-600 text-white font-bold shadow-2xs"
                        : "text-zinc-600 hover:text-zinc-950"
                    )}
                  >
                    {rate}%
                  </button>
                ))}
              </div>

              {/* Custom Percentage Input */}
              <div className="relative flex items-center rounded-lg border border-zinc-300 bg-white min-h-11 transition-all hover:border-zinc-400 focus-within:border-zinc-950 focus-within:ring-1 focus-within:ring-zinc-950 flex-1">
                <input
                  id="tiktok-affiliate-pct"
                  name="affiliatePct"
                  aria-label="Creator Affiliate Commission %"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  max={60}
                  step="any"
                  value={affiliatePctStr}
                  onChange={(e) => setAffiliatePctStr(e.target.value)}
                  onFocus={(e) => e.target.select()}
                  placeholder="10"
                  className="h-11 min-h-11 w-full rounded-lg bg-transparent px-2.5 text-xs sm:text-sm font-mono font-bold text-zinc-950 placeholder-zinc-400 focus:outline-hidden"
                />
                <span className="pr-3 text-xs sm:text-sm font-mono font-bold text-zinc-500 select-none">
                  %
                </span>
              </div>
            </div>
            <p className="text-[10px] text-zinc-500 font-sans leading-relaxed">
              Applied strictly to the item selling price (excluding buyer shipping and sales tax). Benchmark for viral conversion: 10% – 15%.
            </p>
          </div>

          {/* Utility Action Buttons */}
          {!isEmbed && (
            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-zinc-100">
              <ShareButton
                toolSlug="tiktok-shop-fee-calculator"
                getFormattedText={getFormattedSummary}
              />
              <div className="flex items-center gap-1.5">
                <PrintButton toolSlug="tiktok-shop-fee-calculator" />
                <EmbedModal
                  toolSlug="tiktok-shop-fee-calculator"
                  title="TikTok Shop Fee Calculator"
                />
              </div>
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* RIGHT CARD: Results (Standalone Hero Card, sticky desktop)*/}
        {/* ========================================================= */}
        <div className="hidden lg:block lg:col-span-5 rounded-xl sm:rounded-2xl border border-zinc-200/90 bg-white p-4 sm:p-5 shadow-xs lg:sticky lg:top-20 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 border-b border-zinc-100">
            <h3 className="text-sm sm:text-base font-bold tracking-tight text-zinc-950">
              {mode === "profit" ? "Profit Analysis" : "Target Price Analysis"}
            </h3>
            <button
              type="button"
              onClick={handleCopySummary}
              className="inline-flex items-center gap-1 text-[11px] font-sans font-bold text-zinc-700 hover:text-zinc-950 transition-colors cursor-pointer"
              title="Copy Summary"
            >
              {copiedSummary ? (
                <>
                  <Check className="size-3 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="size-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {mode === "profit" ? (
            /* ========================================================= */
            /* STANDARD RESULTS VIEW                                     */
            /* ========================================================= */
            <div className="space-y-4">
              {/* Primary Hero: Net Profit */}
              <div className="py-2 border-b border-zinc-100">
                <div className="flex items-baseline justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span
                        className={`block text-xs font-bold tracking-tight ${
                          result.netProfit > 0
                            ? "text-emerald-700"
                            : result.netProfit < 0
                            ? "text-rose-700"
                            : "text-zinc-600"
                        }`}
                      >
                        Net Profit
                      </span>
                      {result.netProfit < 0 && (
                        <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-extrabold text-rose-700 uppercase tracking-wider">
                          Loss
                        </span>
                      )}
                    </div>
                    <div
                      className={`text-2xl sm:text-3xl lg:text-3xl xl:text-4xl font-extrabold font-mono tracking-tight truncate ${
                        result.netProfit > 0
                          ? "text-emerald-600"
                          : result.netProfit < 0
                          ? "text-rose-600 font-extrabold"
                          : "text-zinc-950"
                      }`}
                      title={`$${formatAmount(result.netProfit)}`}
                    >
                      ${formatAmount(result.netProfit)}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="block text-xs font-semibold text-zinc-600 mb-0.5 tracking-tight">
                      Profit Margin
                    </span>
                    <span
                      className={cn(
                        "inline-block px-2 py-0.5 rounded-full text-xs font-bold font-mono",
                        result.netMarginPct > 0
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                          : result.netMarginPct < 0
                          ? "bg-rose-50 text-rose-700 border border-rose-200/60"
                          : "bg-zinc-100 text-zinc-700 border border-zinc-200"
                      )}
                    >
                      {result.netMarginPct.toFixed(1)}% margin
                    </span>
                  </div>
                </div>

                {/* Subtitle Row: TikTok Bank Payout & ROI */}
                <div className="mt-3 flex items-center justify-between text-xs pt-1 border-t border-zinc-100/70 font-sans">
                  <div>
                    <span className="text-zinc-500 font-medium">TikTok Bank Payout: </span>
                    <span className="font-mono font-bold text-zinc-950">
                      ${formatAmount(result.netPayout)}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 font-medium">ROI: </span>
                    <span className="font-mono font-bold text-zinc-950">
                      {result.roiPct.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* 2x2 Key Financial Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 py-1 border-b border-zinc-100">
                {/* TikTok Bank Deposit */}
                <div className="rounded-lg bg-zinc-50/80 border border-zinc-200/70 p-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-zinc-600 block">
                      TikTok Bank Deposit
                    </span>
                    <DollarSign className="size-3 text-emerald-600" />
                  </div>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-lg font-mono font-extrabold text-zinc-950 truncate" title={`$${formatAmount(result.netPayout)}`}>
                      ${formatAmount(result.netPayout)}
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-sans leading-none block mt-0.5">
                    Settlement transfer
                  </span>
                </div>

                {/* Effective Platform Fee % */}
                <div className="rounded-lg bg-zinc-50/80 border border-zinc-200/70 p-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-zinc-600 block">
                      Effective Fee %
                    </span>
                    <Percent className="size-3 text-amber-600" />
                  </div>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-lg font-mono font-extrabold text-amber-600">
                      {result.effectiveFeePct.toFixed(1)}%
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-sans leading-none block mt-0.5">
                    Referral + proc. + creator
                  </span>
                </div>

                {/* Break-Even Retail */}
                <div className="rounded-lg bg-zinc-50/80 border border-zinc-200/70 p-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-zinc-600 block">
                      Break-Even Retail
                    </span>
                    <TrendingUp className="size-3 text-blue-600" />
                  </div>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-lg font-mono font-extrabold text-zinc-950 truncate" title={`$${formatAmount(result.breakEvenPrice)}`}>
                      ${formatAmount(result.breakEvenPrice)}
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-sans leading-none block mt-0.5">
                    Zero-profit price floor
                  </span>
                </div>

                {/* Total Deductions */}
                <div className="rounded-lg bg-zinc-50/80 border border-zinc-200/70 p-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-zinc-600 block">
                      Total Deductions
                    </span>
                    <ShieldAlert className="size-3 text-rose-500" />
                  </div>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-lg font-mono font-extrabold text-rose-600 truncate" title={`$${formatAmount(result.totalDeductions)}`}>
                      ${formatAmount(result.totalDeductions)}
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-sans leading-none block mt-0.5">
                    All fees + COGS + shipping
                  </span>
                </div>
              </div>

              {/* Progress Breakdown Bar */}
              <div className="py-2 border-b border-zinc-200">
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-200 flex gap-0.5 shadow-inner">
                  {cogsShare > 0 && (
                    <div
                      style={{ width: `${cogsShare}%` }}
                      className="bg-blue-600 rounded-l-full transition-all duration-300"
                      title={`Product COGS: ${cogsShare.toFixed(1)}%`}
                    />
                  )}
                  {shippingShare > 0 && (
                    <div
                      style={{ width: `${shippingShare}%` }}
                      className="bg-indigo-500 transition-all duration-300"
                      title={`Carrier Shipping: ${shippingShare.toFixed(1)}%`}
                    />
                  )}
                  {referralShare > 0 && (
                    <div
                      style={{ width: `${referralShare}%` }}
                      className="bg-amber-500 transition-all duration-300"
                      title={`Category Referral Fee: ${referralShare.toFixed(1)}%`}
                    />
                  )}
                  {processingFeeShare > 0 && (
                    <div
                      style={{ width: `${processingFeeShare}%` }}
                      className="bg-orange-400 transition-all duration-300"
                      title={`Payment Processing: ${processingFeeShare.toFixed(1)}%`}
                    />
                  )}
                  {affiliateShare > 0 && (
                    <div
                      style={{ width: `${affiliateShare}%` }}
                      className="bg-purple-500 transition-all duration-300"
                      title={`Creator Affiliate: ${affiliateShare.toFixed(1)}%`}
                    />
                  )}
                  {profitShare > 0 && (
                    <div
                      style={{ width: `${profitShare}%` }}
                      className="bg-emerald-600 rounded-r-full transition-all duration-300"
                      title={`Net Profit: ${profitShare.toFixed(1)}%`}
                    />
                  )}
                </div>

                {/* Legend Rows with Percentages */}
                <div className="mt-2.5 space-y-1.5 text-xs font-sans">
                  {/* COGS */}
                  <div className="flex items-center justify-between py-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-blue-600 shrink-0" />
                      <span className="text-zinc-800 font-medium">Cost of Goods (COGS)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-zinc-950">
                        ${formatAmount(cogs)}
                      </span>
                      <span className="font-mono text-zinc-500 font-semibold w-11 text-right text-[11px]">
                        {cogsShare.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {/* Fulfillment Postage */}
                  {shippingCost > 0 && (
                    <div className="flex items-center justify-between py-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="size-2 rounded-full bg-indigo-500 shrink-0" />
                        <span className="text-zinc-800 font-medium">Fulfillment Postage</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-zinc-950">
                          ${formatAmount(shippingCost)}
                        </span>
                        <span className="font-mono text-zinc-500 font-semibold w-11 text-right text-[11px]">
                          {shippingShare.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Category Referral */}
                  <div className="flex items-center justify-between py-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-amber-500 shrink-0" />
                      <span className="text-zinc-800 font-medium">Category Referral ({result.referralRatePct}%)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-zinc-950">
                        ${formatAmount(result.referralFee)}
                      </span>
                      <span className="font-mono text-zinc-500 font-semibold w-11 text-right text-[11px]">
                        {referralShare.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {/* Payment Processing Fee (1.8% + $0.30) */}
                  {result.paymentProcessingFee > 0 && (
                    <div className="flex items-center justify-between py-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="size-2 rounded-full bg-orange-400 shrink-0" />
                        <span className="text-zinc-800 font-medium">Processing Fee (1.8% + $0.30)</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-zinc-950">
                          ${formatAmount(result.paymentProcessingFee)}
                        </span>
                        <span className="font-mono text-zinc-500 font-semibold w-11 text-right text-[11px]">
                          {processingFeeShare.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Affiliate Commission */}
                  {result.affiliateCommission > 0 && (
                    <div className="flex items-center justify-between py-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="size-2 rounded-full bg-purple-500 shrink-0" />
                        <span className="text-zinc-800 font-medium">Creator Affiliate ({affiliatePct}%)</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-zinc-950">
                          ${formatAmount(result.affiliateCommission)}
                        </span>
                        <span className="font-mono text-zinc-500 font-semibold w-11 text-right text-[11px]">
                          {affiliateShare.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Net Profit */}
                  <div className="flex items-center justify-between py-0.5 pt-1.5 border-t border-zinc-100">
                    <div className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-emerald-600 shrink-0" />
                      <span className="text-zinc-950 font-bold">Real Net Profit</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={cn("font-mono font-bold", result.netProfit < 0 ? "text-rose-600" : "text-emerald-600")}>
                        ${formatAmount(result.netProfit)}
                      </span>
                      <span className={cn("font-mono font-bold w-11 text-right text-[11px]", result.netProfit < 0 ? "text-rose-600" : "text-emerald-600")}>
                        {profitShare.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Itemized Platform Deductions Accordion */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowItemized(!showItemized)}
                  className="w-full flex items-center justify-between py-1.5 text-[11px] font-semibold text-zinc-500 hover:text-zinc-950 transition-colors cursor-pointer border-t border-zinc-100"
                >
                  <span>Itemized Platform Deductions</span>
                  {showItemized ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
                </button>

                {showItemized && (
                  <div className="mt-1 divide-y divide-zinc-100 text-xs font-mono space-y-0.5 animate-in fade-in duration-150">
                    <div className="flex justify-between py-1 text-zinc-600">
                      <span>Category Referral Fee ({result.referralRatePct}%)</span>
                      <span className="font-semibold text-zinc-900">${formatAmount(result.referralFee)}</span>
                    </div>
                    <div className="flex justify-between py-1 text-zinc-600">
                      <span>Payment Processing (1.8% + $0.30)</span>
                      <span className="font-semibold text-zinc-900">${formatAmount(result.paymentProcessingFee)}</span>
                    </div>
                    {result.affiliateCommission > 0 && (
                      <div className="flex justify-between py-1 text-zinc-600">
                        <span>Creator Affiliate ({affiliatePct}%)</span>
                        <span className="font-semibold text-zinc-900">${formatAmount(result.affiliateCommission)}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-1 text-zinc-600 font-semibold border-t border-zinc-200 pt-1">
                      <span className="text-zinc-900">Total TikTok &amp; Creator Deductions</span>
                      <span className="text-zinc-950 font-bold">${formatAmount(result.totalFees)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* ========================================================= */
            /* TARGET MARGIN RESULTS VIEW                                */
            /* ========================================================= */
            <div className="space-y-4">
              {/* Hero: Recommended Retail Price */}
              <div className="py-2 border-b border-zinc-100">
                <div className="flex items-baseline justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <span className="block text-xs font-bold text-blue-700 mb-0.5 tracking-tight">
                      Recommended Selling Price
                    </span>
                    <div
                      className="text-2xl sm:text-3xl lg:text-3xl xl:text-4xl font-extrabold font-mono tracking-tight text-blue-600 truncate"
                      title={`$${formatAmount(targetPrice)}`}
                    >
                      ${formatAmount(targetPrice)}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="block text-xs font-semibold text-zinc-600 mb-0.5 tracking-tight">
                      Target Goal
                    </span>
                    <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold font-mono bg-blue-50 text-blue-700 border border-blue-200/60">
                      {targetMargin}% target margin
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs pt-1 border-t border-zinc-100/70 font-sans">
                  <div>
                    <span className="text-zinc-500 font-medium">TikTok Bank Deposit: </span>
                    <span className="font-mono font-bold text-zinc-950">
                      ${formatAmount(targetResult.netPayout)}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 font-medium">Estimated Net Profit: </span>
                    <span className="font-mono font-bold text-emerald-600">
                      ${formatAmount(targetResult.netProfit)}
                    </span>
                  </div>
                </div>
              </div>

              {/* 2x2 Grid for Target Mode */}
              <div className="grid grid-cols-2 gap-2 py-1 border-b border-zinc-100">
                <div className="rounded-lg bg-zinc-50/80 border border-zinc-200/70 p-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-zinc-600 block">
                      TikTok Bank Deposit
                    </span>
                    <DollarSign className="size-3 text-emerald-600" />
                  </div>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-lg font-mono font-extrabold text-zinc-950 truncate" title={`$${formatAmount(targetResult.netPayout)}`}>
                      ${formatAmount(targetResult.netPayout)}
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-sans leading-none block mt-0.5">
                    Settlement transfer
                  </span>
                </div>

                <div className="rounded-lg bg-zinc-50/80 border border-zinc-200/70 p-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-zinc-600 block">
                      Effective Fee %
                    </span>
                    <Percent className="size-3 text-amber-600" />
                  </div>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-lg font-mono font-extrabold text-amber-600">
                      {targetResult.effectiveFeePct.toFixed(1)}%
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-sans leading-none block mt-0.5">
                    Total platform &amp; creator cut
                  </span>
                </div>

                <div className="rounded-lg bg-zinc-50/80 border border-zinc-200/70 p-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-zinc-600 block">
                      Break-Even Floor
                    </span>
                    <TrendingUp className="size-3 text-blue-600" />
                  </div>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-lg font-mono font-extrabold text-zinc-950 truncate" title={`$${formatAmount(targetResult.breakEvenPrice)}`}>
                      ${formatAmount(targetResult.breakEvenPrice)}
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-sans leading-none block mt-0.5">
                    Zero-profit minimum
                  </span>
                </div>

                <div className="rounded-lg bg-zinc-50/80 border border-zinc-200/70 p-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-zinc-600 block">
                      Total Deductions
                    </span>
                    <ShieldAlert className="size-3 text-rose-500" />
                  </div>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-lg font-mono font-extrabold text-rose-600 truncate" title={`$${formatAmount(targetResult.totalDeductions)}`}>
                      ${formatAmount(targetResult.totalDeductions)}
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-sans leading-none block mt-0.5">
                    All fees + COGS + shipping
                  </span>
                </div>
              </div>

              {/* Progress Bar for Target Scenario */}
              <div className="py-2 border-b border-zinc-200">
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-200 flex gap-0.5 shadow-inner">
                  {cogsShare > 0 && (
                    <div
                      style={{ width: `${cogsShare}%` }}
                      className="bg-blue-600 rounded-l-full transition-all duration-300"
                      title={`Product COGS: ${cogsShare.toFixed(1)}%`}
                    />
                  )}
                  {shippingShare > 0 && (
                    <div
                      style={{ width: `${shippingShare}%` }}
                      className="bg-indigo-500 transition-all duration-300"
                      title={`Postage: ${shippingShare.toFixed(1)}%`}
                    />
                  )}
                  {referralShare > 0 && (
                    <div
                      style={{ width: `${referralShare}%` }}
                      className="bg-amber-500 transition-all duration-300"
                      title={`Category Referral: ${referralShare.toFixed(1)}%`}
                    />
                  )}
                  {processingFeeShare > 0 && (
                    <div
                      style={{ width: `${processingFeeShare}%` }}
                      className="bg-orange-400 transition-all duration-300"
                      title={`Payment Processing: ${processingFeeShare.toFixed(1)}%`}
                    />
                  )}
                  {affiliateShare > 0 && (
                    <div
                      style={{ width: `${affiliateShare}%` }}
                      className="bg-purple-500 transition-all duration-300"
                      title={`Creator Affiliate: ${affiliateShare.toFixed(1)}%`}
                    />
                  )}
                  {profitShare > 0 && (
                    <div
                      style={{ width: `${profitShare}%` }}
                      className="bg-emerald-600 rounded-r-full transition-all duration-300"
                      title={`Net Profit: ${profitShare.toFixed(1)}%`}
                    />
                  )}
                </div>

                {/* Legend */}
                <div className="mt-2.5 space-y-1.5 text-xs font-sans">
                  <div className="flex items-center justify-between py-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-blue-600 shrink-0" />
                      <span className="text-zinc-800 font-medium">Product Cost (COGS)</span>
                    </div>
                    <span className="font-mono font-bold text-zinc-950">${formatAmount(cogs)}</span>
                  </div>
                  {shippingCost > 0 && (
                    <div className="flex items-center justify-between py-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="size-2 rounded-full bg-indigo-500 shrink-0" />
                        <span className="text-zinc-800 font-medium">Fulfillment Postage</span>
                      </div>
                      <span className="font-mono font-bold text-zinc-950">${formatAmount(shippingCost)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between py-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-amber-500 shrink-0" />
                      <span className="text-zinc-800 font-medium">TikTok Referral ({targetResult.referralRatePct}%)</span>
                    </div>
                    <span className="font-mono font-bold text-zinc-950">
                      ${formatAmount(targetResult.referralFee)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-orange-400 shrink-0" />
                      <span className="text-zinc-800 font-medium">Processing Fee (1.8% + $0.30)</span>
                    </div>
                    <span className="font-mono font-bold text-zinc-950">
                      ${formatAmount(targetResult.paymentProcessingFee)}
                    </span>
                  </div>
                  {targetResult.affiliateCommission > 0 && (
                    <div className="flex items-center justify-between py-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="size-2 rounded-full bg-purple-500 shrink-0" />
                        <span className="text-zinc-800 font-medium">Creator Affiliate ({affiliatePct}%)</span>
                      </div>
                      <span className="font-mono font-bold text-zinc-950">
                        ${formatAmount(targetResult.affiliateCommission)}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between py-0.5 pt-1.5 border-t border-zinc-100">
                    <div className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-emerald-600 shrink-0" />
                      <span className="text-zinc-950 font-bold">Estimated Net Profit ({targetMargin}%)</span>
                    </div>
                    <span className="font-mono font-bold text-emerald-600">
                      ${formatAmount(targetResult.netProfit)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Itemized Breakdown in Target Mode */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowItemized(!showItemized)}
                  className="w-full flex items-center justify-between py-1.5 text-[11px] font-semibold text-zinc-500 hover:text-zinc-950 transition-colors cursor-pointer border-t border-zinc-100"
                >
                  <span>Itemized Platform Deductions</span>
                  {showItemized ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
                </button>

                {showItemized && (
                  <div className="mt-1 divide-y divide-zinc-100 text-xs font-mono space-y-0.5 animate-in fade-in duration-150">
                    <div className="flex justify-between py-1 text-zinc-600">
                      <span>Category Referral Fee ({targetResult.referralRatePct}%)</span>
                      <span className="font-semibold text-zinc-900">${formatAmount(targetResult.referralFee)}</span>
                    </div>
                    <div className="flex justify-between py-1 text-zinc-600">
                      <span>Payment Processing (1.8% + $0.30)</span>
                      <span className="font-semibold text-zinc-900">${formatAmount(targetResult.paymentProcessingFee)}</span>
                    </div>
                    {targetResult.affiliateCommission > 0 && (
                      <div className="flex justify-between py-1 text-zinc-600">
                        <span>Creator Affiliate ({affiliatePct}%)</span>
                        <span className="font-semibold text-zinc-900">${formatAmount(targetResult.affiliateCommission)}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-1 text-zinc-600 font-semibold border-t border-zinc-200 pt-1">
                      <span className="text-zinc-900">Total TikTok &amp; Creator Deductions</span>
                      <span className="text-zinc-950 font-bold">${formatAmount(targetResult.totalFees)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sticky Result Bar */}
      {!isEmbed && (
        <StickyResultBar
          label={mode === "profit" ? "TikTok Profit" : "Target Price"}
          value={mode === "profit" ? result.netProfit : targetPrice}
          subLabel={mode === "profit" ? "Margin" : "Est. Profit"}
          subValue={mode === "profit" ? result.netMarginPct : targetResult.netProfit}
          subValueFormat={mode === "profit" ? "percent" : "currency"}
          productCost={activeRes.totalProductCosts}
          totalFees={activeRes.totalFees}
          payout={activeRes.netPayout}
          breakEven={activeRes.breakEvenPrice}
          currencySymbol="$"
          itemizedFees={[
            { label: `Category Referral (${activeRes.referralRatePct}%)`, amount: activeRes.referralFee },
            { label: "Payment Processing (1.8% + $0.30)", amount: activeRes.paymentProcessingFee },
            ...(activeRes.affiliateCommission > 0
              ? [{ label: `Creator Affiliate (${affiliatePct}%)`, amount: activeRes.affiliateCommission }]
              : []),
            { label: "Product COGS", amount: activeRes.cogs },
            ...(activeRes.shippingCost > 0
              ? [{ label: "Fulfillment Postage", amount: activeRes.shippingCost }]
              : []),
          ]}
        />
      )}
    </div>
  );
}
