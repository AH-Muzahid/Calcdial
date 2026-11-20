"use client";

import { useState } from "react";
import Link from "next/link";
import { TOOLS } from "@/data/tools-registry";
import { AdSlot } from "@/components/layout/AdSlot";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface DesktopToolSidebarProps {
  currentSlug: string;
}

interface ToolCategory {
  title: string;
  tools: {
    slug: string;
    name: string;
  }[];
}

const TOOL_CATEGORIES: ToolCategory[] = [
  {
    title: "Marketplace & Seller Fees",
    tools: [
      { slug: "etsy-fee-calculator", name: "Etsy Fee Calculator" },
      { slug: "tiktok-shop-fee-calculator", name: "TikTok Shop Fees" },
      { slug: "pod-profit-calculator", name: "Print-on-Demand Profit" },
    ],
  },
  {
    title: "Profit & Comparisons",
    tools: [
      { slug: "shopify-profit-calculator", name: "Shopify Break-Even ROAS" },
      { slug: "etsy-vs-shopify-vs-tiktok-shop-calculator", name: "3-Way Platform Compare" },
      { slug: "stripe-vs-paypal-fee-calculator", name: "Stripe vs PayPal Fees" },
    ],
  },
];

export function DesktopToolSidebar({ currentSlug }: DesktopToolSidebarProps) {
  const [filterQuery, setFilterQuery] = useState("");

  const baseSlug =
    TOOLS.find((t) => currentSlug === t.slug || currentSlug.startsWith(`${t.slug}-`))?.slug ||
    currentSlug;

  const filteredCategories = TOOL_CATEGORIES.map((cat) => ({
    ...cat,
    tools: cat.tools.filter((t) =>
      t.name.toLowerCase().includes(filterQuery.toLowerCase())
    ),
  })).filter((cat) => cat.tools.length > 0);

  return (
    <aside className="hidden lg:block w-[270px] xl:w-[300px] shrink-0 self-start sticky top-24 space-y-4 print:hidden">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          placeholder="Search all calculators..."
          className="w-full h-8.5 rounded-lg border border-zinc-300 bg-white pl-8 pr-3 text-xs font-semibold text-zinc-950 placeholder:text-zinc-500 focus:outline-hidden focus:border-zinc-950 font-sans shadow-2xs"
        />
        <Search className="absolute left-2.5 top-2.5 size-3.5 text-zinc-500 pointer-events-none" />
      </div>

      {/* Directory Block */}
      <div className="rounded-xl border border-zinc-200 bg-white p-3.5 shadow-2xs">
        <div className="pb-2 mb-2.5 border-b border-zinc-200 flex items-center justify-between">
          <h4 className="text-xs font-bold text-zinc-950 tracking-tight">
            Seller Calculators
          </h4>
          <Link
            href="/calculators"
            prefetch={false}
            className="text-[11px] font-bold text-zinc-700 hover:text-blue-600 transition-colors"
          >
            All &rarr;
          </Link>
        </div>

        <div className="space-y-3">
          {filteredCategories.map((cat) => (
            <div key={cat.title}>
              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-600 font-bold mb-1 px-1">
                {cat.title}
              </div>
              <ul className="space-y-0.5">
                {cat.tools.map((t) => {
                  const isActive = t.slug === baseSlug;
                  return (
                    <li key={t.slug}>
                      <Link
                        href={`/tools/${t.slug}`}
                        prefetch={false}
                        className={cn(
                          "flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all",
                          isActive
                            ? "bg-zinc-100/90 text-zinc-950 font-bold border border-zinc-200/80 shadow-2xs"
                            : "text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50 font-medium"
                        )}
                      >
                        <span className="truncate">{t.name}</span>
                        {isActive && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-700 shrink-0 ml-1.5">
                            <span className="size-1.5 rounded-full bg-emerald-600" />
                            <span className="font-semibold">Current</span>
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          {filteredCategories.length === 0 && (
            <div className="py-2 text-center text-xs text-zinc-600 font-semibold font-mono">
              No matching tools
            </div>
          )}
        </div>
      </div>

      {/* Sticky Sidebar Ad Slot (300x250) */}
      <AdSlot position="sidebar" className="my-0 w-full max-w-none" />
    </aside>
  );
}
