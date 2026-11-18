"use client";

import { useState } from "react";
import { Calculator, ChevronUp, ChevronDown } from "lucide-react";

interface FormulaBreakdownProps {
  formulaMarkdown?: string;
  toolTitle?: string;
  toolSlug?: string;
}

interface ToolMethodology {
  formulaHtml: React.ReactNode;
  secondaryFormula?: React.ReactNode;
  points: { title: string; desc: string }[];
}

const TOOL_METHODOLOGIES: Record<string, ToolMethodology> = {
  "shopify-profit-calculator": {
    formulaHtml: (
      <span>
        <span className="text-emerald-700 font-extrabold">Net Profit</span> = (Retail Price + Shipping) − (COGS + Carrier Postage + Gateway Fee + Surcharges + Ad Spend)
      </span>
    ),
    secondaryFormula: (
      <span>
        <span className="text-blue-700 font-extrabold">Break-Even ROAS</span> = Gross Revenue ÷ (Gross Revenue − Total Direct Costs)
      </span>
    ),
    points: [
      {
        title: "Payment Processing Fee:",
        desc: "2.9% + 30¢ (Basic), 2.7% + 30¢ (Shopify), or 2.5% + 30¢ (Advanced) charged on gross order total via Shopify Payments.",
      },
      {
        title: "3rd-Party Gateway Surcharge:",
        desc: "Extra 2.0% (Basic), 1.0% (Shopify), or 0.6% (Advanced) platform penalty when using Stripe, PayPal, or external gateways.",
      },
      {
        title: "Landed Cost (COGS) & Postage:",
        desc: "Unit production/wholesale cost plus actual carrier shipping paid to fulfill the order.",
      },
      {
        title: "Customer Acquisition (CAC):",
        desc: "Paid ad spend per order on Meta, Google, or TikTok required to generate the sale.",
      },
    ],
  },
  "etsy-fee-calculator": {
    formulaHtml: (
      <span>
        <span className="text-emerald-700 font-extrabold">Net Profit</span> = (Item Price + Buyer Shipping) − (Product Cost + Shipping + Etsy Fees)
      </span>
    ),
    points: [
      {
        title: "Listing Fee:",
        desc: "$0.20 per item (valid for 4 months or until sold, auto-renews upon multi-quantity sale).",
      },
      {
        title: "Transaction Fee:",
        desc: "6.5% assessed on entire buyer order total (including retail price and buyer shipping).",
      },
      {
        title: "Payment Processing Fee:",
        desc: "3% + $0.25 (US base rate; varies by seller bank country, e.g. 4% + £0.20 in UK).",
      },
      {
        title: "Offsite Ads Fee:",
        desc: "12% to 15% deducted only when an order originates from Etsy-funded advertising within 30 days.",
      },
    ],
  },
  "pod-profit-calculator": {
    formulaHtml: (
      <span>
        <span className="text-emerald-700 font-extrabold">Net Profit</span> = Retail Price − (Base Item Cost + Provider Shipping + Platform Fee + Ad Spend)
      </span>
    ),
    points: [
      {
        title: "Base Item Cost:",
        desc: "Blank apparel/merchandise cost plus DTG printing charges from Printify or Printful.",
      },
      {
        title: "Fulfillment Shipping:",
        desc: "Flat carrier postage rate charged by your print-on-demand supplier.",
      },
      {
        title: "Marketplace Commission:",
        desc: "Channel selling fee (Etsy 6.5%, Shopify ~2.9%, or TikTok Shop 6.0%).",
      },
      {
        title: "Target Gross Margin:",
        desc: "Maintain 35%+ gross margin before advertising to maintain scalable unit economics.",
      },
    ],
  },
  "tiktok-shop-fee-calculator": {
    formulaHtml: (
      <span>
        <span className="text-emerald-700 font-extrabold">Net Payout</span> = Order Total − (Referral Fee + Merchant Payment Fee + Affiliate Commission)
      </span>
    ),
    points: [
      {
        title: "Category Referral Fee:",
        desc: "Standard 6.0% referral commission assessed across most consumer product categories.",
      },
      {
        title: "Payment Processing:",
        desc: "1.8% + $0.30 merchant fee deducted on the buyer's gross checkout total.",
      },
      {
        title: "Creator Affiliate Commission:",
        desc: "Optional 10%–20% commission paid to creators generating viral affiliate video sales.",
      },
      {
        title: "Shipping Subsidies:",
        desc: "Platform shipping promotions or seller-funded logistics co-pay discounts.",
      },
    ],
  },
  "etsy-vs-shopify-vs-tiktok-shop-calculator": {
    formulaHtml: (
      <span>
        <span className="text-emerald-700 font-extrabold">Comparative Payout</span> = Item Price − Channel Specific Take Rates &amp; Commissions
      </span>
    ),
    points: [
      {
        title: "Shopify Payout:",
        desc: "Deducts 2.9% + 30¢ (Shopify Payments) — leaves highest take-home per sale (~96%).",
      },
      {
        title: "TikTok Shop Payout:",
        desc: "Deducts 6.0% referral + 1.8% + 30¢ processing — leaves ~92% payout before creator cuts.",
      },
      {
        title: "Etsy Payout:",
        desc: "Deducts 20¢ listing + 6.5% transaction + 3% + 25¢ processing — leaves ~88–90% payout.",
      },
    ],
  },
  "stripe-vs-paypal-fee-calculator": {
    formulaHtml: (
      <span>
        <span className="text-emerald-700 font-extrabold">Invoice Gross-Up</span> = (Target Payout + Fixed Fee) ÷ (1 − Processing Rate)
      </span>
    ),
    points: [
      {
        title: "Stripe Standard Rate:",
        desc: "2.9% + $0.30 per successful card charge (US domestic cards).",
      },
      {
        title: "PayPal Commercial Rate:",
        desc: "3.49% + $0.49 per standard PayPal checkout transaction.",
      },
      {
        title: "International Surcharges:",
        desc: "Extra 1.0% to 1.5% cross-border fee plus 1.0% currency conversion markup.",
      },
    ],
  },
};

