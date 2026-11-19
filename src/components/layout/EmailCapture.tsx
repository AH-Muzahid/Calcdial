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
        "group/card relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white px-6 py-5 sm:px-8 sm:py-5.5 lg:px-9 lg:py-6 shadow-[0_2px_16px_rgba(0,0,0,0.03)] print:hidden font-sans",
        className
      )}
    >
      {/* Background Curved Dotted Orbit Lines & Radar Geometric Patterns (Strictly Contained, Subtle Tech Aesthetic) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none select-none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1000 200"
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <clipPath id="emailBoxClip">
            <rect x="0" y="0" width="1000" height="200" rx="16" />
          </clipPath>
          <linearGradient id="orbitGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.0" />
            <stop offset="40%" stopColor="#3b82f6" stopOpacity="0.3" />
            <stop offset="75%" stopColor="#2563eb" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="orbitGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.0" />
            <stop offset="45%" stopColor="#94a3b8" stopOpacity="0.22" />
            <stop offset="80%" stopColor="#3b82f6" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.1" />
          </linearGradient>
          <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
          </radialGradient>
        </defs>

        <g clipPath="url(#emailBoxClip)">
          {/* Subtle Primary Flowing Dotted Orbit Wave (Flows through the open mid-right zone, safely away from text) */}
          <path
            d="M 400,95 C 520,45 660,115 790,65 C 870,35 940,80 1000,70"
            stroke="url(#orbitGrad1)"
            strokeWidth="1.3"
            strokeDasharray="4 6"
            strokeLinecap="round"
          />

          {/* Secondary Echo Dotted Wave */}
          <path
            d="M 440,145 C 560,165 690,110 810,145 C 880,165 940,125 1000,135"
            stroke="url(#orbitGrad2)"
            strokeWidth="1.1"
            strokeDasharray="3 5"
            strokeLinecap="round"
          />

          {/* Refined Constellation Node Markers */}
          <circle cx="660" cy="115" r="7" fill="url(#nodeGlow)" />
          <circle cx="660" cy="115" r="2.5" fill="#ffffff" stroke="#3b82f6" strokeWidth="1.2" />

          <circle cx="790" cy="65" r="7" fill="url(#nodeGlow)" />
          <circle cx="790" cy="65" r="2.5" fill="#ffffff" stroke="#2563eb" strokeWidth="1.2" />

          {/* Concentric Orbital Radar Rings Centered on Robot Stage (x: 890, y: 100) */}
          <circle
            cx="890"
            cy="100"
            r="62"
            stroke="#3b82f6"
            strokeOpacity="0.2"
            strokeWidth="1"
            strokeDasharray="3 6"
          />
          <circle
            cx="890"
            cy="100"
            r="82"
            stroke="#60a5fa"
            strokeOpacity="0.14"
            strokeWidth="1"
            strokeDasharray="4 7"
          />

          {/* Delicate Central Tech Reticle */}
          <g stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.3">
            <line x1="655" y1="115" x2="665" y2="115" />
            <line x1="660" y1="110" x2="660" y2="120" />
          </g>
        </g>
      </svg>

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
        {/* Left Side: Editorial & Subscription Form */}
        <div className="w-full lg:max-w-xl text-left">
          {/* Main Headline (Roobert Typography) */}
          <h3 className="text-xl sm:text-2xl font-medium tracking-[-0.6px] text-zinc-950 font-sans leading-snug">
            {headline}
          </h3>

          {/* Subtitle */}
          <p className="mt-1 text-xs sm:text-sm text-zinc-600 font-normal leading-normal max-w-lg">
            {description}
          </p>

          {/* Form Area */}
          <div className="mt-4">
            {submitted ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/90 p-3.5 text-emerald-950 shadow-2xs animate-in zoom-in-95 duration-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4.5 text-emerald-600 shrink-0" />
                  <span className="font-bold text-sm">You are on the fee alert list!</span>
                </div>
                <p className="mt-0.5 text-xs text-emerald-800 leading-normal">
                  Check your inbox shortly for your 2026 E-commerce Fee Cheat Sheet and schedule updates.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-md">
                {/* Modern rounded-xl Email Input */}
                <div className="relative flex items-center flex-1 h-10 rounded-xl border border-zinc-200/90 bg-white px-3 shadow-2xs focus-within:border-blue-500 focus-within:ring-3 focus-within:ring-blue-500/20 transition-all">
                  <Mail className="size-4 text-zinc-400 shrink-0 mr-2.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="w-full bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none font-sans font-medium"
                  />
                </div>

                {/* Pixel Matrix Subscribe Button */}
                <PixelButton
                  type="submit"
                  className="h-10 px-5 rounded-xl font-bold text-sm shrink-0 justify-center"
                >
                  <span>{buttonText}</span>
                </PixelButton>
              </form>
            )}

            {/* Privacy Subtext */}
            <p className="mt-2 text-[11px] text-zinc-400 font-normal">
              We respect your seller privacy. Zero spam, unsubscribe anytime.
            </p>
          </div>
        </div>

        {/* Right Side: 3D Robot Sprite with Full Motion Tracking & Zero Clipping */}
        <div className="relative flex items-center justify-center shrink-0 w-full lg:w-auto self-center">
          <div className="relative size-48 sm:size-52 flex items-center justify-center">
            <CobaltSprite
              transparent
              background="transparent"
              follow="page"
              scale={112}
              reach={10}
              lean={8}
              float={6}
              blink={10}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
