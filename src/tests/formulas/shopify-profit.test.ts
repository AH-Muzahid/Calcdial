import { describe, it, expect } from "vitest";
import { calculateShopifyProfit } from "@/lib/formulas/shopify-profit";

describe("Shopify Profit & ROAS Formula", () => {
  it("calculates native Shopify Payments on Basic plan correctly", () => {
    const result = calculateShopifyProfit({
      itemPrice: 50.00,
      shippingCharged: 0,
      cogs: 15.00,
      shippingCost: 5.00,
      adSpend: 10.00,
      shopifyPlan: "basic",
      gateway: "shopify-payments",
    });

    // 2.9% of $50 + $0.30 = $1.45 + $0.30 = $1.75
    expect(result.paymentFee).toBe(1.75);
    expect(result.thirdPartyTransactionFee).toBe(0);
    expect(result.totalPlatformFees).toBe(1.75);
    expect(result.netPayout).toBe(48.25);
    // Gross profit = 50 - 15 - 5 - 1.75 = 28.25
    expect(result.grossProfit).toBe(28.25);
    // Net profit = 48.25 - 15 - 5 - 10 = 18.25
    expect(result.netProfit).toBe(18.25);
    expect(result.netMarginPct).toBe(36.5);
    expect(result.breakEvenRoas).toBeGreaterThan(1);
    expect(result.breakdown.length).toBe(4);
  });

  it("calculates Advanced plan lower card rates correctly", () => {
    const result = calculateShopifyProfit({
      itemPrice: 100.00,
      shippingCharged: 10.00, // Total $110
      cogs: 30.00,
      shippingCost: 8.00,
      shopifyPlan: "advanced",
      gateway: "shopify-payments",
    });

    // Advanced rate: 2.5% + $0.30 on $110 = 2.75 + 0.30 = $3.05
    expect(result.revenue).toBe(110.00);
    expect(result.paymentFee).toBe(3.05);
    expect(result.thirdPartyTransactionFee).toBe(0);
    expect(result.netPayout).toBe(106.95);
  });

  it("adds third-party transaction fee for external gateways", () => {
    const result = calculateShopifyProfit({
      itemPrice: 100.00,
      shippingCharged: 0,
      shopifyPlan: "basic",
      gateway: "stripe", // 2.9% + $0.30 gateway + 2.0% Basic 3rd-party
    });

    expect(result.paymentFee).toBe(3.20);
    expect(result.thirdPartyTransactionFee).toBe(2.00);
    expect(result.totalPlatformFees).toBe(5.20);
    expect(result.breakdown.some((b) => b.label.includes("External"))).toBe(true);
  });

  it("calculates Break-Even selling price and Target Margin price", () => {
    const result = calculateShopifyProfit({
      itemPrice: 50.00,
      shippingCharged: 5.00,
      cogs: 15.00,
      shippingCost: 5.00,
      adSpend: 5.00,
      shopifyPlan: "basic",
      gateway: "shopify-payments",
      targetMarginPct: 20,
    });

    expect(result.breakEvenPrice).toBeGreaterThan(0);
    expect(result.targetPriceForMargin).toBeDefined();
    expect(result.targetPriceForMargin!).toBeGreaterThan(result.breakEvenPrice);

    // Verify break-even: if seller charges breakEvenPrice, net profit should be approx $0
    const beResult = calculateShopifyProfit({
      itemPrice: result.breakEvenPrice,
      shippingCharged: 5.00,
      cogs: 15.00,
      shippingCost: 5.00,
      adSpend: 5.00,
      shopifyPlan: "basic",
      gateway: "shopify-payments",
    });
    expect(Math.abs(beResult.netProfit)).toBeLessThanOrEqual(0.05);
  });

  it("handles zero values and edge cases gracefully", () => {
    const zero = calculateShopifyProfit({ itemPrice: 0, revenue: 0 });
    expect(zero.revenue).toBe(0);
    expect(zero.paymentFee).toBe(0);
    expect(zero.netProfit).toBe(0);
    expect(zero.breakEvenRoas).toBe(0);
    expect(zero.grossMarginPct).toBe(0);
  });
});
