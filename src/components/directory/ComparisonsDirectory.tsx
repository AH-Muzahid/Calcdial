"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { AdSlot } from "@/components/layout/AdSlot";

export interface ComparisonItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: "all" | "marketplaces" | "payments";
  categoryLabel: string;
  badge: string;
  href: string;
  icons: React.ReactNode;
}

export const COMPARISONS: ComparisonItem[] = [
  {
    id: "marketplace-3way",
    slug: "etsy-vs-shopify-vs-tiktok-shop-calculator",
    title: "Etsy vs. Shopify vs. TikTok Shop Comparison",
    subtitle: "Compare seller transaction cuts, offsite advertising fees, and net profit margins across top creator channels.",
    category: "marketplaces",
    categoryLabel: "Marketplaces",
    badge: "3-Way Channel Compare",
    href: "/tools/etsy-vs-shopify-vs-tiktok-shop-calculator",
    icons: (
      <div className="flex items-center -space-x-2 shrink-0">
        <div className="flex size-9 sm:size-10 items-center justify-center rounded-xl bg-[#F1641E] text-white shadow-2xs font-serif font-black text-base ring-2 ring-white select-none">
          E
        </div>
        <div className="flex size-9 sm:size-10 items-center justify-center rounded-xl bg-white border border-zinc-200/90 shadow-2xs p-1.5 ring-2 ring-white">
          <svg viewBox="0 0 109 123" fill="none" className="size-full">
            <path
              d="M74.7 15.6c-.3-1.4-1.2-6.5-4.8-9.4C66.1 3.2 61.2 3 59.4 3c-.7 0-1.2.1-1.3.1-.9.2-2.3.8-3.7 2-3.1 2.8-5.3 7.8-6.4 13.9l-19.4 6c-2.3.7-2.3.9-2.6 3.1L12.5 106.6l54.8 13.4 39.8-13.4-32.4-91z"
              fill="#95BF47"
            />
            <path
              d="M58.1 3.1c-.7 0-1.2.1-1.3.1-.9.2-2.3.8-3.7 2-3.1 2.8-5.3 7.8-6.4 13.9l-18 5.6 15 95.3 23.6-7.9 3.4-94.6c-.3-1.4-1.2-6.5-4.8-9.4-3.8-3-8.7-3.2-10.5-3.2z"
              fill="#5E8E3E"
            />
          </svg>
        </div>
        <div className="flex size-9 sm:size-10 items-center justify-center rounded-xl bg-black text-white shadow-2xs p-1.5 ring-2 ring-white">
          <svg viewBox="0 0 24 24" fill="none" className="size-full">
            <path
              d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.209 1.747 2.89 2.89 0 0 1 2.313-4.639c.314 0 .619.05.904.144V9.42a6.33 6.33 0 0 0-.904-.067 6.337 6.337 0 0 0-6.337 6.338 6.337 6.337 0 0 0 10.82 4.48 6.29 6.29 0 0 0 1.854-4.48V8.97a8.21 8.21 0 0 0 5.01 1.706V7.234a4.836 4.836 0 0 1-1.236-.548z"
              fill="#fff"
            />
          </svg>
        </div>
      </div>
    ),
  },
  {
    id: "stripe-vs-paypal",
    slug: "stripe-vs-paypal-fee-calculator",
    title: "Stripe vs. PayPal Fee & Gross-Up Calculator",
    subtitle: "Compare processor fees (2.9% vs. 3.49%) and calculate exact client invoice gross-up target amounts.",
    category: "payments",
    categoryLabel: "Payment Gateways",
    badge: "Gateway & Gross-Up",
    href: "/tools/stripe-vs-paypal-fee-calculator",
    icons: (
      <div className="flex items-center -space-x-2 shrink-0">
        <div className="flex size-9 sm:size-10 items-center justify-center rounded-xl bg-[#635BFF] text-white shadow-2xs font-bold text-base ring-2 ring-white select-none">
          S
        </div>
        <div className="flex size-9 sm:size-10 items-center justify-center rounded-xl bg-[#003087] text-white shadow-2xs font-bold text-base ring-2 ring-white select-none">
          P
        </div>
      </div>
    ),
  },
];