export function FormulaBreakdown({
  formulaMarkdown,
  toolTitle = "Fee Calculator",
  toolSlug = "etsy-fee-calculator",
}: FormulaBreakdownProps) {
  const [isOpen, setIsOpen] = useState(true);

  // Match methodology or fall back cleanly
  const methodology = TOOL_METHODOLOGIES[toolSlug] || {
    formulaHtml: (
      <span>
        <span className="text-emerald-700 font-extrabold">Net Profit</span> = Revenue − (Direct Costs + Platform Fees)
      </span>
    ),
    points: [
      {
        title: "Platform Fees:",
        desc: "Standard merchant processing and marketplace commission charges.",
      },
      {
        title: "Direct Costs:",
        desc: "Item landed manufacturing, packaging, and carrier postage expenses.",
      },
    ],
  };

  return (
    <div className="rounded-xl sm:rounded-2xl border border-zinc-200/90 bg-white shadow-2xs overflow-hidden h-full font-sans">
      {/* Header with Accordion Toggle */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3.5 sm:p-4 text-left hover:bg-zinc-50 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <Calculator className="size-4 text-zinc-800" />
          <h3 className="text-sm sm:text-base font-bold text-zinc-950 tracking-tight">
            Formula &amp; Methodology
          </h3>
        </div>
        <div className="text-zinc-500 hover:text-zinc-900">
          {isOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </div>
      </button>

      {/* Accordion Content — Streamlined Single Layer */}
      {isOpen && (
        <div className="px-3.5 sm:px-4.5 pb-4 pt-1 border-t border-zinc-100 space-y-2.5">
          {/* Formula Line (Subtle tinted background, no double card border) */}
          <div className="rounded-lg bg-zinc-50/90 px-3 py-2 text-xs sm:text-sm font-mono font-bold text-zinc-950 leading-relaxed text-center sm:text-left">
            {methodology.formulaHtml}
          </div>

          {methodology.secondaryFormula && (
            <div className="rounded-lg bg-blue-50/60 px-3 py-1.5 text-xs font-mono font-bold text-zinc-900 leading-relaxed text-center sm:text-left">
              {methodology.secondaryFormula}
            </div>
          )}

          {/* Bulleted Fee Explanation */}
          <ul className="space-y-2 text-xs text-zinc-850 leading-relaxed pt-1">
            {methodology.points.map((pt, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-zinc-400 font-bold">•</span>
                <span>
                  <strong className="text-zinc-950 font-bold">{pt.title}</strong> {pt.desc}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
