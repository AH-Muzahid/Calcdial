"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { Search, BookOpen, Shirt, ArrowLeftRight, CreditCard, ArrowRight } from "lucide-react";
import { GUIDES } from "@/data/tools-registry";

interface PaletteItem {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  icon: React.ReactNode;
}

const CALCULATORS_LIST: PaletteItem[] = [
  {
    id: "etsy",
    title: "Etsy Fee Calculator",
    subtitle: "Seller transaction, listing & processing fees",
    href: "/tools/etsy-fee-calculator",
    icon: (
      <div className="flex size-8 items-center justify-center rounded-lg bg-[#F1641E]/10 shrink-0">
        <span className="text-[#F1641E] font-serif font-black text-sm tracking-tighter select-none">
          Etsy
        </span>
      </div>
    ),
  },
  {
    id: "shopify",
    title: "Shopify Profit & ROAS Calculator",
    subtitle: "Net margin, plan fees & ad spend breakeven",
    href: "/tools/shopify-profit-calculator",
    icon: (
      <div className="flex size-8 items-center justify-center rounded-lg bg-[#95BF47]/15 shrink-0">
        <svg viewBox="0 0 109 123" fill="none" className="size-4.5">
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
    title: "TikTok Shop Fee Calculator",
    subtitle: "Referral commissions & fulfillment deductions",
    href: "/tools/tiktok-shop-fee-calculator",
    icon: (
      <div className="flex size-8 items-center justify-center rounded-lg bg-zinc-900 shrink-0">
        <svg viewBox="0 0 24 24" fill="none" className="size-4">
          <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.209 1.747 2.89 2.89 0 0 1 2.313-4.639c.314 0 .619.05.904.144V9.42a6.33 6.33 0 0 0-.904-.067 6.337 6.337 0 0 0-6.337 6.338 6.337 6.337 0 0 0 10.82 4.48 6.29 6.29 0 0 0 1.854-4.48V8.97a8.21 8.21 0 0 0 5.01 1.706V7.234a4.836 4.836 0 0 1-1.236-.548z" fill="#fff" />
          <path d="M16.5 6.4a4.8 4.8 0 0 1-3.6-4.1h-.6v13.4a2.9 2.9 0 0 1-5.2 1.7 2.9 2.9 0 0 1 2.3-4.6c.3 0 .6 0 .9.1V9.4a6.3 6.3 0 0 0-.9-.1 6.3 6.3 0 0 0-6.3 6.3 6.3 6.3 0 0 0 10.8 4.5 6.3 6.3 0 0 0 1.9-4.5V9a8.2 8.2 0 0 0 4.9 1.6V7.2a4.8 4.8 0 0 1-4.2-.8z" fill="#25F4EE" opacity="0.9" />
          <path d="M17 6.8a4.8 4.8 0 0 1-3.6-4.1h.5v13.4a2.9 2.9 0 0 1-5.2 1.7 2.9 2.9 0 0 1 2.3-4.6c.3 0 .6 0 .9.1V9.8a6.3 6.3 0 0 0-.9-.1 6.3 6.3 0 0 0-6.3 6.3 6.3 6.3 0 0 0 10.8 4.5 6.3 6.3 0 0 0 1.9-4.5V9.4a8.2 8.2 0 0 0 4.9 1.6V7.6a4.8 4.8 0 0 1-4.6-.8z" fill="#FE2C55" opacity="0.9" />
        </svg>
      </div>
    ),
  },
  {
    id: "pod",
    title: "Print-on-Demand (POD) Calculator",
    subtitle: "Printify & Gelato base cost vs. retail margin",
    href: "/tools/pod-profit-calculator",
    icon: (
      <div className="flex size-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600 shrink-0">
        <Shirt className="size-4" />
      </div>
    ),
  },
  {
    id: "compare",
    title: "Etsy vs. Shopify vs. TikTok Shop Comparison",
    subtitle: "Side-by-side fee take rates & profit comparison",
    href: "/tools/etsy-vs-shopify-vs-tiktok-shop-calculator",
    icon: (
      <div className="flex size-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 shrink-0">
        <ArrowLeftRight className="size-4" />
      </div>
    ),
  },
  {
    id: "stripe-paypal",
    title: "Stripe vs. PayPal & Gross-Up Calculator",
    subtitle: "Payment processing fees & client invoice gross-up",
    href: "/tools/stripe-vs-paypal-fee-calculator",
    icon: (
      <div className="flex size-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 shrink-0">
        <CreditCard className="size-4" />
      </div>
    ),
  },
];

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();

  // Lock body scroll and touch actions while command palette is active
  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    const originalTouchAction = document.body.style.touchAction;

    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.touchAction = originalTouchAction;
    };
  }, [open]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent<{ query?: string }>;
      setOpen(true);
      if (customEvent.detail?.query) {
        setSearch(customEvent.detail.query);
      }
    };

    document.addEventListener("keydown", down);
    window.addEventListener("open-command-menu", handleOpen);

    return () => {
      document.removeEventListener("keydown", down);
      window.removeEventListener("open-command-menu", handleOpen);
    };
  }, []);

  const navigateTo = (href: string) => {
    setOpen(false);
    setSearch("");
    router.push(href);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 font-sans overflow-hidden"
      onClick={() => {
        setOpen(false);
        setSearch("");
      }}
    >
      {/* Dim Backdrop with Soft Blur */}
      <div
        className="fixed inset-0 bg-zinc-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150 pointer-events-none"
        aria-hidden="true"
      />

      {/* Modern Spotlight Dialog */}
      <div
        className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-zinc-200/90 bg-white shadow-[0_24px_64px_-12px_rgba(0,0,0,0.35)] animate-in zoom-in-95 duration-150 z-10 font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        <Command className="flex flex-col w-full" loop label="Quick Search">
          {/* Header Search Input */}
          <div className="flex items-center border-b border-zinc-100 px-4 py-3.5 gap-3 bg-white">
            <Search className="size-5 text-zinc-400 shrink-0" />
            <Command.Input
              autoFocus
              value={search}
              onValueChange={setSearch}
              placeholder="Search 80+ calculators, platforms, or guides..."
              className="w-full bg-transparent text-sm sm:text-base font-semibold text-zinc-950 placeholder:text-zinc-400 focus:outline-hidden"
            />
            <kbd className="hidden sm:inline-flex items-center rounded-md border border-zinc-200 bg-zinc-100/80 px-2 py-0.5 text-[10px] font-mono font-semibold text-zinc-500 shadow-2xs">
              ESC
            </kbd>
          </div>

          {/* Results List with Clean Custom Scrollbar */}
          <Command.List className="max-h-[380px] overflow-y-auto px-2 py-2.5 focus:outline-hidden custom-scroll">
            <Command.Empty className="py-12 px-4 text-center">
              <Search className="size-8 text-zinc-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-zinc-800">
                No calculators or guides found
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                Try searching for &quot;Etsy&quot;, &quot;Shopify&quot;, &quot;TikTok&quot;, or &quot;Stripe&quot;.
              </p>
            </Command.Empty>

            {/* Calculators Group */}
            <Command.Group
              heading="Calculators &amp; Tools"
              className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-bold [&_[cmdk-group-heading]]:text-zinc-400 [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider"
            >
              {CALCULATORS_LIST.map((tool) => (
                <Command.Item
                  key={tool.id}
                  value={`${tool.title} ${tool.subtitle}`}
                  onSelect={() => navigateTo(tool.href)}
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-zinc-800 transition-colors cursor-pointer data-[selected=true]:bg-blue-50/70 data-[selected=true]:text-zinc-950 group my-0.5"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {tool.icon}
                    <div className="min-w-0">
                      <span className="font-bold text-zinc-900 text-sm block truncate group-data-[selected=true]:text-blue-700">
                        {tool.title}
                      </span>
                      <span className="text-xs text-zinc-500 font-normal block truncate">
                        {tool.subtitle}
                      </span>
                    </div>
                  </div>

                  <ArrowRight className="size-4 text-blue-600 opacity-0 group-data-[selected=true]:opacity-100 group-data-[selected=true]:translate-x-0.5 transition-all shrink-0 ml-2" />
                </Command.Item>
              ))}
            </Command.Group>

            {/* Guides Group */}
            <Command.Group
              heading="Seller Guides"
              className="mt-2 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-bold [&_[cmdk-group-heading]]:text-zinc-400 [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider"
            >
              {GUIDES.map((guide) => (
                <Command.Item
                  key={guide.slug}
                  value={`${guide.title} ${guide.description}`}
                  onSelect={() => navigateTo(`/guides/${guide.slug}`)}
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-zinc-800 transition-colors cursor-pointer data-[selected=true]:bg-blue-50/70 data-[selected=true]:text-zinc-950 group my-0.5"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600 shrink-0 border border-zinc-200/60">
                      <BookOpen className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="font-bold text-zinc-900 text-sm block truncate group-data-[selected=true]:text-blue-700">
                        {guide.title}
                      </span>
                      <span className="text-xs text-zinc-500 font-normal block truncate">
                        {guide.description}
                      </span>
                    </div>
                  </div>

                  <ArrowRight className="size-4 text-blue-600 opacity-0 group-data-[selected=true]:opacity-100 group-data-[selected=true]:translate-x-0.5 transition-all shrink-0 ml-2" />
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>

          {/* Clean Minimal Keyboard Navigation Footer */}
          <div className="flex items-center justify-between border-t border-zinc-100 bg-zinc-50/80 px-4 py-2.5 text-xs text-zinc-500 font-sans">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <kbd className="rounded border border-zinc-200 bg-white px-1.5 py-0.5 text-[10px] font-mono text-zinc-600 font-semibold shadow-2xs">↑↓</kbd>
                <span className="text-[11px]">Navigate</span>
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="rounded border border-zinc-200 bg-white px-1.5 py-0.5 text-[10px] font-mono text-zinc-600 font-semibold shadow-2xs">↵</kbd>
                <span className="text-[11px]">Select</span>
              </span>
            </div>
            <span className="text-[11px] text-zinc-400">ESC to close</span>
          </div>
        </Command>
      </div>
    </div>
  );
}
