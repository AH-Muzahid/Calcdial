# CalcDial: Competitor Reverse Engineering & Tool Specification Matrix

> **Protocol:** `gstack` Phase 1 (Research & Tool Specification)  
> **Source Verification:** Craftybase, Alura, OmniCalculator, eComCrew, Salemove  
> **Date:** November 2026

---

## 1. Executive Summary & Competitor Shortcomings

| Competitor | Flaws Identified During Reverse Engineering | CalcDial Solution |
| :--- | :--- | :--- |
| **Craftybase** | Confuses Gross Bank Payout with Real Net Profit. Fails to allow variable carrier postage. | Strict separation of **Bank Settlement Payout** vs **Real Net Profit** (Payout minus landed COGS & carrier postage). |
| **OmniCalculator** | Static single-tier fee formulas. Outdated 2024 TikTok Shop fee rates (missed $0.30 fixed fee). | Up-to-date 2026 category tiers (5-6% referral + $0.30 fixed transaction fee + creator affiliate cut). |
| **Alura / eComCrew** | Single-direction math only (User inputs price -> sees profit). No reverse pricing. | Dual Mode (`PillTabs`): **Direct Profit Mode** vs **Target Margin Pricing Mode** (Calculates exact price needed for X% margin). |
| **Basic Stripe/PayPal Tools** | Ignores invoice vs checkout rates (PayPal 2.99% invoice vs 3.49% checkout). No gross-up. | **Direct Mode** + **Client Invoice Gross-Up Mode** + Monthly Volume Simulator with annual savings projection. |

---

## 2. Mathematical Specs & Formulas per Calculator

