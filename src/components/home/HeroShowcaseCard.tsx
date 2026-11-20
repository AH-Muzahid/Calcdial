"use client";

import React, { useState, useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { PixelLink } from "@/components/ui/PixelButton";
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
    <div className="w-full max-w-4xl mx-auto mt-7 text-left">
      {/* Standalone Live Calculator Showcase Card with Premium Elevation */}
      <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 sm:p-6 shadow-[0_24px_64px_-16px_rgba(0,0,0,0.35)]">
        {/* Top Platform Switcher Tabs */}
          <div className="flex items-center justify-center pb-4 mb-4 border-b border-zinc-100">
            <div className="inline-flex rounded-lg bg-zinc-100 p-1 text-xs font-sans font-semibold">
              {(["etsy", "tiktok", "shopify"] as PlatformId[]).map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleSelectPlatform(id)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-md transition-all cursor-pointer text-xs flex items-center gap-1.5",
                    activePlatform === id
                      ? "bg-[#2b5cfd] text-white font-bold shadow-xs"
                      : "text-zinc-600 hover:text-zinc-950"
                  )}
                >
                  {PLATFORMS[id].name}
                </button>
              ))}
            </div>
          </div>

          {/* 2-Column Responsive Layout: Equal 50/50 Matching Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
            {/* Left Inputs Card */}
            <div className="flex flex-col justify-between rounded-xl border border-zinc-200/90 bg-zinc-50/50 p-4 sm:p-4.5">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-200/70">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    Pricing &amp; Cost Inputs
                  </span>
                  <span className="text-[11px] font-mono font-medium text-zinc-400">
                    USD ($)
                  </span>
                </div>

                {/* 2-Col Inputs: Sale Price & Item Cost */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-zinc-900 block mb-1">
                      Sale Price
                    </label>
                    <div className="relative flex items-center min-h-10 rounded-lg border border-zinc-300 bg-white px-2.5 transition-all focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
                      <span className="text-xs font-mono font-bold text-zinc-500 select-none mr-1">$</span>
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                        className="w-full bg-transparent font-mono font-bold text-sm text-zinc-950 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-900 block mb-1">
                      Item Cost
                    </label>
                    <div className="relative flex items-center min-h-10 rounded-lg border border-zinc-300 bg-white px-2.5 transition-all focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
                      <span className="text-xs font-mono font-bold text-zinc-500 select-none mr-1">$</span>
                      <input
                        type="number"
                        value={cost}
                        onChange={(e) => setCost(Math.max(0, parseFloat(e.target.value) || 0))}
                        className="w-full bg-transparent font-mono font-bold text-sm text-zinc-950 focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>

                {/* Quick Presets */}
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-zinc-400 font-sans mr-1">
                      Presets:
                    </span>
                    {platform.presets.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPrice(p)}
                        className={cn(
                          "px-2.5 py-1 min-h-7 rounded-lg text-[11px] font-mono font-semibold transition-all cursor-pointer",
                          price === p
                            ? "bg-[#2b5cfd] text-white shadow-[inset_0_1px_0_0_rgb(255_255_255/0.35),inset_0_-1px_0_0_rgb(10_30_120/0.35),0_3px_8px_-2px_rgb(43_92_253/0.45)] ring-1 ring-[#1b3cb5]"
                            : "bg-white border border-zinc-200/90 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
                        )}
                      >
                        ${p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dynamic Toggle Row */}
                <div className="rounded-lg border border-zinc-200/80 bg-white p-2.5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-zinc-900 block truncate">
                      {activePlatform === "etsy" && "Include 15% Offsite Ads"}
                      {activePlatform === "tiktok" && "Include 10% Creator Affiliate Cut"}
                      {activePlatform === "shopify" && "Include $14 Ad Acquisition (CAC)"}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-sans block truncate">
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
              </div>
            </div>

            {/* Right Live Results Card */}
            <div className="flex flex-col justify-between rounded-xl border border-zinc-200/90 bg-zinc-50/70 p-4 sm:p-4.5">
              <div>
                <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-zinc-200/70">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    Net Take-Home
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-700">
                    {marginPct.toFixed(1)}% margin
                  </span>
                </div>

                {/* Big Profit Hero Display */}
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-600 tracking-tight">
                    ${netProfit.toFixed(2)}
                  </div>
                  <span className="text-[11px] text-zinc-500 font-sans block mt-0.5">
                    Est. payout after cuts: ${payout.toFixed(2)}
                  </span>
                </div>

                {/* Visual Ratio Breakdown Bar */}
                <div className="mt-3 mb-3">
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
                      style={{ width: `${Math.min(100, Math.max(0, price > 0 ? (platform.defaultCost / price) * 100 : 0))}%` }}
                      className="bg-zinc-400 h-full transition-all duration-300"
                      title="Product Cost"
                    />
                  </div>

                  {/* Micro legend */}
                  <div className="flex items-center justify-between text-[10px] text-zinc-500 mt-1.5 font-sans">
                    <span className="flex items-center gap-1 font-medium">
                      <span className="size-1.5 rounded-full bg-emerald-500" /> Profit ({marginPct.toFixed(0)}%)
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <span className="size-1.5 rounded-full bg-rose-500" /> Fees ({price > 0 ? ((totalFees / price) * 100).toFixed(0) : 0}%)
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <span className="size-1.5 rounded-full bg-zinc-400" /> Cost
                    </span>
                  </div>
                </div>

                {/* Line Item Breakdown */}
                <div className="space-y-1.5 text-xs font-sans py-2 border-t border-zinc-200/70">
                  <div className="flex justify-between text-zinc-600">
                    <span className="flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-zinc-400" />
                      Gross Revenue:
                    </span>
                    <span className="font-mono font-semibold text-zinc-900">${price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span className="flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-rose-500" />
                      Platform Fees:
                    </span>
                    <span className="font-mono font-semibold text-rose-600">-${totalFees.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span className="flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-zinc-400" />
                      Est. Item Cost:
                    </span>
                    <span className="font-mono font-semibold text-zinc-700">-${cost.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Action Link to Full Calculator with Exact vibrant.design Pixel Matrix & Shadow */}
              <PixelLink
                href={platform.toolHref}
                className="mt-3 w-full h-10 px-4 text-xs font-semibold font-sans justify-between"
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
