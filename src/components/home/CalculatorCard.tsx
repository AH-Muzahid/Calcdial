import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface CalculatorCardProps {
  id?: string;
  title: string;
  subtitle: string;
  href: string;
  icon: React.ReactNode;
  className?: string;
}

export function CalculatorCard({
  title,
  subtitle,
  href,
  icon,
  className = "",
}: CalculatorCardProps) {
  return (
    <Link
      href={href}
      className={`group flex items-center justify-between rounded-xl border border-zinc-200/80 bg-white px-4 py-3.5 sm:px-4.5 sm:py-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-all duration-150 hover:border-zinc-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 ${className}`}
    >
      <div className="flex items-center gap-3.5 min-w-0 pr-2">
        {/* Platform Icon */}
        <div className="shrink-0">{icon}</div>

        {/* Text Details */}
        <div className="flex flex-col min-w-0">
          <span className="font-semibold text-[14px] text-zinc-900 group-hover:text-blue-600 transition-colors leading-snug truncate">
            {title}
          </span>
          <p className="text-xs text-zinc-500 font-normal leading-normal mt-0.5 line-clamp-1">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right Chevron Arrow */}
      <div className="text-zinc-300 group-hover:text-zinc-700 transition-colors shrink-0 pl-1">
        <ChevronRight className="size-4 stroke-[1.8]" />
      </div>
    </Link>
  );
}
