"use client";

import { useState, useMemo, useEffect } from "react";
import { calculatePodProfit } from "@/lib/formulas/pod-profit";
import { POD_ITEM_PRESETS } from "@/data/fee-presets";
import { InputField } from "./InputField";
import { PresetSelector } from "./PresetSelector";
import { ResultCard } from "./ResultCard";
import { StickyResultBar } from "./StickyResultBar";
import { ShareButton } from "@/components/layout/ShareButton";
import { PrintButton } from "@/components/layout/PrintButton";
import { EmbedModal } from "@/components/layout/EmbedModal";
import { trackEvent } from "@/lib/analytics";

export function PodProfitCalculator({ initialProduct = "t-shirts", isEmbed = false }: { initialProduct?: string; isEmbed?: boolean }) {
  const [retail, setRetail] = useState<number>(28.00);
  const [productType, setProductType] = useState<string>(initialProduct.toLowerCase());
  const [baseCost, setBaseCost] = useState<number>(9.50);
  const [shippingCharged, setShippingCharged] = useState<number>(4.50);
  const [shippingCost, setShippingCost] = useState<number>(4.50);
  const [marketplaceFeePct, setMarketplaceFeePct] = useState<number>(12.0);
  const [adSpend, setAdSpend] = useState<number>(5.00);

  // Update base cost preset defaults when product type changes
  const handleProductChange = (type: string) => {
    setProductType(type);
    const preset = POD_ITEM_PRESETS.find((p) => p.id === type);
    if (preset) {
      setBaseCost(preset.fees.baseCost);
      setShippingCost(preset.fees.defaultShipping);
    }
  };

  const result = useMemo(() => {
    return calculatePodProfit({
      retailPrice: retail,
      productType,
      basePrintCost: baseCost,
      shippingCharged,
      shippingCost,
      marketplaceFeePct,
      adSpendPerSale: adSpend,
    });
  }, [retail, productType, baseCost, shippingCharged, shippingCost, marketplaceFeePct, adSpend]);

  useEffect(() => {
    const timer = setTimeout(() => {
      trackEvent({
        name: "calculator_used",
        params: { tool_slug: "pod-profit-calculator", preset: productType },
      });
    }, 1500);
    return () => clearTimeout(timer);
  }, [retail, productType, adSpend]);

  const presetOptions = POD_ITEM_PRESETS.map((p) => ({
    id: p.id,
    label: `${p.id.toUpperCase()} (Base: $${p.fees.baseCost.toFixed(2)})`,
  }));

  const getFormattedSummary = () => {
    return `Print-on-Demand Profit Summary
----------------------------------------
Item Type:          ${productType.toUpperCase()}
Retail Price:       $${retail.toFixed(2)}
Base Blank & Print: $${baseCost.toFixed(2)}
Platform Fees:      $${result.marketplaceFee.toFixed(2)} (${marketplaceFeePct}%)
Ad Spend:           $${adSpend.toFixed(2)}
----------------------------------------
Net Profit:         $${result.netProfit.toFixed(2)}
Net Margin:         ${result.netMarginPct}%
----------------------------------------
Calculated on CalcDial: https://calcdial.com/tools/pod-profit-calculator`;
  };

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7 space-y-5">
          <PresetSelector
            label="Product Catalog Preset"
            selectedId={productType}
            options={presetOptions}
            onSelect={handleProductChange}
            helpText="Loads standard blank and fulfillment costs"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InputField
              label="Retail Selling Price"
              value={retail}
              onChange={setRetail}
              prefix="$"
              presets={[19.99, 27.99, 34.99, 49.99]}
            />
            <InputField
              label="Base Print & Blank Cost"
              value={baseCost}
              onChange={setBaseCost}
              prefix="$"
              helpText="Provider charge (Printify, Gelato, etc.)"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InputField
              label="Shipping Charged to Buyer"
              value={shippingCharged}
              onChange={setShippingCharged}
              prefix="$"
            />
            <InputField
              label="Actual Provider Shipping Cost"
              value={shippingCost}
              onChange={setShippingCost}
              prefix="$"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InputField
              label="Marketplace / Payment Fee %"
              value={marketplaceFeePct}
              onChange={setMarketplaceFeePct}
              suffix="%"
              helpText="E.g. 12% on Etsy, 3% on Shopify"
            />
            <InputField
              label="Ad Spend / CPA per Sale"
              value={adSpend}
              onChange={setAdSpend}
              prefix="$"
              helpText="Expected marketing cost per order"
            />
          </div>

          {!isEmbed && (
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <ShareButton
                toolSlug="pod-profit-calculator"
                getFormattedText={getFormattedSummary}
              />
              <div className="flex items-center gap-2">
                <PrintButton toolSlug="pod-profit-calculator" />
                <EmbedModal toolSlug="pod-profit-calculator" title="POD Profit Calculator" />
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-5">
          <ResultCard
            primaryLabel="Estimated Net Profit"
            primaryValue={result.netProfit}
            secondaryLabel="Total Production & Ads"
            secondaryValue={result.totalCosts}
            effectiveRateLabel="Net Margin"
            effectiveRatePct={result.netMarginPct}
            breakdown={result.breakdown}
          />
        </div>
      </div>

      {!isEmbed && (
        <StickyResultBar
          label="POD Net Profit"
          value={result.netProfit}
          subLabel="Net Margin"
          subValue={result.netMarginPct}
        />
      )}
    </div>
  );
}
