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
  targetMarginPct?: number; // For reverse pricing calculation by margin (e.g. 30%)
  targetNetProfit?: number; // For reverse pricing calculation by dollar profit (e.g. $15.00)
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
  targetPriceForProfit?: number; // Recommended itemPrice for targetNetProfit
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

  // Listing fee: $0.20 per item (always charged on publishing/renewal)
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
  if (totalRateFraction < 1 && (totalProductCosts > 0 || totalSale > 0)) {
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

  // Target Profit Price (if desired net profit in $ is requested)
  let targetPriceForProfit: number | undefined;
  if (input.targetNetProfit !== undefined && input.targetNetProfit > 0) {
    if (totalRateFraction < 1) {
      const fixedFeesTotal = (preset.fees.listingFee || 0.20) * qty + processingFixed;
      const costsTotal = (itemCost + shippingCost) * qty;
      const neededRevenue = (input.targetNetProfit + fixedFeesTotal + costsTotal) / (1 - totalRateFraction);
      const neededPerItem = neededRevenue / qty;
      targetPriceForProfit = Number(Math.max(0, neededPerItem - shippingCharge).toFixed(2));
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
    targetPriceForProfit,
    breakdown,
    dataSnippet,
  };
}

export interface ReverseEtsyInput {
  targetProfitType: "dollar" | "margin";
  targetValue: number; // either dollar amount e.g. 15 for $15 profit, or percent e.g. 35 for 35% margin
  itemCost: number;
  shippingCost?: number;
  shippingCharge?: number;
  quantity?: number;
  country?: string;
  isInternationalBuyer?: boolean;
  offsiteAdsOptIn?: boolean;
  offsiteAdsRate?: number;
}

export interface ReverseEtsyResult {
  recommendedPrice: number;
  grossRevenue: number;
  totalFees: number;
  estimatedNetProfit: number;
  estimatedMarginPct: number;
  etsyPayout: number;
  breakdown: FeeItem[];
}

/**
 * Calculates the exact Etsy listing price needed to hit a target net dollar profit or margin percentage.
 */
export function calculateReverseEtsyPrice(input: ReverseEtsyInput): ReverseEtsyResult {
  const targetVal = Math.max(0, input.targetValue || 0);
  const cost = Math.max(0, input.itemCost || 0);
  const shipCost = Math.max(0, input.shippingCost || 0);
  const shipCharge = Math.max(0, input.shippingCharge || 0);
  const qty = Math.max(1, input.quantity || 1);
  const countryId = (input.country || "us").toLowerCase();

  // If both cost and target are 0, return clean zero result
  if (targetVal === 0 && cost === 0 && shipCost === 0) {
    return {
      recommendedPrice: 0,
      grossRevenue: 0,
      totalFees: 0,
      estimatedNetProfit: 0,
      estimatedMarginPct: 0,
      etsyPayout: 0,
      breakdown: [],
    };
  }

  // Calculate forward result using target to get the price
  const forwardCalc = calculateEtsyFees({
    itemPrice: 0,
    shippingCharge: shipCharge,
    itemCost: cost,
    shippingCost: shipCost,
    quantity: qty,
    country: countryId,
    isInternationalBuyer: input.isInternationalBuyer,
    offsiteAdsOptIn: input.offsiteAdsOptIn,
    offsiteAdsRate: input.offsiteAdsRate,
    targetMarginPct: input.targetProfitType === "margin" ? targetVal : undefined,
    targetNetProfit: input.targetProfitType === "dollar" ? targetVal : undefined,
  });

  const price = input.targetProfitType === "margin"
    ? (forwardCalc.targetPriceForMargin ?? forwardCalc.breakEvenPrice)
    : (forwardCalc.targetPriceForProfit ?? forwardCalc.breakEvenPrice);

  // Now run full forward calculation at this recommended price to verify exact deductions
  const verified = calculateEtsyFees({
    itemPrice: price,
    shippingCharge: shipCharge,
    itemCost: cost,
    shippingCost: shipCost,
    quantity: qty,
    country: countryId,
    isInternationalBuyer: input.isInternationalBuyer,
    offsiteAdsOptIn: input.offsiteAdsOptIn,
    offsiteAdsRate: input.offsiteAdsRate,
  });

  return {
    recommendedPrice: price,
    grossRevenue: verified.grossRevenue,
    totalFees: verified.totalFees,
    estimatedNetProfit: verified.netProfit,
    estimatedMarginPct: verified.netMarginPct,
    etsyPayout: verified.etsyPayout,
    breakdown: verified.breakdown,
  };
}
