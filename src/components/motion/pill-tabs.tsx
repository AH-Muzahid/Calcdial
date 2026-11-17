"use client";

/**
 * PillTabs, from https://motion-brew.com/components/pill-tabs
 */

import * as React from "react";
import { type ClassValue, clsx } from "clsx";
import { animate, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useTransform, useVelocity } from "motion/react";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export interface PillTab {
  id: string;
  label: string;
  badge?: number | string;
}

export interface PillTabsProps {
  tabs?: PillTab[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (id: string) => void;
  stretch?: number;
  blur?: number;
  label?: string;
  className?: string;
}

export const PillTabs = React.forwardRef<HTMLDivElement, PillTabsProps>(function PillTabs(
  {
    tabs = [
      { id: "us", label: "United States" },
      { id: "uk", label: "United Kingdom" },
      { id: "ca", label: "Canada" },
      { id: "au", label: "Australia" },
    ],
    defaultValue,
    value: valueProp,
    onValueChange,
    stretch = 0.45,
    blur = 7.5,
    label = "Presets",
    className,
  },
  forwardedRef
) {
  const reduceMotion = !!useReducedMotion();
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const filterId = `pill-blur-${uid}`;
  const track = React.useRef<HTMLDivElement>(null);
  React.useImperativeHandle(forwardedRef, () => track.current as HTMLDivElement);
  const tabRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const blurNode = React.useRef<SVGFEGaussianBlurElement>(null);

  const [inner, setInner] = React.useState(defaultValue ?? tabs[0]?.id ?? "");
  const value = valueProp ?? inner;
  const index = Math.max(
    0,
    tabs.findIndex((t) => t.id === value)
  );
  const placed = React.useRef(false);
  const fromWidth = React.useRef(0);
  const toWidth = React.useRef(0);
  const [height, setHeight] = React.useState(0);

  const left = useMotionValue(0);
  const right = useMotionValue(0);
  const capX = useTransform(right, (r) => r - height);
  const midX = useTransform(left, (l) => l + height / 2);
  const midScale = useTransform([left, right], ([l, r]) => Math.max(0, (r as number) - (l as number) - height));

  const thin = useTransform([left, right], ([l, r]) => {
    if (reduceMotion) return 1;
    const w = (r as number) - (l as number);
    const rest = Math.max(fromWidth.current, toWidth.current, 1);
    const over = Math.max(0, w - rest) / rest;
    return 1 - Math.min(0.18, over * 0.35);
  });

  const center = useTransform([left, right], ([l, r]) => ((l as number) + (r as number)) / 2);
  const speed = useVelocity(center);
  useMotionValueEvent(speed, "change", (v) => {
    const sd = blur > 0 && !reduceMotion ? Math.min(blur, Math.abs(v) / 420) : 0;
    blurNode.current?.setAttribute("stdDeviation", `${sd.toFixed(2)} 0`);
  });

  const select = (id: string) => {
    if (valueProp === undefined) setInner(id);
    onValueChange?.(id);
  };

  const moveTo = React.useCallback(
    (instant: boolean) => {
      const tab = tabRefs.current[index];
      if (!tab) return;
      const l = tab.offsetLeft;
      const r = l + tab.offsetWidth;
      setHeight(tab.offsetHeight);

      if (instant || reduceMotion || !placed.current) {
        left.jump(l);
        right.jump(r);
        placed.current = true;
        fromWidth.current = tab.offsetWidth;
        toWidth.current = tab.offsetWidth;
        return;
      }

      fromWidth.current = right.get() - left.get();
      toWidth.current = tab.offsetWidth;
      const goingRight = l > left.get();
      const delay = Math.max(0.04, Math.min(0.14, stretch * 0.22));
      const spring = { type: "spring" as const, stiffness: 380, damping: 32, mass: 0.9 };

      if (goingRight) {
        animate(right, r, spring);
        animate(left, l, { ...spring, delay });
      } else {
        animate(left, l, spring);
        animate(right, r, { ...spring, delay });
      }
    },
    [index, reduceMotion, stretch, left, right]
  );

  React.useLayoutEffect(() => {
    moveTo(false);
  }, [moveTo]);

  React.useEffect(() => {
    const onResize = () => moveTo(true);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [moveTo]);

  const focusTab = (target: number) => {
    const clamped = Math.max(0, Math.min(tabs.length - 1, target));
    const next = tabs[clamped];
    if (next) {
      select(next.id);
      tabRefs.current[clamped]?.focus();
    }
  };

  return (
    <div
      ref={track}
      role="tablist"
      aria-label={label}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          focusTab(index + 1);
        }
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          focusTab(index - 1);
        }
        if (e.key === "Home") {
          e.preventDefault();
          focusTab(0);
        }
        if (e.key === "End") {
          e.preventDefault();
          focusTab(tabs.length - 1);
        }
      }}
      className={cn(
        "relative inline-flex items-center gap-1 rounded-full bg-zinc-100 p-1 border border-zinc-200/80 shadow-2xs",
        className
      )}
    >
      <svg aria-hidden className="absolute size-0">
        <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur ref={blurNode} stdDeviation="0 0" />
        </filter>
      </svg>

      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-y-1 left-0 w-full"
        style={{
          filter: `url(#${filterId}) drop-shadow(0 1px 2px rgba(0,0,0,0.06))`,
          scaleY: thin,
        }}
      >
        <motion.span
          className="absolute left-0 top-0 rounded-full bg-white shadow-xs border border-zinc-200/50"
          style={{ x: left, width: height, height }}
        />
        <motion.span
          className="absolute left-0 top-0 w-px origin-left bg-white"
          style={{ x: midX, scaleX: midScale, height }}
        />
        <motion.span
          className="absolute left-0 top-0 rounded-full bg-white shadow-xs border border-zinc-200/50"
          style={{ x: capX, width: height, height }}
        />
      </motion.span>

      {tabs.map((tab, i) => {
        const active = i === index;
        return (
          <motion.button
            key={tab.id}
            ref={(el) => void (tabRefs.current[i] = el)}
            type="button"
            role="tab"
            id={`${uid}-tab-${tab.id}`}
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            onClick={() => select(tab.id)}
            whileTap={{ scale: 0.96 }}
            className={cn(
              "relative z-10 inline-flex h-8 sm:h-9 cursor-pointer items-center gap-1.5 rounded-full px-2.5 sm:px-4 text-[11px] sm:text-xs font-semibold outline-none transition-colors duration-200 whitespace-nowrap",
              active
                ? "text-zinc-950 font-bold"
                : "text-zinc-500 hover:text-zinc-900"
            )}
          >
            {tab.label}
            {tab.badge !== undefined && (
              <span className="ml-1 rounded-full bg-zinc-900 text-white px-2 py-0.5 text-[10px] font-mono font-medium">
                {tab.badge}
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
});
