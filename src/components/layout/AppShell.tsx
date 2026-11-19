"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CommandMenu } from "./CommandMenu";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isEmbed = pathname?.startsWith("/embed/");
  const isHome = pathname === "/";

  if (isEmbed) {
    return (
      <main className="w-full min-h-screen bg-white">
        {children}
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-950 flex flex-col font-sans">
      <Header />
      <main className={cn("flex-1 w-full", !isHome && "pt-14 sm:pt-16")}>
        {children}
      </main>
      <Footer />
      {/* ⌘K Command Palette */}
      <CommandMenu />
    </div>
  );
}
