"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { CalcDialLogo } from "./CalcDialLogo";
import { Footer } from "./Footer";
import { ShimmerText } from "@/components/motion/shimmer-text";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);

  // Close mobile drawer on route change cleanly during render
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
  }

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-950 flex">
      {/* Desktop Persistent Left Sidebar */}
      <div className="hidden lg:flex lg:w-64 xl:w-72 fixed inset-y-0 left-0 border-r border-zinc-200/80 bg-white z-40">
        <Sidebar />
      </div>

      {/* Mobile Slide-Out Drawer Backdrop & Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop blur */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          {/* Drawer container */}
          <div className="fixed inset-y-0 left-0 w-72 bg-white shadow-2xl transition-transform animate-in slide-in-from-left duration-200">
            <Sidebar onClose={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 lg:pl-64 xl:pl-72 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-30 w-full border-b border-zinc-200/80 bg-white/90 backdrop-blur-md">
          <div className="mx-auto flex h-14 sm:h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              {/* Mobile hamburger menu toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 -ml-2 rounded-xl text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 transition-colors"
                aria-label="Open menu"
              >
                <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>

              {/* Mobile logo (hidden on desktop since sidebar has it) */}
              <div className="lg:hidden">
                <CalcDialLogo />
              </div>

              {/* Desktop search / location breadcrumb hint */}
              <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-zinc-500">
                <span className="font-semibold text-zinc-950">CalcDial Suite</span>
                <span>/</span>
                <span className="text-zinc-600">2026 E-Commerce Edition</span>
              </div>
            </div>

            {/* Top Right Quick Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden sm:flex items-center gap-1.5 border border-zinc-200/80 bg-zinc-50 px-3 py-1 rounded-full text-xs font-mono">
                <span className="size-1.5 rounded-full bg-emerald-600" />
                <ShimmerText text="2026 RATES" className="text-[11px] font-semibold tracking-wider text-zinc-900" />
              </div>

              <Link
                href="/#tools"
                className="inline-flex items-center gap-1.5 rounded-full bg-zinc-950 px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white shadow-xs transition-all hover:bg-zinc-800 hover:shadow-sm"
              >
                <span>All Calculators</span>
                <span className="text-zinc-400 font-mono">→</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 w-full pb-16">{children}</main>

        {/* Global Footer */}
        <Footer />
      </div>
    </div>
  );
}
