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
    <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-2xs">
      <table className="w-full text-left text-xs sm:text-sm">
        <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase tracking-wider text-[11px] font-mono">
          <tr>
            <th className="py-3 px-4 font-semibold">Sales Platform</th>
            <th className="py-3 px-4 font-semibold text-right">
              {showAnnual ? "Annual GMV" : "Gross Order"}
            </th>
            <th className="py-3 px-4 font-semibold text-right text-zinc-700">
              {showAnnual ? "Annual Fees" : "Platform Fees"}
            </th>
            <th className="py-3 px-4 font-semibold text-right">
              {showAnnual ? "Annual Payout" : "Bank Payout"}
            </th>
            <th className="py-3 px-4 font-semibold text-right text-zinc-950">
              {showAnnual ? "Annual Net Profit" : "Real Net Profit"}
            </th>
            <th className="py-3 px-4 font-semibold text-right">Net Margin</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
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
                className={isWinner ? "bg-zinc-50/80 font-medium" : "hover:bg-zinc-50/50"}
              >
                <td className="py-3.5 px-4 font-bold text-zinc-950">
                  <div className="flex items-center gap-2">
                    <span>{res.platform}</span>
                    {isWinner && (
                      <span className="rounded-full bg-zinc-950 px-2 py-0.5 text-[10px] font-bold font-mono text-white uppercase tracking-wider">
                        Top Margin
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3.5 px-4 text-zinc-700 text-right font-mono">
                  {formatCurrency(gross)}
                </td>
                <td className="py-3.5 px-4 text-zinc-700 font-semibold text-right font-mono">
                  {formatCurrency(fees)}
                  <span className="text-[11px] font-normal text-zinc-400 block">
                    ({formatPercent(res.effectiveFeePct)})
                  </span>
                </td>
                <td className="py-3.5 px-4 text-zinc-800 text-right font-mono">
                  {formatCurrency(payout)}
                </td>
                <td
                  className={`py-3.5 px-4 font-bold text-right font-mono text-base ${
                    profit >= 0 ? "text-zinc-950" : "text-rose-600"
                  }`}
                >
                  {formatCurrency(profit)}
                </td>
                <td className="py-3.5 px-4 text-zinc-700 text-right font-mono">
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
