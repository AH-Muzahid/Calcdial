"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/analytics";

interface EmbedModalProps {
  toolSlug: string;
  title: string;
}

export function EmbedModal({ toolSlug, title }: EmbedModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const embedCode = `<iframe src="https://calcdial.com/embed/${toolSlug}" width="100%" height="520" style="border:none;border-radius:12px;overflow:hidden;" title="${title}" loading="lazy"></iframe><p style="font-size:12px;color:#6b7280;text-align:right;">Powered by <a href="https://calcdial.com/tools/${toolSlug}" target="_blank" rel="noopener">CalcDial</a></p>`;

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      trackEvent({
        name: "embed_copied",
        params: { tool_slug: toolSlug },
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white px-3.5 py-1.5 text-xs font-mono font-medium text-black shadow-2xs transition hover:bg-black/[0.03] focus:outline-hidden print:hidden cursor-pointer"
      >
        <svg className="size-3.5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
        Embed Tool
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl border border-black/[0.08] bg-white p-6 sm:p-7 shadow-2xl">
            <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
              <h3 className="text-base font-bold text-black">
                Embed this Calculator on your Website
              </h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-zinc-400 hover:text-black cursor-pointer"
              >
                ✕
              </button>
            </div>
            <p className="mt-3 text-xs text-zinc-500 leading-relaxed">
              Copy and paste this HTML snippet into your WordPress, Shopify blog, or custom website. It is 100% free, responsive, and mobile-friendly.
            </p>
            <div className="mt-3 rounded-2xl bg-black p-4">
              <pre className="overflow-x-auto text-xs text-zinc-300 font-mono whitespace-pre-wrap break-all">
                {embedCode}
              </pre>
            </div>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full border border-black/[0.08] px-4 py-2 text-xs font-mono font-medium text-zinc-700 hover:bg-black/[0.03] cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={copyCode}
                className="rounded-full bg-black px-4 py-2 text-xs font-mono font-semibold text-white hover:bg-zinc-800 cursor-pointer shadow-xs"
              >
                {copied ? "Copied to Clipboard!" : "Copy Embed HTML"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
