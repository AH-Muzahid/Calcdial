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
        color: "#000000", // Monochromatic deep black
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
    <div className="rounded-3xl border border-black/[0.08] bg-white p-6 sm:p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      {/* Primary KPI Header */}
      <div className="border-b border-black/[0.06] pb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`size-2 rounded-full ${
                isProfitPositive ? "bg-black" : isBreakEven ? "bg-zinc-400" : "bg-rose-500"
              }`}
            />
            <span className="text-xs font-mono font-medium uppercase tracking-wider text-zinc-500">
              {primaryLabel}
            </span>
          </div>

          {marginPct !== undefined && (
            <span className="rounded-full border border-black/10 bg-black/[0.03] px-2.5 py-0.5 text-xs font-mono font-semibold text-black">
              {formatPercent(marginPct)} Margin
            </span>
          )}
        </div>

        <div className="mt-2 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
          <div
            className={`text-3xl sm:text-4xl font-extrabold tracking-tight font-mono ${
              isProfitPositive ? "text-black" : isBreakEven ? "text-zinc-700" : "text-rose-600"
            }`}
          >
            {formatCurrency(primaryValue)}
          </div>

          {payoutValue !== undefined && (
            <div className="sm:text-right">
              <span className="text-xs font-mono text-zinc-400">{payoutLabel}:</span>
              <span className="ml-1.5 text-base font-bold font-mono text-black">
                {formatCurrency(payoutValue)}
              </span>
            </div>
          )}
        </div>

        {/* Secondary Stats Strip: ROI & Total Deductions */}
        <div className="mt-3 flex flex-wrap items-center gap-2 pt-3 border-t border-black/[0.04] text-xs font-mono text-zinc-500">
          <span>{secondaryLabel}: <strong className="text-black">{formatCurrency(secondaryValue)}</strong></span>
          {roiPct !== undefined && roiPct > 0 && (
            <>
              <span>•</span>
              <span>ROI: <strong className="text-black">{formatPercent(roiPct)}</strong></span>
            </>
          )}
        </div>
      </div>

      {/* Break-Even / Floor Price Callout Box */}
      {breakEvenPrice !== undefined && breakEvenPrice > 0 && (
        <div className="my-5 rounded-2xl border border-black/[0.08] bg-black/[0.02] p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-black text-xs font-mono font-bold uppercase tracking-wider">
                <span className="size-1.5 rounded-full bg-black" />
                <span>Break-Even Floor Price</span>
              </div>
              <p className="mt-1 text-xs text-zinc-600 leading-relaxed">
                To cover your item COGS, shipping postage, and all platform fees, minimum selling price is:
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-lg sm:text-xl font-bold font-mono text-black">
                {formatCurrency(breakEvenPrice)}
              </span>
              <span className="block text-[10px] font-mono text-zinc-400">Min to not lose $</span>
            </div>
          </div>
        </div>
      )}

      {/* Target Margin Price Recommendation */}
      {targetPriceForMargin !== undefined && targetPriceForMargin > 0 && (
        <div className="my-4 rounded-2xl border border-black/[0.08] bg-black/[0.02] p-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-black">
                Recommended Price
              </span>
              <p className="text-xs text-zinc-500 mt-0.5">
                Listing price to hit your target margin
              </p>
            </div>
            <span className="text-xl font-bold font-mono text-black">
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
      <div className="mt-5 pt-4 border-t border-black/[0.06]">
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 mb-3">
          Transparent Fee & Cost Breakdown
        </h4>
        <dl className="space-y-2 text-xs sm:text-sm">
          {breakdown.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-1.5 border-b border-black/[0.03] last:border-0 hover:bg-black/[0.02] rounded px-1.5 -mx-1.5 transition-colors"
            >
              <dt className="flex items-center gap-2 text-zinc-600 font-medium">
                <span>{item.label}</span>
                {item.rate && (
                  <span className="rounded-full bg-black/[0.04] border border-black/[0.06] px-2 py-0.5 text-[10px] font-mono text-black">
                    {item.rate}
                  </span>
                )}
              </dt>
              <dd className="font-mono font-semibold text-black">
                {formatCurrency(item.amount)}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
