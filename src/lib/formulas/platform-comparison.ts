import { calculateEtsyFees } from "./etsy-fees";
import { calculateShopifyProfit } from "./shopify-profit";
import { calculateTikTokFees } from "./tiktok-fees";

export interface ComparisonInput {
  sellingPrice: number;
  cogs?: number;
  shippingCharge?: number;
  shippingCost?: number;
  country?: string; // e.g. "us"
}

export interface PlatformResult {
  platform: "Etsy" | "Shopify" | "TikTok Shop";
  grossRevenue: number;
  totalPlatformFees: number;
  effectiveFeePct: number;
  netPayout: number;
  netProfit: number;
  netMarginPct: number;
}

export interface ComparisonSummary {
  input: ComparisonInput;
  results: PlatformResult[];
  winner: PlatformResult;
  dataSnippet: string;
}

export function compareMarketplaces(input: ComparisonInput): ComparisonSummary {
  const price = Math.max(0, input.sellingPrice || 0);
  const cogs = Math.max(0, input.cogs || 0);
  const shippingCharge = Math.max(0, input.shippingCharge || 0);
  const shippingCost = Math.max(0, input.shippingCost || 0);
  const country = input.country || "us";

  // 1. Etsy
  const etsy = calculateEtsyFees({
    itemPrice: price,
    shippingCharge: shippingCharge,
    country: country,
    offsiteAdsOptIn: false,
  });
  const etsyPlatformFees = etsy.totalFees;
  const etsyGross = price + shippingCharge;
  const etsyPayout = Number((etsyGross - etsyPlatformFees).toFixed(2));
  const etsyProfit = Number((etsyPayout - (cogs + shippingCost)).toFixed(2));
  const etsyMargin = etsyGross > 0 ? Number(((etsyProfit / etsyGross) * 100).toFixed(2)) : 0;

  // 2. Shopify (Shopify Payments: 2.9% + $0.30)
  const shopify = calculateShopifyProfit({
    revenue: price + shippingCharge,
    cogs: cogs,
    shippingCost: shippingCost,
    gateway: "shopify-payments",
  });
  const shopifyPlatformFees = shopify.paymentFee;
  const shopifyGross = price + shippingCharge;
  const shopifyPayout = Number((shopifyGross - shopifyPlatformFees).toFixed(2));
  const shopifyProfit = Number((shopifyPayout - (cogs + shippingCost)).toFixed(2));
  const shopifyMargin = shopifyGross > 0 ? Number(((shopifyProfit / shopifyGross) * 100).toFixed(2)) : 0;

  // 3. TikTok Shop (standard category referral 6%)
  const tiktok = calculateTikTokFees({
    salePrice: price,
    category: "beauty",
    creatorAffiliatePct: 0,
    cogs: cogs,
    shippingCost: shippingCost,
  });
  const tiktokPlatformFees = tiktok.referralFee;
  const tiktokGross = price + shippingCharge;
  const tiktokPayout = Number((price - tiktok.referralFee + shippingCharge).toFixed(2));
  const tiktokProfit = Number((tiktokPayout - (cogs + shippingCost)).toFixed(2));
  const tiktokMargin = tiktokGross > 0 ? Number(((tiktokProfit / tiktokGross) * 100).toFixed(2)) : 0;

  const results: PlatformResult[] = [
    {
      platform: "Shopify",
      grossRevenue: shopifyGross,
      totalPlatformFees: shopifyPlatformFees,
      effectiveFeePct: shopifyGross > 0 ? Number(((shopifyPlatformFees / shopifyGross) * 100).toFixed(2)) : 0,
      netPayout: shopifyPayout,
      netProfit: shopifyProfit,
      netMarginPct: shopifyMargin,
    },
    {
      platform: "TikTok Shop",
      grossRevenue: tiktokGross,
      totalPlatformFees: tiktokPlatformFees,
      effectiveFeePct: tiktokGross > 0 ? Number(((tiktokPlatformFees / tiktokGross) * 100).toFixed(2)) : 0,
      netPayout: tiktokPayout,
      netProfit: tiktokProfit,
      netMarginPct: tiktokMargin,
    },
    {
      platform: "Etsy",
      grossRevenue: etsyGross,
      totalPlatformFees: etsyPlatformFees,
      effectiveFeePct: etsy.effectiveFeePct,
      netPayout: etsyPayout,
      netProfit: etsyProfit,
      netMarginPct: etsyMargin,
    },
  ];

  // Sorted by net profit descending
  const sorted = [...results].sort((a, b) => b.netProfit - a.netProfit);
  const winner = sorted[0];

  const savingsOverEtsy = Number((winner.netPayout - etsyPayout).toFixed(2));
  const dataSnippet = `On a $${price.toFixed(2)} item, ${winner.platform} leaves the highest net payout of $${winner.netPayout.toFixed(2)} (${winner.effectiveFeePct}% fee) — saving $${Math.max(0, savingsOverEtsy).toFixed(2)} compared to Etsy ($${etsyPayout.toFixed(2)}).`;

  return {
    input,
    results,
    winner,
    dataSnippet,
  };
}
