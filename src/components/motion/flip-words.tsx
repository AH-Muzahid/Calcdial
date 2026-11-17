"use client";

/**
 * FlipWords, from https://motion-brew.com/components/flip-words
 *
 * One self contained file: the component and the cn()
 * helper. Needs React 18 or 19 and Tailwind CSS v4.
 */

import * as React from "react";
import { type ClassValue, clsx } from "clsx";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export interface FlipWordsProps {
  /** Text before the changing word. Default `"Build"`. */
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
    words = ["Etsy", "Shopify", "TikTok Shop", "Print-on-Demand"],
    after = "",
    interval = 2400,
    wordClassName = "text-zinc-950 font-black underline decoration-zinc-300 decoration-2 underline-offset-8",
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
    <Tag ref={ref as React.Ref<never>} className={cn("inline", className)}>
      <span className="sr-only">
        {before ? `${before} ` : ""}{words.join(", ")}{after ? ` ${after}` : ""}
      </span>
      <span aria-hidden className="inline">
        {before && <span className="inline">{before} </span>}
        <motion.span
          layout={!still}
          transition={{ duration: 0.4, ease: EASE }}
          className="relative inline-flex"
          style={{ perspective: 600 }}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={word}
              className={cn("inline-flex whitespace-nowrap", wordClassName)}
              exit={still ? { opacity: 0 } : { opacity: 0, y: "-0.4em", rotateX: 70, filter: "blur(6px)" }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              {Array.from(word).map((ch, i) => (
                <motion.span
                  key={i}
                  className="inline-block"
                  style={{ transformOrigin: "50% 100%" }}
                  initial={still ? false : { opacity: 0, y: "0.4em", rotateX: -80, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.45, ease: EASE, delay: i * 0.02 }}
                >
                  {ch}
                </motion.span>
              ))}
            </motion.span>
          </AnimatePresence>
        </motion.span>
        {after && <span className="inline"> {after}</span>}
      </span>
    </Tag>
  );
});
