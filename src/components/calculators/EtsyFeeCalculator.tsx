"use client";

import { useState, useMemo, useEffect } from "react";
import { calculateEtsyFees, calculateReverseEtsyPrice } from "@/lib/formulas/etsy-fees";
import { ETSY_FEE_PRESETS } from "@/data/fee-presets";
import { formatCurrency, formatPercent, cn } from "@/lib/utils";
import { StickyResultBar } from "./StickyResultBar";
import { CustomSelect } from "@/components/common/CustomSelect";
import { ChevronDown, ChevronUp, Copy, Check, Info, ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

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
  nl: { symbol: "€", label: "EUR (€) - Netherlands" },
  it: { symbol: "€", label: "EUR (€) - Italy" },
  es: { symbol: "€", label: "EUR (€) - Spain" },
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

export function EtsyFeeCalculator({ initialCountry = "us", isEmbed = false }: EtsyFeeCalculatorProps) {
  // Input states matching user reference
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

  const price = Math.max(0, parseFloat(priceStr) || 0);
  const itemCost = Math.max(0, parseFloat(costStr) || 0);
  const shippingCharged = Math.max(0, parseFloat(shippingStr) || 0);

  const formatAmount = (num: number) =>
    num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const [offsiteAds, setOffsiteAds] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const ads = new URLSearchParams(window.location.search).get("ads");
      if (ads === "true" || ads === "1") return true;
      if (ads === "false" || ads === "0") return false;
    }
    return false; // Default OFF per CRITIQUE-12
  });

  const [adsTier, setAdsTier] = useState<0.15 | 0.12>(0.15);
  const [applySalesTax, setApplySalesTax] = useState<boolean>(false);
  const [salesTaxPct, setSalesTaxPct] = useState<number>(7.5);

  // Mobile accordion toggle for inputs
  const [inputsOpen, setInputsOpen] = useState<boolean>(true);

  // Advanced options toggle
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [isInternational, setIsInternational] = useState<boolean>(false);

  // Results toggle for itemized drawer
  const [showItemized, setShowItemized] = useState<boolean>(false);
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);

  // Mode switcher: Standard Profit vs Reverse Target Pricing
  const [calcMode, setCalcMode] = useState<"standard" | "reverse">("standard");
  const [targetType, setTargetType] = useState<"dollar" | "margin">("dollar");
  const [targetValStr, setTargetValStr] = useState<string>("15.00");
  const targetVal = Math.max(0, parseFloat(targetValStr) || 0);

  // Active currency info
  const curr = CURRENCY_MAP[country] || CURRENCY_MAP.us;

  // Calculation using pure math engine
  const isZeroInput = price === 0 && shippingCharged === 0 && itemCost === 0 && shippingCost === 0;

  const result = useMemo(() => {
    if (isZeroInput) {
      return {
        grossRevenue: 0,
        listingFee: 0,
        transactionFee: 0,
        paymentProcessingFee: 0,
        regulatoryFee: 0,
        offsiteAdsFee: 0,
        totalFees: 0,
        effectiveFeePct: 0,
        totalProductCosts: 0,
        etsyPayout: 0,
        netProfit: 0,
        netMarginPct: 0,
        roiPct: 0,
        breakEvenPrice: 0,
        breakdown: [],
        dataSnippet: "Enter price and costs to calculate net earnings.",
      };
    }
    return calculateEtsyFees({
      itemPrice: price,
      shippingCharge: shippingCharged,
      itemCost,
      shippingCost,
      quantity,
      country,
      isInternationalBuyer: isInternational,
      offsiteAdsOptIn: offsiteAds,
      offsiteAdsRate: adsTier,
    });
  }, [price, shippingCharged, itemCost, shippingCost, quantity, country, isInternational, offsiteAds, adsTier, isZeroInput]);

  // Reverse price finder calculation
  const reverseResult = useMemo(() => {
    return calculateReverseEtsyPrice({
      targetProfitType: targetType,
      targetValue: targetVal,
      itemCost,
      shippingCost,
      shippingCharge: shippingCharged,
      quantity,
      country,
      isInternationalBuyer: isInternational,
      offsiteAdsOptIn: offsiteAds,
      offsiteAdsRate: adsTier,
    });
  }, [targetType, targetVal, itemCost, shippingCost, shippingCharged, quantity, country, isInternational, offsiteAds, adsTier]);

  // Track calculator usage
  useEffect(() => {
    const timer = setTimeout(() => {
      trackEvent({
        name: "calculator_used",
        params: { tool_slug: "etsy-fee-calculator", preset: country },
      });
    }, 1500);
    return () => clearTimeout(timer);
  }, [price, country, offsiteAds, itemCost]);

  // Relative percentages for progress breakdown bar (based on total gross revenue)
  const totalRevenue = Math.max(0.01, result.grossRevenue);
  const costTotal = Math.max(0, result.totalProductCosts);
  const feesTotal = Math.max(0, result.totalFees);
  const profitTotal = Math.max(0, result.netProfit);
  
  // Percentages are relative to total gross revenue so they sum to 100% and align with net margin
  const costPct = (costTotal / totalRevenue) * 100;
  const feesPct = (feesTotal / totalRevenue) * 100;
  const profitPct = (profitTotal / totalRevenue) * 100;

  // Normalized percentages for the bar itself
  const barSum = (costTotal + feesTotal + profitTotal) > 0 ? (costTotal + feesTotal + profitTotal) : 1;
  const barCostShare = (costTotal / barSum) * 100;
  const barFeesShare = (feesTotal / barSum) * 100;
  const barProfitShare = (profitTotal / barSum) * 100;

  const handleCopySummary = () => {
    const summary = `Etsy Calculation Summary
---------------------------------
Item Price:      ${curr.symbol}${price.toFixed(2)}
Product Cost:    ${curr.symbol}${itemCost.toFixed(2)}
Shipping (Buyer): ${curr.symbol}${shippingCharged.toFixed(2)}
Offsite Ads:     ${offsiteAds ? (adsTier * 100) + "%" : "Off"}
---------------------------------
Total Fees:      ${curr.symbol}${result.totalFees.toFixed(2)} (${result.effectiveFeePct}%)
Etsy Payout:     ${curr.symbol}${result.etsyPayout.toFixed(2)}
NET PROFIT:      ${curr.symbol}${result.netProfit.toFixed(2)} (${result.netMarginPct}% margin)
Break-Even:      ${curr.symbol}${result.breakEvenPrice.toFixed(2)}
---------------------------------
Calculated on CalcDial: ${typeof window !== "undefined" ? window.location.href : "https://calcdial.com"}`;

    navigator.clipboard.writeText(summary);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 lg:gap-5 lg:grid-cols-12 items-start">
        {/* ========================================================= */}
        {/* LEFT CARD: Input Details                                  */}
        {/* ========================================================= */}
        <div className="lg:col-span-7 rounded-xl sm:rounded-2xl border border-zinc-200/90 bg-white p-3.5 sm:p-5 shadow-xs space-y-3">
          <div className="flex flex-wrap items-center justify-between pb-2 border-b border-zinc-150 gap-2">
            <div className="inline-flex items-center gap-1 bg-zinc-100 p-1 rounded-lg border border-zinc-200">
              <button
                type="button"
                onClick={() => setCalcMode("standard")}
                className={cn(
                  "px-3 py-2 min-h-11 text-xs font-semibold rounded-md transition-all cursor-pointer inline-flex items-center justify-center",
                  calcMode === "standard"
                    ? "bg-white text-zinc-950 shadow-2xs font-bold"
                    : "text-zinc-600 hover:text-zinc-950"
                )}
              >
                Standard Profit
              </button>
              <button
                type="button"
                onClick={() => setCalcMode("reverse")}
                className={cn(
                  "px-3 py-2 min-h-11 text-xs font-semibold rounded-md transition-all cursor-pointer inline-flex items-center justify-center",
                  calcMode === "reverse"
                    ? "bg-white text-zinc-950 shadow-2xs font-bold"
                    : "text-zinc-600 hover:text-zinc-950"
                )}
              >
                Reverse Pricing
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setPriceStr("25.00");
                  setCostStr("8.00");
                  setShippingStr("0.00");
                  setTargetValStr("15.00");
                  setOffsiteAds(false);
                  setAdsTier(0.15);
                  setApplySalesTax(false);
                  setCountry("us");
                }}
                className="inline-flex items-center justify-center min-h-11 px-2.5 text-xs font-sans font-semibold text-zinc-500 hover:text-zinc-950 transition-colors cursor-pointer rounded-lg hover:bg-zinc-100"
                title="Reset values to defaults"
                aria-label="Reset values to defaults"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setInputsOpen(!inputsOpen)}
                className="p-2 min-h-11 min-w-11 inline-flex items-center justify-center text-zinc-400 hover:text-zinc-700 sm:hidden"
                aria-label="Toggle inputs"
              >
                {inputsOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
              </button>
            </div>
          </div>

          {inputsOpen && (
            <div className="space-y-3 pt-1">
              {/* Currency Dropdown */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-zinc-950">
                  Currency
                </label>
                <CustomSelect
                  value={country}
                  options={CURRENCY_OPTIONS}
                  onChange={(val) => setCountry(val)}
                />
              </div>

              {/* Standard: Item Price Input */}
              {calcMode === "standard" ? (
                <div className="flex flex-col gap-1">
                  <label htmlFor="etsy-item-price" className="text-[11px] font-bold text-zinc-950 cursor-pointer">
                    Item Price <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative flex items-center min-h-11 rounded-lg border border-zinc-300 bg-white transition-all hover:border-zinc-400 focus-within:border-zinc-950 focus-within:ring-1 focus-within:ring-zinc-950">
                    <span className="pl-3 pr-1 text-xs sm:text-sm font-mono font-bold text-zinc-600 select-none">
                      {curr.symbol}
                    </span>
                    <input
                      id="etsy-item-price"
                      name="itemPrice"
                      aria-label="Item Retail Price"
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
              ) : (
                /* Reverse: Desired Profit / Margin Input */
                <div className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-3 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-950">
                      Target Profit Goal <span className="text-rose-600">*</span>
                    </span>
                    <div className="inline-flex rounded-lg border border-zinc-200 bg-white p-0.5 text-[11px] font-semibold">
                      <button
                        type="button"
                        onClick={() => setTargetType("dollar")}
                        className={cn(
                          "px-2.5 py-1 min-h-9 rounded-md transition-all cursor-pointer whitespace-nowrap",
                          targetType === "dollar"
                            ? "bg-blue-600 text-white font-bold"
                            : "text-zinc-600 hover:text-zinc-950"
                        )}
                      >
                        Net Profit ({curr.symbol})
                      </button>
                      <button
                        type="button"
                        onClick={() => setTargetType("margin")}
                        className={cn(
                          "px-2.5 py-1 min-h-9 rounded-md transition-all cursor-pointer whitespace-nowrap",
                          targetType === "margin"
                            ? "bg-blue-600 text-white font-bold"
                            : "text-zinc-600 hover:text-zinc-950"
                        )}
                      >
                        Margin (%)
                      </button>
                    </div>
                  </div>

                  <div className="relative flex items-center min-h-11 rounded-lg border border-zinc-300 bg-white transition-all hover:border-zinc-400 focus-within:border-zinc-950 focus-within:ring-1 focus-within:ring-zinc-950">
                    <span className="pl-3 pr-1 text-xs sm:text-sm font-mono font-bold text-zinc-600 select-none">
                      {targetType === "dollar" ? curr.symbol : "%"}
                    </span>
                    <input
                      id="etsy-target-val"
                      name="targetVal"
                      aria-label="Target Profit Goal"
                      type="number"
                      inputMode="decimal"
                      min={0}
                      step="any"
                      value={targetValStr}
                      onChange={(e) => setTargetValStr(e.target.value)}
                      onFocus={(e) => {
                        if (e.target.value === "0.00" || e.target.value === "0") {
                          e.target.select();
                        }
                      }}
                      onBlur={() => {
                        const num = parseFloat(targetValStr);
                        if (!isNaN(num) && num >= 0) setTargetValStr(num.toFixed(2));
                        else if (!targetValStr) setTargetValStr("0.00");
                      }}
                      placeholder={targetType === "dollar" ? "15.00" : "35.00"}
                      className="h-9 w-full rounded-lg bg-transparent px-2 text-xs sm:text-sm font-mono font-bold text-zinc-950 placeholder-zinc-400 focus:outline-hidden"
                    />
                  </div>
                  <p className="text-[11px] text-zinc-600 leading-normal">
                    {targetType === "dollar"
                      ? `Desired take-home profit after all Etsy fees and product costs are paid.`
                      : `Desired net profit margin percentage on total gross revenue.`}
                  </p>
                </div>
              )}

              {/* Product Cost Input */}
              <div className="flex flex-col gap-1">
                <label htmlFor="etsy-product-cost" className="text-[11px] font-bold text-zinc-950 cursor-pointer">
                  Product Cost
                </label>
                <div className="relative flex items-center min-h-11 rounded-lg border border-zinc-300 bg-white transition-all hover:border-zinc-400 focus-within:border-zinc-950 focus-within:ring-1 focus-within:ring-zinc-950">
                  <span className="pl-3 pr-1 text-xs sm:text-sm font-mono font-bold text-zinc-600 select-none">
                    {curr.symbol}
                  </span>
                  <input
                    id="etsy-product-cost"
                    name="productCost"
                    aria-label="Product Cost"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step="any"
                    value={costStr}
                    onChange={(e) => setCostStr(e.target.value)}
                    onFocus={(e) => {
                      if (e.target.value === "0.00" || e.target.value === "0") {
                        e.target.select();
                      }
                    }}
                    onBlur={() => {
                      const num = parseFloat(costStr);
                      if (!isNaN(num) && num >= 0) setCostStr(num.toFixed(2));
                      else if (!costStr) setCostStr("0.00");
                    }}
                    placeholder="0.00"
                    className="h-11 min-h-11 w-full rounded-lg bg-transparent px-2 text-xs sm:text-sm font-mono font-bold text-zinc-950 placeholder-zinc-400 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Shipping Charge (to buyer) */}
              <div className="flex flex-col gap-1">
                <label htmlFor="etsy-shipping-charge" className="text-[11px] font-bold text-zinc-950 cursor-pointer">
                  Shipping Charge (to buyer)
                </label>
                <div className="relative flex items-center min-h-11 rounded-lg border border-zinc-300 bg-white transition-all hover:border-zinc-400 focus-within:border-zinc-950 focus-within:ring-1 focus-within:ring-zinc-950">
                  <span className="pl-3 pr-1 text-xs sm:text-sm font-mono font-bold text-zinc-600 select-none">
                    {curr.symbol}
                  </span>
                  <input
                    id="etsy-shipping-charge"
                    name="shippingCharge"
                    aria-label="Shipping Charge to Buyer"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step="any"
                    value={shippingStr}
                    onChange={(e) => setShippingStr(e.target.value)}
                    onFocus={(e) => {
                      if (e.target.value === "0.00" || e.target.value === "0") {
                        e.target.select();
                      }
                    }}
                    onBlur={() => {
                      const num = parseFloat(shippingStr);
                      if (!isNaN(num) && num >= 0) setShippingStr(num.toFixed(2));
                      else if (!shippingStr) setShippingStr("0.00");
                    }}
                    placeholder="0.00"
                    className="h-11 min-h-11 w-full rounded-lg bg-transparent px-2 text-xs sm:text-sm font-mono font-bold text-zinc-950 placeholder-zinc-400 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Toggle 1: Include Etsy Offsite Ads */}
              <div className="pt-2 border-t border-zinc-100">
                <div className="flex items-center justify-between">
                  <div>
                    <label
                      htmlFor="toggle-offsite-ads"
                      className="text-xs font-semibold text-zinc-950 block cursor-pointer"
                    >
                      Etsy Offsite Ads
                    </label>
                    <p className="text-[11px] text-zinc-500 font-sans">
                      Only applies if Etsy drives the sale via Offsite Ads (12–15%). Most sellers leave this off.
                    </p>
                  </div>

                  {/* iOS-Style Toggle Switch */}
                  <button
                    type="button"
                    id="toggle-offsite-ads"
                    role="switch"
                    aria-checked={offsiteAds}
                    onClick={() => setOffsiteAds(!offsiteAds)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                      offsiteAds ? "bg-blue-600" : "bg-zinc-200"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block size-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                        offsiteAds ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Offsite Ads Rate Tier Selection (Sleek Segmented Pill) */}
                {offsiteAds && (
                  <div className="mt-2.5 inline-flex rounded-lg bg-zinc-100 p-0.5 text-xs font-sans">
                    <button
                      type="button"
                      onClick={() => setAdsTier(0.15)}
                      className={cn(
                        "px-2.5 py-1 rounded-md transition-all cursor-pointer text-xs",
                        adsTier === 0.15
                          ? "bg-blue-600 font-bold text-white shadow-2xs"
                          : "text-zinc-600 hover:text-zinc-950 font-medium"
                      )}
                    >
                      15% Standard (Under $10k/yr)
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdsTier(0.12)}
                      className={cn(
                        "px-2.5 py-1 rounded-md transition-all cursor-pointer text-xs",
                        adsTier === 0.12
                          ? "bg-blue-600 font-bold text-white shadow-2xs"
                          : "text-zinc-600 hover:text-zinc-950 font-medium"
                      )}
                    >
                      12% High Volume ($10k+)
                    </button>
                  </div>
                )}
              </div>

              {/* Toggle 2: Buyer Sales Tax */}
              <div className="pt-2 border-t border-zinc-100">
                <div className="flex items-center justify-between">
                  <div>
                    <label
                      htmlFor="toggle-sales-tax"
                      className="text-xs font-semibold text-zinc-950 block cursor-pointer"
                    >
                      Buyer Sales Tax
                    </label>
                    <p className="text-[11px] text-zinc-500 font-sans">
                      Add estimated tax to buyer total
                    </p>
                  </div>

                  {/* iOS-Style Toggle Switch */}
                  <button
                    type="button"
                    id="toggle-sales-tax"
                    role="switch"
                    aria-checked={applySalesTax}
                    onClick={() => setApplySalesTax(!applySalesTax)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                      applySalesTax ? "bg-blue-600" : "bg-zinc-200"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block size-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                        applySalesTax ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {applySalesTax && (
                  <div className="mt-2 flex items-center justify-between gap-3 text-xs">
                    <span className="text-zinc-600">Estimated Tax Rate:</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={salesTaxPct}
                        onChange={(e) => setSalesTaxPct(Math.max(0, parseFloat(e.target.value) || 0))}
                        className="h-7 w-16 rounded-md border border-zinc-300 px-2 text-right font-mono text-xs font-bold text-zinc-950 focus:border-zinc-950 focus:outline-hidden"
                      />
                      <span className="text-xs font-mono font-bold text-zinc-500">%</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Advanced Options Accordion */}
              <div className="pt-2 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-zinc-950 transition-colors cursor-pointer"
                >
                  <span>{showAdvanced ? "Hide Advanced Options" : "More Options (Postage, International, Quantity)"}</span>
                  {showAdvanced ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
                </button>

                {showAdvanced && (
                  <div className="mt-2 pt-2 border-t border-zinc-100 space-y-3 animate-in fade-in duration-150">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Actual Postage Paid */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-zinc-950">
                          Actual Postage Paid to Carrier
                        </label>
                        <div className="relative flex items-center rounded-lg border border-zinc-300 bg-white hover:border-zinc-400 focus-within:border-zinc-950 focus-within:ring-1 focus-within:ring-zinc-950">
                          <span className="pl-3 pr-1 text-xs sm:text-sm font-mono font-bold text-zinc-600 select-none">{curr.symbol}</span>
                          <input
                            type="number"
                            min={0}
                            step="any"
                            value={shippingCost === 0 ? "" : shippingCost}
                            onChange={(e) => setShippingCost(Math.max(0, parseFloat(e.target.value) || 0))}
                            placeholder="0.00"
                            className="h-9 w-full bg-transparent px-2 text-xs sm:text-sm font-mono font-bold text-zinc-950 placeholder-zinc-400 focus:outline-hidden"
                          />
                        </div>
                      </div>

                      {/* Quantity */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-zinc-950">
                          Order Quantity
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={100}
                          value={quantity}
                          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                          className="h-9 w-full rounded-lg border border-zinc-300 bg-white px-3 text-xs sm:text-sm font-mono font-bold text-zinc-950 hover:border-zinc-400 focus:outline-hidden focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950"
                        />
                      </div>
                    </div>

                    {/* International Toggle */}
                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <span className="text-xs font-semibold text-zinc-950">International Buyer</span>
                        <p className="text-[11px] text-zinc-500">Adds 1% cross-border processing fee</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsInternational(!isInternational)}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                          isInternational ? "bg-blue-600" : "bg-zinc-200"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block size-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                            isInternational ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* RIGHT CARD: Results (Standalone Hero Card)                */}
        {/* ========================================================= */}
        <div className="hidden lg:block lg:col-span-5 rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-xs lg:sticky lg:top-24">
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 border-b border-zinc-100">
            <h3 className="text-sm sm:text-base font-bold tracking-tight text-zinc-950">
              {calcMode === "standard" ? "Results" : "Target Pricing Results"}
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

          {calcMode === "standard" ? (
            /* ========================================================= */
            /* STANDARD RESULTS VIEW                                     */
            /* ========================================================= */
            <div>
              {/* Top Metrics Row - Clear Hero Focal Point */}
              <div className="py-3 border-b border-zinc-100">
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
                      title={`${curr.symbol}${formatAmount(result.netProfit)}`}
                    >
                      {curr.symbol}{formatAmount(result.netProfit)}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="block text-xs font-semibold text-zinc-600 mb-0.5 tracking-tight">
                      Profit Margin
                    </span>
                    <div className="text-xl sm:text-2xl lg:text-2xl xl:text-3xl font-extrabold font-mono tracking-tight text-zinc-950">
                      {result.netMarginPct.toFixed(1)}%
                    </div>
                  </div>
                </div>

                {/* Total Fees Row */}
                <div className="mt-2.5 flex items-center justify-between text-xs sm:text-sm pt-1">
                  <span className="font-sans font-semibold text-zinc-700">Total Fees</span>
                  <span className="font-mono font-bold text-zinc-950">
                    {curr.symbol}{formatAmount(result.totalFees)}
                  </span>
                </div>
              </div>

              {/* 3-Segment Horizontal Progress Breakdown Bar */}
              <div className="py-3 border-b border-zinc-200">
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-200 flex gap-0.5 shadow-inner">
                  {barCostShare > 0 && (
                    <div
                      style={{ width: `${barCostShare}%` }}
                      className="bg-blue-600 rounded-l-full transition-all duration-300"
                      title={`Product Cost: ${costPct.toFixed(1)}%`}
                    />
                  )}
                  {barFeesShare > 0 && (
                    <div
                      style={{ width: `${barFeesShare}%` }}
                      className="bg-amber-600 transition-all duration-300"
                      title={`Etsy Fees: ${feesPct.toFixed(1)}%`}
                    />
                  )}
                  {barProfitShare > 0 && (
                    <div
                      style={{ width: `${barProfitShare}%` }}
                      className="bg-emerald-600 rounded-r-full transition-all duration-300"
                      title={`Net Profit: ${profitPct.toFixed(1)}%`}
                    />
                  )}
                </div>

                {/* Itemized Legend Rows with Color Dots */}
                <div className="mt-2.5 space-y-1.5 text-xs font-sans">
                  {/* 1. Product Cost */}
                  <div className="flex items-center justify-between py-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-blue-600 shrink-0" />
                      <span className="text-zinc-900 font-semibold">Product Cost</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-zinc-950">
                        {curr.symbol}{formatAmount(costTotal)}
                      </span>
                      <span className="font-mono text-zinc-600 font-semibold w-11 text-right text-[11px]">
                        {costPct.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {/* 2. Etsy Fees (Total) */}
                  <div className="flex items-center justify-between py-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-amber-600 shrink-0" />
                      <span className="text-zinc-900 font-semibold">Etsy Fees (Total)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-zinc-950">
                        {curr.symbol}{formatAmount(feesTotal)}
                      </span>
                      <span className="font-mono text-zinc-600 font-semibold w-11 text-right text-[11px]">
                        {feesPct.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {/* 3. Net Profit */}
                  <div className="flex items-center justify-between py-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-emerald-600 shrink-0" />
                      <span className="text-zinc-900 font-semibold">Net Profit</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-zinc-950">
                        {curr.symbol}{formatAmount(profitTotal)}
                      </span>
                      <span className="font-mono text-zinc-600 font-semibold w-11 text-right text-[11px]">
                        {profitPct.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payout & Break-even Summary */}
              <div className="py-2.5 space-y-1.5 text-xs font-sans">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-700 font-semibold">Estimated Etsy Bank Deposit:</span>
                  <span className="font-mono font-bold text-zinc-950">
                    {curr.symbol}{formatAmount(result.etsyPayout)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-700 font-semibold">Break-Even Floor Price:</span>
                  <span className="font-mono font-bold text-zinc-950 truncate" title={`${curr.symbol}${formatAmount(result.breakEvenPrice)}`}>
                    {curr.symbol}{formatAmount(result.breakEvenPrice)}
                  </span>
                </div>
              </div>

              {/* Detailed Itemized Fee Breakdown Accordion */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowItemized(!showItemized)}
                  className="w-full flex items-center justify-between py-1.5 text-[11px] font-semibold text-zinc-500 hover:text-zinc-950 transition-colors cursor-pointer border-t border-zinc-100"
                >
                  <span>Itemized Fee Breakdown</span>
                  {showItemized ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
                </button>

                {showItemized && (
                  <div className="mt-1 divide-y divide-zinc-100 text-xs font-mono space-y-0.5 animate-in fade-in duration-150">
                    <div className="flex justify-between py-1 text-zinc-600">
                      <span>Listing Fee ($0.20)</span>
                      <span className="font-semibold text-zinc-900">{curr.symbol}{formatAmount(result.listingFee)}</span>
                    </div>
                    <div className="flex justify-between py-1 text-zinc-600">
                      <span>Transaction Fee (6.5%)</span>
                      <span className="font-semibold text-zinc-900">{curr.symbol}{formatAmount(result.transactionFee)}</span>
                    </div>
                    <div className="flex justify-between py-1 text-zinc-600">
                      <span>Payment Processing</span>
                      <span className="font-semibold text-zinc-900">{curr.symbol}{formatAmount(result.paymentProcessingFee)}</span>
                    </div>
                    {offsiteAds && result.offsiteAdsFee > 0 && (
                      <div className="flex justify-between py-1 text-zinc-600">
                        <span>Offsite Ads ({(adsTier * 100).toFixed(0)}%)</span>
                        <span className="font-semibold text-zinc-900">{curr.symbol}{formatAmount(result.offsiteAdsFee)}</span>
                      </div>
                    )}
                    {result.regulatoryFee > 0 && (
                      <div className="flex justify-between py-1 text-zinc-600">
                        <span>Regulatory Operating Fee</span>
                        <span className="font-semibold text-zinc-900">{curr.symbol}{formatAmount(result.regulatoryFee)}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* ========================================================= */
            /* REVERSE PRICING RESULTS VIEW                              */
            /* ========================================================= */
            <div>
              {/* Hero Metric: Recommended Listing Price */}
              <div className="py-3 border-b border-zinc-100">
                <span className="block text-xs font-bold text-blue-700 mb-0.5 tracking-tight">
                  Recommended Listing Price
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-blue-600 truncate" title={`${curr.symbol}${formatAmount(reverseResult.recommendedPrice)}`}>
                  {curr.symbol}{formatAmount(reverseResult.recommendedPrice)}
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 rounded-lg bg-zinc-50 border border-zinc-200/80 p-2.5 text-xs font-sans">
                  <div>
                    <span className="block text-[11px] text-zinc-500 font-medium">Target Profit</span>
                    <span className="font-mono font-bold text-emerald-600">
                      {curr.symbol}{formatAmount(reverseResult.estimatedNetProfit)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[11px] text-zinc-500 font-medium">Profit Margin</span>
                    <span className="font-mono font-bold text-zinc-950">
                      {reverseResult.estimatedMarginPct.toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Apply Button */}
                <button
                  type="button"
                  onClick={() => {
                    setPriceStr(reverseResult.recommendedPrice.toFixed(2));
                    setCalcMode("standard");
                  }}
                  className="w-full mt-3 py-2 px-3 min-h-11 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-xs font-bold font-sans flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <span>Apply {curr.symbol}{formatAmount(reverseResult.recommendedPrice)} to Standard View</span>
                  <ArrowRight className="size-3.5" />
                </button>
              </div>

              {/* Deductions at Recommended Price */}
              <div className="py-2.5 space-y-1.5 text-xs font-sans">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-700 font-semibold">Total Etsy Fees:</span>
                  <span className="font-mono font-bold text-zinc-950">
                    {curr.symbol}{formatAmount(reverseResult.totalFees)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-700 font-semibold">Estimated Bank Deposit:</span>
                  <span className="font-mono font-bold text-zinc-950">
                    {curr.symbol}{formatAmount(reverseResult.etsyPayout)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-700 font-semibold">Product & Shipping Costs:</span>
                  <span className="font-mono font-bold text-zinc-950">
                    {curr.symbol}{formatAmount(itemCost + shippingCost)}
                  </span>
                </div>
              </div>

              {/* Detailed Breakdown for Reverse Calculation */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowItemized(!showItemized)}
                  className="w-full flex items-center justify-between py-1.5 text-[11px] font-semibold text-zinc-500 hover:text-zinc-950 transition-colors cursor-pointer border-t border-zinc-100"
                >
                  <span>Fee Deductions Breakdown</span>
                  {showItemized ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
                </button>

                {showItemized && (
                  <div className="mt-1 divide-y divide-zinc-100 text-xs font-mono space-y-0.5 animate-in fade-in duration-150">
                    {reverseResult.breakdown.map((item, idx) => (
                      <div key={idx} className="flex justify-between py-1 text-zinc-600">
                        <span>{item.label}</span>
                        <span className="font-semibold text-zinc-900">{curr.symbol}{item.amount.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sticky Bar */}
      {!isEmbed && (
        <StickyResultBar
          label={calcMode === "standard" ? "Net Profit" : "Target Price"}
          value={calcMode === "standard" ? result.netProfit : reverseResult.recommendedPrice}
          subLabel={calcMode === "standard" ? "Margin" : "Est. Profit"}
          subValue={calcMode === "standard" ? result.netMarginPct : undefined}
          productCost={calcMode === "standard" ? result.totalProductCosts : (itemCost + shippingCost)}
          totalFees={calcMode === "standard" ? result.totalFees : reverseResult.totalFees}
        />
      )}
    </div>
  );
}
