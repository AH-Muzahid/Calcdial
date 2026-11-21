export interface GuideSection {
  title: string;
  id: string;
  content: string[];
}

export interface GuideDetail {
  slug: string;
  title: string;
  subtitle: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  readTime: string;
  metaDescription: string;
  primaryToolSlug: string;
  sections: GuideSection[];
  faqs: { question: string; answer: string }[];
}

export const DETAILED_GUIDES: Record<string, GuideDetail> = {
  "how-to-calculate-etsy-fees-2026": {
    slug: "how-to-calculate-etsy-fees-2026",
    title: "How to Calculate Etsy Fees in 2026 (Complete Seller Breakdown)",
    subtitle: "A step-by-step master guide to understanding listing fees, the 6.5% transaction commission, payment processing rates by country, regulatory operating fees, and Offsite Ads tiers.",
    author: "CalcDial Research Desk",
    publishedAt: "2026-11-01T00:00:00Z",
    updatedAt: "2026-11-01T00:00:00Z",
    readTime: "8 min read",
    metaDescription: "Master the complete Etsy fee schedule in 2026. Calculate exact net profit after listing, transaction, payment processing, regulatory, and Offsite Ads deductions.",
    primaryToolSlug: "etsy-fee-calculator",
    sections: [
      {
        id: "why-fees-matter",
        title: "1. Why Sellers Get Caught Off-Guard by Etsy Fees",
        content: [
          "Many new Etsy sellers believe their only cost is Etsy's advertised 6.5% transaction fee and the $0.20 listing fee. However, once you tally customer shipping charges, localized payment processing surcharges, regulatory operating fees, and mandatory Offsite Advertising commissions, total Etsy deductions frequently reach 18% to 25% of your gross customer checkout total.",
          "Failing to calculate these blended percentages before setting your retail prices is one of the leading causes of negative margins in handmade and vintage e-commerce.",
        ],
      },
      {
        id: "listing-fees",
        title: "2. The $0.20 Listing Fee & Renewal Rules",
        content: [
          "Etsy charges $0.20 USD for every item listed or renewed. A listing remains active for four months or until it sells.",
          "When a multi-quantity listing sells, Etsy automatically renews the listing for another four months, deducting another $0.20 listing renewal fee. If a buyer purchases three quantities of an item in a single order, you will be charged $0.20 for the initial listing plus two $0.20 renewal fees for the additional two units sold.",
        ],
      },
      {
        id: "transaction-fees",
        title: "3. The 6.5% Transaction Commission (Including Shipping)",
        content: [
          "Etsy takes a 6.5% transaction commission on the total gross amount charged to the buyer. This is a critical distinction: the 6.5% applies not just to the item retail price, but also to whatever shipping fee you charge the customer.",
          "If you sell a ceramic bowl for $30.00 and charge $10.00 for express shipping, Etsy's 6.5% fee applies to the entire $40.00 order value ($2.60 fee). If you offer optional gift wrapping for $5.00, the 6.5% applies to that as well.",
        ],
      },
      {
        id: "payment-processing",
        title: "4. Country-Specific Etsy Payments Processing Fees",
        content: [
          "Payment processing fees cover merchant credit card settlement and vary by the seller's registered bank country. In the United States, Etsy charges 3% + $0.25 per transaction. In the United Kingdom, the fee is 4% + £0.20. In Canada, it is 3% + CA$0.25, while European nations like Germany, France, and Italy charge 4% + €0.30.",
          "Like the transaction fee, the payment processing percentage applies to the entire order total (item price + buyer shipping charge).",
        ],
      },
      {
        id: "regulatory-fees",
        title: "5. Regulatory Operating Fees in Selected Countries",
        content: [
          "In several countries, Etsy assesses an additional 'Regulatory Operating Fee' to offset local digital service taxes and compliance costs. For example, sellers in the UK pay an extra 0.32%, France 0.47%, Italy 0.32%, and Spain 0.40% on the item price plus shipping.",
          "While US sellers are exempt from regulatory operating fees, international sellers must factor this into their unit economics.",
        ],
      },
      {
        id: "offsite-ads",
        title: "6. The 12% to 15% Etsy Offsite Ads Dilemma",
        content: [
          "Etsy advertises seller listings across Google, Facebook, Instagram, Pinterest, and Bing through its Offsite Ads program. When a buyer clicks an external ad and purchases from your shop within 30 days, Etsy deducts an Offsite Ads fee on that order.",
          "Etsy structures this advertising fee into two distinct tiers based on your shop's gross revenue over the trailing 365-day period:",
          "• Under $10,000 USD Annual Sales: 15.0% fee on attributed orders. Participation is optional — newer and smaller shops have the freedom to opt out anytime in shop settings if margins are tight.",
          "• $10,000 USD or More Annual Sales: 12.0% fee on attributed orders. Etsy provides a 3% volume discount as an established seller reward, but enrollment becomes permanently mandatory for the lifetime of the shop (no opt-out permitted, even if sales subsequently drop below $10k).",
          "Fee Cap Protection: Etsy strictly caps the maximum Offsite Ads fee at $100.00 USD per order, regardless of the total item price.",
        ],
      },
    ],
    faqs: [
      {
        question: "Does Etsy charge fees if my item does not sell?",
        answer: "Yes. You are charged the $0.20 listing fee upon publishing the listing, which covers a 4-month period regardless of whether a sale occurs.",
      },
      {
        question: "Is offering Free Shipping cheaper on Etsy fees?",
        answer: "Mathematically, the fee total is identical. A $35 item with free shipping incurs the same 6.5% transaction and 3% + $0.25 payment fee as a $30 item with $5 shipping. However, items with free shipping often rank higher in Etsy's search algorithm.",
      },
      {
        question: "How can I calculate my exact Etsy payout?",
        answer: "Use our interactive Etsy Fee Calculator above to enter your selling price, shipping fee, country, and Offsite Ads status to see an instant itemized breakdown.",
      },
    ],
  },

  "etsy-vs-shopify-vs-tiktok-shop-comparison": {
    slug: "etsy-vs-shopify-vs-tiktok-shop-comparison",
    title: "Etsy vs. Shopify vs. TikTok Shop: Which Platform Leaves Higher Margins?",
    subtitle: "A head-to-head profit margin analysis across the three dominant e-commerce channels in 2026. Discover real net payouts factoring in hidden merchant costs, ad spends, and buyer traffic.",
    author: "CalcDial Research Desk",
    publishedAt: "2026-11-05T00:00:00Z",
    updatedAt: "2026-11-05T00:00:00Z",
    readTime: "10 min read",
    metaDescription: "Comprehensive 2026 comparison: Etsy vs Shopify vs TikTok Shop seller fees, net margins, customer acquisition economics, and long-term profitability.",
    primaryToolSlug: "etsy-vs-shopify-vs-tiktok-shop-calculator",
    sections: [
      {
        id: "overview",
        title: "1. The 2026 E-Commerce Channel Landscape",
        content: [
          "Modern sellers are no longer confined to a single sales channel. Successful brands often test new products on Etsy, scale paid ads on an independent Shopify storefront, and drive viral social purchases through TikTok Shop.",
          "However, each platform operates under fundamentally different economic models. Etsy offers built-in search traffic with high percentage cuts (12-25%). Shopify offers near-zero platform fees (2.9% + $0.30) but requires you to pay for 100% of your customer acquisition. TikTok Shop pairs massive video discovery with 5-6% category commissions and creator affiliate payouts.",
        ],
      },
      {
        id: "unit-economics",
        title: "2. Real Net Payout Comparison on a $50 Product",
        content: [
          "Consider a seller pricing an apparel item at $50.00 with $12.00 product manufacturing cost and $5.00 buyer shipping charge:",
          "On Shopify (using native Shopify Payments at 2.9% + $0.30): Total processing fee is $1.90. The seller receives $53.10 net payout. Subtracting $17.00 COGS and fulfillment leaves $36.10 net profit (65.6% margin).",
          "On Etsy (US seller, 6.5% transaction + 3% + $0.25 payment + $0.20 listing): Total fees are $5.68. The seller receives $49.32 net payout, leaving $32.32 net profit (58.8% margin).",
          "On TikTok Shop (6% apparel referral fee + 10% creator affiliate commission): Total platform and affiliate fees are $8.00. The seller receives $47.00 net payout, leaving $30.00 net profit (54.5% margin).",
        ],
      },
      {
        id: "strategic-recommendation",
        title: "3. The Optimal Multi-Channel Growth Strategy",
        content: [
          "Phase 1: Start on Etsy or TikTok Shop to validate product demand without upfront ad spend.",
          "Phase 2: Once you achieve product-market fit, migrate repeat customers to a dedicated Shopify storefront using package inserts and email newsletters to capture 10% to 15% higher profit margins.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is Shopify always cheaper than Etsy?",
        answer: "Shopify is cheaper on per-transaction fees. However, Shopify has a monthly subscription ($39/mo for Basic) and provides zero organic search traffic. If you do not have an existing audience or marketing funnel, Etsy's built-in marketplace traffic is often more cost-effective for beginners.",
      },
      {
        question: "Can I connect my Shopify store to TikTok Shop?",
        answer: "Yes, the official TikTok Shop app for Shopify allows you to synchronize your product catalog, inventory, and order fulfillment directly while paying TikTok's standard category referral fee.",
      },
    ],
  },

  "pod-pricing-strategy-offsite-ads": {
    slug: "pod-pricing-strategy-offsite-ads",
    title: "Print-on-Demand Pricing Strategy: Avoiding Hidden Offsite Ads Losses",
    subtitle: "How to price POD apparel, drinkware, and canvas art to protect healthy 30%+ profit margins against base printing spikes, fulfillment shipping, and marketplace ad deductions.",
    author: "CalcDial Research Desk",
    publishedAt: "2026-11-10T00:00:00Z",
    updatedAt: "2026-11-10T00:00:00Z",
    readTime: "7 min read",
    metaDescription: "Learn how to price print-on-demand products for maximum profit. Formulas for Gildan 5000, Bella+Canvas 3001, mugs, and posters factoring in platform fees.",
    primaryToolSlug: "pod-profit-calculator",
    sections: [
      {
        id: "pod-cost-structure",
        title: "1. The Anatomy of a Print-on-Demand Transaction",
        content: [
          "Print-on-demand allows entrepreneurs to launch merchandise without holding physical inventory. However, because production is handled unit-by-unit by third-party print providers (like Printify, Gelato, or Printful), your base unit cost is considerably higher than bulk manufacturing.",
          "A classic Bella+Canvas 3001 t-shirt typically costs $8.50 to $10.50 to print, plus $4.00 to $5.50 for standard domestic shipping. If you price that t-shirt at $22.00 on Etsy, platform fees ($3.30) combined with base printing ($14.00) leave you with less than $4.70 in real profit.",
        ],
      },
      {
        id: "margin-rules",
        title: "2. The 40% Minimum Gross Margin Rule",
        content: [
          "To build a resilient POD business, target a minimum 40% gross margin before paid advertising. Formula: `Retail Price >= (Base Print Cost + Shipping Cost) / 0.60`.",
          "For a hoodie with a $22.00 base print and $7.00 shipping cost (total production cost of $29.00), your minimum retail price should be $48.33 to maintain safety against unexpected returns or Offsite Ads deductions.",
        ],
      },
    ],
    faqs: [
      {
        question: "What is the best print-on-demand product for high margins?",
        answer: "Heavyweight hoodies, canvas wall art, and embroidered tote bags consistently command higher perceived value and 45%+ net margins compared to standard basic t-shirts.",
      },
    ],
  },

  "pass-payment-processing-fees-to-clients": {
    slug: "pass-payment-processing-fees-to-clients",
    title: "How to Pass Payment Processing Fees to Clients Without Losing Deals",
    subtitle: "The mathematical gross-up formula explained: how freelancers, consultants, and agencies can quote invoice amounts so Stripe and PayPal merchant deductions equal zero out-of-pocket loss.",
    author: "CalcDial Research Desk",
    publishedAt: "2026-11-12T00:00:00Z",
    updatedAt: "2026-11-12T00:00:00Z",
    readTime: "6 min read",
    metaDescription: "Master the payment processing gross-up formula. Learn how to calculate client invoices to receive your exact target deposit after Stripe or PayPal deductions.",
    primaryToolSlug: "stripe-vs-paypal-fee-calculator",
    sections: [
      {
        id: "the-math-trap",
        title: "1. The Common Percentage Mistake Freelancers Make",
        content: [
          "When a freelancer agrees on a $1,000 project fee and knows Stripe charges 2.9% + $0.30, a common instinct is to simply add 2.9% to the invoice ($1,029.00).",
          "However, Stripe applies its 2.9% fee to the new gross amount ($1,029.00 * 2.9% = $29.84 + $0.30 = $30.14). The freelancer receives $998.86—falling short of their desired $1,000 net target.",
        ],
      },
      {
        id: "gross-up-formula",
        title: "2. The Exact Mathematical Gross-Up Formula",
        content: [
          "To guarantee you receive your exact net payment, use the reverse gross-up formula:",
          "`Invoice Amount = (Target Net Amount + Fixed Processing Fee) / (1 - (Percentage Rate / 100))`",
          "For a $1,000 US domestic credit card transaction on Stripe (2.9% + $0.30): `($1,000 + $0.30) / (1 - 0.029) = $1,000.30 / 0.971 = $1,030.18`.",
          "When the client pays $1,030.18, Stripe deducts ($1,030.18 * 2.9% = $29.88 + $0.30 = $30.18), leaving you with exactly $1,000.00.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is it legal to surcharge credit card processing fees?",
        answer: "In most US states and international jurisdictions, merchant surcharging is legal provided you disclose the fee clearly prior to payment and do not surcharge more than your actual processing cost.",
      },
    ],
  },
};
