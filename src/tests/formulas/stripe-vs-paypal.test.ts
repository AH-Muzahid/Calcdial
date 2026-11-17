import { describe, it, expect } from "vitest";
import { comparePaymentProcessors } from "@/lib/formulas/stripe-vs-paypal";

describe("Stripe vs PayPal Multi-Mode Formula", () => {
  it("computes accurate direct charge payout and fees", () => {
    const result = comparePaymentProcessors({
      amount: 100.00,
      currency: "usd",
      transactionType: "checkout",
    });

    // Stripe: 2.9% of $100 + $0.30 = $3.20 fee, payout $96.80
    expect(result.stripe.feeOnCharge).toBe(3.20);
    expect(result.stripe.netPayoutOnCharge).toBe(96.80);

    // PayPal checkout: 3.49% of $100 + $0.49 = $3.98 fee, payout $96.02
    expect(result.paypal.feeOnCharge).toBe(3.98);
    expect(result.paypal.netPayoutOnCharge).toBe(96.02);

    expect(result.recommended).toBe("Stripe");
    expect(result.savingsOnDirectCharge).toBe(0.78);
  });

  it("computes accurate gross-up invoice amount so net payout equals target", () => {
    const result = comparePaymentProcessors({
      targetPayout: 1000.00,
      currency: "usd",
      transactionType: "checkout",
    });

    expect(result.stripe.invoiceToReceiveTarget).toBe(1030.18);
    expect(result.paypal.invoiceToReceiveTarget).toBeGreaterThan(result.stripe.invoiceToReceiveTarget);
    expect(result.savingsOnGrossUp).toBeGreaterThan(0);
  });

  it("supports invoicing transaction type with adjusted rates", () => {
    const checkout = comparePaymentProcessors({ amount: 100, transactionType: "checkout" });
    const invoice = comparePaymentProcessors({ amount: 100, transactionType: "invoice" });

    // PayPal invoicing rate is 2.99% compared to 3.49% for checkout
    expect(invoice.paypal.ratePct).toBe(2.99);
    expect(checkout.paypal.ratePct).toBe(3.49);
    // Stripe invoicing has +0.4% starter invoicing fee
    expect(invoice.stripe.ratePct).toBe(3.3);
  });

  it("handles GBP, EUR, and currency conversion", () => {
    const gbp = comparePaymentProcessors({ amount: 500, currency: "gbp" });
    expect(gbp.currency).toBe("GBP");
    expect(gbp.currencySymbol).toBe("£");

    const intl = comparePaymentProcessors({
      amount: 500,
      isInternational: true,
      currencyConversion: true,
    });
    expect(intl.stripe.ratePct).toBeGreaterThan(2.9);
    expect(intl.paypal.ratePct).toBeGreaterThan(3.49);
  });

  it("projects monthly and annual volume savings accurately", () => {
    const result = comparePaymentProcessors({
      amount: 100,
      monthlyVolume: 10000,
      averageTicket: 100,
    });

    expect(result.stripe.monthlyFees).toBeGreaterThan(0);
    expect(result.paypal.monthlyFees).toBeGreaterThan(result.stripe.monthlyFees);
    expect(result.annualSavings).toBeGreaterThan(0);
  });

  it("handles zero amount safely", () => {
    const zero = comparePaymentProcessors({ amount: 0 });
    expect(zero.stripe.feeOnCharge).toBe(0);
    expect(zero.paypal.feeOnCharge).toBe(0);
  });
});
