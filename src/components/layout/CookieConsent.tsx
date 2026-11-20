"use client";

import { useSyncExternalStore, useState } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";

const STORAGE_KEY = "calcdial_cookie_consent";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return "dismissed";
  }
}

function getServerSnapshot(): string | null {
  return "dismissed";
}

export function CookieConsent() {
  const consent = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [localDismissed, setLocalDismissed] = useState(false);

  const handleConsent = (choice: "accepted" | "essential") => {
    try {
      localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      // Ignore storage errors
    }
    setLocalDismissed(true);
  };

  if (consent !== null || localDismissed) return null;

  return (
    <aside
      role="region"
      aria-label="Cookie consent"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <div className="relative rounded-2xl border border-zinc-200/90 bg-white/95 p-5 shadow-2xl backdrop-blur-md">
        <button
          type="button"
          onClick={() => handleConsent("essential")}
          className="absolute top-3 right-3 flex size-8 items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors"
          aria-label="Close cookie banner"
        >
          <X className="size-4" />
        </button>

        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#2b5cfd]">
            <Cookie className="size-5" />
          </div>
          <div className="pr-6">
            <h3 className="text-sm font-bold text-zinc-950">Cookie Preferences</h3>
            <p className="mt-1 text-xs text-zinc-600 leading-relaxed">
              We use essential and privacy-focused analytics cookies to improve our calculation models and measure platform reliability. Review our{" "}
              <Link
                href="/privacy-policy"
                className="font-medium text-[#2b5cfd] underline underline-offset-2 hover:text-blue-700"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-col-reverse sm:flex-row items-center gap-2">
          <button
            type="button"
            onClick={() => handleConsent("essential")}
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 min-h-11 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 transition-colors shadow-2xs"
          >
            Essential Only
          </button>
          <button
            type="button"
            onClick={() => handleConsent("accepted")}
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center rounded-xl bg-[#010918] px-4 min-h-11 text-xs font-semibold text-white hover:bg-zinc-800 transition-colors shadow-sm"
          >
            Accept All
          </button>
        </div>
      </div>
    </aside>
  );
}
