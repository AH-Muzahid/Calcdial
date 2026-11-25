import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

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
      prefetch={false}
      className={cn(
        "group relative isolate flex items-center justify-between overflow-hidden rounded-xl border border-zinc-200/80 bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] select-none transform-gpu",
        "transition-all duration-200 ease-out",
        "hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]",
        "active:translate-y-0",
        className
      )}
    >
      <div className="flex items-center gap-4 min-w-0 pr-2">
        {/* Platform Icon Badge */}
        <div className="shrink-0">
          {icon}
        </div>

        {/* Text Details */}
        <div className="flex flex-col min-w-0">
          <span className="font-semibold text-base tracking-tight text-zinc-950 group-hover:text-[#2b5cfd] transition-colors duration-150 leading-snug truncate">
            {title}
          </span>
          <p className="text-xs text-zinc-500 font-normal leading-normal mt-0.5 truncate">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right Action Arrow */}
      <div className="shrink-0 pl-2">
        <span className="flex size-8 items-center justify-center rounded-lg bg-zinc-100 group-hover:bg-[#2b5cfd]/10 text-zinc-400 group-hover:text-[#2b5cfd] transition-colors duration-150">
          <ArrowRight className="size-4 stroke-[2.2] transition-transform duration-150 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
