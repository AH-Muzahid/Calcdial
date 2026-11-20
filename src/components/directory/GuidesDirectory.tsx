"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  X,
  ArrowRight,
  BookOpen,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface GuideItem {
  slug: string;
  title: string;
  subtitle: string;
  readTime: string;
  category: "marketplaces" | "comparisons" | "pricing" | "payments";
  categoryLabel: string;
  publishedDate: string;
  primaryTool: {
    name: string;
    href: string;
  };
  topicsCovered: string[];
}

export const ALL_GUIDES: GuideItem[] = [
  {
    slug: "how-to-calculate-etsy-fees-2026",
    title: "How to Calculate Etsy Fees in 2026 (Complete Seller Breakdown)",
    subtitle:
      "A step-by-step master guide to understanding listing fees, the 6.5% transaction commission on shipping, localized payment processing rates, regulatory operating surcharges, and mandatory Offsite Ads tiers.",
    readTime: "8 min read",
    category: "marketplaces",
    categoryLabel: "Marketplace Fees",
    publishedDate: "Nov 2026 Updated",
    primaryTool: {
      name: "Etsy Fee Calculator",
      href: "/tools/etsy-fee-calculator",
    },
    topicsCovered: [
      "The $0.20 listing fee and auto-renewal rules on multi-quantity orders",
      "Why Etsy calculates its 6.5% cut on buyer shipping charges",
      "Country-specific Etsy Payments schedules (US, UK, CA, AU, EU)",
      "12% vs. 15% Offsite Ads threshold and lifetime opt-out rules",
    ],
  },
  {
    slug: "etsy-vs-shopify-vs-tiktok-shop-comparison",
    title: "Etsy vs. Shopify vs. TikTok Shop: Which Platform Leaves Higher Margins?",
    subtitle:
      "A head-to-head profit margin analysis across the three dominant e-commerce channels in 2026. Discover real net payouts factoring in hidden merchant costs, ad spends, and buyer traffic.",
    readTime: "10 min read",
    category: "comparisons",
    categoryLabel: "Channel Comparisons",
    publishedDate: "Nov 2026 Updated",
    primaryTool: {
      name: "3-Way Marketplace Calculator",
      href: "/tools/etsy-vs-shopify-vs-tiktok-shop-calculator",
    },
    topicsCovered: [
      "Unit economic modeling on $25, $50, and $100 orders",
      "Organic marketplace discovery vs. 100% margin retention on Shopify",
      "TikTok Shop 6% referral commission and creator affiliate math",
      "The 2-phase migration playbook to retain repeat customers",
    ],
  },
  {
    slug: "pod-pricing-strategy-offsite-ads",
    title: "Print-on-Demand Pricing Strategy: Avoiding Hidden Offsite Ads Losses",
    subtitle:
      "How to price POD apparel, drinkware, and canvas art to protect healthy 30%+ profit margins against base printing spikes, fulfillment shipping, and marketplace ad deductions.",
    readTime: "7 min read",
    category: "pricing",
    categoryLabel: "Pricing & Margins",
    publishedDate: "Nov 2026 Updated",
    primaryTool: {
      name: "POD Profit Calculator",
      href: "/tools/pod-profit-calculator",
    },
    topicsCovered: [
      "Base printing and fulfillment breakdown for Bella+Canvas 3001 & Gildan",
      "The 40% Minimum Gross Margin pricing formula",
      "Calculating the impact of mandatory 12-15% Offsite Ads deductions",
      "High-perceived-value product categories for maximum margin defense",
    ],
  },
  {
    slug: "pass-payment-processing-fees-to-clients",
    title: "How to Pass Payment Processing Fees to Clients Without Losing Deals",
    subtitle:
      "The mathematical gross-up formula explained: how freelancers, consultants, and agencies can quote invoice amounts so Stripe and PayPal merchant deductions equal zero out-of-pocket loss.",
    readTime: "6 min read",
    category: "payments",
    categoryLabel: "Payment Processing",
    publishedDate: "Nov 2026 Updated",
    primaryTool: {
      name: "Stripe vs. PayPal Calculator",
      href: "/tools/stripe-vs-paypal-fee-calculator",
    },
    topicsCovered: [
      "The common percentage addition mistake that leaves freelancers short",
      "The reverse algebraic gross-up formula for Stripe (2.9%) & PayPal (3.49%)",
      "Professional invoice wording and proposal clauses",
      "Legal surcharging compliance and disclosure standards",
    ],
  },
];

