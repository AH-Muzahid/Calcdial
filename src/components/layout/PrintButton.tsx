"use client";

import { trackEvent } from "@/lib/analytics";

interface PrintButtonProps {
  toolSlug: string;
}

export function PrintButton({ toolSlug }: PrintButtonProps) {
  const handlePrint = () => {
    trackEvent({
      name: "result_copied",
      params: { tool_slug: toolSlug, method: "print" },
    });
    window.print();
  };

  return (
    <button
      type="button"
      onClick={handlePrint}
      className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white px-3.5 py-1.5 text-xs font-mono font-medium text-black shadow-2xs transition hover:bg-black/[0.03] focus:outline-hidden print:hidden cursor-pointer"
    >
      <svg className="size-3.5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
      </svg>
      Print / PDF
    </button>
  );
}
