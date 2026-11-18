"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface AdSlotProps {
  position: "below-calculator" | "in-content" | "sidebar";
  slotId?: string;
  className?: string;
}

export function AdSlot({ position, slotId, className }: AdSlotProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  useEffect(() => {
    if (adsenseId && slotId && typeof window !== "undefined") {
      try {
        const win = window as unknown as Window & { adsbygoogle?: unknown[] };
        win.adsbygoogle = win.adsbygoogle || [];
        win.adsbygoogle.push({});
      } catch (err) {
        console.error("AdSense push error:", err);
      }
    }
  }, [adsenseId, slotId]);

  return (
    <div
      ref={adRef}
      className={cn(
        "my-8 mx-auto w-full overflow-hidden rounded-2xl border border-dashed border-zinc-200/90 bg-[#FBFBFC] p-4 text-center print:hidden transition-all",
        position === "below-calculator" && "min-h-[140px] md:min-h-[260px]",
        position === "in-content" && "min-h-[140px] md:min-h-[260px]",
        position === "sidebar" && "min-h-[260px]",
        className
      )}
      data-ad-slot={position}
      aria-label="Advertisement space"
    >
      <div className="flex h-full min-h-[100px] md:min-h-[220px] w-full items-center justify-center rounded-xl bg-white/60">
        {adsenseId && slotId ? (
          <ins
            className="adsbygoogle"
            style={{ display: "block", width: "100%", height: "100%" }}
            data-ad-client={adsenseId}
            data-ad-slot={slotId}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="flex items-center gap-1.5 text-zinc-600 mb-1">
              <svg className="size-4 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
              <span className="text-xs font-semibold text-zinc-700 tracking-tight">Advertisement</span>
            </div>
            <p className="text-xs text-zinc-400 font-sans">
              {position === "sidebar"
                ? "Ad space (300 x 250) - Google AdSense / Mediavine"
                : "Ad space (728 x 250) - Google AdSense / Mediavine"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
