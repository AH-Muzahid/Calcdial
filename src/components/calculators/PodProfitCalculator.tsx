"use client";

import { useState, useMemo, useEffect } from "react";
import { calculatePodProfit } from "@/lib/formulas/pod-profit";
import { POD_ITEM_PRESETS } from "@/data/fee-presets";
import { CustomSelect, CustomSelectOption } from "@/components/common/CustomSelect";
import { StickyResultBar } from "./StickyResultBar";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import {
  RotateCcw,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  DollarSign,
  TrendingUp,
} from "lucide-react";

interface PodProfitCalculatorProps {
  initialProduct?: string;
  isEmbed?: boolean;
}

const PRESET_OPTIONS: CustomSelectOption[] = POD_ITEM_PRESETS.map((p) => {
  const formatted = p.id
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return {
    value: p.id,
    label: `${formatted} (Base: $${p.fees.baseCost.toFixed(2)} + $${p.fees.defaultShipping.toFixed(2)} ship)`,
  };
});

const CHANNEL_OPTIONS: CustomSelectOption[] = [
  { value: "etsy", label: "Etsy (9.5% + $0.45 flat)" },
  { value: "shopify", label: "Shopify Payments (2.9% + $0.30)" },
  { value: "tiktok", label: "TikTok Shop (6.0% + $0.30)" },
  { value: "ebay", label: "eBay (13.25% + $0.40)" },
  { value: "custom", label: "Custom Platform Fee %" },
];

type SalesChannel = "etsy" | "shopify" | "tiktok" | "ebay" | "custom";

const formatAmount = (val: number) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val);
};

