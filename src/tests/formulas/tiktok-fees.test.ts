import { describe, it, expect } from "vitest";
import { calculateTikTokFees } from "@/lib/formulas/tiktok-fees";

describe("TikTok Shop Fee Formula", () => {
  it("calculates beauty category referral and affiliate commission", () => {
    const result = calculateTikTokFees({
      salePrice: 20.00,
      category: "beauty",
      creatorAffiliatePct: 10,
      cogs: 4.00,
      shippingCost: 3.00,
    });

    expect(result.referralRatePct).toBe(6.0);
    expect(result.referralFee).toBe(1.20);
    expect(result.affiliateCommission).toBe(2.00);
    expect(result.netPayout).toBe(16.80);
    expect(result.netProfit).toBe(9.80);
    expect(result.netMarginPct).toBe(49.0);
  });

  it("handles electronics category preset (5% referral) and custom referral rate", () => {
    const result = calculateTikTokFees({
      salePrice: 100.00,
      category: "electronics",
    });

    expect(result.referralRatePct).toBe(5.0);
    expect(result.referralFee).toBe(5.00);

    const custom = calculateTikTokFees({
      salePrice: 100.00,
      customReferralPct: 8.5,
    });
    expect(custom.referralRatePct).toBe(8.5);
    expect(custom.referralFee).toBe(8.50);
  });

  it("handles zero price safely", () => {
    const result = calculateTikTokFees({ salePrice: 0 });
    expect(result.salePrice).toBe(0);
    expect(result.netPayout).toBe(0);
    expect(result.netMarginPct).toBe(0);
  });
});
