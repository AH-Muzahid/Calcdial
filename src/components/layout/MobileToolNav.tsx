"use client";

import Link from "next/link";
import { TOOLS } from "@/data/tools-registry";
import { cn } from "@/lib/utils";

interface MobileToolNavProps {
  currentSlug: string;
}

export const MOBILE_TOOL_CATEGORIES = [
  {
    title: "Marketplace & Seller Fees",
    tools: [
      { slug: "etsy-fee-calculator", name: "Etsy Fee Calculator", shortName: "Etsy Fees" },
      { slug: "tiktok-shop-fee-calculator", name: "TikTok Shop Fees", shortName: "TikTok Shop" },
      { slug: "pod-profit-calculator", name: "Print-on-Demand Profit", shortName: "POD Profit" },
    ],
  },
  {
    title: "Profit & Comparisons",
    tools: [
      { slug: "shopify-profit-calculator", name: "Shopify Break-Even ROAS", shortName: "Shopify ROAS" },
      { slug: "etsy-vs-shopify-vs-tiktok-shop-calculator", name: "3-Way Platform Compare", shortName: "3-Way Compare" },
      { slug: "stripe-vs-paypal-fee-calculator", name: "Stripe vs PayPal Fees", shortName: "Stripe vs PayPal" },
    ],
  },
];

const ALL_MOBILE_TOOLS = MOBILE_TOOL_CATEGORIES.flatMap((c) => c.tools);

/**
 * Sleek horizontal scrollable pill strip for mobile screens (lg:hidden).
 * Sits right under the page title so mobile users can jump between calculators in 1 tap.
 */
export function MobileToolPills({ currentSlug }: MobileToolNavProps) {
  const baseSlug =
    TOOLS.find((t) => currentSlug === t.slug || currentSlug.startsWith(`${t.slug}-`))?.slug ||
    currentSlug;

  return (
    <nav
      aria-label="Mobile quick calculator switcher"
      className="lg:hidden my-3 -mx-4 px-4 overflow-x-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden print:hidden"
    >
      <div className="flex items-center gap-1.5 w-max py-0.5">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-600 mr-1 select-none">
          Tools:
        </span>
        {ALL_MOBILE_TOOLS.map((t) => {
          const isActive = t.slug === baseSlug;
          return (
            <Link
              key={t.slug}
              href={`/tools/${t.slug}`}
              prefetch={false}
              className={cn(
                "inline-flex items-center gap-1.5 px-3.5 py-2 min-h-11 rounded-full text-xs font-semibold whitespace-nowrap transition-all select-none",
                isActive
                  ? "bg-zinc-900 text-white shadow-xs font-bold ring-1 ring-zinc-900"
                  : "bg-white text-zinc-700 hover:text-zinc-950 border border-zinc-200/90 hover:bg-zinc-50"
              )}
            >
              {isActive && <span className="size-1.5 rounded-full bg-emerald-400 shrink-0" />}
              <span>{t.shortName}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

/**
 * Categorized seller calculator directory card for mobile (lg:hidden).
 * Appears below the interactive calculator so mobile users can explore all categories.
 */
export function MobileToolDirectory({ currentSlug }: MobileToolNavProps) {
  const baseSlug =
    TOOLS.find((t) => currentSlug === t.slug || currentSlug.startsWith(`${t.slug}-`))?.slug ||
    currentSlug;

  return (
    <section
      aria-label="Related seller calculators"
      className="lg:hidden my-5 rounded-2xl border border-zinc-200/90 bg-white p-4 shadow-2xs print:hidden"
    >
      <div className="pb-2.5 mb-3 border-b border-zinc-150 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-zinc-950 tracking-tight">
            Seller Calculator Suite
          </h3>
          <p className="text-[11px] text-zinc-600 mt-0.5">
            Switch to another ecommerce or marketplace fee calculator
          </p>
        </div>
        <Link
          href="/#tools"
          prefetch={false}
          className="text-xs font-bold text-zinc-700 hover:text-zinc-950 transition-colors shrink-0 ml-2 py-2 px-1"
        >
          All &rarr;
        </Link>
      </div>

      <div className="space-y-4">
        {MOBILE_TOOL_CATEGORIES.map((cat) => (
          <div key={cat.title}>
            <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-600 font-bold mb-1.5 px-1">
              {cat.title}
            </div>
            <ul className="grid grid-cols-1 gap-1">
              {cat.tools.map((t) => {
                const isActive = t.slug === baseSlug;
                return (
                  <li key={t.slug}>
                    <Link
                      href={`/tools/${t.slug}`}
                      prefetch={false}
                      className={cn(
                        "flex items-center justify-between px-3 py-2.5 min-h-11 rounded-lg text-xs transition-all",
                        isActive
                          ? "bg-zinc-100 text-zinc-950 font-bold border border-zinc-200/90 shadow-2xs"
                          : "text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50 font-medium"
                      )}
                    >
                      <span className="truncate">{t.name}</span>
                      {isActive ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-700 shrink-0 ml-2">
                          <span className="size-1.5 rounded-full bg-emerald-600" />
                          <span className="font-semibold">Current</span>
                        </span>
                      ) : (
                        <span className="text-zinc-500 text-[11px] font-mono">&rarr;</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
