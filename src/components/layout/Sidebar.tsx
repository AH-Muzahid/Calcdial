"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalcDialLogo } from "./CalcDialLogo";

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();

  const calculators = [
    {
      title: "All Calculators",
      href: "/#tools",
      badge: "6 Tools",
      icon: (
        <svg className="size-4 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <rect width="7" height="7" x="3" y="3" rx="1" />
          <rect width="7" height="7" x="14" y="3" rx="1" />
          <rect width="7" height="7" x="14" y="14" rx="1" />
          <rect width="7" height="7" x="3" y="14" rx="1" />
        </svg>
      ),
    },
    {
      title: "Etsy Fee Calculator",
      href: "/tools/etsy-fee-calculator",
      badge: "6.5%",
      badgeColor: "bg-orange-50 text-orange-700 border-orange-200",
      icon: (
        <span className="flex size-4 items-center justify-center rounded bg-orange-600 text-[10px] font-bold text-white">
          E
        </span>
      ),
    },
    {
      title: "Shopify Profit & ROAS",
      href: "/tools/shopify-profit-calculator",
      badge: "2.9%",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: (
        <span className="flex size-4 items-center justify-center rounded bg-emerald-600 text-[10px] font-bold text-white">
          S
        </span>
      ),
    },
    {
      title: "TikTok Shop Fees",
      href: "/tools/tiktok-shop-fee-calculator",
      badge: "6%",
      badgeColor: "bg-zinc-100 text-zinc-900 border-zinc-300",
      icon: (
        <span className="flex size-4 items-center justify-center rounded bg-zinc-950 text-[10px] font-bold text-cyan-400">
          T
        </span>
      ),
    },
    {
      title: "Print-on-Demand (POD)",
      href: "/tools/pod-profit-calculator",
      badge: "Margin",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
      icon: (
        <span className="flex size-4 items-center justify-center rounded bg-purple-600 text-[10px] font-bold text-white">
          P
        </span>
      ),
    },
    {
      title: "Marketplace Compare",
      href: "/tools/etsy-vs-shopify-vs-tiktok-shop-calculator",
      badge: "3-Way",
      badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
      icon: (
        <span className="flex size-4 items-center justify-center rounded bg-indigo-600 text-[10px] font-bold text-white">
          VS
        </span>
      ),
    },
    {
      title: "Stripe vs PayPal & Gross-Up",
      href: "/tools/stripe-vs-paypal-fee-calculator",
      badge: "Invoice",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
      icon: (
        <span className="flex size-4 items-center justify-center rounded bg-blue-600 text-[10px] font-bold text-white">
          $
        </span>
      ),
    },
  ];

  const guides = [
    {
      title: "Etsy Fee Breakdown 2026",
      href: "/guides/how-to-calculate-etsy-fees-2026",
    },
    {
      title: "Etsy vs Shopify vs TikTok",
      href: "/guides/etsy-vs-shopify-vs-tiktok-shop-comparison",
    },
    {
      title: "Print-on-Demand Offsite Ads",
      href: "/guides/pod-pricing-strategy-offsite-ads",
    },
    {
      title: "Client Gross-Up Formula",
      href: "/guides/pass-payment-processing-fees-to-clients",
    },
  ];

  const infoLinks = [
    { title: "About & Methodology", href: "/about" },
    { title: "Privacy Policy", href: "/privacy-policy" },
    { title: "Terms of Service", href: "/terms" },
  ];

  return (
    <aside className="flex h-full w-full flex-col justify-between overflow-y-auto bg-white p-4">
      <div>
        {/* Brand Header */}
        <div className="flex items-center justify-between pb-5 border-b border-zinc-100">
          <CalcDialLogo />
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-950 transition-colors"
              aria-label="Close menu"
            >
              <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Section: Core Calculators */}
        <div className="mt-6">
          <div className="px-2 mb-2 flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold tracking-wider text-zinc-400 uppercase">
              Calculators
            </span>
            <span className="text-[10px] font-mono text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded">
              2026 Live
            </span>
          </div>
          <nav className="space-y-0.5">
            {calculators.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/#tools" && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`group flex items-center justify-between rounded-xl px-2.5 py-2 text-xs font-medium transition-all ${
                    isActive
                      ? "bg-zinc-100 text-zinc-950 font-semibold shadow-2xs"
                      : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {item.icon}
                    <span className="truncate">{item.title}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded border shrink-0 ${
                        item.badgeColor || "bg-zinc-100 text-zinc-600 border-zinc-200"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Section: Seller Guides */}
        <div className="mt-7">
          <div className="px-2 mb-2 flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold tracking-wider text-zinc-400 uppercase">
              Seller Guides
            </span>
            <Link
              href="/#guides"
              onClick={onClose}
              className="text-[10px] font-mono text-zinc-400 hover:text-zinc-900 transition-colors"
            >
              All Guides →
            </Link>
          </div>
          <nav className="space-y-0.5">
            {guides.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`block rounded-xl px-2.5 py-1.5 text-xs transition-colors truncate ${
                    isActive
                      ? "bg-zinc-100 text-zinc-950 font-semibold"
                      : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-950"
                  }`}
                >
                  <span className="truncate">{item.title}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Section: Info & Policies */}
        <div className="mt-7">
          <div className="px-2 mb-2">
            <span className="text-[11px] font-mono font-bold tracking-wider text-zinc-400 uppercase">
              Platform Info
            </span>
          </div>
          <nav className="space-y-0.5">
            {infoLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`block rounded-xl px-2.5 py-1.5 text-xs transition-colors ${
                    isActive
                      ? "bg-zinc-100 text-zinc-950 font-semibold"
                      : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-950"
                  }`}
                >
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Trust & Status Box at Sidebar Bottom */}
      <div className="mt-8 pt-4 border-t border-zinc-100">
        <div className="rounded-xl border border-zinc-200/80 bg-zinc-50 p-3">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-[11px] font-mono font-bold text-zinc-900">2026 RATES ACTIVE</span>
          </div>
          <p className="text-[11px] text-zinc-500 leading-normal">
            100% private in-browser math. Zero data stored or tracked.
          </p>
        </div>
      </div>
    </aside>
  );
}
