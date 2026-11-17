"use client";

import { useState, useMemo, useEffect } from "react";
import { calculateTikTokFees } from "@/lib/formulas/tiktok-fees";
import { TIKTOK_CATEGORY_PRESETS } from "@/data/fee-presets";
import { InputField } from "./InputField";
import { PresetSelector } from "./PresetSelector";
import { ResultCard } from "./ResultCard";
import { StickyResultBar } from "./StickyResultBar";
import { ShareButton } from "@/components/layout/ShareButton";
import { PrintButton } from "@/components/layout/PrintButton";
import { EmbedModal } from "@/components/layout/EmbedModal";
import { trackEvent } from "@/lib/analytics";

export function TikTokFeeCalculator({ initialCategory = "beauty", isEmbed = false }: { initialCategory?: string; isEmbed?: boolean }) {
  const [salePrice, setSalePrice] = useState<number>(35.00);
  const [category, setCategory] = useState<string>(initialCategory.toLowerCase());
  const [affiliatePct, setAffiliatePct] = useState<number>(15.0);
  const [cogs, setCogs] = useState<number>(8.00);
  const [shipping, setShipping] = useState<number>(3.50);

  const result = useMemo(() => {
    return calculateTikTokFees({
      salePrice,
      category,
      creatorAffiliatePct: affiliatePct,
      cogs,
      shippingCost: shipping,
    });
  }, [salePrice, category, affiliatePct, cogs, shipping]);

  useEffect(() => {
    const timer = setTimeout(() => {
      trackEvent({
        name: "calculator_used",
        params: { tool_slug: "tiktok-shop-fee-calculator", preset: category },
      });
    }, 1500);
    return () => clearTimeout(timer);
  }, [salePrice, category, affiliatePct]);

  const categoryOptions = TIKTOK_CATEGORY_PRESETS.map((c) => ({
    id: c.id,
    label: `${c.id.charAt(0).toUpperCase() + c.id.slice(1)} (${c.fees.referralPct}% referral)`,
  }));

  const getFormattedSummary = () => {
    return `TikTok Shop Fee Calculation (2026)
----------------------------------------
Sale Price:          $${salePrice.toFixed(2)}
Category:            ${category.toUpperCase()} (${result.referralRatePct}%)
Creator Affiliate:   ${affiliatePct}% ($${result.affiliateCommission.toFixed(2)})
COGS & Shipping:     $${(cogs + shipping).toFixed(2)}
----------------------------------------
Platform Payout:     $${result.netPayout.toFixed(2)}
Final Net Profit:    $${result.netProfit.toFixed(2)} (${result.netMarginPct}% margin)
----------------------------------------
Calculated on CalcDial: https://calcdial.com/tools/tiktok-shop-fee-calculator`;
  };

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7 space-y-5">
          <PresetSelector
            label="Product Category (Referral Rate)"
            selectedId={category}
            options={categoryOptions}
            onSelect={setCategory}
            helpText="Standard 2026 TikTok Shop category commission rates"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InputField
              label="Item Sale Price"
              value={salePrice}
              onChange={setSalePrice}
              prefix="$"
              presets={[15, 24.99, 39.99, 59.99]}
            />
            <InputField
              label="Creator Affiliate Commission %"
              value={affiliatePct}
              onChange={setAffiliatePct}
              suffix="%"
              helpText="Offered to creators in TikTok Affiliate Center"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InputField
              label="Landed Product Cost (COGS)"
              value={cogs}
              onChange={setCogs}
              prefix="$"
              helpText="Manufacturing or wholesale unit cost"
            />
            <InputField
              label="Fulfillment & Shipping"
              value={shipping}
              onChange={setShipping}
              prefix="$"
              helpText="Packaging, label, and postage cost"
            />
          </div>

          {!isEmbed && (
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <ShareButton
                toolSlug="tiktok-shop-fee-calculator"
                getFormattedText={getFormattedSummary}
              />
              <div className="flex items-center gap-2">
                <PrintButton toolSlug="tiktok-shop-fee-calculator" />
                <EmbedModal toolSlug="tiktok-shop-fee-calculator" title="TikTok Shop Fee Calculator" />
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-5">
          <ResultCard
            primaryLabel="Real Net Profit"
            primaryValue={result.netProfit}
            secondaryLabel="Total Deductions (Fees + Costs)"
            secondaryValue={result.totalDeductions}
            payoutLabel="TikTok Bank Deposit"
            payoutValue={result.netPayout}
            breakEvenPrice={result.breakEvenPrice}
            marginPct={result.netMarginPct}
            breakdown={result.breakdown}
          />
        </div>
      </div>

      {!isEmbed && (
        <StickyResultBar
          label="Net Profit"
          value={result.netProfit}
          subLabel="Net Margin"
          subValue={result.netMarginPct}
        />
      )}
    </div>
  );
}
