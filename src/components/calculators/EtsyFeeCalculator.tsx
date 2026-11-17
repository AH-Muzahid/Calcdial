"use client";

import { useState, useMemo, useEffect } from "react";
import { calculateEtsyFees } from "@/lib/formulas/etsy-fees";
import { ETSY_FEE_PRESETS } from "@/data/fee-presets";
import { InputField } from "./InputField";
import { PresetSelector } from "./PresetSelector";
import { ResultCard } from "./ResultCard";
import { StickyResultBar } from "./StickyResultBar";
import { ShareButton } from "@/components/layout/ShareButton";
import { PrintButton } from "@/components/layout/PrintButton";
import { EmbedModal } from "@/components/layout/EmbedModal";
import { PillTabs } from "@/components/motion/pill-tabs";
import { trackEvent } from "@/lib/analytics";

interface EtsyFeeCalculatorProps {
  initialCountry?: string;
  isEmbed?: boolean;
}

export function EtsyFeeCalculator({ initialCountry = "us", isEmbed = false }: EtsyFeeCalculatorProps) {
  // Mode: "profit" (forward) or "target" (reverse pricing)
  const [mode, setMode] = useState<string>("profit");

  // Group 1: Sale & Order Details
  const [price, setPrice] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search).get("price");
      if (p && !isNaN(parseFloat(p))) return parseFloat(p);
    }
    return 35.00;
  });

  const [shippingCharged, setShippingCharged] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const s = new URLSearchParams(window.location.search).get("shipping");
      if (s && !isNaN(parseFloat(s))) return parseFloat(s);
    }
    return 5.00;
  });

  const [quantity, setQuantity] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const q = new URLSearchParams(window.location.search).get("qty");
      if (q && !isNaN(parseInt(q))) return parseInt(q);
    }
    return 1;
  });

  // Group 2: Product & Fulfillment Costs (COGS)
  const [itemCost, setItemCost] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const c = new URLSearchParams(window.location.search).get("cost");
      if (c && !isNaN(parseFloat(c))) return parseFloat(c);
    }
    return 10.00; // Default material/labor cost
  });

  const [shippingCost, setShippingCost] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const sc = new URLSearchParams(window.location.search).get("shipcost");
      if (sc && !isNaN(parseFloat(sc))) return parseFloat(sc);
    }
    return 4.50; // Default carrier postage
  });

  // Group 3: Store & Fee Settings
  const [country, setCountry] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const c = new URLSearchParams(window.location.search).get("country");
      if (c) return c.toLowerCase();
    }
    return initialCountry.toLowerCase();
  });

  const [isInternational, setIsInternational] = useState<boolean>(false);

  const [offsiteAds, setOffsiteAds] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const ads = new URLSearchParams(window.location.search).get("ads");
      if (ads === "true" || ads === "1") return true;
    }
    return false;
  });

  const [adsTier, setAdsTier] = useState<0.15 | 0.12>(0.15);

  // Target Margin for Reverse Pricing Mode
  const [targetMargin, setTargetMargin] = useState<number>(35);

  const result = useMemo(() => {
    return calculateEtsyFees({
      itemPrice: price,
      shippingCharge: shippingCharged,
      itemCost,
      shippingCost,
      quantity,
      country,
      isInternationalBuyer: isInternational,
      offsiteAdsOptIn: offsiteAds,
      offsiteAdsRate: adsTier,
      targetMarginPct: mode === "target" ? targetMargin : undefined,
    });
  }, [price, shippingCharged, itemCost, shippingCost, quantity, country, isInternational, offsiteAds, adsTier, mode, targetMargin]);

  // Track usage event
  useEffect(() => {
    const timer = setTimeout(() => {
      trackEvent({
        name: "calculator_used",
        params: { tool_slug: "etsy-fee-calculator", preset: country },
      });
    }, 1500);
    return () => clearTimeout(timer);
  }, [price, country, offsiteAds, itemCost]);

  const countryOptions = ETSY_FEE_PRESETS.map((p) => ({
    id: p.id,
    label: `${p.country} (${p.currency})`,
  }));

  const modeTabs = [
    { id: "profit", label: "Calculate Net Profit" },
    { id: "target", label: "Target Margin Pricing" },
  ];

  const getFormattedSummary = () => {
    return `Etsy Net Profit & Fee Calculation (2026)
----------------------------------------
Item Listing Price:  $${price.toFixed(2)}
Shipping Charged:    $${shippingCharged.toFixed(2)}
Item Cost (COGS):    $${itemCost.toFixed(2)}
Actual Postage:      $${shippingCost.toFixed(2)}
Country / Currency:  ${country.toUpperCase()} (${isInternational ? "Int'l Buyer" : "Domestic"})
Offsite Ads:         ${offsiteAds ? (adsTier * 100) + "%" : "Off"}
----------------------------------------
Gross Revenue:       $${result.grossRevenue.toFixed(2)}
Total Etsy Fees:     $${result.totalFees.toFixed(2)} (${result.effectiveFeePct}%)
Etsy Bank Payout:    $${result.etsyPayout.toFixed(2)}
Total Product Costs: $${result.totalProductCosts.toFixed(2)}
----------------------------------------
REAL NET PROFIT:     $${result.netProfit.toFixed(2)} (${result.netMarginPct}% margin)
Break-Even Price:    $${result.breakEvenPrice.toFixed(2)}
----------------------------------------
Calculated on CalcDial: ${typeof window !== "undefined" ? window.location.href : "https://calcdial.com"}`;
  };

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      {/* Mode Switcher Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between pb-6 border-b border-slate-100 gap-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-slate-900">
            Etsy Profit & Fee Architecture
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Switch between forward profit modeling and target margin pricing
          </p>
        </div>
        <PillTabs
          tabs={modeTabs}
          value={mode}
          onValueChange={setMode}
          label="Calculator Mode"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Grouped Inputs */}
        <div className="lg:col-span-7 space-y-6">

          {/* Group 1: 🏷️ Sale & Shipping Pricing */}
          <div className="rounded-2xl border border-slate-200/90 bg-slate-50/50 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="flex size-5 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white">
                1
              </span>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
                Sale & Customer Pricing
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InputField
                label="Item Listing Price"
                value={price}
                onChange={setPrice}
                prefix="$"
                helpText="Retail price visible to Etsy buyers"
                presets={[15, 29.99, 49.99, 99.99]}
              />
              <InputField
                label="Shipping Charged to Buyer"
                value={shippingCharged}
                onChange={setShippingCharged}
                prefix="$"
                helpText="Enter 0 if offering Free Shipping"
                presets={[0, 4.99, 8.99]}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InputField
                label="Quantity Sold in Order"
                value={quantity}
                onChange={(val) => setQuantity(Math.max(1, Math.round(val)))}
                min={1}
                step={1}
                helpText="Number of units per order"
              />

              {mode === "target" && (
                <InputField
                  label="Target Net Profit Margin %"
                  value={targetMargin}
                  onChange={setTargetMargin}
                  suffix="%"
                  helpText="Desired margin after all fees & costs"
                  presets={[25, 35, 50]}
                />
              )}
            </div>
          </div>

          {/* Group 2: 📦 Item Costs & Postage (COGS) */}
          <div className="rounded-2xl border border-slate-200/90 bg-slate-50/50 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="flex size-5 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white">
                2
              </span>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
                Your Costs & Fulfillment (COGS)
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InputField
                label="Item Cost (Materials & Labor)"
                value={itemCost}
                onChange={setItemCost}
                prefix="$"
                helpText="Raw material, blank, or manufacturing cost"
                presets={[5, 10, 18, 30]}
              />
              <InputField
                label="Actual Postage Paid to Carrier"
                value={shippingCost}
                onChange={setShippingCost}
                prefix="$"
                helpText="What you pay USPS, UPS, or post office"
                presets={[0, 3.85, 4.50, 7.50]}
              />
            </div>
          </div>

          {/* Group 3: ⚙️ Store & Fee Settings */}
          <div className="rounded-2xl border border-slate-200/90 bg-slate-50/50 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="flex size-5 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white">
                3
              </span>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
                Etsy Payments & Location Rules
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <PresetSelector
                label="Seller Bank Country"
                selectedId={country}
                options={countryOptions}
                onSelect={setCountry}
                helpText="Applies verified 2026 payment processing rates"
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Buyer Location
                </label>
                <div className="flex items-center gap-2 h-11">
                  <button
                    type="button"
                    onClick={() => setIsInternational(false)}
                    className={`flex-1 h-full rounded-xl text-xs font-semibold border transition-all ${
                      !isInternational
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    Domestic
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsInternational(true)}
                    className={`flex-1 h-full rounded-xl text-xs font-semibold border transition-all ${
                      isInternational
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    International (+1%)
                  </button>
                </div>
                <p className="text-[11px] text-slate-500">Cross-border payment fee</p>
              </div>
            </div>

            {/* Offsite Ads Toggle */}
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-semibold text-slate-800 cursor-pointer">
                    Etsy Offsite Ads
                  </label>
                  <p className="text-[11px] text-slate-500">
                    Charged when buyers find you via external search engine ads
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={offsiteAds}
                  onChange={(e) => setOffsiteAds(e.target.checked)}
                  className="size-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
              </div>

              {offsiteAds && (
                <div className="mt-3 flex gap-4 pt-3 border-t border-slate-100 text-xs">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="adsTier"
                      checked={adsTier === 0.15}
                      onChange={() => setAdsTier(0.15)}
                      className="text-emerald-600"
                    />
                    <span>15% (Under $10k/yr annual shop sales)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="adsTier"
                      checked={adsTier === 0.12}
                      onChange={() => setAdsTier(0.12)}
                      className="text-emerald-600"
                    />
                    <span>12% ($10k+ mandatory tier)</span>
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Action Toolbars */}
          {!isEmbed && (
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <ShareButton
                toolSlug="etsy-fee-calculator"
                getFormattedText={getFormattedSummary}
              />
              <div className="flex items-center gap-2">
                <PrintButton toolSlug="etsy-fee-calculator" />
                <EmbedModal toolSlug="etsy-fee-calculator" title="Etsy Fee Calculator" />
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Verified 3-Pillar Outputs */}
        <div className="lg:col-span-5">
          <ResultCard
            primaryLabel="Real Net Profit"
            primaryValue={result.netProfit}
            secondaryLabel="Total Deductions (Fees + Costs)"
            secondaryValue={Number((result.totalFees + result.totalProductCosts).toFixed(2))}
            payoutLabel="Etsy Bank Deposit"
            payoutValue={result.etsyPayout}
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
          label="Net Profit"
          value={result.netProfit}
          subLabel="Margin %"
          subValue={result.netMarginPct}
        />
      )}
    </div>
  );
}
