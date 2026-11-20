"use client";

import { trackEvent } from "@/lib/analytics";
import { ArrowRight, Shirt, CreditCard } from "lucide-react";
import { PixelLink } from "@/components/ui/PixelButton";

interface AffiliateCalloutProps {
  partner: string;
  toolSlug: string;
  headline: string;
  description: string;
  ctaText: string;
  url: string;
}

export function AffiliateCallout({
  partner,
  toolSlug,
  headline,
  description,
  ctaText,
  url,
}: AffiliateCalloutProps) {
  const isShopify = partner.toLowerCase() === "shopify";
  const isPrintify = partner.toLowerCase() === "printify";

  return (
    <aside className="my-6 rounded-2xl border border-zinc-200/90 bg-white p-4 sm:p-5 shadow-xs print:hidden font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left Side: Icon + Content */}
        <div className="flex items-start gap-3.5">
          <div className="size-10 rounded-xl bg-zinc-100 border border-zinc-200/80 text-zinc-900 flex items-center justify-center shrink-0">
            {isShopify ? (
              <svg className="size-5 text-emerald-700" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.34 7.62a1 1 0 0 0-.89-.62h-2.73a4.5 4.5 0 0 0-8.44 0H4.55a1 1 0 0 0-.89.62L2.05 18.62A1 1 0 0 0 3.04 20h17.92a1 1 0 0 0 .99-1.38L19.34 7.62zM12 4.5a2.5 2.5 0 0 1 2.45 2h-4.9A2.5 2.5 0 0 1 12 4.5z" />
              </svg>
            ) : isPrintify ? (
              <Shirt className="size-5 text-indigo-600" />
            ) : (
              <CreditCard className="size-5 text-zinc-800" />
            )}
          </div>
          <div className="min-w-0">
            <h4 className="text-sm sm:text-base font-bold text-zinc-950 tracking-tight">
              {headline}
            </h4>
            <p className="mt-1 text-xs sm:text-sm text-zinc-600 leading-normal max-w-xl font-normal">
              {description}
            </p>
          </div>
        </div>

        {/* Right Side: Pixel Button CTA with comfortable breathing room */}
        <div className="w-full sm:w-auto shrink-0 self-stretch sm:self-center pt-2 sm:pt-0">
          <PixelLink
            href={url}
            target="_blank"
            rel="sponsored noopener noreferrer"
            onClick={() =>
              trackEvent({
                name: "affiliate_clicked",
                params: { tool_slug: toolSlug, partner, url },
              })
            }
            className="w-full sm:w-auto h-11 px-6 gap-2.5 text-xs sm:text-sm font-bold rounded-xl inline-flex items-center justify-center shadow-xs"
          >
            <span>{ctaText}</span>
            <ArrowRight className="size-4 shrink-0 transition-transform duration-150 group-hover/pixel:translate-x-0.5" />
          </PixelLink>
        </div>
      </div>
    </aside>
  );
}
