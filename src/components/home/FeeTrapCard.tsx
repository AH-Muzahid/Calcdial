import React from "react";
import Link from "next/link";
import { ArrowRight, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FeeTrapCardProps {
  platform: string;
  trapTitle: string;
  badge: string;
  description: string;
  href: string;
  actionText: string;
  icon: React.ReactNode;
  className?: string;
}

export function FeeTrapCard({
  platform,
  trapTitle,
  badge,
  description,
  href,
  actionText,
  icon,
  className = "",
}: FeeTrapCardProps) {
  return (
    <div
      className={cn(
        "group relative isolate flex flex-col justify-between rounded-xl border border-zinc-200/80 bg-white p-5 sm:p-5.5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] select-none transform-gpu font-sans",
        "transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
        "hover:-translate-y-1 hover:border-amber-400/50 hover:shadow-[0_14px_34px_-8px_rgba(245,158,11,0.14),0_2px_8px_rgba(0,0,0,0.03)]",
        "before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:bg-[linear-gradient(180deg,rgba(245,158,11,0.025),transparent_40%)] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
        className
      )}
    >
      <div>
        {/* Header: Platform Brand + Rate Badge */}
        <div className="flex items-center justify-between gap-2.5 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105">
              {icon}
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-[15px] text-zinc-950 leading-tight truncate">
                {platform}
              </h3>
              <span className="text-[11px] text-amber-700 font-semibold flex items-center gap-1 mt-0.5">
                <AlertTriangle className="size-3 text-amber-500 shrink-0" />
                <span className="truncate">{trapTitle}</span>
              </span>
            </div>
          </div>

          {/* Clean, High-Contrast Monospace Rate Badge */}
          <span className="rounded-lg bg-amber-50 border border-amber-200/80 px-2.5 py-1 text-[11px] font-mono font-bold text-amber-800 shrink-0">
            {badge}
          </span>
        </div>

        {/* Compact, High-Legibility Description */}
        <p className="text-xs sm:text-[13px] text-zinc-600 leading-relaxed font-normal mt-1">
          {description}
        </p>
      </div>

      {/* Clean Bottom Link with Divider & Sliding Arrow */}
      <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
        <Link
          href={href}
          prefetch={false}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-700 group-hover:text-amber-800 transition-colors group/link"
        >
          <span>{actionText}</span>
          <ArrowRight className="size-3.5 text-amber-600 transition-transform duration-200 group-hover/link:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
