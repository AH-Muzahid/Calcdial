import { PAYMENT_CURRENCY_PRESETS, FeePreset } from "@/data/fee-presets";

export type PaymentMode = "direct" | "gross-up";
export type TransactionType = "checkout" | "invoice";

export interface PaymentCompInput {
  amount?: number; // Either charge amount (direct) or desired net payout (gross-up)
  targetPayout?: number; // Backward compatibility
  currency?: string; // e.g. "usd", "gbp", "eur"
  transactionType?: TransactionType; // "checkout" | "invoice"
  isInternational?: boolean;
  currencyConversion?: boolean;
  monthlyVolume?: number; // e.g. $5,000 / month
  averageTicket?: number; // e.g. $100 / transaction
}

export interface ProcessorMetrics {
  name: "Stripe" | "PayPal";
  ratePct: number;
  fixedFee: number;
  // Direct mode (Charging $X)
  chargeAmount: number;
  feeOnCharge: number;
  effectiveFeePct: number;
  netPayoutOnCharge: number;
  // Gross-Up mode (Receiving $X net)
  targetPayout: number;
  invoiceToReceiveTarget: number;
  feeOnGrossUp: number;
  // Projections
  monthlyFees: number;
  monthlyNetTakeHome: number;
  annualNetTakeHome: number;
}

export interface PaymentCompResult {
  amount: number;
  targetPayout: number;
  currency: string;
  currencySymbol: string;
  transactionType: TransactionType;
  stripe: ProcessorMetrics;
  paypal: ProcessorMetrics;
  recommended: "Stripe" | "PayPal";
  savingsOnDirectCharge: number;
  savingsOnGrossUp: number;
  annualSavings: number;
  dataSnippet: string;
}

