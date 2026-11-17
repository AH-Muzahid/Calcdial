"use client";

import { useState, useMemo } from "react";
import { formatCurrency, formatPercent } from "@/lib/utils";

export interface BreakdownItem {
  label: string;
  amount: number;
  rate?: string;
}

export interface ResultCardProps {
  primaryLabel: string;
  primaryValue: number;
  secondaryLabel?: string;
  secondaryValue?: number;
  payoutLabel?: string;
  payoutValue?: number;
  breakEvenPrice?: number;
  targetPriceForMargin?: number;
  effectiveRateLabel?: string;
  effectiveRatePct?: number;
  marginPct?: number;
  roiPct?: number;
  breakdown: BreakdownItem[];
  currencySymbol?: string;
}

export function ResultCard({
  primaryLabel,
  primaryValue,
  secondaryLabel = "Total Deductions",
  secondaryValue = 0,
  payoutLabel = "Bank Payout",
  payoutValue,
  breakEvenPrice,
  targetPriceForMargin,
  marginPct,
  roiPct,
  breakdown,
}: ResultCardProps) {
  const [copied, setCopied] = useState(false);

  const isProfitPositive = primaryValue > 0;
  const isBreakEven = primaryValue === 0;

  // Split deductions into Product Costs (COGS/postage) and Platform/Payment Fees
  const { cogsTotal, feesTotal } = useMemo(() => {
    let cogs = 0;
    let fees = 0;
    breakdown.forEach((item) => {
      const l = item.label.toLowerCase();
      if (l.includes("cogs") || l.includes("cost") || l.includes("postage") || l.includes("shipping cost")) {
        cogs += item.amount;
      } else {
        fees += item.amount;
      }
    });
    return { cogsTotal: cogs, feesTotal: fees };
  }, [breakdown]);

  // Total gross representation for the horizontal split bar
  const grossSum = useMemo(() => {
    const sum = Math.max(0, primaryValue) + cogsTotal + feesTotal;
    return sum > 0 ? sum : 1;
  }, [primaryValue, cogsTotal, feesTotal]);

  const profitBarPct = primaryValue > 0 ? (primaryValue / grossSum) * 100 : 0;
  const cogsBarPct = (cogsTotal / grossSum) * 100;
  const feesBarPct = (feesTotal / grossSum) * 100;

  const handleCopy = () => {
    const lines = [
      `=== CalcDial Calculation Summary ===`,
      `${primaryLabel}: ${formatCurrency(primaryValue)}${marginPct !== undefined ? ` (${formatPercent(marginPct)} margin)` : ""}`,
      payoutValue !== undefined ? `${payoutLabel}: ${formatCurrency(payoutValue)}` : null,
      `${secondaryLabel}: ${formatCurrency(secondaryValue)}`,
      breakEvenPrice !== undefined ? `Break-Even Price: ${formatCurrency(breakEvenPrice)}` : null,
      targetPriceForMargin !== undefined ? `Target Margin Price: ${formatCurrency(targetPriceForMargin)}` : null,
      roiPct !== undefined && roiPct > 0 ? `ROI: ${formatPercent(roiPct)}` : null,
      `--- Breakdown ---`,
      ...breakdown.map((item) => `${item.label}${item.rate ? ` (${item.rate})` : ""}: ${formatCurrency(item.amount)}`),
      `Verified on CalcDial: ${typeof window !== "undefined" ? window.location.href : "https://calcdial.com"}`,
    ].filter(Boolean);

    navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="sticky top-20 rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-xs">
      {/* Top Bar: Primary Result & Status */}
      <div className="border-b border-zinc-100 pb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`size-2 rounded-full ${
                isProfitPositive ? "bg-emerald-600" : isBreakEven ? "bg-zinc-400" : "bg-rose-500"
              }`}
            />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">
              {primaryLabel}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {marginPct !== undefined && (
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-mono font-bold ${
                  isProfitPositive
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-zinc-100 text-zinc-700 border border-zinc-200"
                }`}
              >
                {formatPercent(marginPct)} Margin
              </span>
            )}
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1 rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[11px] font-mono font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 transition-colors"
              title="Copy calculation summary"
            >
              {copied ? (
                <>
                  <span className="text-emerald-600">✓</span>
                  <span className="text-emerald-700 font-semibold">Copied</span>
                </>
              ) : (
                <>
                  <span>📋</span>
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Big Number KPI Display */}
        <div className="mt-3 flex items-baseline justify-between gap-3">
          <div
            className={`text-3xl sm:text-4xl font-extrabold tracking-tight font-mono ${
              isProfitPositive ? "text-zinc-950" : isBreakEven ? "text-zinc-600" : "text-rose-600"
            }`}
          >
            {formatCurrency(primaryValue)}
          </div>

          {payoutValue !== undefined && (
            <div className="text-right">
              <span className="block text-[11px] font-mono text-zinc-400">{payoutLabel}</span>
              <span className="text-base sm:text-lg font-bold font-mono text-zinc-950">
                {formatCurrency(payoutValue)}
              </span>
            </div>
          )}
        </div>

        {/* Secondary KPI Row */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-zinc-100 pt-3 text-xs font-mono">
          <span className="text-zinc-500">
            {secondaryLabel}:{" "}
            <strong className="text-zinc-900 font-semibold">{formatCurrency(secondaryValue)}</strong>
          </span>
          {roiPct !== undefined && roiPct > 0 && (
            <span className="text-zinc-500">
              ROI: <strong className="text-zinc-900 font-semibold">{formatPercent(roiPct)}</strong>
            </span>
          )}
        </div>
      </div>

      {/* Target Margin Price Recommendation (When Active) */}
      {targetPriceForMargin !== undefined && targetPriceForMargin > 0 && (
        <div className="my-4 rounded-xl border border-zinc-200 bg-zinc-50 p-3.5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-900">
                Target Margin Price
              </span>
              <p className="text-xs text-zinc-500 mt-0.5">
                Listing price to hit your desired profit margin
              </p>
            </div>
            <span className="text-lg font-bold font-mono text-zinc-950">
              {formatCurrency(targetPriceForMargin)}
            </span>
          </div>
        </div>
      )}

      {/* Break-Even Floor Price Callout */}
      {breakEvenPrice !== undefined && breakEvenPrice > 0 && (
        <div className="my-4 rounded-xl border border-zinc-200 bg-zinc-50/70 p-3.5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-zinc-900 text-[11px] font-mono font-bold uppercase tracking-wider">
                <span className="size-1.5 rounded-full bg-zinc-950" />
                <span>Break-Even Floor Price</span>
              </div>
              <p className="mt-1 text-xs text-zinc-500 leading-relaxed">
                Minimum selling price to cover COGS, postage, and platform commissions without losing money:
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-base sm:text-lg font-bold font-mono text-zinc-950">
                {formatCurrency(breakEvenPrice)}
              </span>
              <span className="block text-[10px] font-mono text-zinc-400">Min to not lose $</span>
            </div>
          </div>
        </div>
      )}

      {/* Revenue Split Horizontal Stacked Bar */}
      <div className="my-5">
        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 mb-1.5">
          <span className="font-semibold text-zinc-700">Gross Revenue Split</span>
          <span>100% Total</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-100 flex gap-0.5">
          {profitBarPct > 0 && (
            <div
              style={{ width: `${profitBarPct}%` }}
              className="bg-zinc-950 transition-all duration-300"
              title={`Net Profit: ${profitBarPct.toFixed(1)}%`}
            />
          )}
          {cogsBarPct > 0 && (
            <div
              style={{ width: `${cogsBarPct}%` }}
              className="bg-zinc-500 transition-all duration-300"
              title={`Product COGS & Shipping: ${cogsBarPct.toFixed(1)}%`}
            />
          )}
          {feesBarPct > 0 && (
            <div
              style={{ width: `${feesBarPct}%` }}
              className="bg-zinc-300 transition-all duration-300"
              title={`Platform & Payment Fees: ${feesBarPct.toFixed(1)}%`}
            />
          )}
        </div>

        {/* Legend */}
        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-zinc-600">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-zinc-950" />
            <span>Profit ({profitBarPct.toFixed(0)}%)</span>
          </div>
          {cogsBarPct > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-zinc-500" />
              <span>COGS ({cogsBarPct.toFixed(0)}%)</span>
            </div>
          )}
          {feesBarPct > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-zinc-300" />
              <span>Fees ({feesBarPct.toFixed(0)}%)</span>
            </div>
          )}
        </div>
      </div>

      {/* Itemized Fee Breakdown Table (Calculator.net Style) */}
      <div className="mt-5 border-t border-zinc-100 pt-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400">
            Itemized Deductions Table
          </h4>
          <span className="text-[10px] font-mono text-zinc-400">Rate / Amount</span>
        </div>

        <div className="divide-y divide-zinc-100 text-xs font-mono">
          {breakdown.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-2 transition-colors hover:bg-zinc-50 px-1 rounded"
            >
              <div className="flex items-center gap-2">
                <span className="text-zinc-700">{item.label}</span>
                {item.rate && (
                  <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] text-zinc-500">
                    {item.rate}
                  </span>
                )}
              </div>
              <span className="font-semibold text-zinc-950">
                {formatCurrency(item.amount)}
              </span>
            </div>
          ))}

          {/* Table Summary Footer */}
          <div className="flex items-center justify-between pt-2.5 font-bold text-zinc-950">
            <span>Real Net Profit</span>
            <span className={isProfitPositive ? "text-zinc-950" : "text-rose-600"}>
              {formatCurrency(primaryValue)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
