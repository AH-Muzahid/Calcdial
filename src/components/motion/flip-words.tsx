"use client";

/**
 * FlipWords, from https://motion-brew.com/components/flip-words
 * Zero-CLS edition: utilizes CSS Grid stacking to reserve exact bounding box dimensions.
 */

import * as React from "react";
import { type ClassValue, clsx } from "clsx";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export interface FlipWordsProps {
  /** Text before the changing word. */
  before?: string;
  /** Words to cycle through. */
  words?: string[];
  /** Text after the changing word. */
  after?: string;
  /** Milliseconds each word stays. Default `2400`. */
  interval?: number;
  /** Classes for the changing word. */
  wordClassName?: string;
  className?: string;
  as?: "span" | "p" | "div";
}

const EASE = [0.22, 1, 0.36, 1] as const;

export const FlipWords = React.forwardRef<HTMLElement, FlipWordsProps>(function FlipWords(
  {
    before = "",
    words = ["Etsy Sellers", "Shopify Stores", "TikTok Shops", "Print-on-Demand"],
    after = "",
    interval = 2400,
    wordClassName = "text-zinc-950 font-bold",
    className,
    as = "span",
  },
  ref,
) {
  const still = useReducedMotion();
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    if (words.length < 2) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % words.length), interval);
    return () => window.clearInterval(id);
  }, [words.length, interval]);

  const word = words[index] ?? "";
  const Tag = as === "div" ? "div" : as === "p" ? "p" : "span";

  return (
    <Tag ref={ref as React.Ref<never>} className={cn("inline-flex items-center", className)}>
      <span className="sr-only">
        {before ? `${before} ` : ""}{words.join(", ")}{after ? ` ${after}` : ""}
      </span>
      <span aria-hidden className="inline-flex items-center">
        {before && <span className="inline mr-1.5">{before}</span>}
        <span className="relative inline-grid [grid-template-areas:'stack'] items-center text-center overflow-hidden">
          {/* Invisible sizing words: locks container width and height to the longest/tallest word for 0 CLS */}
          {words.map((w) => (
            <span
              key={w}
              className={cn("[grid-area:stack] invisible pointer-events-none select-none whitespace-nowrap", wordClassName)}
              aria-hidden="true"
            >
              {w}
            </span>
          ))}
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={word}
              className={cn("[grid-area:stack] inline-flex items-center justify-center whitespace-nowrap", wordClassName)}
              initial={still ? false : { opacity: 0, y: "0.35em", filter: "blur(3px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={still ? { opacity: 0 } : { opacity: 0, y: "-0.35em", filter: "blur(3px)" }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              {word}
            </motion.span>
          </AnimatePresence>
        </span>
        {after && <span className="inline ml-1.5">{after}</span>}
      </span>
    </Tag>
  );
});
