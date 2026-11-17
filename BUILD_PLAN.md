# BUILD_PLAN.md — High-CPC Niche Tools & Calculator Website

> **Source of Truth:** `antigravity_tools_website_guide.md` (v2)
> **Generated:** 2026-11-17 | **Last Modified:** 2026-11-17
> **Status:** Pre-implementation — no application code has been written.
> **Philosophy:** MVP-first → ship 1 calculator + 1 guide live by Week 2, iterate with real data.

---

## Table of Contents

0. [Milestone 0 — Pre-Build Strategy & Domain](#milestone-0--pre-build-strategy--domain)
1. [Milestone 1 — Architecture, Analytics & Testing Setup](#milestone-1--architecture-analytics--testing-setup)
2. [Milestone 2 — MVP Launch: First Calculator + Blog-First Content](#milestone-2--mvp-launch-first-calculator--blog-first-content)
3. [Milestone 3 — Cluster A Expansion, Comparison Tools & pSEO Data](#milestone-3--cluster-a-expansion-comparison-tools--pseo-data)
4. [Milestone 4 — Full Content Layer & AdSense-Safe Page Architecture](#milestone-4--full-content-layer--adsense-safe-page-architecture)
5. [Milestone 5 — Mobile-First Differentiation & Embeddable Widgets](#milestone-5--mobile-first-differentiation--embeddable-widgets)
6. [Milestone 6 — 2026 AdSense-to-Journey Monetization Stack](#milestone-6--2026-adsense-to-journey-monetization-stack)
7. [Milestone 7 — Verification & Deployment Checklist](#milestone-7--verification--deployment-checklist)
8. [Milestone 8 — Post-Launch Growth Engine (Ongoing)](#milestone-8--post-launch-growth-engine-ongoing)
9. [Appendix A — Full File Tree](#appendix-a--full-file-tree)
10. [Appendix B — Cluster Tool Registry Quick Reference](#appendix-b--cluster-tool-registry-quick-reference)
11. [Appendix C — Competitor Gap Analysis Matrix](#appendix-c--competitor-gap-analysis-matrix)

---

## Milestone 0 — Pre-Build Strategy & Domain

**Goal:** Lock down domain, complete competitor gap research, and validate niche positioning — all before writing a single line of code.

**Timeline:** Day 1–2 (before any coding starts)

### 0.1 — Domain Name Selection

| Priority | Style | Examples | Notes |
|----------|-------|----------|-------|
| 🥇 1st | Short brandable `.com` (5–8 chars) | `FeeSnap.com`, `CalcHive.com`, `SellerCalc.com` | Memorable, scalable beyond calculators |
| 🥈 2nd | Niche-hint `.com` | `SellerFees.com`, `FeeCheck.com` | Keyword signal + brand |
| 🥉 3rd | `.io` / `.co` brandable | `sellermath.io`, `feesnap.io` | Acceptable for tool sites |
| ❌ Avoid | Long/generic | `onlinetoolscalculatorhub.com` | Looks spammy, hurts trust |

**Action items:**
- [ ] Check availability on Namecheap / Porkbun (budget: $8–15/year)
- [ ] Buy domain **before coding** — good names disappear fast
- [ ] Point DNS to Vercel immediately (even with a "Coming Soon" page)
- [ ] Verify domain in Google Search Console on Day 1 (starts building domain history for Journey by Mediavine's 4-month requirement)

### 0.2 — Competitor Gap Analysis

Systematically audit the top 3 competitors for each Cluster A calculator. Document what they're missing — these gaps become your differentiation features.

**Research checklist per competitor:**

| Feature | SEO Ninja (Etsy) | PODPriceCheck | SellersNest (TikTok) | Ecom Beacon (Shopify) | **Your Site** |
|---------|-------------------|---------------|----------------------|-----------------------|---------------|
| Mobile-optimized UI | ❌ | 🟡 Partial | ❌ | 🟡 Partial | ✅ |
| Shareable result URL | ❌ | ❌ | ❌ | ❌ | ✅ |
| PDF / Print export | ❌ | ❌ | ❌ | ❌ | ✅ |
| Embeddable widget | ❌ | ❌ | ❌ | ❌ | ✅ |
| Side-by-side comparison | ❌ | ❌ | ❌ | ❌ | ✅ |
| "Last updated" trust badge | ❌ | ✅ | ❌ | ❌ | ✅ |
| Supporting blog guides | ❌ | ❌ | ❌ | 🟡 Minimal | ✅ |
| FAQ + JSON-LD schema | ❌ | ❌ | ❌ | ❌ | ✅ |
| Fee update email alerts | ❌ | ❌ | ❌ | ❌ | ✅ |

> **Action:** Before coding, visit each competitor URL in the guide, fill this table with real data, and save it as `competitor-analysis.md` in the project root. Every ✅ you ship that competitors don't have is a **ranking + conversion advantage**.

### 0.3 — Content Calendar Skeleton

Plan the first 4 weeks of content before writing code. This ensures the blog-first strategy has direction:

| Week | Publish | Type | Purpose |
|------|---------|------|---------|
| Week 1 | Trust pages (About, Contact, Privacy, Terms) | Static | AdSense prerequisites |
| Week 2 | "How to Calculate Etsy Fees in 2026" guide + Etsy Fee Calculator | Guide + Tool | First indexed content + first tool |
| Week 2 | AdSense application submitted | — | Start monetization clock |
| Week 3 | "POD Pricing Strategy" guide + POD Profit Calculator | Guide + Tool | 2nd tool live |
| Week 3 | "Etsy vs Shopify vs TikTok Shop" guide | Guide | High-intent comparison content |
| Week 4 | TikTok Shop + Shopify calculators + Comparison tool | Tools | Complete Cluster A |

### Milestone 0 — Acceptance Criteria

| # | Criterion | Verification |
|---|-----------|-------------|
| 0A | Domain purchased and DNS pointed to Vercel | `dig yourdomain.com` resolves |
| 0B | Google Search Console property verified for the domain | GSC dashboard shows verified |
| 0C | `competitor-analysis.md` completed with real data for all 4 competitor tools | File exists with no "TODO" placeholders |
| 0D | 4-week content calendar documented | Calendar exists in this plan or separate file |

---

## Milestone 1 — Architecture, Analytics & Testing Setup

**Goal:** A building-ready Next.js monorepo with every folder, config, linting rule, analytics plumbing, email capture utility, and testing harness in place — producing a green `npm run build` with zero application pages.

**Timeline:** Day 2–3

### 1.1 — Initialize Next.js Project

| Item | Detail |
|------|--------|
| Command | `npx create-next-app@latest tools-hub --app --ts --tailwind --eslint --src-dir --import-alias "@/*"` |
| Node | >= 20 LTS |
| Package manager | npm (lock committed) |
| Tailwind | v4 (ships with `create-next-app` as of late 2025) |
| `next.config.ts` | `images.unoptimized: true` for Vercel free-tier. SSG via `generateStaticParams` per route (not `output: "export"`). |

**Files created / modified:**

```
next.config.ts
tsconfig.json
tailwind.config.ts         # extend theme: brand colors, typography scale
postcss.config.mjs
.eslintrc.json              # extends next/core-web-vitals, next/typescript
.prettierrc                 # singleQuote, trailingComma
```

### 1.2 — Directory Structure Scaffold

Create every directory and placeholder `index.ts` / barrel file, **no application logic yet:**

```
src/
├── app/
│   ├── layout.tsx                   # Shell: <html>, fonts, GA4 Script, nav, footer
│   ├── page.tsx                     # Placeholder homepage
│   ├── tools/[slug]/page.tsx        # Placeholder (SSG)
│   ├── guides/[slug]/page.tsx       # Placeholder (SSG)
│   ├── embed/[slug]/page.tsx        # Placeholder (SSG, stripped layout)
│   ├── about/page.tsx               # Placeholder trust page
│   ├── contact/page.tsx             # Placeholder trust page
│   ├── privacy-policy/page.tsx      # Placeholder trust page
│   ├── terms/page.tsx               # Placeholder trust page
│   ├── robots.ts                    # Robots.txt generation
│   └── sitemap.ts                   # Dynamic XML sitemap
├── components/
│   ├── calculators/                 # Empty — built in M2/M3
│   ├── layout/
│   │   ├── Header.tsx               # Placeholder
│   │   ├── Footer.tsx               # Placeholder
│   │   ├── Breadcrumbs.tsx          # Placeholder
│   │   ├── AdSlot.tsx               # Placeholder
│   │   ├── AffiliateCallout.tsx     # Placeholder
│   │   └── EmailCapture.tsx         # Placeholder (email signup component)
│   └── seo/
│       ├── JsonLd.tsx               # Placeholder (SoftwareApplication + FAQPage + HowTo)
│       ├── FormulaBreakdown.tsx     # Placeholder
│       ├── WorkedExample.tsx        # Placeholder
│       └── FAQAccordion.tsx         # Placeholder
├── content/
│   └── guides/                      # Empty — MDX guides in M2/M4
├── data/
│   ├── tools-registry.ts            # Type definitions + empty array
│   └── fee-presets.ts               # Type definitions + empty array
├── lib/
│   ├── analytics.ts                 # GA4 trackEvent() helper
│   ├── utils.ts                     # cn(), formatCurrency(), formatDate()
│   └── formulas/                    # Empty — pure functions in M2
└── tests/
    ├── setup.ts                     # @testing-library/jest-dom/vitest
    └── formulas/                    # Empty — Vitest tests in M2
```

### 1.3 — Vitest + React Testing Library Setup

| Item | Detail |
|------|--------|
| Install | `npm i -D vitest @testing-library/react @testing-library/jest-dom @vitejs/plugin-react jsdom @vitest/coverage-v8` |
| Config file | `vitest.config.ts` at repo root |
| Environment | `jsdom` for component tests; `node` for pure formula tests |
| Coverage | threshold ≥ 90% for `src/lib/formulas/` |
| Scripts | `"test": "vitest run"`, `"test:watch": "vitest"`, `"test:coverage": "vitest run --coverage"` |

**`vitest.config.ts`:**
```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/tests/setup.ts"],
    include: ["src/tests/**/*.test.ts", "src/tests/**/*.test.tsx"],
    coverage: {
      provider: "v8",
      include: ["src/lib/formulas/**"],
      thresholds: { statements: 90, branches: 90, functions: 90, lines: 90 },
    },
  },
});
```

**`src/tests/setup.ts`:**
```ts
import "@testing-library/jest-dom/vitest";
```

### 1.4 — Google Analytics 4 Integration

| Item | Detail |
|------|--------|
| Package | `@next/third-parties` (ships with Next.js) |
| GA ID | Stored in `NEXT_PUBLIC_GA_ID` env var |
| Script location | `<GoogleAnalytics gaId={...} />` in `src/app/layout.tsx` |

**`src/lib/analytics.ts` — Typed event helper:**

```ts
type GAEvent =
  | { name: "calculator_used"; params: { tool_slug: string; preset?: string } }
  | { name: "result_copied"; params: { tool_slug: string; method: "clipboard" | "url" | "print" } }
  | { name: "affiliate_clicked"; params: { tool_slug: string; partner: string; url: string } }
  | { name: "embed_copied"; params: { tool_slug: string } }
  | { name: "email_signup"; params: { source: string; tool_slug?: string } }
  | { name: "guide_read"; params: { guide_slug: string; scroll_depth: number } };

export function trackEvent(event: GAEvent): void {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", event.name, event.params);
  }
}
```

> **Note:** `email_signup` and `guide_read` events added for email capture and content engagement tracking.

### 1.5 — TypeScript Interface Definitions

**`src/data/tools-registry.ts` — Interfaces only (data populated in M2):**

```ts
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
  text: string;
  image?: string;
}

export interface GuideMeta {
  slug: string;
  title: string;
  description: string;
  relatedTools: string[];         // tool slugs
  publishedAt: string;            // ISO 8601
  updatedAt: string;              // ISO 8601
  estimatedReadMinutes: number;
}

export interface ToolConfig {
  slug: string;
  title: string;
  shortDescription: string;       // 2-sentence value summary
  cluster: "A" | "B" | "C";
  phase: 1 | 2 | 3;
  targetKeywords: string[];
  formulaMarkdown: string;        // human-readable formula string
  formulaFn: string;              // key into src/lib/formulas/ map
  pSEOPresets: string[];          // top-10 preset slugs for Phase 1
  workedExamples: WorkedExample[];
  howToSteps: HowToStep[];        // for HowTo JSON-LD schema
  faqs: FAQItem[];
  relatedTools: string[];         // sibling tool slugs
  relatedGuides: string[];        // guide slugs
  affiliatePartner?: string;      // e.g. "shopify", "wise", "quickbooks"
  affiliateUrl?: string;
  affiliateCta?: string;          // e.g. "Start your Shopify free trial"
  lastUpdated: string;            // ISO 8601 — rendered as trust badge
  isComparison: boolean;
  dataSnippet?: string;           // auto-generated comparison sentence for social/SEO
}

export interface ComparisonPreset {
  slug: string;
  label: string;
  platforms: string[];
  defaultInputs: Record<string, number>;
}
```

**`src/data/fee-presets.ts` — Interfaces only:**

```ts
export interface FeePreset {
  platform: string;
  country: string;
  currency: string;
  currencySymbol: string;
  fees: Record<string, number>;   // e.g. { listingFee: 0.20, transactionPct: 6.5 }
  lastUpdated: string;            // ISO 8601
}
```

### Milestone 1 — Acceptance Criteria

| # | Criterion | Verification |
|---|-----------|-------------|
| 1A | `npm run build` completes with zero errors, zero warnings | `npm run build` exit code 0 |
| 1B | `npm run lint` passes | Exit code 0 |
| 1C | `npm run test` passes (placeholder test `src/tests/formulas/smoke.test.ts` with `expect(true).toBe(true)`) | Exit code 0 |
| 1D | All directories from §1.2 exist | `find src -type d` matches the tree |
| 1E | GA4 `<GoogleAnalytics>` tag renders in `<head>` on `localhost:3000` | View page source, search `googletagmanager` |
| 1F | `trackEvent()` compiles with no TS errors; calling with an invalid event name produces a type error | `tsc --noEmit` |
| 1G | `tools-registry.ts` exports `ToolConfig`, `FAQItem`, `WorkedExample`, `GuideMeta`, `ComparisonPreset`, `HowToStep` types | `tsc --noEmit` |
| 1H | `fee-presets.ts` exports `FeePreset` type | `tsc --noEmit` |

---

## Milestone 2 — MVP Launch: First Calculator + Blog-First Content

**Goal:** Ship the **absolute minimum viable product** live on Vercel: 1 fully-working calculator (Etsy Fee Calculator), 1 supporting blog guide, 4 trust pages with real content, and AdSense application submitted. Google indexing begins immediately.

**Timeline:** Day 3–14 (end of Week 2 = **site is LIVE**)

> **Why MVP-first?** Google takes 2–4 weeks to index a new site. Every day you delay launch is a day of lost indexing time. Ship one calculator perfectly, prove the model, iterate with real Search Console data.

### 2.1 — Trust Pages (Real Content, Not Placeholder)

Write and publish all 4 trust pages with **real, non-placeholder content** (minimum 300 words each). These are mandatory for AdSense approval.

| Page | Route | Content Requirements |
|------|-------|----------------------|
| About | `src/app/about/page.tsx` | Site mission ("Free, accurate fee calculators for online sellers"), creator/team info, E-E-A-T signals (why you built this), link to Contact |
| Contact | `src/app/contact/page.tsx` | Contact form (or email address), response time expectation, optional physical location |
| Privacy Policy | `src/app/privacy-policy/page.tsx` | GDPR/CCPA compliant, explicitly mentions GA4 data collection, AdSense ad personalization, email list data handling, cookie policy |
| Terms of Service | `src/app/terms/page.tsx` | Standard terms, **calculator disclaimer** ("Results are estimates. Not financial/tax advice. Verify with platform's official fee schedule."), limitation of liability |

### 2.2 — First Formula Function: Etsy Fees

**`src/lib/formulas/etsy-fees.ts`:**

```ts
export interface EtsyInput {
  itemPrice: number;
  shippingCharge: number;
  quantity: number;
  country: string;              // ISO country code for payment processing rate
  offsiteAdsOptIn: boolean;
  offsiteAdsRate: 0.12 | 0.15;  // 12% (>$10K revenue) or 15% (default)
}

export interface EtsyFeeBreakdown {
  label: string;
  amount: number;
  rate?: string;                // human-readable rate (e.g. "6.5%")
}

export interface EtsyResult {
  grossRevenue: number;
  totalFees: number;
  netProfit: number;
  effectiveFeePct: number;
  breakdown: EtsyFeeBreakdown[];
  dataSnippet: string;          // auto-generated comparison sentence
}
```

**Core formula logic:**
- Listing fee: $0.20 × quantity
- Transaction fee: 6.5% of (item price + shipping)
- Payment processing: 3% + $0.25 (varies by country via `FeePreset`)
- Regulatory operating fee: 0.65% of item price  
- Offsite Ads: optional 12–15% of item price
- **`dataSnippet` auto-generation:** `"Selling a $29.99 item on Etsy costs $5.42 in fees (18.1%), leaving you $24.57 net profit."`

**Edge-case handling:**
- `itemPrice <= 0` → return zeroed result, no errors
- `shippingCharge < 0` → clamp to 0
- `quantity <= 0` → clamp to 1
- All monetary values rounded to 2 decimal places

### 2.3 — Etsy Fee Calculator Unit Tests

**`src/tests/formulas/etsy-fees.test.ts`:**

| # | Test Case | Expected Behavior |
|---|-----------|-------------------|
| 1 | Standard US sale: $29.99 item, $5 shipping, no offsite ads | Correct total fees, net profit, breakdown |
| 2 | With offsite ads 15% | Offsite ads line item added, total fees increase |
| 3 | With offsite ads 12% ($10K+ seller) | Lower offsite ads rate applied |
| 4 | Zero price | All fees = $0.20 listing only, net profit = -$0.20 |
| 5 | Non-US country preset (DE) | Different payment processing rate from `FeePreset` |
| 6 | Very high price ($10,000) | No overflow, correct percentage calculations |
| 7 | Multiple quantity (qty = 5) | Listing fee × 5, all other fees calculated on per-unit then multiplied |
| 8 | Negative shipping | Clamped to $0 |
| 9 | `dataSnippet` generation | Returns grammatically correct sentence with accurate numbers |

### 2.4 — First Blog Guide: "How to Calculate Etsy Fees in 2026"

**File:** `src/content/guides/how-to-calculate-etsy-fees-2026.mdx`
**Route:** `src/app/guides/[slug]/page.tsx`

**Content structure (1,500–2,500 words):**

1. **H1:** "How to Calculate Etsy Fees in 2026 (Complete Seller Breakdown)"
2. **Intro paragraph** — hook with a surprising stat ("Etsy takes 18-25% of your sale price in total fees")
3. **Table of contents** (auto-generated)
4. **Section: Every Etsy Fee Explained** — listing fee, transaction fee, payment processing, regulatory fee, offsite ads
5. **Embedded mini-calculator** — interactive Etsy fee widget inline
6. **Section: Worked Example** — $29.99 handmade item walkthrough with exact numbers
7. **Section: How to Reduce Etsy Fees** — practical tips (opt out of offsite ads if eligible, pricing strategy)
8. **Section: Etsy Fees vs Other Platforms** — brief comparison with links to comparison calculator (when built)
9. **FAQ section** — 4-6 questions with `FAQPage` JSON-LD
10. **CTA:** Link to full Etsy Fee Calculator + email signup for fee update alerts
11. **Internal links:** Related tools + related guides

**SEO metadata:**
- `generateMetadata()` with unique title, description, canonical
- `Article` JSON-LD schema
- `FAQPage` JSON-LD schema

### 2.5 — Etsy Fee Calculator Tool Page (7-Section Layout)

**Route:** `src/app/tools/[slug]/page.tsx` (renders `etsy-fee-calculator` + its top-10 pSEO country variants)

The 7 sections as specified in the guide — full implementation for this one calculator:

1. **H1 + "Last Updated" Trust Badge + 2-Sentence Summary**
2. **Interactive Calculator Card** (mobile-first, `inputMode="decimal"`, instant recalculation)
3. **Ad Slot 1** (`<AdSlot position="below-calculator" />`)
4. **Formula & Methodology** (`<FormulaBreakdown />`)
5. **Worked Example Table** (`<WorkedExample />`)
6. **FAQ Accordion + JSON-LD** (`<FAQAccordion />`)
7. **Related Calculators & Guides** (links to guide, placeholder links for upcoming tools)

**JSON-LD schemas on this page:**
- `SoftwareApplication` (with `"price": "0"` for "Free" badge in search)
- `FAQPage`
- `HowTo` (steps for using the calculator — earns rich snippets)

**`HowTo` JSON-LD structure:**
```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Calculate Your Etsy Seller Fees",
  "step": [
    {
      "@type": "HowToStep",
      "name": "Enter your item price",
      "text": "Type the selling price of your Etsy listing in USD or your local currency."
    },
    {
      "@type": "HowToStep",
      "name": "Add shipping charge",
      "text": "Enter the shipping amount you charge buyers. Enter 0 for free shipping."
    },
    {
      "@type": "HowToStep",
      "name": "Select your country",
      "text": "Choose your Etsy Payments country to apply the correct payment processing rate."
    },
    {
      "@type": "HowToStep",
      "name": "Toggle Offsite Ads",
      "text": "If enrolled in Etsy Offsite Ads, enable and select your rate (12% or 15%)."
    },
    {
      "@type": "HowToStep",
      "name": "Review your fee breakdown",
      "text": "See your total fees, net profit, and effective fee percentage instantly."
    }
  ]
}
```

### 2.6 — Populate MVP Data

**`tools-registry.ts`** — Add 1 `ToolConfig` entry for `etsy-fee-calculator`:
- `pSEOPresets`: Top 10 countries → `["us", "uk", "ca", "au", "de", "fr", "nl", "it", "es", "in"]`
- `workedExamples`: 3 scenarios (low-price $14.99, mid-price $29.99, high-price $89.99)
- `howToSteps`: 5 steps (as above)
- `faqs`: 6 questions
- `relatedGuides`: `["how-to-calculate-etsy-fees-2026"]`
- `dataSnippet`: Auto-generated from default example

**`fee-presets.ts`** — Add Etsy `FeePreset` entries for 10 countries with correct payment processing rates and `lastUpdated: "2026-11-01"`.

**`tools-registry.ts`** — Add 1 `GuideMeta` entry for the blog guide.

### 2.7 — Homepage, Sitemap, Robots

**Homepage (`src/app/page.tsx`):**
- Site title + tagline ("Free, accurate fee calculators for online sellers")
- Category cards (Cluster A highlighted, B/C shown as "Coming Soon")
- Featured calculator: Etsy Fee Calculator with direct link
- Email signup: "Get notified when we add new calculators"
- `WebSite` + `Organization` JSON-LD

**`src/app/sitemap.ts`** — Generates sitemap for all published routes.

**`src/app/robots.ts`** — Allows all crawlers, blocks `/embed/`, includes sitemap URL.

### 2.8 — Email Capture Component

**`src/components/layout/EmailCapture.tsx`:**

A lightweight, non-intrusive email signup component used in 3 places:

| Placement | Trigger | Offer |
|-----------|---------|-------|
| Below calculator result | After first calculation | "Get your full breakdown as PDF + fee update alerts" |
| End of blog guide | After reading guide | "Get our 2026 Fee Comparison Cheatsheet (free)" |
| Homepage | On page load | "Be first to know when we add new calculators" |

**Tech stack:** 
- Free tier: ConvertKit (1K subscribers free) or Buttondown (100 subscribers free)
- Simple `<form>` POST to provider's API endpoint
- No complex setup needed — just email field + submit button
- GA4 event: `email_signup { source: "calculator-result" | "guide-footer" | "homepage" }`

```tsx
interface EmailCaptureProps {
  source: "calculator-result" | "guide-footer" | "homepage";
  toolSlug?: string;
  headline: string;
  description: string;
  buttonText?: string;
}

export function EmailCapture({ source, toolSlug, headline, description, buttonText = "Subscribe" }: EmailCaptureProps) {
  // Form submission → provider API + trackEvent({ name: "email_signup", params: { source, tool_slug: toolSlug } })
}
```

### 2.9 — Deploy MVP to Vercel

| Step | Detail |
|------|--------|
| 1 | `git init && git add . && git commit -m "MVP: Etsy Fee Calculator + guide + trust pages"` |
| 2 | Push to GitHub |
| 3 | Import to Vercel, set env vars (`NEXT_PUBLIC_GA_ID`) |
| 4 | Verify production site loads |
| 5 | Submit sitemap to Google Search Console |
| 6 | **Apply for Google AdSense** (trust pages + guide + calculator = sufficient editorial content) |
| 7 | Install Grow by Mediavine (free, no threshold — starts 4-month domain history clock for Journey) |

### Milestone 2 — Acceptance Criteria

| # | Criterion | Verification |
|---|-----------|-------------|
| 2A | Site is **live** on Vercel with custom domain | `curl https://yourdomain.com` returns 200 |
| 2B | Etsy Fee Calculator renders correctly and calculates instantly on input change | Manual test |
| 2C | All 10 country pSEO variants render at `/tools/etsy-fee-calculator-us`, `-uk`, etc. | Build log shows 11 tool routes |
| 2D | "How to Calculate Etsy Fees" guide is published at `/guides/how-to-calculate-etsy-fees-2026` | `curl` returns 200 |
| 2E | Guide embeds interactive mini-calculator | Visual inspection |
| 2F | All 4 trust pages have real content (≥ 300 words each) | Word count check |
| 2G | `npm run test` passes all Etsy formula tests with ≥ 90% branch coverage | `npm run test:coverage` |
| 2H | Edge cases (zero price, negative shipping, high price) all handled without `NaN`/`Infinity` | Test assertions |
| 2I | `SoftwareApplication` + `FAQPage` + `HowTo` JSON-LD validate on Rich Results Test | Manual Google validation |
| 2J | Sitemap at `/sitemap.xml` lists all published routes | `curl` and verify |
| 2K | Google Search Console property verified, sitemap submitted | GSC dashboard |
| 2L | AdSense application submitted | AdSense dashboard shows "Under review" |
| 2M | Grow by Mediavine installed | Grow dashboard shows site connected |
| 2N | "Last updated" trust badge visible on calculator page | Visual inspection |
| 2O | Email capture component renders in all 3 placements | Visual inspection |
| 2P | `dataSnippet` auto-generated sentence is accurate and grammatically correct | Manual review |

---

## Milestone 3 — Cluster A Expansion, Comparison Tools & pSEO Data

**Goal:** Expand from 1 calculator to all 6 Cluster A tools (4 single + 2 comparison), all with tested formulas, top-10 pSEO presets, and data-driven comparison snippets.

**Timeline:** Week 3–4

### 3.1 — Remaining Single Calculator Formulas

| File | Function | Key Logic |
|------|----------|-----------|
| `src/lib/formulas/pod-profit.ts` | `calculatePodProfit(input): PodResult` | `retailPrice − (basePrintCost + shipping + marketplaceFee + adSpend)`. Product-type preset modifies `basePrintCost`. |
| `src/lib/formulas/tiktok-fees.ts` | `calculateTikTokFees(input): TikTokResult` | `salePrice − (categoryReferralPct + affiliateCommPct + shipping + cogs)`. Category preset modifies referral %. |
| `src/lib/formulas/shopify-profit.ts` | `calculateShopifyProfit(input): ShopifyResult` | `revenue − (cogs + paymentFee + shipping + adSpend)`. Break-even ROAS = `1 / grossMargin`. Gateway toggle changes payment fee. |

Each `Result` type returns:
```ts
{
  netProfit: number;
  totalFees: number;
  effectiveFeePct: number;
  breakdown: { label: string; amount: number; rate?: string }[];
  dataSnippet: string;   // auto-generated sentence for social/SEO
}
```

### 3.2 — Comparison Calculator Formulas

| File | Function | Key Logic |
|------|----------|-----------|
| `src/lib/formulas/platform-comparison.ts` | `compareMarketplaces(input): ComparisonResult[]` | Calls `calculateEtsyFees`, `calculateShopifyProfit`, `calculateTikTokFees` with normalized inputs; returns side-by-side `{platform, netProfit, effectiveFeePct, breakEvenPrice}`. |
| `src/lib/formulas/stripe-vs-paypal.ts` | `comparePaymentProcessors(input): PaymentCompResult[]` | Stripe: `2.9% + $0.30` domestic, `+1.5%` intl, `+1%` FX. PayPal: comparable tiers. Gross-up: `(target + fixedFee) / (1 − ratePct)`. |

### 3.3 — Data-Driven Content: Auto-Generated Comparison Snippets

Each formula's `Result` includes a `dataSnippet` string — a factual, data-rich sentence auto-generated from the calculation. These snippets power:

1. **SEO meta descriptions** — unique, number-rich descriptions per pSEO page
2. **Social sharing** — the text that appears when someone shares a result URL
3. **Blog guide embeds** — auto-updated stats inside guide articles
4. **Email alerts** — "Etsy fees just changed: selling a $29.99 item now costs $5.67 instead of $5.42"

**Examples:**
```
"Selling a $29.99 item on Etsy costs $5.42 in fees (18.1%), while Shopify costs $3.87 (12.9%) — saving you $1.55 per sale."

"A $500 freelance invoice processed through Stripe costs $14.80 in fees vs. $15.20 on PayPal — Stripe saves you $0.40."

"TikTok Shop's Beauty category charges 8% referral fee on a $24.99 product, costing $2.00 — lower than Etsy's effective 18.1%."
```

This is **original, factual data** that Google treats as first-party research — a strong E-E-A-T signal that competitors don't have.

### 3.4 — Unit Tests for All New Formulas

| Test File | Required Test Cases (minimum) |
|-----------|-------------------------------|
| `src/tests/formulas/pod-profit.test.ts` | (1) T-shirt standard, (2) Mug preset, (3) Negative margin (retail < cost), (4) Zero ad spend, (5) High quantity |
| `src/tests/formulas/tiktok-fees.test.ts` | (1) Beauty category, (2) Electronics (higher referral), (3) Zero COGS, (4) With affiliate commission, (5) Negative input guard |
| `src/tests/formulas/shopify-profit.test.ts` | (1) Shopify Payments, (2) Stripe gateway, (3) PayPal gateway, (4) Break-even ROAS, (5) 100% margin edge, (6) Zero revenue |
| `src/tests/formulas/platform-comparison.test.ts` | (1) Same product across all 3, (2) High-price item, (3) Low-price item with negative margin on one platform, (4) `dataSnippet` accuracy |
| `src/tests/formulas/stripe-vs-paypal.test.ts` | (1) Domestic USD, (2) International GBP→USD, (3) Gross-up correctness, (4) Zero amount, (5) ACH vs card |

### 3.5 — Populate Full Cluster A Data

**`tools-registry.ts`** — Add remaining 5 `ToolConfig` entries (3 single + 2 comparison):

Each entry includes:
- `pSEOPresets`: **exactly 10** top presets
- `workedExamples`: 2–3 `WorkedExample` objects
- `howToSteps`: 4–6 `HowToStep` objects for HowTo JSON-LD
- `faqs`: 4–6 `FAQItem` objects
- `relatedTools` and `relatedGuides` slugs cross-linked
- `lastUpdated` ISO date
- `isComparison: true` for comparison tools
- `dataSnippet` for default example
- `affiliatePartner` / `affiliateUrl` / `affiliateCta` where applicable

**`fee-presets.ts`** — Add all remaining presets:

| Platform | Phase 1 Presets (Top 10) |
|----------|-------------------------|
| Etsy | (already done in M2) |
| POD (product types) | t-shirts, hoodies, mugs, totes, posters, phone-cases, stickers, canvas, pillows, ornaments |
| TikTok Shop (categories) | beauty, apparel, electronics, home-garden, health, toys, sports, food, pets, accessories |
| Shopify (gateways) | shopify-payments, stripe, paypal, square, authorize-net, 2checkout, klarna, afterpay, worldpay, adyen |
| Stripe (currencies) | USD, GBP, EUR, CAD, AUD, JPY, CHF, SGD, HKD, MXN |
| PayPal (currencies) | Same as Stripe top 10 |

### 3.6 — Zero-Code pSEO Expansion Architecture

The `generateStaticParams()` function reads from the registry — adding new presets requires **only data changes**, no code changes:

```ts
export async function generateStaticParams() {
  return TOOLS.flatMap((tool) => [
    { slug: tool.slug },
    ...tool.pSEOPresets.map((preset) => ({ slug: `${tool.slug}-${preset}` })),
  ]);
}
```

Adding preset #11: one line in `fee-presets.ts` + one string in `pSEOPresets` array → `npm run build` picks it up automatically.

### 3.7 — Build Remaining Calculator UI Components

```
src/components/calculators/
├── CalculatorShell.tsx          # Shared mobile-first container (card, sticky bar)
├── InputField.tsx               # Styled numeric input with label, currency prefix
├── PresetSelector.tsx           # Dropdown / pill toggle for pSEO presets
├── ResultCard.tsx               # Formatted result with breakdown table
├── StickyResultBar.tsx          # Mobile-only sticky bottom bar (placeholder, polished in M5)
├── ComparisonTable.tsx          # Side-by-side platform comparison table
├── EtsyFeeCalculator.tsx        # (already done in M2)
├── PodProfitCalculator.tsx      # NEW
├── TikTokFeeCalculator.tsx      # NEW
├── ShopifyProfitCalculator.tsx  # NEW
├── MarketplaceComparison.tsx    # NEW — Etsy vs Shopify vs TikTok
└── PaymentComparison.tsx        # NEW — Stripe vs PayPal
```

### 3.8 — Deploy Cluster A Expansion

- Push all new tools + updated data
- Verify all 66+ routes build successfully
- Submit updated sitemap to GSC

### Milestone 3 — Acceptance Criteria

| # | Criterion | Verification |
|---|-----------|-------------|
| 3A | `npm run test` passes all formula tests with ≥ 90% branch coverage on `src/lib/formulas/` | `npm run test:coverage` |
| 3B | Every formula returns correct `netProfit`, `totalFees`, `effectiveFeePct` for reference examples | Test assertions |
| 3C | Edge cases handled without `NaN`, `Infinity`, or runtime exceptions | Test assertions |
| 3D | `TOOLS` array contains exactly 6 entries (4 single + 2 comparison) | Programmatic assertion |
| 3E | Each tool config has exactly 10 `pSEOPresets`, 2+ `workedExamples`, 4+ `faqs`, 4+ `howToSteps` | Programmatic assertion |
| 3F | `FEE_PRESETS` covers all 6 platform groups | Programmatic assertion |
| 3G | Every `lastUpdated` field is valid ISO 8601 | Regex test |
| 3H | Build generates ≥ 66 tool routes (6 base + 60 preset variants) | Build log |
| 3I | `dataSnippet` on every tool produces accurate, grammatical sentence | Manual review |
| 3J | Comparison tools show side-by-side table with correct numbers | Visual inspection |
| 3K | Adding 11th preset requires only data changes, zero code changes | Manual architecture review |

---

## Milestone 4 — Full Content Layer & AdSense-Safe Page Architecture

**Goal:** Complete blog guide coverage for Cluster A, ensure every page passes AdSense "editorial value" requirements, and add all JSON-LD schema layers.

**Timeline:** Week 4–5

### 4.1 — Remaining Blog Guides

| # | Guide Slug | Title | Linked Tools | Embedded Mini-Calculator |
|---|------------|-------|--------------|--------------------------|
| G1 | (done in M2) | How to Calculate Etsy Fees in 2026 | `etsy-fee-calculator` | Etsy fee widget |
| G2 | `etsy-vs-shopify-vs-tiktok-shop-comparison` | Etsy vs. Shopify vs. TikTok Shop: Which Platform Leaves Higher Margins? | `etsy-vs-shopify-vs-tiktok-shop-calculator` | Comparison mini-widget |
| G3 | `pod-pricing-strategy-offsite-ads` | Print-on-Demand Pricing Strategy: Avoiding Hidden Offsite Ads Losses | `pod-profit-calculator`, `etsy-fee-calculator` | POD margin calculator |
| G4 | `pass-payment-processing-fees-to-clients` | How to Pass Payment Processing Fees to Clients Without Losing Deals | `stripe-vs-paypal-fee-calculator` | Gross-up calculator |

**Each guide (1,500–2,500 words) renders:**
1. H1 + published/updated date + estimated read time
2. Table of contents (auto-generated from headings)
3. Long-form editorial content with **data-driven snippets** from calculator formulas
4. Embedded interactive mini-calculator component
5. Internal links to full calculator pages
6. `Article` + `FAQPage` JSON-LD schemas
7. Related guides/tools section
8. Ad slot between content sections
9. Email capture at bottom: "Get our free fee comparison cheatsheet"

### 4.2 — JSON-LD Schema Coverage

| Page Type | Schemas |
|-----------|---------|
| `/tools/[slug]` | `SoftwareApplication` + `FAQPage` + `HowTo` |
| `/guides/[slug]` | `Article` + `FAQPage` (if FAQs present) |
| `/` (homepage) | `WebSite` + `Organization` |

**All JSON-LD rendered by `<JsonLd />` component:**

```tsx
interface JsonLdProps {
  type: "SoftwareApplication" | "FAQPage" | "HowTo" | "Article" | "WebSite" | "Organization";
  data: Record<string, unknown>;
}

export function JsonLd({ type, data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": type, ...data }) }}
    />
  );
}
```

### 4.3 — Sitemap, Robots Finalization

**`src/app/sitemap.ts`:**
```ts
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const toolRoutes = TOOLS.flatMap((tool) => [
    { url: `${BASE_URL}/tools/${tool.slug}`, lastModified: tool.lastUpdated, priority: 0.9 },
    ...tool.pSEOPresets.map((p) => ({
      url: `${BASE_URL}/tools/${tool.slug}-${p}`,
      lastModified: tool.lastUpdated,
      priority: 0.7,
    })),
  ]);
  const guideRoutes = GUIDES.map((g) => ({
    url: `${BASE_URL}/guides/${g.slug}`,
    lastModified: g.updatedAt,
    priority: 0.8,
  }));
  const staticRoutes = ["/", "/about", "/contact", "/privacy-policy", "/terms"].map((r) => ({
    url: `${BASE_URL}${r}`,
    lastModified: new Date().toISOString(),
    priority: r === "/" ? 1.0 : 0.3,
  }));
  return [...staticRoutes, ...toolRoutes, ...guideRoutes];
}
```

**`src/app/robots.ts`:**
```ts
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/embed/"] },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
```

### Milestone 4 — Acceptance Criteria

| # | Criterion | Verification |
|---|-----------|-------------|
| 4A | All 4 guides published, each 1,500+ words | Word count check |
| 4B | Each guide embeds an interactive mini-calculator | Visual inspection |
| 4C | Each guide has `Article` + `FAQPage` JSON-LD that validates | Rich Results Test |
| 4D | Every tool page has `SoftwareApplication` + `FAQPage` + `HowTo` JSON-LD | Rich Results Test |
| 4E | All 7 sections present in correct order on every tool page | DOM inspection |
| 4F | Sitemap lists all tool + guide + static routes (≥ 79 URLs) | `curl /sitemap.xml` count |
| 4G | `/robots.txt` disallows `/embed/` and includes sitemap | `curl /robots.txt` |
| 4H | Internal cross-links: every tool page → ≥ 2 related tools + ≥ 1 guide | DOM link count |
| 4I | Every guide page → ≥ 1 tool link + ≥ 1 related guide link | DOM link count |
| 4J | Email capture present at bottom of every guide | Visual inspection |
| 4K | Data-driven snippets in guides use accurate numbers from formula functions | Cross-reference with test data |

---

## Milestone 5 — Mobile-First Differentiation & Embeddable Widgets

**Goal:** Calculator UI is polished mobile-first with differentiation features (share, print, embed) that no competitor offers — driving organic backlinks and improved engagement metrics.

**Timeline:** Week 5–6

### 5.1 — Mobile-First Calculator UI Polish

| Property | Specification |
|----------|---------------|
| Touch targets | Minimum 44×44px (WCAG 2.5.8) |
| Input mode | `inputMode="decimal"` on all numeric fields |
| Number formatting | `Intl.NumberFormat` with locale-aware currency symbols |
| Sticky result bar | On mobile (`< md` breakpoint): sticky `bottom-0` bar showing key result (net profit / total fees), always visible while scrolling |
| Responsive layout | Single column on mobile; calculator + sidebar on desktop (`lg` breakpoint) |
| Preset selector | `<select>` dropdown or horizontal pill toggles |
| Input font size | Minimum 16px (prevents iOS auto-zoom) |
| Color contrast | WCAG AA minimum (4.5:1 body text, 3:1 large text) |

### 5.2 — Share Features

#### Copy Shareable Result URL

Encode current inputs into URL search params:
```ts
// /tools/etsy-fee-calculator?price=29.99&shipping=5&country=US&offsite=true
function encodeCalculatorState(inputs: Record<string, string | number>): string {
  const params = new URLSearchParams();
  Object.entries(inputs).forEach(([k, v]) => params.set(k, String(v)));
  return `${window.location.pathname}?${params.toString()}`;
}
```

On page load, `useSearchParams()` restores saved state → shareable link preserves exact calculation.

GA4: `result_copied { method: "url" }`

#### Copy Formatted Result Summary

"Copy Results" button copies plaintext:
```
Etsy Fee Calculator Results
─────────────────────────────
Selling Price:  $29.99
Shipping:       $5.00
Total Fees:     $5.42 (18.1%)
Net Profit:     $24.57
─────────────────────────────
Calculated at: https://yourdomain.com/tools/etsy-fee-calculator?...
```

GA4: `result_copied { method: "clipboard" }`

### 5.3 — Print / Save PDF Summary

- Dedicated `@media print` stylesheet in `src/app/globals.css`:
  - Hide nav, footer, ads, related links, email capture
  - Show calculator + results + formula + worked examples
  - Add site URL in page footer
- "Print / Save PDF" button calls `window.print()`
- GA4: `result_copied { method: "print" }`

### 5.4 — Embeddable Widget System

**Route:** `src/app/embed/[slug]/page.tsx`

| Aspect | Specification |
|--------|---------------|
| Layout | Stripped: no nav, no footer, no ads — just calculator card + "Powered by [YourSite]" link |
| Styling | Self-contained Tailwind, no external CSS dependency |
| Responsive | 100% iframe width; min-height 400px |
| Robots | Blocked (`disallow: ["/embed/"]`) to avoid duplicate content |

**"Copy Embed Code" modal on each tool page:**

```tsx
function EmbedModal({ slug, title }: { slug: string; title: string }) {
  const code = `<iframe
  src="https://yourdomain.com/embed/${slug}"
  width="100%"
  height="500"
  style="border:none;border-radius:8px;"
  title="${title}"
  loading="lazy"
></iframe>`;

  return (
    <dialog>
      <pre><code>{code}</code></pre>
      <button onClick={() => {
        navigator.clipboard.writeText(code);
        trackEvent({ name: "embed_copied", params: { tool_slug: slug } });
      }}>
        Copy Embed Code
      </button>
    </dialog>
  );
}
```

> **Why embeds matter:** Bloggers writing about Etsy fees can embed your calculator → **free backlinks** → domain authority grows → rankings improve. This is a compounding SEO flywheel that competitors don't have.

### Milestone 5 — Acceptance Criteria

| # | Criterion | Verification |
|---|-----------|-------------|
| 5A | On 375px viewport, all inputs ≥ 44×44px, font ≥ 16px | Chrome DevTools measurement |
| 5B | Sticky result bar visible on mobile, hidden on desktop | Visual at 375px vs 1280px |
| 5C | `inputMode="decimal"` on all numeric `<input>` elements | DOM inspection |
| 5D | "Copy Link" generates valid URL that restores calculator state in new tab | Manual test |
| 5E | "Copy Results" copies formatted plaintext | Manual test |
| 5F | "Print / Save PDF" triggers clean print layout (no nav/ads) | Print preview |
| 5G | `/embed/[slug]` renders without nav/footer/ads, shows "Powered by" link | Visual inspection |
| 5H | "Copy Embed Code" produces valid `<iframe>` snippet | Paste into test HTML |
| 5I | GA4 events fire: `result_copied`, `embed_copied` | GA4 DebugView |
| 5J | WCAG AA color contrast passes | Lighthouse Accessibility or axe |

---

## Milestone 6 — 2026 AdSense-to-Journey Monetization Stack

**Goal:** A modular, CLS-safe monetization layer that ships with AdSense + affiliate links + email capture at launch and can switch to Journey by Mediavine with an env var change — no layout rework.

**Timeline:** Week 6–7

### 6.1 — CLS-Safe `<AdSlot />` Component

**`src/components/layout/AdSlot.tsx`:**

```tsx
interface AdSlotProps {
  position: "below-calculator" | "in-content" | "sidebar";
  className?: string;
}

export function AdSlot({ position, className }: AdSlotProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full overflow-hidden",
        position === "below-calculator" && "min-h-[90px] md:min-h-[250px]",
        position === "in-content" && "min-h-[90px] md:min-h-[250px]",
        position === "sidebar" && "min-h-[250px]",
        className
      )}
      data-ad-slot={position}
      aria-hidden="true"
    />
  );
}
```

**CLS budget:** Every ad container uses `min-h-*` → target CLS < 0.05 sitewide.

### 6.2 — `<AffiliateCallout />` Component

**`src/components/layout/AffiliateCallout.tsx`:**

```tsx
interface AffiliateCalloutProps {
  partner: string;
  toolSlug: string;
  headline: string;
  description: string;
  ctaText: string;
  url: string;
}

export function AffiliateCallout(props: AffiliateCalloutProps) {
  return (
    <aside className="rounded-lg border border-blue-100 bg-blue-50 p-4 my-6">
      <p className="text-xs text-gray-500 mb-1">Partner Recommendation</p>
      <h3 className="font-semibold">{props.headline}</h3>
      <p className="text-sm text-gray-700 mt-1">{props.description}</p>
      <a
        href={props.url}
        target="_blank"
        rel="sponsored noopener noreferrer"
        onClick={() =>
          trackEvent({
            name: "affiliate_clicked",
            params: { tool_slug: props.toolSlug, partner: props.partner, url: props.url },
          })
        }
        className="inline-block mt-3 rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        {props.ctaText} →
      </a>
    </aside>
  );
}
```

**Cluster A affiliate mapping:**

| Tool | Partner | CTA | Why |
|------|---------|-----|-----|
| `etsy-fee-calculator` | Printify / Printful | "Start selling with Printify" | POD sellers using Etsy |
| `pod-profit-calculator` | Printify / Gelato | "Get started with Printify" | Direct POD platforms |
| `tiktok-shop-fee-calculator` | TikTok Shop Seller Center | "Open your TikTok Shop" | Official seller signup |
| `shopify-profit-calculator` | Shopify | "Start Shopify free trial" | Direct platform signup |
| `etsy-vs-shopify-vs-tiktok-shop-calculator` | Shopify + Wise | "Try Shopify free for 3 days" | Platform comparison winner CTA |
| `stripe-vs-paypal-fee-calculator` | Stripe Atlas / Wise | "Open a Wise Business account" | Business payment accounts |

### 6.3 — Modular Script Injection for Grow → Journey Migration

**`src/app/layout.tsx` — Head script slot:**

```tsx
const AD_NETWORK = process.env.NEXT_PUBLIC_AD_NETWORK || "adsense";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />

        {AD_NETWORK === "adsense" && (
          <Script
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
            data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID}
            strategy="afterInteractive"
            crossOrigin="anonymous"
          />
        )}
        {(AD_NETWORK === "grow" || AD_NETWORK === "journey") && (
          <Script
            src={`https://assets.grow.me/grow-me.js?site-id=${process.env.NEXT_PUBLIC_GROW_SITE_ID}`}
            strategy="afterInteractive"
          />
        )}
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### 6.4 — Monetization Migration Timeline

```
┌─────────────────────────────────────────────────────────────────────┐
│  Month 1+       │ Google AdSense + Affiliate Links + Email Capture │
│                 │ NEXT_PUBLIC_AD_NETWORK=adsense                   │
├─────────────────┼─────────────────────────────────────────────────┤
│  Month 1+       │ Install Grow by Mediavine (free, no threshold)  │
│  (parallel)     │ NEXT_PUBLIC_AD_NETWORK=grow                     │
│                 │ Grow builds domain history for Journey           │
├─────────────────┼─────────────────────────────────────────────────┤
│  Month 4+       │ Apply for Journey by Mediavine                  │
│  (1K+ Tier-1    │ Requires: 1,000+ monthly Tier-1 sessions       │
│   sessions)     │            + 4+ months domain with Grow         │
│                 │ NEXT_PUBLIC_AD_NETWORK=journey                  │
│                 │ Remove AdSense script                           │
├─────────────────┼─────────────────────────────────────────────────┤
│  Year 2+        │ Mediavine Premier (Jupiter) or Raptive          │
│  (25K+ pv/mo)   │ $5K+ annual ad revenue                        │
│                 │ + Email-gated PDF/CSV export lead magnets       │
└─────────────────┴─────────────────────────────────────────────────┘
```

> **Note:** Ezoic now requires 250,000+ monthly active users since February 2026, making it unsuitable for new sites. Journey by Mediavine (1,000 Tier-1 sessions + 4 months) is the fastest high-RPM upgrade path.

### Milestone 6 — Acceptance Criteria

| # | Criterion | Verification |
|---|-----------|-------------|
| 6A | `<AdSlot />` renders with `min-h-[90px]` mobile / `min-h-[250px]` desktop | DOM inspection |
| 6B | Lighthouse CLS < 0.05 on tool pages with ad slots | Lighthouse audit |
| 6C | `<AffiliateCallout />` has `rel="sponsored noopener noreferrer"` | DOM inspection |
| 6D | Affiliate click fires GA4 `affiliate_clicked` event | GA4 DebugView |
| 6E | `NEXT_PUBLIC_AD_NETWORK=grow` swaps AdSense → Grow script in `<head>` | View source |
| 6F | `NEXT_PUBLIC_AD_NETWORK=adsense` loads AdSense with correct `data-ad-client` | View source |
| 6G | No ad scripts load when env vars are unset (dev mode) | View source on localhost |
| 6H | At least 1 `<AffiliateCallout />` on each Cluster A tool page | Visual inspection on all 6 |

---

## Milestone 7 — Verification & Deployment Checklist

**Goal:** A repeatable, scripted verification pipeline and production deployment on Vercel free tier.

**Timeline:** Runs at end of each milestone, full suite before final launch

### 7.1 — Verification Commands

**All must pass before any deployment:**

```bash
# 1. Lint — zero errors
npm run lint

# 2. Type-check — zero errors
npx tsc --noEmit

# 3. Unit tests — all pass, ≥ 90% formula coverage
npm run test:coverage

# 4. Build — SSG generates all expected routes
npm run build
# Verify: ≥ 79 static pages (66 tool + 4 guide + 5 static + 4 embed)

# 5. Lighthouse CI — Performance ≥ 95, SEO ≥ 95
npx @lhci/cli autorun --config=lighthouserc.json

# 6. JSON-LD validation
# Manual: paste 3 tool URLs into https://search.google.com/test/rich-results
# Expect: SoftwareApplication + FAQPage + HowTo detected, no errors

# 7. Sitemap validation
# curl https://yourdomain.com/sitemap.xml | grep "<url>" | wc -l → ≥ 79

# 8. CLS check — all tool pages CLS < 0.05
# Lighthouse audit on 3 sample tool pages
```

### 7.2 — Lighthouse CI Config

**`lighthouserc.json`:**

```json
{
  "ci": {
    "collect": {
      "numberOfRuns": 3,
      "url": [
        "http://localhost:3000/",
        "http://localhost:3000/tools/etsy-fee-calculator",
        "http://localhost:3000/tools/etsy-vs-shopify-vs-tiktok-shop-calculator",
        "http://localhost:3000/guides/how-to-calculate-etsy-fees-2026"
      ]
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.95 }],
        "categories:seo": ["error", { "minScore": 0.95 }],
        "categories:accessibility": ["error", { "minScore": 0.90 }],
        "categories:best-practices": ["error", { "minScore": 0.90 }]
      }
    }
  }
}
```

### 7.3 — `package.json` Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "lighthouse": "lhci autorun --config=lighthouserc.json",
    "verify": "npm run lint && npx tsc --noEmit && npm run test:coverage && npm run build"
  }
}
```

### 7.4 — Vercel Deployment

| Step | Detail |
|------|--------|
| 1 | Push to GitHub: `git push origin main` |
| 2 | Import repo at [vercel.com/new](https://vercel.com/new) |
| 3 | Framework preset: auto-detected Next.js |
| 4 | Environment variables in Vercel dashboard: `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_ADSENSE_ID`, `NEXT_PUBLIC_AD_NETWORK`, `NEXT_PUBLIC_GROW_SITE_ID` |
| 5 | Build command: `npm run build` (default) |
| 6 | Custom domain: add in Vercel → Domains → update DNS |
| 7 | Verify: Lighthouse on production URL, check `/sitemap.xml` |

### Milestone 7 — Acceptance Criteria

| # | Criterion | Verification |
|---|-----------|-------------|
| 7A | `npm run verify` exits with code 0 | Single command |
| 7B | Lighthouse Performance ≥ 95 on homepage + 2 tool pages | `npx lhci autorun` |
| 7C | Lighthouse SEO ≥ 95 | `npx lhci autorun` |
| 7D | Lighthouse Accessibility ≥ 90 | `npx lhci autorun` |
| 7E | JSON-LD Rich Results Test: `SoftwareApplication` passes on 3 pages | Manual validation |
| 7F | JSON-LD Rich Results Test: `FAQPage` passes on 3 pages | Manual validation |
| 7G | JSON-LD Rich Results Test: `HowTo` passes on 3 pages | Manual validation |
| 7H | Sitemap at production URL with ≥ 79 URLs | `curl` and count |
| 7I | Vercel deployment live, TTFB < 1s | WebPageTest |
| 7J | All env vars set in Vercel | Dashboard check |
| 7K | GSC property verified, sitemap submitted | GSC dashboard |

---

## Milestone 8 — Post-Launch Growth Engine (Ongoing)

**Goal:** Systematic, repeatable growth activities that drive traffic before SEO kicks in (3–6 months), build email list, and maintain content freshness.

**Timeline:** Starts Day 1 post-launch, runs continuously.

### 8.1 — Reddit & Quora SEO Funnel (Week 1+)

**Strategy:** Provide genuinely helpful answers in relevant communities, with tool link as supplementary value — NOT spam.

| Platform | Target Communities | Approach |
|----------|-------------------|----------|
| **Reddit** | r/Etsy, r/EtsySellers, r/shopify, r/ecommerce, r/tiktokshop, r/Flipping, r/smallbusiness, r/freelance | Answer fee-related questions thoroughly. End with: "I actually built a free calculator for this if it helps — [link]" |
| **Quora** | "How much does Etsy charge?", "What are Shopify fees?", "Etsy vs Shopify" | Detailed answer (200+ words) with data from your calculator, then: "I made a free tool to calculate this automatically" |
| **Facebook Groups** | Etsy Seller groups, Shopify communities, POD communities | Share useful fee breakdowns ("Did you know Etsy takes 18-25% of your sale?") with tool link |

**Rules:**
- ❌ Never spam — Reddit auto-removes accounts that only post links
- ✅ Post genuine, helpful, detailed answers FIRST
- ✅ Only link when genuinely relevant to the question
- ✅ Build karma/reputation in those communities over time
- 📊 Track referral traffic in GA4 → `source/medium` report

### 8.2 — Social Media Short-Form Content (Week 2+)

| Platform | Content Format | Example |
|----------|---------------|---------|
| **TikTok** | 30-sec screen recording | "How much does Etsy REALLY take from your $30 sale?" → show calculator → reveal $5.42 |
| **Instagram Reels** | Same as TikTok | Repurpose TikTok content |
| **YouTube Shorts** | Same as TikTok | Repurpose TikTok content |
| **X/Twitter** | Data-driven thread | "I calculated the REAL fees for selling a $29.99 item on Etsy, Shopify, and TikTok Shop. Here's the breakdown: 🧵" |

> **Key insight:** Use the `dataSnippet` from your calculators as social content. The numbers are unique, surprising, and shareable. This is **data-driven content marketing** powered by your own product.

### 8.3 — Fee Update Alert System (Month 2+)

When you update `fee-presets.ts` for any platform:

1. Update `lastUpdated` date in the preset
2. Send email to subscribers: *"⚠️ Etsy just changed their processing fee from 3% to 3.5%. See how it affects your profit → [calculator link]"*
3. Post update on Reddit/social: "PSA: Etsy fee change — here's what it means for sellers"
4. This creates **recurring traffic spikes** every time a platform updates fees
5. Google rewards the updated `lastUpdated` badge → fresh content signal → rankings improve

**Quarterly Audit Schedule:**

| Quarter | Audit |
|---------|-------|
| Q1 (Jan–Mar) | Etsy annual fee update (usually January), TikTok Shop policy changes |
| Q2 (Apr–Jun) | Shopify partner API changes, Stripe rate adjustments |
| Q3 (Jul–Sep) | Mid-year platform updates, holiday seller prep guides |
| Q4 (Oct–Dec) | Pre-BFCM seller preparation, year-end tax calculator push |

### 8.4 — Search Console Data-Driven Expansion

After 4–8 weeks of indexing, use Google Search Console data to decide what to build next:

| Signal | Action |
|--------|--------|
| A pSEO page gets impressions but low clicks | Improve title/meta description for that preset |
| A page ranks position 5–15 | Add more content (longer FAQ, more worked examples) to push into top 3 |
| Search queries show demand for unbuilt preset | Add that country/product/category preset (data-only change) |
| Comparison keywords get traffic | Build more comparison tools (Cluster B priority) |
| A specific tool gets 0 impressions after 4 weeks | Investigate — may need better keyword targeting or more internal links |

### 8.5 — Cluster B & C Expansion Trigger

**Don't start Cluster B until these conditions are met:**

| Condition | Metric | Why |
|-----------|--------|-----|
| Cluster A indexed | All 66+ pages in Google index (GSC) | Proves architecture works |
| Baseline traffic | ≥ 500 monthly sessions from organic search | Proves content strategy works |
| AdSense approved | AdSense showing ads | Revenue baseline established |
| Email list started | ≥ 50 subscribers | Audience to announce new tools |

Then repeat M2–M7 cycle for Cluster B (8 tools), then Cluster C (5 tools).

### 8.6 — Multi-Language Expansion (Phase 2+, Future)

**NOT for Phase 1.** Only after English version proves the model:

| Language | Target Market | When |
|----------|---------------|------|
| Spanish | US Hispanic sellers + LATAM | After 10K monthly English visits |
| German | DE, AT, CH Etsy sellers | After 10K monthly English visits |
| French | FR, CA (Quebec) | After 10K monthly English visits |

Tech: `next-intl` for i18n. Same calculators, translated UI + guides.

### Milestone 8 — Acceptance Criteria (Ongoing KPIs)

| # | Criterion | Timeline | Target |
|---|-----------|----------|--------|
| 8A | Reddit/Quora: ≥ 3 genuine answers posted per week | Weekly | Referral traffic in GA4 |
| 8B | Social content: ≥ 1 TikTok/Reel per week | Weekly | Views + site clicks |
| 8C | Email list growth | Monthly | ≥ 50 subscribers by Month 2 |
| 8D | Fee audit completed | Quarterly | All `lastUpdated` dates current |
| 8E | Search Console review | Bi-weekly | Identify expansion opportunities |
| 8F | Cluster B kickoff conditions met | Month 2–3 target | All 4 conditions in §8.5 |

---

## Appendix A — Full File Tree

```
tools-hub/
├── .eslintrc.json
├── .prettierrc
├── lighthouserc.json
├── next.config.ts
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── competitor-analysis.md           # From M0 — competitor gap research
├── public/
│   ├── favicon.ico
│   └── og-default.png
└── src/
    ├── app/
    │   ├── globals.css              # Tailwind directives + @media print styles
    │   ├── layout.tsx               # Root: GA4, ad script slot, nav, footer
    │   ├── page.tsx                 # Homepage: category directory + search + email capture
    │   ├── about/page.tsx
    │   ├── contact/page.tsx
    │   ├── privacy-policy/page.tsx
    │   ├── terms/page.tsx
    │   ├── robots.ts
    │   ├── sitemap.ts
    │   ├── tools/
    │   │   └── [slug]/
    │   │       └── page.tsx         # 7-section SSG tool page
    │   ├── guides/
    │   │   └── [slug]/
    │   │       └── page.tsx         # SSG guide page
    │   └── embed/
    │       └── [slug]/
    │           └── page.tsx         # Stripped iframe widget
    ├── components/
    │   ├── calculators/
    │   │   ├── CalculatorShell.tsx
    │   │   ├── InputField.tsx
    │   │   ├── PresetSelector.tsx
    │   │   ├── ResultCard.tsx
    │   │   ├── StickyResultBar.tsx
    │   │   ├── ComparisonTable.tsx
    │   │   ├── EtsyFeeCalculator.tsx
    │   │   ├── PodProfitCalculator.tsx
    │   │   ├── TikTokFeeCalculator.tsx
    │   │   ├── ShopifyProfitCalculator.tsx
    │   │   ├── MarketplaceComparison.tsx
    │   │   └── PaymentComparison.tsx
    │   ├── layout/
    │   │   ├── Header.tsx
    │   │   ├── Footer.tsx
    │   │   ├── Breadcrumbs.tsx
    │   │   ├── AdSlot.tsx
    │   │   ├── AffiliateCallout.tsx
    │   │   ├── EmailCapture.tsx     # Email signup component
    │   │   ├── EmbedModal.tsx
    │   │   ├── ShareButton.tsx
    │   │   └── PrintButton.tsx
    │   └── seo/
    │       ├── JsonLd.tsx           # SoftwareApplication + FAQPage + HowTo + Article
    │       ├── FormulaBreakdown.tsx
    │       ├── WorkedExample.tsx
    │       ├── FAQAccordion.tsx
    │       └── RelatedTools.tsx
    ├── content/
    │   └── guides/
    │       ├── how-to-calculate-etsy-fees-2026.mdx
    │       ├── etsy-vs-shopify-vs-tiktok-shop-comparison.mdx
    │       ├── pod-pricing-strategy-offsite-ads.mdx
    │       └── pass-payment-processing-fees-to-clients.mdx
    ├── data/
    │   ├── tools-registry.ts        # ToolConfig[], GuideMeta[], ComparisonPreset[]
    │   └── fee-presets.ts           # FeePreset[]
    ├── lib/
    │   ├── analytics.ts             # Typed GA4 trackEvent() with email_signup + guide_read
    │   ├── utils.ts                 # cn(), formatCurrency(), formatDate()
    │   └── formulas/
    │       ├── index.ts             # Barrel export
    │       ├── etsy-fees.ts
    │       ├── pod-profit.ts
    │       ├── tiktok-fees.ts
    │       ├── shopify-profit.ts
    │       ├── platform-comparison.ts
    │       └── stripe-vs-paypal.ts
    └── tests/
        ├── setup.ts
        └── formulas/
            ├── smoke.test.ts
            ├── etsy-fees.test.ts
            ├── pod-profit.test.ts
            ├── tiktok-fees.test.ts
            ├── shopify-profit.test.ts
            ├── platform-comparison.test.ts
            └── stripe-vs-paypal.test.ts
```

---

## Appendix B — Cluster Tool Registry Quick Reference

### Cluster A — E-Commerce & Seller Profit (Phase 1 / This Build)

| # | Slug | Type | Phase 1 pSEO Presets (Top 10) |
|---|------|------|-------------------------------|
| 1 | `etsy-fee-calculator` | Single | US, UK, CA, AU, DE, FR, NL, IT, ES, IN |
| 2 | `pod-profit-calculator` | Single | t-shirts, hoodies, mugs, totes, posters, phone-cases, stickers, canvas, pillows, ornaments |
| 3 | `tiktok-shop-fee-calculator` | Single | beauty, apparel, electronics, home-garden, health, toys, sports, food, pets, accessories |
| 4 | `shopify-profit-calculator` | Single | shopify-payments, stripe, paypal, square, authorize-net, 2checkout, klarna, afterpay, worldpay, adyen |
| 5 | `etsy-vs-shopify-vs-tiktok-shop-calculator` | Comparison | High-intent landing (no presets) |
| 6 | `stripe-vs-paypal-fee-calculator` | Comparison | USD, GBP, EUR, CAD, AUD (domestic + cross-border) |

### Cluster B — Freelancer, 1099 & Creator Finance (Phase 2 — Future)

| # | Slug | Phase 1 pSEO Presets (Top 10) |
|---|------|-------------------------------|
| 7 | `stripe-fee-calculator` | USD, GBP, EUR, CAD, AUD, JPY, CHF, SGD, HKD, MXN |
| 8 | `freelance-hourly-rate-calculator` | developer, designer, copywriter, marketer, consultant, photographer, videographer, illustrator, data-analyst, project-manager |
| 9 | `upwork-vs-fiverr-fee-calculator` | $100, $500, $1K, $2K, $5K, $10K tiers |
| 10 | `1099-quarterly-tax-calculator` | CA, TX, NY, FL, IL, PA, OH, GA, NC, WA |
| 11 | `youtube-sponsorship-calculator` | finance, tech, gaming, lifestyle, beauty, education, health, travel, food, comedy |
| 12 | `podcast-sponsorship-calculator` | pre-roll, mid-roll, post-roll + true-crime, business, comedy, education, health |

### Cluster C — SaaS, AI & High-CPC Asset Calculators (Phase 3 — Future)

| # | Slug | Phase 1 pSEO Presets |
|---|------|----------------------|
| 13 | `saas-ltv-cac-calculator` | B2B-SaaS, B2C-SaaS, usage-based, freemium benchmarks |
| 14 | `break-even-roas-calculator` | meta-ads, google-ads, tiktok-ads, linkedin-ads, pinterest-ads |
| 15 | `ai-api-cost-calculator` | gpt-4o, gpt-4o-mini, claude-sonnet, claude-haiku, gemini-pro, gemini-flash |
| 16 | `airbnb-roi-calculator` | studio, 1-bed, 2-bed, 3-bed, entire-home, luxury |
| 17 | `ev-charging-cost-calculator` | home-ac-level2, public-dc-fast, supercharger, petrol-comparison |

---

## Appendix C — Competitor Gap Analysis Matrix

Fill this table **before coding** (Milestone 0 deliverable):

| Feature | SEO Ninja (Etsy) | PODPriceCheck | SellersNest (TikTok) | Ecom Beacon (Shopify) | Jupid (Stripe) | **Your Site** |
|---------|-------------------|---------------|----------------------|-----------------------|----------------|---------------|
| Mobile-optimized UI | ? | ? | ? | ? | ? | ✅ Planned |
| Shareable result URL | ? | ? | ? | ? | ? | ✅ Planned |
| PDF / Print export | ? | ? | ? | ? | ? | ✅ Planned |
| Embeddable `<iframe>` widget | ? | ? | ? | ? | ? | ✅ Planned |
| Side-by-side comparison | ? | ? | ? | ? | ? | ✅ Planned |
| "Last updated" date | ? | ? | ? | ? | ? | ✅ Planned |
| Supporting blog guides | ? | ? | ? | ? | ? | ✅ Planned |
| FAQ + JSON-LD schema | ? | ? | ? | ? | ? | ✅ Planned |
| HowTo JSON-LD schema | ? | ? | ? | ? | ? | ✅ Planned |
| Fee update email alerts | ? | ? | ? | ? | ? | ✅ Planned |
| Data-driven comparison snippets | ? | ? | ? | ? | ? | ✅ Planned |
| Affiliate partner integration | ? | ? | ? | ? | ? | ✅ Planned |

> Replace `?` with ✅, 🟡 (partial), or ❌ after researching each competitor site. Every ❌ you turn into a ✅ is a competitive advantage.

---

## Execution Flow Summary

```
M0 (Day 1-2)          M1 (Day 2-3)         M2 (Day 3-14)
┌──────────────┐       ┌──────────────┐      ┌───────────────────────┐
│ Domain        │       │ Scaffold     │      │ MVP LIVE 🚀           │
│ Competitor    │──────▶│ Vitest       │─────▶│ 1 calculator          │
│ Research      │       │ GA4          │      │ 1 guide               │
│ Content Cal   │       │ Types        │      │ Trust pages           │
└──────────────┘       └──────────────┘      │ AdSense applied       │
                                              │ Grow installed        │
                                              │ Email capture live    │
                                              └───────┬───────────────┘
                                                      │
                        M3 (Week 3-4)                  │        M4 (Week 4-5)
                       ┌──────────────────────┐        │       ┌────────────────────┐
                       │ Full Cluster A        │◀───────┘       │ All guides          │
                       │ 6 tools + tests       │───────────────▶│ Full JSON-LD        │
                       │ Comparison tools      │                │ AdSense-safe layout │
                       │ Data snippets         │                └────────┬───────────┘
                       └──────────────────────┘                         │
                                                                        │
                        M5 (Week 5-6)                  M6 (Week 6-7)    │
                       ┌──────────────────────┐       ┌────────────────┐│
                       │ Mobile polish         │◀──────│ Monetization   ││
                       │ Share/Print/Embed     │       │ AdSlot         │◀┘
                       │ Widget system         │       │ Affiliate      │
                       └──────────┬───────────┘       │ Grow→Journey   │
                                  │                    └───────┬────────┘
                                  │        M7 (Final)          │
                                  │       ┌────────────────────┤
                                  └──────▶│ Verify + Deploy    │
                                          │ Lighthouse ≥ 95    │
                                          │ Rich Results ✅     │
                                          └────────────────────┘
                                                   │
                                          M8 (Ongoing)
                                          ┌────────────────────┐
                                          │ Reddit/Quora       │
                                          │ Social content     │
                                          │ Fee update alerts  │
                                          │ GSC-driven expand  │
                                          │ Cluster B trigger  │
                                          └────────────────────┘
```

> **Next step:** After this BUILD_PLAN.md is approved, begin Milestone 0 (domain + competitor research) followed by Milestone 1 scaffold.
