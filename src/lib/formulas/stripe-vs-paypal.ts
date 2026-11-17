import { PAYMENT_CURRENCY_PRESETS, FeePreset } from "@/data/fee-presets";

export interface PaymentCompInput {
  targetPayout: number;
  currency?: string; // e.g. "usd", "gbp", "eur"
  isInternational?: boolean;
  currencyConversion?: boolean;
}

export interface ProcessorPayout {
  name: "Stripe" | "PayPal";
  ratePct: number;
  fixedFee: number;
  invoiceToReceiveTarget: number; // Gross-up amount
  feeOnGrossUp: number;
  feeOnDirectTarget: number;
  payoutOnDirectTarget: number;
}

export interface PaymentCompResult {
  targetPayout: number;
  currency: string;
  currencySymbol: string;
  stripe: ProcessorPayout;
  paypal: ProcessorPayout;
  recommended: "Stripe" | "PayPal";
  savingsOnGrossUp: number;
  dataSnippet: string;
}

export function comparePaymentProcessors(input: PaymentCompInput): PaymentCompResult {
  const target = Math.max(0, input.targetPayout || 0);
  const curId = (input.currency || "usd").toLowerCase();
  const preset: FeePreset | undefined = PAYMENT_CURRENCY_PRESETS.find((p) => p.id === curId);

  const symbol = preset?.currencySymbol || "$";
  const currencyCode = preset?.currency || "USD";

  // Base Stripe rates
  let stripeRate = preset?.fees.domesticRate ?? 2.9;
  const stripeFixed = preset?.fees.domesticFixed ?? 0.30;
  if (input.isInternational) stripeRate += preset?.fees.intlRate ?? 1.5;
  if (input.currencyConversion) stripeRate += preset?.fees.fxRate ?? 1.0;

  // Base PayPal rates (PayPal is typically 3.49% + $0.49 domestic card checkout)
  let paypalRate = 3.49;
  const paypalFixed = curId === "gbp" ? 0.30 : curId === "eur" ? 0.39 : 0.49;
  if (input.isInternational) paypalRate += 1.50;
  if (input.currencyConversion) paypalRate += 3.00; // PayPal FX spread is typically 3-4%

  // Gross-Up Formula:
  // Gross = (Target + Fixed) / (1 - (Rate / 100))
  const stripeRateDecimal = stripeRate / 100;
  const paypalRateDecimal = paypalRate / 100;

  const stripeInvoice =
    target > 0 && stripeRateDecimal < 1
      ? Number(((target + stripeFixed) / (1 - stripeRateDecimal)).toFixed(2))
      : target;

  const paypalInvoice =
    target > 0 && paypalRateDecimal < 1
      ? Number(((target + paypalFixed) / (1 - paypalRateDecimal)).toFixed(2))
      : target;

  const stripeFeeOnGrossUp = Number((stripeInvoice - target).toFixed(2));
  const paypalFeeOnGrossUp = Number((paypalInvoice - target).toFixed(2));

  // Fee if customer pays exact target
  const stripeFeeDirect = Number((((target * stripeRate) / 100) + stripeFixed).toFixed(2));
  const paypalFeeDirect = Number((((target * paypalRate) / 100) + paypalFixed).toFixed(2));

  const stripePayoutDirect = Number((target - stripeFeeDirect).toFixed(2));
  const paypalPayoutDirect = Number((target - paypalFeeDirect).toFixed(2));

  const savings = Number(Math.abs(paypalFeeOnGrossUp - stripeFeeOnGrossUp).toFixed(2));
  const recommended: "Stripe" | "PayPal" = stripeFeeOnGrossUp <= paypalFeeOnGrossUp ? "Stripe" : "PayPal";

  const dataSnippet = `To receive exactly ${symbol}${target.toFixed(2)} net payout, bill ${symbol}${stripeInvoice.toFixed(2)} on Stripe (${stripeRate}% + ${symbol}${stripeFixed.toFixed(2)}) versus ${symbol}${paypalInvoice.toFixed(2)} on PayPal — saving ${symbol}${savings.toFixed(2)} via Stripe.`;

  return {
    targetPayout: target,
    currency: currencyCode,
    currencySymbol: symbol,
    stripe: {
      name: "Stripe",
      ratePct: stripeRate,
      fixedFee: stripeFixed,
      invoiceToReceiveTarget: stripeInvoice,
      feeOnGrossUp: stripeFeeOnGrossUp,
      feeOnDirectTarget: stripeFeeDirect,
      payoutOnDirectTarget: stripePayoutDirect,
    },
    paypal: {
      name: "PayPal",
      ratePct: paypalRate,
      fixedFee: paypalFixed,
      invoiceToReceiveTarget: paypalInvoice,
      feeOnGrossUp: paypalFeeOnGrossUp,
      feeOnDirectTarget: paypalFeeDirect,
      payoutOnDirectTarget: paypalPayoutDirect,
    },
    recommended,
    savingsOnGrossUp: savings,
    dataSnippet,
  };
}
