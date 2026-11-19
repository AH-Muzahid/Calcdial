import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
      className={`group relative flex flex-col justify-between rounded-xl border border-zinc-200/80 bg-white p-4 sm:p-4.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:border-zinc-300 hover:shadow-[0_4px_14px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 transition-all duration-150 font-sans ${className}`}
    >
      <div>
        {/* Header: Platform Brand + Rate Badge */}
        <div className="flex items-center justify-between gap-2.5 mb-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="shrink-0">{icon}</div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm text-zinc-950 leading-tight truncate">
                {platform}
              </h3>
              <span className="text-[11px] text-zinc-500 font-medium">
                {trapTitle}
              </span>
            </div>
          </div>

          {/* Clean, Neutral Mono Badge (No loud gradient/colors) */}
          <span className="rounded-md bg-zinc-100 border border-zinc-200/90 px-2 py-0.5 text-[10px] sm:text-[11px] font-mono font-medium text-zinc-700 shrink-0">
            {badge}
          </span>
        </div>

        {/* Compact, 2-line Description */}
        <p className="text-xs sm:text-[13px] text-zinc-600 leading-relaxed font-normal">
          {description}
        </p>
      </div>

      {/* Clean Bottom Link with Divider */}
      <div className="mt-3.5 pt-2.5 border-t border-zinc-100 flex items-center justify-between">
        <Link
          href={href}
          prefetch={false}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors group/link"
        >
          <span>{actionText}</span>
          <ArrowRight className="size-3.5 transition-transform group-hover/link:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
