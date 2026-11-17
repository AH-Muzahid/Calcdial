Antigravity Build Guide (v2): High-CPC Niche Tools & Calculator Website

1. Project Overview & Strategic Direction

Goal: Build a 100% client-side, ad- and affiliate-monetized online calculator hub targeting Tier-1 (US, UK, CA, AU) commercial-intent search traffic with zero backend compute cost.

Why Niche Calculators Beat Generic File Converters:

General file/PDF sites like iLovePDF (303.35M monthly visits) face extreme competition and lower blended RPM due to heavy global Tier-2/3 traffic (PrivyTools).

Niche finance, e-commerce, and B2B calculators attract high-CPC advertisers (accounting software, payment processors, SaaS, fintech) where strong niches see $8–$20+ RPM (Publift) and proven traffic scale (Calculator.net at 77.3M/mo; OmniCalculator at 16.1M/mo).

Primary Starting Niche (Recommended): E-Commerce & Marketplace Seller Calculators (Etsy, Shopify, TikTok Shop, Print-on-Demand) + Comparison Calculators + Freelancer/Payment Fee Tools as Phase 2.

Objective formulas (low YMYL risk), frequent platform fee updates driving fresh search intent, and strong Programmatic SEO (Flow Ninja) expansion.

2. Tech Stack, Analytics & Testing Rules

Framework: Next.js (App Router) with TypeScript and Tailwind CSS.

Rendering Strategy: Static Site Generation (generateStaticParams) for all tool, guide, and programmatic variation pages to guarantee sub-100ms TTFB and clean Core Web Vitals.

Computation: 100% client-side React state/hooks (no server API calls required for calculations).

Testing: Vitest + React Testing Library for unit-testing all pure calculation functions (zero, negative margin, currency/FX edge cases) and core UI state.

Analytics: Google Analytics 4 (GA4) via @next/third-parties/google + Google Search Console from Day 1, with typed custom events (calculator_used, result_copied, affiliate_clicked, embed_copied).

Hosting: Vercel (free tier / edge CDN).

SEO & Structured Data:

Dynamic generateMetadata() per route (unique title, meta description, canonical URL, OpenGraph).

FAQPage, SoftwareApplication, and Article JSON-LD schemas.

Auto-generated sitemap.ts and robots.ts.

3. Recommended Directory Structure (v2)

src/
├── app/
│   ├── layout.tsx                  # Global nav, footer, GA4, Grow/AdSense script slot, fonts
│   ├── page.tsx                    # Hub homepage with category directory & instant search
│   ├── tools/
│   │   └── [slug]/
│   │       └── page.tsx            # Programmatic tool & top-10 variation pages (SSG)
│   ├── guides/
│   │   └── [slug]/
│   │       └── page.tsx            # Supporting pillar blog guides (SSG/MDX)
│   ├── embed/
│   │   └── [slug]/
│   │       └── page.tsx            # Lightweight iframe widget route for backlinks
│   ├── about/page.tsx              # Mandatory trust page
│   ├── contact/page.tsx            # Mandatory trust page
│   ├── privacy-policy/page.tsx     # Mandatory for AdSense & Journey approval
│   ├── terms/page.tsx              # Mandatory trust page
│   ├── robots.ts                   # Robots directives
│   └── sitemap.ts                  # Dynamic XML sitemap (tools + guides + variations)
├── components/
│   ├── calculators/                # Mobile-first calculator & comparison engines
│   ├── layout/                     # Header, Footer, Breadcrumbs, AdSlot, AffiliateCallout
│   └── seo/                        # FormulaBreakdown, WorkedExample, FAQAccordion, JsonLd
├── content/
│   └── guides/                     # Supporting Markdown/MDX guides per cluster
├── data/
│   ├── tools-registry.ts           # Master config of tools, comparison tools & pSEO variants
│   └── fee-presets.ts              # Centralized fee tables + lastUpdated ISO dates
├── lib/
│   ├── analytics.ts                # Typed GA4 event tracking helper
│   └── formulas/                   # Pure, unit-tested TypeScript math functions
└── tests/
    └── formulas/                   # Vitest unit tests for every formula & edge case


4. 15 High-CPC Calculator Blueprints + Comparison Tools

Realistic pSEO Phasing Rule

Instead of launching 50 US states or 60 countries at once, Phase 1 launches with the Top 10 highest-volume presets per tool. Expand to additional states/countries only after Google Search Console shows impressions and indexing velocity.

Cluster A: E-Commerce & Seller Profit (Phase 1 Priority)

Tool Slug

Target Keywords (Tier-1)

