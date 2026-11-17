import { formatCurrency, formatPercent } from "@/lib/utils";

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

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-5 sm:p-6 shadow-xs">
      {/* Primary KPI Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 border-b border-gray-200 pb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            {primaryLabel}
          </span>
          <div
            className={`mt-1 text-3xl sm:text-4xl font-extrabold tracking-tight ${
              isProfitPositive ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {formatCurrency(primaryValue)}
          </div>
        </div>
        <div className="sm:text-right">
          <span className="text-xs font-medium text-gray-500">{secondaryLabel}</span>
          <div className="text-xl font-bold text-gray-900">
            {formatCurrency(secondaryValue)}
          </div>
          {effectiveRatePct !== undefined && (
            <span className="text-xs font-medium text-emerald-700">
              {effectiveRateLabel}: {formatPercent(effectiveRatePct)}
            </span>
          )}
        </div>
      </div>

      {/* Itemized Deductions Breakdown */}
      <div className="mt-5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
          Fee & Expense Breakdown
        </h4>
        <dl className="space-y-2 text-xs sm:text-sm">
          {breakdown.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between py-1 border-b border-gray-100 last:border-0">
              <dt className="flex items-center gap-1.5 text-gray-600">
                <span>{item.label}</span>
                {item.rate && (
                  <span className="rounded bg-gray-200/60 px-1.5 py-0.5 text-[10px] font-mono text-gray-600">
                    {item.rate}
                  </span>
                )}
              </dt>
              <dd className="font-semibold text-gray-900">
                {formatCurrency(item.amount)}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
