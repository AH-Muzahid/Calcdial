import { describe, it, expect } from "vitest";
import { calculatePodProfit } from "@/lib/formulas/pod-profit";

describe("POD Profit Formula", () => {
  it("calculates standard t-shirt margin with defaults", () => {
    const result = calculatePodProfit({
      retailPrice: 28.00,
      productType: "t-shirts",
      marketplaceFeePct: 10,
      adSpendPerSale: 5.00,
      shippingCharged: 4.50,
      shippingCost: 4.50,
      basePrintCost: 9.50,
    });

    expect(result.grossRevenue).toBe(32.50);
    expect(result.basePrintCost).toBe(9.50);
    expect(result.netProfit).toBeGreaterThan(0);
    expect(result.grossMarginPct).toBeGreaterThan(0);
    expect(result.breakEvenPrice).toBeGreaterThan(0);
    expect(result.breakdown.length).toBe(4);
  });

  it("calculates Etsy channel fees and break-even accurately", () => {
    const result = calculatePodProfit({
      retailPrice: 29.99,
      salesChannel: "etsy",
      basePrintCost: 10.00,
      shippingCost: 4.50,
      shippingCharged: 4.99,
      adSpendPerSale: 3.00,
    });

    expect(result.marketplaceFee).toBeGreaterThan(3.0);
    expect(result.marketplacePayout).toBe(Number((result.grossRevenue - result.marketplaceFee).toFixed(2)));
    expect(result.breakEvenPrice).toBeGreaterThan(0);
  });

  it("supports Shopify, TikTok Shop, and eBay sales channels accurately", () => {
    const shopify = calculatePodProfit({
      retailPrice: 30.00,
      salesChannel: "shopify",
      basePrintCost: 10.00,
    });
    // 2.9% of $30 + $0.30 = $0.87 + $0.30 = $1.17
    expect(shopify.marketplaceFee).toBe(1.17);

    const tiktok = calculatePodProfit({
      retailPrice: 30.00,
      salesChannel: "tiktok",
      basePrintCost: 10.00,
    });
    // 6% of $30 + $0.30 = $1.80 + $0.30 = $2.10
    expect(tiktok.marketplaceFee).toBe(2.10);

    const ebay = calculatePodProfit({
      retailPrice: 30.00,
      salesChannel: "ebay",
      basePrintCost: 10.00,
    });
    // 13.25% of $30 + $0.40 = 3.975 + 0.40 = $4.38
    expect(ebay.marketplaceFee).toBe(4.38);
  });

  it("calculates target price for desired profit margin", () => {
    const result = calculatePodProfit({
      retailPrice: 30.00,
      salesChannel: "shopify",
      basePrintCost: 10.00,
      shippingCost: 4.00,
      targetMarginPct: 30,
    });

    expect(result.targetPriceForMargin).toBeDefined();
    expect(result.targetPriceForMargin!).toBeGreaterThan(result.breakEvenPrice);

    // Verify target price: charging targetPriceForMargin should yield approximately 30% margin
    const targetResult = calculatePodProfit({
      retailPrice: result.targetPriceForMargin!,
      salesChannel: "shopify",
      basePrintCost: 10.00,
      shippingCost: 4.00,
    });
    expect(targetResult.netMarginPct).toBeGreaterThanOrEqual(29.0);
    expect(targetResult.netMarginPct).toBeLessThanOrEqual(31.0);
  });

  it("supports custom channel with custom fixed fee", () => {
    const custom = calculatePodProfit({
      retailPrice: 50.00,
      salesChannel: "custom",
      marketplaceFeePct: 15.0,
      marketplaceFixedFee: 0.50,
      basePrintCost: 12.00,
    });

    // 15% of $50 + $0.50 = $7.50 + $0.50 = $8.00
    expect(custom.marketplaceFee).toBe(8.00);
  });

  it("calculates mug preset when custom costs omitted", () => {
    const result = calculatePodProfit({
      retailPrice: 15.00,
      productType: "mugs",
    });

    expect(result.basePrintCost).toBe(5.50);
    expect(result.totalShippingCost).toBe(5.00);
    expect(result.netProfit).toBeGreaterThan(0);
  });

  it("handles negative profit scenarios gracefully", () => {
    const result = calculatePodProfit({
      retailPrice: 5.00,
      basePrintCost: 15.00,
      adSpendPerSale: 10.00,
    });

    expect(result.netProfit).toBeLessThan(0);
    expect(result.netMarginPct).toBeLessThan(0);
  });

  it("handles zero values without NaN or infinite results", () => {
    const result = calculatePodProfit({
      retailPrice: 0,
      basePrintCost: 0,
      shippingCharged: 0,
    });

    expect(result.grossRevenue).toBe(0);
    expect(result.grossMarginPct).toBe(0);
    expect(result.netMarginPct).toBe(0);
    expect(isNaN(result.netProfit)).toBe(false);
  });
});
