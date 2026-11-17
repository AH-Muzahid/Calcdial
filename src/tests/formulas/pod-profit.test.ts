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
    expect(result.breakdown.length).toBe(4);
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
