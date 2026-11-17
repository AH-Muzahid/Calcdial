import { POD_ITEM_PRESETS, FeePreset } from "@/data/fee-presets";

export interface PodInput {
  retailPrice: number;
  basePrintCost?: number;
  shippingCharged?: number;
  shippingCost?: number;
  marketplaceFeePct?: number; // e.g. 10-15% (Etsy/Shopify)
  adSpendPerSale?: number;
  productType?: string; // e.g. "t-shirts", "mugs"
}

export interface PodResult {
  retailPrice: number;
  grossRevenue: number;
  basePrintCost: number;
  totalShippingCost: number;
  marketplaceFee: number;
  adSpend: number;
  totalCosts: number;
  netProfit: number;
  grossMarginPct: number;
  netMarginPct: number;
  breakEvenPrice: number;
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
  const mktPct = Math.max(0, input.marketplaceFeePct !== undefined ? input.marketplaceFeePct : 12.0);
  const adSpend = Math.max(0, input.adSpendPerSale || 0);

  const grossRevenue = Number((retail + shipCharged).toFixed(2));
  const marketplaceFee = Number(((grossRevenue * mktPct) / 100).toFixed(2));
  const totalCosts = Number((baseCost + shipCost + marketplaceFee + adSpend).toFixed(2));
  const netProfit = Number((grossRevenue - totalCosts).toFixed(2));

  const grossProfitBeforeAds = grossRevenue - (baseCost + shipCost + marketplaceFee);
  const grossMarginPct = grossRevenue > 0 ? Number(((grossProfitBeforeAds / grossRevenue) * 100).toFixed(2)) : 0;
  const netMarginPct = grossRevenue > 0 ? Number(((netProfit / grossRevenue) * 100).toFixed(2)) : 0;

  // Break-even retail price
  const breakEvenPrice = mktPct < 100
    ? Number(Math.max(0, ((baseCost + shipCost + adSpend) / (1 - mktPct / 100)) - shipCharged).toFixed(2))
    : 0;

  const breakdown = [
    { label: "Base Print & Blank Cost", amount: baseCost },
    { label: "Fulfillment Shipping Cost", amount: shipCost },
    { label: "Platform / Payment Fees", amount: marketplaceFee, rate: `${mktPct}%` },
    { label: "Advertising / Acquisition", amount: adSpend },
  ];

  const dataSnippet = `Selling a POD item for $${retail.toFixed(2)} with $${baseCost.toFixed(2)} base cost generates $${netProfit.toFixed(2)} net profit (${netMarginPct}% margin) after platform fees and fulfillment.`;

  return {
    retailPrice: retail,
    grossRevenue,
    basePrintCost: baseCost,
    totalShippingCost: shipCost,
    marketplaceFee,
    adSpend,
    totalCosts,
    netProfit,
    grossMarginPct,
    netMarginPct,
    breakEvenPrice,
    breakdown,
    dataSnippet,
  };
}
