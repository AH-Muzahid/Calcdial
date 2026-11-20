"use client";

import { useState, useMemo, useEffect } from "react";
import { calculateEtsyFees, calculateReverseEtsyPrice } from "@/lib/formulas/etsy-fees";
import { cn, formatMoney } from "@/lib/utils";
import { StickyResultBar } from "./StickyResultBar";
import { CustomSelect } from "@/components/common/CustomSelect";
import { ChevronDown, ChevronUp, Copy, Check, RotateCcw, ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { PixelButton } from "@/components/ui/PixelButton";

interface EtsyFeeCalculatorProps {
  initialCountry?: string;
  isEmbed?: boolean;
}

const CURRENCY_MAP: Record<string, { symbol: string; label: string }> = {
  us: { symbol: "$", label: "USD ($) - United States" },
  uk: { symbol: "£", label: "GBP (£) - United Kingdom" },
  de: { symbol: "€", label: "EUR (€) - Eurozone / Germany" },
  fr: { symbol: "€", label: "EUR (€) - France" },
  ca: { symbol: "C$", label: "CAD (C$) - Canada" },
  au: { symbol: "A$", label: "AUD (A$) - Australia" },
  in: { symbol: "₹", label: "INR (₹) - India" },
};

const CURRENCY_OPTIONS = [
  { value: "us", label: "USD ($) - United States" },
  { value: "uk", label: "GBP (£) - United Kingdom" },
  { value: "de", label: "EUR (€) - Eurozone / Germany" },
  { value: "fr", label: "EUR (€) - France" },
  { value: "ca", label: "CAD (C$) - Canada" },
  { value: "au", label: "AUD (A$) - Australia" },
  { value: "in", label: "INR (₹) - India" },
];

const PRESETS = [15, 25, 35, 50, 75, 100];

export function EtsyFeeCalculator({ initialCountry = "us", isEmbed = false }: EtsyFeeCalculatorProps) {
  const [country, setCountry] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const c = new URLSearchParams(window.location.search).get("country");
      if (c && CURRENCY_MAP[c.toLowerCase()]) return c.toLowerCase();
    }
    return initialCountry.toLowerCase();
  });

  const [priceStr, setPriceStr] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search).get("price");
      if (p && !isNaN(parseFloat(p))) return parseFloat(p).toFixed(2);
    }
    return "25.00";
  });
  const [costStr, setCostStr] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const c = new URLSearchParams(window.location.search).get("cost");
      if (c && !isNaN(parseFloat(c))) return parseFloat(c).toFixed(2);
    }
    return "8.00";
  });
  const [shippingStr, setShippingStr] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const s = new URLSearchParams(window.location.search).get("shipping");
      if (s && !isNaN(parseFloat(s))) return parseFloat(s).toFixed(2);
    }
    return "0.00";
  });

  const [shippingCostStr, setShippingCostStr] = useState<string>("0.00");
  const [offsiteAds, setOffsiteAds] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const ads = new URLSearchParams(window.location.search).get("ads");
      if (ads === "true" || ads === "1") return true;
      if (ads === "false" || ads === "0") return false;
    }
    return false;
  });

  const [adsTier, setAdsTier] = useState<0.15 | 0.12>(0.15);
  const [applySalesTax, setApplySalesTax] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [isInternational, setIsInternational] = useState<boolean>(false);

  // Advanced options toggle
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [showItemized, setShowItemized] = useState<boolean>(false);
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);

  // Calculation mode: standard vs reverse
  const [calcMode, setCalcMode] = useState<"standard" | "reverse">("standard");
  const [targetType, setTargetType] = useState<"dollar" | "margin">("dollar");
  const [targetValStr, setTargetValStr] = useState<string>("15.00");

  const price = Math.max(0, parseFloat(priceStr) || 0);
  const itemCost = Math.max(0, parseFloat(costStr) || 0);
  const shippingCharged = Math.max(0, parseFloat(shippingStr) || 0);
  const shippingCost = Math.max(0, parseFloat(shippingCostStr) || 0);
  const targetVal = Math.max(0, parseFloat(targetValStr) || 0);

  const curr = CURRENCY_MAP[country] || CURRENCY_MAP.us;

  const isZeroInput = price === 0 && shippingCharged === 0 && itemCost === 0 && shippingCost === 0;

  const result = useMemo(() => {
    if (isZeroInput) {
      return {
        grossRevenue: 0,
        listingFee: 0,
        transactionFee: 0,
        paymentProcessingFee: 0,
        offsiteAdsFee: 0,
        regulatoryFee: 0,
        totalFees: 0,
        effectiveFeePct: 0,
        etsyPayout: 0,
        totalProductCosts: 0,
        totalShippingCosts: 0,
        netProfit: 0,
        netMarginPct: 0,
        roiPct: 0,
        breakEvenPrice: 0,
      };
    }
    return calculateEtsyFees({
      itemPrice: price,
      shippingCharge: shippingCharged,
      itemCost,
      shippingCost,
      quantity,
      country,
      offsiteAdsOptIn: offsiteAds,
      offsiteAdsRate: adsTier,
      isInternationalBuyer: isInternational,
    });
  }, [
    price,
    shippingCharged,
    itemCost,
    shippingCost,
    quantity,
    country,
    offsiteAds,
    adsTier,
    isInternational,
    isZeroInput,
  ]);

  const reverseResult = useMemo(() => {
    return calculateReverseEtsyPrice({
      targetProfitType: targetType,
      targetValue: targetVal,
      itemCost,
      shippingCharge: shippingCharged,
      shippingCost,
      quantity,
      country,
      offsiteAdsOptIn: offsiteAds,
      offsiteAdsRate: adsTier,
      isInternationalBuyer: isInternational,
    });
  }, [
    targetType,
    targetVal,
    itemCost,
    shippingCharged,
    shippingCost,
    quantity,
    country,
    offsiteAds,
    adsTier,
    isInternational,
  ]);

  // Synchronize URL parameters
  useEffect(() => {
    if (typeof window === "undefined" || isEmbed) return;
    const params = new URLSearchParams(window.location.search);
    if (price > 0) params.set("price", price.toString());
    else params.delete("price");
    if (itemCost > 0) params.set("cost", itemCost.toString());
    else params.delete("cost");
    if (shippingCharged > 0) params.set("shipping", shippingCharged.toString());
    else params.delete("shipping");
    if (offsiteAds) params.set("ads", "true");
    else params.delete("ads");
    if (country !== "us") params.set("country", country);
    else params.delete("country");

    const newQuery = params.toString();
    const newUrl = `${window.location.pathname}${newQuery ? `?${newQuery}` : ""}`;
    window.history.replaceState(null, "", newUrl);
  }, [price, itemCost, shippingCharged, offsiteAds, country, isEmbed]);

  const handleCopySummary = () => {
    trackEvent({
      name: "result_copied",
      params: { tool_slug: "etsy-fee-calculator", method: "clipboard" },
    });

    const summary = `Etsy Calculation Summary (${country.toUpperCase()}):
---------------------------------
Item Price:      ${formatMoney(price, curr.symbol)}
Item Cost:       ${formatMoney(itemCost, curr.symbol)}
Buyer Shipping:  ${formatMoney(shippingCharged, curr.symbol)}
Offsite Ads:     ${offsiteAds ? adsTier * 100 + "%" : "Off"}
---------------------------------
Total Fees:      ${formatMoney(result.totalFees, curr.symbol)} (${result.effectiveFeePct.toFixed(1)}%)
Etsy Payout:     ${formatMoney(result.etsyPayout, curr.symbol)}
NET PROFIT:      ${formatMoney(result.netProfit, curr.symbol)} (${result.netMarginPct.toFixed(1)}% margin)
Break-Even:      ${formatMoney(result.breakEvenPrice, curr.symbol)}
---------------------------------
Calculated via CalcDial (https://calcdial.com/tools/etsy-fee-calculator)`;

    navigator.clipboard.writeText(summary);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const handleReset = () => {
    setPriceStr("25.00");
    setCostStr("8.00");
    setShippingStr("0.00");
    setShippingCostStr("0.00");
    setTargetValStr("15.00");
    setOffsiteAds(false);
    setAdsTier(0.15);
    setApplySalesTax(false);
    setQuantity(1);
    setIsInternational(false);
  };

  // Bar proportions
  const totalBar = Math.max(0.01, result.grossRevenue);
  const profitWidth = Math.min(100, Math.max(0, (result.netProfit / totalBar) * 100));
  const feesWidth = Math.min(100, Math.max(0, (result.totalFees / totalBar) * 100));
  const costWidth = Math.min(100, Math.max(0, (result.totalProductCosts / totalBar) * 100));

  return (
    <div className="w-full">
      {/* Outer Calculator Shell — Flat, Clean, Zero Gradients */}
      <div className="rounded-2xl border border-zinc-200/90 bg-white p-4 sm:p-6 shadow-sm">
        {/* Top Control Bar: Calculation Modes & Reset */}
        <div className="flex flex-wrap items-center justify-between pb-4 mb-4 border-b border-zinc-100 gap-2">
          <div className="inline-flex rounded-lg bg-zinc-100 p-1 text-xs font-sans font-semibold">
            <button
              type="button"
              onClick={() => setCalcMode("standard")}
              className={cn(
                "min-h-11 px-3.5 py-2 rounded-md transition-all cursor-pointer text-xs flex items-center justify-center gap-1.5",
                calcMode === "standard"
                  ? "bg-[#2b5cfd] text-white font-bold shadow-2xs"
                  : "text-zinc-600 hover:text-zinc-950"
              )}
            >
              Standard Profit
            </button>
            <button
              type="button"
              onClick={() => setCalcMode("reverse")}
              className={cn(
                "min-h-11 px-3.5 py-2 rounded-md transition-all cursor-pointer text-xs flex items-center justify-center gap-1.5",
                calcMode === "reverse"
                  ? "bg-[#2b5cfd] text-white font-bold shadow-2xs"
                  : "text-zinc-600 hover:text-zinc-950"
              )}
            >
              Reverse Target Price
            </button>
          </div>

          <div className="w-40 sm:w-48">
            <CustomSelect
              value={country}
              options={CURRENCY_OPTIONS}
              onChange={(val) => setCountry(val)}
            />
          </div>
        </div>

        {/* 2-Column Responsive Layout: Inputs Card (Left) & Results Card (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
          {/* ========================================================= */}
          {/* LEFT CARD: Pricing & Cost Inputs                          */}
          {/* ========================================================= */}
          <div className="flex flex-col justify-between rounded-xl border border-zinc-200/90 bg-zinc-50/50 p-4 sm:p-5">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-200/70">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                  {calcMode === "standard" ? "Pricing & Cost Inputs" : "Target Goal Inputs"}
                </span>
                <button
                  type="button"
                  onClick={handleReset}
                  className="size-11 min-h-11 min-w-11 inline-flex items-center justify-center rounded-md text-zinc-400 hover:text-zinc-900 hover:bg-zinc-200/60 transition-colors cursor-pointer"
                  title="Reset to defaults"
                  aria-label="Reset to defaults"
                >
                  <RotateCcw className="size-3.5" />
                </button>
              </div>

              {calcMode === "standard" ? (
                <>
                  {/* 2-Column Row: Sale Price & Item Cost (1 col on mobile, 2 cols on sm+) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="etsy-sale-price" className="text-xs font-bold text-zinc-900 block mb-1">
                        Sale Price
                      </label>
                      <div className="relative flex items-center min-h-10 rounded-lg border border-zinc-300 bg-white px-2.5 transition-all focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
                        <span className="text-xs font-mono font-bold text-zinc-500 select-none mr-1">
                          {curr.symbol}
                        </span>
                        <input
                          id="etsy-sale-price"
                          type="number"
                          inputMode="decimal"
                          min={0}
                          step="any"
                          value={priceStr}
                          onChange={(e) => setPriceStr(e.target.value)}
                          onFocus={(e) => {
                            if (e.target.value === "0.00" || e.target.value === "0") e.target.select();
                          }}
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
                      <label htmlFor="etsy-item-cost" className="text-xs font-bold text-zinc-900 block mb-1">
                        Item Cost (COGS)
                      </label>
                      <div className="relative flex items-center min-h-10 rounded-lg border border-zinc-300 bg-white px-2.5 transition-all focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
                        <span className="text-xs font-mono font-bold text-zinc-500 select-none mr-1">
                          {curr.symbol}
                        </span>
                        <input
                          id="etsy-item-cost"
                          type="number"
                          inputMode="decimal"
                          min={0}
                          step="any"
                          value={costStr}
                          onChange={(e) => setCostStr(e.target.value)}
                          onFocus={(e) => {
                            if (e.target.value === "0.00" || e.target.value === "0") e.target.select();
                          }}
                          onBlur={() => {
                            const num = parseFloat(costStr);
                            if (!isNaN(num) && num >= 0) setCostStr(num.toFixed(2));
                            else if (!costStr) setCostStr("0.00");
                          }}
                          placeholder="0.00"
                          className="w-full bg-transparent font-mono font-bold text-sm text-zinc-950 focus:outline-hidden"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Quick Preset Buttons — Single line horizontal row without wrapping, NO redundant "Presets:" label */}
                  <div className="overflow-x-auto no-scrollbar py-1">
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                      {PRESETS.map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPriceStr(p.toFixed(2))}
                          className={cn(
                            "px-3 py-2 min-h-11 min-w-11 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer shrink-0 flex items-center justify-center",
                            price === p
                              ? "bg-[#2b5cfd] text-white shadow-xs font-bold"
                              : "bg-white border border-zinc-200/90 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
                          )}
                        >
                          {curr.symbol}{p}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2-Column Row: Shipping Charged & Actual Postage (1 col on mobile, 2 cols on sm+) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label htmlFor="etsy-shipping-charged" className="text-xs font-bold text-zinc-900 block mb-1">
                        Buyer Shipping Fee
                      </label>
                      <div className="relative flex items-center min-h-10 rounded-lg border border-zinc-300 bg-white px-2.5 transition-all focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
                        <span className="text-xs font-mono font-bold text-zinc-500 select-none mr-1">
                          {curr.symbol}
                        </span>
                        <input
                          id="etsy-shipping-charged"
                          type="number"
                          inputMode="decimal"
                          min={0}
                          step="any"
                          value={shippingStr}
                          onChange={(e) => setShippingStr(e.target.value)}
                          onBlur={() => {
                            const num = parseFloat(shippingStr);
                            if (!isNaN(num) && num >= 0) setShippingStr(num.toFixed(2));
                            else if (!shippingStr) setShippingStr("0.00");
                          }}
                          placeholder="0.00"
                          className="w-full bg-transparent font-mono font-bold text-sm text-zinc-950 focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="etsy-shipping-cost" className="text-xs font-bold text-zinc-900 block mb-1">
                        Carrier Cost Paid
                      </label>
                      <div className="relative flex items-center min-h-10 rounded-lg border border-zinc-300 bg-white px-2.5 transition-all focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
                        <span className="text-xs font-mono font-bold text-zinc-500 select-none mr-1">
                          {curr.symbol}
                        </span>
                        <input
                          id="etsy-shipping-cost"
                          type="number"
                          inputMode="decimal"
                          min={0}
                          step="any"
                          value={shippingCostStr}
                          onChange={(e) => setShippingCostStr(e.target.value)}
                          onBlur={() => {
                            const num = parseFloat(shippingCostStr);
                            if (!isNaN(num) && num >= 0) setShippingCostStr(num.toFixed(2));
                            else if (!shippingCostStr) setShippingCostStr("0.00");
                          }}
                          placeholder="0.00"
                          className="w-full bg-transparent font-mono font-bold text-sm text-zinc-950 focus:outline-hidden"
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                /* Reverse Pricing Inputs */
                <div className="space-y-3">
                  <div className="rounded-lg border border-zinc-200/80 bg-white p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-900">Target Profit Metric</span>
                      <div className="inline-flex rounded-md bg-zinc-100 p-0.5 text-xs font-semibold">
                        <button
                          type="button"
                          onClick={() => setTargetType("dollar")}
                          className={cn(
                            "px-2.5 py-1 rounded text-[11px] transition-all cursor-pointer",
                            targetType === "dollar" ? "bg-[#2b5cfd] text-white shadow-2xs font-bold" : "text-zinc-600"
                          )}
                        >
                          Net Profit ({curr.symbol})
                        </button>
                        <button
                          type="button"
                          onClick={() => setTargetType("margin")}
                          className={cn(
                            "px-2.5 py-1 rounded text-[11px] transition-all cursor-pointer",
                            targetType === "margin" ? "bg-[#2b5cfd] text-white shadow-2xs font-bold" : "text-zinc-600"
                          )}
                        >
                          Margin (%)
                        </button>
                      </div>
                    </div>

                    <div className="relative flex items-center min-h-10 rounded-lg border border-zinc-300 bg-white px-2.5 transition-all focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
                      <span className="text-xs font-mono font-bold text-zinc-500 select-none mr-1">
                        {targetType === "dollar" ? curr.symbol : "%"}
                      </span>
                      <input
                        type="number"
                        inputMode="decimal"
                        min={0}
                        step="any"
                        value={targetValStr}
                        onChange={(e) => setTargetValStr(e.target.value)}
                        placeholder={targetType === "dollar" ? "15.00" : "30.00"}
                        className="w-full bg-transparent font-mono font-bold text-sm text-zinc-950 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  {/* 2-Column Cost Inputs for Reverse Mode (1 col on mobile, 2 cols on sm+) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-zinc-900 block mb-1">Item Cost</label>
                      <div className="relative flex items-center min-h-10 rounded-lg border border-zinc-300 bg-white px-2.5 transition-all focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
                        <span className="text-xs font-mono font-bold text-zinc-500 select-none mr-1">{curr.symbol}</span>
                        <input
                          type="number"
                          value={costStr}
                          onChange={(e) => setCostStr(e.target.value)}
                          className="w-full bg-transparent font-mono font-bold text-sm text-zinc-950 focus:outline-hidden"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-zinc-900 block mb-1">Carrier Cost</label>
                      <div className="relative flex items-center min-h-10 rounded-lg border border-zinc-300 bg-white px-2.5 transition-all focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
                        <span className="text-xs font-mono font-bold text-zinc-500 select-none mr-1">{curr.symbol}</span>
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

              {/* Toggles: Flat, Clean, No Clutter */}
              <div className="space-y-2 pt-1">
                {/* Toggle 1: Offsite Ads */}
                <div className="rounded-lg border border-zinc-200/80 bg-white p-2.5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-zinc-900 block truncate">
                      Include 15% Offsite Ads
                    </span>
                    <span className="text-[10px] text-zinc-500 font-sans block truncate">
                      Mandatory for shops over $10k/yr
                    </span>
                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={offsiteAds}
                    onClick={() => setOffsiteAds(!offsiteAds)}
                    className={cn(
                      "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden",
                      offsiteAds ? "bg-blue-600" : "bg-zinc-200"
                    )}
                  >
                    <span
                      className={cn(
                        "pointer-events-none inline-block size-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out",
                        offsiteAds ? "translate-x-4" : "translate-x-0"
                      )}
                    />
                  </button>
                </div>

                {/* If Offsite Ads ON, select tier */}
                {offsiteAds && (
                  <div className="flex items-center justify-between text-xs px-2.5 py-1 bg-white rounded-lg border border-zinc-200/60">
                    <span className="text-zinc-600 font-medium">Offsite Ad Fee Tier:</span>
                    <div className="inline-flex rounded-md bg-zinc-100 p-0.5">
                      <button
                        type="button"
                        onClick={() => setAdsTier(0.15)}
                        className={cn(
                          "px-2 py-0.5 text-[10px] font-bold rounded cursor-pointer transition-all",
                          adsTier === 0.15 ? "bg-[#2b5cfd] text-white shadow-2xs" : "text-zinc-600 hover:text-zinc-950"
                        )}
                      >
                        15% (Under $10k)
                      </button>
                      <button
                        type="button"
                        onClick={() => setAdsTier(0.12)}
                        className={cn(
                          "px-2 py-0.5 text-[10px] font-bold rounded cursor-pointer transition-all",
                          adsTier === 0.12 ? "bg-[#2b5cfd] text-white shadow-2xs" : "text-zinc-600 hover:text-zinc-950"
                        )}
                      >
                        12% (Over $10k)
                      </button>
                    </div>
                  </div>
                )}

                {/* Advanced Options Accordion */}
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full flex items-center justify-between py-1.5 px-1 text-xs font-semibold text-zinc-600 hover:text-zinc-950 transition-colors cursor-pointer"
                >
                  <span>{showAdvanced ? "Hide Advanced Options" : "More Options (Tax, Quantity, International)"}</span>
                  {showAdvanced ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
                </button>

                {showAdvanced && (
                  <div className="rounded-lg border border-zinc-200/80 bg-white p-3 space-y-2.5">
                    {/* Order Quantity */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-zinc-900">Order Quantity</span>
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-16 h-8 text-center rounded-md border border-zinc-300 font-mono font-bold text-xs"
                      />
                    </div>

                    {/* Sales Tax */}
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-zinc-100">
                      <span className="font-semibold text-zinc-900">Sales Tax Calculation</span>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={applySalesTax}
                        onClick={() => setApplySalesTax(!applySalesTax)}
                        className={cn(
                          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden",
                          applySalesTax ? "bg-blue-600" : "bg-zinc-200"
                        )}
                      >
                        <span
                          className={cn(
                            "pointer-events-none inline-block size-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out",
                            applySalesTax ? "translate-x-4" : "translate-x-0"
                          )}
                        />
                      </button>
                    </div>

                    {/* International */}
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-zinc-100">
                      <div>
                        <span className="font-semibold text-zinc-900 block">International Buyer</span>
                        <span className="text-[10px] text-zinc-500">+1% cross-border processing</span>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={isInternational}
                        onClick={() => setIsInternational(!isInternational)}
                        className={cn(
                          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden",
                          isInternational ? "bg-blue-600" : "bg-zinc-200"
                        )}
                      >
                        <span
                          className={cn(
                            "pointer-events-none inline-block size-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out",
                            isInternational ? "translate-x-4" : "translate-x-0"
                          )}
                        />
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
                      "text-xs font-mono font-bold",
                      result.netProfit >= 0 ? "text-emerald-700" : "text-rose-600"
                    )}
                  >
                    {result.netMarginPct.toFixed(1)}% margin
                  </span>
                </div>

                {/* Big Profit Hero Metric */}
                <div>
                  <div
                    className={cn(
                      "text-2xl sm:text-3xl lg:text-4xl font-extrabold font-mono tracking-tight tabular-nums",
                      result.netProfit >= 0 ? "text-emerald-600" : "text-rose-600"
                    )}
                  >
                    {formatMoney(result.netProfit, curr.symbol)}
                  </div>
                  <span className="text-[11px] text-zinc-500 font-sans block mt-0.5 tabular-nums">
                    Est. Etsy payout after cuts: {formatMoney(result.etsyPayout, curr.symbol)}
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
                      title="Etsy Fees"
                    />
                    <div
                      style={{ width: `${costWidth}%` }}
                      className="bg-zinc-400 h-full transition-all duration-300"
                      title="Product & Shipping Costs"
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
                      Fees ({result.effectiveFeePct.toFixed(0)}%)
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <span className="size-1.5 rounded-full bg-zinc-400" />
                      Cost
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
                    <span className="font-mono font-semibold text-zinc-900 tabular-nums">
                      {formatMoney(result.grossRevenue, curr.symbol)}
                    </span>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span className="flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-rose-500" />
                      Total Etsy Fees:
                    </span>
                    <span className="font-mono font-semibold text-rose-600 tabular-nums">
                      -{formatMoney(result.totalFees, curr.symbol)}
                    </span>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span className="flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-zinc-400" />
                      Product Costs:
                    </span>
                    <span className="font-mono font-semibold text-zinc-700 tabular-nums">
                      -{formatMoney(result.totalProductCosts, curr.symbol)}
                    </span>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span className="flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-zinc-400" />
                      Break-Even Floor:
                    </span>
                    <span className="font-mono font-semibold text-zinc-900 tabular-nums">
                      {formatMoney(result.breakEvenPrice, curr.symbol)}
                    </span>
                  </div>
                </div>

                {/* Collapsible Itemized Fee Drawer */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setShowItemized(!showItemized)}
                    className="w-full min-h-11 flex items-center justify-between py-2 text-xs font-semibold text-zinc-500 hover:text-zinc-950 transition-colors cursor-pointer border-t border-zinc-200/60"
                  >
                    <span>Itemized Fee Details</span>
                    {showItemized ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
                  </button>

                  {showItemized && (
                    <div className="mt-1 divide-y divide-zinc-200/50 text-xs font-mono space-y-0.5 animate-in fade-in duration-150">
                      <div className="flex justify-between py-1.5 text-zinc-600">
                        <span>Listing Fee ($0.20)</span>
                        <span className="font-semibold text-zinc-900 tabular-nums">{formatMoney(result.listingFee, curr.symbol)}</span>
                      </div>
                      <div className="flex justify-between py-1.5 text-zinc-600">
                        <span>Transaction Fee (6.5%)</span>
                        <span className="font-semibold text-zinc-900 tabular-nums">{formatMoney(result.transactionFee, curr.symbol)}</span>
                      </div>
                      <div className="flex justify-between py-1.5 text-zinc-600">
                        <span>Payment Processing</span>
                        <span className="font-semibold text-zinc-900 tabular-nums">{formatMoney(result.paymentProcessingFee, curr.symbol)}</span>
                      </div>
                      {offsiteAds && result.offsiteAdsFee > 0 && (
                        <div className="flex justify-between py-1.5 text-zinc-600">
                          <span>Offsite Ads ({(adsTier * 100).toFixed(0)}%)</span>
                          <span className="font-semibold text-zinc-900 tabular-nums">{formatMoney(result.offsiteAdsFee, curr.symbol)}</span>
                        </div>
                      )}
                      {result.regulatoryFee > 0 && (
                        <div className="flex justify-between py-1.5 text-zinc-600">
                          <span>Regulatory Fee</span>
                          <span className="font-semibold text-zinc-900 tabular-nums">{formatMoney(result.regulatoryFee, curr.symbol)}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Reverse Pricing Result */
              <div>
                <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-zinc-200/70">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
                    Recommended Listing Price
                  </span>
                  <span className="text-xs font-mono font-bold text-[#2b5cfd]">
                    Target {reverseResult.estimatedMarginPct.toFixed(1)}% margin
                  </span>
                </div>

                <div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-mono tracking-tight text-blue-600 tabular-nums">
                    {formatMoney(reverseResult.recommendedPrice, curr.symbol)}
                  </div>
                  <span className="text-[11px] text-zinc-500 font-sans block mt-0.5 tabular-nums">
                    Est. net profit: {formatMoney(reverseResult.estimatedNetProfit, curr.symbol)}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs font-sans py-2.5 my-3 border-y border-zinc-200/70">
                  <div className="flex justify-between text-zinc-600">
                    <span>Total Etsy Fees:</span>
                    <span className="font-mono font-semibold text-rose-600 tabular-nums">-{formatMoney(reverseResult.totalFees, curr.symbol)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span>Etsy Deposit:</span>
                    <span className="font-mono font-semibold text-zinc-900 tabular-nums">{formatMoney(reverseResult.etsyPayout, curr.symbol)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span>Total Direct Costs:</span>
                    <span className="font-mono font-semibold text-zinc-700 tabular-nums">-{formatMoney(itemCost + shippingCost, curr.symbol)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setPriceStr(reverseResult.recommendedPrice.toFixed(2));
                    setCalcMode("standard");
                  }}
                  className="w-full py-2.5 px-3 min-h-11 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-xs font-bold font-sans flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <span>Apply {formatMoney(reverseResult.recommendedPrice, curr.symbol)} to Standard View</span>
                  <ArrowRight className="size-3.5" />
                </button>
              </div>
            )}

            {/* Pixel Button Action for Copy / Export (min 44px ergonomics) */}
            <div className="mt-4 pt-3 border-t border-zinc-200/70">
              <PixelButton
                type="button"
                onClick={handleCopySummary}
                className="w-full min-h-11 h-11 px-4 text-xs font-semibold font-sans justify-center"
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
          value={calcMode === "standard" ? result.netProfit : reverseResult.recommendedPrice}
          subLabel={calcMode === "standard" ? "Margin" : "Est. Profit"}
          subValue={calcMode === "standard" ? result.netMarginPct : undefined}
          productCost={calcMode === "standard" ? result.totalProductCosts : itemCost + shippingCost}
          totalFees={calcMode === "standard" ? result.totalFees : reverseResult.totalFees}
          payout={calcMode === "standard" ? result.etsyPayout : reverseResult.etsyPayout}
          breakEven={calcMode === "standard" ? result.breakEvenPrice : reverseResult.recommendedPrice}
          currencySymbol={curr.symbol}
          itemizedFees={[
            { label: "Listing Fee ($0.20)", amount: result.listingFee },
            { label: "Transaction Fee (6.5%)", amount: result.transactionFee },
            { label: "Payment Processing", amount: result.paymentProcessingFee },
            ...(offsiteAds && result.offsiteAdsFee > 0 ? [{ label: `Offsite Ads (${(adsTier * 100).toFixed(0)}%)`, amount: result.offsiteAdsFee }] : []),
            ...(result.regulatoryFee > 0 ? [{ label: "Regulatory Fee", amount: result.regulatoryFee }] : []),
          ]}
        />
      )}
    </div>
  );
}
