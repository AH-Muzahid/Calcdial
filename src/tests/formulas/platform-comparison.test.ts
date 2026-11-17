import { describe, it, expect } from "vitest";
import { compareMarketplaces } from "@/lib/formulas/platform-comparison";

describe("Marketplace Comparison Formula", () => {
  it("compares Etsy, Shopify, and TikTok Shop side by side", () => {
    const comparison = compareMarketplaces({
      sellingPrice: 35.00,
      cogs: 10.00,
      shippingCharge: 4.00,
      shippingCost: 4.00,
      country: "us",
    });

    expect(comparison.results.length).toBe(3);
    expect(comparison.winner).toBeDefined();
    expect(comparison.winner.platform).toBe("Shopify");
    expect(comparison.dataSnippet).toContain("highest net payout");
  });

  it("handles low-price items and zero prices gracefully", () => {
    const comparison = compareMarketplaces({
      sellingPrice: 2.00,
      cogs: 1.00,
    });

    expect(comparison.results.length).toBe(3);
    comparison.results.forEach((r) => {
      expect(isNaN(r.netProfit)).toBe(false);
    });

    const zero = compareMarketplaces({
      sellingPrice: 0,
      cogs: 0,
      shippingCharge: 0,
      shippingCost: 0,
    });
    expect(zero.results[0].grossRevenue).toBe(0);
    expect(zero.results[0].effectiveFeePct).toBe(0);
  });
});
