"use client";

import { useState, useMemo, useEffect } from "react";
import { compareMarketplaces } from "@/lib/formulas/platform-comparison";
import { ETSY_FEE_PRESETS } from "@/data/fee-presets";
import { InputField } from "./InputField";
import { PresetSelector } from "./PresetSelector";
import { ComparisonTable } from "./ComparisonTable";
import { StickyResultBar } from "./StickyResultBar";
import { ShareButton } from "@/components/layout/ShareButton";
import { PrintButton } from "@/components/layout/PrintButton";
import { EmbedModal } from "@/components/layout/EmbedModal";
import { trackEvent } from "@/lib/analytics";

export function MarketplaceComparison({ isEmbed = false }: { isEmbed?: boolean }) {
  const [sellingPrice, setSellingPrice] = useState<number>(35.00);
  const [cogs, setCogs] = useState<number>(10.00);
  const [shippingCharge, setShippingCharge] = useState<number>(4.00);
  const [shippingCost, setShippingCost] = useState<number>(4.00);
  const [country, setCountry] = useState<string>("us");

  const comparison = useMemo(() => {
    return compareMarketplaces({
      sellingPrice,
      cogs,
      shippingCharge,
      shippingCost,
      country,
    });
  }, [sellingPrice, cogs, shippingCharge, shippingCost, country]);

  useEffect(() => {
    const timer = setTimeout(() => {
      trackEvent({
        name: "calculator_used",
        params: { tool_slug: "etsy-vs-shopify-vs-tiktok-shop-calculator", preset: country },
      });
    }, 1500);
    return () => clearTimeout(timer);
  }, [sellingPrice, country]);

  const countryOptions = ETSY_FEE_PRESETS.map((p) => ({
    id: p.id,
    label: `${p.country} (${p.currency})`,
  }));

  const getFormattedSummary = () => {
    return `Marketplace Net Profit Comparison (2026)
----------------------------------------
Common Selling Price: $${sellingPrice.toFixed(2)}
COGS & Fulfillment:   $${(cogs + shippingCost).toFixed(2)}
----------------------------------------
${comparison.results.map((r) => `${r.platform.padEnd(12)}: Net Profit $${r.netProfit.toFixed(2)} (${r.netMarginPct}% margin)`).join("\n")}
----------------------------------------
Winner: ${comparison.winner.platform} (Net Profit $${comparison.winner.netProfit.toFixed(2)})
Calculated on CalcDial: https://calcdial.com/tools/etsy-vs-shopify-vs-tiktok-shop-calculator`;
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-8 shadow-sm space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <InputField
          label="Item Retail Price"
          value={sellingPrice}
          onChange={setSellingPrice}
          prefix="$"
        />
        <InputField
          label="Product COGS"
          value={cogs}
          onChange={setCogs}
          prefix="$"
        />
        <InputField
          label="Shipping Charged"
          value={shippingCharge}
          onChange={setShippingCharge}
          prefix="$"
        />
        <InputField
          label="Shipping Fulfillment Cost"
          value={shippingCost}
          onChange={setShippingCost}
          prefix="$"
        />
        <PresetSelector
          label="Seller Country"
          selectedId={country}
          options={countryOptions}
          onSelect={setCountry}
        />
      </div>

      {/* Comparison Fact Box */}
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-sm">
            ✓
          </span>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Highest Margin Recommendation
            </span>
            <p className="text-sm font-semibold text-emerald-950 mt-0.5">
              {comparison.dataSnippet}
            </p>
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison Table */}
      <ComparisonTable results={comparison.results} />

      {!isEmbed && (
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <ShareButton
            toolSlug="etsy-vs-shopify-vs-tiktok-shop-calculator"
            getFormattedText={getFormattedSummary}
          />
          <div className="flex items-center gap-2">
            <PrintButton toolSlug="etsy-vs-shopify-vs-tiktok-shop-calculator" />
            <EmbedModal toolSlug="etsy-vs-shopify-vs-tiktok-shop-calculator" title="Etsy vs Shopify vs TikTok Shop Calculator" />
          </div>
        </div>
      )}

      {!isEmbed && (
        <StickyResultBar
          label={`Winner: ${comparison.winner.platform}`}
          value={comparison.winner.netProfit}
          subLabel="Net Margin"
          subValue={comparison.winner.netMarginPct}
        />
      )}
    </div>
  );
}
