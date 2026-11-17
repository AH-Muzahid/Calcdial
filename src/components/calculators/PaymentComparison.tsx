"use client";

import { useState, useMemo, useEffect } from "react";
import { comparePaymentProcessors } from "@/lib/formulas/stripe-vs-paypal";
import { PAYMENT_CURRENCY_PRESETS } from "@/data/fee-presets";
import { InputField } from "./InputField";
import { PresetSelector } from "./PresetSelector";
import { StickyResultBar } from "./StickyResultBar";
import { ShareButton } from "@/components/layout/ShareButton";
import { PrintButton } from "@/components/layout/PrintButton";
import { EmbedModal } from "@/components/layout/EmbedModal";
import { trackEvent } from "@/lib/analytics";
import { formatCurrency } from "@/lib/utils";

export function PaymentComparison({ isEmbed = false }: { isEmbed?: boolean }) {
  const [targetPayout, setTargetPayout] = useState<number>(1000.00);
  const [currency, setCurrency] = useState<string>("usd");
  const [isInternational, setIsInternational] = useState<boolean>(false);
  const [currencyConversion, setCurrencyConversion] = useState<boolean>(false);

  const result = useMemo(() => {
    return comparePaymentProcessors({
      targetPayout,
      currency,
      isInternational,
      currencyConversion,
    });
  }, [targetPayout, currency, isInternational, currencyConversion]);

  useEffect(() => {
    const timer = setTimeout(() => {
      trackEvent({
        name: "calculator_used",
        params: { tool_slug: "stripe-vs-paypal-fee-calculator", preset: currency },
      });
    }, 1500);
    return () => clearTimeout(timer);
  }, [targetPayout, currency, isInternational]);

  const currencyOptions = PAYMENT_CURRENCY_PRESETS.map((p) => ({
    id: p.id,
    label: `${p.country} (${p.currency})`,
  }));

  const getFormattedSummary = () => {
    return `Stripe vs PayPal Gross-up Analysis (2026)
----------------------------------------
Target Net Payout:     ${result.currencySymbol}${targetPayout.toFixed(2)}
Stripe Invoice Amount: ${result.currencySymbol}${result.stripe.invoiceToReceiveTarget.toFixed(2)} (Fee: ${result.currencySymbol}${result.stripe.feeOnGrossUp.toFixed(2)})
PayPal Invoice Amount: ${result.currencySymbol}${result.paypal.invoiceToReceiveTarget.toFixed(2)} (Fee: ${result.currencySymbol}${result.paypal.feeOnGrossUp.toFixed(2)})
----------------------------------------
Recommended: ${result.recommended} (Saves ${result.currencySymbol}${result.savingsOnGrossUp.toFixed(2)})
Calculated on FeeSnap: https://feesnap.com/tools/stripe-vs-paypal-fee-calculator`;
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-8 shadow-sm space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InputField
          label="Desired Net Payout Amount"
          value={targetPayout}
          onChange={setTargetPayout}
          prefix={result.currencySymbol}
          helpText="The exact amount you want in your bank account"
        />
        <PresetSelector
          label="Settlement Currency"
          selectedId={currency}
          options={currencyOptions}
          onSelect={setCurrency}
        />
      </div>

      {/* Surcharge Toggles */}
      <div className="flex flex-wrap items-center gap-6 rounded-xl border border-gray-200 bg-gray-50/70 p-4 text-xs font-medium text-gray-700">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isInternational}
            onChange={(e) => setIsInternational(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
          />
          <span>International Payment Card (+1.5%)</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={currencyConversion}
            onChange={(e) => setCurrencyConversion(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
          />
          <span>Currency Conversion (+1.0% to 3.0%)</span>
        </label>
      </div>

      {/* Result Cards Grid: Stripe vs PayPal */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Stripe Card */}
        <div className="rounded-2xl border-2 border-emerald-500/40 bg-emerald-50/20 p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Stripe</h3>
            <span className="rounded bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white">
              {result.stripe.ratePct}% + {result.currencySymbol}{result.stripe.fixedFee.toFixed(2)}
            </span>
          </div>

          <div className="mt-4 border-t border-emerald-100 pt-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Invoice This Amount to Client (Gross-Up)
            </span>
            <div className="mt-1 text-3xl font-extrabold text-emerald-600">
              {formatCurrency(result.stripe.invoiceToReceiveTarget, result.currency)}
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Stripe fee deducted: {formatCurrency(result.stripe.feeOnGrossUp, result.currency)}
            </p>
          </div>

          <div className="mt-4 rounded-lg bg-white p-3 text-xs border border-emerald-100">
            <span className="text-gray-500">If client pays exact {result.currencySymbol}{targetPayout}:</span>
            <div className="font-semibold text-gray-900 mt-0.5">
              You receive: {formatCurrency(result.stripe.payoutOnDirectTarget, result.currency)}
            </div>
          </div>
        </div>

        {/* PayPal Card */}
        <div className="rounded-2xl border border-gray-200 bg-gray-50/50 p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">PayPal</h3>
            <span className="rounded bg-gray-200 px-2.5 py-1 text-xs font-semibold text-gray-700">
              {result.paypal.ratePct}% + {result.currencySymbol}{result.paypal.fixedFee.toFixed(2)}
            </span>
          </div>

          <div className="mt-4 border-t border-gray-200 pt-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Invoice This Amount to Client (Gross-Up)
            </span>
            <div className="mt-1 text-3xl font-extrabold text-gray-800">
              {formatCurrency(result.paypal.invoiceToReceiveTarget, result.currency)}
            </div>
            <p className="mt-1 text-xs text-gray-500">
              PayPal fee deducted: {formatCurrency(result.paypal.feeOnGrossUp, result.currency)}
            </p>
          </div>

          <div className="mt-4 rounded-lg bg-white p-3 text-xs border border-gray-200">
            <span className="text-gray-500">If client pays exact {result.currencySymbol}{targetPayout}:</span>
            <div className="font-semibold text-gray-900 mt-0.5">
              You receive: {formatCurrency(result.paypal.payoutOnDirectTarget, result.currency)}
            </div>
          </div>
        </div>
      </div>

      {/* Recommendation Banner */}
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-4 text-xs sm:text-sm text-emerald-950">
        <strong>Recommendation: </strong>
        {result.dataSnippet}
      </div>

      {!isEmbed && (
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <ShareButton
            toolSlug="stripe-vs-paypal-fee-calculator"
            getFormattedText={getFormattedSummary}
          />
          <div className="flex items-center gap-2">
            <PrintButton toolSlug="stripe-vs-paypal-fee-calculator" />
            <EmbedModal toolSlug="stripe-vs-paypal-fee-calculator" title="Stripe vs PayPal Fee Calculator" />
          </div>
        </div>
      )}

      {!isEmbed && (
        <StickyResultBar
          label="Stripe Gross-Up"
          value={result.stripe.invoiceToReceiveTarget}
          subLabel="PayPal Gross-Up"
          subValue={result.paypal.invoiceToReceiveTarget}
        />
      )}
    </div>
  );
}
