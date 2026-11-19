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
        "group relative isolate flex items-center justify-between overflow-hidden rounded-xl border border-zinc-200/80 bg-white p-4 sm:p-4.5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] select-none transform-gpu",
        "transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
        "hover:-translate-y-1 hover:border-blue-400/50 hover:shadow-[0_14px_34px_-8px_rgba(43,92,253,0.14),0_2px_8px_rgba(0,0,0,0.03)]",
        "active:scale-[0.99] active:translate-y-0",
        "before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:bg-[linear-gradient(180deg,rgba(43,92,253,0.03),transparent_45%)] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
        className
      )}
    >
      <div className="flex items-center gap-3.5 min-w-0 pr-2">
        {/* Platform Icon Badge */}
        <div className="shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110">
          {icon}
        </div>

        {/* Text Details */}
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-[15px] tracking-tight text-zinc-950 group-hover:text-[#2b5cfd] transition-colors duration-200 leading-snug truncate">
            {title}
          </span>
          <p className="text-xs text-zinc-500 font-normal leading-normal mt-0.5 line-clamp-1">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right Action Badge with Smooth Slide */}
      <div className="shrink-0 pl-1">
        <span className="flex size-7 items-center justify-center rounded-lg bg-zinc-100/80 group-hover:bg-[#2b5cfd] text-zinc-400 group-hover:text-white transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:shadow-[0_2px_8px_rgba(43,92,253,0.35)]">
          <ArrowRight className="size-3.5 stroke-[2.2]" />
        </span>
      </div>
    </Link>
  );
}
