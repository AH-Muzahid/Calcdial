import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 text-xs font-mono font-medium text-zinc-400 print:hidden">
      <ol className="flex items-center space-x-2">
        <li>
          <Link href="/" className="hover:text-black transition-colors">
            Home
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center space-x-2">
            <span className="text-zinc-300">/</span>
            {item.href ? (
              <Link href={item.href} className="hover:text-black transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-black font-semibold">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
