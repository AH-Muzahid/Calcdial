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
import { PillTabs } from "@/components/motion/pill-tabs";
import { trackEvent } from "@/lib/analytics";

export function PodProfitCalculator({ initialProduct = "t-shirts", isEmbed = false }: { initialProduct?: string; isEmbed?: boolean }) {
  const [mode, setMode] = useState<string>("profit");
  const [retail, setRetail] = useState<number>(29.99);
  const [productType, setProductType] = useState<string>(initialProduct.toLowerCase());
  const [baseCost, setBaseCost] = useState<number>(9.50);
  const [shippingCharged, setShippingCharged] = useState<number>(4.99);
  const [shippingCost, setShippingCost] = useState<number>(4.50);
  const [salesChannel, setSalesChannel] = useState<"etsy" | "shopify" | "tiktok" | "ebay" | "custom">("etsy");
  const [customFeePct, setCustomFeePct] = useState<number>(12.0);
  const [adSpend, setAdSpend] = useState<number>(4.00);
  const [targetMargin, setTargetMargin] = useState<number>(35);

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
      salesChannel,
      marketplaceFeePct: salesChannel === "custom" ? customFeePct : undefined,
      adSpendPerSale: adSpend,
      targetMarginPct: mode === "target" ? targetMargin : undefined,
    });
  }, [retail, productType, baseCost, shippingCharged, shippingCost, salesChannel, customFeePct, adSpend, mode, targetMargin]);

  useEffect(() => {
    const timer = setTimeout(() => {
      trackEvent({
        name: "calculator_used",
        params: { tool_slug: "pod-profit-calculator", preset: productType },
      });
    }, 1500);
    return () => clearTimeout(timer);
  }, [retail, productType, adSpend, salesChannel]);

  const presetOptions = POD_ITEM_PRESETS.map((p) => ({
    id: p.id,
    label: `${p.id.toUpperCase()} (Base: $${p.fees.baseCost.toFixed(2)})`,
  }));

  const channelOptions = [
    { id: "etsy", label: "Etsy (6.5% + 3% + $0.45)" },
    { id: "shopify", label: "Shopify Payments (2.9% + $0.30)" },
    { id: "tiktok", label: "TikTok Shop (6.0% + $0.30)" },
    { id: "ebay", label: "eBay (13.25% + $0.40)" },
    { id: "custom", label: "Custom Fee %" },
  ];

  const modeTabs = [
    { id: "profit", label: "Calculate Net Profit" },
    { id: "target", label: "Target Margin Pricing" },
  ];

  const getFormattedSummary = () => {
    return `Print-on-Demand Profit & Margin Architecture
----------------------------------------
Catalog Item:       ${productType.toUpperCase()}
Sales Channel:      ${salesChannel.toUpperCase()}
Retail Price:       $${retail.toFixed(2)}
Shipping Charged:   $${shippingCharged.toFixed(2)}
----------------------------------------
Print Base Cost:    $${baseCost.toFixed(2)}
Provider Shipping:  $${shippingCost.toFixed(2)}
Channel Platform:   $${result.marketplaceFee.toFixed(2)}
Ad Spend (CAC):     $${adSpend.toFixed(2)}
----------------------------------------
Total Deductions:   $${result.totalCosts.toFixed(2)}
Channel Bank Payout:$${result.marketplacePayout.toFixed(2)}
REAL NET PROFIT:    $${result.netProfit.toFixed(2)} (${result.netMarginPct}% margin)
Break-Even Retail:  $${result.breakEvenPrice.toFixed(2)}
----------------------------------------
Calculated on CalcDial: https://calcdial.com/tools/pod-profit-calculator`;
  };

  return (
    <div className="rounded-3xl border border-black/[0.08] bg-white p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      {/* Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between pb-6 border-b border-black/[0.06] gap-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-black">
            Print-on-Demand Profit Architecture
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Model exact margins across Printify, Gelato, Printful, and sales channels
          </p>
        </div>
        <PillTabs
          tabs={modeTabs}
          value={mode}
          onValueChange={setMode}
          label="POD Calculator Mode"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7 space-y-6">

          {/* Group 1: 🏷️ Retail Pricing & Sales Channel */}
          <div className="rounded-2xl border border-black/[0.06] bg-black/[0.02] p-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="flex size-5 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white">
                1
              </span>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-black">
                Retail Price & Sales Channel
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InputField
                label="Retail Selling Price"
                value={retail}
                onChange={setRetail}
                prefix="$"
                helpText="Listing price charged to customer"
                presets={[19.99, 29.99, 39.99, 49.99]}
              />
              <InputField
                label="Shipping Charged to Buyer"
                value={shippingCharged}
                onChange={setShippingCharged}
                prefix="$"
                helpText="Enter 0 for Free Shipping"
                presets={[0, 4.99, 7.99]}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <PresetSelector
                label="Where Do You Sell? (Sales Channel)"
                selectedId={salesChannel}
                options={channelOptions}
                onSelect={(val) => setSalesChannel(val as typeof salesChannel)}
                helpText="Applies real transaction and listing fees"
              />

              {salesChannel === "custom" && (
                <InputField
                  label="Custom Platform Fee %"
                  value={customFeePct}
                  onChange={setCustomFeePct}
                  suffix="%"
                />
              )}

              {mode === "target" && (
                <InputField
                  label="Target Net Profit Margin %"
                  value={targetMargin}
                  onChange={setTargetMargin}
                  suffix="%"
                  presets={[25, 35, 50]}
                />
              )}
            </div>
          </div>

          {/* Group 2: 🖨️ Provider Production & Fulfillment */}
          <div className="rounded-2xl border border-black/[0.06] bg-black/[0.02] p-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="flex size-5 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white">
                2
              </span>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-black">
                Print Provider Costs (Printify / Gelato)
              </h3>
            </div>

            <PresetSelector
              label="Product Catalog Preset"
              selectedId={productType}
              options={presetOptions}
              onSelect={handleProductChange}
              helpText="Auto-populates standard blank and printing costs"
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InputField
                label="Base Print & Blank Cost"
                value={baseCost}
                onChange={setBaseCost}
                prefix="$"
                helpText="Provider charge for garment + printing"
                presets={[8.50, 10.50, 15.00, 22.00]}
              />
              <InputField
                label="Provider Fulfillment Shipping"
                value={shippingCost}
                onChange={setShippingCost}
                prefix="$"
                helpText="Actual postage charged by print provider"
                presets={[3.99, 4.50, 6.00, 8.50]}
              />
            </div>
          </div>

          {/* Group 3: 📣 Marketing & Ad Spend */}
          <div className="rounded-2xl border border-black/[0.06] bg-black/[0.02] p-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="flex size-5 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white">
                3
              </span>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-black">
                Marketing & Customer Acquisition
              </h3>
            </div>

            <InputField
              label="Target Ad Spend per Order (CAC)"
              value={adSpend}
              onChange={setAdSpend}
              prefix="$"
              helpText="Estimated Meta / TikTok / Etsy Ads cost per conversion (enter 0 for organic sales)"
              presets={[0, 3.00, 5.00, 10.00]}
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

        {/* Right Column: Verified Outputs */}
        <div className="lg:col-span-5">
          <ResultCard
            primaryLabel="Real Net Profit"
            primaryValue={result.netProfit}
            secondaryLabel="Total Costs & Fees"
            secondaryValue={result.totalCosts}
            payoutLabel="Channel Bank Payout"
            payoutValue={result.marketplacePayout}
            breakEvenPrice={result.breakEvenPrice}
            targetPriceForMargin={mode === "target" ? result.targetPriceForMargin : undefined}
            marginPct={result.netMarginPct}
            roiPct={result.roiPct}
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
