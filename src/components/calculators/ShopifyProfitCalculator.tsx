"use client";

import { useState, useMemo, useEffect } from "react";
import {
  calculateShopifyProfit,
  ShopifyPlan,
  SHOPIFY_PLAN_RATES,
} from "@/lib/formulas/shopify-profit";
import { SHOPIFY_GATEWAY_PRESETS } from "@/data/fee-presets";
import { StickyResultBar } from "./StickyResultBar";
import { CustomSelect, CustomSelectOption } from "@/components/common/CustomSelect";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import {
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  Percent,
  DollarSign,
  Info,
} from "lucide-react";

const CURRENCY_MAP: Record<string, { label: string; symbol: string }> = {
  usd: { label: "USD ($)", symbol: "$" },
  cad: { label: "CAD (CA$)", symbol: "CA$" },
  gbp: { label: "GBP (£)", symbol: "£" },
  eur: { label: "EUR (€)", symbol: "€" },
  aud: { label: "AUD (A$)", symbol: "A$" },
};

const PLAN_OPTIONS: CustomSelectOption[] = [
  { value: "basic", label: "Basic Shopify ($39/mo)" },
  { value: "shopify", label: "Shopify ($105/mo)" },
  { value: "advanced", label: "Advanced Shopify ($399/mo)" },
  { value: "plus", label: "Shopify Plus ($2,300/mo)" },
];

const GATEWAY_OPTIONS: CustomSelectOption[] = [
  { value: "shopify-payments", label: "Shopify Payments (0% fee)" },
  { value: "stripe", label: "Stripe" },
  { value: "paypal", label: "PayPal" },
  { value: "square", label: "Square" },
  { value: "authorize-net", label: "Authorize.Net" },
  { value: "klarna", label: "Klarna" },
  { value: "afterpay", label: "Afterpay" },
  { value: "2checkout", label: "2Checkout" },
];

