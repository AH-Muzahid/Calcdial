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
    <aside aria-label="Mobile summary" className="fixed bottom-0 left-0 right-0 z-30 border-t border-black/[0.08] bg-white/90 px-5 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.04)] backdrop-blur-md md:hidden print:hidden">
      <div className="flex items-center justify-between">
        <div>
          <span className="block text-[10px] font-mono font-medium uppercase tracking-wider text-zinc-500">
            {label}
          </span>
          <span className={`text-xl font-extrabold font-mono ${value >= 0 ? "text-black" : "text-rose-600"}`}>
            {formatCurrency(value)}
          </span>
        </div>
        {subLabel && subValue !== undefined && (
          <div className="text-right">
            <span className="block text-[10px] font-mono text-zinc-400">{subLabel}</span>
            <span className="text-sm font-bold font-mono text-black">
              {formatPercent(subValue)}
            </span>
          </div>
        )}
      </div>
    </aside>
  );
}