Core Formula & Inputs

Phase 1 pSEO Presets (Top 10)

Reference

etsy-fee-calculator

etsy fee calculator 2026, etsy offsite ads profit calculator

Price + Shipping − ($0.20 listing + 6.5% transaction + 3% + $0.25 processing + 0.65% regulatory + optional 12–15% Offsite Ads)

Top 10 Etsy Payments countries (US, UK, CA, AU, DE, FR, etc.)

SEO Ninja

pod-profit-calculator

print on demand profit calculator, pod pricing calculator etsy

Retail Price − (Base Print Cost + Shipping + Marketplace Fee + Ad Spend)

Top 10 POD items (t-shirts, hoodies, mugs, totes, posters)

PODPriceCheck

tiktok-shop-fee-calculator

tiktok shop fee calculator, tiktok shop profit margin

Sale Price − (Category Referral Fee + Affiliate Commission + Shipping + COGS)

Top 10 categories (beauty, apparel, electronics, home)

SellersNest

shopify-profit-calculator

shopify profit calculator, shopify break even roas

Revenue − (COGS + Payment Fee + Shipping + Ad Spend); Break-Even ROAS = 1 / Gross Margin

Payment gateway toggles (Shopify Payments, Stripe, PayPal)

Ecom Beacon

etsy-vs-shopify-vs-tiktok-shop-calculator

etsy vs shopify fees, etsy vs tiktok shop profit comparison

Side-by-side net profit, effective fee %, and break-even price across all 3 platforms

High-intent comparison landing pages

—

Cluster B: Freelancer, 1099 & Creator Finance (Phase 2)

Tool Slug

Target Keywords (Tier-1)

Core Formula & Inputs

pSEO Variation Strategy

Reference

stripe-fee-calculator

stripe fee calculator, how much to charge to cover stripe fees

Domestic: 2.9% + $0.30; Intl: +1.5%; FX: +1.0%; Gross-up: (Target + 0.30) / (1 - Rate)

Currency & transaction type pages (USD, GBP, EUR, ACH)

Jupid

stripe-vs-paypal-fee-calculator

stripe vs paypal fees, paypal vs stripe fee calculator

Side-by-side net payout & gross-up comparison

Domestic vs. cross-border comparison presets

—

freelance-hourly-rate-calculator

freelance hourly rate calculator, consulting day rate calculator

(Target Income + Expenses + Taxes) / (Billable Hours/Wk × Working Weeks)

Top 10 freelance roles (developer, designer, copywriter)

TallyCrunch

upwork-vs-fiverr-fee-calculator

upwork fee calculator 2026, upwork vs fiverr fee calculator

Fiverr: 20% seller fee; Upwork: 0–15% variable contract fee + Connects cost

Contract tier breakdowns ($100, $500, $1,000, $5,000)

Workspace369

1099-quarterly-tax-calculator

1099 tax calculator, self employment quarterly tax estimator

Net 1099 Income × 92.35% × 15.3% SE tax + Federal/State bracket estimate

Top 10 US states first (CA, TX, NY, FL, etc.), then expand to 50

Upwork

youtube-sponsorship-calculator

youtube sponsorship rate calculator, brand deal pricing calculator

(Avg Views / 1,000) × Niche CPM + Usage Rights & Exclusivity Multipliers

Niche CPM pages (finance, tech, gaming, lifestyle)

CreatiCalc

podcast-sponsorship-calculator

podcast sponsorship calculator, podcast cpm calculator

(Downloads / 1,000) × CPM ($25–$40 host-read; $15–$30 prerecorded)

Ad placement pages (pre-roll, mid-roll, post-roll)

LetsMakeAPodcast

Cluster C: SaaS, AI & High-CPC Asset Calculators (Phase 3)

Tool Slug

Target Keywords (Tier-1)

Core Formula & Inputs

pSEO Variation Strategy

Reference

saas-ltv-cac-calculator

saas ltv to cac calculator, saas churn impact calculator

LTV = (ARPA × Gross Margin) / Churn Rate; Payback = CAC / (ARPA × Margin)

Churn sensitivity & B2B benchmark pages

WZRD

break-even-roas-calculator

break even roas calculator, mer marketing efficiency ratio calculator

Break-Even ROAS = 1 / Gross Profit Margin %; MER = Total Rev / Total Ad Spend

Channel presets (Meta Ads, Google Ads, TikTok Ads)

GrowwithBA

ai-api-cost-calculator

ai api cost calculator, llm token cost calculator

((Input × InPrice × (1 - CacheShare)) + (CachedIn × CachePrice) + (Output × OutPrice)) / 1M

