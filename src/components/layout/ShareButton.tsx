"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/analytics";

interface ShareButtonProps {
  toolSlug: string;
  getFormattedText: () => string;
}

export function ShareButton({ toolSlug, getFormattedText }: ShareButtonProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      trackEvent({
        name: "result_copied",
        params: { tool_slug: toolSlug, method: "url" },
      });
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // fallback
    }
  };

  const copyFormattedSummary = async () => {
    try {
      const text = getFormattedText();
      await navigator.clipboard.writeText(text);
      setCopiedText(true);
      trackEvent({
        name: "result_copied",
        params: { tool_slug: toolSlug, method: "clipboard" },
      });
      setTimeout(() => setCopiedText(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 print:hidden">
      <button
        type="button"
        onClick={copyUrl}
        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-xs transition hover:bg-gray-50 focus:outline-hidden"
      >
        <svg className="h-3.5 w-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        {copiedLink ? "Link Copied!" : "Copy Share Link"}
      </button>

      <button
        type="button"
        onClick={copyFormattedSummary}
        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-xs transition hover:bg-gray-50 focus:outline-hidden"
      >
        <svg className="h-3.5 w-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
        </svg>
        {copiedText ? "Summary Copied!" : "Copy Result Text"}
      </button>
    </div>
  );
}
