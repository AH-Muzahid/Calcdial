import Link from "next/link";

export function CalcDialLogo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`group inline-flex items-center gap-2.5 ${className}`}>
      <div className="relative flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 p-1.5 shadow-sm ring-1 ring-slate-950/10 transition-transform duration-200 group-hover:scale-105">
        {/* Precision Dial SVG */}
        <svg viewBox="0 0 32 32" fill="none" className="size-full">
          {/* Outer dial gauge arc */}
          <circle
            cx="16"
            cy="16"
            r="12"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="2"
            strokeDasharray="3 3"
          />
          {/* Active profit arc */}
          <path
            d="M 6 22 A 12 12 0 1 1 24 8"
            stroke="#10b981"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Center pivot */}
          <circle cx="16" cy="16" r="2.5" fill="#ffffff" />
          {/* Dial needle pointing to peak */}
          <line
            x1="16"
            y1="16"
            x2="23"
            y2="9"
            stroke="#10b981"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="flex flex-col">
        <span className="text-lg font-bold tracking-tight text-slate-900 leading-none">
          Calc<span className="text-emerald-600">Dial</span>
        </span>
        <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-slate-400 leading-tight">
          Precision Metrics
        </span>
      </div>
    </Link>
  );
}
