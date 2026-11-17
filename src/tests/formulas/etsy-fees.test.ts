import { describe, it, expect } from "vitest";
import { calculateEtsyFees } from "@/lib/formulas/etsy-fees";

describe("Etsy Fee Formula Comprehensive", () => {
  it("calculates standard US sale correctly", () => {
    const result = calculateEtsyFees({
      itemPrice: 29.99,
      shippingCharge: 5.0,
      country: "us",
      offsiteAdsOptIn: false,
    });

    expect(result.grossRevenue).toBe(34.99);
    expect(result.listingFee).toBe(0.20);
    expect(result.transactionFee).toBe(2.27);
    expect(result.paymentProcessingFee).toBe(1.30);
    expect(result.totalFees).toBe(3.77);
    expect(result.etsyPayout).toBe(31.22);
    expect(result.netProfit).toBe(31.22); // No COGS entered
    expect(result.effectiveFeePct).toBeGreaterThan(10);
    expect(result.breakdown.length).toBe(3);
    expect(result.dataSnippet).toContain("Etsy");
  });

  it("calculates true net profit and margin with COGS and actual shipping costs", () => {
    const result = calculateEtsyFees({
      itemPrice: 35.0,
      shippingCharge: 5.0,
      itemCost: 12.0, // Materials & Labor
      shippingCost: 4.50, // Actual Postage paid by seller
      country: "us",
    });

    // Gross revenue = $40.00
    expect(result.grossRevenue).toBe(40.0);
    // Listing = $0.20, Transaction 6.5% = $2.60, Processing 3%+$0.25 = $1.45. Total fees = $4.25
    expect(result.totalFees).toBe(4.25);
    // Etsy deposits $40.00 - $4.25 = $35.75
    expect(result.etsyPayout).toBe(35.75);
    // Product costs = $12.00 + $4.50 = $16.50
    expect(result.totalProductCosts).toBe(16.50);
    // Real Net Profit = $35.75 - $16.50 = $19.25
    expect(result.netProfit).toBe(19.25);
    // Margin % = (19.25 / 40.00) * 100 = 48.13%
    expect(result.netMarginPct).toBe(48.13);
    // Break-even price is greater than 0
    expect(result.breakEvenPrice).toBeGreaterThan(0);
  });

  it("calculates accurate break-even price", () => {
    const result = calculateEtsyFees({
      itemPrice: 20.0,
      shippingCharge: 0, // Free shipping
      itemCost: 10.0,
      shippingCost: 4.0,
      country: "us",
    });

    // At breakEvenPrice, profit should be approximately 0
    const beResult = calculateEtsyFees({
      itemPrice: result.breakEvenPrice,
      shippingCharge: 0,
      itemCost: 10.0,
      shippingCost: 4.0,
      country: "us",
    });

    expect(Math.abs(beResult.netProfit)).toBeLessThan(0.15);
  });

  it("calculates target margin price correctly and handles unattainable margins", () => {
    const result = calculateEtsyFees({
      itemPrice: 30.0,
      shippingCharge: 0,
      itemCost: 10.0,
      shippingCost: 4.0,
      targetMarginPct: 30, // Desired 30% margin
      country: "us",
    });

    expect(result.targetPriceForMargin).toBeDefined();
    expect(result.targetPriceForMargin!).toBeGreaterThan(result.breakEvenPrice);

    const impossible = calculateEtsyFees({
      itemPrice: 30.0,
      shippingCharge: 0,
      itemCost: 10.0,
      targetMarginPct: 95, // 95% + 10% fees > 100%
      country: "us",
    });
    expect(impossible.targetPriceForMargin).toBeUndefined();
  });

  it("handles Offsite Ads default rate (15%) when rate omitted", () => {
    const result = calculateEtsyFees({
      itemPrice: 100.0,
      shippingCharge: 0,
      country: "us",
      offsiteAdsOptIn: true,
    });
    expect(result.offsiteAdsFee).toBe(15.00);
  });

  it("handles custom listing fee override", () => {
    const custom = calculateEtsyFees({
      itemPrice: 100.0,
      shippingCharge: 0,
      customListingFee: 0.50,
      quantity: 2,
    });
    expect(custom.listingFee).toBe(1.00); // $0.50 x 2
  });

  it("handles international buyer surcharge (+1%)", () => {
    const domestic = calculateEtsyFees({ itemPrice: 50, shippingCharge: 0, isInternationalBuyer: false });
    const intl = calculateEtsyFees({ itemPrice: 50, shippingCharge: 0, isInternationalBuyer: true });

    expect(intl.paymentProcessingFee).toBeGreaterThan(domestic.paymentProcessingFee);
  });

  it("handles zero price and negative numbers safely", () => {
    const zeroResult = calculateEtsyFees({
      itemPrice: 0,
      shippingCharge: -5,
      quantity: 1,
      customListingFee: 0.25,
    });

    expect(zeroResult.grossRevenue).toBe(0);
    expect(zeroResult.listingFee).toBe(0.25);
    expect(zeroResult.totalFees).toBe(0.25);
    expect(zeroResult.netProfit).toBe(-0.25);
    expect(zeroResult.effectiveFeePct).toBe(0);
  });

  it("calculates international country presets with regulatory fees (e.g. UK, FR)", () => {
    const ukResult = calculateEtsyFees({
      itemPrice: 50.0,
      shippingCharge: 5.0,
      country: "uk",
    });

    expect(ukResult.regulatoryFee).toBeGreaterThan(0);
    expect(ukResult.breakdown.some((b) => b.label.includes("Regulatory"))).toBe(true);
  });
});
