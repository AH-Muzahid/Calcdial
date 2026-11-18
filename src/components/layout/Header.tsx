"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Search, Menu, X, ChevronDown, ShoppingBag, Video, Shirt, ArrowLeftRight, CreditCard, ArrowRight } from "lucide-react";
import { CalcDialLogo } from "./CalcDialLogo";

const NAV_CALCULATORS = [
  {
    name: "Etsy Fee Calculator",
    href: "/tools/etsy-fee-calculator",
    icon: (
      <div className="flex size-7 items-center justify-center rounded-lg bg-[#F1641E]/10 text-[#F1641E] shrink-0 font-serif font-black text-xs">
        E
      </div>
    ),
  },
  {
    name: "Shopify Profit & ROAS",
    href: "/tools/shopify-profit-calculator",
    icon: (
      <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
        <ShoppingBag className="size-3.5" />
      </div>
    ),
  },
  {
    name: "TikTok Shop Fees",
    href: "/tools/tiktok-shop-fee-calculator",
    icon: (
      <div className="flex size-7 items-center justify-center rounded-lg bg-black text-white shrink-0">
        <Video className="size-3" />
      </div>
    ),
  },
  {
    name: "Print-on-Demand (POD)",
    href: "/tools/pod-profit-calculator",
    icon: (
      <div className="flex size-7 items-center justify-center rounded-lg bg-purple-50 text-purple-600 shrink-0">
        <Shirt className="size-3.5" />
      </div>
    ),
  },
  {
    name: "3-Way Platform Compare",
    href: "/tools/etsy-vs-shopify-vs-tiktok-shop-calculator",
    icon: (
      <div className="flex size-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 shrink-0">
        <ArrowLeftRight className="size-3.5" />
      </div>
    ),
  },
  {
    name: "Stripe vs. PayPal Calculator",
    href: "/tools/stripe-vs-paypal-fee-calculator",
    icon: (
      <div className="flex size-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 shrink-0">
        <CreditCard className="size-3.5" />
      </div>
    ),
  },
];

export function Header() {
  const [calcMenuOpen, setCalcMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCalcOpen, setMobileCalcOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setCalcMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const triggerGlobalSearch = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-command-menu"));
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/70 bg-white/90 backdrop-blur-md">
      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Logo */}
        <div className="flex items-center">
          <CalcDialLogo />
        </div>

        {/* Center: Desktop Navigation Links (Centrally Aligned in Navbar) */}
        <nav className="hidden md:flex absolute inset-y-0 left-1/2 -translate-x-1/2 items-center gap-8 text-[14px] font-medium text-zinc-600">
          {/* Calculators Dropdown */}
          <div className="relative flex items-center h-full" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setCalcMenuOpen(!calcMenuOpen)}
              className={`flex items-center gap-1.5 py-1 transition-colors cursor-pointer ${
                calcMenuOpen ? "text-zinc-950 font-semibold" : "text-zinc-600 hover:text-zinc-950"
              }`}
            >
              <span>Calculators</span>
              <ChevronDown
                className={`size-3.5 text-zinc-400 transition-transform duration-200 ${
                  calcMenuOpen ? "rotate-180 text-zinc-900" : ""
                }`}
              />
            </button>

            {/* Flyout Dropdown Menu - Clean Single-Line Items */}
            {calcMenuOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1.5 w-72 rounded-xl border border-zinc-200/90 bg-white/98 backdrop-blur-xl p-2 shadow-[0_12px_36px_rgba(0,0,0,0.08)] animate-in fade-in slide-in-from-top-2 duration-150 z-50 font-sans">
                <div className="px-3 pt-1.5 pb-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                  Calculators
                </div>
                <div className="space-y-0.5">
                  {NAV_CALCULATORS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setCalcMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 transition-colors hover:bg-zinc-50 group"
                    >
                      {item.icon}
                      <span className="font-medium text-[13px] text-zinc-800 group-hover:text-blue-600 transition-colors truncate">
                        {item.name}
                      </span>
                    </Link>
                  ))}
                </div>
                <div className="mt-1.5 pt-1.5 border-t border-zinc-100 px-2 pb-1">
                  <Link
                    href="/#all-tools-grid"
                    onClick={() => setCalcMenuOpen(false)}
                    className="flex items-center justify-between text-xs font-medium text-blue-600 hover:text-blue-700 px-2 py-1 rounded transition-colors"
                  >
                    <span>Explore all tools</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Comparisons Link */}
          <Link
            href="/tools/etsy-vs-shopify-vs-tiktok-shop-calculator"
            className="text-zinc-600 hover:text-zinc-950 transition-colors"
          >
            Comparisons
          </Link>

          {/* Guides Link */}
          <Link
            href="/guides/how-to-calculate-etsy-fees-2026"
            className="text-zinc-600 hover:text-zinc-950 transition-colors"
          >
            Guides
          </Link>
        </nav>

        {/* Right Actions: Precise Search Icon Button & Mobile Toggle */}
        <div className="flex items-center gap-2.5">
          {/* Precise Search Icon Button (opens ⌘K command menu) */}
          <button
            type="button"
            onClick={triggerGlobalSearch}
            className="flex size-9 items-center justify-center rounded-lg border border-zinc-200/80 bg-white text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50 hover:border-zinc-300 shadow-2xs transition-all cursor-pointer"
            aria-label="Search calculators (⌘K)"
            title="Search calculators (⌘K)"
          >
            <Search className="size-4" />
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex md:hidden size-9 items-center justify-center rounded-lg border border-zinc-200/80 bg-white text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50 transition-colors cursor-pointer"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="size-4.5" /> : <Menu className="size-4.5" />}
          </button>
        </div>
      </div>

      {/* Mobile Responsive Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200/80 bg-white px-4 py-3.5 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col gap-1 text-sm font-medium text-zinc-700">
            {/* Calculators Accordion */}
            <div>
              <button
                type="button"
                onClick={() => setMobileCalcOpen(!mobileCalcOpen)}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-zinc-800 hover:bg-zinc-50 transition-colors"
              >
                <span>Calculators</span>
                <ChevronDown
                  className={`size-4 text-zinc-400 transition-transform ${
                    mobileCalcOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {mobileCalcOpen && (
                <div className="ml-3 my-1 border-l-2 border-zinc-150 pl-2 space-y-1">
                  {NAV_CALCULATORS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block rounded-md px-2.5 py-1.5 text-xs text-zinc-600 hover:text-blue-600 hover:bg-zinc-50 transition-colors"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Comparisons */}
            <Link
              href="/tools/etsy-vs-shopify-vs-tiktok-shop-calculator"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-zinc-800 hover:bg-zinc-50 transition-colors"
            >
              Comparisons
            </Link>

            {/* Guides */}
            <Link
              href="/guides/how-to-calculate-etsy-fees-2026"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-zinc-800 hover:bg-zinc-50 transition-colors"
            >
              Guides
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