Model comparison pages (GPT, Claude, Gemini tiers)

We.inc

airbnb-roi-calculator

airbnb roi calculator, short term rental cash flow calculator

(Nightly Rate × Occupancy × 30) − (Mortgage + Cleaning + Platform Fee + Utilities)

Cash-on-cash return & occupancy stress-test presets

Simple Finance Calculators

ev-charging-cost-calculator

ev charging cost calculator, ev vs gas cost calculator

Grid kWh = Battery Added / Efficiency; Cost = Grid kWh × Utility Rate

Home AC vs. Public DC Fast Charger & Petrol comparison

Talha Aslan

5. Supporting Content & AdSense-Safe Page Layout

Google AdSense has no official minimum post count, but rejects thin tool-only sites for "low value content" (TheGuideX). Solve this with two layers:

Layer 1: Supporting Pillar Blog Guides (/guides/[slug])

Publish 3–4 in-depth guides per cluster linking directly to the calculators and embedding interactive mini-widgets:

How to Calculate Etsy Fees in 2026 (Complete Seller Breakdown)

Etsy vs. Shopify vs. TikTok Shop: Which Platform Leaves Higher Margins?

Print-on-Demand Pricing Strategy: Avoiding Hidden Offsite Ads Losses

How to Pass Payment Processing Fees to Clients Without Losing Deals

Layer 2: 7-Section Mobile-First Tool Page (/tools/[slug])

H1 Title, "Last Updated" Trust Badge & 2-Sentence Value Summary: Primary keyword + fee update date from fee-presets.ts.

Mobile-First Interactive Calculator Card (Above the Fold): Large touch targets, inputMode="decimal", sticky mobile result bar, "Copy Shareable Result" (URL query-param state), "Print / Save PDF Summary", and "Copy Embed Code" (<iframe>).

Ad Slot 1 (Below Calculator Output): Fixed-height container (min-h-[90px] mobile / min-h-[250px] desktop) to prevent CLS (CLS < 0.05).

Formula & Methodology Section: Exact mathematical formula and fee assumptions explained clearly.

Worked Example Table: 2–3 realistic scenarios with exact numbers.

FAQ Accordion + JSON-LD Schema: 4–6 targeted long-tail questions.

Related Calculators & Guides Internal Links: Cross-link sibling tools and supporting guides.

6. 2026 Monetization & Growth Stack

Phase 1 (Launch — Month 1+): Google AdSense (no minimum traffic requirement; requires clean navigation, Privacy Policy, and original editorial context per TheGuideX) + Contextual Affiliate Links (Shopify, Wise, QuickBooks, Printify) inside <AffiliateCallout rel="sponsored noopener noreferrer" />.

Phase 2 (1,000+ Monthly Tier-1 Sessions & 4+ Months Domain Age): Journey by Mediavine — as of 2026, Journey lowered its threshold to 1,000 monthly Tier-1 sessions (requires Grow installed and ~4 months of domain history), making it the fastest high-RPM upgrade path over AdSense (Mediavine, Productive Blogging). (Note: Ezoic now requires 250,000+ monthly active users since February 2026, making it unsuitable for new sites per Outrank.)

Phase 3 ($5,000+ Annual Ad Revenue / 25K+ Pageviews): Automatic upgrade path to Mediavine Official (Jupiter) or Raptive + optional email-gated PDF/CSV export lead magnets.

Quarterly Fee Audit: Review fee-presets.ts every quarter and update lastUpdated dates to keep rankings fresh.

7. Antigravity Execution Prompt (v2)

Paste this into Antigravity's Planning Mode with antigravity_tools_website_guide.md attached:

"Read antigravity_tools_website_guide.md and generate a phased BUILD_PLAN.md before writing code. Include: (1) Next.js App Router + TypeScript + Tailwind SSG architecture with Vitest unit tests and GA4 @next/third-parties/google custom event tracking; (2) Pure formula functions in src/lib/formulas/ for Cluster A single calculators plus etsy-vs-shopify-vs-tiktok-shop-calculator, using Top-10 pSEO presets and lastUpdated badges; (3) Supporting /guides/[slug] pillar articles and the 7-section mobile-first /tools/[slug] layout with SoftwareApplication + FAQPage JSON-LD; (4) /embed/[slug] iframe widget route, Copy Shareable Result, and Print PDF summary; (5) CLS-safe <AdSlot />, <AffiliateCallout />, Grow/AdSense readiness, and mandatory trust pages (/about, /contact, /privacy-policy, /terms)."