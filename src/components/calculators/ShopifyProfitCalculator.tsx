"use client";

import { useState, useMemo, useEffect } from "react";
import {
  calculateShopifyProfit,
  ShopifyPlan,
  SHOPIFY_PLAN_RATES,
} from "@/lib/formulas/shopify-profit";
import { SHOPIFY_GATEWAY_PRESETS } from "@/data/fee-presets";
import { InputField } from "./InputField";
import { PresetSelector } from "./PresetSelector";
import { ResultCard } from "./ResultCard";
import { StickyResultBar } from "./StickyResultBar";
import { ShareButton } from "@/components/layout/ShareButton";
import { PrintButton } from "@/components/layout/PrintButton";
import { EmbedModal } from "@/components/layout/EmbedModal";
import { PillTabs } from "@/components/motion/pill-tabs";
import { trackEvent } from "@/lib/analytics";

export function ShopifyProfitCalculator({
  initialGateway = "shopify-payments",
  isEmbed = false,
}: {
  initialGateway?: string;
  isEmbed?: boolean;
}) {
  const [mode, setMode] = useState<string>("profit");
  const [itemPrice, setItemPrice] = useState<number>(48.00);
  const [shippingCharged, setShippingCharged] = useState<number>(0.00);
  const [cogs, setCogs] = useState<number>(12.50);
  const [shippingCost, setShippingCost] = useState<number>(4.80);
  const [adSpend, setAdSpend] = useState<number>(14.00);
  const [shopifyPlan, setShopifyPlan] = useState<ShopifyPlan>("basic");
  const [gateway, setGateway] = useState<string>(initialGateway.toLowerCase());
  const [targetMargin, setTargetMargin] = useState<number>(30);

  const handleReset = () => {
    setItemPrice(48.00);
    setShippingCharged(0.00);
    setCogs(12.50);
    setShippingCost(4.80);
    setAdSpend(14.00);
    setShopifyPlan("basic");
    setGateway(initialGateway.toLowerCase());
    setTargetMargin(30);
  };

  const result = useMemo(() => {
    return calculateShopifyProfit({
      itemPrice,
      shippingCharged,
      cogs,
      shippingCost,
      adSpend,
      shopifyPlan,
      gateway,
      targetMarginPct: mode === "target" ? targetMargin : undefined,
    });
  }, [itemPrice, shippingCharged, cogs, shippingCost, adSpend, shopifyPlan, gateway, mode, targetMargin]);

  useEffect(() => {
    const timer = setTimeout(() => {
      trackEvent({
        name: "calculator_used",
        params: { tool_slug: "shopify-profit-calculator", preset: `${shopifyPlan}-${gateway}` },
      });
    }, 1500);
    return () => clearTimeout(timer);
  }, [itemPrice, gateway, shopifyPlan, adSpend]);

  const planOptions = (Object.keys(SHOPIFY_PLAN_RATES) as ShopifyPlan[]).map((planKey) => ({
    id: planKey,
    label: SHOPIFY_PLAN_RATES[planKey].name,
  }));

  const gatewayOptions = SHOPIFY_GATEWAY_PRESETS.map((g) => ({
    id: g.id,
    label: `${g.id.replace("-", " ").toUpperCase()} (${g.fees.ratePct}% + $${g.fees.fixedFee.toFixed(2)})`,
  }));

  const modeTabs = [
    { id: "profit", label: "Calculate Net Profit" },
    { id: "target", label: "Target Margin Pricing" },
  ];

  const getFormattedSummary = () => {
    return `Shopify Profit & ROAS Analysis (2026)
----------------------------------------
Shopify Plan:        ${SHOPIFY_PLAN_RATES[shopifyPlan].name}
Payment Gateway:     ${gateway.toUpperCase()} ($${result.paymentFee.toFixed(2)})
Retail Price:        $${itemPrice.toFixed(2)}
Shipping Charged:    $${shippingCharged.toFixed(2)}
----------------------------------------
COGS (Landed Cost):  $${cogs.toFixed(2)}
Carrier Postage:     $${shippingCost.toFixed(2)}
Ad Spend (CAC):      $${adSpend.toFixed(2)}
Shopify Fees:        $${result.totalPlatformFees.toFixed(2)}
----------------------------------------
Shopify Bank Payout: $${result.netPayout.toFixed(2)}
REAL NET PROFIT:     $${result.netProfit.toFixed(2)} (${result.netMarginPct}% margin)
Break-Even ROAS:     ${result.breakEvenRoas}x
Break-Even Price:    $${result.breakEvenPrice.toFixed(2)}
----------------------------------------
Calculated on CalcDial: https://calcdial.com/tools/shopify-profit-calculator`;
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-xs">
      {/* Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-zinc-100 gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-zinc-950">
            Shopify E-Commerce Profit Architecture
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Model exact 2026 Shopify Payments rates, 3rd-party transaction fees, and Break-Even ROAS
          </p>
        </div>
        <div className="flex items-center gap-3">
          <PillTabs
            tabs={modeTabs}
            value={mode}
            onValueChange={setMode}
            label="Shopify Calculator Mode"
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

          {/* Group 1: Retail Pricing & Shipping */}
          <div className="space-y-4 pb-6 border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <span className="flex size-5 items-center justify-center rounded-full bg-zinc-950 text-[10px] font-bold font-mono text-white">
                1
              </span>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-900">
                Retail Pricing & Shipping
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InputField
                label="Retail Selling Price"
                value={itemPrice}
                onChange={setItemPrice}
                prefix="$"
                presets={[29, 49, 79, 129]}
              />
              <InputField
                label="Shipping Charged to Buyer"
                value={shippingCharged}
                onChange={setShippingCharged}
                prefix="$"
                helpText="Enter $0.00 if offering Free Shipping"
                presets={[0, 4.99, 7.99]}
              />
            </div>
          </div>

          {/* Group 2: Landed COGS & Fulfillment */}
          <div className="space-y-4 pb-6 border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <span className="flex size-5 items-center justify-center rounded-full bg-zinc-950 text-[10px] font-bold font-mono text-white">
                2
              </span>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-900">
                Unit Costs & Fulfillment (COGS)
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InputField
                label="Product Manufacturing / COGS"
                value={cogs}
                onChange={setCogs}
                prefix="$"
                helpText="Landed inventory cost per unit"
                presets={[8, 12.50, 20, 35]}
              />
              <InputField
                label="Carrier Shipping Postage"
                value={shippingCost}
                onChange={setShippingCost}
                prefix="$"
                helpText="Actual postage paid to carrier"
                presets={[0, 4.80, 8.50, 12.00]}
              />
            </div>
          </div>

          {/* Group 3: Plan, Gateway & Ad Spend */}
          <div className="space-y-4 pb-6 border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <span className="flex size-5 items-center justify-center rounded-full bg-zinc-950 text-[10px] font-bold font-mono text-white">
                3
              </span>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-900">
                Shopify Plan & Payment Gateway
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <PresetSelector
                label="Shopify Subscription Plan"
                selectedId={shopifyPlan}
                options={planOptions}
                onSelect={(val) => setShopifyPlan(val as ShopifyPlan)}
                helpText="Determines transaction fee tiers"
              />

              <PresetSelector
                label="Payment Gateway"
                selectedId={gateway}
                options={gatewayOptions}
                onSelect={setGateway}
                helpText="Shopify Payments vs 3rd party penalty"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InputField
                label="Ad Spend per Attributed Order (CAC)"
                value={adSpend}
                onChange={setAdSpend}
                prefix="$"
                helpText="Blended customer acquisition cost"
                presets={[0, 8, 14, 25]}
              />

              {mode === "target" && (
                <InputField
                  label="Target Net Profit Margin %"
                  value={targetMargin}
                  onChange={setTargetMargin}
                  suffix="%"
                  presets={[20, 30, 40]}
                />
              )}
            </div>
          </div>

          {!isEmbed && (
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <ShareButton
                toolSlug="shopify-profit-calculator"
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
                <PrintButton toolSlug="shopify-profit-calculator" />
                <EmbedModal toolSlug="shopify-profit-calculator" title="Shopify Profit Calculator" />
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-5">
          <ResultCard
            primaryLabel="Real Net Profit"
            primaryValue={result.netProfit}
            secondaryLabel="Total Store Costs"
            secondaryValue={result.totalExpenses}
            payoutLabel="Shopify Bank Deposit"
            payoutValue={result.netPayout}
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
          label="Shopify Profit"
          value={result.netProfit}
          subLabel="Min ROAS"
          subValue={result.breakEvenRoas}
        />
      )}
    </div>
  );
}