### Tool 1: Etsy Fee Calculator (`src/lib/formulas/etsy-fees.ts`)
* **Inputs:** `itemPrice`, `shippingCharge`, `itemCost` (COGS), `shippingCost` (carrier label), `country`, `listingCount`, `offsiteAds` (`none` | `low_12` | `high_15`), `isInternationalBuyer`.
* **Platform Deductions:**
  - Listing Fee: $\$0.20 \times \text{listingCount}$
  - Transaction Fee: $6.5\% \times (\text{itemPrice} + \text{shippingCharge})$
  - Payment Processing Fee: $\text{processingPct}\% \times (\text{itemPrice} + \text{shippingCharge}) + \text{processingFixed}$
  - Regulatory Operating Fee: $\text{regulatoryPct}\% \times (\text{itemPrice} + \text{shippingCharge} + \text{giftWrap})$ (effective June 22, 2026: UK 0.48%, France 1.14%, Italy 0.80%, Spain 0.88%, Türkiye 1.67%, Canada 0.50%, Hungary 1.97%, Vietnam 1.24%, India 0.05%; US exempt)
  - Offsite Ads Fee: $12\%\text{ or }15\% \times (\text{itemPrice} + \text{shippingCharge})$ (if attributed)
  - International Surcharge: $+1.0\%$ (if buyer is outside seller's region)
* **Outputs:**
  - $\text{Gross Revenue} = \text{itemPrice} + \text{shippingCharge}$
  - $\text{Etsy Bank Payout} = \text{Gross Revenue} - \text{Total Platform Fees}$
  - $\text{Real Net Profit} = \text{Etsy Bank Payout} - (\text{itemCost} + \text{shippingCost})$
  - $\text{Break-Even Price} = \frac{\text{itemCost} + \text{shippingCost} + \text{Fixed Fees} - \text{shippingCharge} \times (1 - \text{FeeRate})}{1 - \text{FeeRate}}$
  - $\text{Target Price for Margin } M = \frac{\text{itemCost} + \text{shippingCost} + \text{Fixed Fees} - \text{shippingCharge} \times (1 - \text{FeeRate} - M)}{1 - \text{FeeRate} - M}$

#### Historical Regulatory Operating Fee Tracking & Legacy Rates Audit
During our November 2026 rate audit, two discrepancies in third-party aggregator feeds and legacy competitor tools were analyzed:
* **Spain (0.40% vs 0.88%):** The 0.40% rate originated from Etsy's initial July 2021 rollout of the Regulatory Operating Fee following Spain's Ley del Impuesto sobre Determinados Servicios Digitales. Etsy subsequently increased Spain's fee to 0.72% in early 2024, and then to **0.88%** effective June 22, 2026. Outdated competitor tools that have not refreshed their database since 2021 still show 0.40%.
* **Türkiye (2.07% vs 1.67%):** The 2.07% rate was Etsy's introductory 2021 rate for Turkey. It was subsequently adjusted to 2.27% in early 2024, before being lowered to **1.67%** in the June 22, 2026 schedule update. Many SEO blogs and print-on-demand guides (such as Printful/eRank community guides) retained the stale 2.07% figure.
* **Fee Base Confirmation:** Etsy assesses the Regulatory Operating Fee on the **gross item price plus buyer shipping and gift wrap** (+ personalization if charged). US sellers remain fully exempt (0.00%).

---

### Tool 2: Print-on-Demand (POD) Profit Calculator (`src/lib/formulas/pod-profit.ts`)
* **Inputs:** `retailPrice`, `productType`, `basePrintCost`, `shippingCharged`, `shippingCost`, `salesChannel` (`etsy` | `shopify` | `tiktok` | `ebay` | `custom`), `marketplaceFeePct`, `adSpendPerSale`, `targetMarginPct`.
* **Formulas:**
  - Channel Fee determined dynamically based on sales platform rules.
  - $\text{Total Outlay} = \text{basePrintCost} + \text{shippingCost} + \text{marketplaceFee} + \text{adSpendPerSale}$
  - $\text{Real Net Profit} = (\text{retailPrice} + \text{shippingCharged}) - \text{Total Outlay}$
  - $\text{ROI \%} = \frac{\text{Real Net Profit}}{\text{Total Outlay}} \times 100$

---

### Tool 3: TikTok Shop Fee Calculator (`src/lib/formulas/tiktok-fees.ts`)
* **Inputs:** `salePrice`, `shippingCharged`, `category`, `customReferralPct`, `creatorAffiliatePct`, `cogs`, `shippingCost`, `targetMarginPct`.
* **2026 Fee Structure:**
  - Category Referral Fee: $5.0\% - 6.0\% \times \text{salePrice}$
  - Flat Transaction Fee: $\$0.30$ per order
  - Creator Affiliate Commission: $\text{affiliatePct}\% \times \text{salePrice}$
* **Outputs:**
  - $\text{TikTok Bank Settlement} = (\text{salePrice} + \text{shippingCharged}) - (\text{referralFee} + \$0.30 + \text{affiliateCommission})$
  - $\text{Real Net Profit} = \text{TikTok Bank Settlement} - (\text{cogs} + \text{shippingCost})$
  - Break-Even & Target Margin pricing formulas taking creator commissions into account.

---

### Tool 4: Shopify Profit & ROAS Calculator (`src/lib/formulas/shopify-profit.ts`)
* **Inputs:** `itemPrice`, `shippingCharged`, `cogs`, `shippingCost`, `adSpend`, `shopifyPlan` (`basic` | `shopify` | `advanced` | `plus`), `gateway`, `targetMarginPct`.
* **Plan Tier Rates:**
  - Basic ($39/mo): 2.9% + $0.30 (3rd-party fee 2.0%)
  - Shopify ($105/mo): 2.7% + $0.30 (3rd-party fee 1.0%)
  - Advanced ($399/mo): 2.5% + $0.30 (3rd-party fee 0.6%)
  - Plus ($2300/mo): 2.15% + $0.30 (3rd-party fee 0.2%)
* **Key Metric:**
  - $\text{Break-Even ROAS} = \frac{\text{Gross Revenue}}{\text{Bank Payout} - (\text{cogs} + \text{shippingCost})}$, providing media buyers exact advertising target CPA.

---

### Tool 5: Marketplace Head-to-Head Comparison (`src/lib/formulas/platform-comparison.ts`)
* **Scope:** Side-by-side audit of Etsy vs. Shopify vs. TikTok Shop on identical items.
* **Volume Simulation:** Real-time projection of monthly orders (e.g. 25, 100, 250, 500) multiplied by 12 months, calculating the **Annual Extra Take-Home** gained by choosing the highest-margin sales channel.

---

### Tool 6: Stripe vs. PayPal Fee & Gross-Up Calculator (`src/lib/formulas/stripe-vs-paypal.ts`)
* **Dual Operation:**
  1. **Direct Mode:** User charges $\$X \to$ calculates processing fees and exact net bank deposit.
  2. **Gross-Up Mode:** User wants $\$X$ net $\to$ calculates client invoice amount:
     $$\text{Invoice Amount} = \frac{\text{Target Net} + \text{Fixed Fee}}{1 - \frac{\text{Rate \%}}{100}}$$
* **Rate Accuracy:**
  - Card checkout vs. Invoicing (PayPal Invoicing 2.99% vs Checkout 3.49%).
  - International card surcharge (+1.5%) and FX conversion spreads (+1.0% vs +3.0%).
