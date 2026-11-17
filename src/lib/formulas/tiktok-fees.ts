import { TIKTOK_CATEGORY_PRESETS, FeePreset } from "@/data/fee-presets";

export interface TikTokInput {
  salePrice: number;
  category?: string;
  creatorAffiliatePct?: number; // e.g. 10%, 15%
  cogs?: number;
  shippingCost?: number;
  customReferralPct?: number;
}

export interface TikTokResult {
  salePrice: number;
  referralFee: number;
  referralRatePct: number;
  affiliateCommission: number;
  cogs: number;
  shippingCost: number;
  totalDeductions: number;
  netPayout: number;
  netProfit: number;
  netMarginPct: number;
  breakdown: { label: string; amount: number; rate?: string }[];
  dataSnippet: string;
}

export function calculateTikTokFees(input: TikTokInput): TikTokResult {
  const price = Math.max(0, input.salePrice || 0);
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

  const referralFee = Number(((price * referralRatePct) / 100).toFixed(2));
  const affiliateCommission = Number(((price * affiliateRatePct) / 100).toFixed(2));

  // Platform payout = Sale Price - (Referral Fee + Affiliate Commission)
  const netPayout = Number((price - (referralFee + affiliateCommission)).toFixed(2));

  // Seller net profit = Net Payout - (COGS + Shipping)
  const totalDeductions = Number((referralFee + affiliateCommission + cogs + shipping).toFixed(2));
  const netProfit = Number((price - totalDeductions).toFixed(2));
  const netMarginPct = price > 0 ? Number(((netProfit / price) * 100).toFixed(2)) : 0;

  const breakdown = [
    { label: "Category Referral Fee", amount: referralFee, rate: `${referralRatePct}%` },
    { label: "Creator Affiliate Commission", amount: affiliateCommission, rate: `${affiliateRatePct}%` },
    { label: "Cost of Goods Sold (COGS)", amount: cogs },
    { label: "Fulfillment & Shipping", amount: shipping },
  ];

  const dataSnippet = `A $${price.toFixed(2)} sale on TikTok Shop (${categoryId}) nets $${netPayout.toFixed(2)} payout after a ${referralRatePct}% referral fee and ${affiliateRatePct}% creator affiliate commission.`;

  return {
    salePrice: price,
    referralFee,
    referralRatePct,
    affiliateCommission,
    cogs,
    shippingCost: shipping,
    totalDeductions,
    netPayout,
    netProfit,
    netMarginPct,
    breakdown,
    dataSnippet,
  };
}
