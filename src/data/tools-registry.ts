export interface FAQItem {
  question: string;
  answer: string;
}

export interface WorkedExample {
  label: string;
  inputs: Record<string, number | string>;
  result: Record<string, number | string>;
}

export interface HowToStep {
  name: string;
  text: string;
  image?: string;
}

export interface GuideMeta {
  slug: string;
  title: string;
  description: string;
  relatedTools: string[];
  publishedAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  estimatedReadMinutes: number;
}

export interface ToolConfig {
  slug: string;
  title: string;
  shortDescription: string;
  cluster: "A" | "B" | "C";
  phase: 1 | 2 | 3;
  targetKeywords: string[];
  formulaMarkdown: string;
  formulaFn: string;
  pSEOPresets: string[]; // exactly 10 preset IDs for Phase 1
  workedExamples: WorkedExample[];
  howToSteps: HowToStep[];
  faqs: FAQItem[];
  relatedTools: string[];
  relatedGuides: string[];
  affiliatePartner?: string;
  affiliateUrl?: string;
  affiliateCta?: string;
  lastUpdated: string; // ISO 8601 YYYY-MM-DD
  isComparison: boolean;
  dataSnippet?: string;
}

export interface ComparisonPreset {
  slug: string;
  label: string;
  platforms: string[];
  defaultInputs: Record<string, number>;
}

export const GUIDES: GuideMeta[] = [
  {
    slug: "how-to-calculate-etsy-fees-2026",
    title: "How to Calculate Etsy Fees in 2026 (Complete Seller Breakdown)",
    description: "Master the complete Etsy fee schedule: listing fees, 6.5% transaction fees, country-specific payment processing, regulatory fees, and mandatory Offsite Ads tiers.",
    relatedTools: ["etsy-fee-calculator", "etsy-vs-shopify-vs-tiktok-shop-calculator"],
    publishedAt: "2026-11-01T00:00:00Z",
    updatedAt: "2026-11-01T00:00:00Z",
    estimatedReadMinutes: 8,
  },
  {
    slug: "etsy-vs-shopify-vs-tiktok-shop-comparison",
    title: "Etsy vs. Shopify vs. TikTok Shop: Which Platform Leaves Higher Margins?",
    description: "A head-to-head profit margin analysis across the big 3 seller channels. Discover real net payouts on $25, $50, and $100 items factoring in hidden fees and ad costs.",
    relatedTools: ["etsy-vs-shopify-vs-tiktok-shop-calculator", "shopify-profit-calculator", "tiktok-shop-fee-calculator"],
    publishedAt: "2026-11-05T00:00:00Z",
    updatedAt: "2026-11-05T00:00:00Z",
    estimatedReadMinutes: 10,
  },
  {
    slug: "pod-pricing-strategy-offsite-ads",
    title: "Print-on-Demand Pricing Strategy: Avoiding Hidden Offsite Ads Losses",
    description: "How to price print-on-demand t-shirts, mugs, and hoodies to maintain healthy 30%+ profit margins even after base provider costs, shipping, and Etsy/Shopify fees.",
    relatedTools: ["pod-profit-calculator", "etsy-fee-calculator"],
    publishedAt: "2026-11-10T00:00:00Z",
    updatedAt: "2026-11-10T00:00:00Z",
    estimatedReadMinutes: 7,
  },
  {
    slug: "pass-payment-processing-fees-to-clients",
    title: "How to Pass Payment Processing Fees to Clients Without Losing Deals",
    description: "The gross-up formula explained: how to calculate client invoice charges to receive your exact target amount after Stripe and PayPal merchant deduction rates.",
    relatedTools: ["stripe-vs-paypal-fee-calculator"],
    publishedAt: "2026-11-12T00:00:00Z",
    updatedAt: "2026-11-12T00:00:00Z",
    estimatedReadMinutes: 6,
  },
];

