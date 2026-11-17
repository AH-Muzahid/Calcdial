"use client";

/**
 * BlurAccordion, from https://motion-brew.com/components/blur-accordion
 */

import * as React from "react";
import { type ClassValue, clsx } from "clsx";
import { animate, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useVelocity } from "motion/react";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export interface BlurAccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

export interface BlurAccordionProps {
  items?: BlurAccordionItem[];
  multiple?: boolean;
  defaultOpen?: string[];
  blur?: number;
  stiffness?: number;
  onOpenChange?: (open: string[]) => void;
  className?: string;
}

const MASS = 1;
const critical = (k: number) => 2 * Math.sqrt(k * MASS);

const PANEL_CONTENT = {
  closed: { opacity: 0, y: -6, filter: "blur(4px)" },
  open: { opacity: 1, y: 0, filter: "blur(0px)" },
};

interface RowProps {
  item: BlurAccordionItem;
  open: boolean;
  onToggle: () => void;
  blur: number;
  stiffness: number;
  still: boolean;
  uid: string;
  headerRef: (el: HTMLButtonElement | null) => void;
}

function Row({ item, open, onToggle, blur, stiffness, still, uid, headerRef }: RowProps) {
  const filterId = `${uid}-blur-${item.id}`;
  const headerId = `${uid}-h-${item.id}`;
  const panelId = `${uid}-p-${item.id}`;
  const inner = React.useRef<HTMLDivElement>(null);
  const panel = React.useRef<HTMLDivElement>(null);
  const blurNode = React.useRef<SVGFEGaussianBlurElement>(null);
  const placed = React.useRef(false);

  const height = useMotionValue(0);
  const speed = useVelocity(height);

  useMotionValueEvent(speed, "change", (v) => {
    const sd = blur > 0 && !still ? Math.min(blur, Math.abs(v) / 110) : 0;
    blurNode.current?.setAttribute("stdDeviation", `0 ${sd.toFixed(2)}`);
    if (panel.current) panel.current.style.filter = sd > 0.05 ? `url(#${filterId})` : "none";
  });

  React.useLayoutEffect(() => {
    const target = open ? (inner.current?.offsetHeight ?? 0) : 0;
    if (!placed.current || still) {
      height.set(target);
      placed.current = true;
      return;
    }
    const controls = animate(height, target, {
      type: "spring",
      stiffness,
      damping: critical(stiffness) * 0.92,
      mass: MASS,
    });
    return () => controls.stop();
  }, [open, still, stiffness, height]);

  React.useEffect(() => {
    const el = inner.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      if (open && Math.abs(speed.get()) < 1) height.set(el.offsetHeight);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [open, height, speed]);

  return (
    <motion.div
      initial={false}
      animate={open ? "open" : "closed"}
      className={cn(
        "rounded-2xl border transition-all duration-200",
        open
          ? "bg-black/[0.02] border-black/20 dark:bg-zinc-800/50 dark:border-zinc-700"
          : "bg-white border-black/[0.08] hover:border-black/20 dark:bg-zinc-900 dark:border-zinc-800"
      )}
    >
      <svg aria-hidden className="absolute size-0">
        <filter id={filterId} x="-5%" y="-20%" width="110%" height="140%">
          <feGaussianBlur ref={blurNode} stdDeviation="0 0" />
        </filter>
      </svg>
      <h3 className="m-0">
        <motion.button
          ref={headerRef}
          type="button"
          id={headerId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          whileTap={still ? undefined : { scale: 0.99 }}
          className={cn(
            "group flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold outline-none",
            "focus-visible:ring-2 focus-visible:ring-black",
            open ? "text-black dark:text-zinc-100" : "text-zinc-700 hover:text-black dark:text-zinc-300 dark:hover:text-zinc-100"
          )}
        >
          <span>{item.title}</span>
          <span
            aria-hidden
            className={cn(
              "relative grid size-6 shrink-0 place-items-center rounded-full transition-colors duration-200",
              open
                ? "bg-black text-white"
                : "bg-black/[0.04] text-zinc-700 group-hover:bg-black/[0.08] dark:bg-zinc-800 dark:text-zinc-300"
            )}
          >
            <span className="absolute h-[1.5px] w-2.5 rounded-full bg-current" />
            <motion.span
              className="absolute h-2.5 w-[1.5px] rounded-full bg-current"
              variants={{ closed: { rotate: 0, scaleY: 1 }, open: { rotate: 90, scaleY: 0 } }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            />
          </span>
        </motion.button>
      </h3>
      <motion.div
        ref={panel}
        id={panelId}
        role="region"
        aria-labelledby={headerId}
        aria-hidden={!open}
        style={{ height }}
        className="overflow-hidden"
      >
        <motion.div
          ref={inner}
          variants={PANEL_CONTENT}
          transition={{ duration: still ? 0 : 0.3, ease: [0.22, 1, 0.36, 1], delay: open && !still ? 0.05 : 0 }}
          className="px-5 pb-5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400"
        >
          {item.content}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export const BlurAccordion = React.forwardRef<HTMLDivElement, BlurAccordionProps>(function BlurAccordion(
  { items = [], multiple = false, defaultOpen, blur = 5, stiffness = 380, onOpenChange, className },
  ref
) {
  const still = !!useReducedMotion();
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const [openIds, setOpenIds] = React.useState<string[]>(defaultOpen ?? (items[0] ? [items[0].id] : []));
  const headers = React.useRef<(HTMLButtonElement | null)[]>([]);

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const isOpen = prev.includes(id);
      const next = isOpen ? prev.filter((x) => x !== id) : multiple ? [...prev, id] : [id];
      onOpenChange?.(next);
      return next;
    });
  };

  const focusAt = (i: number) => headers.current[(i + items.length) % items.length]?.focus();

  return (
    <div
      ref={ref}
      onKeyDown={(e) => {
        const at = headers.current.indexOf(document.activeElement as HTMLButtonElement);
        if (at < 0) return;
        if (e.key === "ArrowDown") (e.preventDefault(), focusAt(at + 1));
        if (e.key === "ArrowUp") (e.preventDefault(), focusAt(at - 1));
        if (e.key === "Home") (e.preventDefault(), focusAt(0));
        if (e.key === "End") (e.preventDefault(), focusAt(items.length - 1));
      }}
      className={cn("flex w-full flex-col gap-2.5", className)}
    >
      {items.map((item, i) => (
        <Row
          key={item.id}
          item={item}
          open={openIds.includes(item.id)}
          onToggle={() => toggle(item.id)}
          blur={blur}
          stiffness={stiffness}
          still={still}
          uid={uid}
          headerRef={(el) => void (headers.current[i] = el)}
        />
      ))}
    </div>
  );
});
