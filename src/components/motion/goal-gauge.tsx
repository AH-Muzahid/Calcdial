"use client";

/**
 * GoalGauge, from https://motion-brew.com/components/goal-gauge
 * One self contained file: the component, its animated icons and the cn() helper.
 */

import * as React from "react";
import { type ClassValue, clsx } from "clsx";
import { animate, AnimatePresence, motion, type MotionValue, useInView, useMotionValue, useMotionValueEvent, useReducedMotion, useTransform, useVelocity } from "motion/react";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// Clean, lightweight SVG arrow-up-right icon
function ArrowUpRightIcon({ className, strokeWidth = 2 }: { className?: string; strokeWidth?: number | string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M7 7H17" />
      <path d="M17 7V17" />
      <path d="M7 17L17 7" />
    </svg>
  );
}

const W = 280;
const R = 110;
const STROKE = 10;
const CX = W / 2;
const CY = R + STROKE / 2 + 10;
const H = CY + STROKE / 2 + 10;

const GLIDE = [0.22, 1, 0.36, 1] as const;
const ROLL = { type: "spring", stiffness: 280, damping: 26, mass: 0.8 } as const;
const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
const MAX_BLUR = 0.5;

function Digit({ digit, still }: { digit: number; still: boolean }) {
  return (
    <span className="relative inline-block h-[1em] w-[0.62em] overflow-hidden">
      <motion.span
        className="absolute inset-x-0 top-0 flex flex-col"
        initial={{ y: "0%" }}
        animate={{ y: `${-digit * 10}%` }}
        transition={still ? { duration: 0 } : ROLL}
      >
        {DIGITS.map((d) => (
          <span key={d} className="flex h-[1em] items-center justify-center">
            {d}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

function Rolling({ text, still }: { text: string; still: boolean }) {
  const chars = Array.from(text);
  return (
    <span aria-label={text} className="inline-flex leading-none tabular-nums">
      {chars.map((ch, i) => {
        const key = chars.length - i;
        return /\d/.test(ch) ? (
          <Digit key={key} digit={Number(ch)} still={still} />
        ) : (
          <span key={`${key}-${ch}`} aria-hidden className="inline-block h-[1em]">
            {ch}
          </span>
        );
      })}
    </span>
  );
}

function Wheel({
  amount,
  rate,
  place,
  unit,
}: {
  amount: MotionValue<number>;
  rate: MotionValue<number>;
  place: number;
  unit: number;
}) {
  const position = useTransform(amount, (a) => {
    const ticks = Math.max(0, a) / unit + 1e-6;
    const whole = Math.floor(ticks);
    const turning = ticks - whole;
    const span = Math.round(place / unit);
    const digit = Math.floor(whole / span) % 10;
    const turn = span === 1 ? turning : whole % span === span - 1 ? turning : 0;
    return digit + turn;
  });
  const y = useTransform(position, (p) => `${(-p * 100) / 11}%`);
  const filter = useTransform(rate, (v) => {
    const px = Math.min(MAX_BLUR, (Math.abs(v) / place) * 0.015);
    return px < 0.1 ? "none" : `blur(${px.toFixed(2)}px)`;
  });
  return (
    <span className="relative inline-block h-[1em] w-[0.62em] overflow-hidden">
      <motion.span className="absolute inset-x-0 top-0 flex flex-col" style={{ y, filter }}>
        {[...DIGITS, 0].map((d, i) => (
          <span key={i} className="flex h-[1em] items-center justify-center">
            {d}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

function Odometer({
  amount,
  format,
  label,
}: {
  amount: MotionValue<number>;
  format: Intl.NumberFormat;
  label: string;
}) {
  const parts = React.useMemo(() => format.formatToParts(1234.5), [format]);
  const before = parts
    .slice(
      0,
      parts.findIndex((p) => p.type === "integer")
    )
    .map((p) => p.value)
    .join("");
  const lastNum = parts.map((p) => p.type).lastIndexOf("fraction");
  const after = parts
    .slice(lastNum + 1)
    .map((p) => p.value)
    .join("");
  const group = parts.find((p) => p.type === "group")?.value ?? ",";
  const decimal = parts.find((p) => p.type === "decimal")?.value ?? ".";
  const fractionDigits = parts.find((p) => p.type === "fraction")?.value.length ?? 2;

  const rate = useVelocity(amount);
  const wholeDigits = (a: number) => Math.max(1, String(Math.floor(Math.max(0, a) + 1e-6)).length);
  const [count, setCount] = React.useState(() => wholeDigits(amount.get()));
  useMotionValueEvent(amount, "change", (a) => {
    const next = wholeDigits(a);
    if (next !== count) setCount(next);
  });

  const cells: React.ReactNode[] = [];
  for (let k = count - 1; k >= 0; k--) {
    cells.push(
      <motion.span
        key={`w${k}`}
        className="inline-flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <Wheel amount={amount} rate={rate} place={10 ** k} unit={10 ** -fractionDigits} />
      </motion.span>
    );
    if (k > 0 && k % 3 === 0) cells.push(<span key={`g${k}`}>{group}</span>);
  }
  cells.push(<span key="dec">{decimal}</span>);
  for (let f = 1; f <= fractionDigits; f++) {
    cells.push(<Wheel key={`f${f}`} amount={amount} rate={rate} place={10 ** -f} unit={10 ** -fractionDigits} />);
  }

  return (
    <span aria-label={label} className="inline-flex leading-none tabular-nums font-mono">
      <span aria-hidden className="inline-flex">
        {before}
        {cells}
        {after}
      </span>
    </span>
  );
}

const POP = {
  initial: { opacity: 0, y: 6, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 4, scale: 0.98 },
  transition: { duration: 0.25, ease: GLIDE },
} as const;

function pointAt(p: number) {
  const angle = Math.PI * (1 - p);
  return { x: CX + R * Math.cos(angle), y: CY - R * Math.sin(angle) };
}

function arcBetween(from: number, to: number) {
  const a = pointAt(from);
  const b = pointAt(to);
  return `M ${a.x} ${a.y} A ${R} ${R} 0 0 1 ${b.x} ${b.y}`;
}

const GAP = (STROKE + 3) / (Math.PI * R);
const PALETTE = ["#000000", "#52525b", "#71717a", "#a1a1aa", "#d4d4d8"] as const;

export interface GaugeSegment {
  label: string;
  value: number;
  color?: string;
}

function normalize(segments: GaugeSegment[]) {
  const head = segments.slice(0, PALETTE.length - 1);
  const tail = segments.slice(PALETTE.length - 1);
  const folded = tail.length > 1 ? [{ label: "Other", value: tail.reduce((sum, t) => sum + t.value, 0) }] : tail;
  return [...head, ...folded].map((seg, i) => ({ ...seg, color: seg.color ?? PALETTE[i]! }));
}

function Segment({
  progress,
  from,
  to,
  color,
  dim,
}: {
  progress: MotionValue<number>;
  from: number;
  to: number;
  color: string;
  dim: boolean;
}) {
  const span = Math.max(1e-6, to - from);
  const length = useTransform(progress, (p) => Math.min(1, Math.max(0, (p - from) / span)));
  const opacity = useTransform(length, (l) => (l > 0.001 ? 1 : 0));
  return (
    <motion.g animate={{ opacity: dim ? 0.28 : 1 }} transition={{ duration: 0.25, ease: GLIDE }}>
      <motion.path
        d={arcBetween(from, to)}
        fill="none"
        stroke={color}
        strokeWidth={STROKE}
        strokeLinecap="round"
        style={{ pathLength: length, opacity }}
      />
    </motion.g>
  );
}

export interface GoalGaugeProps {
  segments?: GaugeSegment[];
  value?: number;
  color?: string;
  goal?: number;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  currency?: string;
  locale?: string;
  duration?: number;
  actionLabel?: React.ReactNode;
  onAction?: () => void;
  className?: string;
}

export const GoalGauge = React.forwardRef<HTMLDivElement, GoalGaugeProps>(function GoalGauge(
  {
    segments,
    value,
    color = "#000000",
    goal = 100,
    title = "Net Profit Split",
    subtitle = "Calculated live",
    currency = "USD",
    locale = "en-US",
    duration = 1.2,
    actionLabel = null,
    onAction,
    className,
  },
  forwardedRef
) {
  const root = React.useRef<HTMLDivElement>(null);
  React.useImperativeHandle(forwardedRef, () => root.current as HTMLDivElement);
  const inView = useInView(root, { once: true, amount: 0.4 });
  const reduceMotion = useReducedMotion();
  const [active, setActive] = React.useState<number | "rest" | null>(null);

  const money = React.useMemo(
    () => new Intl.NumberFormat(locale, { style: "currency", currency, minimumFractionDigits: 2 }),
    [locale, currency]
  );
  const whole = React.useMemo(
    () => new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 0 }),
    [locale, currency]
  );

  const segs = React.useMemo(
    () =>
      segments
        ? normalize(segments)
        : value !== undefined
        ? [{ label: typeof title === "string" ? title : "Net Profit", value, color }]
        : normalize([
            { label: "Net Profit", value: 24.57, color: "#000000" },
            { label: "Platform Fees", value: 5.42, color: "#52525b" },
            { label: "Shipping/Cost", value: 5.0, color: "#71717a" },
          ]),
    [segments, value, color, title]
  );

  const effectiveGoal = Math.max(goal, segs.reduce((sum, seg) => sum + seg.value, 0), 0.01);
  const total = segs.reduce((sum, seg) => sum + seg.value, 0);
  const remaining = Math.max(0, effectiveGoal - total);
  const done = total >= effectiveGoal;

  const ranges = React.useMemo(() => {
    let runningTotal = 0;
    const slices: Array<{ from: number; to: number; hitFrom: number; hitTo: number }> = [];
    for (let i = 0; i < segs.length; i++) {
      const seg = segs[i];
      const start = Math.min(1, runningTotal / effectiveGoal);
      runningTotal += seg.value;
      const end = Math.min(1, runningTotal / effectiveGoal);
      slices.push({
        from: start + (i > 0 ? GAP / 2 : 0),
        to: Math.max(start + (i > 0 ? GAP / 2 : 0), end - (i < segs.length - 1 || end < 1 ? GAP / 2 : 0)),
        hitFrom: start,
        hitTo: end,
      });
    }
    return slices;
  }, [segs, effectiveGoal]);

  const amount = useMotionValue(0);
  const shown = useMotionValue(0);
  const progress = useTransform(amount, (a) => Math.min(1, Math.max(0, a / effectiveGoal)));
  const trackLength = useTransform(progress, (p) => Math.max(0, 1 - Math.min(1, p + GAP / 2)));
  useMotionValueEvent(amount, "change", (a) => {
    if (active === null) shown.set(a);
  });

  React.useEffect(() => {
    if (!inView) return;
    if (reduceMotion) {
      amount.set(total);
      shown.set(total);
      return;
    }
    const controls = animate(amount, total, { duration, ease: GLIDE });
    return () => controls.stop();
  }, [inView, total, duration, reduceMotion, amount, shown]);

  React.useEffect(() => {
    const target = active === null ? amount.get() : active === "rest" ? remaining : segs[active]!.value;
    if (reduceMotion) {
      shown.set(target);
      return;
    }
    const controls = animate(shown, target, { duration: 0.4, ease: GLIDE });
    return () => controls.stop();
  }, [active, remaining, segs, amount, shown, reduceMotion]);

  const caption =
    active === "rest"
      ? { dot: undefined, text: `Remaining · ${Math.round((remaining / effectiveGoal) * 100)}%` }
      : active !== null
      ? {
          dot: segs[active]!.color,
          text: `${segs[active]!.label} · ${Math.round((segs[active]!.value / (total || 1)) * 100)}%`,
        }
      : null;

  return (
    <div
      ref={root}
      className={cn(
        "w-full max-w-[340px] rounded-2xl bg-white border border-zinc-200/80 p-5 text-zinc-950 shadow-xs",
        className
      )}
    >
      <header className="flex items-start justify-between gap-3 mb-2">
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-zinc-900">{title}</h3>
          <p className="text-xs text-zinc-500">{subtitle}</p>
        </div>
        {actionLabel !== null && (
          <button
            type="button"
            onClick={onAction}
            className="inline-flex shrink-0 items-center gap-1 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-900 hover:bg-zinc-200"
          >
            {actionLabel}
            <ArrowUpRightIcon className="size-3" strokeWidth={2.5} />
          </button>
        )}
      </header>

      <div
        role="meter"
        tabIndex={0}
        aria-label={typeof title === "string" ? title : "Profit breakdown"}
        aria-valuenow={Math.round(total)}
        aria-valuemin={0}
        aria-valuemax={Math.round(effectiveGoal)}
        onBlur={() => setActive(null)}
        onPointerLeave={() => setActive(null)}
        className="relative mt-4 rounded-xl outline-none"
      >
        <svg viewBox={`0 0 ${W} ${H}`} className="block w-full overflow-visible" aria-hidden>
          <motion.path
            d={`M ${pointAt(1).x} ${pointAt(1).y} A ${R} ${R} 0 0 0 ${pointAt(0).x} ${pointAt(0).y}`}
            fill="none"
            strokeWidth={STROKE}
            strokeLinecap="round"
            className="stroke-zinc-100"
            animate={{ opacity: active === null || active === "rest" ? 1 : 0.4 }}
            style={{ pathLength: trackLength }}
          />
          {segs.map((seg, i) => (
            <Segment
              key={seg.label}
              progress={progress}
              from={ranges[i]!.from}
              to={ranges[i]!.to}
              color={seg.color}
              dim={active !== null && active !== i}
            />
          ))}
          {segs.map((seg, i) => (
            <path
              key={`hit-${seg.label}`}
              d={arcBetween(ranges[i]!.hitFrom, ranges[i]!.hitTo)}
              fill="none"
              stroke="transparent"
              strokeWidth={STROKE + 24}
              pointerEvents="stroke"
              onPointerEnter={() => setActive(i)}
            />
          ))}
        </svg>

        <div className="pointer-events-none absolute inset-x-0 bottom-2 flex flex-col items-center text-center">
          <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950 font-mono">
            <Odometer amount={shown} format={money} label={money.format(total)} />
          </p>
          <div className="mt-1 h-5 text-xs text-zinc-500">
            <AnimatePresence initial={false} mode="popLayout">
              {caption ? (
                <motion.span
                  key={caption.text}
                  {...POP}
                  className="inline-flex items-center justify-center gap-1.5 font-semibold text-zinc-900"
                >
                  {caption.dot && <span className="size-2 rounded-full" style={{ background: caption.dot }} />}
                  {caption.text}
                </motion.span>
              ) : done ? (
                <motion.span key="done" {...POP} className="font-semibold text-zinc-900">
                  Gross Revenue (100%)
                </motion.span>
              ) : (
                <motion.span key="of" {...POP} className="text-zinc-600 font-medium">
                  of <Rolling text={whole.format(effectiveGoal)} still={!!reduceMotion} />
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-zinc-100 flex flex-wrap items-center justify-center gap-2.5">
        {segs.map((seg, idx) => (
          <div
            key={seg.label}
            onMouseEnter={() => setActive(idx)}
            onMouseLeave={() => setActive(null)}
            className="flex items-center gap-1.5 text-xs cursor-pointer transition-opacity hover:opacity-100"
            style={{ opacity: active === null || active === idx ? 1 : 0.4 }}
          >
            <span className="size-2 rounded-full" style={{ backgroundColor: seg.color }} />
            <span className="text-zinc-600 font-medium text-[11px] sm:text-xs">{seg.label}</span>
            <span className="font-mono text-zinc-950 font-semibold text-[11px] sm:text-xs">{money.format(seg.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
});
