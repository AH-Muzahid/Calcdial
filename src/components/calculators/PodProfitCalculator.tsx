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
  const [retail, setRetail] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search).get("price");
      if (p && !isNaN(parseFloat(p))) return parseFloat(p);
    }
    return 29.99;
  });
  const [productType, setProductType] = useState<string>(initialProduct.toLowerCase());
  const [baseCost, setBaseCost] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const c = new URLSearchParams(window.location.search).get("cost");
      if (c && !isNaN(parseFloat(c))) return parseFloat(c);
    }
    return 9.50;
  });
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

  const handleReset = () => {
    setRetail(29.99);
    setProductType(initialProduct.toLowerCase());
    setBaseCost(9.50);
    setShippingCharged(4.99);
    setShippingCost(4.50);
    setSalesChannel("etsy");
    setCustomFeePct(12.0);
    setAdSpend(4.00);
    setTargetMargin(35);
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
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-xs">
      {/* Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-zinc-100 gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-zinc-950">
            Print-on-Demand Profit Architecture
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Model exact margins across Printify, Gelato, Printful, and sales channels
          </p>
        </div>
        <div className="flex items-center gap-3">
          <PillTabs
            tabs={modeTabs}
            value={mode}
            onValueChange={setMode}
            label="POD Calculator Mode"
          />
          <button
            type="button"
            onClick={handleReset}
            className="hidden sm:inline-flex items-center gap-1 text-xs font-mono text-zinc-400 hover:text-zinc-900 transition-colors cursor-pointer"
            title="Reset to defaults"
          >
            <span>↺</span>
            <span>Reset</span>
          </button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7 space-y-6">

          {/* Group 1: 🏷️ Retail Pricing & Sales Channel */}
          <div className="space-y-4 pb-6 border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <span className="flex size-5 items-center justify-center rounded-full bg-zinc-950 text-[10px] font-bold font-mono text-white">
                1
              </span>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-900">
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
          <div className="space-y-4 pb-6 border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <span className="flex size-5 items-center justify-center rounded-full bg-zinc-950 text-[10px] font-bold font-mono text-white">
                2
              </span>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-900">
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
                label="Base Item Print Cost"
                value={baseCost}
                onChange={setBaseCost}
                prefix="$"
                helpText="Manufacturing fee invoiced by print lab"
                presets={[8.00, 9.50, 14.00, 22.00]}
              />
              <InputField
                label="Fulfillment Postage to Print Lab"
                value={shippingCost}
                onChange={setShippingCost}
                prefix="$"
                helpText="Shipping cost paid to production provider"
                presets={[3.99, 4.50, 7.50]}
              />
            </div>
          </div>

          {/* Group 3: 📣 Customer Acquisition / Ad Spend */}
          <div className="space-y-4 pb-6 border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <span className="flex size-5 items-center justify-center rounded-full bg-zinc-950 text-[10px] font-bold font-mono text-white">
                3
              </span>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-900">
                Marketing & Customer Acquisition Cost (CAC)
              </h3>
            </div>

            <InputField
              label="Ad Spend / Marketing Allocation per Order"
              value={adSpend}
              onChange={setAdSpend}
              prefix="$"
              helpText="Meta, TikTok, or Etsy search advertising cost per attributed sale"
              presets={[0, 3.50, 6.00, 10.00]}
            />
          </div>

          {!isEmbed && (
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <ShareButton
                toolSlug="pod-profit-calculator"
                getFormattedText={getFormattedSummary}
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-mono text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950 transition-colors"
                >
                  <span>↺</span>
                  <span>Reset Form</span>
                </button>
                <PrintButton toolSlug="pod-profit-calculator" />
                <EmbedModal toolSlug="pod-profit-calculator" title="Print-on-Demand Profit Calculator" />
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Verified Outputs */}
        <div className="hidden lg:block lg:col-span-5">
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
            currentTool={isEmbed ? undefined : "pod-profit-calculator"}
            toolPrice={retail}
            toolCost={baseCost}
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
