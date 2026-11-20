"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X, ArrowRight } from "lucide-react";
import { CalcDialLogo } from "./CalcDialLogo";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollState, setScrollState] = useState<"top" | "dark-scrolled" | "light">("top");
  const effectiveScrollState = !isHome ? "light" : scrollState;

  useEffect(() => {
    if (!isHome) return;

    const handleScroll = () => {
      const y = window.scrollY;
      if (y <= 20) {
        setScrollState("top");
      } else if (y <= 380) {
        setScrollState("dark-scrolled");
      } else {
        setScrollState("light");
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  const triggerGlobalSearch = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-command-menu"));
    }
  };

  const isDarkNavbar = effectiveScrollState !== "light";

  return (
    <header
      className={cn(
        "fixed top-0 left-0 z-50 w-full transition-all duration-300",
        effectiveScrollState === "top" && "bg-transparent border-b border-transparent text-white",
        effectiveScrollState === "dark-scrolled" && "bg-[#010918]/85 backdrop-blur-md border-b border-white/10 text-white shadow-sm",
        effectiveScrollState === "light" && "bg-white/95 backdrop-blur-md border-b border-zinc-200/80 text-zinc-950 shadow-xs"
      )}
    >
      <div className="relative mx-auto flex h-14 sm:h-[60px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Logo */}
        <div className="flex items-center">
          <CalcDialLogo isDark={isDarkNavbar} />
        </div>

        {/* Center: Desktop Navigation Links (Centrally Aligned in Navbar) */}
        <nav
          className={cn(
            "hidden md:flex absolute inset-y-0 left-1/2 -translate-x-1/2 items-center gap-8 text-[14px] font-medium transition-colors",
            isDarkNavbar ? "text-white/80" : "text-zinc-600"
          )}
        >
          {/* Calculators Direct Link */}
          <Link
            href="/calculators"
            prefetch={false}
            className={cn(
              "transition-colors",
              isDarkNavbar ? "text-white/80 hover:text-white" : "text-zinc-600 hover:text-zinc-950",
              pathname === "/calculators" && (isDarkNavbar ? "text-white font-semibold" : "text-[#2b5cfd] font-semibold")
            )}
          >
            Calculators
          </Link>

          {/* Comparisons Link */}
          <Link
            href="/comparisons"
            prefetch={false}
            className={cn(
              "transition-colors",
              isDarkNavbar ? "text-white/80 hover:text-white" : "text-zinc-600 hover:text-zinc-950",
              pathname === "/comparisons" && (isDarkNavbar ? "text-white font-semibold" : "text-[#2b5cfd] font-semibold")
            )}
          >
            Comparisons
          </Link>

          {/* Guides Link */}
          <Link
            href="/guides"
            prefetch={false}
            className={cn(
              "transition-colors",
              isDarkNavbar ? "text-white/80 hover:text-white" : "text-zinc-600 hover:text-zinc-950",
              pathname === "/guides" && (isDarkNavbar ? "text-white font-semibold" : "text-[#2b5cfd] font-semibold")
            )}
          >
            Guides
          </Link>
        </nav>

        {/* Right Actions: Minimalist Ghost Icon Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Minimal Search Icon Button */}
          <button
            type="button"
            onClick={triggerGlobalSearch}
            className={cn(
              "flex items-center justify-center p-2 rounded-lg transition-colors cursor-pointer",
              isDarkNavbar
                ? "text-white/80 hover:text-white hover:bg-white/10"
                : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
            )}
            title="Search calculators (⌘K / Ctrl+K)"
            aria-label="Open global search modal"
          >
            <Search className="size-5" />
          </button>

          {/* Mobile Menu Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={cn(
              "md:hidden flex items-center justify-center p-2 rounded-lg transition-colors cursor-pointer",
              isDarkNavbar
                ? "text-white/80 hover:text-white hover:bg-white/10"
                : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100"
            )}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>
        </div>
      </div>

      {/* Redesigned Mobile Responsive Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200/90 bg-white/98 backdrop-blur-xl px-4 py-4 shadow-xl animate-in slide-in-from-top-2 duration-200 font-sans">
          {/* Quick Search Button in Mobile Menu */}
          <div className="mb-3">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                triggerGlobalSearch();
              }}
              className="flex w-full items-center justify-between rounded-xl border border-zinc-200/90 bg-zinc-50/80 px-3.5 py-2.5 text-xs text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Search className="size-4 text-zinc-400" />
                <span>Search tools, fees, guides...</span>
              </div>
              <span className="rounded-md border border-zinc-200 bg-white px-1.5 py-0.5 text-[10px] font-mono text-zinc-400">
                ⌘K
              </span>
            </button>
          </div>

          {/* Main Navigation Items */}
          <nav className="flex flex-col gap-1">
            <Link
              href="/calculators"
              prefetch={false}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold transition-colors",
                pathname === "/calculators"
                  ? "bg-blue-50/70 text-[#2b5cfd]"
                  : "text-zinc-800 hover:bg-zinc-50"
              )}
            >
              <span>Calculators</span>
              <ArrowRight className="size-4 text-zinc-400" />
            </Link>

            <Link
              href="/comparisons"
              prefetch={false}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold transition-colors",
                pathname === "/comparisons"
                  ? "bg-blue-50/70 text-[#2b5cfd]"
                  : "text-zinc-800 hover:bg-zinc-50"
              )}
            >
              <span>Comparisons</span>
              <ArrowRight className="size-4 text-zinc-400" />
            </Link>

            <Link
              href="/guides"
              prefetch={false}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold transition-colors",
                pathname === "/guides"
                  ? "bg-blue-50/70 text-[#2b5cfd]"
                  : "text-zinc-800 hover:bg-zinc-50"
              )}
            >
              <span>Guides</span>
              <ArrowRight className="size-4 text-zinc-400" />
            </Link>
          </nav>

          {/* Secondary Footer Links in Drawer */}
          <div className="mt-4 pt-3.5 border-t border-zinc-150 flex items-center justify-between text-xs text-zinc-500 font-medium px-2">
            <Link
              href="/about"
              prefetch={false}
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-zinc-950 transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              prefetch={false}
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-zinc-950 transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/privacy-policy"
              prefetch={false}
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-zinc-950 transition-colors"
            >
              Privacy
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
