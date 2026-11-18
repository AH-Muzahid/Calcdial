"use client";

import { useState } from "react";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { ChevronUp, ChevronDown, X, Check, Copy } from "lucide-react";

interface ItemizedFee {
  label: string;
  amount: number;
}

interface StickyResultBarProps {
  label: string;
  value: number;
  subLabel?: string;
  subValue?: number;
  productCost?: number;
  totalFees?: number;
  payout?: number;
  breakEven?: number;
  currencySymbol?: string;
  itemizedFees?: ItemizedFee[];
}

export function StickyResultBar({
  label,
  value,
  subLabel,
  subValue,
  productCost = 0,
  totalFees = 0,
  payout = 0,
  breakEven = 0,
  currencySymbol = "$",
  itemizedFees = [],
}: StickyResultBarProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const totalSum = Math.max(0.01, productCost + totalFees + Math.max(0, value));
  const costPct = (productCost / totalSum) * 100;
  const feesPct = (totalFees / totalSum) * 100;
  const profitPct = (Math.max(0, value) / totalSum) * 100;

  const handleCopy = () => {
    const text = `${label}: ${currencySymbol}${value.toFixed(2)}${subLabel && subValue !== undefined ? ` (${subLabel}: ${subValue.toFixed(1)}%)` : ""}\nTotal Fees: ${currencySymbol}${totalFees.toFixed(2)}\nProduct Cost: ${currencySymbol}${productCost.toFixed(2)}\nEstimated Payout: ${currencySymbol}${payout.toFixed(2)}\nBreak-Even: ${currencySymbol}${breakEven.toFixed(2)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Backdrop overlay when mobile drawer is open */}
      {isDrawerOpen && (
        <div
          onClick={() => setIsDrawerOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-2xs z-40 lg:hidden animate-in fade-in duration-200"
          aria-hidden="true"
        />
      )}

      {/* Slide-Up Drawer for Mobile Fee Breakdown */}
      {isDrawerOpen && (
        <div
          className="fixed bottom-[60px] left-0 right-0 z-50 max-h-[75vh] overflow-y-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden rounded-t-2xl border-t border-zinc-200 bg-white p-4 shadow-2xl lg:hidden animate-in slide-in-from-bottom duration-200"
          role="dialog"
          aria-modal="true"
          aria-label="Fee Breakdown"
        >
          {/* Drawer Handle & Header */}
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-500" />
              <h4 className="text-sm font-bold text-zinc-950">Calculation Breakdown</h4>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 text-[11px] font-sans font-bold text-zinc-700 hover:text-zinc-950 px-2 py-1 rounded-md bg-zinc-100"
              >
                {copied ? <Check className="size-3 text-emerald-600" /> : <Copy className="size-3" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="p-1 text-zinc-500 hover:text-zinc-950 rounded-md hover:bg-zinc-100 transition-colors"
                aria-label="Close breakdown"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          {/* Primary Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 py-3 border-b border-zinc-100">
            <div>
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
                {label}
              </span>
              <span className="text-2xl font-extrabold font-mono text-emerald-600">
                {currencySymbol}{value.toFixed(2)}
              </span>
            </div>
            {subLabel && subValue !== undefined && (
              <div className="text-right">
                <span className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider block">
                  {subLabel}
                </span>
                <span className="text-2xl font-extrabold font-mono text-zinc-950">
                  {formatPercent(subValue)}
                </span>
              </div>
            )}
          </div>

          {/* Progress Breakdown Bar */}
          <div className="py-3 border-b border-zinc-100 space-y-1.5">
            <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 flex gap-0.5">
              <div style={{ width: `${costPct}%` }} className="bg-blue-600 rounded-l-full" />
              <div style={{ width: `${feesPct}%` }} className="bg-amber-500" />
              <div style={{ width: `${profitPct}%` }} className="bg-emerald-600 rounded-r-full" />
            </div>
            <div className="flex justify-between text-[11px] font-mono pt-1 text-zinc-700">
              <span className="flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-blue-600" /> Cost: {currencySymbol}{productCost.toFixed(2)}
              </span>
              <span className="flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-amber-500" /> Fees: {currencySymbol}{totalFees.toFixed(2)}
              </span>
              <span className="flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-emerald-600" /> Profit: {currencySymbol}{value.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Payout & Floor Price */}
          <div className="py-2.5 space-y-1.5 text-xs font-sans border-b border-zinc-100">
            <div className="flex items-center justify-between">
              <span className="text-zinc-700 font-semibold">Estimated Bank Deposit:</span>
              <span className="font-mono font-bold text-zinc-950">{currencySymbol}{payout.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-700 font-semibold">Break-Even Floor Price:</span>
              <span className="font-mono font-bold text-zinc-950">{currencySymbol}{breakEven.toFixed(2)}</span>
            </div>
          </div>

          {/* Itemized Fee Breakdown */}
          {itemizedFees.length > 0 && (
            <div className="pt-2">
              <span className="text-[11px] font-bold text-zinc-950 block mb-1">Itemized Fees</span>
              <div className="divide-y divide-zinc-100 text-xs font-mono">
                {itemizedFees.map((fee, idx) => (
                  <div key={idx} className="flex justify-between py-1 text-zinc-700">
                    <span>{fee.label}</span>
                    <span className="font-semibold text-zinc-950">{currencySymbol}{fee.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Bottom Sticky Bar */}
      <aside
        aria-label="Mobile summary"
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-200/90 bg-white/95 px-4 py-2.5 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur-md lg:hidden print:hidden"
      >
        <div className="flex items-center justify-between max-w-md mx-auto">
          {/* Tap-able Profit & Margin Trigger */}
          <button
            type="button"
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            className="flex items-center gap-3 text-left cursor-pointer group"
          >
            <div>
              <span className="block text-[10px] font-sans font-bold text-emerald-700 uppercase tracking-wider">
                {label}
              </span>
              <span
                className={`text-xl font-extrabold font-mono tracking-tight ${
                  value > 0 ? "text-emerald-600" : value < 0 ? "text-rose-600" : "text-zinc-950"
                }`}
              >
                {currencySymbol}{value.toFixed(2)}
              </span>
            </div>

            {subLabel && subValue !== undefined && (
              <div className="border-l border-zinc-200 pl-3">
                <span className="block text-[10px] font-sans font-bold text-zinc-500 uppercase tracking-wider">
                  {subLabel}
                </span>
                <span className="text-base font-bold font-mono text-zinc-950">
                  {formatPercent(subValue)}
                </span>
              </div>
            )}
          </button>

          {/* Breakdown Toggle Pill */}
          <button
            type="button"
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            className="inline-flex items-center gap-1 rounded-full bg-zinc-100 hover:bg-zinc-200 px-3 py-1.5 text-xs font-sans font-bold text-zinc-900 transition-colors cursor-pointer"
          >
            <span>{isDrawerOpen ? "Close" : "Breakdown"}</span>
            {isDrawerOpen ? <ChevronDown className="size-3.5 text-zinc-700" /> : <ChevronUp className="size-3.5 text-zinc-700" />}
          </button>
        </div>
      </aside>
    </>
  );
}
