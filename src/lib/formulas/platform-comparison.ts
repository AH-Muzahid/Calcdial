import { calculateEtsyFees } from "./etsy-fees";
import { calculateShopifyProfit } from "./shopify-profit";
import { calculateTikTokFees } from "./tiktok-fees";

export interface ComparisonInput {
  sellingPrice: number;
  cogs?: number;
  shippingCharge?: number;
  shippingCost?: number;
  country?: string; // e.g. "us"
  monthlyOrders?: number; // Volume projection
}

export interface PlatformResult {
  platform: "Etsy" | "Shopify" | "TikTok Shop";
  grossRevenue: number;
  totalPlatformFees: number;
  effectiveFeePct: number;
  netPayout: number;
  netProfit: number;
  netMarginPct: number;
  breakdown: { label: string; amount: number }[];
  annualProjection: {
    orders: number;
    grossRevenue: number;
    platformFees: number;
    netProfit: number;
  };
}

export interface ComparisonSummary {
  input: ComparisonInput;
  results: PlatformResult[];
  winner: PlatformResult;
  monthlyOrders: number;
  annualSavingsWinnerVsEtsy: number;
  dataSnippet: string;
}

export function compareMarketplaces(input: ComparisonInput): ComparisonSummary {
  const price = Math.max(0, input.sellingPrice || 0);
  const cogs = Math.max(0, input.cogs || 0);
  const shippingCharge = Math.max(0, input.shippingCharge || 0);
  const shippingCost = Math.max(0, input.shippingCost || 0);
  const country = input.country || "us";
  const monthlyOrders = Math.max(1, input.monthlyOrders || 100);
  const annualMultiplier = monthlyOrders * 12;

  // 1. Etsy Calculation
  const etsy = calculateEtsyFees({
    itemPrice: price,
    shippingCharge: shippingCharge,
    itemCost: cogs,
    shippingCost: shippingCost,
    country: country,
    offsiteAdsOptIn: false,
  });

  const etsyResult: PlatformResult = {
    platform: "Etsy",
    grossRevenue: etsy.grossRevenue,
    totalPlatformFees: etsy.totalFees,
    effectiveFeePct: etsy.effectiveFeePct,
    netPayout: etsy.etsyPayout,
    netProfit: etsy.netProfit,
    netMarginPct: etsy.netMarginPct,
    breakdown: etsy.breakdown.map((b) => ({ label: b.label, amount: b.amount })),
    annualProjection: {
      orders: annualMultiplier,
      grossRevenue: Number((etsy.grossRevenue * annualMultiplier).toFixed(2)),
      platformFees: Number((etsy.totalFees * annualMultiplier).toFixed(2)),
      netProfit: Number((etsy.netProfit * annualMultiplier).toFixed(2)),
    },
  };

  // 2. Shopify (Shopify Payments Basic: 2.9% + $0.30)
  const shopify = calculateShopifyProfit({
    itemPrice: price,
    shippingCharged: shippingCharge,
    cogs: cogs,
    shippingCost: shippingCost,
    shopifyPlan: "basic",
    gateway: "shopify-payments",
  });

  const shopifyResult: PlatformResult = {
    platform: "Shopify",
    grossRevenue: shopify.revenue,
    totalPlatformFees: shopify.totalPlatformFees,
    effectiveFeePct: shopify.revenue > 0 ? Number(((shopify.totalPlatformFees / shopify.revenue) * 100).toFixed(2)) : 0,
    netPayout: shopify.netPayout,
    netProfit: shopify.netProfit,
    netMarginPct: shopify.netMarginPct,
    breakdown: shopify.breakdown.map((b) => ({ label: b.label, amount: b.amount })),
    annualProjection: {
      orders: annualMultiplier,
      grossRevenue: Number((shopify.revenue * annualMultiplier).toFixed(2)),
      platformFees: Number((shopify.totalPlatformFees * annualMultiplier).toFixed(2)),
      netProfit: Number((shopify.netProfit * annualMultiplier).toFixed(2)),
    },
  };

  // 3. TikTok Shop (Category referral 6.0% + $0.30 flat)
  const tiktok = calculateTikTokFees({
    salePrice: price,
    shippingCharged: shippingCharge,
    cogs: cogs,
    shippingCost: shippingCost,
    category: "apparel",
    creatorAffiliatePct: 0,
  });

  const tiktokResult: PlatformResult = {
    platform: "TikTok Shop",
    grossRevenue: tiktok.grossRevenue,
    totalPlatformFees: tiktok.totalFees,
    effectiveFeePct: tiktok.effectiveFeePct,
    netPayout: tiktok.netPayout,
    netProfit: tiktok.netProfit,
    netMarginPct: tiktok.netMarginPct,
    breakdown: tiktok.breakdown.map((b) => ({ label: b.label, amount: b.amount })),
    annualProjection: {
      orders: annualMultiplier,
      grossRevenue: Number((tiktok.grossRevenue * annualMultiplier).toFixed(2)),
      platformFees: Number((tiktok.totalFees * annualMultiplier).toFixed(2)),
      netProfit: Number((tiktok.netProfit * annualMultiplier).toFixed(2)),
    },
  };

  const results: PlatformResult[] = [shopifyResult, tiktokResult, etsyResult];

  // Sorted by net profit descending
  const sorted = [...results].sort((a, b) => b.netProfit - a.netProfit);
  const winner = sorted[0];

  const annualSavingsWinnerVsEtsy = Number(
    Math.max(0, winner.annualProjection.netProfit - etsyResult.annualProjection.netProfit).toFixed(2)
  );

  const dataSnippet = `On a $${price.toFixed(2)} item, ${winner.platform} yields the highest net profit of $${winner.netProfit.toFixed(2)} (${winner.effectiveFeePct}% platform fee). At ${monthlyOrders} orders/month, selling on ${winner.platform} puts an extra $${annualSavingsWinnerVsEtsy.toLocaleString()} into your bank account each year compared to Etsy.`;

  return {
    input,
    results,
    winner,
    monthlyOrders,
    annualSavingsWinnerVsEtsy,
    dataSnippet,
  };
}
