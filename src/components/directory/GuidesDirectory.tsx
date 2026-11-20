"use client";

import React, { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { GuideCard } from "@/components/home/GuideCard";
import { AdSlot } from "@/components/layout/AdSlot";

export interface GuideDirectoryItem {
  slug: string;
  title: string;
  readTime: string;
  category: "all" | "marketplaces" | "comparisons" | "pricing" | "payments";
  categoryLabel: string;
  type: "etsy" | "shopify" | "margin" | "tax";
}

export const GUIDES_LIST: GuideDirectoryItem[] = [
  {
    slug: "how-to-calculate-etsy-fees-2026",
    title: "How to Calculate Etsy Fees in 2026 (Complete Seller Breakdown)",
    readTime: "8 min read",
    category: "marketplaces",
    categoryLabel: "Marketplaces",
    type: "etsy",
  },
  {
    slug: "etsy-vs-shopify-vs-tiktok-shop-comparison",
    title: "Etsy vs. Shopify vs. TikTok Shop: Which Platform Leaves Higher Margins?",
    readTime: "10 min read",
    category: "comparisons",
    categoryLabel: "Comparisons",
    type: "shopify",
  },
  {
    slug: "pod-pricing-strategy-offsite-ads",
    title: "Print-on-Demand Pricing Strategy: Avoiding Hidden Offsite Ads Losses",
    readTime: "7 min read",
    category: "pricing",
    categoryLabel: "Pricing & Margins",
    type: "margin",
  },
  {
    slug: "pass-payment-processing-fees-to-clients",
    title: "How to Pass Payment Processing Fees to Clients Without Losing Deals",
    readTime: "6 min read",
    category: "payments",
    categoryLabel: "Payments & Invoicing",
    type: "tax",
  },
];

const CATEGORIES = [
  { id: "all", label: "All Guides" },
  { id: "marketplaces", label: "Marketplace Fees" },
  { id: "comparisons", label: "Channel Comparisons" },
  { id: "pricing", label: "Pricing & Margins" },
  { id: "payments", label: "Payments & Invoicing" },
];

export function GuidesDirectory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredGuides = useMemo(() => {
    return GUIDES_LIST.filter((guide) => {
      const matchesCategory =
        selectedCategory === "all" || guide.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        guide.title.toLowerCase().includes(q) ||
        guide.categoryLabel.toLowerCase().includes(q);

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
            placeholder="Search guides by title, platform, or topic..."
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
                    "px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer select-none",
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
            Showing <strong className="text-zinc-900 font-semibold">{filteredGuides.length}</strong> guides
          </span>
        </div>
      </div>

      {/* Clean Guides Cards Grid using High-Craft GuideCard */}
      {filteredGuides.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5 sm:gap-5">
          {filteredGuides.map((guide) => (
            <GuideCard
              key={guide.slug}
              slug={guide.slug}
              title={guide.title}
              readTime={guide.readTime}
              type={guide.type}
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
            No guides found
          </h3>
          <p className="text-xs text-zinc-500 mb-3.5">
            No seller guides matched &quot;{searchQuery}&quot;. Try adjusting your search query.
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
    </div>
  );
}
