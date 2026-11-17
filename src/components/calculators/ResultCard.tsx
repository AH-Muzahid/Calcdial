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
        color: "#09090b", // Deep black
      });
    }

    const neutralPalette = ["#52525b", "#71717a", "#a1a1aa", "#d4d4d8", "#27272a", "#3f3f46"];
    breakdown.forEach((item, idx) => {
      if (item.amount > 0) {
        list.push({
          label: item.label,
          value: Number(item.amount.toFixed(2)),
          color: neutralPalette[idx % neutralPalette.length],
        });
      }
    });

    return list;
  }, [primaryValue, breakdown]);

  const totalSum = useMemo(() => {
    return segments.reduce((acc, curr) => acc + curr.value, 0);
  }, [segments]);

  return (
    <div className="rounded-3xl border border-zinc-200/90 bg-white p-6 sm:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
      {/* Primary KPI Header */}
      <div className="border-b border-zinc-100 pb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`size-2 rounded-full ${
                isProfitPositive ? "bg-zinc-950" : isBreakEven ? "bg-zinc-400" : "bg-rose-500"
              }`}
            />
            <span className="text-xs font-mono font-medium uppercase tracking-wider text-zinc-500">
              {primaryLabel}
            </span>
          </div>

          {marginPct !== undefined && (
            <span className="rounded-full border border-zinc-200 bg-zinc-100 px-2.5 py-0.5 text-xs font-mono font-semibold text-zinc-900">
              {formatPercent(marginPct)} Margin
            </span>
          )}
        </div>

        <div className="mt-2 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
          <div
            className={`text-3xl sm:text-4xl font-extrabold tracking-tight font-mono ${
              isProfitPositive ? "text-zinc-950" : isBreakEven ? "text-zinc-700" : "text-rose-600"
            }`}
          >
            {formatCurrency(primaryValue)}
          </div>

          {payoutValue !== undefined && (
            <div className="sm:text-right">
              <span className="text-xs font-mono text-zinc-400">{payoutLabel}:</span>
              <span className="ml-1.5 text-base font-bold font-mono text-zinc-950">
                {formatCurrency(payoutValue)}
              </span>
            </div>
          )}
        </div>

        {/* Secondary Stats Strip: ROI & Total Deductions */}
        <div className="mt-3 flex flex-wrap items-center gap-2 pt-3 border-t border-zinc-100 text-xs font-mono text-zinc-500">
          <span>{secondaryLabel}: <strong className="text-zinc-950">{formatCurrency(secondaryValue)}</strong></span>
          {roiPct !== undefined && roiPct > 0 && (
            <>
              <span>•</span>
              <span>ROI: <strong className="text-zinc-950">{formatPercent(roiPct)}</strong></span>
            </>
          )}
        </div>
      </div>

      {/* Break-Even / Floor Price Callout Box */}
      {breakEvenPrice !== undefined && breakEvenPrice > 0 && (
        <div className="my-5 rounded-2xl border border-zinc-200 bg-zinc-50/70 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-zinc-900 text-xs font-mono font-bold uppercase tracking-wider">
                <span className="size-1.5 rounded-full bg-zinc-950" />
                <span>Break-Even Floor Price</span>
              </div>
              <p className="mt-1 text-xs text-zinc-600 leading-relaxed">
                To cover item COGS, fulfillment shipping, and platform commissions, minimum price is:
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-lg sm:text-xl font-bold font-mono text-zinc-950">
                {formatCurrency(breakEvenPrice)}
              </span>
              <span className="block text-[10px] font-mono text-zinc-400">Min to not lose $</span>
            </div>
          </div>
        </div>
      )}

      {/* Target Margin Price Recommendation */}
      {targetPriceForMargin !== undefined && targetPriceForMargin > 0 && (
        <div className="my-4 rounded-2xl border border-zinc-200 bg-zinc-50/70 p-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-900">
                Recommended Price
              </span>
              <p className="text-xs text-zinc-500 mt-0.5">
                Listing price to hit your target margin
              </p>
            </div>
            <span className="text-xl font-bold font-mono text-zinc-950">
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
          className="w-full border-0 shadow-none px-0 py-0 bg-transparent"
        />
      </div>

      {/* Itemized Deductions & Costs Table */}
      <div className="mt-5 pt-4 border-t border-zinc-100">
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 mb-3">
          Transparent Fee & Cost Breakdown
        </h4>
        <dl className="space-y-2 text-xs sm:text-sm">
          {breakdown.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-1.5 border-b border-zinc-100 last:border-0 hover:bg-zinc-50/80 rounded px-2 -mx-2 transition-colors"
            >
              <dt className="flex items-center gap-2 text-zinc-600 font-medium">
                <span>{item.label}</span>
                {item.rate && (
                  <span className="rounded-full bg-zinc-100 border border-zinc-200/60 px-2 py-0.5 text-[10px] font-mono text-zinc-800">
                    {item.rate}
                  </span>
                )}
              </dt>
              <dd className="font-mono font-semibold text-zinc-950">
                {formatCurrency(item.amount)}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
