"use client";

import { trackEvent } from "@/lib/analytics";

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
    <aside className="my-6 rounded-xl border border-emerald-100 bg-emerald-50/60 p-5 shadow-xs transition hover:border-emerald-200 print:hidden">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold tracking-wide uppercase text-emerald-800">
          Partner Recommendation
        </span>
        <span className="text-[10px] text-gray-400">Sponsored</span>
      </div>
      <h4 className="mt-1.5 text-base font-semibold text-gray-900">{headline}</h4>
      <p className="mt-1 text-sm text-gray-600 leading-relaxed">{description}</p>
      <div className="mt-3">
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
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-emerald-700"
        >
          {ctaText}
          <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
    </aside>
  );
}
