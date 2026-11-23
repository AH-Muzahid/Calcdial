export interface FeePreset {
  id: string;
  platform: string;
  country: string;
  currency: string;
  currencySymbol: string;
  fees: Record<string, number>;
  lastUpdated: string; // ISO 8601 YYYY-MM-DD
}

export const ETSY_FEE_PRESETS: FeePreset[] = [
  {
    id: "us",
    platform: "etsy",
    country: "United States",
    currency: "USD",
    currencySymbol: "$",
    fees: {
      listingFee: 0.20,
      transactionPct: 6.5,
      processingPct: 3.0,
      processingFixed: 0.25,
      regulatoryPct: 0.0,
    },
    lastUpdated: "2026-11-23",
  },
  {
    id: "uk",
    platform: "etsy",
    country: "United Kingdom",
    currency: "GBP",
    currencySymbol: "£",
    fees: {
      listingFee: 0.20,
      transactionPct: 6.5,
      processingPct: 4.0,
      processingFixed: 0.20,
      regulatoryPct: 0.48,
    },
    lastUpdated: "2026-11-23",
  },
  {
    id: "ca",
    platform: "etsy",
    country: "Canada",
    currency: "CAD",
    currencySymbol: "CA$",
    fees: {
      listingFee: 0.28,
      transactionPct: 6.5,
      processingPct: 3.0,
      processingFixed: 0.25,
      regulatoryPct: 0.50,
    },
    lastUpdated: "2026-11-23",
  },
  {
    id: "au",
    platform: "etsy",
    country: "Australia",
    currency: "AUD",
    currencySymbol: "A$",
    fees: {
      listingFee: 0.30,
      transactionPct: 6.5,
      processingPct: 3.0,
      processingFixed: 0.25,
      regulatoryPct: 0.0,
    },
    lastUpdated: "2026-11-23",
  },
  {
    id: "de",
    platform: "etsy",
    country: "Germany",
    currency: "EUR",
    currencySymbol: "€",
    fees: {
      listingFee: 0.20,
      transactionPct: 6.5,
      processingPct: 4.0,
      processingFixed: 0.30,
      regulatoryPct: 0.0,
    },
    lastUpdated: "2026-11-23",
  },
  {
    id: "fr",
    platform: "etsy",
    country: "France",
    currency: "EUR",
    currencySymbol: "€",
    fees: {
      listingFee: 0.20,
      transactionPct: 6.5,
      processingPct: 4.0,
      processingFixed: 0.30,
      regulatoryPct: 1.14,
    },
    lastUpdated: "2026-11-23",
  },
  {
    id: "nl",
    platform: "etsy",
    country: "Netherlands",
    currency: "EUR",
    currencySymbol: "€",
    fees: {
      listingFee: 0.20,
      transactionPct: 6.5,
      processingPct: 4.0,
      processingFixed: 0.30,
      regulatoryPct: 0.0,
    },
    lastUpdated: "2026-11-23",
  },
  {
    id: "it",
    platform: "etsy",
    country: "Italy",
    currency: "EUR",
    currencySymbol: "€",
    fees: {
      listingFee: 0.20,
      transactionPct: 6.5,
      processingPct: 4.0,
      processingFixed: 0.30,
      regulatoryPct: 0.80,
    },
    lastUpdated: "2026-11-23",
  },
  {
    id: "es",
    platform: "etsy",
    country: "Spain",
    currency: "EUR",
    currencySymbol: "€",
    fees: {
      listingFee: 0.20,
      transactionPct: 6.5,
      processingPct: 4.0,
      processingFixed: 0.30,
      regulatoryPct: 0.88,
    },
    lastUpdated: "2026-11-23",
  },
  {
    id: "in",
    platform: "etsy",
    country: "India",
    currency: "INR",
    currencySymbol: "₹",
    fees: {
      listingFee: 19.00,
      transactionPct: 6.5,
      processingPct: 5.0,
      processingFixed: 25.0,
      regulatoryPct: 0.05,
    },
    lastUpdated: "2026-11-23",
  },
  {
    id: "tr",
    platform: "etsy",
    country: "Türkiye",
    currency: "TRY",
    currencySymbol: "₺",
    fees: {
      listingFee: 7.00,
      transactionPct: 6.5,
      processingPct: 6.5,
      processingFixed: 14.0,
      regulatoryPct: 1.67,
    },
    lastUpdated: "2026-11-23",
  },
  {
    id: "hu",
    platform: "etsy",
    country: "Hungary",
    currency: "EUR",
    currencySymbol: "€",
    fees: {
      listingFee: 0.20,
      transactionPct: 6.5,
      processingPct: 4.0,
      processingFixed: 0.30,
      regulatoryPct: 1.97,
    },
    lastUpdated: "2026-11-23",
  },
  {
    id: "vn",
    platform: "etsy",
    country: "Vietnam",
    currency: "VND",
    currencySymbol: "₫",
    fees: {
      listingFee: 5000,
      transactionPct: 6.5,
      processingPct: 4.5,
      processingFixed: 11500,
      regulatoryPct: 1.24,
    },
    lastUpdated: "2026-11-23",
  },
];

