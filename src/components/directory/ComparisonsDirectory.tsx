"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  X,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ComparisonItem {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  category: "marketplaces" | "payments";
  categoryLabel: string;
  platforms: string[];
  keyHighlight: string;
  features: string[];
  scenarios: { label: string; href: string }[];
}

export const ALL_COMPARISONS: ComparisonItem[] = [
  {
    id: "marketplace-3way",
    slug: "etsy-vs-shopify-vs-tiktok-shop-calculator",
    title: "3-Way Marketplace Profit Comparison (Etsy vs. Shopify vs. TikTok)",
    shortDescription:
      "A comprehensive head-to-head comparison model. Simulate identical selling prices and product costs across Etsy, Shopify, and TikTok Shop to discover who leaves higher profit in your bank account.",
    category: "marketplaces",
    categoryLabel: "Marketplaces & Social Channels",
    platforms: ["Etsy", "Shopify", "TikTok Shop"],
    keyHighlight: "Calculates Highest Margin Winner Automatically",
    features: [
      "Dynamic stacked fee breakdown (platform commissions, payment cuts, ads)",
      "Real-time Winner Badge indicating highest net take-home margin",
      "Advanced settings for Etsy Offsite Ads and TikTok creator cuts",
      "Breakdown comparison table with margin percentages",
    ],
    scenarios: [
      { label: "$25 Scenario (Crafts & Gifts)", href: "/tools/etsy-vs-shopify-vs-tiktok-shop-calculator" },
      { label: "$50 Scenario (Standard Apparel)", href: "/tools/etsy-vs-shopify-vs-tiktok-shop-calculator" },
      { label: "$100 Scenario (High-Ticket Goods)", href: "/tools/etsy-vs-shopify-vs-tiktok-shop-calculator" },
    ],
  },
  {
    id: "stripe-vs-paypal",
    slug: "stripe-vs-paypal-fee-calculator",
    title: "Stripe vs. PayPal Fee Comparison & Client Gross-Up Calculator",
    shortDescription:
      "Compare merchant credit card fees between Stripe (2.9% + $0.30) and PayPal (3.49% + $0.49). Includes the exact algebraic gross-up formula to quote client invoices so you keep 100% of your earnings.",
    category: "payments",
    categoryLabel: "Payment Processors & Invoicing",
    platforms: ["Stripe", "PayPal"],
    keyHighlight: "Annual Volume Savings: +$468/yr at $5k/mo",
    features: [
      "Dual mode: Direct Payment Fee comparison vs. Invoice Gross-Up target",
      "Itemized rate components and effective percentage calculations",
      "Annual Volume Advantage projection based on your monthly turnover",
      "Instant copy breakdown summary for client proposals and receipts",
    ],
    scenarios: [
      { label: "Direct Payment Fee Comparison", href: "/tools/stripe-vs-paypal-fee-calculator" },
      { label: "Invoice Gross-Up (Cover Fees)", href: "/tools/stripe-vs-paypal-fee-calculator" },
      { label: "$5,000/mo Volume Projection", href: "/tools/stripe-vs-paypal-fee-calculator" },
    ],
  },
];

const COMPARISON_CATEGORIES = [
  { id: "all", label: "All Comparisons" },
  { id: "marketplaces", label: "Marketplace Channels" },
  { id: "payments", label: "Payment Gateways & Invoicing" },
];

export function ComparisonsDirectory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredComparisons = useMemo(() => {
    return ALL_COMPARISONS.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.shortDescription.toLowerCase().includes(q) ||
        item.platforms.some((p) => p.toLowerCase().includes(q)) ||
        item.features.some((f) => f.toLowerCase().includes(q)) ||
        item.scenarios.some((s) => s.label.toLowerCase().includes(q));

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
            placeholder="Search comparisons (e.g., Stripe, Shopify, Etsy, Gross-Up, Margins)..."
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
            {COMPARISON_CATEGORIES.map((cat) => {
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
            Showing <strong className="text-zinc-900 font-semibold">{filteredComparisons.length}</strong> comparison tools
          </span>
        </div>
      </div>

      {/* Comparisons Cards Grid (Large Feature Layout) */}
      {filteredComparisons.length > 0 ? (
        <div className="space-y-6">
          {filteredComparisons.map((item) => (
            <div
              key={item.id}
              className="group rounded-2xl border border-zinc-200/90 bg-white p-6 sm:p-8 shadow-xs hover:border-blue-400/60 hover:shadow-[0_16px_40px_-12px_rgba(43,92,253,0.14),0_2px_8px_rgba(0,0,0,0.03)] transition-all duration-300"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left 8 Cols: Overview, Platforms, Features */}
                <div className="lg:col-span-8 space-y-4">
                  {/* Category & Platform Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/60">
                      {item.categoryLabel}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {item.platforms.map((p) => (
                        <span
                          key={p}
                          className="rounded-full bg-zinc-100 border border-zinc-200/80 px-2.5 py-0.5 text-[11px] font-semibold text-zinc-700"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 group-hover:text-blue-600 transition-colors tracking-tight">
                      <Link href={`/tools/${item.slug}`} prefetch={false}>
                        {item.title}
                      </Link>
                    </h2>
                    <p className="mt-2 text-sm text-zinc-600 leading-relaxed font-normal">
                      {item.shortDescription}
                    </p>
                  </div>

                  {/* Feature Checklist */}
                  <div className="pt-2">
                    <span className="text-xs font-bold text-zinc-900 block mb-2">
                      Comparison Capabilities:
                    </span>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-600">
                      {item.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="flex size-4.5 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold shrink-0 mt-0.5">
                            ✓
                          </span>
                          <span className="leading-snug">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Right 4 Cols: Highlight Metric & Quick Actions */}
                <div className="lg:col-span-4 flex flex-col justify-between h-full bg-zinc-50/70 border border-zinc-200/80 rounded-xl p-5 space-y-4">
                  {/* Highlight Callout */}
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold block mb-1">
                      Key Advantage
                    </span>
                    <div className="text-sm font-bold text-zinc-950 flex items-center gap-2">
                      <Sparkles className="size-4 text-amber-500 shrink-0" />
                      <span>{item.keyHighlight}</span>
                    </div>
                  </div>

                  {/* Quick Scenarios */}
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold block mb-1.5">
                      Direct Scenarios
                    </span>
                    <div className="flex flex-col gap-1.5">
                      {item.scenarios.map((scen) => (
                        <Link
                          key={scen.label}
                          href={scen.href}
                          prefetch={false}
                          className="text-xs font-semibold text-zinc-700 hover:text-blue-600 bg-white hover:bg-blue-50/50 border border-zinc-200/80 rounded-lg px-3 py-1.5 transition-colors flex items-center justify-between"
                        >
                          <span>{scen.label}</span>
                          <ArrowRight className="size-3 text-zinc-400" />
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Open Main Tool Button */}
                  <div className="pt-1">
                    <Link
                      href={`/tools/${item.slug}`}
                      prefetch={false}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-950 hover:bg-blue-600 text-white px-4 py-2.5 text-xs sm:text-sm font-bold shadow-xs transition-colors"
                    >
                      <span>Launch Full Comparison</span>
                      <ArrowRight className="size-4" />
                    </Link>
                  </div>
                </div>
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
            No comparisons found
          </h3>
          <p className="text-xs text-zinc-500 mb-4">
            We couldn&apos;t find any comparison tool matching &quot;{searchQuery}&quot;. Try adjusting your search query or reset filters.
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
