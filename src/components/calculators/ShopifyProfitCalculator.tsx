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
    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      {/* Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between pb-6 border-b border-slate-100 gap-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-slate-900">
            Shopify E-Commerce Profit Architecture
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Model exact 2026 Shopify Payments rates, 3rd-party transaction fees, and Break-Even ROAS
          </p>
        </div>
        <PillTabs
          tabs={modeTabs}
          value={mode}
          onValueChange={setMode}
          label="Shopify Calculator Mode"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Retail Pricing & Shipping */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                1. Retail Pricing & Shipping
              </span>
              <span className="text-xs font-medium text-slate-500">Gross order revenue</span>
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

          {/* Card 2: Landed COGS & Fulfillment */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                2. Landed COGS & Fulfillment
              </span>
              <span className="text-xs font-medium text-slate-500">Direct unit costs</span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InputField
                label="Product Cost (COGS)"
                value={cogs}
                onChange={setCogs}
                prefix="$"
                helpText="Manufacturing, packaging, and inbound freight"
                presets={[5, 12.5, 25, 45]}
              />
              <InputField
                label="Carrier Shipping Label Cost"
                value={shippingCost}
                onChange={setShippingCost}
                prefix="$"
                helpText="What you pay USPS, UPS, or DHL for postage"
                presets={[3.5, 4.8, 8.5]}
              />
            </div>
          </div>

          {/* Card 3: Customer Acquisition / Ad Spend */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                3. Customer Acquisition Cost (CAC)
              </span>
              <span className="text-xs font-medium text-slate-500">Paid ads & marketing</span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InputField
                label="Ad Spend / CAC per Order"
                value={adSpend}
                onChange={setAdSpend}
                prefix="$"
                helpText="Blended Meta, TikTok, or Google Ads CPA"
                presets={[0, 8, 14, 22]}
              />
              {mode === "target" ? (
                <InputField
                  label="Desired Net Profit Margin"
                  value={targetMargin}
                  onChange={setTargetMargin}
                  suffix="%"
                  helpText="Target profit margin on retail sale"
                  presets={[20, 30, 40, 50]}
                />
              ) : (
                <div className="rounded-xl border border-blue-200/60 bg-blue-50/50 p-3.5 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
                      Break-Even ROAS
                    </span>
                    <span className="text-lg font-black text-blue-950 font-mono">
                      {result.breakEvenRoas}x
                    </span>
                  </div>
                  <p className="text-[11px] text-blue-700/90 mt-1 leading-snug">
                    Minimum ad return needed to avoid losing money on ad campaigns
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Card 4: Shopify Plan & Payment Gateway */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                4. Shopify Plan & Gateway
              </span>
              <span className="text-xs font-medium text-slate-500">Transaction & card processing</span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <PresetSelector
                label="Shopify Subscription Plan"
                selectedId={shopifyPlan}
                options={planOptions}
                onSelect={(id) => setShopifyPlan(id as ShopifyPlan)}
                helpText="Higher tiers offer lower credit card rates"
              />
              <PresetSelector
                label="Payment Gateway"
                selectedId={gateway}
                options={gatewayOptions}
                onSelect={setGateway}
                helpText="Shopify Payments has 0% 3rd-party fee"
              />
            </div>

            {gateway !== "shopify-payments" && (
              <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-900">
                ⚠️ <strong>External Gateway Notice:</strong> Using {gateway.toUpperCase()} adds a{" "}
                <strong>{SHOPIFY_PLAN_RATES[shopifyPlan].thirdPartyPct}%</strong> third-party transaction fee charged by Shopify on the {SHOPIFY_PLAN_RATES[shopifyPlan].name.split(" ")[0]} plan.
              </div>
            )}
          </div>

          {!isEmbed && (
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <ShareButton
                toolSlug="shopify-profit-calculator"
                getFormattedText={getFormattedSummary}
              />
              <div className="flex items-center gap-2">
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
