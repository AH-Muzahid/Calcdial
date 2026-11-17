"use client";

import { useState } from "react";
import { GoalGauge, GaugeSegment } from "@/components/motion/goal-gauge";
import { PillTabs } from "@/components/motion/pill-tabs";

interface PlatformDemo {
  id: string;
  name: string;
  price: number;
  segments: GaugeSegment[];
  summary: string;
  ctaLink: string;
}

const PLATFORM_DEMOS: Record<string, PlatformDemo> = {
  etsy: {
    id: "etsy",
    name: "Etsy",
    price: 35.0,
    segments: [
      { label: "Your Payout", value: 28.27, color: "#000000" },
      { label: "Etsy 6.5%", value: 2.28, color: "#52525b" },
      { label: "Payment 3%+$0.25", value: 1.30, color: "#71717a" },
      { label: "Listing Fee", value: 0.20, color: "#a1a1aa" },
      { label: "Estimated Shipping", value: 2.95, color: "#d4d4d8" },
    ],
    summary: "Etsy takes ~19% in total fees on a $35 order.",
    ctaLink: "/tools/etsy-fee-calculator",
  },
  shopify: {
    id: "shopify",
    name: "Shopify",
    price: 35.0,
    segments: [
      { label: "Your Payout", value: 33.68, color: "#000000" },
      { label: "Shopify 2.9%+$0.30", value: 1.32, color: "#71717a" },
    ],
    summary: "Shopify Payments keeps 96.2% of your sale in your pocket.",
    ctaLink: "/tools/shopify-profit-calculator",
  },
  tiktok: {
    id: "tiktok",
    name: "TikTok Shop",
    price: 35.0,
    segments: [
      { label: "Your Payout", value: 29.75, color: "#000000" },
      { label: "TikTok 6%", value: 2.10, color: "#52525b" },
      { label: "Creator Affiliate 9%", value: 3.15, color: "#71717a" },
    ],
    summary: "TikTok Shop deducts category referral fees before affiliate cuts.",
    ctaLink: "/tools/tiktok-shop-fee-calculator",
  },
  pod: {
    id: "pod",
    name: "Print-on-Demand",
    price: 35.0,
    segments: [
      { label: "Net Margin", value: 14.50, color: "#000000" },
      { label: "Printify Base", value: 12.00, color: "#52525b" },
      { label: "Fulfillment Ship", value: 4.50, color: "#71717a" },
      { label: "Marketplace Cut", value: 4.00, color: "#a1a1aa" },
    ],
    summary: "Real POD profit after print, shipping, and channel deductions.",
    ctaLink: "/tools/pod-profit-calculator",
  },
};

export function HeroDialDemo() {
  const [platform, setPlatform] = useState<string>("etsy");
  const demo = PLATFORM_DEMOS[platform] ?? PLATFORM_DEMOS.etsy;

  const tabs = [
    { id: "etsy", label: "Etsy" },
    { id: "shopify", label: "Shopify" },
    { id: "tiktok", label: "TikTok Shop" },
    { id: "pod", label: "POD" },
  ];

  return (
    <div className="relative mx-auto mt-10 max-w-xl rounded-3xl border border-black/[0.08] bg-white p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      {/* Precision Instrument Header Badge */}
      <div className="flex items-center justify-between border-b border-black/[0.06] pb-4">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-black" />
          <span className="text-xs font-mono font-medium uppercase tracking-wider text-zinc-500">
            Interactive Fee Dial · Live Demo
          </span>
        </div>
        <span className="rounded-full bg-black/[0.04] border border-black/[0.06] px-2.5 py-0.5 text-[11px] font-mono font-medium text-black">
          $35.00 Model Order
        </span>
      </div>

      {/* Rubber Pill Tabs for Platform Switching */}
      <div className="my-5 flex justify-center">
        <PillTabs
          tabs={tabs}
          value={platform}
          onValueChange={setPlatform}
          label="Marketplace Select"
        />
      </div>

      {/* Physical GoalGauge Half-Ring Meter */}
      <div className="flex justify-center my-2">
        <GoalGauge
          title={`${demo.name} Net Split`}
          subtitle={demo.summary}
          goal={demo.price}
          segments={demo.segments}
          currency="USD"
        />
      </div>

      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-black/[0.06] text-xs">
        <span className="text-zinc-500 font-medium text-center sm:text-left">
          Want to input your own custom pricing and shipping?
        </span>
        <a
          href={demo.ctaLink}
          className="inline-flex items-center gap-1.5 rounded-full bg-black px-4 py-2 font-medium text-white shadow-xs transition hover:bg-zinc-800 hover:shadow-sm"
        >
          <span>Open Full Calculator</span>
          <span className="font-mono text-zinc-400">→</span>
        </a>
      </div>
    </div>
  );
}
