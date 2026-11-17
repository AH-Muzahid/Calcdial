import { SHOPIFY_GATEWAY_PRESETS, FeePreset } from "@/data/fee-presets";

export interface ShopifyInput {
  revenue: number; // Retail selling price
  cogs?: number;
  shippingCost?: number;
  adSpend?: number;
  gateway?: string; // e.g. "shopify-payments", "stripe", "paypal"
  customRatePct?: number;
  customFixedFee?: number;
  shopifyPlanTransactionPct?: number; // 0 for Shopify Payments, 0.5-2.0% for external
}

export interface ShopifyResult {
  revenue: number;
  cogs: number;
  shippingCost: number;
  paymentFee: number;
  thirdPartyTransactionFee: number;
  adSpend: number;
  totalExpenses: number;
  grossProfit: number;
  grossMarginPct: number;
  netProfit: number;
  netMarginPct: number;
  breakEvenRoas: number;
  breakdown: { label: string; amount: number; rate?: string }[];
  dataSnippet: string;
}

export function calculateShopifyProfit(input: ShopifyInput): ShopifyResult {
  const rev = Math.max(0, input.revenue || 0);
  const cogs = Math.max(0, input.cogs || 0);
  const shipping = Math.max(0, input.shippingCost || 0);
  const adSpend = Math.max(0, input.adSpend || 0);

  const gatewayId = (input.gateway || "shopify-payments").toLowerCase();
  const preset: FeePreset | undefined = SHOPIFY_GATEWAY_PRESETS.find(
    (p) => p.id === gatewayId
  );

  const ratePct = input.customRatePct !== undefined ? input.customRatePct : (preset?.fees.ratePct ?? 2.9);
  const fixedFee = input.customFixedFee !== undefined ? input.customFixedFee : (preset?.fees.fixedFee ?? 0.30);
  const thirdPartyTxPct =
    input.shopifyPlanTransactionPct !== undefined
      ? input.shopifyPlanTransactionPct
      : (preset?.fees.transactionPct ?? 0.0);

  let paymentFee = 0;
  let thirdPartyTransactionFee = 0;

  if (rev > 0) {
    paymentFee = Number((((rev * ratePct) / 100) + fixedFee).toFixed(2));
    if (thirdPartyTxPct > 0) {
      thirdPartyTransactionFee = Number(((rev * thirdPartyTxPct) / 100).toFixed(2));
    }
  }

  const grossProfit = Number((rev - (cogs + shipping + paymentFee + thirdPartyTransactionFee)).toFixed(2));
  const grossMarginPct = rev > 0 ? Number(((grossProfit / rev) * 100).toFixed(2)) : 0;

  const totalExpenses = Number((cogs + shipping + paymentFee + thirdPartyTransactionFee + adSpend).toFixed(2));
  const netProfit = Number((rev - totalExpenses).toFixed(2));
  const netMarginPct = rev > 0 ? Number(((netProfit / rev) * 100).toFixed(2)) : 0;

  // Break-even ROAS = 1 / Gross Margin decimal
  // Example: 50% margin -> 1 / 0.5 = 2.0x ROAS needed
  const grossMarginDecimal = grossMarginPct / 100;
  const breakEvenRoas =
    grossMarginDecimal > 0 ? Number((1 / grossMarginDecimal).toFixed(2)) : 0;

  const breakdown = [
    { label: "Cost of Goods (COGS)", amount: cogs },
    { label: "Payment Gateway Fee", amount: paymentFee, rate: `${ratePct}% + $${fixedFee.toFixed(2)}` },
  ];

  if (thirdPartyTransactionFee > 0) {
    breakdown.push({
      label: "Shopify External Gateway Fee",
      amount: thirdPartyTransactionFee,
      rate: `${thirdPartyTxPct}%`,
    });
  }

  if (shipping > 0) breakdown.push({ label: "Shipping Fulfillment", amount: shipping });
  if (adSpend > 0) breakdown.push({ label: "Customer Acquisition (Ad Spend)", amount: adSpend });

  const dataSnippet = `Selling on Shopify at $${rev.toFixed(2)} with a ${grossMarginPct}% gross margin yields $${netProfit.toFixed(2)} net profit and requires a ${breakEvenRoas}x break-even ROAS on ad campaigns.`;

  return {
    revenue: rev,
    cogs,
    shippingCost: shipping,
    paymentFee,
    thirdPartyTransactionFee,
    adSpend,
    totalExpenses,
    grossProfit,
    grossMarginPct,
    netProfit,
    netMarginPct,
    breakEvenRoas,
    breakdown,
    dataSnippet,
  };
}
