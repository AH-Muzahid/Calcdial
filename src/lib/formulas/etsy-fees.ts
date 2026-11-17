import { ETSY_FEE_PRESETS, FeePreset } from "@/data/fee-presets";

export interface EtsyInput {
  itemPrice: number;
  shippingCharge: number;
  itemCost?: number; // Materials + labor + packaging COGS
  shippingCost?: number; // Actual carrier postage paid by seller
  quantity?: number;
  country?: string; // country id, e.g. "us", "uk", etc.
  isInternationalBuyer?: boolean; // International transactions add cross-border surcharge
  offsiteAdsOptIn?: boolean;
  offsiteAdsRate?: number; // 0.12 or 0.15
  customListingFee?: number;
  targetMarginPct?: number; // For reverse pricing calculation (e.g. 30%)
}

export interface FeeItem {
  label: string;
  amount: number;
  rate?: string;
}

export interface EtsyResult {
  grossRevenue: number;
  listingFee: number;
  transactionFee: number;
  paymentProcessingFee: number;
  regulatoryFee: number;
  offsiteAdsFee: number;
  totalFees: number;
  effectiveFeePct: number;
  // Cost & Profit separation
  totalProductCosts: number;
  etsyPayout: number; // Gross revenue - Etsy fees (bank deposit)
  netProfit: number; // Gross revenue - Etsy fees - totalProductCosts
  netMarginPct: number; // (netProfit / grossRevenue) * 100
  roiPct: number; // (netProfit / totalProductCosts) * 100
  breakEvenPrice: number; // Minimum itemPrice to break even (profit = 0)
  targetPriceForMargin?: number; // Recommended itemPrice for targetMarginPct
  breakdown: FeeItem[];
  dataSnippet: string;
}

