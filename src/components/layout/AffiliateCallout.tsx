"use client";

import { trackEvent } from "@/lib/analytics";
import { ArrowRight } from "lucide-react";

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
  return (
    <aside className="my-6 rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-2xs print:hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left Side: Icon + Content */}
        <div className="flex items-start gap-3.5">
          <div className="size-10 rounded-lg bg-zinc-100 border border-zinc-200 text-[#008060] flex items-center justify-center shrink-0">
            {/* Shopify Shopping Bag Icon */}
            <svg className="size-5 text-emerald-700" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.34 7.62a1 1 0 0 0-.89-.62h-2.73a4.5 4.5 0 0 0-8.44 0H4.55a1 1 0 0 0-.89.62L2.05 18.62A1 1 0 0 0 3.04 20h17.92a1 1 0 0 0 .99-1.38L19.34 7.62zM12 4.5a2.5 2.5 0 0 1 2.45 2h-4.9A2.5 2.5 0 0 1 12 4.5z" />
            </svg>
          </div>
          <div>
            <h4 className="text-base font-bold text-zinc-950 tracking-tight">
              {headline}
            </h4>
            <p className="mt-0.5 text-xs sm:text-sm text-zinc-800 leading-relaxed max-w-xl font-medium">
              {description}
            </p>
          </div>
        </div>

        {/* Right Side: Partner Badge + CTA Button */}
        <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
          <span className="rounded-md bg-zinc-100 text-zinc-900 border border-zinc-200 px-2.5 py-1 text-xs font-bold">
            Partner
          </span>
          <a
            href={url}
            target="_blank"
            rel="sponsored noopener noreferrer"
            onClick={() =>
              trackEvent({
                name: "affiliate_clicked",
                params: { tool_slug: toolSlug, partner, url },
              })
            }
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-xs transition-colors cursor-pointer"
          >
            <span>{ctaText}</span>
            <ArrowRight className="size-3.5" />
          </a>
        </div>
      </div>
    </aside>
  );
}
