import { cn } from "@/lib/utils";

interface AdSlotProps {
  position: "below-calculator" | "in-content" | "sidebar";
  className?: string;
}

export function AdSlot({ position, className }: AdSlotProps) {
  return (
    <div
      className={cn(
        "my-8 mx-auto w-full max-w-4xl overflow-hidden rounded-xl border border-dashed border-gray-200 bg-gray-50/70 p-2 text-center text-xs text-gray-400 print:hidden",
        position === "below-calculator" && "min-h-[100px] md:min-h-[260px]",
        position === "in-content" && "min-h-[100px] md:min-h-[260px]",
        position === "sidebar" && "min-h-[260px]",
        className
      )}
      data-ad-slot={position}
      aria-label="Advertisement space"
    >
      <div className="flex h-full min-h-[90px] md:min-h-[250px] w-full items-center justify-center rounded-lg border border-gray-100 bg-white">
        <span className="text-gray-300 tracking-wider uppercase text-[10px] font-semibold">
          Sponsored Space
        </span>
      </div>
    </div>
  );
}
