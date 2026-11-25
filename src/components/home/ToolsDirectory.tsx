"use client";

import React from "react";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
import { CalculatorCard } from "./CalculatorCard";
import { GuideCard } from "./GuideCard";
import { HeroShowcaseCard } from "./HeroShowcaseCard";
import { AdSlot } from "@/components/layout/AdSlot";
import { ToolIcon } from "@/components/common/ToolIcons";

const POPULAR_CALCULATORS = [
  {
    id: "etsy",
    title: "Etsy Fee Calculator",
    subtitle: "Listing, transaction & Offsite Ads margin.",
    href: "/tools/etsy-fee-calculator",
    icon: <ToolIcon slug="etsy" size="md" />,
  },
  {
    id: "shopify",
    title: "Shopify Profit & ROAS Calculator",
    subtitle: "Plan tiers, gateway fees & ad spend ROAS.",
    href: "/tools/shopify-profit-calculator",
    icon: <ToolIcon slug="shopify" size="md" />,
  },
  {
    id: "tiktok",
    title: "TikTok Shop Calculator",
    subtitle: "Referral fees, affiliate cuts & break-even.",
    href: "/tools/tiktok-shop-fee-calculator",
    icon: <ToolIcon slug="tiktok" size="md" />,
  },
  {
    id: "pod",
    title: "Print-on-Demand (POD)",
    subtitle: "Printify base cost vs. retail margin.",
    href: "/tools/pod-profit-calculator",
    icon: <ToolIcon slug="pod" size="md" />,
  },
  {
    id: "comparison",
    title: "Marketplace Compare",
    subtitle: "Etsy vs. Shopify vs. TikTok fee take rates.",
    href: "/tools/etsy-vs-shopify-vs-tiktok-shop-calculator",
    icon: <ToolIcon slug="comparison" size="md" />,
  },
  {
    id: "stripe-paypal",
    title: "Stripe vs. PayPal Calculator",
    subtitle: "Processor fees & client invoice gross-up.",
    href: "/tools/stripe-vs-paypal-fee-calculator",
    icon: <ToolIcon slug="stripe-paypal" size="md" />,
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
    title: "Passing Processing Fees to Clients (Gross-Up Guide)",
    readTime: "6 min read",
    type: "tax" as const,
  },
];

