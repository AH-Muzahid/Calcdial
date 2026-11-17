import Link from "next/link";
import { CalcDialLogo } from "./CalcDialLogo";
import { ShimmerText } from "@/components/motion/shimmer-text";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-black/[0.06] bg-white/80 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <CalcDialLogo />

        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/#tools"
            className="rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-medium text-zinc-600 transition-colors hover:bg-black/[0.04] hover:text-black"
          >
            Calculators
          </Link>
          <Link
            href="/#guides"
            className="rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-medium text-zinc-600 transition-colors hover:bg-black/[0.04] hover:text-black"
          >
            Seller Guides
          </Link>
          <Link
            href="/about"
            prefetch={false}
            className="hidden sm:inline-block rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-medium text-zinc-600 transition-colors hover:bg-black/[0.04] hover:text-black"
          >
            About
          </Link>
          <div className="hidden md:flex items-center gap-1.5 pl-3 border-l border-black/[0.08] text-xs font-mono text-zinc-900 bg-black/[0.03] px-3 py-1 rounded-full border border-black/[0.06]">
            <span className="size-1.5 rounded-full bg-black" />
            <ShimmerText text="2026 RATES" className="text-[11px] font-semibold tracking-wider" />
          </div>
          <Link
            href="/#tools"
            className="ml-2 inline-flex items-center gap-1.5 rounded-full bg-black px-4 py-2 text-xs sm:text-sm font-medium text-white shadow-xs transition-all hover:bg-zinc-800 hover:shadow-sm"
          >
            <span>Launch Tool</span>
            <span className="text-zinc-400 font-mono">→</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
