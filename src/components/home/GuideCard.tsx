import React from "react";
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface GuideCardProps {
  slug: string;
  title: string;
  readTime: string;
  type: "etsy" | "shopify" | "margin" | "tax";
  className?: string;
}

export function GuideCard({
  slug,
  title,
  readTime,
  type,
  className = "",
}: GuideCardProps) {
  return (
    <Link
      href={`/guides/${slug}`}
      prefetch={false}
      className={cn(
        "group relative isolate flex flex-col rounded-xl border border-zinc-200/80 bg-white overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.03)] select-none transform-gpu",
        "transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
        "hover:-translate-y-1 hover:border-blue-400/50 hover:shadow-[0_14px_34px_-8px_rgba(43,92,253,0.12),0_2px_8px_rgba(0,0,0,0.03)]",
        className
      )}
    >
      {/* Visual Thumbnail Banner */}
      <div className="h-40 w-full relative overflow-hidden bg-[#f4f2ee] flex items-center justify-center select-none border-b border-zinc-100">
        <div className="size-full transition-transform duration-500 ease-out group-hover:scale-105">
        {type === "etsy" && (
          <div className="w-full h-full bg-gradient-to-br from-[#faf7f2] via-[#f3ede3] to-[#e8dfd2] relative flex items-center justify-center">
            {/* Potted Plant Accent Left */}
            <div className="absolute left-3 bottom-2 flex flex-col items-center opacity-75">
              <div className="size-6 rounded-full bg-emerald-700/80 -mb-2 z-10" />
              <div className="size-7 rounded-full bg-emerald-600/90 -mb-2" />
              <div className="w-5 h-6 bg-amber-100 border border-amber-300/60 rounded-b-md shadow-2xs" />
            </div>

            {/* Laptop Mockup */}
            <div className="flex flex-col items-center">
              <div className="w-34 h-22 bg-zinc-900 rounded-t-lg p-1.5 shadow-md flex items-center justify-center border border-zinc-800">
                <div className="w-full h-full bg-[#F1641E] rounded-xs flex items-center justify-center shadow-inner">
                  <span className="text-white font-serif font-black text-lg tracking-tighter drop-shadow-xs">
                    Etsy
                  </span>
                </div>
              </div>
              <div className="w-42 h-2 bg-gradient-to-r from-zinc-400 via-zinc-200 to-zinc-400 rounded-b-md shadow-xs" />
            </div>

            {/* Coffee Cup Accent Right */}
            <div className="absolute right-4 bottom-3 opacity-60">
              <div className="size-5 rounded-full bg-white border border-zinc-300 shadow-2xs flex items-center justify-center">
                <div className="size-3.5 rounded-full bg-amber-900/60" />
              </div>
            </div>
          </div>
        )}

        {type === "shopify" && (
          <div className="w-full h-full bg-gradient-to-br from-[#f2f8f4] via-[#e5f1ea] to-[#d8e9df] relative flex items-center justify-center">
            {/* Plant Accent Left */}
            <div className="absolute left-4 bottom-2 flex flex-col items-center opacity-75">
              <div className="size-6 rounded-full bg-emerald-700/80 -mb-2 z-10" />
              <div className="size-7 rounded-full bg-emerald-800/90 -mb-2" />
              <div className="w-5 h-6 bg-white border border-zinc-200 rounded-b-md shadow-2xs" />
            </div>

            {/* Laptop Mockup with Shopify Screen */}
            <div className="flex flex-col items-center">
              <div className="w-34 h-22 bg-zinc-900 rounded-t-lg p-1.5 shadow-md flex items-center justify-center border border-zinc-800">
                <div className="w-full h-full bg-white rounded-xs flex items-center justify-center shadow-inner p-2">
                  <svg viewBox="0 0 109 123" fill="none" className="size-8">
                    <path d="M74.7 15.6c-.3-1.4-1.2-6.5-4.8-9.4C66.1 3.2 61.2 3 59.4 3c-.7 0-1.2.1-1.3.1-.9.2-2.3.8-3.7 2-3.1 2.8-5.3 7.8-6.4 13.9l-19.4 6c-2.3.7-2.3.9-2.6 3.1L12.5 106.6l54.8 13.4 39.8-13.4-32.4-91z" fill="#95BF47" />
                    <path d="M58.1 3.1c-.7 0-1.2.1-1.3.1-.9.2-2.3.8-3.7 2-3.1 2.8-5.3 7.8-6.4 13.9l-18 5.6 15 95.3 23.6-7.9 3.4-94.6c-.3-1.4-1.2-6.5-4.8-9.4-3.8-3-8.7-3.2-10.5-3.2z" fill="#5E8E3E" />
                    <path d="M52.3 35.8c-1.3-.8-2.9-.6-3.8.3-.9 1-1.2 2.6-.4 3.9l9.3 14.5c.8 1.3 2.5 1.7 3.8.9 1.3-.8 1.7-2.5.9-3.8l-9.8-15.8z" fill="#fff" />
                    <path d="M68.5 48.7c-4.9-1.2-10.1-.5-14.5 1.9-4.8 2.6-7.8 7.3-8.2 12.8-.5 7.1 4.5 13.4 11.4 14.5 5.6.9 11.2.8 16.8 0 .8-.1 1.4-.8 1.3-1.6-.1-.8-.8-1.4-1.6-1.3-5.2.7-10.4.8-15.6 0-5.3-.8-9.2-5.7-8.8-11.2.3-4.3 2.7-8 6.5-10 3.5-1.9 7.6-2.5 11.6-1.5 2.8.7 5.5 2.1 7.8 4.1.6.5 1.5.5 2.1-.1.6-.6.5-1.5-.1-2.1-2.8-2.4-6.1-4.2-9.6-5.1z" fill="#fff" />
                  </svg>
                </div>
              </div>
              <div className="w-42 h-2 bg-gradient-to-r from-zinc-400 via-zinc-200 to-zinc-400 rounded-b-md shadow-xs" />
            </div>

            {/* Accent Right */}
            <div className="absolute right-4 bottom-3 opacity-60">
              <div className="size-5 rounded-full bg-white border border-zinc-300 shadow-2xs" />
            </div>
          </div>
        )}

        {type === "margin" && (
          <div className="w-full h-full bg-gradient-to-br from-[#f8f5ee] via-[#efe9dd] to-[#ded4c1] relative flex items-center justify-center">
            {/* Desk Calculator Visual */}
            <div className="w-24 h-30 bg-zinc-900 rounded-xl p-2.5 shadow-md border border-zinc-800 flex flex-col justify-between">
              {/* LCD Display */}
              <div className="h-6 w-full bg-[#a3b19b] rounded px-1.5 flex items-center justify-end font-mono text-[11px] font-bold text-zinc-900 border border-zinc-700/60 shadow-inner">
                34.8%
              </div>
              {/* Keypad Grid */}
              <div className="grid grid-cols-4 gap-1 pt-1">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-3 rounded-xs ${
                      i === 11 ? "bg-blue-600" : i < 3 ? "bg-zinc-700" : "bg-zinc-800"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {type === "tax" && (
          <div className="w-full h-full bg-gradient-to-br from-[#f7f8fa] via-[#eceef2] to-[#e1e4ea] relative flex items-center justify-center">
            {/* Paper Document */}
            <div className="w-28 h-32 bg-white rounded-lg p-3 shadow-md border border-zinc-200/80 -rotate-2 flex flex-col justify-between relative">
              <div>
                <span className="font-extrabold text-sm tracking-tight text-zinc-900 block font-sans">
                  TAX
                </span>
                <span className="text-[9px] font-mono font-semibold text-zinc-400 block mt-0.5">
                  SCHEDULE C (1099)
                </span>
                <div className="mt-2 space-y-1">
                  <div className="h-1.5 w-full bg-zinc-100 rounded" />
                  <div className="h-1.5 w-4/5 bg-zinc-100 rounded" />
                  <div className="h-1.5 w-3/5 bg-blue-100 rounded" />
                </div>
              </div>
              <div className="pt-2 border-t border-zinc-100 flex justify-between items-center text-[8px] font-mono text-zinc-400">
                <span>DUE 2026</span>
                <span className="font-bold text-zinc-800">15.3%</span>
              </div>
            </div>

            {/* Stylus / Pen beside */}
            <div className="absolute right-7 bottom-4 w-1.5 h-20 bg-gradient-to-b from-zinc-800 via-zinc-600 to-amber-500 rounded-full shadow-sm rotate-12" />
          </div>
        )}
        </div>
      </div>

      {/* Guide Card Footer Info */}
      <div className="p-4 sm:p-4.5 flex flex-col flex-1 justify-between bg-white">
        <h3 className="font-bold text-[15px] sm:text-[16px] text-zinc-950 group-hover:text-[#2b5cfd] transition-colors duration-200 leading-snug line-clamp-2">
          {title}
        </h3>
        <div className="mt-3.5 pt-2.5 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500 font-normal">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <Clock className="size-3.5 text-zinc-400" />
            <span>{readTime}</span>
          </div>
          <span className="flex items-center gap-1 text-[12px] font-bold text-[#2b5cfd] opacity-90 group-hover:opacity-100 transition-all group-hover:translate-x-0.5">
            Read Guide
            <ArrowRight className="size-3 stroke-[2.2]" />
          </span>
        </div>
      </div>
    </Link>
  );
}