const CATEGORIES = [
  { id: "all", label: "All Comparisons" },
  { id: "marketplaces", label: "Marketplace Channels" },
  { id: "payments", label: "Payment Gateways & Invoicing" },
];

const SCENARIOS = [
  {
    category: "Marketplace Scenarios",
    items: [
      { label: "$25 Scenario (Crafts & Gifts)", href: "/tools/etsy-vs-shopify-vs-tiktok-shop-calculator" },
      { label: "$50 Scenario (Standard Apparel)", href: "/tools/etsy-vs-shopify-vs-tiktok-shop-calculator" },
      { label: "$100 Scenario (High-Ticket Goods)", href: "/tools/etsy-vs-shopify-vs-tiktok-shop-calculator" },
    ],
  },
  {
    category: "Payment Processing Scenarios",
    items: [
      { label: "Direct Payment Fee Comparison", href: "/tools/stripe-vs-paypal-fee-calculator" },
      { label: "Invoice Gross-Up Target (Cover Fees)", href: "/tools/stripe-vs-paypal-fee-calculator" },
      { label: "$5,000/mo Turnover Savings", href: "/tools/stripe-vs-paypal-fee-calculator" },
    ],
  },
];

export function ComparisonsDirectory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredComparisons = useMemo(() => {
    return COMPARISONS.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.categoryLabel.toLowerCase().includes(q);

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
            placeholder="Search comparisons by platform or feature..."
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
            Showing <strong className="text-zinc-900 font-semibold">{filteredComparisons.length}</strong> comparison engines
          </span>
        </div>
      </div>

      {/* Comparison Cards Grid */}
      {filteredComparisons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5 sm:gap-5">
          {filteredComparisons.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              prefetch={false}
              className={cn(
                "group relative isolate flex items-center justify-between overflow-hidden rounded-xl border border-zinc-200/80 bg-white p-5 sm:p-5.5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] select-none transform-gpu",
                "transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                "hover:-translate-y-1 hover:border-blue-400/50 hover:shadow-[0_14px_34px_-8px_rgba(43,92,253,0.14),0_2px_8px_rgba(0,0,0,0.03)]",
                "active:scale-[0.99] active:translate-y-0",
                "before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:bg-[linear-gradient(180deg,rgba(43,92,253,0.03),transparent_45%)] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300"
              )}
            >
              <div className="flex items-start gap-4 min-w-0 pr-3">
                {/* Platform Icons */}
                <div className="shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105">
                  {item.icons}
                </div>

                {/* Text Info */}
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-base sm:text-lg tracking-tight text-zinc-950 group-hover:text-[#2b5cfd] transition-colors duration-200 leading-snug">
                    {item.title}
                  </span>
                  <p className="text-xs text-zinc-500 font-normal leading-relaxed mt-1 line-clamp-2">
                    {item.subtitle}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="shrink-0 pl-1">
                <span className="flex size-8 items-center justify-center rounded-lg bg-zinc-100/80 group-hover:bg-[#2b5cfd] text-zinc-400 group-hover:text-white transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:shadow-[0_2px_8px_rgba(43,92,253,0.35)]">
                  <ArrowRight className="size-4 stroke-[2.2]" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center max-w-md mx-auto my-8">
          <div className="flex size-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 mx-auto mb-2.5">
            <Search className="size-5" />
          </div>
          <h3 className="text-sm font-bold text-zinc-950 mb-1">
            No comparisons found
          </h3>
          <p className="text-xs text-zinc-500 mb-3.5">
            No comparison engines matched &quot;{searchQuery}&quot;. Try adjusting your search query.
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

      {/* Popular Comparison Scenarios */}
      <section className="rounded-xl border border-zinc-200/80 bg-white p-4.5 sm:p-6 shadow-xs">
        <div className="pb-3.5 mb-4 border-b border-zinc-100">
          <h2 className="text-sm sm:text-base font-bold text-zinc-950 tracking-tight">
            Pre-Configured Comparison Scenarios
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Instant benchmarks for common selling scenarios, low vs. high order ticket values, and volume thresholds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5">
          {SCENARIOS.map((group) => (
            <div key={group.category} className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block font-mono">
                {group.category}
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
