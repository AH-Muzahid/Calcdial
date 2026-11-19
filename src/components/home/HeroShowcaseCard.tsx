"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type PlatformId = "etsy" | "tiktok" | "shopify";

interface PlatformPreset {
  id: PlatformId;
  name: string;
  badge: string;
  url: string;
  toolHref: string;
  defaultPrice: number;
  defaultCost: number;
  presets: number[];
  calc: (price: number, cost: number, extraOn: boolean) => {
    totalFees: number;
    netProfit: number;
    marginPct: number;
    payout: number;
    feeDetails: string;
  };
}

const PLATFORMS: Record<PlatformId, PlatformPreset> = {
  etsy: {
    id: "etsy",
    name: "Etsy",
    badge: "Handmade & Vintage",
    url: "calcdial.com/tools/etsy-fee-calculator",
    toolHref: "/tools/etsy-fee-calculator",
    defaultPrice: 25.0,
    defaultCost: 8.0,
    presets: [15, 25, 35, 50],
    calc: (price, cost, offsiteAds) => {
      const listing = 0.2;
      const txn = price * 0.065;
      const proc = price * 0.03 + 0.25;
      const ads = offsiteAds ? price * 0.15 : 0;
      const totalFees = listing + txn + proc + ads;
      const netProfit = Math.max(0, price - totalFees - cost);
      const marginPct = price > 0 ? (netProfit / price) * 100 : 0;
      return {
        totalFees,
        netProfit,
        marginPct,
        payout: price - totalFees,
        feeDetails: offsiteAds ? "6.5% txn + 3% proc + 15% ads + $0.45" : "6.5% txn + 3% proc + $0.45 fixed",
      };
    },
  },
  tiktok: {
    id: "tiktok",
    name: "TikTok Shop",
    badge: "Social Commerce",
    url: "calcdial.com/tools/tiktok-shop-fee-calculator",
    toolHref: "/tools/tiktok-shop-fee-calculator",
    defaultPrice: 30.0,
    defaultCost: 8.5,
    presets: [20, 30, 45, 60],
    calc: (price, cost, creatorAffiliate) => {
      const referral = price * 0.06;
      const proc = price * 0.018;
      const affiliate = creatorAffiliate ? price * 0.1 : 0;
      const postage = 4.0;
      const totalFees = referral + proc + affiliate;
      const netProfit = Math.max(0, price - totalFees - cost - postage);
      const marginPct = price > 0 ? (netProfit / price) * 100 : 0;
      return {
        totalFees,
        netProfit,
        marginPct,
        payout: price - totalFees,
        feeDetails: creatorAffiliate ? "6% referral + 1.8% proc + 10% affiliate" : "6% referral + 1.8% processing",
      };
    },
  },
  shopify: {
    id: "shopify",
    name: "Shopify",
    badge: "Direct-to-Consumer",
    url: "calcdial.com/tools/shopify-profit-calculator",
    toolHref: "/tools/shopify-profit-calculator",
    defaultPrice: 48.0,
    defaultCost: 12.5,
    presets: [35, 48, 65, 90],
    calc: (price, cost, adSpend) => {
      const gateway = price * 0.029 + 0.3;
      const ads = adSpend ? 14.0 : 0;
      const shipping = 4.8;
      const totalFees = gateway + ads;
      const netProfit = Math.max(0, price - totalFees - cost - shipping);
      const marginPct = price > 0 ? (netProfit / price) * 100 : 0;
      return {
        totalFees,
        netProfit,
        marginPct,
        payout: price - gateway,
        feeDetails: adSpend ? "2.9% + $0.30 gateway + $14 CAC" : "2.9% + $0.30 standard gateway",
      };
    },
  },
};

