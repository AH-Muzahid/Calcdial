"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/analytics";

interface EmailCaptureProps {
  source: "calculator-result" | "guide-footer" | "homepage";
  toolSlug?: string;
  headline?: string;
  description?: string;
  buttonText?: string;
}

export function EmailCapture({
  source,
  toolSlug,
  headline = "Get 2026 Platform Fee Update Alerts",
  description = "Join 4,500+ sellers receiving quarterly fee schedules, hidden fee warnings, and profit margin cheat sheets.",
  buttonText = "Get Free Updates",
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
    <div className="my-8 rounded-3xl border border-black/10 bg-black p-6 sm:p-8 text-white shadow-md print:hidden">
      <div className="max-w-xl">
        <span className="inline-block rounded-full bg-white/10 border border-white/10 px-3 py-1 text-xs font-mono text-zinc-300">
          Seller Newsletter
        </span>
        <h3 className="mt-3 text-xl font-bold tracking-tight text-white sm:text-2xl">
          {headline}
        </h3>
        <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
          {description}
        </p>
      </div>

      {submitted ? (
        <div className="mt-5 rounded-2xl bg-white/10 border border-white/20 p-4 text-sm font-medium text-white">
          ✓ Success! Check your inbox for the 2026 E-commerce Fee Cheat Sheet and alert confirmation.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your seller email..."
            required
            className="w-full sm:max-w-xs rounded-full border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-white focus:outline-hidden"
          />
          <button
            type="submit"
            className="rounded-full bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-black shadow-xs transition hover:bg-zinc-200 focus:outline-hidden cursor-pointer"
          >
            {buttonText}
          </button>
        </form>
      )}
      <p className="mt-3 text-[11px] text-zinc-500">
        Zero spam. Unsubscribe anytime. We respect your privacy.
      </p>
    </div>
  );
}
