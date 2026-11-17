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
      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-xs transition hover:bg-gray-50 focus:outline-hidden print:hidden"
    >
      <svg className="h-3.5 w-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
      </svg>
      Print / PDF
    </button>
  );
}
