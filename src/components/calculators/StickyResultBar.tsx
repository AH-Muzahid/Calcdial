"use client";

import { useState, useEffect } from "react";
import { formatPercent } from "@/lib/utils";
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
  subValueFormat?: "percent" | "currency";
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
  subValueFormat = "percent",
  productCost = 0,
  totalFees = 0,
  payout = 0,
  breakEven = 0,
  currencySymbol = "$",
  itemizedFees = [],
}: StickyResultBarProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Body scroll lock when mobile breakdown drawer is open (CRITIQUE-06)
  useEffect(() => {
    if (!isDrawerOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isDrawerOpen]);

  // Handle Escape key to close drawer
  useEffect(() => {
    if (!isDrawerOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsDrawerOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDrawerOpen]);

  const formatAmount = (num: number): string => {
    const isNegative = num < 0;
    const abs = Math.abs(num);
    const formatted = abs.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return isNegative ? `-${currencySymbol}${formatted}` : `${currencySymbol}${formatted}`;
  };

  const totalSum = Math.max(0.01, productCost + totalFees + Math.max(0, value));
  const costPct = Math.min(100, Math.max(0, (productCost / totalSum) * 100));
  const feesPct = Math.min(100, Math.max(0, (totalFees / totalSum) * 100));
  const profitPct = value > 0 ? Math.min(100, Math.max(0, (value / totalSum) * 100)) : 0;

  const formattedSubValue = subValue !== undefined
    ? subValueFormat === "currency"
      ? `+${currencySymbol}${subValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : formatPercent(subValue)
    : "";

  const handleCopy = () => {
    const text = `${label}: ${formatAmount(value)}${subLabel && subValue !== undefined ? ` (${subLabel}: ${formattedSubValue})` : ""}\nTotal Fees: ${formatAmount(totalFees)}\nProduct Cost: ${formatAmount(productCost)}\nEstimated Payout: ${formatAmount(payout)}\nBreak-Even: ${formatAmount(breakEven)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isLoss = value < 0;

  return (
    <>
      {/* Backdrop overlay when mobile drawer is open */}
      {isDrawerOpen && (
        <div
          onClick={() => setIsDrawerOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-2xs z-40 lg:hidden animate-in fade-in duration-200"
          aria-hidden="true"
        />
      )}

      {/* Slide-Up Drawer for Mobile Fee Breakdown */}
      {isDrawerOpen && (
        <div
          className="fixed bottom-[64px] left-0 right-0 z-50 max-h-[75vh] overflow-y-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden rounded-t-2xl border-t border-zinc-200 bg-white p-4 sm:p-5 shadow-2xl lg:hidden animate-in slide-in-from-bottom duration-200"
          role="dialog"
          aria-modal="true"
          aria-label="Fee Breakdown"
        >
          {/* Drawer Handle & Header */}
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <span className={`size-2.5 rounded-full ${isLoss ? "bg-rose-500" : "bg-emerald-500"}`} />
              <h4 className="text-sm font-bold text-zinc-950">Calculation Breakdown</h4>
              {isLoss && (
                <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700 uppercase">
                  Loss
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="min-h-11 inline-flex items-center gap-1.5 text-xs font-sans font-bold text-zinc-700 hover:text-zinc-950 px-3 py-2 rounded-lg bg-zinc-100 active:bg-zinc-200 transition-colors"
              >
                {copied ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="min-h-11 min-w-11 inline-flex items-center justify-center p-2 text-zinc-500 hover:text-zinc-950 rounded-lg hover:bg-zinc-100 transition-colors"
                aria-label="Close breakdown drawer"
              >
                <X className="size-5" />
              </button>
            </div>
          </div>

          {/* Primary Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 py-3 border-b border-zinc-100">
            <div>
              <span className={`text-[11px] font-bold uppercase tracking-wider block ${isLoss ? "text-rose-700" : "text-emerald-700"}`}>
                {label}
              </span>
              <span className={`text-2xl font-extrabold font-mono tabular-nums ${isLoss ? "text-rose-600" : "text-emerald-600"}`}>
                {formatAmount(value)}
              </span>
            </div>
            {subLabel && subValue !== undefined && (
              <div className="text-right">
                <span className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider block">
                  {subLabel}
                </span>
                <span className={`text-2xl font-extrabold font-mono tabular-nums ${isLoss ? "text-rose-600" : "text-zinc-950"}`}>
                  {formattedSubValue}
                </span>
              </div>
            )}
          </div>

          {/* Progress Breakdown Bar */}
          <div className="py-3 border-b border-zinc-100 space-y-1.5">
            <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 flex gap-0.5">
              <div style={{ width: `${costPct}%` }} className="bg-blue-600 rounded-l-full" />
              <div style={{ width: `${feesPct}%` }} className="bg-amber-500" />
              {profitPct > 0 && (
                <div style={{ width: `${profitPct}%` }} className="bg-emerald-600 rounded-r-full" />
              )}
            </div>
            <div className="flex justify-between text-[11px] font-mono pt-1 text-zinc-700 tabular-nums">
              <span className="flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-blue-600" /> Cost: {formatAmount(productCost)}
              </span>
              <span className="flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-amber-500" /> Fees: {formatAmount(totalFees)}
              </span>
              <span className="flex items-center gap-1">
                <span className={`size-1.5 rounded-full ${isLoss ? "bg-rose-500" : "bg-emerald-600"}`} /> {isLoss ? "Loss" : "Profit"}: {formatAmount(value)}
              </span>
            </div>
          </div>

          {/* Payout & Floor Price */}
          <div className="py-2.5 space-y-1.5 text-xs font-sans border-b border-zinc-100">
            <div className="flex items-center justify-between">
              <span className="text-zinc-700 font-semibold">Estimated Bank Deposit:</span>
              <span className="font-mono font-bold text-zinc-950 tabular-nums">{formatAmount(payout)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-700 font-semibold">Break-Even Floor Price:</span>
              <span className="font-mono font-bold text-zinc-950 tabular-nums">{formatAmount(breakEven)}</span>
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
                    <span className="font-semibold text-zinc-950 tabular-nums">{formatAmount(fee.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Bottom Sticky Bar (>= 44px ergonomics) */}
      <aside
        aria-label="Mobile summary"
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-200/90 bg-white/95 px-4 py-2.5 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur-md lg:hidden print:hidden"
      >
        <div className="flex items-center justify-between max-w-md mx-auto">
          {/* Tap-able Profit & Margin Trigger (min 44px touch target) */}
          <button
            type="button"
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            className="min-h-11 flex items-center gap-3 text-left cursor-pointer group py-1"
            aria-label="Open calculation breakdown drawer"
          >
            <div>
              <span className={`block text-[10px] font-sans font-bold uppercase tracking-wider ${isLoss ? "text-rose-700" : "text-emerald-700"}`}>
                {label}
              </span>
              <span
                className={`text-xl font-extrabold font-mono tracking-tight tabular-nums ${
                  isLoss ? "text-rose-600" : value > 0 ? "text-emerald-600" : "text-zinc-950"
                }`}
              >
                {formatAmount(value)}
              </span>
            </div>

            {subLabel && subValue !== undefined && (
              <div className="border-l border-zinc-200 pl-3">
                <span className="block text-[10px] font-sans font-bold text-zinc-500 uppercase tracking-wider">
                  {subLabel}
                </span>
                <span className={`text-base font-bold font-mono tabular-nums ${isLoss ? "text-rose-600" : "text-zinc-950"}`}>
                  {formattedSubValue}
                </span>
              </div>
            )}
          </button>

          {/* Breakdown Toggle Pill (min-h-11) */}
          <button
            type="button"
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            className="min-h-11 inline-flex items-center gap-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 px-4 py-2 text-xs font-sans font-bold text-zinc-900 transition-colors cursor-pointer"
            aria-expanded={isDrawerOpen}
          >
            <span>{isDrawerOpen ? "Close" : "Breakdown"}</span>
            {isDrawerOpen ? <ChevronDown className="size-4 text-zinc-700" /> : <ChevronUp className="size-4 text-zinc-700" />}
          </button>
        </div>
      </aside>
    </>
  );
}
