import React from "react";

interface ToolIconProps {
  slug: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function ToolIcon({ slug, className = "", size = "md" }: ToolIconProps) {
  const sizeClasses = {
    sm: "size-8 rounded-lg text-sm",
    md: "size-11 rounded-xl text-base",
    lg: "size-14 rounded-2xl text-xl",
  }[size];

  switch (slug) {
    case "etsy-fee-calculator":
    case "etsy":
      return (
        <div
          className={`flex items-center justify-center font-bold font-serif text-white shadow-xs shrink-0 bg-[#F1641E] rounded-xl ${sizeClasses} ${className}`}
          aria-label="Etsy"
        >
          <span className="font-serif font-black text-2xl sm:text-3xl leading-none">E</span>
        </div>
      );

    case "shopify-profit-calculator":
    case "shopify":
      return (
        <div
          className={`flex items-center justify-center font-bold text-white shadow-xs shrink-0 bg-[#008060] ${sizeClasses} ${className}`}
          aria-label="Shopify"
        >
          <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20" />
            <path d="m17 5-5-3-5 3v14l5 3 5-3z" />
          </svg>
        </div>
      );

    case "tiktok-shop-fee-calculator":
    case "tiktok":
      return (
        <div
          className={`flex items-center justify-center font-bold text-white shadow-xs shrink-0 bg-zinc-950 border border-zinc-800 ${sizeClasses} ${className}`}
          aria-label="TikTok Shop"
        >
          <svg className="size-5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
          </svg>
        </div>
      );

    case "pod-profit-calculator":
    case "pod":
      return (
        <div
          className={`flex items-center justify-center font-bold text-white shadow-xs shrink-0 bg-[#4f46e5] ${sizeClasses} ${className}`}
          aria-label="Print on Demand"
        >
          <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
          </svg>
        </div>
      );

    case "etsy-vs-shopify-vs-tiktok-shop-calculator":
    case "comparison":
      return (
        <div
          className={`flex items-center justify-center font-bold text-white shadow-xs shrink-0 bg-[#7c3aed] ${sizeClasses} ${className}`}
          aria-label="Marketplace Comparison"
        >
          <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
            <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
            <path d="M7 21h10" />
            <path d="M12 3v18" />
            <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
          </svg>
        </div>
      );

    case "stripe-vs-paypal-fee-calculator":
    case "payment":
    default:
      return (
        <div
          className={`flex items-center justify-center font-bold text-white shadow-xs shrink-0 bg-[#2563eb] ${sizeClasses} ${className}`}
          aria-label="Payment Processor"
        >
          <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <line x1="2" x2="22" y1="10" y2="10" />
          </svg>
        </div>
      );
  }
}
