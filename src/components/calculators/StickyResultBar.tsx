import { formatCurrency, formatPercent } from "@/lib/utils";

interface StickyResultBarProps {
  label: string;
  value: number;
  subLabel?: string;
  subValue?: number;
}

export function StickyResultBar({
  label,
  value,
  subLabel,
  subValue,
}: StickyResultBarProps) {
  return (
    <aside aria-label="Mobile summary" className="fixed bottom-0 left-0 right-0 z-30 border-t border-gray-200 bg-white/95 px-4 py-2.5 shadow-lg backdrop-blur md:hidden print:hidden">
      <div className="flex items-center justify-between">
        <div>
          <span className="block text-[10px] font-semibold uppercase tracking-wider text-gray-500">
            {label}
          </span>
          <span className={`text-xl font-extrabold ${value >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
            {formatCurrency(value)}
          </span>
        </div>
        {subLabel && subValue !== undefined && (
          <div className="text-right">
            <span className="block text-[10px] text-gray-500">{subLabel}</span>
            <span className="text-sm font-bold text-gray-800">
              {formatPercent(subValue)}
            </span>
          </div>
        )}
      </div>
    </aside>
  );
}
