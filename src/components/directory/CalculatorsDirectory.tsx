"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  X,
  ArrowRight,
  Shirt,
  ArrowLeftRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface CalculatorItem {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  category: "marketplace" | "ecommerce" | "payments" | "pod";
  categoryLabel: string;
  rateSummary: string;
  icon: React.ReactNode;
  presets: { label: string; href: string }[];
}

export const ALL_CALCULATORS: CalculatorItem[] = [
  {
    id: "etsy",
    slug: "etsy-fee-calculator",
    title: "Etsy Fee Calculator",
    shortDescription:
      "Calculate 6.5% transaction cuts, listing renewal fees ($0.20), country-specific payment processing, and mandatory Offsite Ads profit margins.",
    category: "marketplace",
    categoryLabel: "Marketplace",
    rateSummary: "6.5% + 3% + $0.25",
    icon: (
      <div className="flex size-10 items-center justify-center rounded-xl bg-[#F1641E] text-white shadow-2xs font-serif font-black text-xl select-none shrink-0">
        E
      </div>
    ),
    presets: [
      { label: "US Domestic", href: "/tools/etsy-fee-calculator-us" },
      { label: "UK (4% + £0.20)", href: "/tools/etsy-fee-calculator-uk" },
      { label: "Canada (CA$)", href: "/tools/etsy-fee-calculator-ca" },
      { label: "Australia", href: "/tools/etsy-fee-calculator-au" },
      { label: "Germany (EUR)", href: "/tools/etsy-fee-calculator-de" },
    ],
  },
  {
    id: "shopify",
    slug: "shopify-profit-calculator",
    title: "Shopify Profit & ROAS Calculator",
    shortDescription:
      "Calculate net profit margins, credit card processing rates, third-party payment gateway penalty surcharges, and break-even advertising ROAS.",
    category: "ecommerce",
    categoryLabel: "E-Commerce",
    rateSummary: "2.9% + $0.30 (Basic)",
    icon: (
      <div className="flex size-10 items-center justify-center rounded-xl bg-white border border-zinc-200/90 shadow-2xs shrink-0 p-2">
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
    presets: [
      { label: "Basic Plan (2.9%)", href: "/tools/shopify-profit-calculator-basic" },
      { label: "Shopify Plan (2.7%)", href: "/tools/shopify-profit-calculator-shopify" },
      { label: "Advanced Plan (2.5%)", href: "/tools/shopify-profit-calculator-advanced" },
      { label: "External Gateway (+2%)", href: "/tools/shopify-profit-calculator-external" },
    ],
  },
  {
    id: "tiktok",
    slug: "tiktok-shop-fee-calculator",
    title: "TikTok Shop Fee Calculator",
    shortDescription:
      "Estimate TikTok Shop referral fees (6%), fixed transaction fee ($0.30), creator affiliate commissions, and customer shipping subsidy deductions.",
    category: "marketplace",
    categoryLabel: "Social Commerce",
    rateSummary: "6% Referral + $0.30",
    icon: (
      <div className="flex size-10 items-center justify-center rounded-xl bg-black text-white shadow-2xs p-2 shrink-0">
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
    presets: [
      { label: "Beauty & Health (6%)", href: "/tools/tiktok-shop-fee-calculator-beauty" },
      { label: "Electronics (5%)", href: "/tools/tiktok-shop-fee-calculator-electronics" },
      { label: "Apparel & Shoes (6%)", href: "/tools/tiktok-shop-fee-calculator-apparel" },
      { label: "Home Goods (6%)", href: "/tools/tiktok-shop-fee-calculator-home" },
    ],
  },
  {
    id: "pod",
    slug: "pod-profit-calculator",
    title: "Print-on-Demand (POD) Profit Calculator",
    shortDescription:
      "Calculate real margins on Printify, Gelato, and custom apparel. Compare base manufacturing, buyer shipping, platform fees, and target markup.",
    category: "pod",
    categoryLabel: "Print-on-Demand",
    rateSummary: "Base Cost + Markup",
    icon: (
      <div className="flex size-10 items-center justify-center rounded-xl bg-purple-600 text-white shadow-2xs shrink-0">
        <Shirt className="size-5" />
      </div>
    ),
    presets: [
      { label: "Bella+Canvas 3001", href: "/tools/pod-profit-calculator-tshirt" },
      { label: "Gildan 18500 Hoodie", href: "/tools/pod-profit-calculator-hoodie" },
      { label: "Ceramic Mug 11oz", href: "/tools/pod-profit-calculator-mug" },
      { label: "Matte Canvas Poster", href: "/tools/pod-profit-calculator-poster" },
    ],
  },
  {
    id: "comparison",
    slug: "etsy-vs-shopify-vs-tiktok-shop-calculator",
    title: "3-Way Marketplace Profit Comparison",
    shortDescription:
      "Head-to-head comparison across Etsy, Shopify, and TikTok Shop. See who takes the biggest cut, stacked fee percentages, and winner profit margin.",
    category: "marketplace",
    categoryLabel: "Comparison Engine",
    rateSummary: "Multi-Channel Take Rates",
    icon: (
      <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-2xs shrink-0">
        <ArrowLeftRight className="size-5" />
      </div>
    ),
    presets: [
      { label: "$25 Scenario", href: "/tools/etsy-vs-shopify-vs-tiktok-shop-calculator" },
      { label: "$50 Scenario", href: "/tools/etsy-vs-shopify-vs-tiktok-shop-calculator" },
      { label: "$100 Scenario", href: "/tools/etsy-vs-shopify-vs-tiktok-shop-calculator" },
    ],
  },
  {
    id: "stripe-paypal",
    slug: "stripe-vs-paypal-fee-calculator",
    title: "Stripe vs. PayPal Fee Comparison & Gross-Up",
    shortDescription:
      "Direct processing fee comparison, annual volume projection savings, and exact client invoice reverse gross-up calculator so you keep 100% of your earnings.",
    category: "payments",
    categoryLabel: "Payment Gateways",
    rateSummary: "2.9% vs. 3.49% + Gross-Up",
    icon: (
      <div className="flex size-10 items-center justify-center rounded-xl bg-[#635BFF] text-white shadow-2xs font-bold text-xl select-none shrink-0">
        S
      </div>
    ),
    presets: [
      { label: "Direct Payment Fee", href: "/tools/stripe-vs-paypal-fee-calculator" },
      { label: "Invoice Gross-Up (Cover Fees)", href: "/tools/stripe-vs-paypal-fee-calculator" },
      { label: "International Cards", href: "/tools/stripe-vs-paypal-fee-calculator" },
    ],
  },
];

const CATEGORIES = [
  { id: "all", label: "All Calculators" },
  { id: "marketplace", label: "Marketplaces (Etsy, TikTok)" },
  { id: "ecommerce", label: "E-Commerce Stores (Shopify)" },
  { id: "pod", label: "Print-on-Demand (POD)" },
  { id: "payments", label: "Payments & Invoicing" },
];

export function CalculatorsDirectory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredCalculators = useMemo(() => {
    return ALL_CALCULATORS.filter((calc) => {
      const matchesCategory =
        selectedCategory === "all" || calc.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        calc.title.toLowerCase().includes(q) ||
        calc.shortDescription.toLowerCase().includes(q) ||
        calc.categoryLabel.toLowerCase().includes(q) ||
        calc.presets.some((p) => p.label.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
  };

  return (
    <div className="w-full">
      {/* Search & Filter Toolbar */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative max-w-2xl">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by calculator name, platform, rate, or feature..."
            className="w-full h-12 rounded-xl border border-zinc-200/90 bg-white pl-11 pr-10 text-sm font-medium text-zinc-950 placeholder:text-zinc-400 focus:outline-hidden focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 shadow-xs transition-all"
          />
          <Search className="absolute left-3.5 top-3.5 size-5 text-zinc-400 pointer-events-none" />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-3.5 text-zinc-400 hover:text-zinc-700 cursor-pointer"
              aria-label="Clear search query"
            >
              <X className="size-5" />
            </button>
          )}
        </div>

        {/* Category Pills & Count */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer select-none",
                    isActive
                      ? "bg-zinc-950 text-white shadow-2xs"
                      : "bg-white text-zinc-600 border border-zinc-200/80 hover:border-zinc-300 hover:text-zinc-950"
                  )}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          <span className="text-xs font-medium text-zinc-500 shrink-0">
            Showing <strong className="text-zinc-900 font-semibold">{filteredCalculators.length}</strong> of {ALL_CALCULATORS.length} calculators
          </span>
        </div>
      </div>

      {/* Calculator Grid */}
      {filteredCalculators.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCalculators.map((calc) => (
            <div
              key={calc.id}
              className="group flex flex-col justify-between rounded-xl border border-zinc-200/90 bg-white p-5 sm:p-6 shadow-xs hover:border-blue-400/60 hover:shadow-[0_12px_32px_-8px_rgba(43,92,253,0.12),0_2px_8px_rgba(0,0,0,0.03)] transition-all duration-200"
            >
              {/* Card Header & Body */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-3.5">
                  <div className="transition-transform duration-200 group-hover:scale-105">
                    {calc.icon}
                  </div>
                  <span className="rounded-full bg-zinc-100 border border-zinc-200/80 px-2.5 py-0.5 text-[10px] font-mono font-bold text-zinc-700 uppercase tracking-wider shrink-0">
                    {calc.rateSummary}
                  </span>
                </div>

                <div className="mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 block mb-0.5">
                    {calc.categoryLabel}
                  </span>
                  <h3 className="text-lg font-bold text-zinc-950 group-hover:text-blue-600 transition-colors tracking-tight leading-snug">
                    <Link href={`/tools/${calc.slug}`} prefetch={false}>
                      {calc.title}
                    </Link>
                  </h3>
                </div>

                <p className="text-xs sm:text-[13px] text-zinc-600 leading-relaxed font-normal mb-4">
                  {calc.shortDescription}
                </p>
              </div>

              {/* Bottom Presets & CTA */}
              <div className="pt-3 border-t border-zinc-100 space-y-3">
                {/* Popular Scenarios / Country Presets */}
                <div>
                  <span className="text-[10px] uppercase font-mono font-bold text-zinc-400 block mb-1.5">
                    Quick Presets
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {calc.presets.map((preset) => (
                      <Link
                        key={preset.label}
                        href={preset.href}
                        prefetch={false}
                        className="text-[11px] font-medium text-zinc-600 hover:text-blue-600 bg-zinc-50 hover:bg-blue-50/60 border border-zinc-200/70 hover:border-blue-200 rounded-md px-2 py-0.5 transition-colors"
                      >
                        {preset.label}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Primary CTA Link */}
                <Link
                  href={`/tools/${calc.slug}`}
                  prefetch={false}
                  className="w-full inline-flex items-center justify-between pt-1 text-xs font-bold text-zinc-900 group-hover:text-blue-600 transition-colors"
                >
                  <span>Open Calculator</span>
                  <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-12 text-center max-w-lg mx-auto">
          <div className="flex size-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 mx-auto mb-3">
            <Search className="size-6" />
          </div>
          <h3 className="text-base font-bold text-zinc-950 mb-1">
            No calculators found
          </h3>
          <p className="text-xs text-zinc-500 mb-4">
            We couldn&apos;t find any calculator matching &quot;{searchQuery}&quot;. Try adjusting your search query or reset filters.
          </p>
          <button
            type="button"
            onClick={handleClearFilters}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            <span>Reset search & filters</span>
            <ArrowRight className="size-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
