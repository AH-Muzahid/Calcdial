"use client";

import { useState, useMemo } from "react";
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
  ArrowRight,
} from "lucide-react";
import { PixelButton } from "@/components/ui/PixelButton";

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
];

type SalesChannel = "etsy" | "shopify" | "tiktok" | "ebay";

const PRESETS = [22, 29.99, 34.99, 45, 60, 80];

export function PodProfitCalculator({
  initialProduct = "t-shirts",
  isEmbed = false,
}: PodProfitCalculatorProps) {
  const [calcMode, setCalcMode] = useState<"standard" | "target">("standard");

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
      if (ch && ["etsy", "shopify", "tiktok", "ebay"].includes(ch.toLowerCase())) {
        return ch.toLowerCase() as SalesChannel;
      }
    }
    return "etsy";
  });

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

  const [baseCostStr, setBaseCostStr] = useState<string>(initialPreset.fees.baseCost.toFixed(2));
  const [providerShippingStr, setProviderShippingStr] = useState<string>(initialPreset.fees.defaultShipping.toFixed(2));
  const [adSpendStr, setAdSpendStr] = useState<string>("0.00");
  const [includeAds, setIncludeAds] = useState<boolean>(false);
  const [targetMarginStr, setTargetMarginStr] = useState<string>("35");

  const [showItemized, setShowItemized] = useState<boolean>(false);
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);

  // When changing product preset, update base cost and provider shipping defaults
  const handlePresetChange = (newPresetId: string) => {
    setProductType(newPresetId);
    const preset = POD_ITEM_PRESETS.find((p) => p.id === newPresetId);
    if (preset) {
      setBaseCostStr(preset.fees.baseCost.toFixed(2));
      setProviderShippingStr(preset.fees.defaultShipping.toFixed(2));
    }
  };

  const salePrice = Math.max(0, parseFloat(priceStr) || 0);
  const shippingCharged = Math.max(0, parseFloat(shippingChargedStr) || 0);
  const baseCost = Math.max(0, parseFloat(baseCostStr) || 0);
  const providerShipping = Math.max(0, parseFloat(providerShippingStr) || 0);
  const adSpend = includeAds ? Math.max(0, parseFloat(adSpendStr) || 0) : 0;
  const targetMargin = Math.max(0, parseFloat(targetMarginStr) || 0);

  const result = useMemo(() => {
    return calculatePodProfit({
      retailPrice: salePrice,
      shippingCharged,
      basePrintCost: baseCost,
      shippingCost: providerShipping,
      salesChannel: salesChannel as "etsy" | "shopify" | "tiktok" | "ebay" | "custom",
      adSpendPerSale: adSpend,
      productType,
      targetMarginPct: calcMode === "target" ? targetMargin : undefined,
    });
  }, [salePrice, shippingCharged, baseCost, providerShipping, salesChannel, adSpend, targetMargin, calcMode, productType]);

  const recommendedPrice = result.targetPriceForMargin ?? result.breakEvenPrice;

  const reverseAnalysis = useMemo(() => {
    return calculatePodProfit({
      retailPrice: recommendedPrice,
      shippingCharged,
      basePrintCost: baseCost,
      shippingCost: providerShipping,
      salesChannel: salesChannel as "etsy" | "shopify" | "tiktok" | "ebay" | "custom",
      adSpendPerSale: adSpend,
      productType,
    });
  }, [recommendedPrice, shippingCharged, baseCost, providerShipping, salesChannel, adSpend, productType]);

  const handleReset = () => {
    const p = POD_ITEM_PRESETS[0];
    setProductType(p.id);
    setSalesChannel("etsy");
    setPriceStr("29.99");
    setShippingChargedStr("4.99");
    setBaseCostStr(p.fees.baseCost.toFixed(2));
    setProviderShippingStr(p.fees.defaultShipping.toFixed(2));
    setAdSpendStr("0.00");
    setIncludeAds(false);
    setTargetMarginStr("35");
  };

  const grossRev = result.grossRevenue > 0 ? result.grossRevenue : Math.max(0.01, salePrice + shippingCharged);
  const profitWidth = Math.min(100, Math.max(0, (result.netProfit / grossRev) * 100));
  const feesWidth = Math.min(100, Math.max(0, (result.marketplaceFee / grossRev) * 100));
  const costWidth = Math.min(100, Math.max(0, ((baseCost + providerShipping + adSpend) / grossRev) * 100));

  const handleCopySummary = () => {
    trackEvent({
      name: "result_copied",
      params: { tool_slug: "pod-profit-calculator", method: "clipboard" },
    });

    const isStandard = calcMode === "standard";
    const text = isStandard
      ? `Print-on-Demand (POD) Profit Breakdown:
----------------------------------------
Retail Price:           $${salePrice.toFixed(2)}
Buyer Shipping:         $${shippingCharged.toFixed(2)}
Gross Revenue:          $${result.grossRevenue.toFixed(2)}
----------------------------------------
Sales Channel:          ${salesChannel.toUpperCase()}
Platform Fee:           $${result.marketplaceFee.toFixed(2)}
Base Print Cost:        $${baseCost.toFixed(2)}
Provider Shipping:      $${providerShipping.toFixed(2)}
Ad Spend:               $${adSpend.toFixed(2)}
----------------------------------------
Total Direct Expenses:  $${(result.marketplaceFee + baseCost + providerShipping + adSpend).toFixed(2)}
REAL NET PROFIT:        $${result.netProfit.toFixed(2)} (${result.netMarginPct.toFixed(1)}% margin)
Break-Even Floor Price: $${result.breakEvenPrice.toFixed(2)}
----------------------------------------
Calculated via CalcDial (https://calcdial.pages.dev/tools/pod-profit-calculator)`
      : `POD Target Price Recommendation:
----------------------------------------
Target Margin:          ${targetMargin}%
Recommended Price:      $${recommendedPrice.toFixed(2)}
Estimated Net Profit:   $${reverseAnalysis.netProfit.toFixed(2)} (${reverseAnalysis.netMarginPct.toFixed(1)}% margin)
Platform Fee:           $${reverseAnalysis.marketplaceFee.toFixed(2)}
Total POD Unit Cost:    $${(baseCost + providerShipping + adSpend).toFixed(2)}
----------------------------------------
Calculated via CalcDial (https://calcdial.pages.dev/tools/pod-profit-calculator)`;

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
              onClick={() => setCalcMode("standard")}
              className={cn(
                "px-3.5 py-1.5 rounded-md transition-all cursor-pointer text-xs flex items-center gap-1.5",
                calcMode === "standard"
                  ? "bg-[#2b5cfd] text-white font-bold shadow-2xs"
                  : "text-zinc-600 hover:text-zinc-950"
              )}
            >
              Standard Profit
            </button>
            <button
              type="button"
              onClick={() => setCalcMode("target")}
              className={cn(
                "px-3.5 py-1.5 rounded-md transition-all cursor-pointer text-xs flex items-center gap-1.5",
                calcMode === "target"
                  ? "bg-[#2b5cfd] text-white font-bold shadow-2xs"
                  : "text-zinc-600 hover:text-zinc-950"
              )}
            >
              Target Price &amp; Margin
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
          {/* LEFT CARD: Pricing & Production Costs Inputs              */}
          {/* ========================================================= */}
          <div className="flex flex-col justify-between rounded-xl border border-zinc-200/90 bg-zinc-50/50 p-4 sm:p-5">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-200/70">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                  {calcMode === "standard" ? "Pricing & Production Costs" : "Target Margin Goal"}
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

              {/* 2-Column Row: Preset Product & Sales Channel */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-zinc-900">Product Template</label>
                  <CustomSelect
                    value={productType}
                    options={PRESET_OPTIONS}
                    onChange={(val) => handlePresetChange(val)}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-zinc-900">Sales Channel</label>
                  <CustomSelect
                    value={salesChannel}
                    options={CHANNEL_OPTIONS}
                    onChange={(val) => setSalesChannel(val as SalesChannel)}
                  />
                </div>
              </div>

              {calcMode === "standard" ? (
                <>
                  {/* 2-Column Row: Retail Price & Base Print Cost (1 col on mobile, 2 cols on sm+) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="pod-retail-price" className="text-xs font-bold text-zinc-900 block mb-1">
                        Retail Price
                      </label>
                      <div className="relative flex items-center min-h-10 rounded-lg border border-zinc-300 bg-white px-2.5 transition-all focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
                        <span className="text-xs font-mono font-bold text-zinc-500 select-none mr-1">$</span>
                        <input
                          id="pod-retail-price"
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
                      <label htmlFor="pod-base-cost" className="text-xs font-bold text-zinc-900 block mb-1">
                        Base Print Cost
                      </label>
                      <div className="relative flex items-center min-h-10 rounded-lg border border-zinc-300 bg-white px-2.5 transition-all focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
                        <span className="text-xs font-mono font-bold text-zinc-500 select-none mr-1">$</span>
                        <input
                          id="pod-base-cost"
                          type="number"
                          inputMode="decimal"
                          min={0}
                          step="any"
                          value={baseCostStr}
                          onChange={(e) => setBaseCostStr(e.target.value)}
                          onBlur={() => {
                            const num = parseFloat(baseCostStr);
                            if (!isNaN(num) && num >= 0) setBaseCostStr(num.toFixed(2));
                            else if (!baseCostStr) setBaseCostStr("0.00");
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
                          onClick={() => setPriceStr(p.toString())}
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

                  {/* 2-Column Row: Buyer Shipping & Provider Shipping (1 col on mobile, 2 cols on sm+) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label htmlFor="pod-buyer-shipping" className="text-xs font-bold text-zinc-900 block mb-1">
                        Buyer Shipping Fee
                      </label>
                      <div className="relative flex items-center min-h-10 rounded-lg border border-zinc-300 bg-white px-2.5 transition-all focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
                        <span className="text-xs font-mono font-bold text-zinc-500 select-none mr-1">$</span>
                        <input
                          id="pod-buyer-shipping"
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
                      <label htmlFor="pod-provider-shipping" className="text-xs font-bold text-zinc-900 block mb-1">
                        Provider Shipping Fee
                      </label>
                      <div className="relative flex items-center min-h-10 rounded-lg border border-zinc-300 bg-white px-2.5 transition-all focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
                        <span className="text-xs font-mono font-bold text-zinc-500 select-none mr-1">$</span>
                        <input
                          id="pod-provider-shipping"
                          type="number"
                          inputMode="decimal"
                          min={0}
                          step="any"
                          value={providerShippingStr}
                          onChange={(e) => setProviderShippingStr(e.target.value)}
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
                    <span className="text-xs font-bold text-zinc-900 block">Desired Net Profit Margin</span>
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

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-zinc-900 block mb-1">Base Print Cost</label>
                      <div className="relative flex items-center min-h-10 rounded-lg border border-zinc-300 bg-white px-2.5 transition-all focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
                        <span className="text-xs font-mono font-bold text-zinc-500 select-none mr-1">$</span>
                        <input
                          type="number"
                          value={baseCostStr}
                          onChange={(e) => setBaseCostStr(e.target.value)}
                          className="w-full bg-transparent font-mono font-bold text-sm text-zinc-950 focus:outline-hidden"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-zinc-900 block mb-1">Provider Shipping</label>
                      <div className="relative flex items-center min-h-10 rounded-lg border border-zinc-300 bg-white px-2.5 transition-all focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
                        <span className="text-xs font-mono font-bold text-zinc-500 select-none mr-1">$</span>
                        <input
                          type="number"
                          value={providerShippingStr}
                          onChange={(e) => setProviderShippingStr(e.target.value)}
                          className="w-full bg-transparent font-mono font-bold text-sm text-zinc-950 focus:outline-hidden"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Marketing Ad Spend Toggle Card */}
              <div className="rounded-lg border border-zinc-200/80 bg-white p-2.5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-xs font-bold text-zinc-900 block truncate">
                    Include Marketing Ad Spend per Order
                  </span>
                  <span className="text-[10px] text-zinc-500 font-sans block truncate">
                    Etsy Ads or Social Media CAC
                  </span>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={includeAds}
                  onClick={() => setIncludeAds(!includeAds)}
                  className={cn(
                    "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden",
                    includeAds ? "bg-blue-600" : "bg-zinc-200"
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
                <div className="flex items-center justify-between text-xs px-2.5 py-1.5 bg-white rounded-lg border border-zinc-200/70">
                  <span className="text-zinc-700 font-semibold">Ad Spend per Order:</span>
                  <div className="relative flex items-center w-28 h-8 rounded-md border border-zinc-300 bg-white px-2">
                    <span className="text-xs font-mono font-bold text-zinc-500 select-none mr-1">$</span>
                    <input
                      type="number"
                      value={adSpendStr}
                      onChange={(e) => setAdSpendStr(e.target.value)}
                      className="w-full bg-transparent font-mono font-bold text-xs text-zinc-950 focus:outline-hidden"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT CARD: Live Results Card                             */}
          {/* ========================================================= */}
          <div className="flex flex-col justify-between rounded-xl border border-zinc-200/90 bg-zinc-50/70 p-4 sm:p-5">
            {calcMode === "standard" ? (
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
                    Est. bank payout after fees: ${result.marketplacePayout.toFixed(2)}
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
                      title="Platform Fees"
                    />
                    <div
                      style={{ width: `${costWidth}%` }}
                      className="bg-zinc-400 h-full transition-all duration-300"
                      title="POD Base & Shipping Costs"
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
                      Fees ({((result.marketplaceFee / grossRev) * 100).toFixed(0)}%)
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <span className="size-1.5 rounded-full bg-zinc-400" />
                      Production Costs
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
                      Platform Fee ({salesChannel.toUpperCase()}):
                    </span>
                    <span className="font-mono font-semibold text-rose-600">
                      -${result.marketplaceFee.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span className="flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-zinc-400" />
                      Base Print Cost:
                    </span>
                    <span className="font-mono font-semibold text-zinc-700">
                      -${baseCost.toFixed(2)}
                    </span>
                  </div>
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
                    <span>Itemized Cost Details</span>
                    {showItemized ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
                  </button>

                  {showItemized && (
                    <div className="mt-1 divide-y divide-zinc-200/50 text-xs font-mono space-y-0.5 animate-in fade-in duration-150">
                      <div className="flex justify-between py-1 text-zinc-600">
                        <span>Base Item Print Cost</span>
                        <span className="font-semibold text-zinc-900">${baseCost.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between py-1 text-zinc-600">
                        <span>Provider Carrier Shipping</span>
                        <span className="font-semibold text-zinc-900">${providerShipping.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between py-1 text-zinc-600">
                        <span>Platform Selling Fee</span>
                        <span className="font-semibold text-zinc-900">${result.marketplaceFee.toFixed(2)}</span>
                      </div>
                      {includeAds && adSpend > 0 && (
                        <div className="flex justify-between py-1 text-zinc-600">
                          <span>Paid Ad Spend (CAC)</span>
                          <span className="font-semibold text-zinc-900">${adSpend.toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Target Margin Results */
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
                    <span>Platform Fee ({salesChannel.toUpperCase()}):</span>
                    <span className="font-mono font-semibold text-rose-600">-${reverseAnalysis.marketplaceFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span>POD Production Expenses:</span>
                    <span className="font-mono font-semibold text-zinc-700">-${(baseCost + providerShipping + adSpend).toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setPriceStr(recommendedPrice.toFixed(2));
                    setCalcMode("standard");
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
          label={calcMode === "standard" ? "Net Profit" : "Target Price"}
          value={calcMode === "standard" ? result.netProfit : recommendedPrice}
          subLabel={calcMode === "standard" ? "Margin" : "Est. Profit"}
          subValue={calcMode === "standard" ? result.netMarginPct : undefined}
          productCost={baseCost + providerShipping + adSpend}
          totalFees={calcMode === "standard" ? result.marketplaceFee : reverseAnalysis.marketplaceFee}
        />
      )}
    </div>
  );
}
