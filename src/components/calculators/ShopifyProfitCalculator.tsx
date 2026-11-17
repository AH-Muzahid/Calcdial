"use client";

import { useState, useMemo, useEffect } from "react";
import { calculateShopifyProfit } from "@/lib/formulas/shopify-profit";
import { SHOPIFY_GATEWAY_PRESETS } from "@/data/fee-presets";
import { InputField } from "./InputField";
import { PresetSelector } from "./PresetSelector";
import { ResultCard } from "./ResultCard";
import { StickyResultBar } from "./StickyResultBar";
import { ShareButton } from "@/components/layout/ShareButton";
import { PrintButton } from "@/components/layout/PrintButton";
import { EmbedModal } from "@/components/layout/EmbedModal";
import { trackEvent } from "@/lib/analytics";

export function ShopifyProfitCalculator({ initialGateway = "shopify-payments", isEmbed = false }: { initialGateway?: string; isEmbed?: boolean }) {
  const [revenue, setRevenue] = useState<number>(45.00);
  const [cogs, setCogs] = useState<number>(11.00);
  const [shipping, setShipping] = useState<number>(4.00);
  const [gateway, setGateway] = useState<string>(initialGateway.toLowerCase());
  const [adSpend, setAdSpend] = useState<number>(14.00);

  const result = useMemo(() => {
    return calculateShopifyProfit({
      revenue,
      cogs,
      shippingCost: shipping,
      gateway,
      adSpend,
    });
  }, [revenue, cogs, shipping, gateway, adSpend]);

  useEffect(() => {
    const timer = setTimeout(() => {
      trackEvent({
        name: "calculator_used",
        params: { tool_slug: "shopify-profit-calculator", preset: gateway },
      });
    }, 1500);
    return () => clearTimeout(timer);
  }, [revenue, gateway, adSpend]);

  const gatewayOptions = SHOPIFY_GATEWAY_PRESETS.map((g) => ({
    id: g.id,
    label: `${g.id.replace("-", " ").toUpperCase()} (${g.fees.ratePct}% + $${g.fees.fixedFee.toFixed(2)})`,
  }));

  const getFormattedSummary = () => {
    return `Shopify Profit & ROAS Analysis (2026)
----------------------------------------
Retail Price:        $${revenue.toFixed(2)}
COGS & Shipping:     $${(cogs + shipping).toFixed(2)}
Payment Gateway:     ${gateway.toUpperCase()} ($${result.paymentFee.toFixed(2)})
Ad Spend per Sale:   $${adSpend.toFixed(2)}
----------------------------------------
Gross Margin:        ${result.grossMarginPct}%
Break-Even ROAS:     ${result.breakEvenRoas}x
Net Profit:          $${result.netProfit.toFixed(2)} (${result.netMarginPct}% margin)
----------------------------------------
Calculated on CalcDial: https://calcdial.com/tools/shopify-profit-calculator`;
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-8 shadow-sm">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7 space-y-5">
          <PresetSelector
            label="Payment Gateway"
            selectedId={gateway}
            options={gatewayOptions}
            onSelect={setGateway}
            helpText="Payment processing rate and transaction fee"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InputField
              label="Retail Product Price"
              value={revenue}
              onChange={setRevenue}
              prefix="$"
            />
            <InputField
              label="Product Cost (COGS)"
              value={cogs}
              onChange={setCogs}
              prefix="$"
              helpText="Landed inventory manufacturing cost"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InputField
              label="Fulfillment / Shipping Cost"
              value={shipping}
              onChange={setShipping}
              prefix="$"
            />
            <InputField
              label="Target Ad Spend (CPA)"
              value={adSpend}
              onChange={setAdSpend}
              prefix="$"
              helpText="Marketing customer acquisition cost"
            />
          </div>

          {/* Break-Even ROAS Banner */}
          <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-900">
                  Target Break-Even ROAS
                </span>
                <p className="text-xs text-blue-700 mt-0.5">
                  Minimum Meta/Google Ads ROAS required to avoid losses
                </p>
              </div>
              <span className="text-2xl font-black text-blue-800">
                {result.breakEvenRoas}x
              </span>
            </div>
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
            primaryLabel="Net Profit"
            primaryValue={result.netProfit}
            secondaryLabel="Gross Profit (Pre-Ads)"
            secondaryValue={result.grossProfit}
            effectiveRateLabel="Gross Margin"
            effectiveRatePct={result.grossMarginPct}
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
