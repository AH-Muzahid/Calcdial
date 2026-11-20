"use client";

import { useState, useMemo } from "react";
import {
  calculateShopifyProfit,
  ShopifyPlan,
  SHOPIFY_PLAN_RATES,
} from "@/lib/formulas/shopify-profit";
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
} from "lucide-react";
import { PixelButton } from "@/components/ui/PixelButton";

const CURRENCY_MAP: Record<string, { label: string; symbol: string }> = {
  usd: { label: "USD ($) - United States", symbol: "$" },
  cad: { label: "CAD (CA$) - Canada", symbol: "CA$" },
  gbp: { label: "GBP (£) - United Kingdom", symbol: "£" },
  eur: { label: "EUR (€) - Eurozone", symbol: "€" },
  aud: { label: "AUD (A$) - Australia", symbol: "A$" },
};

const PLAN_OPTIONS: CustomSelectOption[] = [
  { value: "basic", label: "Basic Shopify ($39/mo)" },
  { value: "shopify", label: "Shopify ($105/mo)" },
  { value: "advanced", label: "Advanced Shopify ($399/mo)" },
  { value: "plus", label: "Shopify Plus ($2,300/mo)" },
];

const GATEWAY_OPTIONS: CustomSelectOption[] = [
  { value: "shopify-payments", label: "Shopify Payments (0% extra)" },
  { value: "stripe", label: "Stripe (+2% surcharge)" },
  { value: "paypal", label: "PayPal (+2% surcharge)" },
  { value: "square", label: "Square (+2% surcharge)" },
  { value: "authorize-net", label: "Authorize.Net (+2% surcharge)" },
  { value: "klarna", label: "Klarna (+2% surcharge)" },
  { value: "afterpay", label: "Afterpay (+2% surcharge)" },
];

const PRESETS = [25, 35, 48, 65, 90, 120];

