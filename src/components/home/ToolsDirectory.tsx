"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ToolConfig } from "@/data/tools-registry";
import { ToolIcon } from "@/components/common/ToolIcons";
import { formatDate } from "@/lib/utils";

interface ToolsDirectoryProps {
  tools: ToolConfig[];
}

export function ToolsDirectory({ tools }: ToolsDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", label: "All Tools", count: tools.length },
    { id: "marketplace", label: "Marketplaces", count: 4 },
    { id: "margins", label: "Margins & ROAS", count: 2 },
    { id: "payments", label: "Payment Processors", count: 1 },
    { id: "comparison", label: "Comparisons", count: 2 },
  ];

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      // Category filter
      let matchesCategory = true;
      if (activeCategory === "marketplace") {
        matchesCategory = ["etsy-fee-calculator", "shopify-profit-calculator", "tiktok-shop-fee-calculator", "etsy-vs-shopify-vs-tiktok-shop-calculator"].includes(tool.slug);
      } else if (activeCategory === "margins") {
        matchesCategory = ["shopify-profit-calculator", "pod-profit-calculator"].includes(tool.slug);
      } else if (activeCategory === "payments") {
        matchesCategory = ["stripe-vs-paypal-fee-calculator"].includes(tool.slug);
      } else if (activeCategory === "comparison") {
        matchesCategory = tool.isComparison || tool.slug.includes("comparison") || tool.slug.includes("vs");
      }

      // Search query filter
      let matchesSearch = true;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        matchesSearch =
          tool.title.toLowerCase().includes(query) ||
          tool.shortDescription.toLowerCase().includes(query) ||
          tool.targetKeywords.some((k) => k.toLowerCase().includes(query)) ||
          tool.slug.toLowerCase().includes(query);
      }

      return matchesCategory && matchesSearch;
    });
  }, [tools, activeCategory, searchQuery]);

  return (
    <section id="tools" className="scroll-mt-20 my-10">
      {/* Search and Category Filter Toolbar */}
      <div className="rounded-2xl border border-zinc-200/90 bg-white p-4 sm:p-5 shadow-xs mb-8">
        <div className="relative flex items-center">
          <svg
            className="absolute left-4 size-5 text-zinc-400 pointer-events-none"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search calculators (e.g. Etsy 6.5%, TikTok, POD markup, gross-up formula)..."
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50/60 py-3 pl-11 pr-10 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-950 transition-all font-sans"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 p-1 rounded-md text-zinc-400 hover:text-zinc-950 transition-colors"
              aria-label="Clear search"
            >
              <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5 sm:gap-2 pt-3 border-t border-zinc-100">
          <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mr-1 hidden sm:inline-block">
            Filter:
          </span>
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all ${
                  isActive
                    ? "bg-zinc-950 text-white shadow-2xs font-semibold"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-950"
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] font-mono px-1 rounded-full ${
                    isActive ? "bg-zinc-800 text-zinc-300" : "bg-zinc-200/70 text-zinc-500"
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="size-1.5 rounded-full bg-zinc-950" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
              Tool Directory
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
            {activeCategory === "all" ? "All Platform Calculators" : `${categories.find(c => c.id === activeCategory)?.label} Calculators`}
          </h2>
        </div>
        <div className="text-xs font-mono text-zinc-500">
          Showing <span className="font-bold text-zinc-950">{filteredTools.length}</span> of {tools.length} calculators
        </div>
      </div>

      {/* Tools Cards Grid (Toolhub Framer Style) */}
      {filteredTools.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-12 text-center">
          <p className="text-sm font-medium text-zinc-900">No calculators match your search.</p>
          <p className="mt-1 text-xs text-zinc-500">Try searching for keywords like &quot;Etsy&quot;, &quot;Shopify&quot;, &quot;PayPal&quot;, or &quot;POD&quot;.</p>
          <button
            type="button"
            onClick={() => { setSearchQuery(""); setActiveCategory("all"); }}
            className="mt-4 inline-flex items-center rounded-full bg-zinc-950 px-4 py-1.5 text-xs font-medium text-white hover:bg-zinc-800 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredTools.map((tool) => {
            const isFeatured = tool.slug === "etsy-fee-calculator" || tool.slug === "tiktok-shop-fee-calculator";
            const badgeText = isFeatured
              ? "Featured"
              : tool.isComparison
              ? "Comparison"
              : "2026 Rates";
            const badgeColor = isFeatured
              ? "bg-amber-50 text-amber-800 border-amber-200"
              : tool.isComparison
              ? "bg-purple-50 text-purple-800 border-purple-200"
              : "bg-emerald-50 text-emerald-800 border-emerald-200";

            return (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="group relative flex flex-col justify-between rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-xs transition-all hover:border-zinc-400 hover:shadow-md"
              >
                <div>
                  {/* Top Bar: Icon + Status Badge */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <ToolIcon slug={tool.slug} size="md" />
                    <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-mono font-semibold tracking-wide uppercase ${badgeColor}`}>
                      {badgeText}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base font-bold text-zinc-950 group-hover:text-zinc-700 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-zinc-500 leading-relaxed line-clamp-2">
                    {tool.shortDescription}
                  </p>
                </div>

                {/* Card Footer: Metadata + CTA */}
                <div className="mt-6 pt-3.5 border-t border-zinc-100 flex items-center justify-between text-xs">
                  <span className="font-mono text-[11px] text-zinc-400">
                    Updated {formatDate(tool.lastUpdated)}
                  </span>
                  <span className="inline-flex items-center gap-1 font-mono font-semibold text-zinc-950 group-hover:translate-x-1 transition-transform">
                    <span>Calculate</span>
                    <span>→</span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