export function PodProfitCalculator({
  initialProduct = "t-shirts",
  isEmbed = false,
}: PodProfitCalculatorProps) {
  // Mode switcher: standard vs target margin
  const [calcMode, setCalcMode] = useState<"standard" | "target">("standard");

  // Product Preset & Channel
  const [productType, setProductType] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search).get("preset");
      if (p && POD_ITEM_PRESETS.some((preset) => preset.id === p.toLowerCase())) {
        return p.toLowerCase();
      }
    }
    return initialProduct.toLowerCase();
  });

  const [salesChannel, setSalesChannel] = useState<SalesChannel>(() => {
    if (typeof window !== "undefined") {
      const ch = new URLSearchParams(window.location.search).get("channel");
      if (ch && ["etsy", "shopify", "tiktok", "ebay", "custom"].includes(ch.toLowerCase())) {
        return ch.toLowerCase() as SalesChannel;
      }
    }
    return "etsy";
  });

  // Numeric inputs as strings for smooth typing
  const initialPreset = POD_ITEM_PRESETS.find((p) => p.id === productType) || POD_ITEM_PRESETS[0];

  const [priceStr, setPriceStr] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search).get("price");
      if (p && !isNaN(parseFloat(p))) return parseFloat(p).toFixed(2);
    }
    return "29.99";
  });

  const [shippingChargedStr, setShippingChargedStr] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const s = new URLSearchParams(window.location.search).get("shipping");
      if (s && !isNaN(parseFloat(s))) return parseFloat(s).toFixed(2);
    }
    return "4.99";
  });

  const [baseCostStr, setBaseCostStr] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const c = new URLSearchParams(window.location.search).get("cost");
      if (c && !isNaN(parseFloat(c))) return parseFloat(c).toFixed(2);
    }
    return initialPreset.fees.baseCost.toFixed(2);
  });

  const [shippingCostStr, setShippingCostStr] = useState<string>(
    initialPreset.fees.defaultShipping.toFixed(2)
  );

  const [customFeePctStr, setCustomFeePctStr] = useState<string>("12.0");
  const [customFeeFixedStr, setCustomFeeFixedStr] = useState<string>("0.30");

  const [includeAds, setIncludeAds] = useState<boolean>(true);
  const [adSpendStr, setAdSpendStr] = useState<string>("4.00");
  const [targetMarginStr, setTargetMarginStr] = useState<string>("35");

  // UI state
  const [showItemized, setShowItemized] = useState<boolean>(false);
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);

  // Parse numeric values safely
  const retail = Math.max(0, parseFloat(priceStr) || 0);
  const shippingCharged = Math.max(0, parseFloat(shippingChargedStr) || 0);
  const baseCost = Math.max(0, parseFloat(baseCostStr) || 0);
  const shippingCost = Math.max(0, parseFloat(shippingCostStr) || 0);
  const adSpend = includeAds ? Math.max(0, parseFloat(adSpendStr) || 0) : 0;
  const customFeePct = Math.max(0, parseFloat(customFeePctStr) || 0);
  const customFeeFixed = Math.max(0, parseFloat(customFeeFixedStr) || 0);
  const targetMargin = Math.max(0, parseFloat(targetMarginStr) || 0);

  // Product preset handler
  const handleProductChange = (type: string) => {
    setProductType(type);
    const preset = POD_ITEM_PRESETS.find((p) => p.id === type);
    if (preset) {
      setBaseCostStr(preset.fees.baseCost.toFixed(2));
      setShippingCostStr(preset.fees.defaultShipping.toFixed(2));
    }
  };

  // Reset handler
  const handleReset = () => {
    const defaultPreset = POD_ITEM_PRESETS.find((p) => p.id === initialProduct.toLowerCase()) || POD_ITEM_PRESETS[0];
    setPriceStr("29.99");
    setShippingChargedStr("4.99");
    setProductType(defaultPreset.id);
    setBaseCostStr(defaultPreset.fees.baseCost.toFixed(2));
    setShippingCostStr(defaultPreset.fees.defaultShipping.toFixed(2));
    setSalesChannel("etsy");
    setCustomFeePctStr("12.0");
    setCustomFeeFixedStr("0.30");
    setIncludeAds(true);
    setAdSpendStr("4.00");
    setTargetMarginStr("35");
  };

  // Calculations: Standard mode
  const result = useMemo(() => {
    return calculatePodProfit({
      retailPrice: retail,
      productType,
      basePrintCost: baseCost,
      shippingCharged,
      shippingCost,
      salesChannel,
      marketplaceFeePct: salesChannel === "custom" ? customFeePct : undefined,
      marketplaceFixedFee: salesChannel === "custom" ? customFeeFixed : undefined,
      adSpendPerSale: adSpend,
      targetMarginPct: calcMode === "target" ? targetMargin : undefined,
    });
  }, [
    retail,
    productType,
    baseCost,
    shippingCharged,
    shippingCost,
    salesChannel,
    customFeePct,
    customFeeFixed,
    adSpend,
    calcMode,
    targetMargin,
  ]);

  // Target Margin recommended retail price
  const recommendedPrice = result.targetPriceForMargin ?? result.breakEvenPrice;

  // Analysis when priced at recommended price
  const targetAnalysis = useMemo(() => {
    return calculatePodProfit({
      retailPrice: recommendedPrice,
      productType,
      basePrintCost: baseCost,
      shippingCharged,
      shippingCost,
      salesChannel,
      marketplaceFeePct: salesChannel === "custom" ? customFeePct : undefined,
      marketplaceFixedFee: salesChannel === "custom" ? customFeeFixed : undefined,
      adSpendPerSale: adSpend,
    });
  }, [
    recommendedPrice,
    productType,
    baseCost,
    shippingCharged,
    shippingCost,
    salesChannel,
    customFeePct,
    customFeeFixed,
    adSpend,
  ]);

  // Active result view based on current mode
  const activeRes = calcMode === "standard" ? result : targetAnalysis;
  const activeGrossRev =
    activeRes.grossRevenue > 0
      ? activeRes.grossRevenue
      : Math.max(0.01, (calcMode === "standard" ? retail : recommendedPrice) + shippingCharged);

  // Visual Breakdown Progress Bar Percentages
  const barBaseShare = Math.min(100, Math.max(0, (baseCost / activeGrossRev) * 100));
  const barShipShare = Math.min(100, Math.max(0, (shippingCost / activeGrossRev) * 100));
  const barFeeShare = Math.min(100, Math.max(0, (activeRes.marketplaceFee / activeGrossRev) * 100));
  const barAdShare = Math.min(100, Math.max(0, (adSpend / activeGrossRev) * 100));
  const barProfitShare = Math.max(0, Math.min(100, (activeRes.netProfit / activeGrossRev) * 100));

  // Analytics event
  useEffect(() => {
    const timer = setTimeout(() => {
      trackEvent({
        name: "calculator_used",
        params: {
          tool_slug: "pod-profit-calculator",
          preset: `${productType}-${salesChannel}`,
        },
      });
    }, 1500);
    return () => clearTimeout(timer);
  }, [retail, productType, salesChannel, adSpend]);

  // Copy Summary Formatter
  const getFormattedSummary = () => {
    if (calcMode === "standard") {
      return `Print-on-Demand Profit & Margin Architecture
----------------------------------------
Catalog Item:         ${productType.toUpperCase()}
Sales Channel:        ${salesChannel.toUpperCase()}
Retail Price:         $${retail.toFixed(2)}
Shipping Charged:     $${shippingCharged.toFixed(2)}
Gross Revenue:        $${result.grossRevenue.toFixed(2)}
----------------------------------------
Print Base Cost:      $${baseCost.toFixed(2)}
Provider Shipping:    $${shippingCost.toFixed(2)}
Channel Platform Fee: $${result.marketplaceFee.toFixed(2)}
Ad Spend (CAC):       $${adSpend.toFixed(2)}
----------------------------------------
Channel Bank Payout:  $${result.marketplacePayout.toFixed(2)}
Total Direct Costs:   $${result.totalCosts.toFixed(2)}
REAL NET PROFIT:      $${result.netProfit.toFixed(2)} (${result.netMarginPct}% margin)
Break-Even Retail:    $${result.breakEvenPrice.toFixed(2)}
----------------------------------------
Calculated on CalcDial: ${typeof window !== "undefined" ? window.location.href : "https://calcdial.com/tools/pod-profit-calculator"}`;
    }

    return `Print-on-Demand Target Margin Pricing
----------------------------------------
Catalog Item:         ${productType.toUpperCase()}
Sales Channel:        ${salesChannel.toUpperCase()}
Target Net Margin:    ${targetMargin}%
----------------------------------------
Recommended Price:    $${recommendedPrice.toFixed(2)}
Estimated Net Profit: $${targetAnalysis.netProfit.toFixed(2)} (${targetAnalysis.netMarginPct}% margin)
Channel Bank Payout:  $${targetAnalysis.marketplacePayout.toFixed(2)}
Total Direct Costs:   $${targetAnalysis.totalCosts.toFixed(2)}
Break-Even Floor:     $${result.breakEvenPrice.toFixed(2)}
----------------------------------------
Calculated on CalcDial: ${typeof window !== "undefined" ? window.location.href : "https://calcdial.com/tools/pod-profit-calculator"}`;
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
                onClick={() => setCalcMode("standard")}
                className={cn(
                  "min-h-11 px-3.5 py-2 rounded-md font-semibold transition-all cursor-pointer text-xs whitespace-nowrap flex items-center justify-center",
                  calcMode === "standard"
                    ? "bg-white text-zinc-950 font-bold shadow-2xs"
                    : "text-zinc-600 hover:text-zinc-950"
                )}
              >
                Standard Profit
              </button>
              <button
                type="button"
                onClick={() => setCalcMode("target")}
                className={cn(
                  "min-h-11 px-3.5 py-2 rounded-md font-semibold transition-all cursor-pointer text-xs whitespace-nowrap flex items-center justify-center",
                  calcMode === "target"
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

          {/* Product Catalog Preset */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-zinc-950">
                Product Catalog Preset
              </label>
              <span className="text-[10px] text-zinc-400 font-sans">
                Prefills blank &amp; DTG printing costs
              </span>
            </div>
            <CustomSelect
              value={productType}
              options={PRESET_OPTIONS}
              onChange={handleProductChange}
            />
          </div>

          {/* Sales Channel Selector */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-zinc-950">
                Sales Channel / Marketplace
              </label>
              <span className="text-[10px] text-zinc-400 font-sans">
                Applies platform commission fees
              </span>
            </div>
            <CustomSelect
              value={salesChannel}
              options={CHANNEL_OPTIONS}
              onChange={(val) => setSalesChannel(val as SalesChannel)}
            />
          </div>

          {/* Custom Platform Fee Controls (Conditional) */}
          {salesChannel === "custom" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="flex flex-col gap-1">
                <label htmlFor="pod-custom-fee-pct" className="text-[11px] font-bold text-zinc-950 cursor-pointer">
                  Custom Platform Fee %
                </label>
                <div className="relative flex items-center rounded-lg border border-zinc-300 bg-white min-h-11 transition-all hover:border-zinc-400 focus-within:border-zinc-950 focus-within:ring-1 focus-within:ring-zinc-950">
                  <span className="pl-3 pr-1 text-xs sm:text-sm font-mono font-bold text-zinc-600 select-none">
                    %
                  </span>
                  <input
                    id="pod-custom-fee-pct"
                    name="customFeePct"
                    aria-label="Custom Platform Fee %"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step="any"
                    value={customFeePctStr}
                    onChange={(e) => setCustomFeePctStr(e.target.value)}
                    placeholder="12.0"
                    className="h-11 min-h-11 w-full rounded-lg bg-transparent px-2 text-xs sm:text-sm font-mono font-bold text-zinc-950 placeholder-zinc-400 focus:outline-hidden"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="pod-custom-fee-fixed" className="text-[11px] font-bold text-zinc-950 cursor-pointer">
                  Custom Fixed Fee per Order
                </label>
                <div className="relative flex items-center rounded-lg border border-zinc-300 bg-white min-h-11 transition-all hover:border-zinc-400 focus-within:border-zinc-950 focus-within:ring-1 focus-within:ring-zinc-950">
                  <span className="pl-3 pr-1 text-xs sm:text-sm font-mono font-bold text-zinc-600 select-none">
                    $
                  </span>
                  <input
                    id="pod-custom-fee-fixed"
                    name="customFeeFixed"
                    aria-label="Custom Fixed Fee per Order"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step="any"
                    value={customFeeFixedStr}
                    onChange={(e) => setCustomFeeFixedStr(e.target.value)}
                    placeholder="0.30"
                    className="h-11 min-h-11 w-full rounded-lg bg-transparent px-2 text-xs sm:text-sm font-mono font-bold text-zinc-950 placeholder-zinc-400 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* SECTION 1: Retail Price & Customer Shipping               */}
          {/* ========================================================= */}
          {calcMode === "standard" ? (
            <div className="space-y-3 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Retail Price */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <label htmlFor="pod-retail-price" className="text-[11px] font-bold text-zinc-950 cursor-pointer">
                      Retail Selling Price <span className="text-rose-600">*</span>
                    </label>
                    <span className="text-[10px] text-zinc-400 font-sans">
                      Customer price
                    </span>
                  </div>
                  <div className="relative flex items-center rounded-lg border border-zinc-300 bg-white min-h-11 transition-all hover:border-zinc-400 focus-within:border-zinc-950 focus-within:ring-1 focus-within:ring-zinc-950">
                    <span className="pl-3 pr-1 text-xs sm:text-sm font-mono font-bold text-zinc-600 select-none">
                      $
                    </span>
                    <input
                      id="pod-retail-price"
                      name="retailPrice"
                      aria-label="Retail Selling Price"
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
                      placeholder="29.99"
                      className="h-11 min-h-11 w-full rounded-lg bg-transparent px-2 text-xs sm:text-sm font-mono font-bold text-zinc-950 placeholder-zinc-400 focus:outline-hidden"
                    />
                  </div>
                  {/* Quick Presets */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {[19.99, 24.99, 29.99, 34.99, 39.99, 49.99].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriceStr(p.toFixed(2))}
                        className={cn(
                          "min-h-8 rounded-md px-2 py-1 text-[10px] font-mono font-semibold transition-colors cursor-pointer flex items-center justify-center",
                          priceStr === p.toFixed(2)
                            ? "bg-zinc-950 text-white"
                            : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-950"
                        )}
                      >
                        ${p.toFixed(2)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Shipping Charged to Buyer */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <label htmlFor="pod-shipping-charged" className="text-[11px] font-bold text-zinc-950 cursor-pointer">
                      Shipping Charged to Buyer
                    </label>
                    <span className="text-[10px] text-zinc-400 font-sans">
                      0 = Free Shipping
                    </span>
                  </div>
                  <div className="relative flex items-center rounded-lg border border-zinc-300 bg-white min-h-11 transition-all hover:border-zinc-400 focus-within:border-zinc-950 focus-within:ring-1 focus-within:ring-zinc-950">
                    <span className="pl-3 pr-1 text-xs sm:text-sm font-mono font-bold text-zinc-600 select-none">
                      $
                    </span>
                    <input
                      id="pod-shipping-charged"
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
                      placeholder="4.99"
                      className="h-11 min-h-11 w-full rounded-lg bg-transparent px-2 text-xs sm:text-sm font-mono font-bold text-zinc-950 placeholder-zinc-400 focus:outline-hidden"
                    />
                  </div>
                  {/* Quick Presets */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {[0, 3.99, 4.99, 6.99, 9.99].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setShippingChargedStr(s.toFixed(2))}
                        className={cn(
                          "min-h-8 rounded-md px-2 py-1 text-[10px] font-mono font-semibold transition-colors cursor-pointer flex items-center justify-center",
                          shippingChargedStr === s.toFixed(2)
                            ? "bg-zinc-950 text-white"
                            : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-950"
                        )}
                      >
                        {s === 0 ? "Free ($0)" : `$${s.toFixed(2)}`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* TARGET MARGIN INPUTS */
            <div className="space-y-3 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Target Net Margin % */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <label htmlFor="pod-target-margin" className="text-[11px] font-bold text-zinc-950 cursor-pointer">
                      Target Net Margin % <span className="text-rose-600">*</span>
                    </label>
                    <span className="text-[10px] text-zinc-400 font-sans">
                      Desired profit margin
                    </span>
                  </div>
                  <div className="relative flex items-center rounded-lg border border-zinc-300 bg-white min-h-11 transition-all hover:border-zinc-400 focus-within:border-zinc-950 focus-within:ring-1 focus-within:ring-zinc-950">
                    <span className="pl-3 pr-1 text-xs sm:text-sm font-mono font-bold text-zinc-600 select-none">
                      %
                    </span>
                    <input
                      id="pod-target-margin"
                      name="targetMargin"
                      aria-label="Target Net Margin %"
                      type="number"
                      inputMode="decimal"
                      min={1}
                      max={90}
                      step="any"
                      value={targetMarginStr}
                      onChange={(e) => setTargetMarginStr(e.target.value)}
                      onFocus={(e) => e.target.select()}
                      placeholder="35"
                      className="h-11 min-h-11 w-full rounded-lg bg-transparent px-2 text-xs sm:text-sm font-mono font-bold text-zinc-950 placeholder-zinc-400 focus:outline-hidden"
                    />
                  </div>
                  {/* Quick Presets */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {[20, 25, 30, 35, 40, 50].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setTargetMarginStr(m.toString())}
                        className={cn(
                          "min-h-8 rounded-md px-2 py-1 text-[10px] font-mono font-semibold transition-colors cursor-pointer flex items-center justify-center",
                          targetMarginStr === m.toString()
                            ? "bg-zinc-950 text-white"
                            : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-950"
                        )}
                      >
                        {m}%
                      </button>
                    ))}
                  </div>
                </div>

                {/* Shipping Charged to Buyer */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <label htmlFor="pod-target-shipping-charged" className="text-[11px] font-bold text-zinc-950 cursor-pointer">
                      Shipping Charged to Buyer
                    </label>
                    <span className="text-[10px] text-zinc-400 font-sans">
                      0 = Free Shipping
                    </span>
                  </div>
                  <div className="relative flex items-center rounded-lg border border-zinc-300 bg-white min-h-11 transition-all hover:border-zinc-400 focus-within:border-zinc-950 focus-within:ring-1 focus-within:ring-zinc-950">
                    <span className="pl-3 pr-1 text-xs sm:text-sm font-mono font-bold text-zinc-600 select-none">
                      $
                    </span>
                    <input
                      id="pod-target-shipping-charged"
                      name="targetShippingCharged"
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
                      placeholder="4.99"
                      className="h-11 min-h-11 w-full rounded-lg bg-transparent px-2 text-xs sm:text-sm font-mono font-bold text-zinc-950 placeholder-zinc-400 focus:outline-hidden"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {[0, 3.99, 4.99, 6.99, 9.99].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setShippingChargedStr(s.toFixed(2))}
                        className={cn(
                          "min-h-8 rounded-md px-2 py-1 text-[10px] font-mono font-semibold transition-colors cursor-pointer flex items-center justify-center",
                          shippingChargedStr === s.toFixed(2)
                            ? "bg-zinc-950 text-white"
                            : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-950"
                        )}
                      >
                        {s === 0 ? "Free ($0)" : `$${s.toFixed(2)}`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* SECTION 2: Print Provider Production & Postage            */}
          {/* ========================================================= */}
          <div className="pt-2 border-t border-zinc-100 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Base Item Print Cost */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <label htmlFor="pod-base-cost" className="text-[11px] font-bold text-zinc-950 cursor-pointer">
                    Base Item Print Cost
                  </label>
                  <span className="text-[10px] text-zinc-400 font-sans">
                    Lab blank + print fee
                  </span>
                </div>
                <div className="relative flex items-center rounded-lg border border-zinc-300 bg-white min-h-11 transition-all hover:border-zinc-400 focus-within:border-zinc-950 focus-within:ring-1 focus-within:ring-zinc-950">
                  <span className="pl-3 pr-1 text-xs sm:text-sm font-mono font-bold text-zinc-600 select-none">
                    $
                  </span>
                  <input
                    id="pod-base-cost"
                    name="baseCost"
                    aria-label="Base Item Print Cost"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step="any"
                    value={baseCostStr}
                    onChange={(e) => setBaseCostStr(e.target.value)}
                    onFocus={(e) => {
                      if (e.target.value === "0.00" || e.target.value === "0") {
                        e.target.select();
                      }
                    }}
                    onBlur={() => {
                      const num = parseFloat(baseCostStr);
                      if (!isNaN(num) && num >= 0) setBaseCostStr(num.toFixed(2));
                      else if (!baseCostStr) setBaseCostStr("0.00");
                    }}
                    placeholder="9.50"
                    className="h-11 min-h-11 w-full rounded-lg bg-transparent px-2 text-xs sm:text-sm font-mono font-bold text-zinc-950 placeholder-zinc-400 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Fulfillment Postage to Print Lab */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <label htmlFor="pod-shipping-cost" className="text-[11px] font-bold text-zinc-950 cursor-pointer">
                    Provider Shipping Cost
                  </label>
                  <span className="text-[10px] text-zinc-400 font-sans">
                    Postage paid to lab
                  </span>
                </div>
                <div className="relative flex items-center rounded-lg border border-zinc-300 bg-white min-h-11 transition-all hover:border-zinc-400 focus-within:border-zinc-950 focus-within:ring-1 focus-within:ring-zinc-950">
                  <span className="pl-3 pr-1 text-xs sm:text-sm font-mono font-bold text-zinc-600 select-none">
                    $
                  </span>
                  <input
                    id="pod-shipping-cost"
                    name="shippingCost"
                    aria-label="Provider Shipping Cost"
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
                    placeholder="4.50"
                    className="h-11 min-h-11 w-full rounded-lg bg-transparent px-2 text-xs sm:text-sm font-mono font-bold text-zinc-950 placeholder-zinc-400 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* SECTION 3: Marketing & Customer Acquisition (CAC)         */}
          {/* ========================================================= */}
          <div className="pt-2 border-t border-zinc-100 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <label
                  htmlFor="toggle-ad-spend"
                  className="text-xs font-semibold text-zinc-950 block cursor-pointer"
                >
                  Customer Acquisition Cost (CAC / Ads)
                </label>
                <p className="text-[11px] text-zinc-500 font-sans">
                  Meta, TikTok, or Etsy ad spend allocated per order
                </p>
              </div>

              {/* iOS-Style Toggle */}
              <button
                type="button"
                id="toggle-ad-spend"
                role="switch"
                aria-checked={includeAds}
                onClick={() => setIncludeAds(!includeAds)}
                className={cn(
                  "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden",
                  includeAds ? "bg-zinc-950" : "bg-zinc-200"
                )}
              >
                <span
                  className={cn(
                    "pointer-events-none inline-block size-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out",
                    includeAds ? "translate-x-4" : "translate-x-0"
                  )}
                />
              </button>
            </div>

            {includeAds && (
              <div className="pt-1">
                <div className="relative flex items-center rounded-lg border border-zinc-300 bg-white min-h-11 transition-all hover:border-zinc-400 focus-within:border-zinc-950 focus-within:ring-1 focus-within:ring-zinc-950">
                  <span className="pl-3 pr-1 text-xs sm:text-sm font-mono font-bold text-zinc-600 select-none">
                    $
                  </span>
                  <input
                    id="pod-ad-spend"
                    name="adSpend"
                    aria-label="Customer Acquisition Cost (CAC / Ads)"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step="any"
                    value={adSpendStr}
                    onChange={(e) => setAdSpendStr(e.target.value)}
                    onFocus={(e) => {
                      if (e.target.value === "0.00" || e.target.value === "0") {
                        e.target.select();
                      }
                    }}
                    onBlur={() => {
                      const num = parseFloat(adSpendStr);
                      if (!isNaN(num) && num >= 0) setAdSpendStr(num.toFixed(2));
                      else if (!adSpendStr) setAdSpendStr("0.00");
                    }}
                    placeholder="4.00"
                    className="h-11 min-h-11 w-full rounded-lg bg-transparent px-2 text-xs sm:text-sm font-mono font-bold text-zinc-950 placeholder-zinc-400 focus:outline-hidden"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
                  {[0, 2.50, 4.00, 6.00, 8.00, 12.00].map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setAdSpendStr(a.toFixed(2))}
                      className={cn(
                        "min-h-8 rounded-md px-2 py-1 text-[10px] font-mono font-semibold transition-colors cursor-pointer flex items-center justify-center",
                        adSpendStr === a.toFixed(2)
                          ? "bg-zinc-950 text-white"
                          : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-950"
                      )}
                    >
                      ${a.toFixed(2)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT CARD: Standalone Results Card (Sticky Desktop)      */}
        {/* ========================================================= */}
        <div className="hidden lg:block lg:col-span-5 rounded-xl sm:rounded-2xl border border-zinc-200/90 bg-white p-4 sm:p-5 shadow-xs lg:sticky lg:top-20 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 border-b border-zinc-100">
            <h3 className="text-sm sm:text-base font-bold tracking-tight text-zinc-950">
              {calcMode === "standard" ? "Calculation Results" : "Target Pricing Results"}
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

          {/* Hero KPI Section */}
          {calcMode === "standard" ? (
            <div className="py-2.5 border-b border-zinc-100">
              <div className="flex items-baseline justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span
                      className={cn(
                        "block text-xs font-bold tracking-tight",
                        result.netProfit > 0
                          ? "text-emerald-700"
                          : result.netProfit < 0
                          ? "text-rose-700"
                          : "text-zinc-600"
                      )}
                    >
                      Real Net Profit
                    </span>
                    {result.netProfit < 0 && (
                      <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-extrabold text-rose-700 uppercase tracking-wider">
                        Loss
                      </span>
                    )}
                  </div>
                  <div
                    className={cn(
                      "text-2xl sm:text-3xl lg:text-3xl xl:text-4xl font-extrabold font-mono tracking-tight truncate",
                      result.netProfit > 0
                        ? "text-emerald-600"
                        : result.netProfit < 0
                        ? "text-rose-600 font-extrabold"
                        : "text-zinc-950"
                    )}
                    title={`$${formatAmount(result.netProfit)}`}
                  >
                    ${formatAmount(result.netProfit)}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="block text-xs font-semibold text-zinc-600 mb-0.5 tracking-tight">
                    Net Margin
                  </span>
                  <div className="inline-flex items-center gap-1">
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-bold font-mono",
                        result.netMarginPct >= 30
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : result.netMarginPct > 0
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      )}
                    >
                      {result.netMarginPct.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Sub-row: Gross Margin vs ROI */}
              <div className="mt-3 flex items-center justify-between text-xs pt-1.5 border-t border-zinc-100/70 font-sans">
                <div>
                  <span className="text-zinc-500 font-medium">Gross Margin: </span>
                  <span className="font-mono font-bold text-zinc-950">
                    {result.grossMarginPct.toFixed(1)}%
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
          ) : (
            <div className="py-2.5 border-b border-zinc-100">
              <div className="flex items-baseline justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <span className="block text-xs font-bold mb-0.5 tracking-tight text-blue-700">
                    Recommended Retail Price
                  </span>
                  <div
                    className="text-2xl sm:text-3xl lg:text-3xl xl:text-4xl font-extrabold font-mono tracking-tight text-blue-600 truncate"
                    title={`$${formatAmount(recommendedPrice)}`}
                  >
                    ${formatAmount(recommendedPrice)}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="block text-xs font-semibold text-zinc-600 mb-0.5 tracking-tight">
                    Target Margin
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold font-mono bg-blue-50 text-blue-700 border border-blue-200">
                    {targetMargin}%
                  </span>
                </div>
              </div>

              {/* Sub-row: Est. Net Profit & Floor */}
              <div className="mt-3 flex items-center justify-between text-xs pt-1.5 border-t border-zinc-100/70 font-sans">
                <div>
                  <span className="text-zinc-500 font-medium">Est. Net Profit: </span>
                  <span className="font-mono font-bold text-emerald-600">
                    +${formatAmount(targetAnalysis.netProfit)}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 font-medium">Break-Even Floor: </span>
                  <span className="font-mono font-bold text-zinc-950">
                    ${formatAmount(result.breakEvenPrice)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* High-Level Metric Summary Grid (2x2) */}
          <div className="grid grid-cols-2 gap-2 py-2 border-b border-zinc-100">
            {/* Channel Bank Payout */}
            <div className="rounded-lg bg-zinc-50/80 border border-zinc-200/70 p-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-zinc-600 block">
                  Channel Payout
                </span>
                <DollarSign className="size-3 text-emerald-600" />
              </div>
              <div className="mt-1">
                <span className="text-lg font-mono font-extrabold text-zinc-950 truncate block" title={`$${formatAmount(activeRes.marketplacePayout)}`}>
                  ${formatAmount(activeRes.marketplacePayout)}
                </span>
              </div>
              <span className="text-[10px] text-zinc-400 font-sans leading-none block mt-0.5">
                Channel deposit
              </span>
            </div>

            {/* Break-Even Price */}
            <div className="rounded-lg bg-zinc-50/80 border border-zinc-200/70 p-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-zinc-600 block">
                  Break-Even Retail
                </span>
                <TrendingUp className="size-3 text-blue-600" />
              </div>
              <div className="mt-1">
                <span className="text-lg font-mono font-extrabold text-zinc-950 truncate block" title={`$${formatAmount(result.breakEvenPrice)}`}>
                  ${formatAmount(result.breakEvenPrice)}
                </span>
              </div>
              <span className="text-[10px] text-zinc-400 font-sans leading-none block mt-0.5">
                $0 profit floor
              </span>
            </div>

            {/* Total Direct Deductions */}
            <div className="rounded-lg bg-zinc-50/80 border border-zinc-200/70 p-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-zinc-600 block">
                  Total Deductions
                </span>
                <span className="text-[10px] font-mono text-zinc-400">All fees</span>
              </div>
              <div className="mt-1">
                <span className="text-lg font-mono font-extrabold text-zinc-950 truncate block" title={`$${formatAmount(activeRes.totalCosts)}`}>
                  ${formatAmount(activeRes.totalCosts)}
                </span>
              </div>
              <span className="text-[10px] text-zinc-400 font-sans leading-none block mt-0.5">
                Blank, ship, fees, CAC
              </span>
            </div>

            {/* Provider Production Fulfillment */}
            <div className="rounded-lg bg-zinc-50/80 border border-zinc-200/70 p-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-zinc-600 block">
                  Lab Invoice
                </span>
                <span className="text-[10px] font-mono text-zinc-400">Print lab</span>
              </div>
              <div className="mt-1">
                <span className="text-lg font-mono font-extrabold text-zinc-950 truncate block" title={`$${formatAmount(baseCost + shippingCost)}`}>
                  ${formatAmount(baseCost + shippingCost)}
                </span>
              </div>
              <span className="text-[10px] text-zinc-400 font-sans leading-none block mt-0.5">
                Blank + fulfillment ship
              </span>
            </div>
          </div>

          {/* Multi-Color Progress Breakdown Bar */}
          <div className="py-2.5 border-b border-zinc-100">
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-200 flex gap-0.5 shadow-inner">
              {barBaseShare > 0 && (
                <div
                  style={{ width: `${barBaseShare}%` }}
                  className="bg-blue-600 rounded-l-full transition-all duration-300"
                  title={`Base Print: ${barBaseShare.toFixed(1)}%`}
                />
              )}
              {barShipShare > 0 && (
                <div
                  style={{ width: `${barShipShare}%` }}
                  className="bg-indigo-500 transition-all duration-300"
                  title={`Provider Shipping: ${barShipShare.toFixed(1)}%`}
                />
              )}
              {barFeeShare > 0 && (
                <div
                  style={{ width: `${barFeeShare}%` }}
                  className="bg-amber-500 transition-all duration-300"
                  title={`Channel Fee: ${barFeeShare.toFixed(1)}%`}
                />
              )}
              {barAdShare > 0 && (
                <div
                  style={{ width: `${barAdShare}%` }}
                  className="bg-rose-500 transition-all duration-300"
                  title={`Ad Spend: ${barAdShare.toFixed(1)}%`}
                />
              )}
              {barProfitShare > 0 && (
                <div
                  style={{ width: `${barProfitShare}%` }}
                  className="bg-emerald-600 rounded-r-full transition-all duration-300"
                  title={`Net Profit: ${barProfitShare.toFixed(1)}%`}
                />
              )}
            </div>

            {/* Legend Rows with Amounts & Percentages */}
            <div className="mt-2.5 space-y-1.5 text-xs font-sans">
              <div className="flex items-center justify-between py-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-blue-600 shrink-0" />
                  <span className="text-zinc-800 font-medium">Base Print &amp; Blank</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-zinc-950">${formatAmount(baseCost)}</span>
                  <span className="font-mono text-zinc-500 font-semibold w-11 text-right text-[11px]">
                    {barBaseShare.toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between py-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-indigo-500 shrink-0" />
                  <span className="text-zinc-800 font-medium">Provider Postage</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-zinc-950">${formatAmount(shippingCost)}</span>
                  <span className="font-mono text-zinc-500 font-semibold w-11 text-right text-[11px]">
                    {barShipShare.toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between py-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-amber-500 shrink-0" />
                  <span className="text-zinc-800 font-medium">
                    Channel Fee ({salesChannel.toUpperCase()})
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-zinc-950">
                    ${formatAmount(activeRes.marketplaceFee)}
                  </span>
                  <span className="font-mono text-zinc-500 font-semibold w-11 text-right text-[11px]">
                    {barFeeShare.toFixed(1)}%
                  </span>
                </div>
              </div>

              {adSpend > 0 && (
                <div className="flex items-center justify-between py-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-rose-500 shrink-0" />
                    <span className="text-zinc-800 font-medium">Ad Spend (CAC)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-zinc-950">${formatAmount(adSpend)}</span>
                    <span className="font-mono text-zinc-500 font-semibold w-11 text-right text-[11px]">
                      {barAdShare.toFixed(1)}%
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between py-0.5 border-t border-zinc-100 pt-1">
                <div className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-emerald-600 shrink-0" />
                  <span className="text-zinc-950 font-bold">Real Take-Home Net</span>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "font-mono font-bold",
                      activeRes.netProfit > 0
                        ? "text-emerald-600"
                        : activeRes.netProfit < 0
                        ? "text-rose-600 font-extrabold"
                        : "text-zinc-950"
                    )}
                  >
                    ${formatAmount(activeRes.netProfit)}
                  </span>
                  <span className="font-mono text-zinc-500 font-semibold w-11 text-right text-[11px]">
                    {barProfitShare.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Collapsible Itemized Cost Breakdown */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowItemized(!showItemized)}
              className="w-full flex items-center justify-between py-1 text-xs font-bold text-zinc-700 hover:text-zinc-950 transition-colors cursor-pointer"
            >
              <span>Itemized Cost &amp; Profit Breakdown</span>
              {showItemized ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
            </button>

            {showItemized && (
              <div className="mt-2 rounded-lg bg-zinc-50/70 border border-zinc-200/80 p-3 space-y-2 text-xs font-sans">
                <div className="flex items-center justify-between text-zinc-600">
                  <span>Gross Buyer Payment:</span>
                  <span className="font-mono font-bold text-zinc-950">
                    ${formatAmount(activeRes.grossRevenue)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-zinc-600">
                  <span>Base Blank &amp; Printing:</span>
                  <span className="font-mono font-bold text-zinc-950">
                    -${formatAmount(baseCost)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-zinc-600">
                  <span>Provider Fulfillment Postage:</span>
                  <span className="font-mono font-bold text-zinc-950">
                    -${formatAmount(shippingCost)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-zinc-600">
                  <span>Sales Channel Commission:</span>
                  <span className="font-mono font-bold text-zinc-950">
                    -${formatAmount(activeRes.marketplaceFee)}
                  </span>
                </div>
                {adSpend > 0 && (
                  <div className="flex items-center justify-between text-zinc-600">
                    <span>Customer Acquisition (Ad Spend):</span>
                    <span className="font-mono font-bold text-zinc-950">
                      -${formatAmount(adSpend)}
                    </span>
                  </div>
                )}
                <div className="border-t border-zinc-200 pt-1.5 flex items-center justify-between font-bold text-zinc-950">
                  <span>Channel Bank Deposit:</span>
                  <span className="font-mono">${formatAmount(activeRes.marketplacePayout)}</span>
                </div>
                <div className="border-t border-zinc-200 pt-1.5 flex items-center justify-between font-bold text-zinc-950">
                  <span>Total Direct Deductions:</span>
                  <span className="font-mono">${formatAmount(activeRes.totalCosts)}</span>
                </div>
                <div className="border-t border-zinc-950/20 pt-1.5 flex items-center justify-between font-extrabold text-sm">
                  <span className={activeRes.netProfit >= 0 ? "text-emerald-700" : "text-rose-700"}>
                    Real Net Profit:
                  </span>
                  <span
                    className={cn(
                      "font-mono",
                      activeRes.netProfit >= 0 ? "text-emerald-600" : "text-rose-600 font-extrabold"
                    )}
                  >
                    ${formatAmount(activeRes.netProfit)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Sticky Bar with slide-up quick view drawer */}
      {!isEmbed && (
        <StickyResultBar
          label="POD Net Profit"
          value={calcMode === "standard" ? result.netProfit : targetAnalysis.netProfit}
          subLabel="Net Margin"
          subValue={calcMode === "standard" ? result.netMarginPct : targetAnalysis.netMarginPct}
          productCost={baseCost + shippingCost}
          totalFees={activeRes.marketplaceFee + adSpend}
          payout={activeRes.marketplacePayout}
          breakEven={result.breakEvenPrice}
          currencySymbol="$"
          itemizedFees={[
            { label: "Base Print Cost", amount: baseCost },
            { label: "Provider Shipping", amount: shippingCost },
            {
              label: `Platform Fee (${salesChannel.toUpperCase()})`,
              amount: activeRes.marketplaceFee,
            },
            ...(adSpend > 0 ? [{ label: "Ad Spend (CAC)", amount: adSpend }] : []),
          ]}
        />
      )}
    </div>
  );
}
