import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
        "relative isolate flex flex-col justify-between rounded-xl border border-zinc-200/80 bg-white p-4 sm:p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)] font-sans",
        className
      )}
    >
      <div>
        {/* Header: Platform Brand + Rate Badge */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="shrink-0">
              {icon}
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-base text-zinc-950 leading-tight truncate">
                {platform}
              </h3>
              <span className="text-xs text-zinc-500 font-medium block truncate mt-0.5">
                {trapTitle}
              </span>
            </div>
          </div>

          {/* Semantic Rate Pill */}
          <span className="rounded-lg bg-amber-50 border border-amber-200/80 px-2 py-1 text-xs font-mono font-semibold text-amber-800 shrink-0">
            {badge}
          </span>
        </div>

        {/* Compact Description */}
        <p className="text-sm text-zinc-600 leading-relaxed font-normal">
          {description}
        </p>
      </div>

      {/* Bottom Link */}
      <div className="mt-4">
        <Link
          href={href}
          prefetch={false}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#2b5cfd] hover:text-[#2554f6] transition-colors group/link"
        >
          <span>{actionText}</span>
          <ArrowRight className="size-4 transition-transform duration-200 group-hover/link:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
