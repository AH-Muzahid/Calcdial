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
    <aside className="my-6 rounded-3xl border border-black/[0.08] bg-black/[0.02] p-6 shadow-xs print:hidden">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-mono font-medium tracking-wide uppercase text-black">
          Partner Recommendation
        </span>
        <span className="text-[10px] font-mono text-zinc-400">Sponsored</span>
      </div>
      <h4 className="mt-1.5 text-base font-bold text-black">{headline}</h4>
      <p className="mt-1 text-sm text-zinc-500 leading-relaxed">{description}</p>
      <div className="mt-4">
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
          className="inline-flex items-center gap-1.5 rounded-full bg-black px-4 py-2 text-xs font-mono font-semibold text-white shadow-xs transition hover:bg-zinc-800 cursor-pointer"
        >
          {ctaText}
          <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
    </aside>
  );
}
