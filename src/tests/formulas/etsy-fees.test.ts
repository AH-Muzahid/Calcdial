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
    expect(result.netProfit).toBe(31.22);
    expect(result.effectiveFeePct).toBeGreaterThan(10);
    expect(result.breakdown.length).toBe(3);
    expect(result.dataSnippet).toContain("Etsy");
  });

  it("handles Offsite Ads (15%) correctly", () => {
    const result = calculateEtsyFees({
      itemPrice: 100.0,
      shippingCharge: 0,
      country: "us",
      offsiteAdsOptIn: true,
      offsiteAdsRate: 0.15,
    });

    expect(result.offsiteAdsFee).toBe(15.00);
    expect(result.breakdown.some((b) => b.label.includes("Offsite Ads"))).toBe(true);
  });

  it("handles Offsite Ads default rate (15%) when rate omitted", () => {
    const result = calculateEtsyFees({
      itemPrice: 100.0,
      shippingCharge: 0,
      offsiteAdsOptIn: true,
    });
    expect(result.offsiteAdsFee).toBe(15.00);
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

    const frResult = calculateEtsyFees({
      itemPrice: 50.0,
      shippingCharge: 0,
      country: "fr",
      customListingFee: 0.20,
    });
    expect(frResult.regulatoryFee).toBeGreaterThan(0);
  });

  it("supports quantity multipliers and unknown country fallback", () => {
    const batchResult = calculateEtsyFees({
      itemPrice: 10.0,
      shippingCharge: 2.0,
      quantity: 3,
      country: "unknown_xyz",
    });

    expect(batchResult.listingFee).toBe(0.60);
    expect(batchResult.grossRevenue).toBe(36.00);
  });
});
