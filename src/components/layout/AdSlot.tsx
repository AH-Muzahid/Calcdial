import { cn } from "@/lib/utils";

interface AdSlotProps {
  position: "below-calculator" | "in-content" | "sidebar";
  className?: string;
}

export function AdSlot({ position, className }: AdSlotProps) {
  return (
    <div
      className={cn(
        "my-8 mx-auto w-full max-w-4xl overflow-hidden rounded-2xl border border-dashed border-black/[0.08] bg-black/[0.01] p-2 text-center text-xs text-zinc-400 print:hidden",
        position === "below-calculator" && "min-h-[100px] md:min-h-[260px]",
        position === "in-content" && "min-h-[100px] md:min-h-[260px]",
        position === "sidebar" && "min-h-[260px]",
        className
      )}
      data-ad-slot={position}
      aria-label="Advertisement space"
    >
      <div className="flex h-full min-h-[90px] md:min-h-[250px] w-full items-center justify-center rounded-xl border border-black/[0.04] bg-white">
        <span className="text-zinc-300 tracking-wider uppercase text-[10px] font-mono font-medium">
          Sponsored Space
        </span>
      </div>
    </div>
  );
}