export function HeroShowcaseCard() {
  const [activePlatform, setActivePlatform] = useState<PlatformId>("etsy");
  const platform = PLATFORMS[activePlatform];

  const [price, setPrice] = useState<number>(platform.defaultPrice);
  const [extraToggle, setExtraToggle] = useState<boolean>(false);

  const handleSelectPlatform = (id: PlatformId) => {
    setActivePlatform(id);
    setPrice(PLATFORMS[id].defaultPrice);
    setExtraToggle(false);
  };

  const { totalFees, netProfit, marginPct, payout, feeDetails } = useMemo(() => {
    return platform.calc(price, platform.defaultCost, extraToggle);
  }, [platform, price, extraToggle]);

  return (
    <div className="w-full max-w-4xl mx-auto mt-7 text-left">
      {/* Outer Browser Window Mockup */}
      <div className="overflow-hidden rounded-2xl border border-zinc-200/90 bg-white shadow-[0_12px_40px_-12px_rgba(0,0,0,0.08)] transition-all">
        {/* Browser Chrome Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50/80 px-4 py-2.5 sm:px-5">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-rose-400/80" />
            <span className="size-2.5 rounded-full bg-amber-400/80" />
            <span className="size-2.5 rounded-full bg-emerald-400/80" />
          </div>

          {/* Browser Address Bar Pill */}
          <div className="hidden sm:flex items-center gap-1.5 rounded-md border border-zinc-200/70 bg-white px-3 py-1 text-[11px] font-mono text-zinc-500 shadow-2xs">
            <ShieldCheck className="size-3 text-emerald-600" />
            <span>{platform.url}</span>
          </div>

          {/* Live Engine Indicator */}
          <div className="flex items-center gap-1 text-[11px] font-sans font-semibold text-blue-700 bg-blue-50/90 border border-blue-200/60 rounded-full px-2.5 py-0.5 select-none">
            <Sparkles className="size-3 text-blue-600" />
            <span>Live Engine</span>
          </div>
        </div>

        {/* Inner Window Content */}
        <div className="p-4 sm:p-6 bg-white">
          {/* Top Platform Switcher Tabs */}
          <div className="flex items-center justify-between flex-wrap gap-2 pb-4 mb-4 border-b border-zinc-100">
            <div className="inline-flex rounded-lg bg-zinc-100 p-1 text-xs font-sans font-semibold">
              {(["etsy", "tiktok", "shopify"] as PlatformId[]).map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleSelectPlatform(id)}
                  className={cn(
                    "px-3 py-1.5 rounded-md transition-all cursor-pointer text-xs flex items-center gap-1.5",
                    activePlatform === id
                      ? "bg-white text-zinc-950 font-bold shadow-2xs"
                      : "text-zinc-600 hover:text-zinc-950"
                  )}
                >
                  {PLATFORMS[id].name}
                </button>
              ))}
            </div>

            <span className="text-[11px] font-sans font-medium text-zinc-500 hidden sm:inline">
              {platform.badge}
            </span>
          </div>

          {/* 2-Column Responsive Layout: Inputs Left, Live Results Right */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
            {/* Left Inputs (7 cols) */}
            <div className="md:col-span-7 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-zinc-900">
                    Listing Sale Price
                  </label>
                  <span className="text-[11px] text-zinc-400 font-sans">
                    Cost: ${platform.defaultCost.toFixed(2)}
                  </span>
                </div>

                <div className="relative flex items-center min-h-11 rounded-lg border border-zinc-300 bg-white px-3 transition-all focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
                  <span className="text-sm font-mono font-bold text-zinc-500 select-none mr-1.5">
                    $
                  </span>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full bg-transparent font-mono font-bold text-sm text-zinc-950 focus:outline-hidden"
                  />
                </div>

                {/* Quick Presets */}
                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  <span className="text-[10px] text-zinc-400 font-sans mr-1">
                    Quick test:
                  </span>
                  {platform.presets.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPrice(p)}
                      className={cn(
                        "px-2.5 py-1 min-h-7 rounded-md text-[11px] font-mono font-semibold transition-colors cursor-pointer",
                        price === p
                          ? "bg-blue-600 text-white shadow-2xs"
                          : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-950"
                      )}
                    >
                      ${p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Toggle Row */}
              <div className="rounded-lg border border-zinc-200/80 bg-zinc-50/60 p-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-xs font-bold text-zinc-900 block truncate">
                    {activePlatform === "etsy" && "Include 15% Offsite Ads"}
                    {activePlatform === "tiktok" && "Include 10% Creator Affiliate Cut"}
                    {activePlatform === "shopify" && "Include $14 Ad Acquisition (CAC)"}
                  </span>
                  <span className="text-[11px] text-zinc-500 font-sans block truncate">
                    {activePlatform === "etsy" && "Mandatory for sellers over $10k/yr"}
                    {activePlatform === "tiktok" && "TikTok Creator Marketplace fee"}
                    {activePlatform === "shopify" && "Paid marketing customer acquisition"}
                  </span>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={extraToggle}
                  onClick={() => setExtraToggle(!extraToggle)}
                  className={cn(
                    "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden",
                    extraToggle ? "bg-blue-600" : "bg-zinc-200"
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

              <div className="text-[11px] text-zinc-400 font-sans">
                Ratecard formula: <span className="font-mono text-zinc-600">{feeDetails}</span>
              </div>
            </div>

            {/* Right Live Results (5 cols) */}
            <div className="md:col-span-5 flex flex-col justify-between rounded-xl border border-zinc-200/90 bg-zinc-50/70 p-4">
              <div>
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-zinc-200/70">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    Net Take-Home
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold font-mono bg-emerald-100 text-emerald-800">
                    {marginPct.toFixed(1)}% margin
                  </span>
                </div>

                {/* Big Profit Hero Display */}
                <div className="mb-3">
                  <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-600 tracking-tight">
                    ${netProfit.toFixed(2)}
                  </div>
                  <span className="text-[11px] text-zinc-500 font-sans">
                    Payout after all cuts: ${payout.toFixed(2)}
                  </span>
                </div>

                {/* Line Item Breakdown */}
                <div className="space-y-1.5 text-xs font-sans py-2 border-t border-zinc-200/70">
                  <div className="flex justify-between text-zinc-600">
                    <span>Gross Revenue:</span>
                    <span className="font-mono font-semibold text-zinc-900">${price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span>Total Platform Fees:</span>
                    <span className="font-mono font-semibold text-rose-600">-${totalFees.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span>Product Cost:</span>
                    <span className="font-mono font-semibold text-zinc-700">-${platform.defaultCost.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Action Link to Full Calculator */}
              <Link
                href={platform.toolHref}
                className="mt-3 w-full py-2.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold font-sans flex items-center justify-center gap-1.5 transition-all shadow-xs hover:shadow-sm"
              >
                <span>Open Full {platform.name} Calculator</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
