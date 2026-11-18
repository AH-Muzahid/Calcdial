"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Calculator, Layers, Shirt, ArrowLeftRight, ArrowRight } from "lucide-react";
import { ToolConfig } from "@/data/tools-registry";
import { CalculatorCard } from "./CalculatorCard";
import { GuideCard } from "./GuideCard";

interface ToolsDirectoryProps {
  tools: ToolConfig[];
}

export function ToolsDirectory({ tools }: ToolsDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", label: "All Tools" },
    { id: "ecommerce", label: "E-Commerce & Seller" },
    { id: "freelance", label: "Freelance & Tax" },
    { id: "saas", label: "SaaS & AI" },
  ];

  const popularCalculators = [
    {
      id: "etsy",
      title: "Etsy Fee Calculator",
      subtitle: "Calculate Etsy fees, Offsite Ads and your net profit.",
      category: "ecommerce",
      href: "/tools/etsy-fee-calculator",
      icon: (
        <div className="flex size-9 sm:size-10 items-center justify-center rounded-xl bg-[#F1641E] text-white shrink-0 shadow-2xs font-serif font-black text-lg sm:text-xl select-none">
          E
        </div>
      ),
    },
    {
      id: "shopify",
      title: "Shopify Fee Calculator",
      subtitle: "Calculate Shopify fees, payment processing and profit.",
      category: "ecommerce",
      href: "/tools/shopify-profit-calculator",
      icon: (
        <div className="flex size-9 sm:size-10 items-center justify-center rounded-xl bg-white border border-zinc-150 shadow-2xs shrink-0 p-1.5 sm:p-2">
          <svg viewBox="0 0 109 123" fill="none" className="size-full">
            <path d="M74.7 15.6c-.3-1.4-1.2-6.5-4.8-9.4C66.1 3.2 61.2 3 59.4 3c-.7 0-1.2.1-1.3.1-.9.2-2.3.8-3.7 2-3.1 2.8-5.3 7.8-6.4 13.9l-19.4 6c-2.3.7-2.3.9-2.6 3.1L12.5 106.6l54.8 13.4 39.8-13.4-32.4-91z" fill="#95BF47" />
            <path d="M58.1 3.1c-.7 0-1.2.1-1.3.1-.9.2-2.3.8-3.7 2-3.1 2.8-5.3 7.8-6.4 13.9l-18 5.6 15 95.3 23.6-7.9 3.4-94.6c-.3-1.4-1.2-6.5-4.8-9.4-3.8-3-8.7-3.2-10.5-3.2z" fill="#5E8E3E" />
            <path d="M52.3 35.8c-1.3-.8-2.9-.6-3.8.3-.9 1-1.2 2.6-.4 3.9l9.3 14.5c.8 1.3 2.5 1.7 3.8.9 1.3-.8 1.7-2.5.9-3.8l-9.8-15.8z" fill="#fff" />
            <path d="M68.5 48.7c-4.9-1.2-10.1-.5-14.5 1.9-4.8 2.6-7.8 7.3-8.2 12.8-.5 7.1 4.5 13.4 11.4 14.5 5.6.9 11.2.8 16.8 0 .8-.1 1.4-.8 1.3-1.6-.1-.8-.8-1.4-1.6-1.3-5.2.7-10.4.8-15.6 0-5.3-.8-9.2-5.7-8.8-11.2.3-4.3 2.7-8 6.5-10 3.5-1.9 7.6-2.5 11.6-1.5 2.8.7 5.5 2.1 7.8 4.1.6.5 1.5.5 2.1-.1.6-.6.5-1.5-.1-2.1-2.8-2.4-6.1-4.2-9.6-5.1z" fill="#fff" />
          </svg>
        </div>
      ),
    },
    {
      id: "tiktok",
      title: "TikTok Shop Calculator",
      subtitle: "Estimate fees, take-home profit and break-even price.",
      category: "ecommerce",
      href: "/tools/tiktok-shop-fee-calculator",
      icon: (
        <div className="flex size-9 sm:size-10 items-center justify-center rounded-xl bg-black text-white shrink-0 shadow-2xs p-1.5 sm:p-2">
          <svg viewBox="0 0 24 24" fill="none" className="size-full">
            <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.209 1.747 2.89 2.89 0 0 1 2.313-4.639c.314 0 .619.05.904.144V9.42a6.33 6.33 0 0 0-.904-.067 6.337 6.337 0 0 0-6.337 6.338 6.337 6.337 0 0 0 10.82 4.48 6.29 6.29 0 0 0 1.854-4.48V8.97a8.21 8.21 0 0 0 5.01 1.706V7.234a4.836 4.836 0 0 1-1.236-.548z" fill="#fff" />
            <path d="M16.5 6.4a4.8 4.8 0 0 1-3.6-4.1h-.6v13.4a2.9 2.9 0 0 1-5.2 1.7 2.9 2.9 0 0 1 2.3-4.6c.3 0 .6 0 .9.1V9.4a6.3 6.3 0 0 0-.9-.1 6.3 6.3 0 0 0-6.3 6.3 6.3 6.3 0 0 0 10.8 4.5 6.3 6.3 0 0 0 1.9-4.5V9a8.2 8.2 0 0 0 4.9 1.6V7.2a4.8 4.8 0 0 1-4.2-.8z" fill="#25F4EE" opacity="0.9" />
            <path d="M17 6.8a4.8 4.8 0 0 1-3.6-4.1h.5v13.4a2.9 2.9 0 0 1-5.2 1.7 2.9 2.9 0 0 1 2.3-4.6c.3 0 .6 0 .9.1V9.8a6.3 6.3 0 0 0-.9-.1 6.3 6.3 0 0 0-6.3 6.3 6.3 6.3 0 0 0 10.8 4.5 6.3 6.3 0 0 0 1.9-4.5V9.4a8.2 8.2 0 0 0 4.9 1.6V7.6a4.8 4.8 0 0 1-4.6-.8z" fill="#FE2C55" opacity="0.9" />
          </svg>
        </div>
      ),
    },
    {
      id: "stripe",
      title: "Stripe Fee Calculator",
      subtitle: "Calculate Stripe processing fees and payout.",
      category: "freelance",
      href: "/tools/stripe-vs-paypal-fee-calculator",
      icon: (
        <div className="flex size-9 sm:size-10 items-center justify-center rounded-xl bg-[#635BFF] text-white shrink-0 shadow-2xs font-bold text-lg select-none">
          S
        </div>
      ),
    },
    {
      id: "freelance-tax",
      title: "Freelancer Tax Calculator",
      subtitle: "Estimate your U.S. (1099) self-employment tax and take-home income.",
      category: "freelance",
      href: "/tools/stripe-vs-paypal-fee-calculator",
      icon: (
        <div className="flex size-9 sm:size-10 items-center justify-center rounded-xl bg-blue-600 text-white shrink-0 shadow-2xs">
          <Calculator className="size-5" />
        </div>
      ),
    },
    {
      id: "saas-profit",
      title: "SaaS Profit Calculator",
      subtitle: "Model pricing, costs and monthly profit for your SaaS.",
      category: "saas",
      href: "/tools/pod-profit-calculator",
      icon: (
        <div className="flex size-9 sm:size-10 items-center justify-center rounded-xl bg-cyan-600 text-white shrink-0 shadow-2xs">
          <Layers className="size-5" />
        </div>
      ),
    },
    {
      id: "pod",
      title: "Print-on-Demand (POD)",
      subtitle: "Calculate Printify base cost vs. retail markup & margin.",
      category: "ecommerce",
      href: "/tools/pod-profit-calculator",
      icon: (
        <div className="flex size-9 sm:size-10 items-center justify-center rounded-xl bg-purple-600 text-white shrink-0 shadow-2xs">
          <Shirt className="size-5" />
        </div>
      ),
    },
    {
      id: "comparison",
      title: "Marketplace Compare",
      subtitle: "Side-by-side fee take rates for Etsy vs. Shopify vs. TikTok.",
      category: "ecommerce",
      href: "/tools/etsy-vs-shopify-vs-tiktok-shop-calculator",
      icon: (
        <div className="flex size-9 sm:size-10 items-center justify-center rounded-xl bg-indigo-600 text-white shrink-0 shadow-2xs">
          <ArrowLeftRight className="size-5" />
        </div>
      ),
    },
  ];

  const guides = [
    {
      slug: "how-to-calculate-etsy-fees-2026",
      title: "Etsy Fees Explained (2026 Guide)",
      readTime: "8 min read",
      type: "etsy" as const,
    },
    {
      slug: "etsy-vs-shopify-vs-tiktok-shop-comparison",
      title: "Shopify vs. Etsy: Which Is Better for You?",
      readTime: "10 min read",
      type: "shopify" as const,
    },
    {
      slug: "pod-pricing-strategy-offsite-ads",
      title: "How to Calculate Profit Margin (With Examples)",
      readTime: "6 min read",
      type: "margin" as const,
    },
    {
      slug: "pass-payment-processing-fees-to-clients",
      title: "Freelance Taxes: A Simple Guide (US 1099)",
      readTime: "12 min read",
      type: "tax" as const,
    },
  ];

  const filteredPopular = useMemo(() => {
    return popularCalculators.filter((item) => {
      // Category Filter
      let matchesCat = true;
      if (activeCategory !== "all") {
        matchesCat = item.category === activeCategory;
      }

      // Search Query Filter
      let matchesSearch = true;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        matchesSearch =
          item.title.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q);
      }

      return matchesCat && matchesSearch;
    });
  }, [popularCalculators, activeCategory, searchQuery]);

  return (
    <div className="w-full">
      {/* ===================== HERO SECTION ===================== */}
      <section className="pt-10 sm:pt-14 pb-6 text-center px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-[46px] font-extrabold tracking-tight text-zinc-950 leading-[1.18] max-w-2xl mx-auto">
            Calculate Fees, Profit &amp; Compare Platforms
          </h1>

          {/* Subtitle */}
          <p className="mt-3 text-sm sm:text-base text-zinc-500 max-w-xl mx-auto leading-normal font-normal">
            Instant, accurate fee calculators for Etsy, Shopify, TikTok Shop &amp; Stripe.
          </p>

          {/* Search Bar Container - Pill rounded-full like before */}
          <div className="mt-7 max-w-2xl mx-auto">
            <form
              onSubmit={(e) => e.preventDefault()}
              className="relative flex items-center w-full group rounded-full bg-white shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] border border-zinc-200/90 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all duration-200"
            >
              <Search className="absolute left-4 sm:left-5 size-5 text-zinc-400 group-focus-within:text-blue-600 transition-colors pointer-events-none" />
              <input
                id="hero-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search calculators..."
                className="w-full rounded-full bg-transparent py-3.5 sm:py-4 pl-12 sm:pl-14 pr-14 text-sm sm:text-base text-zinc-900 placeholder:text-zinc-400 focus:outline-none font-sans"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 size-9 sm:size-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center shrink-0"
                aria-label="Search"
              >
                <Search className="size-4 sm:size-4.5 stroke-[2.5]" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ===================== POPULAR CALCULATORS (4 Columns x 2 Rows) ===================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 mb-14">
        {/* Header Row: Title on Left, Filter Pills on Right */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 mb-5">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 font-sans">
            Popular Calculators
          </h2>

          {/* Filter Pills with compact rounded-lg Border Radius */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`rounded-lg px-3.5 sm:px-4 py-1.5 text-xs font-medium transition-all duration-150 cursor-pointer ${
                    isActive
                      ? "bg-blue-600 text-white shadow-xs font-semibold"
                      : "bg-white text-zinc-600 border border-zinc-200/90 hover:bg-zinc-50 hover:text-zinc-950 hover:border-zinc-300"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4 Columns x 2 Rows Clean Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredPopular.map((item) => (
            <CalculatorCard
              key={item.id}
              title={item.title}
              subtitle={item.subtitle}
              href={item.href}
              icon={item.icon}
            />
          ))}
        </div>

        {/* View All Button: Highlighted, Focused, rounded-lg */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/#all-tools-grid"
            onClick={() => {
              const el = document.getElementById("all-tools-grid");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="group inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-7 py-2.5 text-sm font-medium shadow-sm shadow-blue-600/20 hover:shadow-md hover:shadow-blue-600/30 transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>

      {/* ===================== GUIDES & RESOURCES (4 Columns) ===================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-14">
        {/* Section Header */}
        <div className="mb-5">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 font-sans">
            Guides &amp; Resources
          </h2>
        </div>

        {/* 4 Columns Grid using Reusable GuideCard with matching rounded-xl */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5 sm:gap-5">
          {guides.map((guide) => (
            <GuideCard
              key={guide.slug}
              slug={guide.slug}
              title={guide.title}
              readTime={guide.readTime}
              type={guide.type}
            />
          ))}
        </div>

        {/* View All Guides Button: Highlighted, Centered Below Cards */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/guides/how-to-calculate-etsy-fees-2026"
            className="group inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-7 py-2.5 text-sm font-medium shadow-sm shadow-blue-600/20 hover:shadow-md hover:shadow-blue-600/30 transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>

      {/* Target anchor for smooth scrolling */}
      <div id="all-tools-grid" />
    </div>
  );
}
