"use client";

import { useState } from "react";
import { Link2, Printer, Code, Check } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface ActionButtonsProps {
  toolSlug: string;
  title: string;
}

export function ActionButtons({ toolSlug, title }: ActionButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [showEmbed, setShowEmbed] = useState(false);

  const handleCopyLink = async () => {
    try {
      if (typeof window !== "undefined") {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        trackEvent({
          name: "result_copied",
          params: { tool_slug: toolSlug, method: "url" },
        });
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // fallback
    }
  };

  const handlePrint = () => {
    trackEvent({
      name: "result_copied",
      params: { tool_slug: toolSlug, method: "print" },
    });
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <>
      <div className="flex items-center gap-2 print:hidden w-full sm:w-auto">
        {/* Copy Link Button */}
        <button
          type="button"
          onClick={handleCopyLink}
          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs font-sans font-medium text-zinc-700 shadow-2xs hover:bg-zinc-50 hover:text-zinc-950 transition-colors cursor-pointer"
          title="Copy direct link to this calculator"
        >
          {copied ? (
            <>
              <Check className="size-4 text-emerald-600" />
              <span className="text-emerald-700 font-semibold sm:inline">Copied!</span>
            </>
          ) : (
            <>
              <Link2 className="size-4 text-zinc-500" />
              <span className="hidden sm:inline">Copy Link</span>
            </>
          )}
        </button>

        {/* Print / Save PDF Button */}
        <button
          type="button"
          onClick={handlePrint}
          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs font-sans font-medium text-zinc-700 shadow-2xs hover:bg-zinc-50 hover:text-zinc-950 transition-colors cursor-pointer"
          title="Print or Save PDF"
        >
          <Printer className="size-4 text-zinc-500" />
          <span className="hidden sm:inline">Print / Save PDF</span>
        </button>

        {/* Embed Widget Button */}
        <button
          type="button"
          onClick={() => setShowEmbed(true)}
          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs font-sans font-medium text-zinc-700 shadow-2xs hover:bg-zinc-50 hover:text-zinc-950 transition-colors cursor-pointer"
          title="Embed this calculator widget on your website"
        >
          <Code className="size-4 text-zinc-500" />
          <span className="hidden sm:inline">Embed Widget</span>
        </button>
      </div>

      {showEmbed && (
        <EmbedModalCustom
          toolSlug={toolSlug}
          title={title}
          onClose={() => setShowEmbed(false)}
        />
      )}
    </>
  );
}

function EmbedModalCustom({
  toolSlug,
  title,
  onClose,
}: {
  toolSlug: string;
  title: string;
  onClose: () => void;
}) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <h3 className="text-base font-bold text-zinc-950">
            Embed Calculator on your Website
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-800 cursor-pointer"
          >
            ✕
          </button>
        </div>
        <p className="mt-3 text-xs text-zinc-500 leading-relaxed">
          Copy and paste this HTML snippet into your WordPress, Shopify blog, or custom website. It is 100% free, responsive, and mobile-friendly.
        </p>
        <div className="mt-4 rounded-xl bg-zinc-950 p-3.5 text-xs font-mono text-zinc-200">
          <pre className="overflow-x-auto whitespace-pre-wrap break-all">{embedCode}</pre>
        </div>
        <div className="mt-5 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-zinc-200 px-4 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-50 cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={copyCode}
            className="rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs font-semibold text-white shadow-xs cursor-pointer transition-colors"
          >
            {copied ? "Code Copied!" : "Copy Embed Code"}
          </button>
        </div>
      </div>
    </div>
  );
}
