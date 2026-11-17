"use client";

import { useMemo } from "react";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { GoalGauge, GaugeSegment } from "@/components/motion/goal-gauge";

interface BreakdownItem {
  label: string;
  amount: number;
  rate?: string;
}

interface ResultCardProps {
  primaryLabel: string; // "Real Net Profit"
  primaryValue: number;
  secondaryLabel?: string; // "Total Deductions & Costs"
  secondaryValue?: number;
  payoutLabel?: string; // "Bank Deposit / Payout"
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
  const isProfitPositive = primaryValue > 0;
  const isBreakEven = primaryValue === 0;

  // Build segments for the GoalGauge
  const segments: GaugeSegment[] = useMemo(() => {
    const list: GaugeSegment[] = [];

    if (primaryValue > 0) {
      list.push({
        label: "Your Net Profit",
        value: Number(primaryValue.toFixed(2)),
        color: "#10b981", // Emerald
      });
    }

    breakdown.forEach((item, idx) => {
      if (item.amount > 0) {
        const colors = ["#f59e0b", "#6366f1", "#06b6d4", "#ec4899", "#8b5cf6", "#64748b"];
        list.push({
          label: item.label,
          value: Number(item.amount.toFixed(2)),
          color: colors[idx % colors.length],
        });
      }
    });

    return list;
  }, [primaryValue, breakdown]);

  const totalSum = useMemo(() => {
    return segments.reduce((acc, curr) => acc + curr.value, 0);
  }, [segments]);

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      {/* Primary KPI Header */}
      <div className="border-b border-slate-100 pb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`size-2 rounded-full ${
                isProfitPositive ? "bg-emerald-500 animate-pulse" : isBreakEven ? "bg-amber-500" : "bg-rose-500"
              }`}
            />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
              {primaryLabel}
            </span>
          </div>

          {marginPct !== undefined && (
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-mono font-bold ${
                marginPct >= 25
                  ? "bg-emerald-100 text-emerald-800"
                  : marginPct > 0
                  ? "bg-amber-100 text-amber-800"
                  : "bg-rose-100 text-rose-800"
              }`}
            >
              {formatPercent(marginPct)} Margin
            </span>
          )}
        </div>

        <div className="mt-2 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
          <div
            className={`text-3xl sm:text-4xl font-extrabold tracking-tight font-mono ${
              isProfitPositive ? "text-emerald-600" : isBreakEven ? "text-slate-800" : "text-rose-600"
            }`}
          >
            {formatCurrency(primaryValue)}
          </div>

          {payoutValue !== undefined && (
            <div className="sm:text-right">
              <span className="text-xs font-mono text-slate-400">{payoutLabel}:</span>
              <span className="ml-1.5 text-base font-bold font-mono text-slate-800">
                {formatCurrency(payoutValue)}
              </span>
            </div>
          )}
        </div>

        {/* Secondary Stats Strip: ROI & Total Deductions */}
        <div className="mt-3 flex flex-wrap items-center gap-2 pt-3 border-t border-slate-50 text-xs font-mono text-slate-500">
          <span>{secondaryLabel}: <strong className="text-slate-700">{formatCurrency(secondaryValue)}</strong></span>
          {roiPct !== undefined && roiPct > 0 && (
            <>
              <span>•</span>
              <span>ROI: <strong className="text-emerald-700">{formatPercent(roiPct)}</strong></span>
            </>
          )}
        </div>
      </div>

      {/* Break-Even / Floor Price Callout Box (Competitor Killer Feature) */}
      {breakEvenPrice !== undefined && breakEvenPrice > 0 && (
        <div className="my-5 rounded-2xl border border-amber-200/80 bg-amber-50/60 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-amber-800 text-xs font-mono font-bold uppercase tracking-wider">
                <svg className="size-4 shrink-0 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>Break-Even Floor Price</span>
              </div>
              <p className="mt-1 text-xs text-amber-900 leading-relaxed">
                To cover your item COGS, shipping postage, and all Etsy fees, your minimum selling price is:
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-lg sm:text-xl font-bold font-mono text-amber-950">
                {formatCurrency(breakEvenPrice)}
              </span>
              <span className="block text-[10px] font-mono text-amber-700">Min to not lose $</span>
            </div>
          </div>
        </div>
      )}

      {/* Target Margin Price Recommendation (if enabled) */}
      {targetPriceForMargin !== undefined && targetPriceForMargin > 0 && (
        <div className="my-4 rounded-2xl border border-emerald-200/80 bg-emerald-50/70 p-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800">
                Recommended Price
              </span>
              <p className="text-xs text-emerald-900 mt-0.5">
                Listing price to hit your target margin
              </p>
            </div>
            <span className="text-xl font-bold font-mono text-emerald-950">
              {formatCurrency(targetPriceForMargin)}
            </span>
          </div>
        </div>
      )}

      {/* Physical Half-Ring GoalGauge Dial */}
      <div className="my-5 flex justify-center">
        <GoalGauge
          title="Profit vs. Expenses Split"
          subtitle="Hover segments to inspect shares"
          goal={Math.max(totalSum, 0.01)}
          segments={segments}
          currency="USD"
          className="w-full border-0 shadow-none px-0 py-0 dark:bg-transparent"
        />
      </div>

      {/* Itemized Deductions & Costs Table */}
      <div className="mt-5 pt-4 border-t border-slate-100">
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-3">
          Transparent Fee & Cost Breakdown
        </h4>
        <dl className="space-y-2 text-xs sm:text-sm">
          {breakdown.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0 hover:bg-slate-50/70 rounded px-1.5 -mx-1.5 transition-colors"
            >
              <dt className="flex items-center gap-2 text-slate-600 font-medium">
                <span>{item.label}</span>
                {item.rate && (
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-mono text-slate-600">
                    {item.rate}
                  </span>
                )}
              </dt>
              <dd className="font-mono font-semibold text-slate-900">
                {formatCurrency(item.amount)}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