export function comparePaymentProcessors(input: PaymentCompInput): PaymentCompResult {
  const amt = Math.max(0, input.amount !== undefined ? input.amount : (input.targetPayout || 0));
  const curId = (input.currency || "usd").toLowerCase();
  const txType = input.transactionType || "checkout";
  const preset: FeePreset | undefined = PAYMENT_CURRENCY_PRESETS.find((p) => p.id === curId);

  const symbol = preset?.currencySymbol || "$";
  const currencyCode = preset?.currency || "USD";

  // Base Stripe rates
  let stripeRate = preset?.fees.domesticRate ?? 2.9;
  const stripeFixed = preset?.fees.domesticFixed ?? 0.30;
  if (txType === "invoice") {
    stripeRate += 0.4; // Stripe Invoicing starter fee (+0.4%)
  }
  if (input.isInternational) stripeRate += preset?.fees.intlRate ?? 1.5;
  if (input.currencyConversion) stripeRate += preset?.fees.fxRate ?? 1.0;

  // Base PayPal rates
  // Standard card checkout: 3.49% + $0.49
  // Invoicing: 2.99% + $0.49
  let paypalRate = txType === "invoice" ? 2.99 : 3.49;
  const paypalFixed = curId === "gbp" ? 0.30 : curId === "eur" ? 0.39 : 0.49;
  if (input.isInternational) paypalRate += 1.50;
  if (input.currencyConversion) paypalRate += 3.00; // PayPal standard currency conversion margin

  // 1. Direct Charge Calculation: Customer pays `amt`
  let stripeFeeDirect = 0;
  let paypalFeeDirect = 0;
  if (amt > 0) {
    stripeFeeDirect = Number((((amt * stripeRate) / 100) + stripeFixed).toFixed(2));
    paypalFeeDirect = Number((((amt * paypalRate) / 100) + paypalFixed).toFixed(2));
  }
  const stripePayoutDirect = Number(Math.max(0, amt - stripeFeeDirect).toFixed(2));
  const paypalPayoutDirect = Number(Math.max(0, amt - paypalFeeDirect).toFixed(2));

  // 2. Gross-Up Calculation: Merchant wants `amt` in bank
  // Gross = (Target + Fixed) / (1 - (Rate / 100))
  const stripeRateDecimal = stripeRate / 100;
  const paypalRateDecimal = paypalRate / 100;

  const stripeInvoice =
    amt > 0 && stripeRateDecimal < 1
      ? Number(((amt + stripeFixed) / (1 - stripeRateDecimal)).toFixed(2))
      : amt;

  const paypalInvoice =
    amt > 0 && paypalRateDecimal < 1
      ? Number(((amt + paypalFixed) / (1 - paypalRateDecimal)).toFixed(2))
      : amt;

  const stripeFeeOnGrossUp = Number((stripeInvoice - amt).toFixed(2));
  const paypalFeeOnGrossUp = Number((paypalInvoice - amt).toFixed(2));

  // 3. Scale / Volume Simulation
  const monthlyVol = Math.max(0, input.monthlyVolume || 5000);
  const avgTicket = Math.max(1, input.averageTicket || 100);
  const estimatedMonthlyTxs = Math.max(1, Math.round(monthlyVol / avgTicket));

  const stripeMonthlyFees = Number((((monthlyVol * stripeRate) / 100) + (estimatedMonthlyTxs * stripeFixed)).toFixed(2));
  const paypalMonthlyFees = Number((((monthlyVol * paypalRate) / 100) + (estimatedMonthlyTxs * paypalFixed)).toFixed(2));

  const stripeMonthlyTakeHome = Number((monthlyVol - stripeMonthlyFees).toFixed(2));
  const paypalMonthlyTakeHome = Number((monthlyVol - paypalMonthlyFees).toFixed(2));

  const stripeAnnualTakeHome = Number((stripeMonthlyTakeHome * 12).toFixed(2));
  const paypalAnnualTakeHome = Number((paypalMonthlyTakeHome * 12).toFixed(2));

  const savingsDirect = Number(Math.max(0, stripePayoutDirect - paypalPayoutDirect).toFixed(2));
  const savingsGrossUp = Number(Math.abs(paypalFeeOnGrossUp - stripeFeeOnGrossUp).toFixed(2));
  const annualSavings = Number(Math.abs(stripeAnnualTakeHome - paypalAnnualTakeHome).toFixed(2));

  const recommended: "Stripe" | "PayPal" = stripeFeeDirect <= paypalFeeDirect ? "Stripe" : "PayPal";

  const dataSnippet = `On a ${symbol}${amt.toFixed(2)} payment, Stripe deducts ${symbol}${stripeFeeDirect.toFixed(2)} (${stripeRate}% + ${symbol}${stripeFixed.toFixed(2)}) versus ${symbol}${paypalFeeDirect.toFixed(2)} on PayPal (${paypalRate}% + ${symbol}${paypalFixed.toFixed(2)}) — keeping an extra ${symbol}${savingsDirect.toFixed(2)} in your bank account per transaction.`;

  return {
    amount: amt,
    targetPayout: amt,
    currency: currencyCode,
    currencySymbol: symbol,
    transactionType: txType,
    stripe: {
      name: "Stripe",
      ratePct: Number(stripeRate.toFixed(2)),
      fixedFee: stripeFixed,
      chargeAmount: amt,
      feeOnCharge: stripeFeeDirect,
      effectiveFeePct: amt > 0 ? Number(((stripeFeeDirect / amt) * 100).toFixed(2)) : 0,
      netPayoutOnCharge: stripePayoutDirect,
      targetPayout: amt,
      invoiceToReceiveTarget: stripeInvoice,
      feeOnGrossUp: stripeFeeOnGrossUp,
      monthlyFees: stripeMonthlyFees,
      monthlyNetTakeHome: stripeMonthlyTakeHome,
      annualNetTakeHome: stripeAnnualTakeHome,
    },
    paypal: {
      name: "PayPal",
      ratePct: Number(paypalRate.toFixed(2)),
      fixedFee: paypalFixed,
      chargeAmount: amt,
      feeOnCharge: paypalFeeDirect,
      effectiveFeePct: amt > 0 ? Number(((paypalFeeDirect / amt) * 100).toFixed(2)) : 0,
      netPayoutOnCharge: paypalPayoutDirect,
      targetPayout: amt,
      invoiceToReceiveTarget: paypalInvoice,
      feeOnGrossUp: paypalFeeOnGrossUp,
      monthlyFees: paypalMonthlyFees,
      monthlyNetTakeHome: paypalMonthlyTakeHome,
      annualNetTakeHome: paypalAnnualTakeHome,
    },
    recommended,
    savingsOnDirectCharge: savingsDirect,
    savingsOnGrossUp: savingsGrossUp,
    annualSavings,
    dataSnippet,
  };
}
