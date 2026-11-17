import { PlatformResult } from "@/lib/formulas/platform-comparison";
import { formatCurrency, formatPercent } from "@/lib/utils";

export function ComparisonTable({
  results,
  showAnnual = false,
}: {
  results: PlatformResult[];
  showAnnual?: boolean;
}) {
  const sorted = [...results].sort((a, b) => b.netProfit - a.netProfit);
  const highestProfit = sorted[0]?.netProfit ?? 0;

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200/90 bg-white shadow-xs">
      <table className="w-full text-left text-xs sm:text-sm">
        <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px]">
          <tr>
            <th className="py-3 px-4 font-semibold">Sales Platform</th>
            <th className="py-3 px-4 font-semibold text-right">
              {showAnnual ? "Annual GMV" : "Gross Order"}
            </th>
            <th className="py-3 px-4 font-semibold text-right text-rose-600">
              {showAnnual ? "Annual Fees" : "Platform Fees"}
            </th>
            <th className="py-3 px-4 font-semibold text-right">
              {showAnnual ? "Annual Payout" : "Bank Payout"}
            </th>
            <th className="py-3 px-4 font-semibold text-right text-emerald-600">
              {showAnnual ? "Annual Net Profit" : "Real Net Profit"}
            </th>
            <th className="py-3 px-4 font-semibold text-right">Net Margin</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {results.map((res) => {
            const isWinner = res.netProfit === highestProfit && res.netProfit > 0;
            const gross = showAnnual ? res.annualProjection.grossRevenue : res.grossRevenue;
            const fees = showAnnual ? res.annualProjection.platformFees : res.totalPlatformFees;
            const payout = showAnnual
              ? res.annualProjection.grossRevenue - res.annualProjection.platformFees
              : res.netPayout;
            const profit = showAnnual ? res.annualProjection.netProfit : res.netProfit;

            return (
              <tr
                key={res.platform}
                className={isWinner ? "bg-emerald-50/40 font-medium" : "hover:bg-slate-50/50"}
              >
                <td className="py-3.5 px-4 font-bold text-slate-900">
                  <div className="flex items-center gap-2">
                    <span>{res.platform}</span>
                    {isWinner && (
                      <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                        Top Margin
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3.5 px-4 text-slate-700 text-right font-mono">
                  {formatCurrency(gross)}
                </td>
                <td className="py-3.5 px-4 text-rose-600 font-semibold text-right font-mono">
                  {formatCurrency(fees)}
                  <span className="text-[11px] font-normal text-rose-500 block">
                    ({formatPercent(res.effectiveFeePct)})
                  </span>
                </td>
                <td className="py-3.5 px-4 text-slate-800 text-right font-mono">
                  {formatCurrency(payout)}
                </td>
                <td
                  className={`py-3.5 px-4 font-bold text-right font-mono text-base ${
                    profit >= 0 ? "text-emerald-700" : "text-rose-600"
                  }`}
                >
                  {formatCurrency(profit)}
                </td>
                <td className="py-3.5 px-4 text-slate-700 text-right font-mono">
                  {formatPercent(res.netMarginPct)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
