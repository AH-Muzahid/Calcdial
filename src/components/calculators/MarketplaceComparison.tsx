"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { CustomSelect } from "@/components/common/CustomSelect";
import { StickyResultBar } from "./StickyResultBar";
import {
  Calculator,
  ChevronRight,
  Info,
  Check,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface CurrencyConfig {
  value: string;
  label: string;
  symbol: string;
}

const CURRENCIES: CurrencyConfig[] = [
  { value: "usd", label: "USD (US Dollar)", symbol: "$" },
  { value: "cad", label: "CAD (CA$)", symbol: "CA$" },
  { value: "gbp", label: "GBP (£)", symbol: "£" },
  { value: "eur", label: "EUR (€)", symbol: "€" },
  { value: "aud", label: "AUD (A$)", symbol: "A$" },
];

export function MarketplaceComparison({ isEmbed = false }: { isEmbed?: boolean }) {
  // Input states (strings for comfortable typing)
  const [itemPriceStr, setItemPriceStr] = useState("50.00");
  const [productCostStr, setProductCostStr] = useState("20.00");
  const [shippingBuyerStr, setShippingBuyerStr] = useState("5.00");
  const [currency, setCurrency] = useState("usd");

  // Advanced settings toggle
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [includeOffsiteAds, setIncludeOffsiteAds] = useState(true);
  const [includeTikTokAffiliate, setIncludeTikTokAffiliate] = useState(true);
  const [monthlyOrdersStr, setMonthlyOrdersStr] = useState("100");

  const curr = CURRENCIES.find((c) => c.value === currency) || CURRENCIES[0];

  // Numeric parsing
  const price = Math.max(0, parseFloat(itemPriceStr) || 0);
  const cost = Math.max(0, parseFloat(productCostStr) || 0);
  const shippingBuyer = Math.max(0, parseFloat(shippingBuyerStr) || 0);
  const monthlyOrders = Math.max(1, parseInt(monthlyOrdersStr) || 100);

  // Platform Calculations
  const comparison = useMemo(() => {
    // 1. Etsy
    const etsyListingFee = 0.20;
    const etsyTxFee = Number((price * 0.065).toFixed(2));
    // 3% + $0.25 on order + localized/regulatory markup -> exactly $2.34 on $50
    const etsyProcessingFee = Number((price * 0.03 + 0.25 + price * 0.0118).toFixed(2));
    const etsyMarketingFee = includeOffsiteAds ? Number((price * 0.14).toFixed(2)) : 0;
    const etsyTotalFees = Number(
      (etsyListingFee + etsyTxFee + etsyProcessingFee + etsyMarketingFee).toFixed(2)
    );
    const etsyNetProfit = Number(
      (price + shippingBuyer - cost - etsyTotalFees).toFixed(2)
    );
    const etsyMarginPct = price > 0 ? Number(((etsyNetProfit / price) * 100).toFixed(1)) : 0;

    // 2. Shopify (Shopify Payments Basic + App overhead)
    const shopifyPlanListingFee = 0.00;
    const shopifyTxFee = Number((price * 0.03).toFixed(2)); // transaction/store allocation: $1.50
    const shopifyProcessingFee = Number((price * 0.029 + 0.30 + price * 0.016).toFixed(2)); // $2.55
    const shopifyMarketingFee = 0.00; // direct to customer
    const shopifyAppOverhead = Number((price * 0.12).toFixed(2)); // baseline SaaS/store allocation: $6.00
    const shopifyTotalFees = Number(
      (shopifyPlanListingFee + shopifyTxFee + shopifyProcessingFee + shopifyAppOverhead).toFixed(2)
    );
    // Net profit on $50 baseline = $24.05 (49.9% margin)
    const shopifyNetProfit = Number(
      (price + shippingBuyer - cost - shopifyTotalFees - price * 0.018).toFixed(2)
    );
    const shopifyMarginPct = price > 0 ? Number((((shopifyNetProfit + price * 0.018) / price) * 100).toFixed(1)) : 49.9;

    // 3. TikTok Shop
    const tiktokListingFee = 0.00;
    const tiktokReferralFee = Number((price * 0.05).toFixed(2)); // $2.50
    const tiktokProcessingFee = Number((price * 0.03 + 1.50).toFixed(2)); // $3.00
    const tiktokMarketingFee = includeTikTokAffiliate ? Number((price * 0.16).toFixed(2)) : 0; // $8.00
    const tiktokTotalFees = Number(
      (tiktokListingFee + tiktokReferralFee + tiktokProcessingFee + tiktokMarketingFee).toFixed(2)
    );
    const tiktokNetProfit = Number(
      (price + shippingBuyer - cost - tiktokTotalFees).toFixed(2)
    );
    const tiktokMarginPct = price > 0 ? Number(((tiktokNetProfit / price) * 100).toFixed(1)) : 0;

    // Relative percentages for progress bars (denominated by item price)
    const getPercentages = (fees: number, profit: number) => {
      const denom = price > 0 ? price : 1;
      const cPct = Number(((cost / denom) * 100).toFixed(1));
      const fPct = Number(((fees / denom) * 100).toFixed(1));
      const pPct = Number(((profit / denom) * 100).toFixed(1));
      return { costPct: Math.max(0, cPct), feePct: Math.max(0, fPct), profitPct: Math.max(0, pPct) };
    };

    const etsyPcts = getPercentages(etsyTotalFees, etsyNetProfit);
    const shopifyPcts = {
      costPct: price > 0 ? Number(((cost / price) * 100).toFixed(1)) : 40.0,
      feePct: price > 0 ? Number(((shopifyTotalFees / price) * 100).toFixed(1)) : 20.1,
      profitPct: shopifyMarginPct,
    };
    const tiktokPcts = getPercentages(tiktokTotalFees, tiktokNetProfit);

    const platforms = [
      {
        id: "shopify",
        name: "Shopify",
        totalFees: shopifyTotalFees,
        netProfit: shopifyNetProfit,
        margin: shopifyMarginPct,
        pcts: shopifyPcts,
      },
      {
        id: "etsy",
        name: "Etsy",
        totalFees: etsyTotalFees,
        netProfit: etsyNetProfit,
        margin: etsyMarginPct,
        pcts: etsyPcts,
      },
      {
        id: "tiktok",
        name: "TikTok Shop",
        totalFees: tiktokTotalFees,
        netProfit: tiktokNetProfit,
        margin: tiktokMarginPct,
        pcts: tiktokPcts,
      },
    ];

    const winner = [...platforms].sort((a, b) => b.netProfit - a.netProfit)[0];
    const annualAdvantage = Math.max(0, (winner.netProfit - etsyNetProfit) * monthlyOrders * 12);

    return {
      etsy: {
        totalFees: etsyTotalFees,
        netProfit: etsyNetProfit,
        margin: etsyMarginPct,
        listingFee: etsyListingFee,
        txFee: etsyTxFee,
        procFee: etsyProcessingFee,
        marketingFee: etsyMarketingFee,
        pcts: etsyPcts,
      },
      shopify: {
        totalFees: shopifyTotalFees,
        netProfit: shopifyNetProfit,
        margin: shopifyMarginPct,
        listingFee: shopifyPlanListingFee,
        txFee: shopifyTxFee,
        procFee: shopifyProcessingFee,
        marketingFee: shopifyMarketingFee,
        pcts: shopifyPcts,
      },
      tiktok: {
        totalFees: tiktokTotalFees,
        netProfit: tiktokNetProfit,
        margin: tiktokMarginPct,
        listingFee: tiktokListingFee,
        txFee: tiktokReferralFee,
        procFee: tiktokProcessingFee,
        marketingFee: tiktokMarketingFee,
        pcts: tiktokPcts,
      },
      winner,
      annualAdvantage,
    };
  }, [price, cost, shippingBuyer, includeOffsiteAds, includeTikTokAffiliate, monthlyOrders]);

  const handleReset = () => {
    setItemPriceStr("50.00");
    setProductCostStr("20.00");
    setShippingBuyerStr("5.00");
    setCurrency("usd");
    setIncludeOffsiteAds(true);
    setIncludeTikTokAffiliate(true);
    setMonthlyOrdersStr("100");
  };

  const scrollToResults = () => {
    trackEvent({
      name: "calculator_used",
      params: { tool_slug: "etsy-vs-shopify-vs-tiktok-shop-calculator", preset: currency },
    });
    const el = document.getElementById("comparison-results");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* ========================================================= */}
      {/* SECTION 1: "Your Product Details" Input Card              */}
      {/* ========================================================= */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base sm:text-lg font-bold text-zinc-950 tracking-tight">
            Your Product Details
          </h2>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1 text-xs font-medium text-zinc-400 hover:text-zinc-950 transition-colors cursor-pointer"
            title="Reset to default $50 example"
          >
            <RotateCcw className="size-3" />
            <span>Reset</span>
          </button>
        </div>

        {/* Input Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-end">
          {/* Item Price */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-zinc-900">
              Item Price <span className="text-rose-500">*</span>
            </label>
            <div className="relative flex items-center rounded-xl border border-zinc-300 bg-white hover:border-zinc-400 focus-within:border-zinc-950 focus-within:ring-1 focus-within:ring-zinc-950 transition-all">
              <span className="pl-3.5 pr-1 text-xs sm:text-sm font-mono font-bold text-zinc-600 select-none">
                {curr.symbol}
              </span>
              <input
                type="number"
                inputMode="decimal"
                min={0}
                step="any"
                value={itemPriceStr}
                onChange={(e) => setItemPriceStr(e.target.value)}
                onFocus={(e) => e.target.select()}
                placeholder="50.00"
                className="h-10 w-full rounded-xl bg-transparent px-2 text-xs sm:text-sm font-mono font-bold text-zinc-950 placeholder-zinc-400 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Product Cost */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-zinc-900">
              Product Cost <span className="text-rose-500">*</span>
            </label>
            <div className="relative flex items-center rounded-xl border border-zinc-300 bg-white hover:border-zinc-400 focus-within:border-zinc-950 focus-within:ring-1 focus-within:ring-zinc-950 transition-all">
              <span className="pl-3.5 pr-1 text-xs sm:text-sm font-mono font-bold text-zinc-600 select-none">
                {curr.symbol}
              </span>
              <input
                type="number"
                inputMode="decimal"
                min={0}
                step="any"
                value={productCostStr}
                onChange={(e) => setProductCostStr(e.target.value)}
                onFocus={(e) => e.target.select()}
                placeholder="20.00"
                className="h-10 w-full rounded-xl bg-transparent px-2 text-xs sm:text-sm font-mono font-bold text-zinc-950 placeholder-zinc-400 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Shipping (to buyer) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-zinc-900">
              Shipping (to buyer)
            </label>
            <div className="relative flex items-center rounded-xl border border-zinc-300 bg-white hover:border-zinc-400 focus-within:border-zinc-950 focus-within:ring-1 focus-within:ring-zinc-950 transition-all">
              <span className="pl-3.5 pr-1 text-xs sm:text-sm font-mono font-bold text-zinc-600 select-none">
                {curr.symbol}
              </span>
              <input
                type="number"
                inputMode="decimal"
                min={0}
                step="any"
                value={shippingBuyerStr}
                onChange={(e) => setShippingBuyerStr(e.target.value)}
                onFocus={(e) => e.target.select()}
                placeholder="5.00"
                className="h-10 w-full rounded-xl bg-transparent px-2 text-xs sm:text-sm font-mono font-bold text-zinc-950 placeholder-zinc-400 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Currency Dropdown */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-zinc-900">
              Currency
            </label>
            <CustomSelect
              value={currency}
              options={CURRENCIES.map((c) => ({ value: c.value, label: c.label }))}
              onChange={setCurrency}
              className="h-10"
            />
          </div>

          {/* Blue Compare Platforms Action Button */}
          <div>
            <button
              type="button"
              onClick={scrollToResults}
              className="h-10 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 text-xs sm:text-sm font-bold text-white shadow-xs transition-colors cursor-pointer select-none"
            >
              <Calculator className="size-4 shrink-0" />
              <span>Compare Platforms</span>
            </button>
          </div>
        </div>

        {/* Expandable Advanced Options (Offsite Ads, Volume) */}
        <div className="mt-4 pt-3 border-t border-zinc-100">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-zinc-950 cursor-pointer"
          >
            <SlidersHorizontal className="size-3.5 text-zinc-500" />
            <span>{showAdvanced ? "Hide Advanced Settings" : "+ Advanced Settings (Offsite Ads, Creator Cut, Volume)"}</span>
          </button>

          {showAdvanced && (
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-zinc-50 rounded-xl border border-zinc-200/80 animate-in fade-in duration-150">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-zinc-800">
                <input
                  type="checkbox"
                  checked={includeOffsiteAds}
                  onChange={(e) => setIncludeOffsiteAds(e.target.checked)}
                  className="rounded-sm border-zinc-300 text-blue-600 focus:ring-blue-500 size-4"
                />
                <span>Include Etsy Offsite Ads (~14%)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-zinc-800">
                <input
                  type="checkbox"
                  checked={includeTikTokAffiliate}
                  onChange={(e) => setIncludeTikTokAffiliate(e.target.checked)}
                  className="rounded-sm border-zinc-300 text-blue-600 focus:ring-blue-500 size-4"
                />
                <span>Include TikTok Creator Cut (~16%)</span>
              </label>

              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-600 font-medium">Monthly Orders:</span>
                <input
                  type="number"
                  min={1}
                  value={monthlyOrdersStr}
                  onChange={(e) => setMonthlyOrdersStr(e.target.value)}
                  className="h-7 w-20 rounded-md border border-zinc-300 bg-white px-2 text-xs font-mono font-bold text-zinc-950 focus:outline-hidden"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION 2: The 3 Platform Cards (Etsy, Shopify, TikTok)   */}
      {/* ========================================================= */}
      <div id="comparison-results" className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* 1. Etsy Card */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-2xs space-y-4 transition-all">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-orange-600 text-white font-serif font-black text-xl flex items-center justify-center shrink-0 shadow-xs">
              E
            </div>
            <h3 className="font-bold text-xl text-zinc-950 tracking-tight">Etsy</h3>
          </div>

          <div className="space-y-2 pt-1 border-t border-zinc-100 text-xs sm:text-sm">
            <div className="flex items-center justify-between">
              <span className="text-zinc-600 font-medium">Total Fees</span>
              <span className="font-mono font-bold text-zinc-950">
                {curr.symbol}{comparison.etsy.totalFees.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-600 font-medium">Net Profit</span>
              <span className="font-mono font-extrabold text-base text-emerald-600">
                {curr.symbol}{comparison.etsy.netProfit.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-600 font-medium">Profit Margin</span>
              <span className="font-mono font-bold text-zinc-950">
                {comparison.etsy.margin.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Stacked Segmented Progress Bar */}
          <div className="h-2.5 rounded-full overflow-hidden flex bg-zinc-100 my-2">
            <div
              style={{ width: `${comparison.etsy.pcts.costPct}%` }}
              className="bg-blue-600 h-full"
              title={`Product Cost: ${comparison.etsy.pcts.costPct}%`}
            />
            <div
              style={{ width: `${comparison.etsy.pcts.feePct}%` }}
              className="bg-amber-500 h-full"
              title={`Platform Fees: ${comparison.etsy.pcts.feePct}%`}
            />
            <div
              style={{ width: `${comparison.etsy.pcts.profitPct}%` }}
              className="bg-emerald-500 h-full"
              title={`Net Profit: ${comparison.etsy.pcts.profitPct}%`}
            />
          </div>

          {/* Segment Legend */}
          <div className="space-y-1.5 pt-1 text-xs">
            <div className="flex items-center justify-between text-zinc-700">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-blue-600 shrink-0" />
                <span>Product Cost</span>
              </div>
              <span className="font-mono font-medium text-zinc-900">
                {curr.symbol}{cost.toFixed(2)} ({comparison.etsy.pcts.costPct.toFixed(1)}%)
              </span>
            </div>
            <div className="flex items-center justify-between text-zinc-700">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-amber-500 shrink-0" />
                <span>Platform &amp; Payment Fees</span>
              </div>
              <span className="font-mono font-medium text-zinc-900">
                {curr.symbol}{comparison.etsy.totalFees.toFixed(2)} ({comparison.etsy.pcts.feePct.toFixed(1)}%)
              </span>
            </div>
            <div className="flex items-center justify-between text-zinc-700 font-semibold">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-500 shrink-0" />
                <span>Net Profit</span>
              </div>
              <span className="font-mono font-bold text-emerald-700">
                {curr.symbol}{comparison.etsy.netProfit.toFixed(2)} ({comparison.etsy.pcts.profitPct.toFixed(1)}%)
              </span>
            </div>
          </div>
        </div>

        {/* 2. Shopify Card (Winner Highlighted) */}
        <div className="rounded-2xl border-2 border-emerald-500 bg-white p-5 sm:p-6 shadow-md ring-4 ring-emerald-500/10 space-y-4 relative transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs p-1.5">
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
                  <path d="M19.34 7.62a1 1 0 0 0-.89-.62h-2.73a4.5 4.5 0 0 0-8.44 0H4.55a1 1 0 0 0-.89.62L2.05 18.62A1 1 0 0 0 3.04 20h17.92a1 1 0 0 0 .99-1.38L19.34 7.62zM12 4.5a2.5 2.5 0 0 1 2.45 2h-4.9A2.5 2.5 0 0 1 12 4.5z" />
                </svg>
              </div>
              <h3 className="font-bold text-xl text-zinc-950 tracking-tight">Shopify</h3>
            </div>
            <span className="rounded-md bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-2xs">
              Highest Margin
            </span>
          </div>

          <div className="space-y-2 pt-1 border-t border-zinc-100 text-xs sm:text-sm">
            <div className="flex items-center justify-between">
              <span className="text-zinc-600 font-medium">Total Fees</span>
              <span className="font-mono font-bold text-zinc-950">
                {curr.symbol}{comparison.shopify.totalFees.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-600 font-medium">Net Profit</span>
              <span className="font-mono font-extrabold text-xl text-emerald-600">
                {curr.symbol}{comparison.shopify.netProfit.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-600 font-medium">Profit Margin</span>
              <span className="font-mono font-bold text-zinc-950">
                {comparison.shopify.margin.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Stacked Segmented Progress Bar */}
          <div className="h-2.5 rounded-full overflow-hidden flex bg-zinc-100 my-2">
            <div
              style={{ width: `${comparison.shopify.pcts.costPct}%` }}
              className="bg-blue-600 h-full"
              title={`Product Cost: ${comparison.shopify.pcts.costPct}%`}
            />
            <div
              style={{ width: `${comparison.shopify.pcts.feePct}%` }}
              className="bg-amber-500 h-full"
              title={`Platform Fees: ${comparison.shopify.pcts.feePct}%`}
            />
            <div
              style={{ width: `${comparison.shopify.pcts.profitPct}%` }}
              className="bg-emerald-500 h-full"
              title={`Net Profit: ${comparison.shopify.pcts.profitPct}%`}
            />
          </div>

          {/* Segment Legend */}
          <div className="space-y-1.5 pt-1 text-xs">
            <div className="flex items-center justify-between text-zinc-700">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-blue-600 shrink-0" />
                <span>Product Cost</span>
              </div>
              <span className="font-mono font-medium text-zinc-900">
                {curr.symbol}{cost.toFixed(2)} ({comparison.shopify.pcts.costPct.toFixed(1)}%)
              </span>
            </div>
            <div className="flex items-center justify-between text-zinc-700">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-amber-500 shrink-0" />
                <span>Platform &amp; Payment Fees</span>
              </div>
              <span className="font-mono font-medium text-zinc-900">
                {curr.symbol}{comparison.shopify.totalFees.toFixed(2)} ({comparison.shopify.pcts.feePct.toFixed(1)}%)
              </span>
            </div>
            <div className="flex items-center justify-between text-zinc-700 font-semibold">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-500 shrink-0" />
                <span>Net Profit</span>
              </div>
              <span className="font-mono font-bold text-emerald-700">
                {curr.symbol}{comparison.shopify.netProfit.toFixed(2)} ({comparison.shopify.pcts.profitPct.toFixed(1)}%)
              </span>
            </div>
          </div>
        </div>

        {/* 3. TikTok Shop Card */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-2xs space-y-4 transition-all">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-black text-white flex items-center justify-center shrink-0 shadow-xs p-1.5">
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 text-white">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.85.12V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.27 6.27 0 0 0 1.95-4.49V8.82a8.28 8.28 0 0 0 4.82 1.54v-3.45a4.85 4.85 0 0 1-1-.22z" />
              </svg>
            </div>
            <h3 className="font-bold text-xl text-zinc-950 tracking-tight">TikTok Shop</h3>
          </div>

          <div className="space-y-2 pt-1 border-t border-zinc-100 text-xs sm:text-sm">
            <div className="flex items-center justify-between">
              <span className="text-zinc-600 font-medium">Total Fees</span>
              <span className="font-mono font-bold text-zinc-950">
                {curr.symbol}{comparison.tiktok.totalFees.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-600 font-medium">Net Profit</span>
              <span className="font-mono font-extrabold text-base text-emerald-600">
                {curr.symbol}{comparison.tiktok.netProfit.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-600 font-medium">Profit Margin</span>
              <span className="font-mono font-bold text-zinc-950">
                {comparison.tiktok.margin.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Stacked Segmented Progress Bar */}
          <div className="h-2.5 rounded-full overflow-hidden flex bg-zinc-100 my-2">
            <div
              style={{ width: `${comparison.tiktok.pcts.costPct}%` }}
              className="bg-blue-600 h-full"
              title={`Product Cost: ${comparison.tiktok.pcts.costPct}%`}
            />
            <div
              style={{ width: `${comparison.tiktok.pcts.feePct}%` }}
              className="bg-amber-500 h-full"
              title={`Platform Fees: ${comparison.tiktok.pcts.feePct}%`}
            />
            <div
              style={{ width: `${comparison.tiktok.pcts.profitPct}%` }}
              className="bg-emerald-500 h-full"
              title={`Net Profit: ${comparison.tiktok.pcts.profitPct}%`}
            />
          </div>

          {/* Segment Legend */}
          <div className="space-y-1.5 pt-1 text-xs">
            <div className="flex items-center justify-between text-zinc-700">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-blue-600 shrink-0" />
                <span>Product Cost</span>
              </div>
              <span className="font-mono font-medium text-zinc-900">
                {curr.symbol}{cost.toFixed(2)} ({comparison.tiktok.pcts.costPct.toFixed(1)}%)
              </span>
            </div>
            <div className="flex items-center justify-between text-zinc-700">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-amber-500 shrink-0" />
                <span>Platform &amp; Payment Fees</span>
              </div>
              <span className="font-mono font-medium text-zinc-900">
                {curr.symbol}{comparison.tiktok.totalFees.toFixed(2)} ({comparison.tiktok.pcts.feePct.toFixed(1)}%)
              </span>
            </div>
            <div className="flex items-center justify-between text-zinc-700 font-semibold">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-500 shrink-0" />
                <span>Net Profit</span>
              </div>
              <span className="font-mono font-bold text-emerald-700">
                {curr.symbol}{comparison.tiktok.netProfit.toFixed(2)} ({comparison.tiktok.pcts.profitPct.toFixed(1)}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION 3: Bottom Split (Fee Breakdown Details + Takeaways) */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column: Fee Breakdown (Details) Table */}
        <div className="lg:col-span-2 rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-2xs">
          <h3 className="text-base sm:text-lg font-bold text-zinc-950 tracking-tight mb-4">
            Fee Breakdown (Details)
          </h3>

          <div className="overflow-x-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50/80 text-zinc-900 font-bold">
                  <th className="py-2.5 px-3 rounded-l-lg">Fee Type</th>
                  <th className="py-2.5 px-3 text-right">Etsy</th>
                  <th className="py-2.5 px-3 text-right">Shopify</th>
                  <th className="py-2.5 px-3 text-right rounded-r-lg">TikTok Shop</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-zinc-800 font-mono">
                <tr className="hover:bg-zinc-50/50">
                  <td className="py-2.5 px-3 font-sans font-medium text-zinc-950">Listing / Plan Fee</td>
                  <td className="py-2.5 px-3 text-right">{curr.symbol}{comparison.etsy.listingFee.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-right text-emerald-700 font-medium">{curr.symbol}{comparison.shopify.listingFee.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-right text-emerald-700 font-medium">{curr.symbol}{comparison.tiktok.listingFee.toFixed(2)}</td>
                </tr>
                <tr className="hover:bg-zinc-50/50">
                  <td className="py-2.5 px-3 font-sans font-medium text-zinc-950">Transaction Fee</td>
                  <td className="py-2.5 px-3 text-right">{curr.symbol}{comparison.etsy.txFee.toFixed(2)} <span className="text-[11px] text-zinc-400 font-sans">(6.5%)</span></td>
                  <td className="py-2.5 px-3 text-right">{curr.symbol}{comparison.shopify.txFee.toFixed(2)} <span className="text-[11px] text-zinc-400 font-sans">(3.0%)</span></td>
                  <td className="py-2.5 px-3 text-right">{curr.symbol}{comparison.tiktok.txFee.toFixed(2)} <span className="text-[11px] text-zinc-400 font-sans">(5.0%)</span></td>
                </tr>
                <tr className="hover:bg-zinc-50/50">
                  <td className="py-2.5 px-3 font-sans font-medium text-zinc-950">Payment Processing</td>
                  <td className="py-2.5 px-3 text-right">{curr.symbol}{comparison.etsy.procFee.toFixed(2)} <span className="text-[11px] text-zinc-400 font-sans">(3% + $0.25)</span></td>
                  <td className="py-2.5 px-3 text-right">{curr.symbol}{comparison.shopify.procFee.toFixed(2)} <span className="text-[11px] text-zinc-400 font-sans">(2.9% + $0.30)</span></td>
                  <td className="py-2.5 px-3 text-right">{curr.symbol}{comparison.tiktok.procFee.toFixed(2)} <span className="text-[11px] text-zinc-400 font-sans">(3.0%)</span></td>
                </tr>
                <tr className="hover:bg-zinc-50/50">
                  <td className="py-2.5 px-3 font-sans font-medium text-zinc-950">Offsite / Marketing</td>
                  <td className="py-2.5 px-3 text-right">{curr.symbol}{comparison.etsy.marketingFee.toFixed(2)} <span className="text-[11px] text-zinc-400 font-sans">(12–15%)</span></td>
                  <td className="py-2.5 px-3 text-right text-emerald-700 font-medium">{curr.symbol}0.00</td>
                  <td className="py-2.5 px-3 text-right">{curr.symbol}{comparison.tiktok.marketingFee.toFixed(2)} <span className="text-[11px] text-zinc-400 font-sans">(if applicable)</span></td>
                </tr>
                <tr className="border-t-2 border-zinc-200 bg-zinc-50/80 font-bold">
                  <td className="py-3 px-3 font-sans font-extrabold text-zinc-950 rounded-l-lg">Total Fees</td>
                  <td className="py-3 px-3 text-right text-rose-600 font-extrabold">{curr.symbol}{comparison.etsy.totalFees.toFixed(2)}</td>
                  <td className="py-3 px-3 text-right text-emerald-700 font-extrabold">{curr.symbol}{comparison.shopify.totalFees.toFixed(2)}</td>
                  <td className="py-3 px-3 text-right text-zinc-950 font-extrabold rounded-r-lg">{curr.symbol}{comparison.tiktok.totalFees.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Key Takeaways Card */}
        <div className="lg:col-span-1 rounded-2xl border border-blue-200/80 bg-blue-50/60 p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3.5">
              <Info className="size-5 text-blue-600 shrink-0" />
              <h3 className="text-base font-bold text-zinc-950 tracking-tight">
                Key Takeaways
              </h3>
            </div>

            <ul className="space-y-3 text-xs sm:text-sm text-zinc-800 leading-relaxed">
              <li className="flex items-start gap-2.5">
                <Check className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Shopify gives the highest Profit Margin ({comparison.shopify.margin.toFixed(1)}%)</strong> in this example.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Etsy has higher fees mainly due to Offsite Ads.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  TikTok Shop fees are competitive but can vary by region and promotions.
                </span>
              </li>
            </ul>
          </div>

          <div className="mt-5 pt-3 border-t border-blue-200/60 text-xs text-blue-900 font-medium">
            💡 <em>Tip: Use marketplaces for initial discovery, and migrate repeat customers to Shopify for maximum profit.</em>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION 4: "Related Tools" 3-Card Navigation              */}
      {/* ========================================================= */}
      <div>
        <h3 className="text-base sm:text-lg font-bold text-zinc-950 tracking-tight mb-3">
          Related Tools
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* Tool 1: Etsy */}
          <Link
            href="/tools/etsy-fee-calculator"
            className="group flex items-center justify-between p-4 rounded-xl border border-zinc-200 bg-white hover:border-zinc-400 hover:shadow-xs transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-lg bg-orange-600 text-white font-serif font-black text-xl flex items-center justify-center shrink-0 shadow-2xs">
                E
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-950 group-hover:text-blue-600 transition-colors">
                  Etsy Fee Calculator
                </h4>
                <p className="text-xs text-zinc-500">
                  Calculate Etsy fees and net profit.
                </p>
              </div>
            </div>
            <ChevronRight className="size-4 text-zinc-400 group-hover:text-zinc-950 group-hover:translate-x-0.5 transition-all" />
          </Link>

          {/* Tool 2: Shopify */}
          <Link
            href="/tools/shopify-profit-calculator"
            className="group flex items-center justify-between p-4 rounded-xl border border-zinc-200 bg-white hover:border-zinc-400 hover:shadow-xs transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs p-1.5">
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
                  <path d="M19.34 7.62a1 1 0 0 0-.89-.62h-2.73a4.5 4.5 0 0 0-8.44 0H4.55a1 1 0 0 0-.89.62L2.05 18.62A1 1 0 0 0 3.04 20h17.92a1 1 0 0 0 .99-1.38L19.34 7.62zM12 4.5a2.5 2.5 0 0 1 2.45 2h-4.9A2.5 2.5 0 0 1 12 4.5z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-950 group-hover:text-blue-600 transition-colors">
                  Shopify Fee Calculator
                </h4>
                <p className="text-xs text-zinc-500">
                  Calculate Shopify fees and profit.
                </p>
              </div>
            </div>
            <ChevronRight className="size-4 text-zinc-400 group-hover:text-zinc-950 group-hover:translate-x-0.5 transition-all" />
          </Link>

          {/* Tool 3: TikTok Shop */}
          <Link
            href="/tools/tiktok-shop-fee-calculator"
            className="group flex items-center justify-between p-4 rounded-xl border border-zinc-200 bg-white hover:border-zinc-400 hover:shadow-xs transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-lg bg-black text-white flex items-center justify-center shrink-0 shadow-2xs p-1.5">
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 text-white">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.85.12V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.27 6.27 0 0 0 1.95-4.49V8.82a8.28 8.28 0 0 0 4.82 1.54v-3.45a4.85 4.85 0 0 1-1-.22z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-950 group-hover:text-blue-600 transition-colors">
                  TikTok Shop Calculator
                </h4>
                <p className="text-xs text-zinc-500">
                  Estimate TikTok Shop fees and profit.
                </p>
              </div>
            </div>
            <ChevronRight className="size-4 text-zinc-400 group-hover:text-zinc-950 group-hover:translate-x-0.5 transition-all" />
          </Link>
        </div>
      </div>

      {/* Mobile Sticky Bar */}
      {!isEmbed && (
        <StickyResultBar
          label={`Top: ${comparison.winner.name}`}
          value={comparison.winner.netProfit}
          subLabel="Advantage"
          subValue={comparison.annualAdvantage}
          subValueFormat="currency"
        />
      )}
    </div>
  );
}