export function calculateEtsyFees(input: EtsyInput): EtsyResult {
  const price = Math.max(0, input.itemPrice || 0);
  const shippingCharge = Math.max(0, input.shippingCharge || 0);
  const itemCost = Math.max(0, input.itemCost || 0);
  const shippingCost = Math.max(0, input.shippingCost || 0);
  const qty = Math.max(1, input.quantity || 1);
  const countryId = (input.country || "us").toLowerCase();

  const preset: FeePreset =
    ETSY_FEE_PRESETS.find((p) => p.id === countryId) || ETSY_FEE_PRESETS[0];

  const totalSale = Number(((price + shippingCharge) * qty).toFixed(2));
  const totalProductCosts = Number(((itemCost + shippingCost) * qty).toFixed(2));

  // Listing fee: $0.20 per item
  const listingUnit = input.customListingFee ?? (preset.fees.listingFee || 0.20);
  const listingFee = Number((listingUnit * qty).toFixed(2));

  // 6.5% transaction fee on total order (item + shipping)
  const transactionPct = preset.fees.transactionPct ?? 6.5;
  const transactionFee = totalSale > 0 ? Number(((totalSale * transactionPct) / 100).toFixed(2)) : 0;

  // Payment processing fee: e.g. US: 3% + $0.25 (plus optional 1% international surcharge)
  const baseProcessingPct = preset.fees.processingPct ?? 3.0;
  const processingPct = input.isInternationalBuyer ? baseProcessingPct + 1.0 : baseProcessingPct;
  const processingFixed = preset.fees.processingFixed ?? 0.25;
  const paymentProcessingFee = totalSale > 0
    ? Number((((totalSale * processingPct) / 100) + processingFixed).toFixed(2))
    : 0;

  // Regulatory operating fee (if applicable in country)
  const regPct = preset.fees.regulatoryPct ?? 0;
  const regulatoryFee = (regPct > 0 && totalSale > 0)
    ? Number(((totalSale * regPct) / 100).toFixed(2))
    : 0;

  // Offsite ads fee (optional)
  let offsiteAdsFee = 0;
  if (input.offsiteAdsOptIn && totalSale > 0) {
    const adsRate = input.offsiteAdsRate ?? 0.15;
    offsiteAdsFee = Number((totalSale * adsRate).toFixed(2));
  }

  const totalFees = Number(
    (listingFee + transactionFee + paymentProcessingFee + regulatoryFee + offsiteAdsFee).toFixed(2)
  );

  // Bank payout = what Etsy deposits
  const etsyPayout = Number((totalSale - totalFees).toFixed(2));

  // Real net profit = revenue - fees - actual costs
  const netProfit = Number((totalSale - totalFees - totalProductCosts).toFixed(2));
  const effectiveFeePct = totalSale > 0 ? Number(((totalFees / totalSale) * 100).toFixed(2)) : 0;
  const netMarginPct = totalSale > 0 ? Number(((netProfit / totalSale) * 100).toFixed(2)) : 0;
  const roiPct = totalProductCosts > 0 ? Number(((netProfit / totalProductCosts) * 100).toFixed(2)) : 0;

  // Break-even price calculation:
  // Gross revenue = (P + Sc) * Q
  // Fees = ListingFee + ProcessingFixed + TotalRate * (P + Sc) * Q
  // Costs = (itemCost + shippingCost) * Q
  // Set Net Profit = 0 => (P + Sc) * (1 - TotalRate) = (ListingFee + ProcessingFixed)/Q + itemCost + shippingCost
  const totalRatePct = transactionPct + processingPct + regPct + (input.offsiteAdsOptIn ? (input.offsiteAdsRate ?? 0.15) * 100 : 0);
  const totalRateFraction = totalRatePct / 100;
  const fixedPerItem = (listingFee + processingFixed) / qty;
  const costsPerItem = itemCost + shippingCost;

  let breakEvenPrice = 0;
  if (totalRateFraction < 1) {
    const minOrderPerItem = (fixedPerItem + costsPerItem) / (1 - totalRateFraction);
    breakEvenPrice = Number(Math.max(0, minOrderPerItem - shippingCharge).toFixed(2));
  }

  // Target Margin Price (if requested)
  let targetPriceForMargin: number | undefined;
  if (input.targetMarginPct !== undefined && input.targetMarginPct > 0) {
    const targetMarginFraction = input.targetMarginPct / 100;
    const denominator = 1 - totalRateFraction - targetMarginFraction;
    if (denominator > 0.05) {
      const targetOrderPerItem = (fixedPerItem + costsPerItem) / denominator;
      targetPriceForMargin = Number(Math.max(0, targetOrderPerItem - shippingCharge).toFixed(2));
    }
  }

  const breakdown: FeeItem[] = [
    { label: "Listing Fee", amount: listingFee, rate: `$${listingUnit.toFixed(2)} x ${qty}` },
    { label: "Transaction Commission (6.5%)", amount: transactionFee, rate: `${transactionPct}%` },
    {
      label: `Payment Processing (${input.isInternationalBuyer ? "Int'l" : "Domestic"})`,
      amount: paymentProcessingFee,
      rate: `${processingPct}% + $${processingFixed.toFixed(2)}`,
    },
  ];

  if (regulatoryFee > 0) {
    breakdown.push({ label: "Regulatory Operating Fee", amount: regulatoryFee, rate: `${regPct}%` });
  }

  if (offsiteAdsFee > 0) {
    const rateLabel = (input.offsiteAdsRate ?? 0.15) * 100;
    breakdown.push({ label: "Etsy Offsite Ads Fee", amount: offsiteAdsFee, rate: `${rateLabel}%` });
  }

  if (totalProductCosts > 0) {
    breakdown.push({
      label: "Materials & Postage Costs (COGS)",
      amount: totalProductCosts,
      rate: `$${costsPerItem.toFixed(2)} / unit`,
    });
  }

  const dataSnippet = `Selling a $${price.toFixed(2)} item on Etsy (${preset.country}) with $${shippingCharge.toFixed(2)} shipping results in $${totalFees.toFixed(2)} Etsy fees (${effectiveFeePct}%). Payout is $${etsyPayout.toFixed(2)}, leaving $${netProfit.toFixed(2)} net profit after costs.`;

  return {
    grossRevenue: totalSale,
    listingFee,
    transactionFee,
    paymentProcessingFee,
    regulatoryFee,
    offsiteAdsFee,
    totalFees,
    effectiveFeePct,
    totalProductCosts,
    etsyPayout,
    netProfit,
    netMarginPct,
    roiPct,
    breakEvenPrice,
    targetPriceForMargin,
    breakdown,
    dataSnippet,
  };
}
