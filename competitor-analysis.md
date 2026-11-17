# Competitor Gap Analysis & Feature Matrix

> **Generated:** 2026-11-17  
> **Target Niche:** Tier-1 High-CPC Marketplace & Seller Calculators (Cluster A + B)

---

## 1. Executive Summary

Most existing calculator tools in the e-commerce & seller fee space are either:
1. **Ad-cluttered and slow:** Heavy layout shift (CLS), invasive interstitials, and poor mobile experience.
2. **Feature-poor:** Single-state calculation with no URL state sharing, no printable PDF reports, and no embeddable widgets for backlink acquisition.
3. **Thin Content / AdSense Risk:** Simple HTML form with zero editorial content, no worked examples, and no JSON-LD structured data (leading to "Low Value Content" Google penalties).

Our platform (**ToolsHub / FeeSnap**) addresses every one of these vulnerabilities by delivering clean, mobile-first, high-speed static architecture with built-in virality (URL state sharing, print-to-PDF, and embed widgets) plus 7-section AdSense-safe content architecture.

---

## 2. Competitor Feature Matrix

| Feature | SEO Ninja (Etsy) | PODPriceCheck (POD) | SellersNest (TikTok Shop) | Ecom Beacon (Shopify) | Jupid (Stripe) | **Our Platform (FeeSnap)** |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Instant Real-Time Math** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Pure TS functions |
| **Mobile-First UI (≥44px Touch Targets, `decimal` keypad)** | ❌ (Cramped inputs) | 🟡 (Basic responsive) | ❌ (Desktop-heavy) | 🟡 (Basic) | 🟡 (Mobile OK) | ✅ Custom Mobile Shell + Sticky Result Bar |
| **Sticky Result Bar on Mobile** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ Fixed bottom bar on `< md` viewports |
| **Shareable URL with Preset/State** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ Full URL search params sync |
| **Formatted Plaintext Copy** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ One-click formatted clipboard export |
| **Print / PDF Summary (`@media print`)** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ Clean invoice/report print stylesheet |
| **Embeddable `<iframe>` Widget** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ `/embed/[slug]` + Copy Code modal |
| **Side-by-Side Platform Comparison** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ Multi-marketplace & Stripe vs PayPal |
| **Visible "Last Updated" Trust Badge** | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ Dynamically read from `fee-presets.ts` |
| **Supporting Long-Form Editorial Guides**| ❌ (Thin tool only) | ❌ | ❌ | 🟡 (Minimal) | ❌ | ✅ 1,500+ word MDX pillar guides per cluster |
| **Structured Data (SoftwareApp + FAQPage)**| ❌ | ❌ | ❌ | ❌ | ❌ | ✅ Full JSON-LD Rich Results optimization |
| **HowTo Step-by-Step Schema** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ Rich snippets for SERP visual prominence |
| **Data-Driven Dynamic Snippets** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ Auto-generated comparison facts for SEO/Social |
| **Email Capture for Fee Alerts** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ Non-intrusive PDF & alert signup |
| **CLS-Safe Ad Placement (CLS < 0.05)** | ❌ (Heavy popups & shift) | 🟡 | ❌ | 🟡 | 🟡 | ✅ Reserved container heights (`min-h-[90px]/[250px]`) |

---

## 3. High-Value Competitor Gaps & Exploitation Plan

### 3.1 Etsy Fee Calculator (Target: SEO Ninja, OmniCalculator)
- **Competitor Weakness:** SEO Ninja does not support multiple country payment processing rates cleanly without reloading or broken UI, and does not clearly separate standard transaction fees from optional 12%/15% Offsite Ads.
- **Our Advantage:** 10 country presets (US, UK, CA, AU, DE, FR, NL, IT, ES, IN), clear Offsite Ads toggle with seller revenue tier auto-detection ($10k threshold), and clear breakdown of listing vs. transaction vs. regulatory operating fee.

### 3.2 POD Profit Calculator (Target: PODPriceCheck)
- **Competitor Weakness:** Requires manual entry of print provider costs with no presets, making it tedious for beginners.
- **Our Advantage:** Pre-populated base print cost presets for the top 10 items (Gildan 5000 T-Shirt, Bella+Canvas 3001, 11oz Ceramic Mug, Unisex Hoodie, Tote Bag, Canvas, etc.) with instant margin and break-even retail calculation.

### 3.3 TikTok Shop Fee Calculator (Target: SellersNest)
- **Competitor Weakness:** TikTok Shop fees change rapidly (transition from introductory 1.8% to 6%+ category referral fees). Existing calculators are outdated and don't factor in affiliate commission percentages or sample costs.
- **Our Advantage:** Dedicated category presets (Beauty 6%, Apparel 6%, Electronics 5%, etc.) + Creator Affiliate Commission % slider + shipping subsidy toggles + dynamic "Last updated" date.

### 3.4 Shopify Profit & Break-Even ROAS (Target: Ecom Beacon)
- **Competitor Weakness:** Separates profit calculation from advertising ROAS metrics; sellers need to use 2-3 different websites to know their real break-even numbers.
- **Our Advantage:** Combined unified calculator: Gross Margin + Gateway Fees (Shopify Payments vs Stripe vs PayPal) + Ad Spend + Target ROAS vs Break-Even ROAS ($1 / Gross Margin).

### 3.5 Platform Comparison: Etsy vs Shopify vs TikTok Shop (Market White Space)
- **Competitor Weakness:** Virtually no dedicated tool lets a seller enter a single product price and see side-by-side net payout across Etsy, Shopify, and TikTok Shop simultaneously.
- **Our Advantage:** First-to-market unified comparison engine. High search volume, massive social shareability, and natural contextual affiliate hooks (Shopify 3-day trial / Printify signups).

---

## 4. Domain & Branding Recommendations

1. **FeeSnap.com** (Strongest brandability, short, punchy, universal)
2. **SellerCalc.com** (Direct e-commerce intent, great keyword equity)
3. **CalcHive.com** (Modern SaaS/Hub brand, scalable to non-ecommerce niches)
4. **SellerFees.io / FeeCheck.io** (Tech/modern developer & creator appeal)

---

## 5. 4-Week Launch Roadmap

- **Week 1:** Architecture scaffold (Next.js 15+, Tailwind CSS, Vitest, GA4) + Trust pages + Core design system.
- **Week 2 (MVP Launch):** Etsy Fee Calculator + 10 country pSEO routes + "How to Calculate Etsy Fees in 2026" guide + Google Search Console verification + AdSense application.
- **Week 3:** POD Profit Calculator + TikTok Shop Fee Calculator + supporting guides + affiliate slot integration.
- **Week 4:** Shopify Profit Calculator + Etsy vs Shopify vs TikTok Comparison Engine + Stripe vs PayPal Comparison + `/embed` widgets.
