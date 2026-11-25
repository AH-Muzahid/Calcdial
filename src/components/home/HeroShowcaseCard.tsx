"use client";

import React, { useState, useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { PixelLink } from "@/components/ui/PixelButton";
import { cn, formatMoney } from "@/lib/utils";
import { calculateEtsyFees } from "@/lib/formulas/etsy-fees";
import { calculateTikTokFees } from "@/lib/formulas/tiktok-fees";
import { calculateShopifyProfit } from "@/lib/formulas/shopify-profit";

type PlatformId = "etsy" | "tiktok" | "shopify";

interface PlatformPreset {
  id: PlatformId;
  name: string;
  toolHref: string;
  defaultPrice: number;
  defaultCost: number;
  presets: number[];
  calc: (price: number, cost: number, extraOn: boolean) => {
    totalFees: number;
    netProfit: number;
    marginPct: number;
    payout: number;
  };
}

const PLATFORMS: Record<PlatformId, PlatformPreset> = {
  etsy: {
    id: "etsy",
    name: "Etsy",
    toolHref: "/tools/etsy-fee-calculator",
    defaultPrice: 25.0,
    defaultCost: 8.0,
    presets: [15, 25, 35, 50],
    calc: (price, cost, offsiteAds) => {
      const res = calculateEtsyFees({
        itemPrice: price,
        shippingCharge: 0,
        itemCost: cost,
        offsiteAdsOptIn: offsiteAds,
        offsiteAdsRate: 0.15,
        country: "us",
      });
      return {
        totalFees: res.totalFees,
        netProfit: res.netProfit,
        marginPct: res.netMarginPct,
        payout: res.etsyPayout,
      };
    },
  },
  tiktok: {
    id: "tiktok",
    name: "TikTok Shop",
    toolHref: "/tools/tiktok-shop-fee-calculator",
    defaultPrice: 30.0,
    defaultCost: 8.5,
    presets: [20, 30, 45, 60],
    calc: (price, cost, creatorAffiliate) => {
      const res = calculateTikTokFees({
        salePrice: price,
        shippingCharged: 0,
        cogs: cost,
        shippingCost: 4.0,
        category: "beauty",
        creatorAffiliatePct: creatorAffiliate ? 10 : 0,
      });
      return {
        totalFees: res.totalFees,
        netProfit: res.netProfit,
        marginPct: res.netMarginPct,
        payout: res.netPayout,
      };
    },
  },
  shopify: {
    id: "shopify",
    name: "Shopify",
    toolHref: "/tools/shopify-profit-calculator",
    defaultPrice: 48.0,
    defaultCost: 12.5,
    presets: [35, 48, 65, 90],
    calc: (price, cost, adSpend) => {
      const res = calculateShopifyProfit({
        itemPrice: price,
        shippingCharged: 0,
        cogs: cost,
        shippingCost: 4.8,
        adSpend: adSpend ? 14.0 : 0,
        shopifyPlan: "basic",
        gateway: "shopify-payments",
      });
      return {
        totalFees: res.totalPlatformFees,
        netProfit: res.netProfit,
        marginPct: res.netMarginPct,
        payout: res.netPayout,
      };
    },
  },
};

export function HeroShowcaseCard() {
  const [activePlatform, setActivePlatform] = useState<PlatformId>("etsy");
  const platform = PLATFORMS[activePlatform];

  const [price, setPrice] = useState<number>(platform.defaultPrice);
  const [cost, setCost] = useState<number>(platform.defaultCost);
  const [extraToggle, setExtraToggle] = useState<boolean>(false);

  const handleSelectPlatform = (id: PlatformId) => {
    setActivePlatform(id);
    setPrice(PLATFORMS[id].defaultPrice);
    setCost(PLATFORMS[id].defaultCost);
    setExtraToggle(false);
  };

  const { totalFees, netProfit, marginPct, payout } = useMemo(() => {
    return platform.calc(price, cost, extraToggle);
  }, [platform, price, cost, extraToggle]);

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 text-left">
      <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 sm:p-6 shadow-[0_24px_64px_-16px_rgba(0,0,0,0.28)]">
        {/* Compact Segmented Platform Switcher (Neutral so Primary CTA keeps 10% accent focus) */}
        <div className="flex items-center justify-center mb-6">
          <div className="inline-flex rounded-lg bg-zinc-100 p-1 text-xs font-sans font-medium">
            {(["etsy", "tiktok", "shopify"] as PlatformId[]).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => handleSelectPlatform(id)}
                className={cn(
                  "h-8 px-3 rounded-md transition-all cursor-pointer text-xs flex items-center justify-center",
                  activePlatform === id
                    ? "bg-white text-[#2b5cfd] font-semibold shadow-xs"
                    : "text-zinc-500 hover:text-zinc-900"
                )}
              >
                {PLATFORMS[id].name}
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Layout: Clean Inputs Left -> Highlighted Result + Primary CTA Right */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Left Inputs Column (Flat on white card to avoid nested-box clutter) */}
          <div className="flex flex-col justify-between py-2">
            <div className="space-y-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 block">
                Pricing &amp; Cost Inputs
              </span>

              {/* 2-Col Inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-zinc-900 block mb-2">
                    Sale Price
                  </label>
                  <div className="relative flex items-center h-9 rounded-lg border border-zinc-300 bg-white px-3 transition-all focus-within:border-[#2b5cfd] focus-within:ring-1 focus-within:ring-[#2b5cfd]">
                    <span className="text-xs font-mono font-semibold text-zinc-400 select-none mr-1.5">$</span>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-full bg-transparent font-mono font-semibold text-sm text-zinc-950 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-900 block mb-2">
                    Item Cost
                  </label>
                  <div className="relative flex items-center h-9 rounded-lg border border-zinc-300 bg-white px-3 transition-all focus-within:border-[#2b5cfd] focus-within:ring-1 focus-within:ring-[#2b5cfd]">
                    <span className="text-xs font-mono font-semibold text-zinc-400 select-none mr-1.5">$</span>
                    <input
                      type="number"
                      value={cost}
                      onChange={(e) => setCost(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-full bg-transparent font-mono font-semibold text-sm text-zinc-950 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Compact Quick Presets (Soft Brand Tint — keeps solid #2b5cfd exclusive to Primary CTA) */}
              <div className="flex items-center gap-2 flex-wrap">
                {platform.presets.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPrice(p)}
                    className={cn(
                      "h-8 px-3 rounded-lg text-xs font-mono font-semibold border transition-colors cursor-pointer flex items-center justify-center",
                      price === p
                        ? "bg-[#2b5cfd]/10 text-[#2b5cfd] border-[#2b5cfd]/30"
                        : "bg-white border-zinc-200/90 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950"
                    )}
                  >
                    ${p}
                  </button>
                ))}
              </div>

              {/* Optional Fee Toggle */}
              <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/70 p-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-zinc-900 block truncate">
                    {activePlatform === "etsy" && "Include 15% Offsite Ads"}
                    {activePlatform === "tiktok" && "Include 10% Creator Affiliate Cut"}
                    {activePlatform === "shopify" && "Include $14 Ad Acquisition (CAC)"}
                  </span>
                  <span className="text-xs text-zinc-500 font-sans block truncate mt-0.5">
                    {activePlatform === "etsy" && "Optional 15% fee for shops under $10k/yr"}
                    {activePlatform === "tiktok" && "TikTok Creator Marketplace fee"}
                    {activePlatform === "shopify" && "Paid marketing customer acquisition"}
                  </span>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={extraToggle}
                  aria-label="Toggle optional platform fee"
                  onClick={() => setExtraToggle(!extraToggle)}
                  className={cn(
                    "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden",
                    extraToggle ? "bg-[#2b5cfd]" : "bg-zinc-300"
                  )}
                >
                  <span
                    className={cn(
                      "pointer-events-none inline-block size-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out",
                      extraToggle ? "translate-x-4" : "translate-x-0"
                    )}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Right Live Results Panel (Subtle surface highlights the focal output + CTA) */}
          <div className="flex flex-col justify-between rounded-xl border border-zinc-200/80 bg-zinc-50 p-4 sm:p-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Net Profit
                </span>
                <span className="text-xs font-mono font-semibold text-emerald-700">
                  {marginPct.toFixed(1)}% margin
                </span>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-600 tracking-tight tabular-nums">
                  {formatMoney(netProfit, "$")}
                </div>
                <span className="text-xs text-zinc-500 font-sans block mt-1 tabular-nums">
                  Est. Bank Deposit: {formatMoney(payout, "$")}
                </span>
              </div>

              {/* Visual Ratio Bar */}
              <div className="my-4">
                <div className="h-2 w-full rounded-full bg-zinc-200/80 overflow-hidden flex">
                  <div
                    style={{ width: `${Math.min(100, Math.max(0, price > 0 ? (netProfit / price) * 100 : 0))}%` }}
                    className="bg-emerald-500 h-full transition-all duration-300"
                    title="Net Profit"
                  />
                  <div
                    style={{ width: `${Math.min(100, Math.max(0, price > 0 ? (totalFees / price) * 100 : 0))}%` }}
                    className="bg-rose-500 h-full transition-all duration-300"
                    title="Platform Fees"
                  />
                  <div
                    style={{ width: `${Math.min(100, Math.max(0, price > 0 ? (cost / price) * 100 : 0))}%` }}
                    className="bg-zinc-400 h-full transition-all duration-300"
                    title="Item Cost"
                  />
                </div>
              </div>

              {/* Breakdown Rows */}
              <div className="space-y-2 text-xs font-sans">
                <div className="flex justify-between text-zinc-600">
                  <span className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    Gross Revenue
                  </span>
                  <span className="font-mono font-semibold text-zinc-900 tabular-nums">{formatMoney(price, "$")}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-rose-500" />
                    Platform Fees
                  </span>
                  <span className="font-mono font-semibold text-rose-600 tabular-nums">-{formatMoney(totalFees, "$")}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-zinc-400" />
                    Item Cost
                  </span>
                  <span className="font-mono font-semibold text-zinc-700 tabular-nums">-{formatMoney(cost, "$")}</span>
                </div>
              </div>
            </div>

            {/* Sole 10% Accent Focal CTA */}
            <PixelLink
              href={platform.toolHref}
              className="mt-4 w-full h-10 px-4 text-sm font-semibold font-sans justify-between"
            >
              <span className="truncate">Open Full {platform.name} Calculator</span>
              <ArrowRight className="size-4 text-white shrink-0 group-hover/pixel:translate-x-0.5 transition-transform" />
            </PixelLink>
          </div>
        </div>
      </div>
    </div>
  );
}