export const POD_ITEM_PRESETS: FeePreset[] = [
  { id: "t-shirts", platform: "pod", country: "Global", currency: "USD", currencySymbol: "$", fees: { baseCost: 9.50, defaultShipping: 4.50 }, lastUpdated: "2026-11-01" },
  { id: "hoodies", platform: "pod", country: "Global", currency: "USD", currencySymbol: "$", fees: { baseCost: 22.00, defaultShipping: 7.50 }, lastUpdated: "2026-11-01" },
  { id: "mugs", platform: "pod", country: "Global", currency: "USD", currencySymbol: "$", fees: { baseCost: 5.50, defaultShipping: 5.00 }, lastUpdated: "2026-11-01" },
  { id: "totes", platform: "pod", country: "Global", currency: "USD", currencySymbol: "$", fees: { baseCost: 8.00, defaultShipping: 4.00 }, lastUpdated: "2026-11-01" },
  { id: "posters", platform: "pod", country: "Global", currency: "USD", currencySymbol: "$", fees: { baseCost: 6.00, defaultShipping: 4.50 }, lastUpdated: "2026-11-01" },
  { id: "phone-cases", platform: "pod", country: "Global", currency: "USD", currencySymbol: "$", fees: { baseCost: 9.00, defaultShipping: 3.50 }, lastUpdated: "2026-11-01" },
  { id: "stickers", platform: "pod", country: "Global", currency: "USD", currencySymbol: "$", fees: { baseCost: 1.80, defaultShipping: 2.00 }, lastUpdated: "2026-11-01" },
  { id: "canvas", platform: "pod", country: "Global", currency: "USD", currencySymbol: "$", fees: { baseCost: 18.00, defaultShipping: 8.00 }, lastUpdated: "2026-11-01" },
  { id: "pillows", platform: "pod", country: "Global", currency: "USD", currencySymbol: "$", fees: { baseCost: 13.00, defaultShipping: 6.00 }, lastUpdated: "2026-11-01" },
  { id: "ornaments", platform: "pod", country: "Global", currency: "USD", currencySymbol: "$", fees: { baseCost: 4.50, defaultShipping: 3.50 }, lastUpdated: "2026-11-01" },
];

export const TIKTOK_CATEGORY_PRESETS: FeePreset[] = [
  { id: "beauty", platform: "tiktok", country: "US", currency: "USD", currencySymbol: "$", fees: { referralPct: 6.0 }, lastUpdated: "2026-11-01" },
  { id: "apparel", platform: "tiktok", country: "US", currency: "USD", currencySymbol: "$", fees: { referralPct: 6.0 }, lastUpdated: "2026-11-01" },
  { id: "electronics", platform: "tiktok", country: "US", currency: "USD", currencySymbol: "$", fees: { referralPct: 5.0 }, lastUpdated: "2026-11-01" },
  { id: "home-garden", platform: "tiktok", country: "US", currency: "USD", currencySymbol: "$", fees: { referralPct: 6.0 }, lastUpdated: "2026-11-01" },
  { id: "health", platform: "tiktok", country: "US", currency: "USD", currencySymbol: "$", fees: { referralPct: 6.0 }, lastUpdated: "2026-11-01" },
  { id: "toys", platform: "tiktok", country: "US", currency: "USD", currencySymbol: "$", fees: { referralPct: 6.0 }, lastUpdated: "2026-11-01" },
  { id: "sports", platform: "tiktok", country: "US", currency: "USD", currencySymbol: "$", fees: { referralPct: 6.0 }, lastUpdated: "2026-11-01" },
  { id: "food", platform: "tiktok", country: "US", currency: "USD", currencySymbol: "$", fees: { referralPct: 6.0 }, lastUpdated: "2026-11-01" },
  { id: "pets", platform: "tiktok", country: "US", currency: "USD", currencySymbol: "$", fees: { referralPct: 6.0 }, lastUpdated: "2026-11-01" },
  { id: "accessories", platform: "tiktok", country: "US", currency: "USD", currencySymbol: "$", fees: { referralPct: 6.0 }, lastUpdated: "2026-11-01" },
];

