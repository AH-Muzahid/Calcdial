"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, X, Shirt, ArrowLeftRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { CalculatorCard } from "@/components/home/CalculatorCard";
import { AdSlot } from "@/components/layout/AdSlot";

export interface CalculatorItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: "all" | "marketplace" | "ecommerce" | "pod" | "payments";
  categoryLabel: string;
  href: string;
  icon: React.ReactNode;
}

export const CALCULATORS: CalculatorItem[] = [
  {
    id: "etsy",
    slug: "etsy-fee-calculator",
    title: "Etsy Fee Calculator",
    subtitle: "Calculate 6.5% transaction cut, listing renewals, payment processing, and net profit.",
    category: "marketplace",
    categoryLabel: "Marketplace",
    href: "/tools/etsy-fee-calculator",
    icon: (
      <div className="flex size-9 sm:size-10 items-center justify-center rounded-xl bg-[#F1641E] text-white shrink-0 shadow-2xs font-serif font-black text-lg sm:text-xl select-none">
        E
      </div>
    ),
  },
  {
    id: "shopify",
    slug: "shopify-profit-calculator",
    title: "Shopify Profit & ROAS Calculator",
    subtitle: "Model credit card processing rates, third-party fees, and break-even advertising ROAS.",
    category: "ecommerce",
    categoryLabel: "E-Commerce",
    href: "/tools/shopify-profit-calculator",
    icon: (
      <div className="flex size-9 sm:size-10 items-center justify-center rounded-xl bg-white border border-zinc-200/90 shadow-2xs shrink-0 p-1.5 sm:p-2">
        <svg viewBox="0 0 109 123" fill="none" className="size-full">
          <path
            d="M74.7 15.6c-.3-1.4-1.2-6.5-4.8-9.4C66.1 3.2 61.2 3 59.4 3c-.7 0-1.2.1-1.3.1-.9.2-2.3.8-3.7 2-3.1 2.8-5.3 7.8-6.4 13.9l-19.4 6c-2.3.7-2.3.9-2.6 3.1L12.5 106.6l54.8 13.4 39.8-13.4-32.4-91z"
            fill="#95BF47"
          />
          <path
            d="M58.1 3.1c-.7 0-1.2.1-1.3.1-.9.2-2.3.8-3.7 2-3.1 2.8-5.3 7.8-6.4 13.9l-18 5.6 15 95.3 23.6-7.9 3.4-94.6c-.3-1.4-1.2-6.5-4.8-9.4-3.8-3-8.7-3.2-10.5-3.2z"
            fill="#5E8E3E"
          />
          <path
            d="M52.3 35.8c-1.3-.8-2.9-.6-3.8.3-.9 1-1.2 2.6-.4 3.9l9.3 14.5c.8 1.3 2.5 1.7 3.8.9 1.3-.8 1.7-2.5.9-3.8l-9.8-15.8z"
            fill="#fff"
          />
          <path
            d="M68.5 48.7c-4.9-1.2-10.1-.5-14.5 1.9-4.8 2.6-7.8 7.3-8.2 12.8-.5 7.1 4.5 13.4 11.4 14.5 5.6.9 11.2.8 16.8 0 .8-.1 1.4-.8 1.3-1.6-.1-.8-.8-1.4-1.6-1.3-5.2.7-10.4.8-15.6 0-5.3-.8-9.2-5.7-8.8-11.2.3-4.3 2.7-8 6.5-10 3.5-1.9 7.6-2.5 11.6-1.5 2.8.7 5.5 2.1 7.8 4.1.6.5 1.5.5 2.1-.1.6-.6.5-1.5-.1-2.1-2.8-2.4-6.1-4.2-9.6-5.1z"
            fill="#fff"
          />
        </svg>
      </div>
    ),
  },
  {
    id: "tiktok",
    slug: "tiktok-shop-fee-calculator",
    title: "TikTok Shop Fee Calculator",
    subtitle: "Estimate referral fees (6%), fixed cuts ($0.30), creator affiliate commissions, and margins.",
    category: "marketplace",
    categoryLabel: "Social Commerce",
    href: "/tools/tiktok-shop-fee-calculator",
    icon: (
      <div className="flex size-9 sm:size-10 items-center justify-center rounded-xl bg-black text-white shrink-0 shadow-2xs p-1.5 sm:p-2">
        <svg viewBox="0 0 24 24" fill="none" className="size-full">
          <path
            d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.209 1.747 2.89 2.89 0 0 1 2.313-4.639c.314 0 .619.05.904.144V9.42a6.33 6.33 0 0 0-.904-.067 6.337 6.337 0 0 0-6.337 6.338 6.337 6.337 0 0 0 10.82 4.48 6.29 6.29 0 0 0 1.854-4.48V8.97a8.21 8.21 0 0 0 5.01 1.706V7.234a4.836 4.836 0 0 1-1.236-.548z"
            fill="#fff"
          />
          <path
            d="M16.5 6.4a4.8 4.8 0 0 1-3.6-4.1h-.6v13.4a2.9 2.9 0 0 1-5.2 1.7 2.9 2.9 0 0 1 2.3-4.6c.3 0 .6 0 .9.1V9.4a6.3 6.3 0 0 0-.9-.1 6.3 6.3 0 0 0-6.3 6.3 6.3 6.3 0 0 0 10.8 4.5 6.3 6.3 0 0 0 1.9-4.5V9a8.2 8.2 0 0 0 4.9 1.6V7.2a4.8 4.8 0 0 1-4.2-.8z"
            fill="#25F4EE"
            opacity="0.9"
          />
          <path
            d="M17 6.8a4.8 4.8 0 0 1-3.6-4.1h.5v13.4a2.9 2.9 0 0 1-5.2 1.7 2.9 2.9 0 0 1 2.3-4.6c.3 0 .6 0 .9.1V9.8a6.3 6.3 0 0 0-.9-.1 6.3 6.3 0 0 0-6.3 6.3 6.3 6.3 0 0 0 10.8 4.5 6.3 6.3 0 0 0 1.9-4.5V9.4a8.2 8.2 0 0 0 4.9 1.6V7.6a4.8 4.8 0 0 1-4.6-.8z"
            fill="#FE2C55"
            opacity="0.9"
          />
        </svg>
      </div>
    ),
  },
  {
    id: "pod",
    slug: "pod-profit-calculator",
    title: "Print-on-Demand (POD) Calculator",
    subtitle: "Calculate Printify base cost vs. retail markup and realistic take-home profit margin.",
    category: "pod",
    categoryLabel: "POD",
    href: "/tools/pod-profit-calculator",
    icon: (
      <div className="flex size-9 sm:size-10 items-center justify-center rounded-xl bg-purple-600 text-white shrink-0 shadow-2xs">
        <Shirt className="size-5" />
      </div>
    ),
  },
  {
    id: "comparison",
    slug: "etsy-vs-shopify-vs-tiktok-shop-calculator",
    title: "Marketplace Fee Compare",
    subtitle: "Side-by-side fee take rates and net profit for Etsy vs. Shopify vs. TikTok Shop.",
    category: "marketplace",
    categoryLabel: "Comparison",
    href: "/tools/etsy-vs-shopify-vs-tiktok-shop-calculator",
    icon: (
      <div className="flex size-9 sm:size-10 items-center justify-center rounded-xl bg-indigo-600 text-white shrink-0 shadow-2xs">
        <ArrowLeftRight className="size-5" />
      </div>
    ),
  },
  {
    id: "stripe-paypal",
    slug: "stripe-vs-paypal-fee-calculator",
    title: "Stripe vs. PayPal Calculator",
    subtitle: "Compare processor fees and calculate client invoice gross-up amounts.",
    category: "payments",
    categoryLabel: "Payments",
    href: "/tools/stripe-vs-paypal-fee-calculator",
    icon: (
      <div className="flex size-9 sm:size-10 items-center justify-center rounded-xl bg-[#635BFF] text-white shrink-0 shadow-2xs font-bold text-lg select-none">
        S
      </div>
    ),
  },
];

