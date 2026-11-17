import { POD_ITEM_PRESETS, FeePreset } from "@/data/fee-presets";

export interface PodInput {
  retailPrice: number;
  basePrintCost?: number;
  shippingCharged?: number;
  shippingCost?: number;
  salesChannel?: "etsy" | "shopify" | "tiktok" | "ebay" | "custom";
  marketplaceFeePct?: number; // fallback or custom %
  marketplaceFixedFee?: number; // flat fee like $0.20 listing + $0.30 gateway
  adSpendPerSale?: number;
  productType?: string; // e.g. "t-shirts", "mugs"
  targetMarginPct?: number; // e.g. 40%
}

export interface PodResult {
  retailPrice: number;
  grossRevenue: number;
  basePrintCost: number;
  totalShippingCost: number;
  marketplaceFee: number;
  adSpend: number;
  totalCosts: number;
  marketplacePayout: number; // What the sales channel sends to bank
  netProfit: number;
  grossMarginPct: number;
  netMarginPct: number;
  roiPct: number;
  breakEvenPrice: number;
  targetPriceForMargin?: number;
  breakdown: { label: string; amount: number; rate?: string }[];
  dataSnippet: string;
}

export function calculatePodProfit(input: PodInput): PodResult {
  const retail = Math.max(0, input.retailPrice || 0);
  const preset: FeePreset | undefined = POD_ITEM_PRESETS.find(
    (p) => p.id === (input.productType || "t-shirts").toLowerCase()
  );

  const baseCost = input.basePrintCost !== undefined ? Math.max(0, input.basePrintCost) : (preset?.fees.baseCost ?? 9.50);
  const shipCharged = Math.max(0, input.shippingCharged || 0);
  const shipCost = input.shippingCost !== undefined ? Math.max(0, input.shippingCost) : (preset?.fees.defaultShipping ?? 4.50);
  const adSpend = Math.max(0, input.adSpendPerSale || 0);

  // Sales channel fee calculation
  let mktPct = input.marketplaceFeePct !== undefined ? Math.max(0, input.marketplaceFeePct) : 12.0;
  let mktFixed = input.marketplaceFixedFee !== undefined ? Math.max(0, input.marketplaceFixedFee) : 0.0;

  if (input.salesChannel === "etsy") {
    mktPct = 9.5; // 6.5% transaction + 3.0% processing
    mktFixed = 0.45; // $0.20 listing + $0.25 fixed processing
  } else if (input.salesChannel === "shopify") {
    mktPct = 2.9;
    mktFixed = 0.30;
  } else if (input.salesChannel === "tiktok") {
    mktPct = 6.0;
    mktFixed = 0.30;
  } else if (input.salesChannel === "ebay") {
    mktPct = 13.25;
    mktFixed = 0.40;
  }

  const grossRevenue = Number((retail + shipCharged).toFixed(2));
  const marketplaceFee = grossRevenue > 0
    ? Number((((grossRevenue * mktPct) / 100) + mktFixed).toFixed(2))
    : mktFixed;

  const totalCosts = Number((baseCost + shipCost + marketplaceFee + adSpend).toFixed(2));
  const totalFulfillment = Number((baseCost + shipCost).toFixed(2));

  // Bank payout from sales channel
  const marketplacePayout = Number((grossRevenue - marketplaceFee).toFixed(2));

  // Real Net Profit
  const netProfit = Number((grossRevenue - totalCosts).toFixed(2));

  const grossProfitBeforeAds = Number((grossRevenue - (baseCost + shipCost + marketplaceFee)).toFixed(2));
  const grossMarginPct = grossRevenue > 0 ? Number(((grossProfitBeforeAds / grossRevenue) * 100).toFixed(2)) : 0;
  const netMarginPct = grossRevenue > 0 ? Number(((netProfit / grossRevenue) * 100).toFixed(2)) : 0;
  const totalInvestment = totalFulfillment + adSpend;
  const roiPct = totalInvestment > 0 ? Number(((netProfit / totalInvestment) * 100).toFixed(2)) : 0;

  // Break-even retail price
  // (P + Sc) * (1 - mktPct/100) - mktFixed = baseCost + shipCost + adSpend
  let breakEvenPrice = 0;
  const rateFraction = mktPct / 100;
  if (rateFraction < 1) {
    const requiredOrder = (baseCost + shipCost + adSpend + mktFixed) / (1 - rateFraction);
    breakEvenPrice = Number(Math.max(0, requiredOrder - shipCharged).toFixed(2));
  }

  // Target Margin Price
  let targetPriceForMargin: number | undefined;
  if (input.targetMarginPct !== undefined && input.targetMarginPct > 0) {
    const marginFraction = input.targetMarginPct / 100;
    const denominator = 1 - rateFraction - marginFraction;
    if (denominator > 0.05) {
      const requiredOrder = (baseCost + shipCost + adSpend + mktFixed) / denominator;
      targetPriceForMargin = Number(Math.max(0, requiredOrder - shipCharged).toFixed(2));
    }
  }

  const breakdown = [
    { label: "Base Print & Blank Cost", amount: baseCost, rate: "Printify / Printful" },
    { label: "Provider Shipping & Packaging", amount: shipCost },
    {
      label: `Channel Fee (${input.salesChannel ? input.salesChannel.toUpperCase() : "Platform"})`,
      amount: marketplaceFee,
      rate: mktFixed > 0 ? `${mktPct}% + $${mktFixed.toFixed(2)}` : `${mktPct}%`,
    },
  ];

  if (adSpend > 0) {
    breakdown.push({ label: "Ad Spend per Order (CAC)", amount: adSpend });
  }

  const dataSnippet = `Selling a POD item for $${retail.toFixed(2)} with $${baseCost.toFixed(2)} print cost generates $${netProfit.toFixed(2)} net profit (${netMarginPct}% margin) after platform fees and fulfillment.`;

  return {
    retailPrice: retail,
    grossRevenue,
    basePrintCost: baseCost,
    totalShippingCost: shipCost,
    marketplaceFee,
    adSpend,
    totalCosts,
    marketplacePayout,
    netProfit,
    grossMarginPct,
    netMarginPct,
    roiPct,
    breakEvenPrice,
    targetPriceForMargin,
    breakdown,
    dataSnippet,
  };
}
