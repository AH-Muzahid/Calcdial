"use client";

import { useState } from "react";
import { Calculator, ChevronUp, ChevronDown } from "lucide-react";

interface FormulaBreakdownProps {
  formulaMarkdown?: string;
  toolTitle?: string;
}

export function FormulaBreakdown({ formulaMarkdown, toolTitle = "Etsy Fee Calculator" }: FormulaBreakdownProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="rounded-xl sm:rounded-2xl border border-zinc-200/90 bg-white shadow-2xs overflow-hidden h-full">
      {/* Header with Accordion Toggle */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3.5 sm:p-4 text-left hover:bg-zinc-50 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <Calculator className="size-4 text-zinc-800" />
          <h3 className="text-sm sm:text-base font-bold text-zinc-950 tracking-tight">
            Formula &amp; Methodology
          </h3>
        </div>
        <div className="text-zinc-500 hover:text-zinc-900">
          {isOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </div>
      </button>

      {/* Accordion Content */}
      {isOpen && (
        <div className="px-3.5 sm:px-4.5 pb-4 pt-0.5 border-t border-zinc-100 space-y-3">
          {/* Formula Line (High-contrast, clean container) */}
          <div className="rounded-lg bg-zinc-50 border border-zinc-200/80 p-2.5 sm:p-3 text-xs sm:text-sm font-mono font-bold text-zinc-950 leading-relaxed text-center sm:text-left">
            <span className="text-emerald-700 font-extrabold">Net Profit</span> = Item Price − (Product Cost + Shipping + Etsy Fees)
          </div>

          {/* Bulleted Fee Explanation (Crisp text color, high contrast) */}
          <ul className="space-y-2 text-xs text-zinc-850 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-zinc-500 font-bold">•</span>
              <span>
                <strong className="text-zinc-950 font-bold">Listing Fee:</strong> $0.20 per item (valid for 4 months or until sold)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-zinc-500 font-bold">•</span>
              <span>
                <strong className="text-zinc-950 font-bold">Transaction Fee:</strong> 6.5% of (item price + buyer shipping)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-zinc-500 font-bold">•</span>
              <span>
                <strong className="text-zinc-950 font-bold">Payment Processing Fee:</strong> 3% + $0.25 (varies by seller bank country)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-zinc-500 font-bold">•</span>
              <span>
                <strong className="text-zinc-950 font-bold">Offsite Ads Fee:</strong> 12–15% of the item price (only if order originates from Etsy Ads)
              </span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
