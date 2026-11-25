"use client";

import React, { useState } from "react";
import { Mail, CheckCircle2 } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { CobaltSprite } from "@/components/home/CobaltSprite";
import { PixelButton } from "@/components/ui/PixelButton";
import { cn } from "@/lib/utils";

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
      className={cn(
        "relative rounded-2xl border border-zinc-200/80 bg-white p-4 sm:p-6 shadow-xs print:hidden font-sans",
        className
      )}
    >
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
        {/* Left Side: Editorial & Subscription Form */}
        <div className="w-full lg:max-w-xl text-left">
          {/* Main Headline */}
          <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-950 font-sans leading-snug">
            {headline}
          </h3>

          {/* Subtitle */}
          <p className="mt-2 text-sm text-zinc-600 font-normal leading-normal max-w-lg">
            {description}
          </p>

          {/* Form Area */}
          <div className="mt-4">
            {submitted ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/90 p-4 text-emerald-950 shadow-2xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-sm">You are on the fee alert list!</span>
                </div>
                <p className="mt-1 text-xs text-emerald-800 leading-normal">
                  Check your inbox shortly for your 2026 E-commerce Fee Cheat Sheet and schedule updates.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-md">
                {/* Compact Email Input */}
                <div className="relative flex items-center flex-1 h-10 rounded-xl border border-zinc-300 bg-white px-3.5 shadow-2xs focus-within:border-[#2b5cfd] focus-within:ring-1 focus-within:ring-[#2b5cfd] transition-all">
                  <Mail className="size-4 text-zinc-400 shrink-0 mr-2 select-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="w-full bg-transparent text-sm text-zinc-950 placeholder:text-zinc-400 focus:outline-none font-sans font-medium"
                  />
                </div>

                {/* Pixel Matrix Subscribe Button */}
                <PixelButton
                  type="submit"
                  className="h-10 px-5 rounded-xl font-semibold text-sm shrink-0 justify-center"
                >
                  <span>{buttonText}</span>
                </PixelButton>
              </form>
            )}

            {/* Privacy Subtext */}
            <p className="mt-2 text-xs text-zinc-400 font-normal">
              We respect your seller privacy. Zero spam, unsubscribe anytime.
            </p>
          </div>
        </div>

        {/* Right Side: 3D Robot Sprite */}
        <div className="relative flex items-center justify-center shrink-0 w-full lg:w-auto self-center">
          <div className="relative size-32 sm:size-36 lg:size-40 flex items-center justify-center">
            <CobaltSprite
              transparent
              background="transparent"
              follow="page"
              scale={135}
              reach={7}
              lean={5}
              float={3}
              blink={10}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
