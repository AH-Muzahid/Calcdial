import Link from "next/link";
import { CalcDialLogo } from "./CalcDialLogo";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/85 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <CalcDialLogo />

        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/#tools"
            className="rounded-lg px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            Calculators
          </Link>
          <Link
            href="/#guides"
            className="rounded-lg px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            Seller Guides
          </Link>
          <Link
            href="/about"
            className="hidden sm:inline-block rounded-lg px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            About
          </Link>
          <div className="hidden md:flex items-center gap-1.5 pl-3 border-l border-slate-200 text-xs font-mono text-emerald-700 bg-emerald-50/80 px-2.5 py-1 rounded-full border">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>2026 RATES</span>
          </div>
          <Link
            href="/tools/etsy-fee-calculator"
            className="ml-2 inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white shadow-xs transition-all hover:bg-emerald-600 hover:shadow-md"
          >
            <span>Launch Tool</span>
            <span className="text-emerald-400 font-mono">→</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
