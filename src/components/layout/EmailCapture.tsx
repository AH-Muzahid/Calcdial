"use client";

import React, { useState } from "react";
import { Mail, CheckCircle2 } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { CobaltSprite } from "@/components/home/CobaltSprite";

interface EmailCaptureProps {
  source: "calculator-result" | "guide-footer" | "homepage";
  toolSlug?: string;
  headline?: string;
  description?: string;
  buttonText?: string;
  className?: string;
}

export function EmailCapture({
  source,
  toolSlug,
  headline = "Receive weekly seller profit & fee schedule updates",
  description = "Join 12,000+ online sellers receiving verified fee breakdowns, platform policy alerts, and profit margin strategies.",
  buttonText = "Subscribe",
  className = "",
}: EmailCaptureProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    trackEvent({
      name: "email_signup",
      params: { source, tool_slug: toolSlug },
    });
    setSubmitted(true);
  };

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-zinc-200/80 bg-gradient-to-r from-zinc-50/70 via-white to-zinc-50/40 px-6 py-6 sm:px-8 sm:py-7 lg:px-10 lg:py-7 shadow-[0_2px_16px_rgba(0,0,0,0.03)] print:hidden font-sans ${className}`}
    >
      {/* Background Curved Dotted Orbit Lines */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-50"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
      >
        <path
          d="M 320 -20 C 400 60, 520 140, 780 160 C 920 170, 1060 130, 1260 220"
          stroke="#d4d4d8"
          strokeWidth="1.2"
          strokeDasharray="4 6"
        />
        <circle cx="520" cy="140" r="3.5" fill="#ffffff" stroke="#a1a1aa" strokeWidth="1.2" />
        <circle cx="780" cy="160" r="4.5" fill="#ffffff" stroke="#a1a1aa" strokeWidth="1.2" />
        <circle cx="1060" cy="130" r="3" fill="#ffffff" stroke="#a1a1aa" strokeWidth="1.2" />
      </svg>

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
        {/* Left Side: Editorial & Subscription Form */}
        <div className="w-full lg:max-w-xl text-left">
          {/* Main Headline */}
          <h3 className="text-xl sm:text-2xl lg:text-[26px] font-bold tracking-tight text-zinc-950 font-sans leading-snug">
            {headline}
          </h3>

          {/* Subtitle */}
          <p className="mt-2 text-sm sm:text-[15px] text-zinc-700 font-medium leading-relaxed">
            {description}
          </p>

          {/* Form Area */}
          <div className="mt-5">
            {submitted ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/90 p-3.5 text-emerald-950 shadow-2xs animate-in zoom-in-95 duration-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4.5 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-sm">You are on the fee alert list!</span>
                </div>
                <p className="mt-1 text-xs text-emerald-800 leading-normal">
                  Check your inbox shortly for your 2026 E-commerce Fee Cheat Sheet and schedule updates.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                {/* Pill Email Input */}
                <div className="relative flex items-center flex-1 rounded-full border border-zinc-300 bg-white px-4 py-2 shadow-xs focus-within:border-zinc-950 focus-within:ring-2 focus-within:ring-zinc-950/10 transition-all">
                  <Mail className="size-4 text-zinc-500 shrink-0 mr-2.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full bg-transparent text-sm text-zinc-950 placeholder:text-zinc-500 focus:outline-none font-sans font-medium"
                  />
                </div>

                {/* Black Pill Subscribe Button */}
                <button
                  type="submit"
                  className="rounded-full bg-zinc-950 hover:bg-zinc-800 text-white font-semibold text-sm px-6 py-2 shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
                >
                  <span>{buttonText}</span>
                </button>
              </form>
            )}

            {/* Privacy Subtext */}
            <p className="mt-2.5 text-xs text-zinc-600 font-medium">
              We respect your seller privacy. Encrypted and zero-spam guaranteed.
            </p>
          </div>
        </div>

        {/* Right Side: Clean Background with Interactive Mouse-Tracking Cobalt Sprite */}
        <div className="relative flex items-center justify-center shrink-0 w-full lg:w-auto py-0">
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
            <CobaltSprite
              transparent
              background="transparent"
              follow="page"
              scale={128}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
