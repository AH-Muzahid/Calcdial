import { describe, it, expect } from "vitest";
import { calculateShopifyProfit } from "@/lib/formulas/shopify-profit";

describe("Shopify Profit & ROAS Formula", () => {
  it("calculates native Shopify Payments correctly", () => {
    const result = calculateShopifyProfit({
      revenue: 50.00,
      cogs: 15.00,
      shippingCost: 5.00,
      adSpend: 10.00,
      gateway: "shopify-payments",
    });

    expect(result.paymentFee).toBe(1.75);
    expect(result.thirdPartyTransactionFee).toBe(0);
    expect(result.grossProfit).toBe(28.25);
    expect(result.netProfit).toBe(18.25);
    expect(result.breakEvenRoas).toBeGreaterThan(1);
    expect(result.breakdown.length).toBe(4);
  });

  it("adds third-party transaction fee for external gateways and custom transaction pct", () => {
    const result = calculateShopifyProfit({
      revenue: 100.00,
      gateway: "stripe",
    });

    expect(result.thirdPartyTransactionFee).toBe(2.00);
    expect(result.breakdown.some((b) => b.label.includes("External"))).toBe(true);

    const custom = calculateShopifyProfit({
      revenue: 200.00,
      shopifyPlanTransactionPct: 1.0,
      customRatePct: 2.5,
      customFixedFee: 0.20,
    });
    expect(custom.thirdPartyTransactionFee).toBe(2.00);
    expect(custom.paymentFee).toBe(5.20);
  });

  it("calculates break-even ROAS correctly and handles zero revenue", () => {
    const result = calculateShopifyProfit({
      revenue: 100.00,
      cogs: 50.00,
      customRatePct: 0,
      customFixedFee: 0,
    });

    expect(result.grossMarginPct).toBe(50.0);
    expect(result.breakEvenRoas).toBe(2.0);

    const zero = calculateShopifyProfit({ revenue: 0 });
    expect(zero.revenue).toBe(0);
    expect(zero.breakEvenRoas).toBe(0);
    expect(zero.grossMarginPct).toBe(0);
  });
});
