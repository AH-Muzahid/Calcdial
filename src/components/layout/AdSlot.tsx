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

  if (!adsenseId || !slotId) {
    return null;
  }

  return (
    <div
      ref={adRef}
      className={cn(
        "my-6 mx-auto w-full overflow-hidden rounded-xl border border-zinc-200/70 bg-zinc-50/50 p-3 text-center print:hidden transition-all",
        position === "below-calculator" && "min-h-[90px] md:min-h-[130px]",
        position === "in-content" && "min-h-[90px] md:min-h-[130px]",
        position === "sidebar" && "min-h-[180px]",
        className
      )}
      data-ad-slot={position}
      aria-label="Advertisement space"
    >
      <div className="flex h-full w-full items-center justify-center rounded-lg bg-white/70 p-3 border border-zinc-150">
        <ins
          className="adsbygoogle"
          style={{ display: "block", width: "100%", height: "100%" }}
          data-ad-client={adsenseId}
          data-ad-slot={slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}
