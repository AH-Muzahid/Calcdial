"use client";

import React, { useState, useMemo } from "react";
import { Search, Shirt, ArrowLeftRight } from "lucide-react";
import { CalculatorCard } from "./CalculatorCard";
import { GuideCard } from "./GuideCard";
import { HeroShowcaseCard } from "./HeroShowcaseCard";
import { AdSlot } from "@/components/layout/AdSlot";

const POPULAR_CALCULATORS = [
    {
      id: "etsy",
      title: "Etsy Fee Calculator",
      subtitle: "Calculate Etsy fees, Offsite Ads and your net profit.",
      category: "ecommerce",
      categories: ["ecommerce"],
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
      categories: ["ecommerce", "payments"],
      href: "/tools/shopify-profit-calculator",
      icon: (
        <div className="flex size-9 sm:size-10 items-center justify-center rounded-xl bg-white border border-zinc-200/90 shadow-2xs shrink-0 p-1.5 sm:p-2">
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
      categories: ["ecommerce"],
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
      id: "pod",
      title: "Print-on-Demand (POD)",
      subtitle: "Calculate Printify base cost vs. retail markup & margin.",
      category: "ecommerce",
      categories: ["ecommerce"],
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
      category: "comparison",
      categories: ["ecommerce", "comparison"],
      href: "/tools/etsy-vs-shopify-vs-tiktok-shop-calculator",
      icon: (
        <div className="flex size-9 sm:size-10 items-center justify-center rounded-xl bg-indigo-600 text-white shrink-0 shadow-2xs">
          <ArrowLeftRight className="size-5" />
        </div>
      ),
    },
    {
      id: "stripe-paypal",
      title: "Stripe vs. PayPal Calculator",
      subtitle: "Compare processor fees and calculate client invoice gross-up amounts.",
      category: "payments",
      categories: ["payments", "comparison"],
      href: "/tools/stripe-vs-paypal-fee-calculator",
      icon: (
        <div className="flex size-9 sm:size-10 items-center justify-center rounded-xl bg-[#635BFF] text-white shrink-0 shadow-2xs font-bold text-lg select-none">
          S
        </div>
      ),
    },
  ];

  const GUIDES = [
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

export function ToolsDirectory() {
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", label: "All Tools" },
    { id: "ecommerce", label: "E-Commerce & Seller" },
    { id: "payments", label: "Payments & Invoicing" },
    { id: "comparison", label: "Comparisons" },
  ];

  const filteredPopular = useMemo(() => {
    if (activeCategory === "all") return POPULAR_CALCULATORS;
    return POPULAR_CALCULATORS.filter((item) => {
      return (
        item.category === activeCategory ||
        (item.categories && item.categories.includes(activeCategory))
      );
    });
  }, [activeCategory]);

  return (
    <div className="w-full">
      {/* ===================== HERO SECTION (MindCloud Authentic Radiant Blue Atmosphere) ===================== */}
      <section 
        className="pt-28 sm:pt-36 pb-24 sm:pb-32 text-center px-4 sm:px-6 min-h-[660px] sm:min-h-[720px] flex flex-col justify-center items-center relative overflow-hidden" 
        style={{
          backgroundColor: "#010918",
          backgroundImage: `radial-gradient(ellipse 100% 60% at 50% 50%, rgba(22, 104, 254, 0.95) 0%, rgba(0, 50, 180, 0.45) 45%, transparent 75%), radial-gradient(ellipse 80% 35% at 50% 75%, rgba(255, 255, 255, 0.45) 0%, transparent 65%), linear-gradient(180deg, #010918 0%, #02123b 16%, #003294 34%, #0056ec 50%, #1a6efc 64%, #5ea2ff 78%, #b8d7ff 88%, #f2f7ff 95%, #ffffff 100%)`,
          backgroundRepeat: "no-repeat",
        }}
        data-header-over-dark="true"
      >
        {/* MindCloud Authentic Background Flared Conic Light Shape */}
        <div className="hero-background-shape" aria-hidden="true">
          <svg viewBox="0 0 1440 850" fill="none" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#heroBackgroundShapeFilter)" style={{ mixBlendMode: "plus-lighter" }}>
              <path d="M774.33 0C774.33 456.393 1186.78 682.164 1393 738H47C253.223 682.164 665.67 456.393 665.67 0H774.33Z" fill="url(#heroBackgroundShapeGradient)" fillOpacity="0.12" />
            </g>
            <defs>
              <filter id="heroBackgroundShapeFilter" x="-65" y="-112" width="1570" height="962" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                <feGaussianBlur stdDeviation="56" result="effect1_foregroundBlur" />
              </filter>
              <linearGradient id="heroBackgroundShapeGradient" x1="232.075" y1="100.869" x2="232.075" y2="735.916" gradientUnits="userSpaceOnUse">
                <stop stopColor="#4D90FD" stopOpacity="0" />
                <stop offset="0.25" stopColor="#4D90FD" />
                <stop offset="0.509615" stopColor="#76D0F4" />
                <stop offset="0.759615" stopColor="#FF2C2C" />
                <stop offset="1" stopColor="#FFE4D7" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="max-w-3xl mx-auto relative z-10 w-full">
          {/* Glassmorphic Pill Trust Badge (MindCloud Authentic Glow + Appearing Animation) */}
          <div className="hero-mindcloud-badge animate-hero-badge mb-6 select-none cursor-default">
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse relative z-10" />
            <span className="relative z-10 opacity-90 text-[11px] sm:text-xs text-white">Official Rates Verified</span>
            <span className="w-px h-3.5 bg-white/20 relative z-10" />
            <span className="relative z-10 text-blue-200 font-semibold text-[11px] sm:text-xs">2026 Updated</span>
          </div>

          {/* Main Headline (MindCloud Staggered Appearing Animation) */}
          <h1 className="animate-hero-title text-3xl sm:text-[44px] md:text-[48px] font-medium tracking-[-1.5px] leading-[1.15] sm:leading-[52px] max-w-3xl mx-auto font-sans">
            <span className="block text-white">Know Your Real Profit.</span>
            <span className="block text-[#badfff]">Before You Sell.</span>
          </h1>

          {/* Subtitle (MindCloud Smooth Fade-in Animation) */}
          <p className="animate-hero-subtitle mt-3.5 sm:mt-4 text-[15px] sm:text-[16px] text-[#badfff]/90 max-w-[520px] mx-auto leading-[24px] tracking-[-0.16px] font-normal">
            Instant, client-side fee calculators for Etsy, Shopify, TikTok Shop &amp; Stripe with verified platform ratecards.
          </p>

          {/* Floating Search Bar (Connected to Command Palette) */}
          <div className="animate-hero-cta relative mt-7 sm:mt-8 max-w-lg mx-auto w-full px-2 sm:px-0">
            {/* Ambient Bloom Aura */}
            <div className="animate-hero-bloom pointer-events-none absolute inset-0 -z-10 rounded-2xl bg-blue-500/25 blur-xl transform-gpu" />
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.dispatchEvent(new CustomEvent("open-command-menu"));
                }
              }}
              className="flex items-center w-full rounded-2xl bg-white shadow-[0_12px_32px_rgba(0,0,0,0.18)] border border-white/80 p-1.5 sm:p-2 pl-4 sm:pl-4.5 gap-2.5 transition-all hover:ring-4 hover:ring-blue-400/25 cursor-pointer text-left group"
              aria-label="Open search command palette"
            >
              <Search className="size-4.5 text-zinc-400 shrink-0 group-hover:text-[#2b5cfd] transition-colors" />
              <span className="flex-1 min-w-0 py-1.5 text-sm sm:text-base text-zinc-400 font-normal font-sans truncate select-none">
                Search 80+ seller calculators (e.g. Etsy, Shopify, TikTok, Stripe)...
              </span>
              <div className="hidden sm:inline-flex items-center gap-1 mr-1 px-2 py-1 rounded-lg bg-zinc-100 border border-zinc-200/80 text-[11px] font-mono font-semibold text-zinc-500">
                <span>⌘</span>
                <span>K</span>
              </div>
              <span
                className="flex size-9 sm:size-10 items-center justify-center rounded-xl bg-[#2b5cfd] text-white shadow-xs group-hover:bg-[#2554f6] shrink-0 transition-colors"
                aria-hidden="true"
              >
                <Search className="size-4 stroke-[2.5]" />
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* ===================== STANDALONE LIVE CALCULATOR SHOWCASE (Pulled Higher Up) ===================== */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 sm:-mt-28 relative z-20 mb-20 sm:mb-28">
        <HeroShowcaseCard />
      </section>

      {/* ===================== POPULAR CALCULATORS ===================== */}
      <section id="tools" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 sm:mb-24 scroll-mt-20">
        {/* Header Row: Title on Left, Filter Pills on Right */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 pb-4 border-b border-zinc-200/70">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#2b5cfd] block mb-1">
              Instant Calculators
            </span>
            <h2 className="text-2xl sm:text-3xl font-medium tracking-[-0.8px] text-zinc-950 font-sans">
              Popular Seller Calculators
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 font-normal mt-1 max-w-xl">
              Select your platform to calculate net payout, seller deductions, and break-even pricing with verified 2026 ratecards.
            </p>
          </div>

          {/* Filter Pills with compact rounded-lg Border Radius */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 shrink-0">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`rounded-lg px-3.5 sm:px-4 py-1.5 text-xs font-bold transition-all duration-150 cursor-pointer min-h-9 flex items-center justify-center ${
                    isActive
                      ? "bg-[#2b5cfd] text-white shadow-[inset_0_1px_0_0_rgb(255_255_255/0.35),0_2px_8px_rgb(43_92_253/0.4)] ring-1 ring-[#1b3cb5]"
                      : "bg-white text-zinc-800 border border-zinc-200/90 hover:bg-zinc-100 hover:text-zinc-950 hover:border-zinc-300"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3 Columns x 2 Rows Clean Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4.5 sm:gap-5">
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
      </section>

      {/* ===================== SPONSOR / ADSENSE PLACEMENT (High Viewability Break) ===================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10 sm:my-14">
        <AdSlot position="in-content" />
      </div>

      {/* ===================== GUIDES & RESOURCES ===================== */}
      <section id="guides" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 sm:mb-24 scroll-mt-20">
        {/* Section Header */}
        <div className="mb-6 pb-4 border-b border-zinc-200/70">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#2b5cfd] block mb-1">
            Seller Knowledge Base
          </span>
          <h2 className="text-2xl sm:text-3xl font-medium tracking-[-0.8px] text-zinc-950 font-sans">
            Seller Fee Guides &amp; Profit Strategies
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 font-normal mt-1 max-w-xl">
            Understand platform algorithm deductions and protect your profit margins.
          </p>
        </div>

        {/* 4 Columns Grid using Reusable GuideCard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5 sm:gap-5">
          {GUIDES.map((guide) => (
            <GuideCard
              key={guide.slug}
              slug={guide.slug}
              title={guide.title}
              readTime={guide.readTime}
              type={guide.type}
            />
          ))}
        </div>
      </section>

      {/* Target anchor for smooth scrolling */}
      <div id="all-tools-grid" />
    </div>
  );
}
