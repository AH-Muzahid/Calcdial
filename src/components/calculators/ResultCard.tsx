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
  primaryLabel: string;
  primaryValue: number;
  secondaryLabel: string;
  secondaryValue: number;
  effectiveRateLabel?: string;
  effectiveRatePct?: number;
  breakdown: BreakdownItem[];
  currencySymbol?: string;
  grossRevenue?: number;
}

export function ResultCard({
  primaryLabel,
  primaryValue,
  secondaryLabel,
  secondaryValue,
  effectiveRateLabel = "Effective Fee Rate",
  effectiveRatePct,
  breakdown,
}: ResultCardProps) {
  const isProfitPositive = primaryValue >= 0;

  // Build segments for the GoalGauge
  const segments: GaugeSegment[] = useMemo(() => {
    const list: GaugeSegment[] = [];

    if (primaryValue > 0) {
      list.push({
        label: primaryLabel.includes("Payout") ? "Your Payout" : "Net Profit",
        value: Number(primaryValue.toFixed(2)),
        color: "#10b981", // Emerald
      });
    }

    // Add main deduction items
    breakdown.forEach((item, idx) => {
      if (item.amount > 0) {
        const colors = ["#f59e0b", "#6366f1", "#06b6d4", "#ec4899", "#8b5cf6"];
        list.push({
          label: item.label,
          value: Number(item.amount.toFixed(2)),
          color: colors[idx % colors.length],
        });
      }
    });

    return list;
  }, [primaryValue, primaryLabel, breakdown]);

  const totalSum = useMemo(() => {
    return segments.reduce((acc, curr) => acc + curr.value, 0);
  }, [segments]);

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      {/* Header Metric Row */}
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-3 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
              {primaryLabel}
            </span>
          </div>
          <div
            className={`mt-1.5 text-3xl sm:text-4xl font-extrabold tracking-tight font-mono ${
              isProfitPositive ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {formatCurrency(primaryValue)}
          </div>
        </div>

        <div className="sm:text-right">
          <span className="text-xs font-mono font-medium text-slate-500">{secondaryLabel}</span>
          <div className="text-xl font-bold font-mono text-slate-900">
            {formatCurrency(secondaryValue)}
          </div>
          {effectiveRatePct !== undefined && (
            <div className="mt-1">
              <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-mono font-semibold text-slate-700">
                {effectiveRateLabel}: {formatPercent(effectiveRatePct)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Physical Half-Ring GoalGauge Dial */}
      <div className="my-6 flex justify-center">
        <GoalGauge
          title="Profit & Cost Split"
          subtitle="Hover segments to inspect shares"
          goal={Math.max(totalSum, 0.01)}
          segments={segments}
          currency="USD"
          className="w-full border-0 shadow-none px-0 py-0 dark:bg-transparent"
        />
      </div>

      {/* Itemized Deductions Breakdown */}
      <div className="mt-5 pt-4 border-t border-slate-100">
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-3">
          Itemized Platform Deductions
        </h4>
        <dl className="space-y-2 text-xs sm:text-sm">
          {breakdown.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0 hover:bg-slate-50/60 rounded px-1 -mx-1 transition-colors"
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