const CATEGORIES = [
  { id: "all", label: "All Calculators" },
  { id: "marketplace", label: "Marketplaces (Etsy, TikTok)" },
  { id: "ecommerce", label: "E-Commerce (Shopify)" },
  { id: "pod", label: "Print-on-Demand (POD)" },
  { id: "payments", label: "Payment Gateways" },
];

const POPULAR_PRESETS = [
  {
    platform: "Etsy Presets",
    items: [
      { label: "US Domestic (6.5% + 3% + $0.25)", href: "/tools/etsy-fee-calculator-us" },
      { label: "UK (4% + £0.20)", href: "/tools/etsy-fee-calculator-uk" },
      { label: "Canada (CA$)", href: "/tools/etsy-fee-calculator-ca" },
      { label: "Australia (A$)", href: "/tools/etsy-fee-calculator-au" },
      { label: "Germany (EUR)", href: "/tools/etsy-fee-calculator-de" },
    ],
  },
  {
    platform: "Shopify Presets",
    items: [
      { label: "Basic Plan (2.9% + $0.30)", href: "/tools/shopify-profit-calculator-basic" },
      { label: "Shopify Plan (2.7% + $0.30)", href: "/tools/shopify-profit-calculator-shopify" },
      { label: "Advanced Plan (2.5% + $0.30)", href: "/tools/shopify-profit-calculator-advanced" },
      { label: "External Gateway (+2% Surcharge)", href: "/tools/shopify-profit-calculator-external" },
    ],
  },
  {
    platform: "TikTok & Payment Presets",
    items: [
      { label: "TikTok Beauty & Health (6%)", href: "/tools/tiktok-shop-fee-calculator-beauty" },
      { label: "TikTok Electronics (5%)", href: "/tools/tiktok-shop-fee-calculator-electronics" },
      { label: "Stripe vs PayPal Direct Fee", href: "/tools/stripe-vs-paypal-fee-calculator" },
      { label: "Invoice Gross-Up Target", href: "/tools/stripe-vs-paypal-fee-calculator" },
    ],
  },
];

