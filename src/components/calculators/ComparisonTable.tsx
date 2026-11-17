import { PlatformResult } from "@/lib/formulas/platform-comparison";
import { formatCurrency, formatPercent } from "@/lib/utils";

export function ComparisonTable({ results }: { results: PlatformResult[] }) {
  const sorted = [...results].sort((a, b) => b.netProfit - a.netProfit);
  const highestProfit = sorted[0]?.netProfit ?? 0;

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-xs">
      <table className="w-full text-left text-xs sm:text-sm">
        <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider text-[11px]">
          <tr>
            <th className="py-3 px-4 font-semibold">Platform</th>
            <th className="py-3 px-4 font-semibold">Gross Order</th>
            <th className="py-3 px-4 font-semibold">Platform Fees</th>
            <th className="py-3 px-4 font-semibold">Net Payout</th>
            <th className="py-3 px-4 font-semibold text-emerald-600">Net Profit</th>
            <th className="py-3 px-4 font-semibold">Net Margin</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {results.map((res) => {
            const isWinner = res.netProfit === highestProfit && res.netProfit > 0;
            return (
              <tr key={res.platform} className={isWinner ? "bg-emerald-50/50 font-medium" : ""}>
                <td className="py-3.5 px-4 font-bold text-gray-900 flex items-center gap-2">
                  <span>{res.platform}</span>
                  {isWinner && (
                    <span className="rounded bg-emerald-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                      Winner
                    </span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-gray-700">{formatCurrency(res.grossRevenue)}</td>
                <td className="py-3.5 px-4 text-rose-600 font-semibold">
                  {formatCurrency(res.totalPlatformFees)} ({formatPercent(res.effectiveFeePct)})
                </td>
                <td className="py-3.5 px-4 text-gray-800 font-medium">{formatCurrency(res.netPayout)}</td>
                <td className={`py-3.5 px-4 font-bold ${res.netProfit >= 0 ? "text-emerald-700" : "text-rose-600"}`}>
                  {formatCurrency(res.netProfit)}
                </td>
                <td className="py-3.5 px-4 text-gray-700">{formatPercent(res.netMarginPct)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
