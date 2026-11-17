import { ETSY_FEE_PRESETS, FeePreset } from "@/data/fee-presets";

export interface EtsyInput {
  itemPrice: number;
  shippingCharge: number;
  quantity?: number;
  country?: string; // country id, e.g. "us", "uk", etc.
  offsiteAdsOptIn?: boolean;
  offsiteAdsRate?: number; // 0.12 or 0.15
  customListingFee?: number;
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
  netProfit: number;
  effectiveFeePct: number;
  breakdown: FeeItem[];
  dataSnippet: string;
}

export function calculateEtsyFees(input: EtsyInput): EtsyResult {
  const price = Math.max(0, input.itemPrice || 0);
  const shipping = Math.max(0, input.shippingCharge || 0);
  const qty = Math.max(1, input.quantity || 1);
  const countryId = (input.country || "us").toLowerCase();

  const preset: FeePreset =
    ETSY_FEE_PRESETS.find((p) => p.id === countryId) || ETSY_FEE_PRESETS[0];

  const totalSale = Number(((price + shipping) * qty).toFixed(2));

  if (totalSale <= 0) {
    const defaultListing = input.customListingFee ?? (preset.fees.listingFee || 0.20);
    const listingTotal = defaultListing * qty;
    return {
      grossRevenue: 0,
      listingFee: listingTotal,
      transactionFee: 0,
      paymentProcessingFee: 0,
      regulatoryFee: 0,
      offsiteAdsFee: 0,
      totalFees: listingTotal,
      netProfit: -listingTotal,
      effectiveFeePct: 0,
      breakdown: [{ label: "Listing Fee", amount: listingTotal, rate: `$${defaultListing.toFixed(2)} / item` }],
      dataSnippet: `Listing an item on Etsy costs $${listingTotal.toFixed(2)} before sales.`,
    };
  }

  // Listing fee: $0.20 per item
  const listingUnit = input.customListingFee ?? (preset.fees.listingFee || 0.20);
  const listingFee = Number((listingUnit * qty).toFixed(2));

  // 6.5% transaction fee on total order (item + shipping)
  const transactionPct = preset.fees.transactionPct ?? 6.5;
  const transactionFee = Number(((totalSale * transactionPct) / 100).toFixed(2));

  // Payment processing fee: e.g. US: 3% + $0.25
  const processingPct = preset.fees.processingPct ?? 3.0;
  const processingFixed = preset.fees.processingFixed ?? 0.25;
  const paymentProcessingFee = Number(
    (((totalSale * processingPct) / 100) + processingFixed).toFixed(2)
  );

  // Regulatory operating fee (if applicable in country)
  const regPct = preset.fees.regulatoryPct ?? 0;
  const regulatoryFee = regPct > 0 ? Number(((totalSale * regPct) / 100).toFixed(2)) : 0;

  // Offsite ads fee (optional)
  let offsiteAdsFee = 0;
  if (input.offsiteAdsOptIn) {
    const adsRate = input.offsiteAdsRate ?? 0.15;
    offsiteAdsFee = Number((totalSale * adsRate).toFixed(2));
  }

  const totalFees = Number(
    (listingFee + transactionFee + paymentProcessingFee + regulatoryFee + offsiteAdsFee).toFixed(2)
  );
  const netProfit = Number((totalSale - totalFees).toFixed(2));
  const effectiveFeePct = totalSale > 0 ? Number(((totalFees / totalSale) * 100).toFixed(2)) : 0;

  const breakdown: FeeItem[] = [
    { label: "Listing Fee", amount: listingFee, rate: `$${listingUnit.toFixed(2)} x ${qty}` },
    { label: "Transaction Fee", amount: transactionFee, rate: `${transactionPct}%` },
    { label: "Payment Processing", amount: paymentProcessingFee, rate: `${processingPct}% + $${processingFixed.toFixed(2)}` },
  ];

  if (regulatoryFee > 0) {
    breakdown.push({ label: "Regulatory Operating Fee", amount: regulatoryFee, rate: `${regPct}%` });
  }

  if (offsiteAdsFee > 0) {
    const rateLabel = (input.offsiteAdsRate ?? 0.15) * 100;
    breakdown.push({ label: "Etsy Offsite Ads Fee", amount: offsiteAdsFee, rate: `${rateLabel}%` });
  }

  const dataSnippet = `Selling a $${price.toFixed(2)} item on Etsy (${preset.country}) with $${shipping.toFixed(2)} shipping results in $${totalFees.toFixed(2)} total fees (${effectiveFeePct}%), yielding $${netProfit.toFixed(2)} net profit.`;

  return {
    grossRevenue: totalSale,
    listingFee,
    transactionFee,
    paymentProcessingFee,
    regulatoryFee,
    offsiteAdsFee,
    totalFees,
    netProfit,
    effectiveFeePct,
    breakdown,
    dataSnippet,
  };
}
