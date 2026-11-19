import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-2 text-xs font-sans text-zinc-700 font-semibold print:hidden overflow-x-auto no-scrollbar whitespace-nowrap">
      <ol className="flex items-center space-x-2">
        <li className="shrink-0">
          <Link href="/" prefetch={false} className="hover:text-zinc-950 transition-colors">
            Home
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center space-x-2 shrink-0">
            <span className="text-zinc-500 select-none">&gt;</span>
            {item.href ? (
              <Link href={item.href} prefetch={false} className="hover:text-zinc-950 transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-zinc-950 font-bold truncate max-w-[200px] sm:max-w-none">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
