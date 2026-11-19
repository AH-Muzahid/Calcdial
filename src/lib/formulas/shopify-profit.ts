import { SHOPIFY_GATEWAY_PRESETS, FeePreset } from "@/data/fee-presets";

export type ShopifyPlan = "basic" | "shopify" | "advanced" | "plus";

export interface ShopifyInput {
  itemPrice?: number; // Retail selling price
  revenue?: number; // Legacy/Gross Order Value fallback
  shippingCharged?: number; // Shipping charged to customer
  cogs?: number;
  shippingCost?: number;
  adSpend?: number;
  shopifyPlan?: ShopifyPlan;
  gateway?: string; // e.g. "shopify-payments", "stripe", "paypal"
  customRatePct?: number;
  customFixedFee?: number;
  shopifyPlanTransactionPct?: number; // 0 for Shopify Payments, 0.5-2.0% for external
  targetMarginPct?: number; // Desired net margin %
  targetProfitDollar?: number; // Desired net dollar profit
}

export interface ShopifyResult {
  revenue: number; // Gross Order Value (itemPrice + shippingCharged)
  itemPrice: number;
  shippingCharged: number;
  cogs: number;
  shippingCost: number;
  paymentFee: number;
  thirdPartyTransactionFee: number;
  totalPlatformFees: number;
  netPayout: number; // Bank deposit before COGS/Ads
  adSpend: number;
  totalExpenses: number;
  grossProfit: number;
  grossMarginPct: number;
  netProfit: number;
  netMarginPct: number;
  roiPct: number;
  breakEvenRoas: number;
  breakEvenPrice: number;
  targetPriceForMargin?: number;
  targetPriceForDollar?: number;
  recommendedPrice?: number;
  breakdown: { label: string; amount: number; rate?: string }[];
  dataSnippet: string;
}

export const SHOPIFY_PLAN_RATES: Record<ShopifyPlan, { name: string; ratePct: number; fixedFee: number; thirdPartyPct: number }> = {
  basic: { name: "Basic Shopify ($39/mo)", ratePct: 2.9, fixedFee: 0.30, thirdPartyPct: 2.0 },
  shopify: { name: "Shopify ($105/mo)", ratePct: 2.7, fixedFee: 0.30, thirdPartyPct: 1.0 },
  advanced: { name: "Advanced ($399/mo)", ratePct: 2.5, fixedFee: 0.30, thirdPartyPct: 0.6 },
  plus: { name: "Shopify Plus ($2,300/mo)", ratePct: 2.15, fixedFee: 0.30, thirdPartyPct: 0.2 },
};