export function ToolsDirectory() {
  return (
    <div className="w-full">
      {/* ===================== HERO SECTION (Cosmic Deep Atmosphere) ===================== */}
      <section
        className="pt-32 pb-24 sm:pb-32 text-center px-4 sm:px-6 min-h-[640px] sm:min-h-[704px] flex flex-col justify-center items-center relative overflow-hidden"
        style={{
          backgroundColor: "#010918",
          backgroundImage: `radial-gradient(ellipse 100% 60% at 50% 50%, rgba(22, 104, 254, 0.95) 0%, rgba(0, 50, 180, 0.45) 45%, transparent 75%), radial-gradient(ellipse 80% 35% at 50% 75%, rgba(255, 255, 255, 0.4) 0%, transparent 65%), linear-gradient(180deg, #010918 0%, #02123b 16%, #003294 34%, #0056ec 50%, #1a6efc 64%, #6baaff 78%, #bed8ff 88%, #eaeef5 95%, #f4f4f5 100%)`,
          backgroundRepeat: "no-repeat",
        }}
        data-header-over-dark="true"
      >
        {/* Background Flared Conic Light Shape */}
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
                <stop offset="0.55" stopColor="#76D0F4" />
                <stop offset="0.82" stopColor="#BADFFF" />
                <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="max-w-3xl mx-auto relative z-10 w-full">
          {/* Glassmorphic Pill Trust Badge */}
          <div className="hero-mindcloud-badge animate-hero-badge mb-6 select-none cursor-default">
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse relative z-10" />
            <span className="relative z-10 font-medium text-xs text-white">Official Rates Verified</span>
            <span className="w-px h-4 bg-white/20 relative z-10" />
            <span className="relative z-10 text-[#badfff] font-semibold text-xs">2026 Updated</span>
          </div>

          {/* Main Headline */}
          <h1 className="animate-hero-title text-3xl sm:text-[44px] md:text-[48px] font-medium tracking-[-1.5px] leading-[1.15] sm:leading-[52px] max-w-3xl mx-auto font-sans">
            <span className="block text-white">Know Your Real Profit.</span>
            <span className="block text-[#d8eeff]">Before You Sell.</span>
          </h1>

          {/* Subtitle */}
          <p className="animate-hero-subtitle mt-4 text-base text-[#badfff]/90 max-w-lg mx-auto leading-relaxed tracking-[-0.16px] font-normal">
            Instant, client-side fee calculators for Etsy, Shopify, TikTok Shop &amp; Stripe with verified platform ratecards.
          </p>

          {/* Compact Floating Search Bar */}
          <div className="animate-hero-cta relative mt-8 max-w-lg mx-auto w-full px-2 sm:px-0">
            <div className="animate-hero-bloom pointer-events-none absolute inset-0 -z-10 rounded-2xl bg-[#2b5cfd]/25 blur-xl transform-gpu" />
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.dispatchEvent(new CustomEvent("open-command-menu"));
                }
              }}
              className="flex items-center w-full rounded-2xl bg-white shadow-[0_12px_32px_rgba(0,0,0,0.18)] border border-white/80 p-1.5 pl-4 gap-2 transition-shadow hover:shadow-[0_16px_36px_rgba(0,0,0,0.22)] focus-visible:outline-hidden focus-visible:ring-4 focus-visible:ring-[#2b5cfd]/30 cursor-pointer text-left group"
              aria-label="Open search command palette"
            >
              <span className="flex-1 min-w-0 py-1.5 text-sm text-zinc-500 font-normal font-sans truncate select-none">
                Search seller calculators (Etsy, Shopify, TikTok)...
              </span>
              <div className="hidden sm:inline-flex items-center gap-1 mr-1 px-2 py-1 rounded-lg bg-zinc-100 border border-zinc-200/80 text-xs font-mono font-semibold text-zinc-500">
                <span>⌘</span>
                <span>K</span>
              </div>
              <span
                className="flex size-9 items-center justify-center rounded-xl bg-[#2b5cfd] text-white shadow-xs group-hover:bg-[#2554f6] shrink-0 transition-colors"
                aria-hidden="true"
              >
                <Search className="size-4 stroke-[2.5]" />
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* ===================== STANDALONE LIVE CALCULATOR SHOWCASE ===================== */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 sm:-mt-32 relative z-20 mb-16 sm:mb-24">
        <HeroShowcaseCard />
      </section>

      {/* ===================== POPULAR CALCULATORS ===================== */}
      <section id="tools" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-24 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-950 font-sans">
              Popular Seller Calculators
            </h2>
            <p className="text-sm text-zinc-600 font-normal mt-2 max-w-xl">
              Select your platform to calculate net payout, deductions, and break-even pricing.
            </p>
          </div>

          <Link
            href="/calculators"
            prefetch={false}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#2b5cfd] hover:text-[#2554f6] shrink-0 self-start sm:self-end transition-colors group"
          >
            <span>View all calculators</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* 3 Columns x 2 Rows Clean Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {POPULAR_CALCULATORS.map((item) => (
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

      {/* ===================== SPONSOR / ADSENSE PLACEMENT ===================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8 sm:my-12">
        <AdSlot position="in-content" />
      </div>

      {/* ===================== GUIDES & RESOURCES ===================== */}
      <section id="guides" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-24 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-950 font-sans">
              Seller Fee Guides &amp; Profit Strategies
            </h2>
            <p className="text-sm text-zinc-600 font-normal mt-2 max-w-xl">
              Understand platform algorithm deductions and protect your profit margins.
            </p>
          </div>

          <Link
            href="/guides"
            prefetch={false}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#2b5cfd] hover:text-[#2554f6] shrink-0 self-start sm:self-end transition-colors group"
          >
            <span>View all guides</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