export const TOOLS: ToolConfig[] = [
  {
    slug: "etsy-fee-calculator",
    title: "Etsy Fee Calculator (2026 Updated)",
    shortDescription: "Calculate exact net profit, listing fees, 6.5% transaction charges, payment processing, and optional 12-15% Offsite Ads across 10 international markets.",
    cluster: "A",
    phase: 1,
    targetKeywords: ["etsy fee calculator 2026", "etsy offsite ads profit calculator", "etsy seller fee breakdown"],
    formulaMarkdown: "`Net Profit = (Item Price + Shipping Charge) − (Listing Fee ($0.20) + 6.5% Transaction Fee + Payment Processing Fee (3% + $0.25 US) + Regulatory Operating Fee + Offsite Ads (12–15%))`",
    formulaFn: "calculateEtsyFees",
    pSEOPresets: ["us", "uk", "ca", "au", "de", "fr", "nl", "it", "es", "in"],
    lastUpdated: "2026-11-01",
    isComparison: false,
    dataSnippet: "Selling a $29.99 item with $5 shipping on Etsy incurs $5.42 in total seller fees (15.5%), leaving a clean net profit of $29.57.",
    affiliatePartner: "Printify",
    affiliateUrl: "https://printify.com/?ref=calcdial",
    affiliateCta: "Source low-cost POD inventory on Printify",
    howToSteps: [
      { name: "Enter Item Price", text: "Type the retail listing price of your Etsy product in your store's native currency." },
      { name: "Enter Shipping Charged", text: "Input the shipping amount charged to the buyer (or 0 if offering free shipping)." },
      { name: "Select Bank Country", text: "Choose your Etsy Payments settlement country to apply precise localized payment processing rates." },
      { name: "Configure Offsite Ads", text: "Toggle Etsy Offsite Ads and select 15% (under $10k annual revenue) or 12% ($10k+ mandatory tier)." },
      { name: "Review Instant Profit Breakdown", text: "View your net earnings, fee percentages, and printable breakdown instantly." },
    ],
    workedExamples: [
      {
        label: "Handmade Mug ($24.99 + $5.00 Shipping, US Seller, No Ads)",
        inputs: { "Item Price": "$24.99", "Shipping Charged": "$5.00", "Country": "United States", "Offsite Ads": "Off" },
        result: { "Gross Revenue": "$29.99", "Etsy Fees": "$3.30", "Net Profit": "$26.69", "Effective Fee %": "11.0%" },
      },
      {
        label: "Vintage Jacket ($85.00 + Free Shipping, US Seller, 15% Offsite Ads)",
        inputs: { "Item Price": "$85.00", "Shipping Charged": "$0.00", "Country": "United States", "Offsite Ads": "15%" },
        result: { "Gross Revenue": "$85.00", "Etsy Fees": "$21.33", "Net Profit": "$63.67", "Effective Fee %": "25.1%" },
      },
      {
        label: "Digital Art Download ($12.00, UK Seller, No Shipping)",
        inputs: { "Item Price": "£12.00", "Shipping Charged": "£0.00", "Country": "United Kingdom", "Offsite Ads": "Off" },
        result: { "Gross Revenue": "£12.00", "Etsy Fees": "£1.66", "Net Profit": "£10.34", "Effective Fee %": "13.8%" },
      },
    ],
    faqs: [
      { question: "What is Etsy's transaction fee in 2026?", answer: "Etsy charges a 6.5% transaction fee on the total order amount, which includes both the item sale price and the shipping charge collected from the buyer." },
      { question: "How much are Etsy listing fees?", answer: "Etsy charges $0.20 USD for each listing published or renewed. Listings expire after 4 months or upon sale and auto-renewal." },
      { question: "Can I opt out of Etsy Offsite Ads?", answer: "Sellers who made under $10,000 USD in sales over the trailing 365 days can opt out of Offsite Ads. Sellers exceeding $10,000 are permanently enrolled at a discounted 12% fee." },
      { question: "Does Etsy charge fees on shipping charges?", answer: "Yes. Both the 6.5% transaction fee and the localized payment processing fee apply to the combined total of the item price plus shipping." },
    ],
    relatedTools: ["etsy-vs-shopify-vs-tiktok-shop-calculator", "pod-profit-calculator", "shopify-profit-calculator"],
    relatedGuides: ["how-to-calculate-etsy-fees-2026", "etsy-vs-shopify-vs-tiktok-shop-comparison"],
  },
  {
    slug: "pod-profit-calculator",
    title: "Print-on-Demand Profit & Margin Calculator",
    shortDescription: "Calculate real POD margins across t-shirts, hoodies, mugs, and totes after base printing costs, fulfillment shipping, platform fees, and paid ad spend.",
    cluster: "A",
    phase: 1,
    targetKeywords: ["print on demand profit calculator", "pod pricing calculator etsy", "pod margin calculator"],
    formulaMarkdown: "`Net Profit = Retail Price − (Base Print Cost + Shipping + Marketplace Fee + Ad Spend)`",
    formulaFn: "calculatePodProfit",
    pSEOPresets: ["t-shirts", "hoodies", "mugs", "totes", "posters", "phone-cases", "stickers", "canvas", "pillows", "ornaments"],
    lastUpdated: "2026-11-01",
    isComparison: false,
    dataSnippet: "Selling a print-on-demand t-shirt for $28 with a $9.50 base production cost leaves $12.18 net margin (43.5%) before ad spend.",
    affiliatePartner: "Printify",
    affiliateUrl: "https://printify.com/?ref=calcdial",
    affiliateCta: "Find high-margin apparel suppliers on Printify",
    howToSteps: [
      { name: "Choose Product Preset", text: "Select your POD catalog item to prefill realistic base blank and print costs." },
      { name: "Set Retail Selling Price", text: "Enter what you plan to charge your customer on Etsy, Shopify, or TikTok Shop." },
      { name: "Input Base Print & Shipping", text: "Adjust provider base production cost and buyer shipping fees." },
      { name: "Add Marketing / Ad Spend", text: "Include expected customer acquisition cost (CAC) or ad spend per order." },
      { name: "Inspect Margin Health", text: "Verify that your gross margin remains above 30% for sustainable scalability." },
    ],
    workedExamples: [
      {
        label: "Unisex Cotton Tee ($28.00 Retail, $9.50 Printify Base Cost)",
        inputs: { "Retail Price": "$28.00", "Base Cost": "$9.50", "Platform Fee": "$2.80", "Ad Spend": "$5.00" },
        result: { "Gross Margin": "66.1%", "Net Profit": "$10.70", "Net Margin": "38.2%" },
      },
      {
        label: "Heavyweight Hoodie ($48.00 Retail, $22.00 Base Cost)",
        inputs: { "Retail Price": "$48.00", "Base Cost": "$22.00", "Platform Fee": "$4.80", "Ad Spend": "$10.00" },
        result: { "Gross Margin": "54.2%", "Net Profit": "$11.20", "Net Margin": "23.3%" },
      },
    ],
    faqs: [
      { question: "What is a good profit margin for Print on Demand?", answer: "A healthy print-on-demand net margin is between 30% and 45% before ad spend, leaving roughly 15% to 25% net profit after paid advertising." },
      { question: "How do platform fees affect POD profit?", answer: "Marketplaces like Etsy take 12-25% in total fees, while custom Shopify storefronts only take 2.9% + $0.30 payment fees, giving Shopify sellers superior margins at scale." },
    ],
    relatedTools: ["etsy-fee-calculator", "shopify-profit-calculator", "etsy-vs-shopify-vs-tiktok-shop-calculator"],
    relatedGuides: ["pod-pricing-strategy-offsite-ads", "how-to-calculate-etsy-fees-2026"],
  },
  {
    slug: "tiktok-shop-fee-calculator",
    title: "TikTok Shop Seller Fee & Profit Calculator",
    shortDescription: "Calculate TikTok Shop net earnings factoring in category referral fees (5-6%), creator affiliate commissions, shipping subsidies, and COGS.",
    cluster: "A",
    phase: 1,
    targetKeywords: ["tiktok shop fee calculator", "tiktok shop profit margin", "tiktok seller fees 2026"],
    formulaMarkdown: "`Net Profit = Sale Price − (Category Referral Fee + Affiliate Commission + Shipping + COGS)`",
    formulaFn: "calculateTikTokFees",
    pSEOPresets: ["beauty", "apparel", "electronics", "home-garden", "health", "toys", "sports", "food", "pets", "accessories"],
    lastUpdated: "2026-11-01",
    isComparison: false,
    dataSnippet: "A $35 TikTok Shop apparel item with a 15% creator commission nets $22.40 profit after a 6% referral fee and product costs.",
    affiliatePartner: "Shopify",
    affiliateUrl: "https://shopify.pxf.io/c/calcdial",
    affiliateCta: "Sync your Shopify products with TikTok Shop seamlessly",
    howToSteps: [
      { name: "Enter Sale Price", text: "Enter your customer checkout item price." },
      { name: "Pick Category", text: "Select your product category to load the current referral commission rate." },
      { name: "Set Creator Affiliate %", text: "Input the affiliate commission you offer TikTok creators for driving the sale." },
      { name: "Enter COGS & Shipping", text: "Add your landed unit manufacturing cost and actual shipping fulfillment cost." },
      { name: "Calculate Net Payout", text: "See your exact payout after TikTok platform deductions." },
    ],
    workedExamples: [
      {
        label: "Viral Lip Gloss ($18.00, Beauty Category, 15% Creator Commission)",
        inputs: { "Sale Price": "$18.00", "Category": "Beauty (6%)", "Affiliate %": "15%", "COGS": "$3.00" },
        result: { "Platform Fee": "$1.08", "Creator Fee": "$2.70", "Net Profit": "$11.22", "Net Margin": "62.3%" },
      },
    ],
    faqs: [
      { question: "What are TikTok Shop fees in 2026?", answer: "Standard category referral fees on TikTok Shop range between 5% and 6% for most consumer categories in the US and UK." },
      { question: "Do creators pay TikTok Shop fees?", answer: "No, fees and creator commissions are deducted from the seller's gross payout." },
    ],
    relatedTools: ["etsy-vs-shopify-vs-tiktok-shop-calculator", "shopify-profit-calculator", "etsy-fee-calculator"],
    relatedGuides: ["etsy-vs-shopify-vs-tiktok-shop-comparison"],
  },
  {
    slug: "shopify-profit-calculator",
    title: "Shopify Profit & Break-Even ROAS Calculator",
    shortDescription: "Calculate store profit margins, gateway processing costs, shipping, ad spend, and exact break-even ROAS across all major payment gateways.",
    cluster: "A",
    phase: 1,
    targetKeywords: ["shopify profit calculator", "shopify break even roas", "shopify gateway fee calculator"],
    formulaMarkdown: "`Net Profit = Revenue − (COGS + Payment Fee + Shipping + Ad Spend); Break-Even ROAS = 1 / Gross Margin %`",
    formulaFn: "calculateShopifyProfit",
    pSEOPresets: ["shopify-payments", "stripe", "paypal", "square", "authorize-net", "2checkout", "klarna", "afterpay", "worldpay", "adyen"],
    lastUpdated: "2026-11-01",
    isComparison: false,
    dataSnippet: "A Shopify product with 65% gross margin requires a minimum break-even ROAS of 1.54x on Meta & Google Ads to remain profitable.",
    affiliatePartner: "Shopify",
    affiliateUrl: "https://shopify.pxf.io/c/calcdial",
    affiliateCta: "Sign up for Shopify free trial ($1/mo for first 3 months)",
    howToSteps: [
      { name: "Enter Product Price", text: "Input your customer retail price." },
      { name: "Input Landed COGS", text: "Enter product manufacturing and importing unit cost." },
      { name: "Select Payment Gateway", text: "Pick your checkout gateway (Shopify Payments, Stripe, PayPal) to deduct processing fees." },
      { name: "Add Monthly or Per-Order Ad Spend", text: "Input your current blended marketing cost per acquisition." },
      { name: "Evaluate Break-Even ROAS", text: "Compare your actual ad ROAS against the calculated minimum break-even benchmark." },
    ],
    workedExamples: [
      {
        label: "D2C Skincare ($45.00 Retail, $11.00 COGS, Shopify Payments)",
        inputs: { "Retail Price": "$45.00", "COGS": "$11.00", "Payment Fee": "$1.61", "Ad Spend": "$18.00" },
        result: { "Gross Margin": "75.6%", "Break-Even ROAS": "1.32x", "Net Profit": "$14.39" },
      },
    ],
    faqs: [
      { question: "What is break-even ROAS?", answer: "Break-even ROAS is the minimum return on ad spend you must achieve so that advertising costs equal gross profit without losing money. Formula: 1 / Gross Margin %." },
      { question: "Are third-party gateway fees higher on Shopify?", answer: "Yes, Shopify charges an extra 0.5% to 2.0% transaction fee if you use third-party gateways instead of native Shopify Payments." },
    ],
    relatedTools: ["etsy-vs-shopify-vs-tiktok-shop-calculator", "pod-profit-calculator", "tiktok-shop-fee-calculator"],
    relatedGuides: ["etsy-vs-shopify-vs-tiktok-shop-comparison"],
  },
  {
    slug: "etsy-vs-shopify-vs-tiktok-shop-calculator",
    title: "Etsy vs. Shopify vs. TikTok Shop Profit Comparison Calculator",
    shortDescription: "Compare side-by-side net seller profits, effective fee percentages, and break-even pricing across Etsy, Shopify, and TikTok Shop in real time.",
    cluster: "A",
    phase: 1,
    targetKeywords: ["etsy vs shopify fees", "etsy vs tiktok shop profit comparison", "marketplace seller fee comparison"],
    formulaMarkdown: "`Net Payout = Item Price − Total Platform Specific Fees. Compares Etsy (listing + 6.5% + payment), Shopify (2.9% + $0.30), and TikTok Shop (6% referral + creator commission).`",
    formulaFn: "compareMarketplaces",
    pSEOPresets: ["us", "uk", "ca", "au", "de", "fr", "nl", "it", "es", "in"],
    lastUpdated: "2026-11-01",
    isComparison: true,
    dataSnippet: "On a $50 sale, Shopify leaves you with $48.25 net payout vs $43.90 on Etsy and $44.00 on TikTok Shop — keeping up to $4.35 more per sale on Shopify.",
    affiliatePartner: "Shopify",
    affiliateUrl: "https://shopify.pxf.io/c/calcdial",
    affiliateCta: "Launch your independent Shopify store with $1/month promo",
    howToSteps: [
      { name: "Enter Target Retail Price", text: "Enter the common selling price for your product across all three channels." },
      { name: "Input COGS & Shipping", text: "Set standardized manufacturing and shipping costs." },
      { name: "Examine Net Payout Side-by-Side", text: "Instantly see which channel yields the highest cash in your bank account." },
    ],
    workedExamples: [
      {
        label: "$30 Item Comparison",
        inputs: { "Price": "$30.00", "COGS": "$8.00", "Shipping": "$4.00" },
        result: { "Shopify Net": "$20.83", "TikTok Net": "$18.20", "Etsy Net": "$17.48" },
      },
    ],
    faqs: [
      { question: "Which platform has the lowest seller fees?", answer: "Shopify has significantly lower per-transaction fees (around 2.9% + $0.30) compared to Etsy (around 12-20% blended) and TikTok Shop (6-20% including affiliate commissions). However, Shopify requires you to generate your own traffic." },
    ],
    relatedTools: ["etsy-fee-calculator", "shopify-profit-calculator", "tiktok-shop-fee-calculator"],
    relatedGuides: ["etsy-vs-shopify-vs-tiktok-shop-comparison", "how-to-calculate-etsy-fees-2026"],
  },
  {
    slug: "stripe-vs-paypal-fee-calculator",
    title: "Stripe vs. PayPal Fee Comparison & Gross-Up Calculator",
    shortDescription: "Compare merchant processing fees, currency exchange surcharges, international card markups, and exact invoice gross-up amounts for Stripe and PayPal.",
    cluster: "A",
    phase: 1,
    targetKeywords: ["stripe vs paypal fees", "paypal vs stripe fee calculator", "invoice gross up calculator"],
    formulaMarkdown: "`Gross-up Amount = (Target Payout + Fixed Fee) / (1 − Percentage Rate)`",
    formulaFn: "comparePaymentProcessors",
    pSEOPresets: ["usd", "gbp", "eur", "cad", "aud", "jpy", "chf", "sgd", "hkd", "mxn"],
    lastUpdated: "2026-11-01",
    isComparison: true,
    dataSnippet: "To receive exactly $1,000 net payout in the US, invoice $1,030.18 via Stripe (2.9% + $0.30) versus $1,036.78 via PayPal (3.49% + $0.49).",
    affiliatePartner: "Wise",
    affiliateUrl: "https://wise.com/?ref=calcdial",
    affiliateCta: "Save on international payments with Wise Business",
    howToSteps: [
      { name: "Enter Target Net Payout", text: "Type the exact amount of money you want deposited into your bank account." },
      { name: "Select Transaction Type", text: "Toggle domestic vs international payment or ACH bank transfer." },
      { name: "View Exact Invoice Gross-Up", text: "Copy the calculated amount to quote your client so fees are 100% covered." },
    ],
    workedExamples: [
      {
        label: "$1,000 Client Invoice (US Domestic Card)",
        inputs: { "Target Payout": "$1,000.00", "Payment Method": "Domestic Credit Card" },
        result: { "Invoice Stripe": "$1,030.18", "Stripe Fee": "$30.18", "Invoice PayPal": "$1,036.78", "PayPal Fee": "$36.78" },
      },
    ],
    faqs: [
      { question: "What is an invoice gross-up?", answer: "Gross-up calculates how much to bill a customer so that after payment processor deduction fees, you receive your exact desired net amount." },
      { question: "Is Stripe cheaper than PayPal?", answer: "For domestic card transactions, Stripe (2.9% + $0.30) is cheaper than standard PayPal checkout (3.49% + $0.49). PayPal also charges higher cross-border and currency conversion fees." },
    ],
    relatedTools: ["shopify-profit-calculator", "etsy-fee-calculator"],
    relatedGuides: ["pass-payment-processing-fees-to-clients"],
  },
];

export function getToolBySlug(slug: string): ToolConfig | undefined {
  // Support base slugs or preset-suffixed slugs like etsy-fee-calculator-us
  return TOOLS.find((tool) => {
    if (tool.slug === slug) return true;
    return tool.pSEOPresets.some((preset) => `${tool.slug}-${preset}` === slug);
  });
}

export function getGuideBySlug(slug: string): GuideMeta | undefined {
  return GUIDES.find((guide) => guide.slug === slug);
}