export function calculateShopifyProfit(input: ShopifyInput): ShopifyResult {
  const itemPrice = input.itemPrice !== undefined
    ? Math.max(0, input.itemPrice)
    : Math.max(0, input.revenue || 0);

  const shippingCharged = Math.max(0, input.shippingCharged || 0);
  const rev = Number((itemPrice + shippingCharged).toFixed(2));

  const cogs = Math.max(0, input.cogs || 0);
  const shipping = Math.max(0, input.shippingCost || 0);
  const adSpend = Math.max(0, input.adSpend || 0);
  const plan = input.shopifyPlan || "basic";
  const planConfig = SHOPIFY_PLAN_RATES[plan] || SHOPIFY_PLAN_RATES.basic;

  const gatewayId = (input.gateway || "shopify-payments").toLowerCase();
  const preset: FeePreset | undefined = SHOPIFY_GATEWAY_PRESETS.find(
    (p) => p.id === gatewayId
  );

  const isNativeShopifyPayments = gatewayId === "shopify-payments";

  // Rate determination:
  // If native Shopify Payments: use plan rate
  // If external preset: use preset ratePct + fixedFee, and plan's thirdPartyPct
  const ratePct = input.customRatePct !== undefined
    ? input.customRatePct
    : isNativeShopifyPayments
    ? planConfig.ratePct
    : (preset?.fees.ratePct ?? planConfig.ratePct);

  const fixedFee = input.customFixedFee !== undefined
    ? input.customFixedFee
    : (preset?.fees.fixedFee ?? planConfig.fixedFee);

  const thirdPartyTxPct = input.shopifyPlanTransactionPct !== undefined
    ? input.shopifyPlanTransactionPct
    : isNativeShopifyPayments
    ? 0.0
    : planConfig.thirdPartyPct;

  let paymentFee = 0;
  let thirdPartyTransactionFee = 0;

  if (rev > 0) {
    paymentFee = Number((((rev * ratePct) / 100) + fixedFee).toFixed(2));
    if (thirdPartyTxPct > 0) {
      thirdPartyTransactionFee = Number(((rev * thirdPartyTxPct) / 100).toFixed(2));
    }
  }

  const totalPlatformFees = Number((paymentFee + thirdPartyTransactionFee).toFixed(2));
  const netPayout = Number((rev - totalPlatformFees).toFixed(2));

  // Gross Profit = Revenue - Platform Fees - Landed Costs (COGS + Shipping fulfillment)
  const grossProfit = Number((rev - (cogs + shipping + totalPlatformFees)).toFixed(2));
  const grossMarginPct = rev > 0 ? Number(((grossProfit / rev) * 100).toFixed(2)) : 0;

  // Net Profit = Net Payout - All costs (COGS + Shipping + Ad Spend)
  const totalDirectCosts = cogs + shipping + adSpend;
  const totalExpenses = Number((totalPlatformFees + totalDirectCosts).toFixed(2));
  const netProfit = Number((rev - totalExpenses).toFixed(2));
  const netMarginPct = rev > 0 ? Number(((netProfit / rev) * 100).toFixed(2)) : 0;

  // ROI % = Net Profit / Total Costs
  const totalOutlay = totalExpenses;
  const roiPct = totalOutlay > 0 ? Number(((netProfit / totalOutlay) * 100).toFixed(2)) : 0;

  // Break-even ROAS = Gross Order Value / (Gross Order Value - COGS - Shipping - Platform Fees)
  // Example: On a $50 order, if total costs before ads are $25, then Break-Even CPA = $25, and Break-Even ROAS = 50 / 25 = 2.0x
  const contributionMarginBeforeAds = Number((netPayout - (cogs + shipping)).toFixed(2));
  const breakEvenRoas =
    contributionMarginBeforeAds > 0
      ? Number((rev / contributionMarginBeforeAds).toFixed(2))
      : 0;

  // Break-even Price: Minimum item selling price to yield $0 net profit
  const totalFeeRatePct = ratePct + thirdPartyTxPct;
  const feeRateDecimal = totalFeeRatePct / 100;
  let breakEvenPrice = 0;
  if (totalDirectCosts === 0 && rev === 0) {
    breakEvenPrice = 0;
  } else if (feeRateDecimal < 1) {
    const minGrossRequired = (totalDirectCosts + fixedFee) / (1 - feeRateDecimal);
    breakEvenPrice = Number(Math.max(0, minGrossRequired - shippingCharged).toFixed(2));
  }

  // Target Price for Desired Margin %
  let targetPriceForMargin: number | undefined;
  if (input.targetMarginPct !== undefined && input.targetMarginPct > 0) {
    const targetMarginDecimal = input.targetMarginPct / 100;
    const denominator = 1 - feeRateDecimal - targetMarginDecimal;
    if (denominator > 0) {
      const targetGrossRevenue = (totalDirectCosts + fixedFee) / denominator;
      targetPriceForMargin = Number(Math.max(0, targetGrossRevenue - shippingCharged).toFixed(2));
    }
  }

  // Target Price for Desired Dollar Net Profit
  let targetPriceForDollar: number | undefined;
  if (input.targetProfitDollar !== undefined && input.targetProfitDollar > 0) {
    if (feeRateDecimal < 1) {
      const requiredGross = (input.targetProfitDollar + totalDirectCosts + fixedFee) / (1 - feeRateDecimal);
      targetPriceForDollar = Number(Math.max(0, requiredGross - shippingCharged).toFixed(2));
    }
  }

  const recommendedPrice = targetPriceForDollar ?? targetPriceForMargin ?? breakEvenPrice;

  const breakdown = [
    { label: "Cost of Goods (COGS)", amount: cogs },
    { label: "Payment Gateway Fee", amount: paymentFee, rate: `${ratePct}% + $${fixedFee.toFixed(2)}` },
  ];

  if (thirdPartyTransactionFee > 0) {
    breakdown.push({
      label: `Shopify External Fee (${planConfig.name.split(" ")[0]})`,
      amount: thirdPartyTransactionFee,
      rate: `${thirdPartyTxPct}%`,
    });
  }

  if (shipping > 0) breakdown.push({ label: "Shipping Fulfillment Cost", amount: shipping });
  if (adSpend > 0) breakdown.push({ label: "Ad Spend (CAC per order)", amount: adSpend });

  const dataSnippet = `Selling on Shopify at $${itemPrice.toFixed(2)} (${planConfig.name.split(" ")[0]} plan) with $${cogs.toFixed(2)} COGS yields $${netProfit.toFixed(2)} real net profit (${netMarginPct}% margin) and requires a minimum ${breakEvenRoas}x break-even ROAS on advertising.`;

  return {
    revenue: rev,
    itemPrice,
    shippingCharged,
    cogs,
    shippingCost: shipping,
    paymentFee,
    thirdPartyTransactionFee,
    totalPlatformFees,
    netPayout,
    adSpend,
    totalExpenses,
    grossProfit,
    grossMarginPct,
    netProfit,
    netMarginPct,
    roiPct,
    breakEvenRoas,
    breakEvenPrice,
    targetPriceForMargin,
    targetPriceForDollar,
    recommendedPrice,
    breakdown,
    dataSnippet,
  };
}
