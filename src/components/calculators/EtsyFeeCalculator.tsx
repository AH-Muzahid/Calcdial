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
import { trackEvent } from "@/lib/analytics";

interface EtsyFeeCalculatorProps {
  initialCountry?: string;
  isEmbed?: boolean;
}

export function EtsyFeeCalculator({ initialCountry = "us", isEmbed = false }: EtsyFeeCalculatorProps) {
  const [price, setPrice] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search).get("price");
      if (p && !isNaN(parseFloat(p))) return parseFloat(p);
    }
    return 29.99;
  });

  const [shipping, setShipping] = useState<number>(() => {
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

  const [country, setCountry] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const c = new URLSearchParams(window.location.search).get("country");
      if (c) return c.toLowerCase();
    }
    return initialCountry.toLowerCase();
  });

  const [offsiteAds, setOffsiteAds] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const ads = new URLSearchParams(window.location.search).get("ads");
      if (ads === "true" || ads === "1") return true;
    }
    return false;
  });

  const [adsTier, setAdsTier] = useState<0.15 | 0.12>(0.15);

  const result = useMemo(() => {
    return calculateEtsyFees({
      itemPrice: price,
      shippingCharge: shipping,
      quantity,
      country,
      offsiteAdsOptIn: offsiteAds,
      offsiteAdsRate: adsTier,
    });
  }, [price, shipping, quantity, country, offsiteAds, adsTier]);

  // Track usage event
  useEffect(() => {
    const timer = setTimeout(() => {
      trackEvent({
        name: "calculator_used",
        params: { tool_slug: "etsy-fee-calculator", preset: country },
      });
    }, 1500);
    return () => clearTimeout(timer);
  }, [price, country, offsiteAds]);

  const countryOptions = ETSY_FEE_PRESETS.map((p) => ({
    id: p.id,
    label: `${p.country} (${p.currency})`,
  }));

  const getFormattedSummary = () => {
    return `Etsy Fee Calculation (2026)
----------------------------------------
Item Price:       $${price.toFixed(2)}
Shipping Charged: $${shipping.toFixed(2)}
Country:          ${country.toUpperCase()}
Offsite Ads:      ${offsiteAds ? (adsTier * 100) + "%" : "Off"}
----------------------------------------
Total Gross:      $${result.grossRevenue.toFixed(2)}
Total Etsy Fees:  $${result.totalFees.toFixed(2)} (${result.effectiveFeePct}%)
Net Seller Payout:$${result.netProfit.toFixed(2)}
----------------------------------------
Calculated on CalcDial: ${typeof window !== "undefined" ? window.location.href : "https://calcdial.com"}`;
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-8 shadow-sm">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Inputs */}
        <div className="lg:col-span-7 space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InputField
              label="Item Sale Price"
              value={price}
              onChange={setPrice}
              prefix="$"
              helpText="Buyer retail listing price"
            />
            <InputField
              label="Shipping Charged"
              value={shipping}
              onChange={setShipping}
              prefix="$"
              helpText="Paid by buyer (enter 0 for free shipping)"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <PresetSelector
              label="Seller Country (Etsy Payments)"
              selectedId={country}
              options={countryOptions}
              onSelect={setCountry}
              helpText="Determines payment processing rates"
            />
            <InputField
              label="Order Quantity"
              value={quantity}
              onChange={(val) => setQuantity(Math.max(1, Math.round(val)))}
              min={1}
              step={1}
              helpText="Number of items in listing sale"
            />
          </div>

          {/* Offsite Ads Toggle */}
          <div className="rounded-xl border border-gray-200 bg-gray-50/60 p-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-semibold text-gray-800 cursor-pointer">
                  Etsy Offsite Ads
                </label>
                <p className="text-[11px] text-gray-500">
                  Applied when buyers find you via Google/Bing ads
                </p>
              </div>
              <input
                type="checkbox"
                checked={offsiteAds}
                onChange={(e) => setOffsiteAds(e.target.checked)}
                className="h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
            </div>

            {offsiteAds && (
              <div className="mt-3 flex gap-4 pt-2 border-t border-gray-200 text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="adsTier"
                    checked={adsTier === 0.15}
                    onChange={() => setAdsTier(0.15)}
                    className="text-emerald-600"
                  />
                  <span>15% (Under $10k/yr sales)</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="adsTier"
                    checked={adsTier === 0.12}
                    onChange={() => setAdsTier(0.12)}
                    className="text-emerald-600"
                  />
                  <span>12% ($10k+ mandatory)</span>
                </label>
              </div>
            )}
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

        {/* Right Column: Instant Results */}
        <div className="lg:col-span-5">
          <ResultCard
            primaryLabel="Net Seller Payout"
            primaryValue={result.netProfit}
            secondaryLabel="Total Etsy Deductions"
            secondaryValue={result.totalFees}
            effectiveRateLabel="Effective Fee"
            effectiveRatePct={result.effectiveFeePct}
            breakdown={result.breakdown}
          />
        </div>
      </div>

      {!isEmbed && (
        <StickyResultBar
          label="Net Payout"
          value={result.netProfit}
          subLabel="Etsy Fee %"
          subValue={result.effectiveFeePct}
        />
      )}
    </div>
  );
}