export function CalculatorsDirectory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredCalculators = useMemo(() => {
    return CALCULATORS.filter((calc) => {
      const matchesCategory =
        selectedCategory === "all" || calc.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        calc.title.toLowerCase().includes(q) ||
        calc.subtitle.toLowerCase().includes(q) ||
        calc.categoryLabel.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="w-full">
      {/* Search & Filter Toolbar */}
      <div className="mb-6 sm:mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative max-w-xl">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by platform, payment rate, or fee type..."
            className="w-full h-11 sm:h-12 rounded-xl border border-zinc-200/90 bg-white pl-10 pr-9 text-xs sm:text-sm font-medium text-zinc-950 placeholder:text-zinc-400 focus:outline-hidden focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 shadow-xs transition-all"
          />
          <Search className="absolute left-3.5 top-3.5 size-4 sm:size-4.5 text-zinc-400 pointer-events-none" />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-3 sm:top-3.5 text-zinc-400 hover:text-zinc-700 cursor-pointer p-0.5"
              aria-label="Clear search query"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Category Pills & Count */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-0.5">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "px-3.5 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer select-none",
                    isActive
                      ? "bg-[#2b5cfd] text-white shadow-sm shadow-blue-500/25 ring-1 ring-[#1b3cb5]"
                      : "bg-white text-zinc-700 border border-zinc-200/90 hover:bg-zinc-50 hover:text-zinc-950 hover:border-zinc-300"
                  )}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          <span className="text-xs font-medium text-zinc-500 shrink-0">
            Showing <strong className="text-zinc-900 font-semibold">{filteredCalculators.length}</strong> calculators
          </span>
        </div>
      </div>

      {/* Clean Calculator Cards Grid */}
      {filteredCalculators.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4.5 sm:gap-5">
          {filteredCalculators.map((calc) => (
            <CalculatorCard
              key={calc.id}
              id={calc.id}
              title={calc.title}
              subtitle={calc.subtitle}
              href={calc.href}
              icon={calc.icon}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center max-w-md mx-auto my-8">
          <div className="flex size-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 mx-auto mb-2.5">
            <Search className="size-5" />
          </div>
          <h3 className="text-sm font-bold text-zinc-950 mb-1">
            No calculators found
          </h3>
          <p className="text-xs text-zinc-500 mb-3.5">
            No calculators matched &quot;{searchQuery}&quot;. Try adjusting your search or reset filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
            className="inline-flex items-center text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* High-Yield In-Content Ad Placement (CLS Safe) */}
      <div className="my-8 sm:my-10">
        <AdSlot position="in-content" />
      </div>

      {/* Popular Scenarios & Country Presets Jump Chips */}
      <section className="rounded-xl border border-zinc-200/80 bg-white p-4.5 sm:p-6 shadow-xs">
        <div className="pb-3.5 mb-4 border-b border-zinc-100">
          <h2 className="text-sm sm:text-base font-bold text-zinc-950 tracking-tight">
            Popular Presets & Quick Scenarios
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Instant shortcuts to pre-configured regional rates, category rules, and payment modes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5">
          {POPULAR_PRESETS.map((group) => (
            <div key={group.platform} className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block font-mono">
                {group.platform}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    prefetch={false}
                    className="text-[11px] font-medium text-zinc-700 hover:text-blue-600 bg-zinc-50 hover:bg-blue-50/70 border border-zinc-200/70 hover:border-blue-200 rounded-lg px-2.5 py-1 transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
