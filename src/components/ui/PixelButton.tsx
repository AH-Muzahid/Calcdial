"use client";

import React, { useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Exact parameters & physics from vibrant.design pixel engine
const GRID_STEP = 5;
const PIXEL_GAP = 1;
const CELL_SIZE = GRID_STEP - PIXEL_GAP; // 4px
const HALF_CELL = CELL_SIZE / 2;
const POINTER_RADIUS = 72;
const INTENSITY_RATE = 0.16;
const DECAY_TIME = 420;
const RIPPLE_TIME = 820;
const RIPPLE_WIDTH = 22;
const RIPPLE_CHANCE = 0.24;

function getRandomBase() {
  const e = Math.random();
  return e < 0.55 ? 0.03 : e < 0.82 ? 0.06 : e < 0.95 ? 0.09 : 0.13;
}

function getRandomLevel() {
  const e = Math.random();
  return e < 0.4 ? 0.1 : e < 0.72 ? 0.16 : e < 0.92 ? 0.23 : 0.3;
}

interface PixelCell {
  x: number;
  y: number;
  base: number;
  lit: number;
  level: number;
}

interface Ripple {
  x: number;
  y: number;
  t0: number;
  strength: number;
}

export function usePixelEngine() {
  const containerRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const stateRef = useRef<{
    cells: PixelCell[];
    width: number;
    height: number;
    pointer: { x: number; y: number } | null;
    hovering: boolean;
    ripples: Ripple[];
    frame: number;
    last: number;
    draw: () => void;
    kick: () => void;
  }>({
    cells: [],
    width: 0,
    height: 0,
    pointer: null,
    hovering: false,
    ripples: [],
    frame: 0,
    last: 0,
    draw: () => {},
    kick: () => {},
  });

  const getLocalCoords = useCallback((e: React.PointerEvent<HTMLElement>) => {
    const el = containerRef.current;
    if (!el) return { x: 0, y: 0 };
    const rect = el.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  const addRipple = useCallback((coords: { x: number; y: number }, strength = 1) => {
    const state = stateRef.current;
    state.ripples = [
      ...state.ripples.slice(-5),
      { ...coords, t0: performance.now(), strength },
    ];
    state.kick();
  }, []);

  const onPointerEnter = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      const state = stateRef.current;
      const coords = getLocalCoords(e);
      state.pointer = coords;
      state.hovering = true;
      if (e.pointerType === "mouse") {
        addRipple(coords, 0.6);
      }
      state.kick();
    },
    [getLocalCoords, addRipple]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      const state = stateRef.current;
      state.pointer = getLocalCoords(e);
      state.kick();
    },
    [getLocalCoords]
  );

  const onPointerLeave = useCallback(() => {
    const state = stateRef.current;
    state.hovering = false;
    state.kick();
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      addRipple(getLocalCoords(e), 1.0);
    },
    [getLocalCoords, addRipple]
  );

  const onClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (e.detail === 0) {
        // Keyboard activation -> ripple from center
        const state = stateRef.current;
        addRipple({ x: state.width / 2, y: state.height / 2 }, 1.0);
      }
    },
    [addRipple]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !container || !ctx) return;

    const state = stateRef.current;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      state.width = rect.width;
      state.height = rect.height;

      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Keep cells safely inside the rounded corners with margin
      const paddingX = 6;
      const paddingY = 4;
      const availableW = Math.max(0, rect.width - paddingX * 2);
      const availableH = Math.max(0, rect.height - paddingY * 2);
      const cols = Math.floor(availableW / GRID_STEP);
      const rows = Math.floor(availableH / GRID_STEP);
      const offsetX = paddingX + (availableW - cols * GRID_STEP) / 2;
      const offsetY = paddingY + (availableH - rows * GRID_STEP) / 2;

      state.cells = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          state.cells.push({
            x: offsetX + c * GRID_STEP,
            y: offsetY + r * GRID_STEP,
            base: getRandomBase(),
            lit: 0,
            level: getRandomLevel(),
          });
        }
      }
      state.draw();
    };

    state.draw = () => {
      ctx.clearRect(0, 0, state.width, state.height);
      ctx.save();
      // Strictly clip canvas drawing to button's rounded rectangle
      ctx.beginPath();
      if (typeof ctx.roundRect === "function") {
        ctx.roundRect(0, 0, state.width, state.height, 12);
      } else {
        ctx.rect(0, 0, state.width, state.height);
      }
      ctx.clip();

      for (let i = 0; i < state.cells.length; i++) {
        const cell = state.cells[i];
        const opacity = Math.min(cell.base + cell.lit, 0.45);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity.toFixed(3)})`;
        ctx.fillRect(cell.x, cell.y, CELL_SIZE, CELL_SIZE);
      }
      ctx.restore();
    };

    const update = (now: number, delta: number) => {
      const n = delta / 16.67;
      const decay = Math.exp(-delta / DECAY_TIME);
      state.ripples = state.ripples.filter((r) => now - r.t0 < RIPPLE_TIME);
      const maxDist = Math.hypot(state.width, state.height) * 0.9;
      let hasActive = false;

      for (let i = 0; i < state.cells.length; i++) {
        const cell = state.cells[i];
        cell.lit *= decay;
        if (cell.lit < 0.004) cell.lit = 0;

        const cx = cell.x + HALF_CELL;
        const cy = cell.y + HALF_CELL;

        const excite = (multiplier: number) => {
          cell.level = getRandomLevel();
          cell.lit = Math.max(cell.lit, cell.level * multiplier);
        };

        // Hover cursor glow
        if (state.hovering && state.pointer) {
          const dist = Math.hypot(cx - state.pointer.x, cy - state.pointer.y);
          const prox = 1 - dist / POINTER_RADIUS;
          if (prox > 0 && Math.random() < Math.pow(prox, 1.5) * INTENSITY_RATE * n) {
            excite(0.55 + 0.45 * prox);
          }
        }

        // Ripple expansion wave
        for (let r = 0; r < state.ripples.length; r++) {
          const rip = state.ripples[r];
          const progress = (now - rip.t0) / RIPPLE_TIME;
          const waveRadius = progress * maxDist;
          const ripDist = Math.hypot(cx - rip.x, cy - rip.y);

          if (
            Math.abs(ripDist - waveRadius) < RIPPLE_WIDTH / 2 &&
            Math.random() < RIPPLE_CHANCE * rip.strength * n
          ) {
            excite(1 - progress * 0.6);
          }
        }

        if (cell.lit > 0) hasActive = true;
      }

      return hasActive;
    };

    const loop = (timestamp: number) => {
      state.frame = 0;
      const delta = Math.min(48, state.last ? timestamp - state.last : 16.67);
      state.last = timestamp;

      const hasActive = update(timestamp, delta);
      state.draw();

      if (hasActive || state.hovering || state.ripples.length > 0) {
        state.frame = requestAnimationFrame(loop);
      } else {
        state.last = 0;
      }
    };

    state.kick = () => {
      if (!state.frame) {
        state.frame = requestAnimationFrame(loop);
      }
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);

    return () => {
      observer.disconnect();
      if (state.frame) {
        cancelAnimationFrame(state.frame);
        state.frame = 0;
      }
      state.kick = () => {};
      state.draw = () => {};
    };
  }, []);

  return {
    containerRef,
    canvasRef,
    handlers: {
      onPointerEnter,
      onPointerMove,
      onPointerLeave,
      onPointerDown,
      onClick,
    },
  };
}

export function PixelCanvas({ className }: { className?: string }) {
  return (
    <canvas
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 -z-10 size-full", className)}
    />
  );
}

interface PixelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export function PixelButton({
  children,
  className,
  onPointerEnter,
  onPointerMove,
  onPointerLeave,
  onPointerDown,
  onClick,
  ...props
}: PixelButtonProps) {
  const { containerRef, canvasRef, handlers } = usePixelEngine();

  return (
    <button
      ref={containerRef as React.RefObject<HTMLButtonElement>}
      type="button"
      className={cn(
        "group/pixel relative isolate inline-flex cursor-pointer items-center justify-between overflow-hidden rounded-xl bg-[#2b5cfd] hover:bg-[#2554f6] font-bold text-white outline-none select-none border border-[#1b3cb5] hover:border-[#1635a8] shadow-[inset_0_1px_0_0_rgb(255_255_255/0.4),inset_0_-1px_0_0_rgb(10_30_120/0.4),0_6px_16px_-6px_rgb(43_92_253/0.55),0_1px_2px_rgb(27_60_181/0.3)] hover:shadow-[inset_0_1px_0_0_rgb(255_255_255/0.5),inset_0_-1px_0_0_rgb(10_30_120/0.45),0_8px_22px_-4px_rgb(43_92_253/0.7),0_2px_4px_rgb(27_60_181/0.35)] transition-all duration-150 ease-out active:scale-[0.985] motion-reduce:transition-none motion-reduce:active:scale-100 focus-visible:ring-3 focus-visible:ring-[#2b5cfd]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-default [text-shadow:0_1px_2px_rgb(10_30_120/0.75)]",
        className
      )}
      onPointerEnter={(e) => {
        handlers.onPointerEnter(e);
        onPointerEnter?.(e);
      }}
      onPointerMove={(e) => {
        handlers.onPointerMove(e);
        onPointerMove?.(e);
      }}
      onPointerLeave={(e) => {
        handlers.onPointerLeave();
        onPointerLeave?.(e);
      }}
      onPointerDown={(e) => {
        handlers.onPointerDown(e);
        onPointerDown?.(e);
      }}
      onClick={(e) => {
        handlers.onClick(e);
        onClick?.(e);
      }}
      {...props}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 size-full rounded-xl overflow-hidden"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 rounded-xl bg-[linear-gradient(180deg,rgb(255_255_255/0.14),transparent_45%,rgb(10_30_120/0.2))] group-hover/pixel:bg-[linear-gradient(180deg,rgb(255_255_255/0.22),transparent_45%,rgb(10_30_120/0.25))] transition-colors"
      />
      {children}
    </button>
  );
}

interface PixelLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  prefetch?: boolean;
}

export function PixelLink({ href, children, className, prefetch = false }: PixelLinkProps) {
  const { containerRef, canvasRef, handlers } = usePixelEngine();

  return (
    <Link
      ref={containerRef as unknown as React.Ref<HTMLAnchorElement>}
      href={href}
      prefetch={prefetch}
      className={cn(
        "group/pixel relative isolate inline-flex cursor-pointer items-center justify-between overflow-hidden rounded-xl bg-[#2b5cfd] hover:bg-[#2554f6] font-bold text-white outline-none select-none border border-[#1b3cb5] hover:border-[#1635a8] shadow-[inset_0_1px_0_0_rgb(255_255_255/0.4),inset_0_-1px_0_0_rgb(10_30_120/0.4),0_6px_16px_-6px_rgb(43_92_253/0.55),0_1px_2px_rgb(27_60_181/0.3)] hover:shadow-[inset_0_1px_0_0_rgb(255_255_255/0.5),inset_0_-1px_0_0_rgb(10_30_120/0.45),0_8px_22px_-4px_rgb(43_92_253/0.7),0_2px_4px_rgb(27_60_181/0.35)] transition-all duration-150 ease-out active:scale-[0.985] motion-reduce:transition-none motion-reduce:active:scale-100 focus-visible:ring-3 focus-visible:ring-[#2b5cfd]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-default [text-shadow:0_1px_2px_rgb(10_30_120/0.75)]",
        className
      )}
      onPointerEnter={handlers.onPointerEnter}
      onPointerMove={handlers.onPointerMove}
      onPointerLeave={handlers.onPointerLeave}
      onPointerDown={handlers.onPointerDown}
      onClick={handlers.onClick}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 size-full rounded-xl overflow-hidden"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 rounded-xl bg-[linear-gradient(180deg,rgb(255_255_255/0.14),transparent_45%,rgb(10_30_120/0.2))] group-hover/pixel:bg-[linear-gradient(180deg,rgb(255_255_255/0.22),transparent_45%,rgb(10_30_120/0.25))] transition-colors"
      />
      {children}
    </Link>
  );
}
