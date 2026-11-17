"use client";

import { useState, useMemo, useEffect } from "react";
import {
  comparePaymentProcessors,
  PaymentMode,
  TransactionType,
} from "@/lib/formulas/stripe-vs-paypal";
import { PAYMENT_CURRENCY_PRESETS } from "@/data/fee-presets";
import { InputField } from "./InputField";
import { PresetSelector } from "./PresetSelector";
import { StickyResultBar } from "./StickyResultBar";
import { ShareButton } from "@/components/layout/ShareButton";
import { PrintButton } from "@/components/layout/PrintButton";
import { EmbedModal } from "@/components/layout/EmbedModal";
import { PillTabs } from "@/components/motion/pill-tabs";
import { trackEvent } from "@/lib/analytics";
import { formatCurrency } from "@/lib/utils";

export function PaymentComparison({ isEmbed = false }: { isEmbed?: boolean }) {
  const [mode, setMode] = useState<PaymentMode>("direct");
  const [amount, setAmount] = useState<number>(100.00);
  const [currency, setCurrency] = useState<string>("usd");
  const [transactionType, setTransactionType] = useState<TransactionType>("checkout");
  const [isInternational, setIsInternational] = useState<boolean>(false);
  const [currencyConversion, setCurrencyConversion] = useState<boolean>(false);
  const [monthlyVolume, setMonthlyVolume] = useState<number>(5000);

  const handleReset = () => {
    setMode("direct");
    setAmount(100.00);
    setCurrency("usd");
    setTransactionType("checkout");
    setIsInternational(false);
    setCurrencyConversion(false);
    setMonthlyVolume(5000);
  };

  const result = useMemo(() => {
    return comparePaymentProcessors({
      amount,
      currency,
      transactionType,
      isInternational,
      currencyConversion,
      monthlyVolume,
      averageTicket: amount > 0 ? amount : 100,
    });
  }, [amount, currency, transactionType, isInternational, currencyConversion, monthlyVolume]);

  useEffect(() => {
    const timer = setTimeout(() => {
      trackEvent({
        name: "calculator_used",
        params: { tool_slug: "stripe-vs-paypal-fee-calculator", preset: `${currency}-${transactionType}` },
      });
    }, 1500);
    return () => clearTimeout(timer);
  }, [amount, currency, transactionType, isInternational]);

  const currencyOptions = PAYMENT_CURRENCY_PRESETS.map((p) => ({
    id: p.id,
    label: `${p.country} (${p.currency})`,
  }));

  const modeTabs = [
    { id: "direct", label: "Fee on Payment ($ Charge)" },
    { id: "gross-up", label: "Invoice Gross-Up (Cover Fees)" },
  ];

  const typeOptions = [
    { id: "checkout", label: "Online Card Checkout (eCommerce)" },
    { id: "invoice", label: "Client Invoicing (B2B / Freelance)" },
  ];

  const getFormattedSummary = () => {
    if (mode === "gross-up") {
      return `Stripe vs PayPal Client Gross-Up Analysis (2026)
----------------------------------------
Target Net Payout:     ${result.currencySymbol}${amount.toFixed(2)}
Payment Type:          ${transactionType === "invoice" ? "Digital Invoicing" : "Online Checkout"}
----------------------------------------
Stripe Invoice Amount: ${result.currencySymbol}${result.stripe.invoiceToReceiveTarget.toFixed(2)} (Fee: ${result.currencySymbol}${result.stripe.feeOnGrossUp.toFixed(2)})
PayPal Invoice Amount: ${result.currencySymbol}${result.paypal.invoiceToReceiveTarget.toFixed(2)} (Fee: ${result.currencySymbol}${result.paypal.feeOnGrossUp.toFixed(2)})
----------------------------------------
Recommended: ${result.recommended} (Saves ${result.currencySymbol}${result.savingsOnGrossUp.toFixed(2)} per invoice)
Annual Volume Savings: ${result.currencySymbol}${result.annualSavings.toLocaleString()} at ${result.currencySymbol}${monthlyVolume.toLocaleString()}/mo volume
Calculated on CalcDial: https://calcdial.com/tools/stripe-vs-paypal-fee-calculator`;
    }

    return `Stripe vs PayPal Payment Fee Breakdown (2026)
----------------------------------------
Charge Amount:         ${result.currencySymbol}${amount.toFixed(2)}
Stripe Cut:            -${result.currencySymbol}${result.stripe.feeOnCharge.toFixed(2)} (${result.stripe.ratePct}% + ${result.currencySymbol}${result.stripe.fixedFee.toFixed(2)}) -> Deposit: ${result.currencySymbol}${result.stripe.netPayoutOnCharge.toFixed(2)}
PayPal Cut:            -${result.currencySymbol}${result.paypal.feeOnCharge.toFixed(2)} (${result.paypal.ratePct}% + ${result.currencySymbol}${result.paypal.fixedFee.toFixed(2)}) -> Deposit: ${result.currencySymbol}${result.paypal.netPayoutOnCharge.toFixed(2)}
----------------------------------------
Recommended:           ${result.recommended} (Keeps ${result.currencySymbol}${Math.abs(result.stripe.netPayoutOnCharge - result.paypal.netPayoutOnCharge).toFixed(2)} more)
Calculated on CalcDial: https://calcdial.com/tools/stripe-vs-paypal-fee-calculator`;
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-xs space-y-8">
      {/* Header with Mode Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-zinc-100 gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-zinc-950">
            Stripe vs PayPal Payment Architecture
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Compare transaction processing cuts, digital invoicing spreads, and client gross-up formulas
          </p>
        </div>
        <div className="flex items-center gap-3">
          <PillTabs
            tabs={modeTabs}
            value={mode}
            onValueChange={(val) => setMode(val as PaymentMode)}
            label="Payment Comparison Mode"
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

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 pb-6 border-b border-zinc-100">
        {/* Card 1: Payment Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="flex size-5 items-center justify-center rounded-full bg-zinc-950 text-[10px] font-bold font-mono text-white">
              1
            </span>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-900">
              {mode === "gross-up" ? "Desired Net Payout" : "Payment Amount"}
            </h3>
          </div>

          <InputField
            label={mode === "gross-up" ? "Target Net Payout" : "Customer Charge Amount"}
            value={amount}
            onChange={setAmount}
            prefix={result.currencySymbol}
            helpText={
              mode === "gross-up"
                ? "Exact cash you want delivered into your bank"
                : "Total checkout or invoice value"
            }
            presets={mode === "gross-up" ? [100, 250, 500, 1000] : [25, 50, 100, 250]}
          />

          <PresetSelector
            label="Settlement Currency"
            selectedId={currency}
            options={currencyOptions}
            onSelect={setCurrency}
          />
        </div>

        {/* Card 2: Transaction Method */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="flex size-5 items-center justify-center rounded-full bg-zinc-950 text-[10px] font-bold font-mono text-white">
              2
            </span>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-900">
              Transaction Method
            </h3>
          </div>

          <PresetSelector
            label="Payment Type"
            selectedId={transactionType}
            options={typeOptions}
            onSelect={(id) => setTransactionType(id as TransactionType)}
            helpText="Invoicing charges different gateway fee tiers"
          />

          <div className="space-y-3 pt-2">
            <label className="flex items-center gap-2.5 text-xs font-medium text-zinc-700 cursor-pointer">
              <input
                type="checkbox"
                checked={isInternational}
                onChange={(e) => setIsInternational(e.target.checked)}
                className="h-4 w-4 rounded border-zinc-300 text-zinc-950 accent-zinc-950"
              />
              <span>International Payment Card (+1.5%)</span>
            </label>
            <label className="flex items-center gap-2.5 text-xs font-medium text-zinc-700 cursor-pointer">
              <input
                type="checkbox"
                checked={currencyConversion}
                onChange={(e) => setCurrencyConversion(e.target.checked)}
                className="h-4 w-4 rounded border-zinc-300 text-zinc-950 accent-zinc-950"
              />
              <span>Cross-Border FX Conversion (+1% to 3%)</span>
            </label>
          </div>
        </div>

        {/* Card 3: Monthly Volume Simulator */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="flex size-5 items-center justify-center rounded-full bg-zinc-950 text-[10px] font-bold font-mono text-white">
              3
            </span>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-900">
              Monthly Processing Volume
            </h3>
          </div>

          <InputField
            label="Monthly Processing Turnover"
            value={monthlyVolume}
            onChange={setMonthlyVolume}
            prefix={result.currencySymbol}
            helpText="Simulate total monthly card transaction volume"
            presets={[2500, 5000, 10000, 25000]}
          />

          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3.5">
            <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider block">
              Estimated Annual Advantage
            </span>
            <div className="text-xl font-bold text-zinc-950 font-mono mt-0.5">
              {formatCurrency(result.annualSavings, result.currency)} / year
            </div>
            <p className="text-[11px] text-zinc-400 mt-1">
              by selecting {result.recommended} for your checkout gateway
            </p>
          </div>
        </div>
      </div>

      {/* Side-by-Side Processor Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Stripe Card */}
        <div
          className={`rounded-2xl border p-6 space-y-5 transition-all ${
            result.recommended === "Stripe"
              ? "border-zinc-900 bg-zinc-50/50 shadow-xs ring-1 ring-zinc-900/10"
              : "border-zinc-200 bg-white"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <h3 className="text-xl font-extrabold text-zinc-950 tracking-tight">Stripe</h3>
              {result.recommended === "Stripe" && (
                <span className="rounded-full bg-zinc-950 px-2.5 py-0.5 text-[11px] font-mono font-bold text-white uppercase tracking-wider">
                  Recommended
                </span>
              )}
            </div>
            <span className="rounded-lg bg-zinc-100 px-2.5 py-1 text-xs font-mono font-bold text-zinc-700">
              {result.stripe.ratePct}% + {result.currencySymbol}{result.stripe.fixedFee.toFixed(2)}
            </span>
          </div>

          {mode === "gross-up" ? (
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-2xs">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-500">
                Invoice This Amount to Client
              </span>
              <div className="mt-1 text-3xl sm:text-4xl font-extrabold text-zinc-950 font-mono">
                {formatCurrency(result.stripe.invoiceToReceiveTarget, result.currency)}
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-zinc-600 pt-2 border-t border-zinc-100">
                <span>Stripe deduction:</span>
                <span className="font-mono font-semibold text-zinc-700">
                  -{formatCurrency(result.stripe.feeOnGrossUp, result.currency)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-zinc-950 font-semibold pt-1">
                <span>You deposit:</span>
                <span className="font-mono text-zinc-950">
                  {formatCurrency(result.stripe.targetPayout, result.currency)}
                </span>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-2xs">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-500">
                Net Bank Payout on {result.currencySymbol}{amount.toFixed(2)}
              </span>
              <div className="mt-1 text-3xl sm:text-4xl font-extrabold text-zinc-950 font-mono">
                {formatCurrency(result.stripe.netPayoutOnCharge, result.currency)}
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-zinc-600 pt-2 border-t border-zinc-100">
                <span>Stripe processing fee:</span>
                <span className="font-mono font-semibold text-zinc-700">
                  -{formatCurrency(result.stripe.feeOnCharge, result.currency)} ({result.stripe.effectiveFeePct}%)
                </span>
              </div>
            </div>
          )}

          <div className="space-y-2 text-xs text-zinc-600 pt-2 border-t border-zinc-100">
            <div className="flex justify-between">
              <span>Monthly Fees on {result.currencySymbol}{monthlyVolume.toLocaleString()}:</span>
              <span className="font-mono font-semibold text-zinc-900">
                {formatCurrency(result.stripe.monthlyFees, result.currency)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Annual Net Deposited:</span>
              <span className="font-mono font-bold text-zinc-950">
                {formatCurrency(result.stripe.annualNetTakeHome, result.currency)}
              </span>
            </div>
          </div>
        </div>

        {/* PayPal Card */}
        <div
          className={`rounded-2xl border p-6 space-y-5 transition-all ${
            result.recommended === "PayPal"
              ? "border-zinc-900 bg-zinc-50/50 shadow-xs ring-1 ring-zinc-900/10"
              : "border-zinc-200 bg-white"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <h3 className="text-xl font-extrabold text-zinc-950 tracking-tight">PayPal</h3>
              {result.recommended === "PayPal" && (
                <span className="rounded-full bg-zinc-950 px-2.5 py-0.5 text-[11px] font-mono font-bold text-white uppercase tracking-wider">
                  Recommended
                </span>
              )}
            </div>
            <span className="rounded-lg bg-zinc-100 px-2.5 py-1 text-xs font-mono font-bold text-zinc-700">
              {result.paypal.ratePct}% + {result.currencySymbol}{result.paypal.fixedFee.toFixed(2)}
            </span>
          </div>

          {mode === "gross-up" ? (
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-2xs">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-500">
                Invoice This Amount to Client
              </span>
              <div className="mt-1 text-3xl sm:text-4xl font-extrabold text-zinc-950 font-mono">
                {formatCurrency(result.paypal.invoiceToReceiveTarget, result.currency)}
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-zinc-600 pt-2 border-t border-zinc-100">
                <span>PayPal deduction:</span>
                <span className="font-mono font-semibold text-zinc-700">
                  -{formatCurrency(result.paypal.feeOnGrossUp, result.currency)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-zinc-950 font-semibold pt-1">
                <span>You deposit:</span>
                <span className="font-mono text-zinc-950">
                  {formatCurrency(result.paypal.targetPayout, result.currency)}
                </span>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-2xs">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-500">
                Net Bank Payout on {result.currencySymbol}{amount.toFixed(2)}
              </span>
              <div className="mt-1 text-3xl sm:text-4xl font-extrabold text-zinc-950 font-mono">
                {formatCurrency(result.paypal.netPayoutOnCharge, result.currency)}
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-zinc-600 pt-2 border-t border-zinc-100">
                <span>PayPal processing fee:</span>
                <span className="font-mono font-semibold text-zinc-700">
                  -{formatCurrency(result.paypal.feeOnCharge, result.currency)} ({result.paypal.effectiveFeePct}%)
                </span>
              </div>
            </div>
          )}

          <div className="space-y-2 text-xs text-zinc-600 pt-2 border-t border-zinc-100">
            <div className="flex justify-between">
              <span>Monthly Fees on {result.currencySymbol}{monthlyVolume.toLocaleString()}:</span>
              <span className="font-mono font-semibold text-zinc-900">
                {formatCurrency(result.paypal.monthlyFees, result.currency)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Annual Net Deposited:</span>
              <span className="font-mono font-bold text-zinc-950">
                {formatCurrency(result.paypal.annualNetTakeHome, result.currency)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {!isEmbed && (
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <ShareButton
            toolSlug="stripe-vs-paypal-fee-calculator"
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
            <PrintButton toolSlug="stripe-vs-paypal-fee-calculator" />
            <EmbedModal
              toolSlug="stripe-vs-paypal-fee-calculator"
              title="Stripe vs PayPal Fee Calculator"
            />
          </div>
        </div>
      )}

      {!isEmbed && (
        <StickyResultBar
          label={
            mode === "gross-up"
              ? `Gross-Up (${result.recommended})`
              : `Net Deposit (${result.recommended})`
          }
          value={
            mode === "gross-up"
              ? result.recommended === "Stripe"
                ? result.stripe.invoiceToReceiveTarget
                : result.paypal.invoiceToReceiveTarget
              : result.recommended === "Stripe"
              ? result.stripe.netPayoutOnCharge
              : result.paypal.netPayoutOnCharge
          }
          subLabel="Advantage"
          subValue={result.savingsOnGrossUp}
        />
      )}
    </div>
  );
}
