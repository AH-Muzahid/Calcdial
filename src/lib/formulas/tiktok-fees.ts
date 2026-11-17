import { TIKTOK_CATEGORY_PRESETS, FeePreset } from "@/data/fee-presets";

export interface TikTokInput {
  salePrice: number;
  shippingCharged?: number;
  category?: string;
  creatorAffiliatePct?: number; // e.g. 10%, 15%
  cogs?: number;
  shippingCost?: number;
  customReferralPct?: number;
  targetMarginPct?: number;
}

export interface TikTokResult {
  salePrice: number;
  shippingCharged: number;
  grossRevenue: number;
  referralFee: number;
  referralRatePct: number;
  flatTransactionFee: number;
  affiliateCommission: number;
  cogs: number;
  shippingCost: number;
  totalFees: number; // referral + fixed + affiliate
  effectiveFeePct: number;
  totalProductCosts: number; // cogs + shippingCost
  totalDeductions: number; // fees + product costs
  netPayout: number; // TikTok settlement deposit
  netProfit: number; // real net profit
  netMarginPct: number;
  roiPct: number;
  breakEvenPrice: number;
  targetPriceForMargin?: number;
  breakdown: { label: string; amount: number; rate?: string }[];
  dataSnippet: string;
}

export function calculateTikTokFees(input: TikTokInput): TikTokResult {
  const price = Math.max(0, input.salePrice || 0);
  const shipCharged = Math.max(0, input.shippingCharged || 0);
  const categoryId = (input.category || "beauty").toLowerCase();

  const preset: FeePreset | undefined = TIKTOK_CATEGORY_PRESETS.find(
    (p) => p.id === categoryId
  );

  const referralRatePct =
    input.customReferralPct !== undefined
      ? Math.max(0, input.customReferralPct)
      : (preset?.fees.referralPct ?? 6.0);

  const affiliateRatePct = Math.max(0, input.creatorAffiliatePct || 0);
  const cogs = Math.max(0, input.cogs || 0);
  const shipping = Math.max(0, input.shippingCost || 0);
  const flatTxFee = price > 0 ? 0.30 : 0; // TikTok Shop standard flat transaction fee

  const grossRevenue = Number((price + shipCharged).toFixed(2));

  // TikTok referral fee is charged on gross item sale price
  const referralFee = Number(((price * referralRatePct) / 100).toFixed(2));
  // Creator affiliate commission is charged on item sale price (excluding shipping/tax)
  const affiliateCommission = Number(((price * affiliateRatePct) / 100).toFixed(2));

  const totalFees = Number((referralFee + flatTxFee + affiliateCommission).toFixed(2));
  const effectiveFeePct = grossRevenue > 0 ? Number(((totalFees / grossRevenue) * 100).toFixed(2)) : 0;
  const totalProductCosts = Number((cogs + shipping).toFixed(2));
  const totalDeductions = Number((totalFees + totalProductCosts).toFixed(2));

  // TikTok Shop Bank Settlement: Gross Revenue - TikTok Fees & Affiliate Cuts
  const netPayout = Number((grossRevenue - totalFees).toFixed(2));

  // Real Net Profit
  const netProfit = Number((grossRevenue - totalDeductions).toFixed(2));
  const netMarginPct = grossRevenue > 0 ? Number(((netProfit / grossRevenue) * 100).toFixed(2)) : 0;
  const roiPct = totalProductCosts > 0 ? Number(((netProfit / totalProductCosts) * 100).toFixed(2)) : 0;

  // Break-even price calculation:
  // P + Sc - (P * (r_ref + r_aff) + flatTx) - (cogs + shipping) = 0
  // P * (1 - (r_ref + r_aff)) = cogs + shipping + flatTx - Sc
  const feeRateFraction = (referralRatePct + affiliateRatePct) / 100;
  let breakEvenPrice = 0;
  if (feeRateFraction < 1) {
    const requiredOrder = (cogs + shipping + flatTxFee) / (1 - feeRateFraction);
    breakEvenPrice = Number(Math.max(0, requiredOrder - shipCharged).toFixed(2));
  }

  // Target Margin Price
  let targetPriceForMargin: number | undefined;
  if (input.targetMarginPct !== undefined && input.targetMarginPct > 0) {
    const marginFraction = input.targetMarginPct / 100;
    const denominator = 1 - feeRateFraction - marginFraction;
    if (denominator > 0.05) {
      const requiredOrder = (cogs + shipping + flatTxFee) / denominator;
      targetPriceForMargin = Number(Math.max(0, requiredOrder - shipCharged).toFixed(2));
    }
  }

  const breakdown = [
    { label: "Category Referral Fee", amount: referralFee, rate: `${referralRatePct}%` },
    { label: "TikTok Transaction Fee", amount: flatTxFee, rate: "$0.30 fixed" },
    { label: "Creator Affiliate Commission", amount: affiliateCommission, rate: `${affiliateRatePct}%` },
    { label: "Cost of Goods Sold (COGS)", amount: cogs },
    { label: "Fulfillment & Shipping Out-of-Pocket", amount: shipping },
  ];

  const dataSnippet = `A $${price.toFixed(2)} sale on TikTok Shop (${categoryId}) deposits $${netPayout.toFixed(2)} settlement after a ${referralRatePct}% referral fee and ${affiliateRatePct}% creator affiliate cut, leaving $${netProfit.toFixed(2)} net profit.`;

  return {
    salePrice: price,
    shippingCharged: shipCharged,
    grossRevenue,
    referralFee,
    referralRatePct,
    flatTransactionFee: flatTxFee,
    affiliateCommission,
    cogs,
    shippingCost: shipping,
    totalFees,
    effectiveFeePct,
    totalProductCosts,
    totalDeductions,
    netPayout,
    netProfit,
    netMarginPct,
    roiPct,
    breakEvenPrice,
    targetPriceForMargin,
    breakdown,
    dataSnippet,
  };
}
