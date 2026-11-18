"use client";

import React from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CommandMenu } from "./CommandMenu";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-950 flex flex-col font-sans">
      <Header />
      <main className="flex-1 w-full">{children}</main>
      <Footer />
      {/* ⌘K Command Palette */}
      <CommandMenu />
    </div>
  );
}
