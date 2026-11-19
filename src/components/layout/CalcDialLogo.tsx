import Link from "next/link";

export function CalcDialLogo({ className = "", isDark = false }: { className?: string; isDark?: boolean }) {
  return (
    <Link href="/" className={`group inline-flex items-center gap-2.5 ${className}`}>
      {/* Blue Square App Icon with Tactile Depth */}
      <div className="flex size-9 items-center justify-center rounded-xl primary-blue-depth text-white transition-transform duration-200 group-hover:scale-105">
        <svg viewBox="0 0 24 24" fill="none" className="size-5" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="18" x="3" y="3" rx="4" />
          <line x1="8" x2="16" y1="8" y2="8" />
          <line x1="8" x2="16" y1="12" y2="12" />
          <line x1="8" x2="11" y1="16" y2="16" />
          <line x1="14" x2="16" y1="16" y2="16" />
        </svg>
      </div>

      <span className={`text-xl font-bold tracking-tight font-sans transition-colors ${isDark ? "text-white" : "text-zinc-950"}`}>
        CalcDial
      </span>
    </Link>
  );
}