export const SHOPIFY_GATEWAY_PRESETS: FeePreset[] = [
  { id: "shopify-payments", platform: "shopify", country: "US", currency: "USD", currencySymbol: "$", fees: { ratePct: 2.9, fixedFee: 0.30, transactionPct: 0.0 }, lastUpdated: "2026-11-01" },
  { id: "stripe", platform: "shopify", country: "US", currency: "USD", currencySymbol: "$", fees: { ratePct: 2.9, fixedFee: 0.30, transactionPct: 2.0 }, lastUpdated: "2026-11-01" },
  { id: "paypal", platform: "shopify", country: "US", currency: "USD", currencySymbol: "$", fees: { ratePct: 3.49, fixedFee: 0.49, transactionPct: 2.0 }, lastUpdated: "2026-11-01" },
  { id: "square", platform: "shopify", country: "US", currency: "USD", currencySymbol: "$", fees: { ratePct: 2.9, fixedFee: 0.30, transactionPct: 2.0 }, lastUpdated: "2026-11-01" },
  { id: "authorize-net", platform: "shopify", country: "US", currency: "USD", currencySymbol: "$", fees: { ratePct: 2.9, fixedFee: 0.30, transactionPct: 2.0 }, lastUpdated: "2026-11-01" },
  { id: "2checkout", platform: "shopify", country: "US", currency: "USD", currencySymbol: "$", fees: { ratePct: 3.5, fixedFee: 0.35, transactionPct: 2.0 }, lastUpdated: "2026-11-01" },
  { id: "klarna", platform: "shopify", country: "US", currency: "USD", currencySymbol: "$", fees: { ratePct: 5.99, fixedFee: 0.30, transactionPct: 0.0 }, lastUpdated: "2026-11-01" },
  { id: "afterpay", platform: "shopify", country: "US", currency: "USD", currencySymbol: "$", fees: { ratePct: 6.0, fixedFee: 0.30, transactionPct: 0.0 }, lastUpdated: "2026-11-01" },
  { id: "worldpay", platform: "shopify", country: "US", currency: "USD", currencySymbol: "$", fees: { ratePct: 2.75, fixedFee: 0.25, transactionPct: 2.0 }, lastUpdated: "2026-11-01" },
  { id: "adyen", platform: "shopify", country: "US", currency: "USD", currencySymbol: "$", fees: { ratePct: 2.6, fixedFee: 0.12, transactionPct: 2.0 }, lastUpdated: "2026-11-01" },
];

export const PAYMENT_CURRENCY_PRESETS: FeePreset[] = [
  { id: "usd", platform: "stripe", country: "United States", currency: "USD", currencySymbol: "$", fees: { domesticRate: 2.9, domesticFixed: 0.30, intlRate: 1.5, fxRate: 1.0 }, lastUpdated: "2026-11-01" },
  { id: "gbp", platform: "stripe", country: "United Kingdom", currency: "GBP", currencySymbol: "£", fees: { domesticRate: 1.5, domesticFixed: 0.20, intlRate: 1.5, fxRate: 1.0 }, lastUpdated: "2026-11-01" },
  { id: "eur", platform: "stripe", country: "Eurozone", currency: "EUR", currencySymbol: "€", fees: { domesticRate: 1.5, domesticFixed: 0.25, intlRate: 1.5, fxRate: 1.0 }, lastUpdated: "2026-11-01" },
  { id: "cad", platform: "stripe", country: "Canada", currency: "CAD", currencySymbol: "CA$", fees: { domesticRate: 2.9, domesticFixed: 0.30, intlRate: 1.5, fxRate: 1.0 }, lastUpdated: "2026-11-01" },
  { id: "aud", platform: "stripe", country: "Australia", currency: "AUD", currencySymbol: "A$", fees: { domesticRate: 1.75, domesticFixed: 0.30, intlRate: 1.5, fxRate: 1.0 }, lastUpdated: "2026-11-01" },
  { id: "jpy", platform: "stripe", country: "Japan", currency: "JPY", currencySymbol: "¥", fees: { domesticRate: 3.6, domesticFixed: 0.0, intlRate: 1.5, fxRate: 1.0 }, lastUpdated: "2026-11-01" },
  { id: "chf", platform: "stripe", country: "Switzerland", currency: "CHF", currencySymbol: "CHF", fees: { domesticRate: 2.9, domesticFixed: 0.30, intlRate: 1.5, fxRate: 1.0 }, lastUpdated: "2026-11-01" },
  { id: "sgd", platform: "stripe", country: "Singapore", currency: "SGD", currencySymbol: "S$", fees: { domesticRate: 3.4, domesticFixed: 0.50, intlRate: 1.5, fxRate: 1.0 }, lastUpdated: "2026-11-01" },
  { id: "hkd", platform: "stripe", country: "Hong Kong", currency: "HKD", currencySymbol: "HK$", fees: { domesticRate: 3.4, domesticFixed: 2.35, intlRate: 1.5, fxRate: 1.0 }, lastUpdated: "2026-11-01" },
  { id: "mxn", platform: "stripe", country: "Mexico", currency: "MXN", currencySymbol: "Mex$", fees: { domesticRate: 3.6, domesticFixed: 3.00, intlRate: 1.5, fxRate: 1.0 }, lastUpdated: "2026-11-01" },
];

export const ALL_PRESETS = [
  ...ETSY_FEE_PRESETS,
  ...POD_ITEM_PRESETS,
  ...TIKTOK_CATEGORY_PRESETS,
  ...SHOPIFY_GATEWAY_PRESETS,
  ...PAYMENT_CURRENCY_PRESETS,
];
