import Link from "next/link";
import { CalcDialLogo } from "./CalcDialLogo";
import { ShimmerText } from "@/components/motion/shimmer-text";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-white/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <CalcDialLogo />

        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/#tools"
            className="hidden sm:inline-block rounded-full px-3 py-1.5 text-xs sm:text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-950"
          >
            Calculators
          </Link>
          <Link
            href="/#guides"
            className="hidden md:inline-block rounded-full px-3 py-1.5 text-xs sm:text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-950"
          >
            Seller Guides
          </Link>
          <Link
            href="/about"
            prefetch={false}
            className="hidden lg:inline-block rounded-full px-3 py-1.5 text-xs sm:text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-950"
          >
            About
          </Link>
          <div className="hidden lg:flex items-center gap-1.5 pl-3 border-l border-zinc-200 text-xs font-mono text-zinc-900 bg-zinc-50 px-3 py-1 rounded-full border">
            <span className="size-1.5 rounded-full bg-zinc-950" />
            <ShimmerText text="2026 RATES" className="text-[11px] font-semibold tracking-wider text-zinc-900" />
          </div>
          <Link
            href="/#tools"
            className="inline-flex items-center gap-1.5 rounded-full bg-zinc-950 px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white shadow-xs transition-all hover:bg-zinc-800 hover:shadow-sm whitespace-nowrap shrink-0"
          >
            <span>All Tools</span>
            <span className="text-zinc-400 font-mono">→</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
