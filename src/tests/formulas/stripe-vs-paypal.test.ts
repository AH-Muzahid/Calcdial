import { describe, it, expect } from "vitest";
import { comparePaymentProcessors } from "@/lib/formulas/stripe-vs-paypal";

describe("Stripe vs PayPal Gross-up Formula", () => {
  it("computes accurate gross-up so payout equals target", () => {
    const target = 1000.00;
    const result = comparePaymentProcessors({
      targetPayout: target,
      currency: "usd",
    });

    expect(result.stripe.invoiceToReceiveTarget).toBe(1030.18);
    expect(result.paypal.invoiceToReceiveTarget).toBeGreaterThan(result.stripe.invoiceToReceiveTarget);
    expect(result.recommended).toBe("Stripe");
    expect(result.savingsOnGrossUp).toBeGreaterThan(0);
    expect(result.stripe.feeOnDirectTarget).toBeGreaterThan(0);
    expect(result.stripe.payoutOnDirectTarget).toBeLessThan(target);
  });

  it("handles GBP and EUR currencies", () => {
    const gbp = comparePaymentProcessors({ targetPayout: 500, currency: "gbp" });
    expect(gbp.currency).toBe("GBP");
    expect(gbp.currencySymbol).toBe("£");

    const eur = comparePaymentProcessors({ targetPayout: 500, currency: "eur" });
    expect(eur.currency).toBe("EUR");
    expect(eur.currencySymbol).toBe("€");
  });

  it("adds international and currency conversion surcharges", () => {
    const domestic = comparePaymentProcessors({ targetPayout: 500, isInternational: false, currencyConversion: false });
    const intl = comparePaymentProcessors({ targetPayout: 500, isInternational: true, currencyConversion: true });

    expect(intl.stripe.ratePct).toBeGreaterThan(domestic.stripe.ratePct);
    expect(intl.paypal.ratePct).toBeGreaterThan(domestic.paypal.ratePct);
    expect(intl.stripe.invoiceToReceiveTarget).toBeGreaterThan(domestic.stripe.invoiceToReceiveTarget);
  });

  it("handles zero target safely", () => {
    const result = comparePaymentProcessors({ targetPayout: 0 });
    expect(result.stripe.invoiceToReceiveTarget).toBe(0);
    expect(result.paypal.invoiceToReceiveTarget).toBe(0);
  });
});
