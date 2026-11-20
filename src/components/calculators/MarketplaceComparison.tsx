"use client";

import { useState, useMemo } from "react";
import { CustomSelect } from "@/components/common/CustomSelect";
import { StickyResultBar } from "./StickyResultBar";
import { PixelButton } from "@/components/ui/PixelButton";
import {
  Calculator,
  SlidersHorizontal,
} from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { cn, formatMoney } from "@/lib/utils";

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

export function sumFees(rows: { label: string; amount: number }[]): number {
  return Number(rows.reduce((s, r) => s + r.amount, 0).toFixed(2));
}

export function MarketplaceComparison({ isEmbed = false }: { isEmbed?: boolean }) {
  // Input states (strings for comfortable typing)
  const [itemPriceStr, setItemPriceStr] = useState("50.00");
  const [productCostStr, setProductCostStr] = useState("20.00");
  const [shippingBuyerStr, setShippingBuyerStr] = useState("5.00");
  const [currency, setCurrency] = useState("usd");

  // Advanced settings toggle
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [includeOffsiteAds, setIncludeOffsiteAds] = useState(false); // Default OFF per audit
  const [includeTikTokAffiliate, setIncludeTikTokAffiliate] = useState(false);
  const [monthlyOrdersStr, setMonthlyOrdersStr] = useState("100");

  const curr = CURRENCIES.find((c) => c.value === currency) || CURRENCIES[0];

  // Numeric parsing
  const price = Math.max(0, parseFloat(itemPriceStr) || 0);
  const cost = Math.max(0, parseFloat(productCostStr) || 0);
  const shippingBuyer = Math.max(0, parseFloat(shippingBuyerStr) || 0);
  const monthlyOrders = Math.max(1, parseInt(monthlyOrdersStr) || 100);

  // Platform Calculations (Strict Pure Math - Single Source of Truth)
  const comparison = useMemo(() => {
    const gross = Number((price + shippingBuyer).toFixed(2));

    // 1. Etsy
    const etsyListingFee = price > 0 ? 0.20 : 0.00;
    const etsyTxFee = Number((gross * 0.065).toFixed(2)); // 6.5% on (item + shipping)
    const etsyProcessingFee = gross > 0 ? Number((gross * 0.03 + 0.25).toFixed(2)) : 0.00; // 3% + $0.25
    const etsyMarketingFee = includeOffsiteAds ? Number((gross * 0.15).toFixed(2)) : 0.00; // 15% offsite ads

    const etsyRows = [
      { label: "Listing Fee", amount: etsyListingFee },
      { label: "Transaction Fee (6.5%)", amount: etsyTxFee },
      { label: "Payment Processing (3% + $0.25)", amount: etsyProcessingFee },
      { label: "Offsite Ads (15%)", amount: etsyMarketingFee },
    ];
    const etsyTotalFees = sumFees(etsyRows);
    const etsyNetProfit = Number((gross - cost - etsyTotalFees).toFixed(2));
    const etsyMarginPct = gross > 0 ? Number(((etsyNetProfit / gross) * 100).toFixed(1)) : 0;

    // 2. Shopify (Shopify Payments Basic: 2.9% + $0.30, 0% platform transaction fee)
    const shopifyPlanListingFee = 0.00;
    const shopifyTxFee = 0.00; // 0% platform transaction fee with Shopify Payments
    const shopifyProcessingFee = gross > 0 ? Number((gross * 0.029 + 0.30).toFixed(2)) : 0.00; // 2.9% + $0.30
    const shopifyMarketingFee = 0.00; // Direct to consumer

    const shopifyRows = [
      { label: "Listing / Plan Fee", amount: shopifyPlanListingFee },
      { label: "Transaction Fee (0%)", amount: shopifyTxFee },
      { label: "Payment Processing (2.9% + $0.30)", amount: shopifyProcessingFee },
      { label: "Marketing / Ads", amount: shopifyMarketingFee },
    ];
    const shopifyTotalFees = sumFees(shopifyRows);
    const shopifyNetProfit = Number((gross - cost - shopifyTotalFees).toFixed(2));
    const shopifyMarginPct = gross > 0 ? Number(((shopifyNetProfit / gross) * 100).toFixed(1)) : 0;

    // 3. TikTok Shop (6.0% category referral + 1.8% + $0.30 payment processing)
    const tiktokListingFee = 0.00;
    const tiktokReferralFee = Number((price * 0.06).toFixed(2)); // 6.0% referral
    const tiktokProcessingFee = gross > 0 ? Number((gross * 0.018 + 0.30).toFixed(2)) : 0.00; // 1.8% + $0.30
    const tiktokMarketingFee = includeTikTokAffiliate ? Number((price * 0.10).toFixed(2)) : 0.00; // 10% affiliate

    const tiktokRows = [
      { label: "Listing / Plan Fee", amount: tiktokListingFee },
      { label: "Category Referral Fee (6.0%)", amount: tiktokReferralFee },
      { label: "Payment Processing (1.8% + $0.30)", amount: tiktokProcessingFee },
      { label: "Creator Affiliate Cut", amount: tiktokMarketingFee },
    ];
    const tiktokTotalFees = sumFees(tiktokRows);
    const tiktokNetProfit = Number((gross - cost - tiktokTotalFees).toFixed(2));
    const tiktokMarginPct = gross > 0 ? Number(((tiktokNetProfit / gross) * 100).toFixed(1)) : 0;

    // Progress bar percentages (normalized against gross, or outlay in loss state)
    const getPercentages = (totalFees: number, netProfit: number) => {
      if (gross <= 0) return { costPct: 0, feePct: 0, profitPct: 0 };
      if (netProfit < 0) {
        const totalOutlay = Math.max(0.01, cost + totalFees);
        return {
          costPct: Math.min(100, Number(((cost / totalOutlay) * 100).toFixed(1))),
          feePct: Math.min(100, Number(((totalFees / totalOutlay) * 100).toFixed(1))),
          profitPct: 0,
        };
      }
      return {
        costPct: Math.min(100, Number(((cost / gross) * 100).toFixed(1))),
        feePct: Math.min(100, Number(((totalFees / gross) * 100).toFixed(1))),
        profitPct: Math.min(100, Number(((netProfit / gross) * 100).toFixed(1))),
      };
    };

    const etsyPcts = getPercentages(etsyTotalFees, etsyNetProfit);
    const shopifyPcts = getPercentages(shopifyTotalFees, shopifyNetProfit);
    const tiktokPcts = getPercentages(tiktokTotalFees, tiktokNetProfit);

    const platforms = [
      {
        id: "shopify",
        name: "Shopify",
        totalFees: shopifyTotalFees,
        netProfit: shopifyNetProfit,
        margin: shopifyMarginPct,
        pcts: shopifyPcts,
        annualProfit: Number((shopifyNetProfit * monthlyOrders * 12).toFixed(2)),
      },
      {
        id: "etsy",
        name: "Etsy",
        totalFees: etsyTotalFees,
        netProfit: etsyNetProfit,
        margin: etsyMarginPct,
        pcts: etsyPcts,
        annualProfit: Number((etsyNetProfit * monthlyOrders * 12).toFixed(2)),
      },
      {
        id: "tiktok",
        name: "TikTok Shop",
        totalFees: tiktokTotalFees,
        netProfit: tiktokNetProfit,
        margin: tiktokMarginPct,
        pcts: tiktokPcts,
        annualProfit: Number((tiktokNetProfit * monthlyOrders * 12).toFixed(2)),
      },
    ];

    const sortedByProfit = [...platforms].sort((a, b) => b.netProfit - a.netProfit);
    const winner = sortedByProfit[0];
    const hasProfitablePlatform = platforms.some((p) => p.netProfit > 0);
    const annualAdvantage = Math.max(0, (winner.netProfit - etsyNetProfit) * monthlyOrders * 12);

    return {
      gross,
      etsy: {
        totalFees: etsyTotalFees,
        netProfit: etsyNetProfit,
        margin: etsyMarginPct,
        listingFee: etsyListingFee,
        txFee: etsyTxFee,
        procFee: etsyProcessingFee,
        marketingFee: etsyMarketingFee,
        pcts: etsyPcts,
        annualProfit: Number((etsyNetProfit * monthlyOrders * 12).toFixed(2)),
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
        annualProfit: Number((shopifyNetProfit * monthlyOrders * 12).toFixed(2)),
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
        annualProfit: Number((tiktokNetProfit * monthlyOrders * 12).toFixed(2)),
      },
      winner,
      hasProfitablePlatform,
      annualAdvantage,
    };
  }, [price, cost, shippingBuyer, includeOffsiteAds, includeTikTokAffiliate, monthlyOrders]);

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
        </div>

        {/* Input Controls Grid: Symmetrical 4-Column Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Item Price */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="cmp-item-price" className="text-xs font-bold text-zinc-900">
              Item Price <span className="text-rose-500">*</span>
            </label>
            <div className="relative flex items-center rounded-xl border border-zinc-300 bg-white hover:border-zinc-400 focus-within:border-zinc-950 focus-within:ring-1 focus-within:ring-zinc-950 transition-all">
              <span className="pl-3.5 pr-1 text-xs sm:text-sm font-mono font-bold text-zinc-600 select-none">
                {curr.symbol}
              </span>
              <input
                id="cmp-item-price"
                name="itemPrice"
                aria-label="Item Selling Price"
                type="number"
                inputMode="decimal"
                min={0}
                step="any"
                value={itemPriceStr}
                onChange={(e) => setItemPriceStr(e.target.value)}
                onFocus={(e) => e.target.select()}
                placeholder="50.00"
                className="h-11 min-h-11 w-full rounded-xl bg-transparent px-2 text-xs sm:text-sm font-mono font-bold text-zinc-950 placeholder-zinc-400 focus:outline-hidden tabular-nums"
              />
            </div>
          </div>

          {/* Product Cost */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="cmp-product-cost" className="text-xs font-bold text-zinc-900">
              Product Cost <span className="text-rose-500">*</span>
            </label>
            <div className="relative flex items-center rounded-xl border border-zinc-300 bg-white hover:border-zinc-400 focus-within:border-zinc-950 focus-within:ring-1 focus-within:ring-zinc-950 transition-all">
              <span className="pl-3.5 pr-1 text-xs sm:text-sm font-mono font-bold text-zinc-600 select-none">
                {curr.symbol}
              </span>
              <input
                id="cmp-product-cost"
                name="productCost"
                aria-label="Product Landed Cost COGS"
                type="number"
                inputMode="decimal"
                min={0}
                step="any"
                value={productCostStr}
                onChange={(e) => setProductCostStr(e.target.value)}
                onFocus={(e) => e.target.select()}
                placeholder="20.00"
                className="h-11 min-h-11 w-full rounded-xl bg-transparent px-2 text-xs sm:text-sm font-mono font-bold text-zinc-950 placeholder-zinc-400 focus:outline-hidden tabular-nums"
              />
            </div>
          </div>

          {/* Shipping (to buyer) */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="cmp-shipping-buyer" className="text-xs font-bold text-zinc-900">
              Shipping (to buyer)
            </label>
            <div className="relative flex items-center rounded-xl border border-zinc-300 bg-white hover:border-zinc-400 focus-within:border-zinc-950 focus-within:ring-1 focus-within:ring-zinc-950 transition-all">
              <span className="pl-3.5 pr-1 text-xs sm:text-sm font-mono font-bold text-zinc-600 select-none">
                {curr.symbol}
              </span>
              <input
                id="cmp-shipping-buyer"
                name="shippingBuyer"
                aria-label="Shipping Charged to Buyer"
                type="number"
                inputMode="decimal"
                min={0}
                step="any"
                value={shippingBuyerStr}
                onChange={(e) => setShippingBuyerStr(e.target.value)}
                onFocus={(e) => e.target.select()}
                placeholder="5.00"
                className="h-11 min-h-11 w-full rounded-xl bg-transparent px-2 text-xs sm:text-sm font-mono font-bold text-zinc-950 placeholder-zinc-400 focus:outline-hidden tabular-nums"
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
              className="h-11 min-h-11"
            />
          </div>
        </div>

        {/* Action Row: Advanced Settings Toggle & Primary Pixel Button */}
        <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3.5 border-t border-zinc-100">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="min-h-11 inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-zinc-950 cursor-pointer self-start sm:self-center"
          >
            <SlidersHorizontal className="size-3.5 text-zinc-500" />
            <span>{showAdvanced ? "Hide Advanced Settings" : "+ Advanced Settings (Offsite Ads, Creator Cut, Volume)"}</span>
          </button>

          <PixelButton
            type="button"
            onClick={scrollToResults}
            className="h-11 px-6 rounded-xl font-bold text-xs sm:text-sm shrink-0 justify-center shadow-xs"
          >
            <Calculator className="size-4 shrink-0 stroke-[2.2]" />
            <span>Compare Platforms</span>
          </PixelButton>
        </div>

        {showAdvanced && (
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-zinc-50 rounded-xl border border-zinc-200/80 animate-in fade-in duration-150">
              <label className="min-h-11 flex items-center gap-2 cursor-pointer text-xs font-medium text-zinc-800">
                <input
                  type="checkbox"
                  checked={includeOffsiteAds}
                  onChange={(e) => setIncludeOffsiteAds(e.target.checked)}
                  className="rounded-sm border-zinc-300 text-blue-600 focus:ring-blue-500 size-4"
                />
                <span>Include Etsy Offsite Ads (15%)</span>
              </label>

              <label className="min-h-11 flex items-center gap-2 cursor-pointer text-xs font-medium text-zinc-800">
                <input
                  type="checkbox"
                  checked={includeTikTokAffiliate}
                  onChange={(e) => setIncludeTikTokAffiliate(e.target.checked)}
                  className="rounded-sm border-zinc-300 text-blue-600 focus:ring-blue-500 size-4"
                />
                <span>Include TikTok Creator Cut (10%)</span>
              </label>

              <div className="flex items-center gap-2 min-h-11">
                <label htmlFor="cmp-monthly-orders" className="text-xs text-zinc-600 font-medium whitespace-nowrap">
                  Monthly Orders:
                </label>
                <input
                  id="cmp-monthly-orders"
                  type="number"
                  min={1}
                  value={monthlyOrdersStr}
                  onChange={(e) => setMonthlyOrdersStr(e.target.value)}
                  className="h-9 w-24 rounded-md border border-zinc-300 bg-white px-2 text-xs font-mono font-bold text-zinc-950 focus:outline-hidden"
                />
              </div>
            </div>
          )}
        </div>

      {/* ========================================================= */}
      {/* SECTION 2: The 3 Platform Cards (Etsy, Shopify, TikTok)   */}
      {/* ========================================================= */}
      <div id="comparison-results" className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Platform Cards Generator */}
        {[
          {
            id: "shopify",
            name: "Shopify",
            icon: (
              <div className="size-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs p-1.5">
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
                  <path d="M19.34 7.62a1 1 0 0 0-.89-.62h-2.73a4.5 4.5 0 0 0-8.44 0H4.55a1 1 0 0 0-.89.62L2.05 18.62A1 1 0 0 0 3.04 20h17.92a1 1 0 0 0 .99-1.38L19.34 7.62zM12 4.5a2.5 2.5 0 0 1 2.45 2h-4.9A2.5 2.5 0 0 1 12 4.5z" />
                </svg>
              </div>
            ),
            data: comparison.shopify,
          },
          {
            id: "etsy",
            name: "Etsy",
            icon: (
              <div className="size-9 rounded-lg bg-orange-600 text-white font-serif font-black text-xl flex items-center justify-center shrink-0 shadow-xs">
                E
              </div>
            ),
            data: comparison.etsy,
          },
          {
            id: "tiktok",
            name: "TikTok Shop",
            icon: (
              <div className="size-9 rounded-lg bg-black text-white flex items-center justify-center shrink-0 shadow-xs p-1.5">
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 text-white">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.85.12V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.27 6.27 0 0 0 1.95-4.49V8.82a8.28 8.28 0 0 0 4.82 1.54v-3.45a4.85 4.85 0 0 1-1-.22z" />
                </svg>
              </div>
            ),
            data: comparison.tiktok,
          },
        ].map((plat) => {
          const isWinner = comparison.winner.id === plat.id && comparison.hasProfitablePlatform;
          const isLoss = plat.data.netProfit < 0;

          return (
            <div
              key={plat.id}
              className={cn(
                "rounded-2xl bg-white p-5 sm:p-6 shadow-xs space-y-4 transition-all relative border",
                isWinner
                  ? "border-emerald-500/60 bg-emerald-50/15 shadow-sm ring-1 ring-emerald-500/30"
                  : "border-zinc-200/90 hover:border-zinc-300"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {plat.icon}
                  <h3 className="font-bold text-xl text-zinc-950 tracking-tight">{plat.name}</h3>
                </div>

                {isWinner && (
                  <span className="text-xs font-bold text-emerald-700 font-mono">
                    Highest Margin
                  </span>
                )}
                {isLoss && (
                  <span className="text-xs font-bold text-rose-600 font-mono">
                    (Loss)
                  </span>
                )}
              </div>

              <div className="space-y-2 pt-1 border-t border-zinc-100 text-xs sm:text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-600 font-medium">Total Fees</span>
                  <span className="font-mono font-bold text-zinc-950 tabular-nums">
                    {formatMoney(plat.data.totalFees, curr.symbol)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-600 font-medium">Net Profit</span>
                  <span
                    className={cn(
                      "font-mono font-extrabold text-lg tabular-nums",
                      isLoss ? "text-rose-600" : "text-emerald-600"
                    )}
                  >
                    {formatMoney(plat.data.netProfit, curr.symbol)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-600 font-medium">Profit Margin</span>
                  <span
                    className={cn(
                      "font-mono font-bold tabular-nums",
                      isLoss ? "text-rose-600" : "text-zinc-950"
                    )}
                  >
                    {plat.data.margin.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Stacked Segmented Progress Bar */}
              <div className="h-2.5 rounded-full overflow-hidden flex bg-zinc-100 my-2">
                <div
                  style={{ width: `${plat.data.pcts.costPct}%` }}
                  className="bg-blue-600 h-full"
                  title={`Product Cost: ${plat.data.pcts.costPct}%`}
                />
                <div
                  style={{ width: `${plat.data.pcts.feePct}%` }}
                  className="bg-amber-500 h-full"
                  title={`Platform Fees: ${plat.data.pcts.feePct}%`}
                />
                {plat.data.pcts.profitPct > 0 && (
                  <div
                    style={{ width: `${plat.data.pcts.profitPct}%` }}
                    className="bg-emerald-500 h-full"
                    title={`Net Profit: ${plat.data.pcts.profitPct}%`}
                  />
                )}
              </div>

              {/* Segment Legend */}
              <div className="space-y-1.5 pt-1 text-xs">
                <div className="flex items-center justify-between text-zinc-700">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-blue-600 shrink-0" />
                    <span>Product Cost</span>
                  </div>
                  <span className="font-mono font-medium text-zinc-900 tabular-nums">
                    {formatMoney(cost, curr.symbol)} ({plat.data.pcts.costPct.toFixed(1)}%)
                  </span>
                </div>
                <div className="flex items-center justify-between text-zinc-700">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-amber-500 shrink-0" />
                    <span>Platform Fees</span>
                  </div>
                  <span className="font-mono font-medium text-zinc-900 tabular-nums">
                    {formatMoney(plat.data.totalFees, curr.symbol)} ({plat.data.pcts.feePct.toFixed(1)}%)
                  </span>
                </div>
                <div className="flex items-center justify-between text-zinc-700 font-semibold">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "size-2 rounded-full shrink-0",
                        isLoss ? "bg-rose-500" : "bg-emerald-500"
                      )}
                    />
                    <span>{isLoss ? "Net Loss" : "Net Profit"}</span>
                  </div>
                  <span
                    className={cn(
                      "font-mono font-bold tabular-nums",
                      isLoss ? "text-rose-600" : "text-emerald-700"
                    )}
                  >
                    {formatMoney(plat.data.netProfit, curr.symbol)} ({plat.data.margin.toFixed(1)}%)
                  </span>
                </div>

                {/* Annual Volume Impact Payoff (Addresses Critique-16 #11) */}
                <div className="pt-2 mt-2 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500">
                  <span>Annual ({monthlyOrders}/mo):</span>
                  <span
                    className={cn(
                      "font-mono font-bold tabular-nums",
                      isLoss ? "text-rose-600" : "text-zinc-950"
                    )}
                  >
                    {formatMoney(plat.data.annualProfit, curr.symbol)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
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
                  <td className="py-2.5 px-3 text-right tabular-nums">{formatMoney(comparison.etsy.listingFee, curr.symbol)}</td>
                  <td className="py-2.5 px-3 text-right text-emerald-700 font-medium tabular-nums">{formatMoney(comparison.shopify.listingFee, curr.symbol)}</td>
                  <td className="py-2.5 px-3 text-right text-emerald-700 font-medium tabular-nums">{formatMoney(comparison.tiktok.listingFee, curr.symbol)}</td>
                </tr>
                <tr className="hover:bg-zinc-50/50">
                  <td className="py-2.5 px-3 font-sans font-medium text-zinc-950">Transaction / Referral</td>
                  <td className="py-2.5 px-3 text-right tabular-nums">{formatMoney(comparison.etsy.txFee, curr.symbol)} <span className="text-[11px] text-zinc-400 font-sans">(6.5%)</span></td>
                  <td className="py-2.5 px-3 text-right text-emerald-700 font-medium tabular-nums">{formatMoney(comparison.shopify.txFee, curr.symbol)} <span className="text-[11px] text-zinc-400 font-sans">(0%)</span></td>
                  <td className="py-2.5 px-3 text-right tabular-nums">{formatMoney(comparison.tiktok.txFee, curr.symbol)} <span className="text-[11px] text-zinc-400 font-sans">(6.0%)</span></td>
                </tr>
                <tr className="hover:bg-zinc-50/50">
                  <td className="py-2.5 px-3 font-sans font-medium text-zinc-950">Payment Processing</td>
                  <td className="py-2.5 px-3 text-right tabular-nums">{formatMoney(comparison.etsy.procFee, curr.symbol)} <span className="text-[11px] text-zinc-400 font-sans">(3% + $0.25)</span></td>
                  <td className="py-2.5 px-3 text-right tabular-nums">{formatMoney(comparison.shopify.procFee, curr.symbol)} <span className="text-[11px] text-zinc-400 font-sans">(2.9% + $0.30)</span></td>
                  <td className="py-2.5 px-3 text-right tabular-nums">{formatMoney(comparison.tiktok.procFee, curr.symbol)} <span className="text-[11px] text-zinc-400 font-sans">(1.8% + $0.30)</span></td>
                </tr>
                <tr className="hover:bg-zinc-50/50">
                  <td className="py-2.5 px-3 font-sans font-medium text-zinc-950">Offsite / Marketing</td>
                  <td className="py-2.5 px-3 text-right tabular-nums">{formatMoney(comparison.etsy.marketingFee, curr.symbol)} <span className="text-[11px] text-zinc-400 font-sans">{includeOffsiteAds ? "(15%)" : "(Off)"}</span></td>
                  <td className="py-2.5 px-3 text-right text-emerald-700 font-medium tabular-nums">{formatMoney(comparison.shopify.marketingFee, curr.symbol)}</td>
                  <td className="py-2.5 px-3 text-right tabular-nums">{formatMoney(comparison.tiktok.marketingFee, curr.symbol)} <span className="text-[11px] text-zinc-400 font-sans">{includeTikTokAffiliate ? "(10%)" : "(Off)"}</span></td>
                </tr>
                <tr className="border-t-2 border-zinc-200 bg-zinc-50/80 font-bold">
                  <td className="py-3 px-3 font-sans font-extrabold text-zinc-950 rounded-l-lg">Total Fees</td>
                  <td className="py-3 px-3 text-right text-zinc-950 font-extrabold tabular-nums">{formatMoney(comparison.etsy.totalFees, curr.symbol)}</td>
                  <td className="py-3 px-3 text-right text-emerald-700 font-extrabold tabular-nums">{formatMoney(comparison.shopify.totalFees, curr.symbol)}</td>
                  <td className="py-3 px-3 text-right text-zinc-950 font-extrabold rounded-r-lg tabular-nums">{formatMoney(comparison.tiktok.totalFees, curr.symbol)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Key Takeaways Card - Clean Fintech Style */}
        <div className="lg:col-span-1 rounded-2xl border border-zinc-200/90 bg-white p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="pb-3.5 mb-4 border-b border-zinc-100">
              <h3 className="text-base font-bold text-zinc-950 tracking-tight">
                Platform Takeaways
              </h3>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm text-zinc-800">
              <div className="rounded-xl border border-zinc-150 bg-zinc-50/60 p-3">
                <span className="text-[10px] font-mono uppercase font-bold text-zinc-500 block mb-1">
                  Profit Winner
                </span>
                <p className="text-xs leading-relaxed text-zinc-800">
                  {comparison.hasProfitablePlatform ? (
                    <>
                      <strong className="text-zinc-950 font-bold">{comparison.winner.name}</strong> delivers the highest net profit at{" "}
                      <span className="font-mono font-bold text-emerald-700">{formatMoney(comparison.winner.netProfit, curr.symbol)}</span> ({comparison.winner.margin.toFixed(1)}% margin) per order.
                    </>
                  ) : (
                    <>
                      <strong className="text-rose-600 font-bold">Negative Margin Scenario:</strong> All channels result in a loss. Consider raising price or reducing cost.
                    </>
                  )}
                </p>
              </div>

              <div className="rounded-xl border border-zinc-150 bg-zinc-50/60 p-3">
                <span className="text-[10px] font-mono uppercase font-bold text-zinc-500 block mb-1">
                  Fee Efficiency
                </span>
                <p className="text-xs leading-relaxed text-zinc-800">
                  Shopify keeps 100% of marketplace take-rate (0% referral fee), deducting only standard merchant processing ({formatMoney(comparison.shopify.totalFees, curr.symbol)} total).
                </p>
              </div>

              <div className="rounded-xl border border-zinc-150 bg-zinc-50/60 p-3">
                <span className="text-[10px] font-mono uppercase font-bold text-zinc-500 block mb-1">
                  Volume Projection ({monthlyOrders} orders/mo)
                </span>
                <p className="text-xs font-mono font-bold text-zinc-950">
                  {formatMoney(comparison.winner.annualProfit, curr.symbol)} / year
                  <span className="font-sans font-normal text-zinc-500 block text-[11px] mt-0.5">
                    Estimated annual net profit when prioritizing {comparison.winner.name}.
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500">
            <span>Marketplace strategy:</span>
            <span className="font-medium text-zinc-800">Multi-channel diversification</span>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar for Mobile Ergonomics */}
      {!isEmbed && (
        <StickyResultBar
          label={`${comparison.winner.name} Profit`}
          value={comparison.winner.netProfit}
          subLabel="Margin"
          subValue={comparison.winner.margin}
          subValueFormat="percent"
          productCost={cost}
          totalFees={comparison.winner.totalFees}
          payout={Number((comparison.gross - comparison.winner.totalFees).toFixed(2))}
          breakEven={cost > 0 ? Number((cost + comparison.winner.totalFees).toFixed(2)) : 0}
          currencySymbol={curr.symbol}
          itemizedFees={[
            { label: `${comparison.winner.name} Platform Fees`, amount: comparison.winner.totalFees },
            { label: "Product Cost (COGS)", amount: cost },
          ]}
        />
      )}
    </div>
  );
}
