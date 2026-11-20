"use client";

import { useState, useMemo, useEffect } from "react";
import {
  comparePaymentProcessors,
  PaymentMode,
  TransactionType,
} from "@/lib/formulas/stripe-vs-paypal";
import { PAYMENT_CURRENCY_PRESETS } from "@/data/fee-presets";
import { CustomSelect, CustomSelectOption } from "@/components/common/CustomSelect";
import { StickyResultBar } from "./StickyResultBar";
import { trackEvent } from "@/lib/analytics";
import { formatCurrency, cn } from "@/lib/utils";
import { PixelButton } from "@/components/ui/PixelButton";
import {
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  CreditCard,
} from "lucide-react";

export function PaymentComparison({ isEmbed = false }: { isEmbed?: boolean }) {
  // Mode switcher: direct payment vs gross-up
  const [mode, setMode] = useState<PaymentMode>("direct");

  // Currency
  const [currency, setCurrency] = useState<string>("usd");

  // Form State (Strings for clean input handling and cursor control)
  const [amountStr, setAmountStr] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const p =
        new URLSearchParams(window.location.search).get("amount") ||
        new URLSearchParams(window.location.search).get("price");
      if (p && !isNaN(parseFloat(p))) return parseFloat(p).toFixed(2);
    }
    return "100.00";
  });

  const [transactionType, setTransactionType] = useState<TransactionType>("checkout");
  const [isInternational, setIsInternational] = useState<boolean>(false);
  const [currencyConversion, setCurrencyConversion] = useState<boolean>(false);
  const [monthlyVolumeStr, setMonthlyVolumeStr] = useState<string>("5000");

  // UI Accordions & Copy state
  const [showItemized, setShowItemized] = useState<boolean>(false);
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);

  // Safe numeric parsing
  const amount = Math.max(0, parseFloat(amountStr) || 0);
  const monthlyVolume = Math.max(0, parseFloat(monthlyVolumeStr) || 0);

  // Pure formula calculation
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

  // Analytics event
  useEffect(() => {
    const timer = setTimeout(() => {
      trackEvent({
        name: "calculator_used",
        params: {
          tool_slug: "stripe-vs-paypal-fee-calculator",
          preset: `${currency}-${transactionType}`,
        },
      });
    }, 1500);
    return () => clearTimeout(timer);
  }, [amount, currency, transactionType, isInternational, currencyConversion]);

  const currencyOptions: CustomSelectOption[] = useMemo(() => {
    return PAYMENT_CURRENCY_PRESETS.map((p) => ({
      value: p.id,
      label: `${p.country} (${p.currency}) — ${p.currencySymbol}`,
    }));
  }, []);

  const handleCopySummary = () => {
    const summary =
      mode === "gross-up"
        ? `Stripe vs PayPal Client Gross-Up Analysis (2026)
----------------------------------------
Target Net Payout:     ${result.currencySymbol}${amount.toFixed(2)}
Payment Channel:       ${transactionType === "invoice" ? "Digital Invoicing (B2B)" : "Online Checkout"}
Settlement Currency:   ${result.currency} (${result.currencySymbol})
----------------------------------------
Stripe Required Bill:  ${result.currencySymbol}${result.stripe.invoiceToReceiveTarget.toFixed(2)} (Fee: ${result.currencySymbol}${result.stripe.feeOnGrossUp.toFixed(2)})
PayPal Required Bill:  ${result.currencySymbol}${result.paypal.invoiceToReceiveTarget.toFixed(2)} (Fee: ${result.currencySymbol}${result.paypal.feeOnGrossUp.toFixed(2)})
----------------------------------------
Recommended Gateway:   ${result.recommended} (Saves ${result.currencySymbol}${result.savingsOnGrossUp.toFixed(2)} per invoice)
Annual Volume Savings: ${result.currencySymbol}${result.annualSavings.toLocaleString()} on ${result.currencySymbol}${monthlyVolume.toLocaleString()}/mo turnover
----------------------------------------
Calculated on CalcDial: ${typeof window !== "undefined" ? window.location.href : "https://calcdial.pages.dev/tools/stripe-vs-paypal-fee-calculator"}`
        : `Stripe vs PayPal Fee Comparison (2026)
----------------------------------------
Transaction Amount:    ${result.currencySymbol}${amount.toFixed(2)}
Payment Channel:       ${transactionType === "invoice" ? "Digital Invoicing (B2B)" : "Online Checkout"}
Settlement Currency:   ${result.currency} (${result.currencySymbol})
----------------------------------------
Stripe Processing Fee: -${result.currencySymbol}${result.stripe.feeOnCharge.toFixed(2)} (${result.stripe.ratePct}% + ${result.currencySymbol}${result.stripe.fixedFee.toFixed(2)}) -> Deposit: ${result.currencySymbol}${result.stripe.netPayoutOnCharge.toFixed(2)}
PayPal Processing Fee: -${result.currencySymbol}${result.paypal.feeOnCharge.toFixed(2)} (${result.paypal.ratePct}% + ${result.currencySymbol}${result.paypal.fixedFee.toFixed(2)}) -> Deposit: ${result.currencySymbol}${result.paypal.netPayoutOnCharge.toFixed(2)}
----------------------------------------
Recommended Gateway:   ${result.recommended} (Keeps ${result.currencySymbol}${result.savingsOnDirectCharge.toFixed(2)} more)
Annual Advantage:      ${result.currencySymbol}${result.annualSavings.toLocaleString()} on ${result.currencySymbol}${monthlyVolume.toLocaleString()}/mo turnover
----------------------------------------
Calculated on CalcDial: ${typeof window !== "undefined" ? window.location.href : "https://calcdial.pages.dev/tools/stripe-vs-paypal-fee-calculator"}`;

    navigator.clipboard.writeText(summary);
    setCopiedSummary(true);
    trackEvent({
      name: "result_copied",
      params: { tool_slug: "stripe-vs-paypal-fee-calculator", method: "clipboard" },
    });
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const amountPresets =
    mode === "gross-up"
      ? [100, 250, 500, 1000, 2500, 5000]
      : [25, 50, 100, 250, 500, 1000];

  const volumePresets = [2500, 5000, 10000, 25000, 50000];

  return (
    <div>
      {/* 2-Column Responsive Layout: Left Input Card, Right Results Card */}
      <div className="grid grid-cols-1 gap-4 lg:gap-5 lg:grid-cols-12 items-start font-sans">
        {/* ========================================================= */}
        {/* LEFT CARD: Interactive Input Controls                     */}
        {/* ========================================================= */}
        <div className="lg:col-span-6 rounded-xl sm:rounded-2xl border border-zinc-200/90 bg-white p-4 sm:p-6 shadow-xs space-y-4">
          {/* Header & Mode Switcher */}
          <div className="flex items-center justify-between pb-3.5 border-b border-zinc-100">
            {/* Segmented Pill Tab Switcher */}
            <div className="inline-flex w-full sm:w-auto rounded-xl bg-zinc-100 p-1 text-xs font-sans">
              <button
                type="button"
                onClick={() => setMode("direct")}
                className={cn(
                  "flex-1 sm:flex-initial px-4 py-2 rounded-lg font-bold transition-all cursor-pointer text-xs whitespace-nowrap inline-flex items-center justify-center",
                  mode === "direct"
                    ? "bg-[#2b5cfd] text-white shadow-sm shadow-blue-500/25"
                    : "text-zinc-600 hover:text-zinc-950"
                )}
              >
                Direct Fee
              </button>
              <button
                type="button"
                onClick={() => setMode("gross-up")}
                className={cn(
                  "flex-1 sm:flex-initial px-4 py-2 rounded-lg font-bold transition-all cursor-pointer text-xs whitespace-nowrap inline-flex items-center justify-center",
                  mode === "gross-up"
                    ? "bg-[#2b5cfd] text-white shadow-sm shadow-blue-500/25"
                    : "text-zinc-600 hover:text-zinc-950"
                )}
              >
                Invoice Gross-Up
              </button>
            </div>
          </div>

          {/* Settlement Currency Selector */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-zinc-950">
              Settlement Currency
            </label>
            <CustomSelect
              value={currency}
              options={currencyOptions}
              onChange={(val) => setCurrency(val)}
            />
          </div>

          {/* Amount Input with Focus Ring & Presets */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between">
              <label htmlFor="payment-charge-amount" className="text-[11px] font-bold text-zinc-950 cursor-pointer">
                {mode === "gross-up" ? "Target Net Payout" : "Payment / Charge Amount"}{" "}
                <span className="text-rose-600">*</span>
              </label>
              <span className="text-[10px] text-zinc-400 font-sans">
                {mode === "gross-up"
                  ? "Desired net deposit in bank"
                  : "Gross checkout or invoice total"}
              </span>
            </div>

            <div className="relative flex items-center min-h-11 rounded-lg border border-zinc-300 bg-white transition-all hover:border-zinc-400 focus-within:border-zinc-950 focus-within:ring-1 focus-within:ring-zinc-950">
              <span className="pl-3 pr-1 text-xs sm:text-sm font-mono font-bold text-zinc-600 select-none">
                {result.currencySymbol}
              </span>
              <input
                id="payment-charge-amount"
                name="chargeAmount"
                aria-label={mode === "gross-up" ? "Target Net Payout" : "Payment Amount"}
                type="number"
                inputMode="decimal"
                min={0}
                step="any"
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                onFocus={(e) => {
                  if (e.target.value === "0.00" || e.target.value === "0") {
                    e.target.select();
                  }
                }}
                onBlur={() => {
                  const num = parseFloat(amountStr);
                  if (!isNaN(num) && num >= 0) setAmountStr(num.toFixed(2));
                  else if (!amountStr) setAmountStr("0.00");
                }}
                placeholder="0.00"
                className="h-11 min-h-11 w-full rounded-lg bg-transparent px-2 text-xs sm:text-sm font-mono font-bold text-zinc-950 placeholder-zinc-400 focus:outline-hidden"
              />
            </div>

            {/* Quick Presets — Single line horizontal row without wrapping */}
            <div className="overflow-x-auto no-scrollbar py-0.5">
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                {amountPresets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmountStr(preset.toFixed(2))}
                    className={cn(
                      "px-2.5 py-1 min-h-7 rounded-lg border text-[11px] font-mono transition-all cursor-pointer shrink-0",
                      Math.abs(amount - preset) < 0.01
                        ? "border-[#2b5cfd] bg-[#2b5cfd] text-white font-bold shadow-xs"
                        : "border-zinc-200/90 bg-white text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
                    )}
                  >
                    {result.currencySymbol}
                    {preset >= 1000 ? `${preset / 1000}k` : preset}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Transaction Channel Selector */}
          <div className="pt-2 border-t border-zinc-100 space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-zinc-950">
                Payment Channel
              </label>
              <span className="text-[10px] text-zinc-500 font-sans">
                {transactionType === "checkout"
                  ? "Standard card checkout (2.9% vs 3.49%)"
                  : "Digital invoicing (3.3% vs 2.99%)"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 p-1 rounded-lg bg-zinc-100 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setTransactionType("checkout")}
                className={cn(
                  "py-1.5 px-3 rounded-md transition-all cursor-pointer text-center flex items-center justify-center gap-1.5",
                  transactionType === "checkout"
                    ? "bg-[#2b5cfd] text-white font-bold shadow-2xs"
                    : "text-zinc-600 hover:text-zinc-950"
                )}
              >
                <CreditCard className="size-3.5" />
                <span>Online Checkout</span>
              </button>
              <button
                type="button"
                onClick={() => setTransactionType("invoice")}
                className={cn(
                  "py-1.5 px-3 rounded-md transition-all cursor-pointer text-center flex items-center justify-center gap-1.5",
                  transactionType === "invoice"
                    ? "bg-[#2b5cfd] text-white font-bold shadow-2xs"
                    : "text-zinc-600 hover:text-zinc-950"
                )}
              >
                <TrendingUp className="size-3.5" />
                <span>Client Invoicing</span>
              </button>
            </div>
          </div>

          {/* Cross-Border & FX Surcharge Toggles */}
          <div className="pt-2 border-t border-zinc-100 space-y-2.5">
            <span className="text-[11px] font-bold text-zinc-950 block">
              Cross-Border &amp; Currency Surcharges
            </span>

            {/* International Card Toggle */}
            <div className="rounded-lg border border-zinc-200/80 bg-zinc-50/50 p-2.5 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <label
                  htmlFor="toggle-international"
                  className="text-xs font-bold text-zinc-950 block cursor-pointer truncate"
                >
                  International Payment Card (+1.50%)
                </label>
                <p className="text-[11px] text-zinc-500 font-sans leading-tight mt-0.5">
                  Card issued in a country different from your merchant account
                </p>
              </div>

              <button
                type="button"
                id="toggle-international"
                role="switch"
                aria-checked={isInternational}
                onClick={() => setIsInternational(!isInternational)}
                className={cn(
                  "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden",
                  isInternational ? "bg-blue-600" : "bg-zinc-200"
                )}
              >
                <span
                  className={cn(
                    "pointer-events-none inline-block size-4 transform rounded-full bg-white shadow-2xs ring-0 transition duration-200 ease-in-out",
                    isInternational ? "translate-x-4" : "translate-x-0"
                  )}
                />
              </button>
            </div>

            {/* Currency Conversion Toggle */}
            <div className="rounded-lg border border-zinc-200/80 bg-zinc-50/50 p-2.5 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <label
                  htmlFor="toggle-fx"
                  className="text-xs font-bold text-zinc-950 block cursor-pointer truncate"
                >
                  Cross-Border FX Conversion (+1% to 3%)
                </label>
                <p className="text-[11px] text-zinc-500 font-sans leading-tight mt-0.5">
                  Settlement currency differs from buyer card currency (Stripe +1.0%, PayPal +3.0%)
                </p>
              </div>

              <button
                type="button"
                id="toggle-fx"
                role="switch"
                aria-checked={currencyConversion}
                onClick={() => setCurrencyConversion(!currencyConversion)}
                className={cn(
                  "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden",
                  currencyConversion ? "bg-blue-600" : "bg-zinc-200"
                )}
              >
                <span
                  className={cn(
                    "pointer-events-none inline-block size-4 transform rounded-full bg-white shadow-2xs ring-0 transition duration-200 ease-in-out",
                    currencyConversion ? "translate-x-4" : "translate-x-0"
                  )}
                />
              </button>
            </div>
          </div>

          {/* Monthly Turnover / Processing Volume Simulator */}
          <div className="pt-2 border-t border-zinc-100 space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="payment-monthly-volume" className="text-[11px] font-bold text-zinc-950 cursor-pointer">
                Monthly Processing Turnover
              </label>
              <span className="text-[10px] text-zinc-400 font-sans">
                Simulate annual cumulative fee impact
              </span>
            </div>

            <div className="relative flex items-center min-h-11 rounded-lg border border-zinc-300 bg-white transition-all hover:border-zinc-400 focus-within:border-zinc-950 focus-within:ring-1 focus-within:ring-zinc-950">
              <span className="pl-3 pr-1 text-xs sm:text-sm font-mono font-bold text-zinc-600 select-none">
                {result.currencySymbol}
              </span>
              <input
                id="payment-monthly-volume"
                name="monthlyVolume"
                aria-label="Monthly Processing Turnover"
                type="number"
                inputMode="decimal"
                min={0}
                step="any"
                value={monthlyVolumeStr}
                onChange={(e) => setMonthlyVolumeStr(e.target.value)}
                onFocus={(e) => e.target.select()}
                onBlur={() => {
                  const num = parseFloat(monthlyVolumeStr);
                  if (!isNaN(num) && num >= 0) setMonthlyVolumeStr(num.toString());
                  else if (!monthlyVolumeStr) setMonthlyVolumeStr("5000");
                }}
                placeholder="5000"
                className="h-11 min-h-11 w-full rounded-lg bg-transparent px-2 text-xs sm:text-sm font-mono font-bold text-zinc-950 placeholder-zinc-400 focus:outline-hidden"
              />
            </div>

            {/* Quick Volume Presets — Single line horizontal row without wrapping */}
            <div className="overflow-x-auto no-scrollbar py-0.5">
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                {volumePresets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setMonthlyVolumeStr(preset.toString())}
                    className={cn(
                      "px-2.5 py-1 min-h-7 rounded-lg border text-[11px] font-mono transition-all cursor-pointer shrink-0",
                      Math.abs(monthlyVolume - preset) < 0.01
                        ? "border-[#2b5cfd] bg-[#2b5cfd] text-white font-bold shadow-xs"
                        : "border-zinc-200/90 bg-white text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
                    )}
                  >
                    {result.currencySymbol}
                    {preset / 1000}k/mo
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT CARD: Results (Standalone Hero Card, sticky desktop)*/}
        {/* ========================================================= */}
        <div className="lg:col-span-6 rounded-xl sm:rounded-2xl border border-zinc-200/90 bg-white p-4 sm:p-5 shadow-xs lg:sticky lg:top-20 space-y-4">
          {/* Header & Copy Button */}
          <div className="flex items-center justify-between pb-2.5 border-b border-zinc-100">
            <h3 className="text-sm sm:text-base font-bold tracking-tight text-zinc-950">
              {mode === "gross-up" ? "Invoice Gross-Up Target" : "Comparison Results"}
            </h3>
            <button
              type="button"
              onClick={handleCopySummary}
              className="inline-flex items-center gap-1 text-[11px] font-sans font-bold text-zinc-700 hover:text-zinc-950 transition-colors cursor-pointer"
              title="Copy Summary"
            >
              {copiedSummary ? (
                <>
                  <Check className="size-3 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="size-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Winner Highlight Banner */}
          <div className="rounded-xl bg-zinc-50/80 border border-zinc-200/80 p-3 space-y-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-zinc-900">
                Gateway Recommendation
              </span>
              <span className="text-xs font-bold text-emerald-700 font-mono">
                {result.recommended} Preferred
              </span>
            </div>

            <div className="text-xs text-zinc-700 leading-snug">
              {mode === "gross-up" ? (
                <>
                  Billing via <strong className="text-zinc-950">{result.recommended}</strong> saves{" "}
                  <strong className="text-emerald-700 font-mono font-bold">
                    {result.currencySymbol}
                    {result.savingsOnGrossUp.toFixed(2)}
                  </strong>{" "}
                  on this invoice to deliver your target net payout.
                </>
              ) : (
                <>
                  Processing with <strong className="text-zinc-950">{result.recommended}</strong> keeps an extra{" "}
                  <strong className="text-emerald-700 font-mono font-bold">
                    {result.currencySymbol}
                    {result.savingsOnDirectCharge.toFixed(2)}
                  </strong>{" "}
                  in your bank account on this payment.
                </>
              )}
            </div>
          </div>

          {/* Head-to-Head Comparison Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Stripe Card */}
            <div
              className={cn(
                "rounded-xl border p-3.5 space-y-2.5 transition-all",
                result.recommended === "Stripe"
                  ? "border-emerald-500/70 bg-emerald-50/20 shadow-xs ring-1 ring-emerald-500/30"
                  : "border-zinc-200/90 bg-white hover:border-zinc-300"
              )}
            >
              <div className="flex items-center justify-between gap-1.5">
                <span className="text-sm font-extrabold text-zinc-950 tracking-tight">
                  Stripe
                </span>
                <span className="text-xs font-mono font-semibold text-zinc-500 whitespace-nowrap shrink-0">
                  {result.stripe.ratePct}% + {result.currencySymbol}
                  {result.stripe.fixedFee.toFixed(2)}
                </span>
              </div>

              {mode === "gross-up" ? (
                <div>
                  <span className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                    Invoice Amount
                  </span>
                  <div className="text-lg sm:text-xl font-extrabold font-mono text-zinc-950 tracking-tight truncate">
                    {formatCurrency(result.stripe.invoiceToReceiveTarget, result.currency)}
                  </div>
                  <div className="mt-2 pt-2 border-t border-zinc-100 space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-zinc-600">
                      <span>Fee on invoice:</span>
                      <span className="font-mono font-semibold text-zinc-900">
                        -{formatCurrency(result.stripe.feeOnGrossUp, result.currency)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-emerald-700 font-semibold">
                      <span>You receive:</span>
                      <span className="font-mono font-bold">
                        {formatCurrency(result.stripe.targetPayout, result.currency)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <span className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                    Net Deposit
                  </span>
                  <div className="text-lg sm:text-xl font-extrabold font-mono text-zinc-950 tracking-tight truncate">
                    {formatCurrency(result.stripe.netPayoutOnCharge, result.currency)}
                  </div>
                  <div className="mt-2 pt-2 border-t border-zinc-100 space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-zinc-600">
                      <span>Fee cut:</span>
                      <span className="font-mono font-semibold text-rose-600">
                        -{formatCurrency(result.stripe.feeOnCharge, result.currency)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-zinc-500">
                      <span>Effective rate:</span>
                      <span className="font-mono font-medium text-zinc-800">
                        {result.stripe.effectiveFeePct}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-zinc-500">
                      <span>Gross charged:</span>
                      <span className="font-mono text-zinc-700">
                        {formatCurrency(amount, result.currency)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* PayPal Card */}
            <div
              className={cn(
                "rounded-xl border p-3.5 space-y-2.5 transition-all",
                result.recommended === "PayPal"
                  ? "border-emerald-500/70 bg-emerald-50/20 shadow-xs ring-1 ring-emerald-500/30"
                  : "border-zinc-200/90 bg-white hover:border-zinc-300"
              )}
            >
              <div className="flex items-center justify-between gap-1.5">
                <span className="text-sm font-extrabold text-zinc-950 tracking-tight">
                  PayPal
                </span>
                <span className="text-xs font-mono font-semibold text-zinc-500 whitespace-nowrap shrink-0">
                  {result.paypal.ratePct}% + {result.currencySymbol}
                  {result.paypal.fixedFee.toFixed(2)}
                </span>
              </div>

              {mode === "gross-up" ? (
                <div>
                  <span className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                    Invoice Amount
                  </span>
                  <div className="text-lg sm:text-xl font-extrabold font-mono text-zinc-950 tracking-tight truncate">
                    {formatCurrency(result.paypal.invoiceToReceiveTarget, result.currency)}
                  </div>
                  <div className="mt-2 pt-2 border-t border-zinc-100 space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-zinc-600">
                      <span>Fee on invoice:</span>
                      <span className="font-mono font-semibold text-zinc-900">
                        -{formatCurrency(result.paypal.feeOnGrossUp, result.currency)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-emerald-700 font-semibold">
                      <span>You receive:</span>
                      <span className="font-mono font-bold">
                        {formatCurrency(result.paypal.targetPayout, result.currency)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <span className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                    Net Deposit
                  </span>
                  <div className="text-lg sm:text-xl font-extrabold font-mono text-zinc-950 tracking-tight truncate">
                    {formatCurrency(result.paypal.netPayoutOnCharge, result.currency)}
                  </div>
                  <div className="mt-2 pt-2 border-t border-zinc-100 space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-zinc-600">
                      <span>Fee cut:</span>
                      <span className="font-mono font-semibold text-rose-600">
                        -{formatCurrency(result.paypal.feeOnCharge, result.currency)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-zinc-500">
                      <span>Effective rate:</span>
                      <span className="font-mono font-medium text-zinc-800">
                        {result.paypal.effectiveFeePct}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-zinc-500">
                      <span>Gross charged:</span>
                      <span className="font-mono text-zinc-700">
                        {formatCurrency(amount, result.currency)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Visual Percentage Breakdown Bar */}
          <div className="pt-2 border-t border-zinc-100 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-600">
              <span>Net Take-Home Comparison</span>
              <span className="font-mono text-zinc-950">
                {mode === "gross-up"
                  ? `${result.recommended} requires less gross`
                  : `${result.recommended} keeps ${result.savingsOnDirectCharge > 0 ? `+${result.currencySymbol}${result.savingsOnDirectCharge.toFixed(2)}` : "equal"}`}
              </span>
            </div>

            <div className="space-y-1.5">
              {/* Stripe Bar */}
              <div>
                <div className="flex items-center justify-between text-[10px] text-zinc-500 mb-0.5">
                  <span className="font-bold text-zinc-800">Stripe</span>
                  <span className="font-mono">
                    {mode === "gross-up"
                      ? `${formatCurrency(result.stripe.invoiceToReceiveTarget, result.currency)}`
                      : `${(100 - result.stripe.effectiveFeePct).toFixed(1)}% net deposit`}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-zinc-100 overflow-hidden flex">
                  <div
                    style={{
                      width: `${Math.min(100, Math.max(0, 100 - result.stripe.effectiveFeePct))}%`,
                    }}
                    className="h-full bg-emerald-500 rounded-l-full"
                  />
                  <div
                    style={{
                      width: `${Math.min(100, Math.max(0, result.stripe.effectiveFeePct))}%`,
                    }}
                    className="h-full bg-rose-400 rounded-r-full"
                  />
                </div>
              </div>

              {/* PayPal Bar */}
              <div>
                <div className="flex items-center justify-between text-[10px] text-zinc-500 mb-0.5">
                  <span className="font-bold text-zinc-800">PayPal</span>
                  <span className="font-mono">
                    {mode === "gross-up"
                      ? `${formatCurrency(result.paypal.invoiceToReceiveTarget, result.currency)}`
                      : `${(100 - result.paypal.effectiveFeePct).toFixed(1)}% net deposit`}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-zinc-100 overflow-hidden flex">
                  <div
                    style={{
                      width: `${Math.min(100, Math.max(0, 100 - result.paypal.effectiveFeePct))}%`,
                    }}
                    className="h-full bg-blue-500 rounded-l-full"
                  />
                  <div
                    style={{
                      width: `${Math.min(100, Math.max(0, result.paypal.effectiveFeePct))}%`,
                    }}
                    className="h-full bg-rose-400 rounded-r-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Monthly & Annual Volume Projection Box */}
          <div className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-600">
                Annual Volume Advantage
              </span>
              <TrendingUp className="size-3.5 text-emerald-600" />
            </div>

            <div className="text-2xl font-extrabold font-mono tracking-tight text-zinc-950">
              +{formatCurrency(result.annualSavings, result.currency)}
              <span className="text-xs font-sans font-medium text-zinc-500"> / year</span>
            </div>

            <p className="text-[11px] text-zinc-600 leading-snug">
              Estimated net savings by processing through{" "}
              <strong className="text-zinc-950">{result.recommended}</strong> at{" "}
              <span className="font-mono font-semibold">
                {formatCurrency(monthlyVolume, result.currency)}/month
              </span>{" "}
              turnover.
            </p>

            <div className="pt-2 border-t border-zinc-200/70 grid grid-cols-2 gap-2 text-[11px]">
              <div className="rounded-lg bg-white/80 p-2 border border-zinc-200/60 shadow-2xs">
                <span className="text-[10px] font-mono uppercase text-zinc-500 block">Stripe Fee / Mo</span>
                <span className="text-xs sm:text-sm font-mono font-bold text-zinc-950">
                  {formatCurrency(result.stripe.monthlyFees, result.currency)}
                </span>
              </div>
              <div className="rounded-lg bg-white/80 p-2 border border-zinc-200/60 shadow-2xs text-right">
                <span className="text-[10px] font-mono uppercase text-zinc-500 block">PayPal Fee / Mo</span>
                <span className="text-xs sm:text-sm font-mono font-bold text-zinc-950">
                  {formatCurrency(result.paypal.monthlyFees, result.currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Itemized Fee Breakdown Accordion */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowItemized(!showItemized)}
              className="w-full flex items-center justify-between py-1.5 text-[11px] font-semibold text-zinc-600 hover:text-zinc-950 transition-colors cursor-pointer border-t border-zinc-100"
            >
              <span>Rate Components Breakdown</span>
              {showItemized ? (
                <ChevronUp className="size-3.5" />
              ) : (
                <ChevronDown className="size-3.5" />
              )}
            </button>

            {showItemized && (
              <div className="mt-2 divide-y divide-zinc-100 text-xs font-mono space-y-1 animate-in fade-in duration-150">
                <div className="flex justify-between py-1 text-zinc-600">
                  <span>Base Rate:</span>
                  <span>
                    Stripe {transactionType === "invoice" ? "3.30%" : "2.90%"} vs PayPal{" "}
                    {transactionType === "invoice" ? "2.99%" : "3.49%"}
                  </span>
                </div>
                <div className="flex justify-between py-1 text-zinc-600">
                  <span>Fixed Fee:</span>
                  <span>
                    Stripe {result.currencySymbol}
                    {result.stripe.fixedFee.toFixed(2)} vs PayPal {result.currencySymbol}
                    {result.paypal.fixedFee.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between py-1 text-zinc-600">
                  <span>International Card:</span>
                  <span>
                    {isInternational ? "+1.50% (Both)" : "0.00%"}
                  </span>
                </div>
                <div className="flex justify-between py-1 text-zinc-600">
                  <span>FX Conversion:</span>
                  <span>
                    {currencyConversion
                      ? "Stripe +1.00% vs PayPal +3.00%"
                      : "0.00%"}
                  </span>
                </div>
                <div className="flex justify-between py-1 font-bold text-zinc-950 pt-1.5">
                  <span>Total Applied Rate:</span>
                  <span>
                    Stripe {result.stripe.ratePct}% vs PayPal {result.paypal.ratePct}%
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Action: Copy Comparison Summary with Signature PixelButton */}
          <div className="pt-2">
            <PixelButton
              type="button"
              onClick={handleCopySummary}
              className="w-full h-11 justify-center rounded-xl font-bold text-xs sm:text-sm shadow-xs"
            >
              {copiedSummary ? (
                <>
                  <Check className="size-4 stroke-[2.5]" />
                  <span>Comparison Summary Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="size-4" />
                  <span>Copy Full Breakdown Summary</span>
                </>
              )}
            </PixelButton>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Result Bar */}
      {!isEmbed && (
        <StickyResultBar
          label={
            mode === "gross-up"
              ? `Invoice (${result.recommended})`
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
          subValue={mode === "gross-up" ? result.savingsOnGrossUp : result.savingsOnDirectCharge}
          subValueFormat="currency"
          totalFees={
            mode === "gross-up"
              ? result.recommended === "Stripe"
                ? result.stripe.feeOnGrossUp
                : result.paypal.feeOnGrossUp
              : result.recommended === "Stripe"
              ? result.stripe.feeOnCharge
              : result.paypal.feeOnCharge
          }
          payout={
            mode === "gross-up"
              ? amount
              : result.recommended === "Stripe"
              ? result.stripe.netPayoutOnCharge
              : result.paypal.netPayoutOnCharge
          }
          breakEven={
            mode === "gross-up"
              ? result.recommended === "Stripe"
                ? result.stripe.invoiceToReceiveTarget
                : result.paypal.invoiceToReceiveTarget
              : amount
          }
          currencySymbol={result.currencySymbol}
          itemizedFees={[
            {
              label: `Stripe ${mode === "gross-up" ? "Invoice" : "Fee"}`,
              amount:
                mode === "gross-up"
                  ? result.stripe.invoiceToReceiveTarget
                  : result.stripe.feeOnCharge,
            },
            {
              label: `PayPal ${mode === "gross-up" ? "Invoice" : "Fee"}`,
              amount:
                mode === "gross-up"
                  ? result.paypal.invoiceToReceiveTarget
                  : result.paypal.feeOnCharge,
            },
          ]}
        />
      )}
    </div>
  );
}
