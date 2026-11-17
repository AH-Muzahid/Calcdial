import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 font-bold text-white shadow-sm">
            FS
          </span>
          <span className="text-xl font-bold tracking-tight text-gray-900">
            Fee<span className="text-emerald-600">Snap</span>
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link href="/#tools" className="transition hover:text-emerald-600">
            Calculators
          </Link>
          <Link href="/#guides" className="transition hover:text-emerald-600">
            Seller Guides
          </Link>
          <Link href="/about" className="hidden sm:inline transition hover:text-emerald-600">
            About
          </Link>
          <Link
            href="/tools/etsy-fee-calculator"
            className="rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 sm:text-sm"
          >
            Etsy Calculator
          </Link>
        </nav>
      </div>
    </header>
  );
}