export function ShopifyProfitCalculator({
  initialGateway = "shopify-payments",
  isEmbed = false,
}: {
  initialGateway?: string;
  isEmbed?: boolean;
}) {
  const [calcMode, setCalcMode] = useState<"standard" | "reverse">("standard");
  const [currency, setCurrency] = useState<string>("usd");
  const curr = CURRENCY_MAP[currency] || CURRENCY_MAP.usd;

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

  const [shopifyPlan, setShopifyPlan] = useState<ShopifyPlan>("basic");
  const [gateway, setGateway] = useState<string>(initialGateway.toLowerCase());

  const [targetType, setTargetType] = useState<"margin" | "dollar">("margin");
  const [targetValStr, setTargetValStr] = useState<string>("30");

  const [showItemized, setShowItemized] = useState<boolean>(false);
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);

  const itemPrice = Math.max(0, parseFloat(priceStr) || 0);
  const shippingCharged = Math.max(0, parseFloat(shippingChargedStr) || 0);
  const cogs = Math.max(0, parseFloat(cogsStr) || 0);
  const shippingCost = Math.max(0, parseFloat(shippingCostStr) || 0);
  const adSpend = includeAds ? Math.max(0, parseFloat(adSpendStr) || 0) : 0;
  const targetVal = Math.max(0, parseFloat(targetValStr) || 0);

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

  const recommendedPrice = result.recommendedPrice ?? result.breakEvenPrice;

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

  // Segment bar calculations
  const grossRev = result.revenue > 0 ? result.revenue : Math.max(0.01, itemPrice + shippingCharged);
  const profitWidth = Math.min(100, Math.max(0, (result.netProfit / grossRev) * 100));
  const feesWidth = Math.min(100, Math.max(0, (result.totalPlatformFees / grossRev) * 100));
  const costWidth = Math.min(100, Math.max(0, ((cogs + shippingCost + adSpend) / grossRev) * 100));

  const handleCopySummary = () => {
    trackEvent({
      name: "result_copied",
      params: { tool_slug: "shopify-profit-calculator", method: "clipboard" },
    });

    const isStandard = calcMode === "standard";
    const text = isStandard
      ? `Shopify Profit & ROAS Analysis (2026):
----------------------------------------
Retail Price:           ${curr.symbol}${itemPrice.toFixed(2)}
Buyer Shipping:         ${curr.symbol}${shippingCharged.toFixed(2)}
Gross Revenue:          ${curr.symbol}${result.revenue.toFixed(2)}
----------------------------------------
Shopify Plan:           ${activePlanConfig.name}
Gateway:                ${gateway.toUpperCase()}
Platform & Gateway Fee: ${curr.symbol}${result.totalPlatformFees.toFixed(2)}
Product Landed Cost:    ${curr.symbol}${cogs.toFixed(2)}
Carrier Postage:        ${curr.symbol}${shippingCost.toFixed(2)}
Ad Spend (CAC):         ${curr.symbol}${adSpend.toFixed(2)}
----------------------------------------
Shopify Bank Deposit:   ${curr.symbol}${result.netPayout.toFixed(2)}
REAL NET PROFIT:        ${curr.symbol}${result.netProfit.toFixed(2)} (${result.netMarginPct.toFixed(1)}% margin)
Break-Even ROAS:        ${result.breakEvenRoas}x
Break-Even Price:       ${curr.symbol}${result.breakEvenPrice.toFixed(2)}
----------------------------------------
Calculated via CalcDial (https://calcdial.pages.dev/tools/shopify-profit-calculator)`
      : `Shopify Target Price Finder (2026):
----------------------------------------
Target Goal:            ${targetType === "margin" ? `${targetVal}% Margin` : `${curr.symbol}${targetVal.toFixed(2)} Profit`}
Recommended Price:      ${curr.symbol}${recommendedPrice.toFixed(2)}
Estimated Net Profit:   ${curr.symbol}${reverseAnalysis.netProfit.toFixed(2)} (${reverseAnalysis.netMarginPct.toFixed(1)}% margin)
Shopify Bank Deposit:   ${curr.symbol}${reverseAnalysis.netPayout.toFixed(2)}
Total Platform Fees:    ${curr.symbol}${reverseAnalysis.totalPlatformFees.toFixed(2)}
Total Direct Costs:     ${curr.symbol}${(cogs + shippingCost + adSpend).toFixed(2)}
----------------------------------------
Calculated via CalcDial (https://calcdial.pages.dev/tools/shopify-profit-calculator)`;

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
              onClick={() => setCalcMode("reverse")}
              className={cn(
                "px-3.5 py-1.5 rounded-md transition-all cursor-pointer text-xs flex items-center gap-1.5",
                calcMode === "reverse"
                  ? "bg-[#2b5cfd] text-white font-bold shadow-2xs"
                  : "text-zinc-600 hover:text-zinc-950"
              )}
            >
              Target Price &amp; ROAS
            </button>
          </div>

          <div className="w-36 sm:w-44">
            <CustomSelect
              value={currency}
              options={Object.entries(CURRENCY_MAP).map(([id, item]) => ({
                value: id,
                label: item.label.split("-")[0].trim(),
              }))}
              onChange={(val) => setCurrency(val)}
            />
          </div>
        </div>

        {/* 2-Column Responsive Layout: Equal 50/50 Matching Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
          {/* ========================================================= */}
          {/* LEFT CARD: Pricing & Direct Costs Inputs                  */}
          {/* ========================================================= */}
          <div className="flex flex-col justify-between rounded-xl border border-zinc-200/90 bg-zinc-50/50 p-4 sm:p-5">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-200/70">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                  {calcMode === "standard" ? "Pricing & Direct Costs" : "Target Profit Goal"}
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

              {calcMode === "standard" ? (
                <>
                  {/* 2-Column Row: Retail Price & Landed Cost (1 col on mobile, 2 cols on sm+) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="shopify-price" className="text-xs font-bold text-zinc-900 block mb-1">
                        Retail Price
                      </label>
                      <div className="relative flex items-center min-h-10 rounded-lg border border-zinc-300 bg-white px-2.5 transition-all focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
                        <span className="text-xs font-mono font-bold text-zinc-500 select-none mr-1">{curr.symbol}</span>
                        <input
                          id="shopify-price"
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
                      <label htmlFor="shopify-cogs" className="text-xs font-bold text-zinc-900 block mb-1">
                        Item Cost (COGS)
                      </label>
                      <div className="relative flex items-center min-h-10 rounded-lg border border-zinc-300 bg-white px-2.5 transition-all focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
                        <span className="text-xs font-mono font-bold text-zinc-500 select-none mr-1">{curr.symbol}</span>
                        <input
                          id="shopify-cogs"
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
                            itemPrice === p
                              ? "bg-[#2b5cfd] text-white shadow-xs font-bold"
                              : "bg-white border border-zinc-200/90 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
                          )}
                        >
                          {curr.symbol}{p}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2-Column Row: Shipping Charged & Carrier Postage (1 col on mobile, 2 cols on sm+) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label htmlFor="shopify-shipping-charged" className="text-xs font-bold text-zinc-900 block mb-1">
                        Buyer Shipping Fee
                      </label>
                      <div className="relative flex items-center min-h-10 rounded-lg border border-zinc-300 bg-white px-2.5 transition-all focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
                        <span className="text-xs font-mono font-bold text-zinc-500 select-none mr-1">{curr.symbol}</span>
                        <input
                          id="shopify-shipping-charged"
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
                      <label htmlFor="shopify-shipping-cost" className="text-xs font-bold text-zinc-900 block mb-1">
                        Carrier Cost Paid
                      </label>
                      <div className="relative flex items-center min-h-10 rounded-lg border border-zinc-300 bg-white px-2.5 transition-all focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
                        <span className="text-xs font-mono font-bold text-zinc-500 select-none mr-1">{curr.symbol}</span>
                        <input
                          id="shopify-shipping-cost"
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
                /* Target Price Mode */
                <div className="space-y-3">
                  <div className="rounded-lg border border-zinc-200/80 bg-white p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-900">Target Profit Metric</span>
                      <div className="inline-flex rounded-md bg-zinc-100 p-0.5 text-xs font-semibold">
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
                      </div>
                    </div>

                    <div className="relative flex items-center min-h-10 rounded-lg border border-zinc-300 bg-white px-2.5 transition-all focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
                      <span className="text-xs font-mono font-bold text-zinc-500 select-none mr-1">
                        {targetType === "margin" ? "%" : curr.symbol}
                      </span>
                      <input
                        type="number"
                        inputMode="decimal"
                        min={0}
                        step="any"
                        value={targetValStr}
                        onChange={(e) => setTargetValStr(e.target.value)}
                        placeholder={targetType === "margin" ? "30" : "15.00"}
                        className="w-full bg-transparent font-mono font-bold text-sm text-zinc-950 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  {/* 2-Column Row: Cost Inputs (1 col on mobile, 2 cols on sm+) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-zinc-900 block mb-1">Item Cost (COGS)</label>
                      <div className="relative flex items-center min-h-10 rounded-lg border border-zinc-300 bg-white px-2.5 transition-all focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
                        <span className="text-xs font-mono font-bold text-zinc-500 select-none mr-1">{curr.symbol}</span>
                        <input
                          type="number"
                          value={cogsStr}
                          onChange={(e) => setCogsStr(e.target.value)}
                          className="w-full bg-transparent font-mono font-bold text-sm text-zinc-950 focus:outline-hidden"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-zinc-900 block mb-1">Carrier Shipping</label>
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

              {/* 2-Column Row: Shopify Plan & Payment Gateway Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-zinc-900">Shopify Plan</label>
                  <CustomSelect
                    value={shopifyPlan}
                    options={PLAN_OPTIONS}
                    onChange={(val) => setShopifyPlan(val as ShopifyPlan)}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-zinc-900">Payment Gateway</label>
                  <CustomSelect
                    value={gateway}
                    options={GATEWAY_OPTIONS}
                    onChange={(val) => setGateway(val)}
                  />
                </div>
              </div>

              {/* Marketing Ad Spend (CAC) Toggle Card */}
              <div className="rounded-lg border border-zinc-200/80 bg-white p-2.5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-xs font-bold text-zinc-900 block truncate">
                    Include Ad Spend per Order (CAC)
                  </span>
                  <span className="text-[10px] text-zinc-500 font-sans block truncate">
                    Meta, Google &amp; TikTok customer acquisition
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

              {/* CAC input if active */}
              {includeAds && (
                <div className="flex items-center justify-between text-xs px-2.5 py-1.5 bg-white rounded-lg border border-zinc-200/70">
                  <span className="text-zinc-700 font-semibold">Ad Spend per Order:</span>
                  <div className="relative flex items-center w-28 h-8 rounded-md border border-zinc-300 bg-white px-2">
                    <span className="text-xs font-mono font-bold text-zinc-500 select-none mr-1">{curr.symbol}</span>
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
                      "text-2xl sm:text-3xl lg:text-4xl font-extrabold font-mono tracking-tight",
                      result.netProfit >= 0 ? "text-emerald-600" : "text-rose-600"
                    )}
                  >
                    {curr.symbol}{result.netProfit.toFixed(2)}
                  </div>
                  <span className="text-[11px] text-zinc-500 font-sans block mt-0.5">
                    Est. bank payout after gateway: {curr.symbol}{result.netPayout.toFixed(2)}
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
                      title="Platform & Gateway Fees"
                    />
                    <div
                      style={{ width: `${costWidth}%` }}
                      className="bg-zinc-400 h-full transition-all duration-300"
                      title="Landed Cost, Shipping & Ads"
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
                      Fees ({((result.totalPlatformFees / grossRev) * 100).toFixed(0)}%)
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
                      {curr.symbol}{result.revenue.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span className="flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-rose-500" />
                      Gateway &amp; Platform Fees:
                    </span>
                    <span className="font-mono font-semibold text-rose-600">
                      -{curr.symbol}{result.totalPlatformFees.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span className="flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-zinc-400" />
                      Break-Even ROAS Target:
                    </span>
                    <span className="font-mono font-bold text-blue-700">
                      {result.breakEvenRoas}x
                    </span>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span className="flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-zinc-400" />
                      Break-Even Floor Price:
                    </span>
                    <span className="font-mono font-semibold text-zinc-900">
                      {curr.symbol}{result.breakEvenPrice.toFixed(2)}
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
                        <span>Payment Processing Fee</span>
                        <span className="font-semibold text-zinc-900">{curr.symbol}{result.paymentFee.toFixed(2)}</span>
                      </div>
                      {result.thirdPartyTransactionFee > 0 && (
                        <div className="flex justify-between py-1 text-zinc-600">
                          <span>3rd-Party Gateway Surcharge</span>
                          <span className="font-semibold text-zinc-900">{curr.symbol}{result.thirdPartyTransactionFee.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between py-1 text-zinc-600">
                        <span>Product Landed Cost (COGS)</span>
                        <span className="font-semibold text-zinc-900">{curr.symbol}{cogs.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between py-1 text-zinc-600">
                        <span>Postage Paid to Carrier</span>
                        <span className="font-semibold text-zinc-900">{curr.symbol}{shippingCost.toFixed(2)}</span>
                      </div>
                      {includeAds && adSpend > 0 && (
                        <div className="flex justify-between py-1 text-zinc-600">
                          <span>Ad Acquisition (CAC)</span>
                          <span className="font-semibold text-zinc-900">{curr.symbol}{adSpend.toFixed(2)}</span>
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
                    Recommended Retail Price
                  </span>
                  <span className="text-xs font-mono font-bold text-[#2b5cfd]">
                    Target {reverseAnalysis.netMarginPct.toFixed(1)}% margin
                  </span>
                </div>

                <div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-mono tracking-tight text-blue-600">
                    {curr.symbol}{recommendedPrice.toFixed(2)}
                  </div>
                  <span className="text-[11px] text-zinc-500 font-sans block mt-0.5">
                    Est. net profit: {curr.symbol}{reverseAnalysis.netProfit.toFixed(2)}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs font-sans py-2.5 my-3 border-y border-zinc-200/70">
                  <div className="flex justify-between text-zinc-600">
                    <span>Shopify &amp; Gateway Fees:</span>
                    <span className="font-mono font-semibold text-rose-600">-{curr.symbol}{reverseAnalysis.totalPlatformFees.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span>Shopify Bank Deposit:</span>
                    <span className="font-mono font-semibold text-zinc-900">{curr.symbol}{reverseAnalysis.netPayout.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span>Total Direct Expenses:</span>
                    <span className="font-mono font-semibold text-zinc-700">-{curr.symbol}{(cogs + shippingCost + adSpend).toFixed(2)}</span>
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
                  <span>Apply {curr.symbol}{recommendedPrice.toFixed(2)} to Standard View</span>
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
          productCost={cogs + shippingCost + adSpend}
          totalFees={calcMode === "standard" ? result.totalPlatformFees : reverseAnalysis.totalPlatformFees}
        />
      )}
    </div>
  );
}
