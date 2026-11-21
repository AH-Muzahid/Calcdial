"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CustomSelectOption {
  value: string;
  label: string;
  badge?: string;
}

interface CustomSelectProps {
  value: string;
  options: CustomSelectOption[];
  onChange: (val: string) => void;
  className?: string;
  placeholder?: string;
}

export function CustomSelect({
  value,
  options,
  onChange,
  className,
  placeholder = "Select an option",
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Trigger Button — 100% custom, zero native browser arrows */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={cn(
          "min-h-11 h-11 w-full flex items-center justify-between rounded-lg border border-zinc-300 bg-white px-3.5 text-xs sm:text-sm font-sans font-semibold text-zinc-950 shadow-2xs hover:border-zinc-400 focus:border-blue-600 focus:outline-hidden focus:ring-1 focus:ring-blue-600 transition-all cursor-pointer text-left select-none",
          isOpen && "border-blue-600 ring-1 ring-blue-600",
          className
        )}
      >
        <span className="truncate pr-2">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={cn(
            "size-3.5 shrink-0 text-zinc-500 transition-transform duration-200",
            isOpen && "rotate-180 text-blue-600"
          )}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          className="absolute z-50 mt-1 max-h-60 min-w-full sm:min-w-[260px] w-max max-w-[calc(100vw-2rem)] right-0 sm:right-auto overflow-y-auto rounded-lg border border-zinc-200 bg-white py-1 shadow-lg font-sans text-xs sm:text-sm no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "min-h-11 w-full flex items-center justify-between px-3.5 py-2.5 text-left transition-colors cursor-pointer text-xs sm:text-sm gap-2",
                  isSelected
                    ? "bg-blue-50 font-bold text-blue-700"
                    : "text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950"
                )}
              >
                <span className="whitespace-normal leading-snug">{option.label}</span>
                {isSelected && (
                  <Check className="size-3.5 shrink-0 text-blue-600 ml-2" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