const GUIDE_CATEGORIES = [
  { id: "all", label: "All Guides" },
  { id: "marketplaces", label: "Marketplace Fees" },
  { id: "comparisons", label: "Platform Comparisons" },
  { id: "pricing", label: "Pricing & Margins" },
  { id: "payments", label: "Payment Processing" },
];

export function GuidesDirectory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredGuides = useMemo(() => {
    return ALL_GUIDES.filter((guide) => {
      const matchesCategory =
        selectedCategory === "all" || guide.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        guide.title.toLowerCase().includes(q) ||
        guide.subtitle.toLowerCase().includes(q) ||
        guide.categoryLabel.toLowerCase().includes(q) ||
        guide.topicsCovered.some((t) => t.toLowerCase().includes(q));

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
            placeholder="Search guides by topic, platform, formula, or fee rules..."
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
            {GUIDE_CATEGORIES.map((cat) => {
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
            Showing <strong className="text-zinc-900 font-semibold">{filteredGuides.length}</strong> of {ALL_GUIDES.length} guides
          </span>
        </div>
      </div>

      {/* Guides Grid */}
      {filteredGuides.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredGuides.map((guide) => (
            <article
              key={guide.slug}
              className="group flex flex-col justify-between rounded-2xl border border-zinc-200/90 bg-white p-6 sm:p-7 shadow-xs hover:border-blue-400/60 hover:shadow-[0_14px_34px_-8px_rgba(43,92,253,0.12),0_2px_8px_rgba(0,0,0,0.03)] transition-all duration-200"
            >
              {/* Header Info */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider">
                    {guide.categoryLabel}
                  </span>
                  <div className="flex items-center gap-3 text-xs text-zinc-400 font-medium">
                    <span className="inline-flex items-center gap-1 text-zinc-500">
                      <Clock className="size-3.5" />
                      {guide.readTime}
                    </span>
                    <span>•</span>
                    <span className="text-zinc-500 font-sans">{guide.publishedDate}</span>
                  </div>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-zinc-950 group-hover:text-blue-600 transition-colors tracking-tight leading-snug mb-2.5">
                  <Link href={`/guides/${guide.slug}`} prefetch={false}>
                    {guide.title}
                  </Link>
                </h2>

                <p className="text-xs sm:text-[13px] text-zinc-600 leading-relaxed font-normal mb-4">
                  {guide.subtitle}
                </p>

                {/* Topics Covered Box */}
                <div className="rounded-xl bg-zinc-50/80 border border-zinc-200/70 p-3.5 mb-4">
                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-zinc-500 block mb-2">
                    Key Topics in this Guide:
                  </span>
                  <ul className="space-y-1.5 text-xs text-zinc-700">
                    {guide.topicsCovered.map((topic, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold shrink-0 leading-none mt-0.5">›</span>
                        <span className="leading-snug">{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-zinc-100 flex items-center justify-between gap-2">
                <Link
                  href={guide.primaryTool.href}
                  prefetch={false}
                  className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
                >
                  Tool: <span className="underline underline-offset-2 text-zinc-700">{guide.primaryTool.name}</span>
                </Link>

                <Link
                  href={`/guides/${guide.slug}`}
                  prefetch={false}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 group-hover:text-blue-700 transition-colors"
                >
                  <span>Read Guide</span>
                  <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-12 text-center max-w-lg mx-auto">
          <div className="flex size-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 mx-auto mb-3">
            <BookOpen className="size-6" />
          </div>
          <h3 className="text-base font-bold text-zinc-950 mb-1">
            No guides found
          </h3>
          <p className="text-xs text-zinc-500 mb-4">
            We couldn&apos;t find any guide matching &quot;{searchQuery}&quot;. Try adjusting your search query or reset filters.
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