export function ShopifyProfitCalculator({
  initialGateway = "shopify-payments",
  isEmbed = false,
}: {
  initialGateway?: string;
  isEmbed?: boolean;
}) {
  // Mode switcher: standard vs reverse
  const [calcMode, setCalcMode] = useState<"standard" | "reverse">("standard");

  // Currency
  const [currency, setCurrency] = useState<string>("usd");
  const curr = CURRENCY_MAP[currency] || CURRENCY_MAP.usd;

  // Form State (Strings for clean input handling)
  const [priceStr, setPriceStr] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search).get("price");
      if (p && !isNaN(parseFloat(p))) return parseFloat(p).toFixed(2);
    }
    return "48.00";
  });
  const [shippingChargedStr, setShippingChargedStr] = useState<string>("0.00");
  const [cogsStr, setCogsStr] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const c = new URLSearchParams(window.location.search).get("cost");
      if (c && !isNaN(parseFloat(c))) return parseFloat(c).toFixed(2);
    }
    return "12.50";
  });
  const [shippingCostStr, setShippingCostStr] = useState<string>("4.80");
  const [adSpendStr, setAdSpendStr] = useState<string>("14.00");
  const [includeAds, setIncludeAds] = useState<boolean>(true);

  // Shopify Plan & Gateway
  const [shopifyPlan, setShopifyPlan] = useState<ShopifyPlan>("basic");
  const [gateway, setGateway] = useState<string>(initialGateway.toLowerCase());

  // Reverse Target Pricing Mode State
  const [targetType, setTargetType] = useState<"margin" | "dollar">("margin");
  const [targetValStr, setTargetValStr] = useState<string>("30");

  // UI Accordions & Copy state
  const [showItemized, setShowItemized] = useState<boolean>(false);
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);

  // Parse numeric values safely
  const itemPrice = Math.max(0, parseFloat(priceStr) || 0);
  const shippingCharged = Math.max(0, parseFloat(shippingChargedStr) || 0);
  const cogs = Math.max(0, parseFloat(cogsStr) || 0);
  const shippingCost = Math.max(0, parseFloat(shippingCostStr) || 0);
  const adSpend = includeAds ? Math.max(0, parseFloat(adSpendStr) || 0) : 0;
  const targetVal = Math.max(0, parseFloat(targetValStr) || 0);

  // Calculations
  const result = useMemo(() => {
    return calculateShopifyProfit({
      itemPrice,
      shippingCharged,
      cogs,
      shippingCost,
      adSpend,
      shopifyPlan,
      gateway,
      targetMarginPct: targetType === "margin" ? targetVal : undefined,
      targetProfitDollar: targetType === "dollar" ? targetVal : undefined,
    });
  }, [itemPrice, shippingCharged, cogs, shippingCost, adSpend, shopifyPlan, gateway, targetType, targetVal]);

  // Reverse price recommendation
  const recommendedPrice = result.recommendedPrice ?? result.breakEvenPrice;

  // Reverse view result when priced at recommendedPrice
  const reverseAnalysis = useMemo(() => {
    return calculateShopifyProfit({
      itemPrice: recommendedPrice,
      shippingCharged,
      cogs,
      shippingCost,
      adSpend,
      shopifyPlan,
      gateway,
    });
  }, [recommendedPrice, shippingCharged, cogs, shippingCost, adSpend, shopifyPlan, gateway]);

  // Analytics event
  useEffect(() => {
    const timer = setTimeout(() => {
      trackEvent({
        name: "calculator_used",
        params: {
          tool_slug: "shopify-profit-calculator",
          preset: `${shopifyPlan}-${gateway}`,
        },
      });
    }, 1500);
    return () => clearTimeout(timer);
  }, [itemPrice, gateway, shopifyPlan, adSpend]);

  const handleReset = () => {
    setPriceStr("48.00");
    setShippingChargedStr("0.00");
    setCogsStr("12.50");
    setShippingCostStr("4.80");
    setAdSpendStr("14.00");
    setIncludeAds(true);
    setShopifyPlan("basic");
    setGateway(initialGateway.toLowerCase());
    setTargetValStr("30");
  };

  const activePlanConfig = SHOPIFY_PLAN_RATES[shopifyPlan] || SHOPIFY_PLAN_RATES.basic;
  const isShopifyPayments = gateway === "shopify-payments";

  // Visual Breakdown Progress Bar Percentages
  const grossRev = result.revenue > 0 ? result.revenue : Math.max(0.01, itemPrice + shippingCharged);
  const isLoss = result.netProfit < 0;
  // If in loss, total expenses exceed gross revenue. Denominate shares by total expenses so they sum to 100% cleanly without overflow!
  const progressDenom = isLoss ? Math.max(0.01, result.totalExpenses) : grossRev;
  const costShare = Math.min(100, Math.max(0, (cogs / progressDenom) * 100));
  const shippingShare = Math.min(100, Math.max(0, (shippingCost / progressDenom) * 100));
  const feesShare = Math.min(100, Math.max(0, (result.totalPlatformFees / progressDenom) * 100));
  const adsShare = Math.min(100, Math.max(0, (adSpend / progressDenom) * 100));
  const profitShare = isLoss ? 0 : Math.max(0, Math.min(100, (result.netProfit / grossRev) * 100));

  const formatAmount = (num: number): string => {
    const isNegative = num < 0;
    const abs = Math.abs(num);
    const formatted = abs.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return isNegative ? `-${curr.symbol}${formatted}` : `${curr.symbol}${formatted}`;
  };

  const handleCopySummary = () => {
    const isStandard = calcMode === "standard";
    const text = isStandard
      ? `Shopify Profit & ROAS Analysis (2026)
----------------------------------------
Retail Price:           ${formatAmount(itemPrice)}
Shipping Charged:       ${formatAmount(shippingCharged)}
Gross Revenue:          ${formatAmount(result.revenue)}
----------------------------------------
Shopify Plan:           ${activePlanConfig.name}
Payment Gateway:        ${gateway.toUpperCase()}
Platform & Gateway Fee: ${formatAmount(result.totalPlatformFees)}
Product Landed Cost:    ${formatAmount(cogs)}
Carrier Postage:        ${formatAmount(shippingCost)}
Ad Spend (CAC):         ${formatAmount(adSpend)}
----------------------------------------
Shopify Bank Deposit:   ${formatAmount(result.netPayout)}
REAL NET PROFIT:        ${formatAmount(result.netProfit)} (${result.netMarginPct}% margin)
Break-Even ROAS:        ${result.breakEvenRoas}x
Break-Even Price:       ${formatAmount(result.breakEvenPrice)}
----------------------------------------
Calculated on CalcDial: ${typeof window !== "undefined" ? window.location.href : "https://calcdial.pages.dev/tools/shopify-profit-calculator"}`
      : `Shopify Target Price Finder (2026)
----------------------------------------
Target Goal:            ${targetType === "margin" ? `${targetVal}% Margin` : `${formatAmount(targetVal)} Net Profit`}
Recommended Price:      ${formatAmount(recommendedPrice)}
Estimated Net Profit:   ${formatAmount(reverseAnalysis.netProfit)} (${reverseAnalysis.netMarginPct}% margin)
Shopify Bank Deposit:   ${formatAmount(reverseAnalysis.netPayout)}
Total Platform Fees:    ${formatAmount(reverseAnalysis.totalPlatformFees)}
Total Direct Costs:     ${formatAmount(cogs + shippingCost + adSpend)}
----------------------------------------
Calculated on CalcDial: ${typeof window !== "undefined" ? window.location.href : "https://calcdial.pages.dev/tools/shopify-profit-calculator"}`;

    navigator.clipboard.writeText(text);
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
            <div className="inline-flex rounded-lg bg-zinc-100 p-1 text-xs font-sans">
              <button
                type="button"
                onClick={() => setCalcMode("standard")}
                className={cn(
                  "px-3 py-2 min-h-11 rounded-md font-semibold transition-all cursor-pointer text-xs whitespace-nowrap inline-flex items-center justify-center",
                  calcMode === "standard"
                    ? "bg-white text-zinc-950 font-bold shadow-2xs"
                    : "text-zinc-600 hover:text-zinc-950"
                )}
              >
                Standard Profit
              </button>
              <button
                type="button"
                onClick={() => setCalcMode("reverse")}
                className={cn(
                  "px-3 py-2 min-h-11 rounded-md font-semibold transition-all cursor-pointer text-xs whitespace-nowrap inline-flex items-center justify-center",
                  calcMode === "reverse"
                    ? "bg-white text-zinc-950 font-bold shadow-2xs"
                    : "text-zinc-600 hover:text-zinc-950"
                )}
              >
                Target Price
              </button>
            </div>

            {/* Reset Button */}
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center justify-center min-h-11 min-w-11 px-2.5 gap-1.5 text-xs font-sans font-medium text-zinc-500 hover:text-zinc-950 transition-colors cursor-pointer rounded-lg hover:bg-zinc-100"
              title="Reset values to defaults"
              aria-label="Reset values to defaults"
            >
              <RotateCcw className="size-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* Currency Selector */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-zinc-950">
              Currency
            </label>
            <CustomSelect
              value={currency}
              options={Object.entries(CURRENCY_MAP).map(([id, item]) => ({
                value: id,
                label: item.label,
              }))}
              onChange={(val) => setCurrency(val)}
            />
          </div>

          {/* ========================================================= */}
          {/* SECTION 1: Retail Price & Customer Shipping               */}
          {/* ========================================================= */}
          {calcMode === "standard" ? (
            <div className="space-y-3 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Retail Price */}
                <div className="flex flex-col gap-1">
                  <label htmlFor="shopify-retail-price" className="text-[11px] font-bold text-zinc-950 cursor-pointer">
                    Retail Price <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative flex items-center min-h-11 rounded-lg border border-zinc-300 bg-white transition-all hover:border-zinc-400 focus-within:border-zinc-950 focus-within:ring-1 focus-within:ring-zinc-950">
                    <span className="pl-3 pr-1 text-xs sm:text-sm font-mono font-bold text-zinc-600 select-none">
                      {curr.symbol}
                    </span>
                    <input
                      id="shopify-retail-price"
                      name="retailPrice"
                      aria-label="Retail Price"
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
                    <label htmlFor="shopify-shipping-charged" className="text-[11px] font-bold text-zinc-950 cursor-pointer">
                      Shipping Charged
                    </label>
                    <span className="text-[10px] text-zinc-400 font-sans">
                      Leave 0 for Free Shipping
                    </span>
                  </div>
                  <div className="relative flex items-center min-h-11 rounded-lg border border-zinc-300 bg-white transition-all hover:border-zinc-400 focus-within:border-zinc-950 focus-within:ring-1 focus-within:ring-zinc-950">
                    <span className="pl-3 pr-1 text-xs sm:text-sm font-mono font-bold text-zinc-600 select-none">
                      {curr.symbol}
                    </span>
                    <input
                      id="shopify-shipping-charged"
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
            /* REVERSE TARGET PRICING INPUTS */
            <div className="space-y-3 pt-1">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold text-zinc-950 block">
                      Target Goal <span className="text-rose-600">*</span>
                    </span>
                    <span className="text-[10px] text-zinc-400 font-sans block">
                      Minimum required to achieve your target
                    </span>
                  </div>

                  {/* Segmented Pill Toggle - whitespace-nowrap prevents 2-line break */}
                  <div className="inline-flex shrink-0 rounded-lg bg-zinc-100 p-0.5 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => {
                        setTargetType("margin");
                        setTargetValStr("30");
                      }}
                      className={cn(
                        "px-2.5 py-1 rounded-md transition-all cursor-pointer whitespace-nowrap text-xs",
                        targetType === "margin"
                          ? "bg-blue-600 text-white font-bold shadow-2xs"
                          : "text-zinc-600 hover:text-zinc-950"
                      )}
                    >
                      Margin %
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTargetType("dollar");
                        setTargetValStr("15.00");
                      }}
                      className={cn(
                        "px-2.5 py-1 rounded-md transition-all cursor-pointer whitespace-nowrap text-xs",
                        targetType === "dollar"
                          ? "bg-blue-600 text-white font-bold shadow-2xs"
                          : "text-zinc-600 hover:text-zinc-950"
                      )}
                    >
                      Net Profit ({curr.symbol})
                    </button>
                  </div>
                </div>

                <div className="relative flex items-center min-h-11 rounded-lg border border-zinc-300 bg-white transition-all hover:border-zinc-400 focus-within:border-zinc-950 focus-within:ring-1 focus-within:ring-zinc-950">
                  <span className="pl-3 pr-1 text-xs sm:text-sm font-mono font-bold text-zinc-600 select-none">
                    {targetType === "dollar" ? curr.symbol : "%"}
                  </span>
                  <input
                    id="shopify-target-val"
                    name="targetValue"
                    aria-label="Target Goal Value"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step="any"
                    value={targetValStr}
                    onChange={(e) => setTargetValStr(e.target.value)}
                    onFocus={(e) => e.target.select()}
                    placeholder={targetType === "dollar" ? "15.00" : "30"}
                    className="h-11 min-h-11 w-full rounded-lg bg-transparent px-2 text-xs sm:text-sm font-mono font-bold text-zinc-950 placeholder-zinc-400 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Shipping Charged to Buyer (Reverse mode) */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <label htmlFor="shopify-reverse-shipping-charged" className="text-[11px] font-bold text-zinc-950 cursor-pointer">
                    Shipping Charged
                  </label>
                  <span className="text-[10px] text-zinc-400 font-sans">
                    Leave 0 if Free Shipping
                  </span>
                </div>
                <div className="relative flex items-center min-h-11 rounded-lg border border-zinc-300 bg-white transition-all hover:border-zinc-400 focus-within:border-zinc-950 focus-within:ring-1 focus-within:ring-zinc-950">
                  <span className="pl-3 pr-1 text-xs sm:text-sm font-mono font-bold text-zinc-600 select-none">
                    {curr.symbol}
                  </span>
                  <input
                    id="shopify-reverse-shipping-charged"
                    name="reverseShippingCharged"
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
                  <label htmlFor="shopify-cogs" className="text-[11px] font-bold text-zinc-950 cursor-pointer">
                    Item Cost (COGS)
                  </label>
                  <span className="text-[10px] text-zinc-400 font-sans">
                    Landed cost
                  </span>
                </div>
                <div className="relative flex items-center min-h-11 rounded-lg border border-zinc-300 bg-white transition-all hover:border-zinc-400 focus-within:border-zinc-950 focus-within:ring-1 focus-within:ring-zinc-950">
                  <span className="pl-3 pr-1 text-xs sm:text-sm font-mono font-bold text-zinc-600 select-none">
                    {curr.symbol}
                  </span>
                  <input
                    id="shopify-cogs"
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

              {/* Shipping Cost */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <label htmlFor="shopify-shipping-cost" className="text-[11px] font-bold text-zinc-950 cursor-pointer">
                    Shipping Cost
                  </label>
                  <span className="text-[10px] text-zinc-400 font-sans">
                    Postage paid to carrier
                  </span>
                </div>
                <div className="relative flex items-center min-h-11 rounded-lg border border-zinc-300 bg-white transition-all hover:border-zinc-400 focus-within:border-zinc-950 focus-within:ring-1 focus-within:ring-zinc-950">
                  <span className="pl-3 pr-1 text-xs sm:text-sm font-mono font-bold text-zinc-600 select-none">
                    {curr.symbol}
                  </span>
                  <input
                    id="shopify-shipping-cost"
                    name="shippingCost"
                    aria-label="Postage Shipping Cost"
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
          {/* SECTION 3: Shopify Plan & Payment Gateway Selector        */}
          {/* ========================================================= */}
          <div className="pt-2 border-t border-zinc-100 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Shopify Plan */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-zinc-950">
                    Shopify Plan
                  </label>
                  <span className="text-[10px] text-zinc-500 font-medium font-mono">
                    {activePlanConfig.ratePct}% + 30¢
                  </span>
                </div>
                <CustomSelect
                  value={shopifyPlan}
                  options={PLAN_OPTIONS}
                  onChange={(val) => setShopifyPlan(val as ShopifyPlan)}
                />
              </div>

              {/* Payment Gateway */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-zinc-950">
                    Payment Gateway
                  </label>
                  <span className="text-[10px] text-zinc-500 font-medium">
                    {isShopifyPayments ? "0% 3rd-party fee" : `+${activePlanConfig.thirdPartyPct}% fee`}
                  </span>
                </div>
                <CustomSelect
                  value={gateway}
                  options={GATEWAY_OPTIONS}
                  onChange={(val) => setGateway(val)}
                />
              </div>
            </div>

            {/* 3rd-Party Gateway Fee Alert */}
            {!isShopifyPayments && (
              <div className="rounded-lg bg-amber-50/80 border border-amber-200/70 p-2.5 text-xs text-amber-900 flex items-start gap-2">
                <ShieldAlert className="size-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="leading-snug">
                  <span className="font-bold">Third-Party Gateway Fee: </span>
                  Shopify adds a{" "}
                  <span className="font-mono font-bold">{activePlanConfig.thirdPartyPct}%</span> fee on
                  external gateways on the <span className="font-semibold">{activePlanConfig.name.split(" ")[0]}</span> plan. Switch to Shopify Payments to avoid this fee.
                </div>
              </div>
            )}
          </div>

          {/* ========================================================= */}
          {/* SECTION 4: Customer Acquisition Cost & ROAS (CAC)         */}
          {/* ========================================================= */}
          <div className="pt-2 border-t border-zinc-100">
            <div className="flex items-center justify-between">
              <div>
                <label
                  htmlFor="toggle-ad-spend"
                  className="text-xs font-semibold text-zinc-950 block cursor-pointer"
                >
                  Include Ad Spend (CAC)
                </label>
                <p className="text-[11px] text-zinc-500 font-sans">
                  Calculate real net profit and minimum Break-Even ROAS
                </p>
              </div>

              {/* iOS style toggle switch */}
              <button
                type="button"
                id="toggle-ad-spend"
                role="switch"
                aria-checked={includeAds}
                onClick={() => setIncludeAds(!includeAds)}
                className={cn(
                  "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden",
                  includeAds ? "bg-blue-600" : "bg-zinc-200"
                )}
              >
                <span
                  className={cn(
                    "pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out",
                    includeAds ? "translate-x-5" : "translate-x-0"
                  )}
                />
              </button>
            </div>

            {includeAds && (
              <div className="mt-2.5 flex items-center justify-between gap-3 text-xs">
                <label htmlFor="shopify-ad-spend" className="text-zinc-600 font-medium cursor-pointer">
                  Ad Spend per Order:
                </label>
                <div className="relative flex items-center rounded-lg border border-zinc-300 bg-white max-w-[130px] min-h-10 transition-all hover:border-zinc-400 focus-within:border-zinc-950">
                  <span className="pl-2 pr-1 text-xs font-mono font-bold text-zinc-500 select-none">
                    {curr.symbol}
                  </span>
                  <input
                    id="shopify-ad-spend"
                    name="adSpend"
                    aria-label="Ad Spend per Order"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step="any"
                    value={adSpendStr}
                    onChange={(e) => setAdSpendStr(e.target.value)}
                    onFocus={(e) => e.target.select()}
                    onBlur={() => {
                      const num = parseFloat(adSpendStr);
                      if (!isNaN(num) && num >= 0) setAdSpendStr(num.toFixed(2));
                      else if (!adSpendStr) setAdSpendStr("0.00");
                    }}
                    placeholder="0.00"
                    className="h-10 min-h-10 w-full rounded-lg bg-transparent px-2 text-right font-mono text-xs font-bold text-zinc-950 focus:outline-hidden"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT CARD: Results (Standalone Hero Card, sticky desktop)*/}
        {/* ========================================================= */}
        <div className="hidden lg:block lg:col-span-5 rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-xs lg:sticky lg:top-24">
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 border-b border-zinc-100">
            <h3 className="text-sm sm:text-base font-bold tracking-tight text-zinc-950">
              {calcMode === "standard" ? "Results" : "Target Results"}
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
              {/* Primary Hero: Net Profit */}
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

                {/* Sub-row: Bank Deposit vs Direct Costs */}
                <div className="mt-3 flex items-center justify-between text-xs pt-1 border-t border-zinc-100/70 font-sans">
                  <div>
                    <span className="text-zinc-500 font-medium">Bank Deposit: </span>
                    <span className="font-mono font-bold text-zinc-950">
                      {curr.symbol}{formatAmount(result.netPayout)}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 font-medium">Total Costs: </span>
                    <span className="font-mono font-bold text-zinc-950">
                      {curr.symbol}{formatAmount(result.totalExpenses)}
                    </span>
                  </div>
                </div>
              </div>

              {/* 2x2 Key Financial Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 py-3 border-b border-zinc-100">
                {/* Break-Even ROAS */}
                <div className="rounded-lg bg-zinc-50/80 border border-zinc-200/70 p-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-zinc-600 block">
                      Break-Even ROAS
                    </span>
                    <TrendingUp className="size-3 text-blue-600" />
                  </div>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-xl font-mono font-extrabold text-blue-600">
                      {result.breakEvenRoas > 0 ? `${result.breakEvenRoas}x` : "N/A"}
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-sans leading-none block mt-0.5">
                    Target ad return
                  </span>
                </div>

                {/* Break-Even Price */}
                <div className="rounded-lg bg-zinc-50/80 border border-zinc-200/70 p-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-zinc-600 block">
                      Break-Even Price
                    </span>
                    <DollarSign className="size-3 text-amber-600" />
                  </div>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-xl font-mono font-extrabold text-zinc-950 truncate" title={`${curr.symbol}${formatAmount(result.breakEvenPrice)}`}>
                      {curr.symbol}{formatAmount(result.breakEvenPrice)}
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-sans leading-none block mt-0.5">
                    Floor price
                  </span>
                </div>
              </div>

              {/* Progress Breakdown Bar */}
              <div className="py-3 border-b border-zinc-200">
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-200 flex gap-0.5 shadow-inner">
                  {costShare > 0 && (
                    <div
                      style={{ width: `${costShare}%` }}
                      className="bg-blue-600 rounded-l-full transition-all duration-300"
                      title={`Product COGS: ${costShare.toFixed(1)}%`}
                    />
                  )}
                  {shippingShare > 0 && (
                    <div
                      style={{ width: `${shippingShare}%` }}
                      className="bg-indigo-500 transition-all duration-300"
                      title={`Carrier Shipping: ${shippingShare.toFixed(1)}%`}
                    />
                  )}
                  {feesShare > 0 && (
                    <div
                      style={{ width: `${feesShare}%` }}
                      className="bg-amber-500 transition-all duration-300"
                      title={`Shopify & Payment Fees: ${feesShare.toFixed(1)}%`}
                    />
                  )}
                  {adsShare > 0 && (
                    <div
                      style={{ width: `${adsShare}%` }}
                      className="bg-rose-500 transition-all duration-300"
                      title={`Ad Spend: ${adsShare.toFixed(1)}%`}
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
                        {curr.symbol}{formatAmount(cogs)}
                      </span>
                      <span className="font-mono text-zinc-500 font-semibold w-11 text-right text-[11px]">
                        {costShare.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {/* Carrier Shipping */}
                  {shippingCost > 0 && (
                    <div className="flex items-center justify-between py-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="size-2 rounded-full bg-indigo-500 shrink-0" />
                        <span className="text-zinc-800 font-medium">Carrier Postage</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-zinc-950">
                          {curr.symbol}{formatAmount(shippingCost)}
                        </span>
                        <span className="font-mono text-zinc-500 font-semibold w-11 text-right text-[11px]">
                          {shippingShare.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Shopify & Gateway Fees */}
                  <div className="flex items-center justify-between py-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-amber-500 shrink-0" />
                      <span className="text-zinc-800 font-medium">Shopify & Payment Fees</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-zinc-950">
                        {curr.symbol}{formatAmount(result.totalPlatformFees)}
                      </span>
                      <span className="font-mono text-zinc-500 font-semibold w-11 text-right text-[11px]">
                        {feesShare.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {/* Ad Spend */}
                  {adSpend > 0 && (
                    <div className="flex items-center justify-between py-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="size-2 rounded-full bg-rose-500 shrink-0" />
                        <span className="text-zinc-800 font-medium">Ad Spend (CAC)</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-zinc-950">
                          {curr.symbol}{formatAmount(adSpend)}
                        </span>
                        <span className="font-mono text-zinc-500 font-semibold w-11 text-right text-[11px]">
                          {adsShare.toFixed(1)}%
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
                      <span className="font-mono font-bold text-emerald-600">
                        {curr.symbol}{formatAmount(result.netProfit)}
                      </span>
                      <span className="font-mono text-emerald-600 font-bold w-11 text-right text-[11px]">
                        {profitShare.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Itemized Fee Breakdown Accordion */}
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
                      <span>Gateway Processing Fee</span>
                      <span className="font-semibold text-zinc-900">{curr.symbol}{formatAmount(result.paymentFee)}</span>
                    </div>
                    {result.thirdPartyTransactionFee > 0 && (
                      <div className="flex justify-between py-1 text-zinc-600">
                        <span>Shopify 3rd-Party Fee ({activePlanConfig.thirdPartyPct}%)</span>
                        <span className="font-semibold text-zinc-900">{curr.symbol}{formatAmount(result.thirdPartyTransactionFee)}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-1 text-zinc-600">
                      <span>Total Platform Deductions</span>
                      <span className="font-semibold text-zinc-900">{curr.symbol}{formatAmount(result.totalPlatformFees)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* ========================================================= */
            /* REVERSE TARGET PRICING RESULTS VIEW                       */
            /* ========================================================= */
            <div>
              {/* Hero: Recommended Retail Price */}
              <div className="py-3 border-b border-zinc-100">
                <span className="block text-xs font-bold text-blue-700 mb-0.5 tracking-tight">
                  Recommended Selling Price
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-blue-600 truncate" title={`${curr.symbol}${formatAmount(recommendedPrice)}`}>
                  {curr.symbol}{formatAmount(recommendedPrice)}
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 rounded-lg bg-zinc-50 border border-zinc-200/80 p-2.5 text-xs font-sans">
                  <div>
                    <span className="block text-[11px] text-zinc-500 font-medium">Estimated Profit</span>
                    <span className="font-mono font-bold text-emerald-600">
                      {curr.symbol}{formatAmount(reverseAnalysis.netProfit)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[11px] text-zinc-500 font-medium">Profit Margin</span>
                    <span className="font-mono font-bold text-zinc-950">
                      {reverseAnalysis.netMarginPct.toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Apply Button */}
                <button
                  type="button"
                  onClick={() => {
                    setPriceStr(recommendedPrice.toFixed(2));
                    setCalcMode("standard");
                  }}
                  className="w-full mt-3 py-2 px-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-xs font-bold font-sans flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer min-h-11"
                >
                  <span>Apply {curr.symbol}{formatAmount(recommendedPrice)} to Standard View</span>
                  <ArrowRight className="size-3.5" />
                </button>
              </div>

              {/* Deductions at Recommended Price */}
              <div className="py-2.5 space-y-1.5 text-xs font-sans">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-700 font-semibold">Estimated Shopify Payout:</span>
                  <span className="font-mono font-bold text-zinc-950">
                    {curr.symbol}{formatAmount(reverseAnalysis.netPayout)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-700 font-semibold">Total Platform Fees:</span>
                  <span className="font-mono font-bold text-zinc-950">
                    {curr.symbol}{formatAmount(reverseAnalysis.totalPlatformFees)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-700 font-semibold">COGS + Shipping + Ads:</span>
                  <span className="font-mono font-bold text-zinc-950">
                    {curr.symbol}{formatAmount(cogs + shippingCost + adSpend)}
                  </span>
                </div>
              </div>

              {/* Itemized Breakdown Accordion */}
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
                    {reverseAnalysis.breakdown.map((item, idx) => (
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

      {/* Mobile Sticky Result Bar */}
      {!isEmbed && (
        <StickyResultBar
          label={calcMode === "standard" ? "Shopify Profit" : "Target Price"}
          value={calcMode === "standard" ? result.netProfit : recommendedPrice}
          subLabel={calcMode === "standard" ? "Margin" : "Est. Profit"}
          subValue={calcMode === "standard" ? result.netMarginPct : undefined}
          productCost={cogs + shippingCost}
          totalFees={calcMode === "standard" ? (result.totalPlatformFees + adSpend) : reverseAnalysis.totalPlatformFees}
          payout={calcMode === "standard" ? result.netPayout : reverseAnalysis.netPayout}
          breakEven={calcMode === "standard" ? result.breakEvenPrice : result.breakEvenPrice}
          currencySymbol={curr.symbol}
          itemizedFees={[
            { label: "Cost of Goods (COGS)", amount: cogs },
            ...(shippingCost > 0 ? [{ label: "Carrier Shipping", amount: shippingCost }] : []),
            { label: "Payment Gateway Fee", amount: result.paymentFee },
            ...(result.thirdPartyTransactionFee > 0
              ? [{ label: `Shopify 3rd-Party Fee (${activePlanConfig.thirdPartyPct}%)`, amount: result.thirdPartyTransactionFee }]
              : []),
            ...(adSpend > 0 ? [{ label: "Ad Spend (CAC)", amount: adSpend }] : []),
          ]}
        />
      )}
    </div>
  );
}
