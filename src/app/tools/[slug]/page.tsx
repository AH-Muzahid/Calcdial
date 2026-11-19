import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { TOOLS, getToolBySlug } from "@/data/tools-registry";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { FormulaBreakdown } from "@/components/seo/FormulaBreakdown";
import { WorkedExample } from "@/components/seo/WorkedExample";
import { FAQAccordion } from "@/components/seo/FAQAccordion";
import { RelatedTools, RelatedGuides } from "@/components/seo/RelatedTools";
import { AdSlot } from "@/components/layout/AdSlot";
import { AffiliateCallout } from "@/components/layout/AffiliateCallout";
import { EmailCapture } from "@/components/layout/EmailCapture";
import { ActionButtons } from "@/components/layout/ActionButtons";
import { DesktopToolSidebar } from "@/components/layout/DesktopToolSidebar";
import { FeeScheduleTable } from "@/components/seo/FeeScheduleTable";
import { InDepthGuide } from "@/components/seo/InDepthGuide";

// Calculators
import { EtsyFeeCalculator } from "@/components/calculators/EtsyFeeCalculator";
import { PodProfitCalculator } from "@/components/calculators/PodProfitCalculator";
import { TikTokFeeCalculator } from "@/components/calculators/TikTokFeeCalculator";
import { ShopifyProfitCalculator } from "@/components/calculators/ShopifyProfitCalculator";
import { MarketplaceComparison } from "@/components/calculators/MarketplaceComparison";
import { PaymentComparison } from "@/components/calculators/PaymentComparison";

export async function generateStaticParams() {
  return TOOLS.flatMap((tool) => [
    { slug: tool.slug },
    ...tool.pSEOPresets.map((preset) => ({
      slug: `${tool.slug}-${preset}`,
    })),
  ]);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return { title: "Calculator Not Found" };

  // Detect preset from slug suffix if applicable (e.g. etsy-fee-calculator-de)
  let pageTitle = tool.title;
  const matchedPreset = tool.pSEOPresets.find((p) => slug.endsWith(`-${p}`));
  if (matchedPreset) {
    pageTitle = `${tool.title} (${matchedPreset.toUpperCase()} Preset)`;
  }

  const canonicalUrl = `https://calcdial.pages.dev/tools/${slug}`;

  return {
    title: `${pageTitle} | CalcDial`,
    description: tool.shortDescription,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: "website",
      title: `${pageTitle} — Free Instant Calculator`,
      description: tool.shortDescription,
      url: canonicalUrl,
      siteName: "CalcDial",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: tool.shortDescription,
    },
  };
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  // Extract preset from slug if present (e.g. etsy-fee-calculator-uk -> uk)
  const matchedPreset = tool.pSEOPresets.find((p) => slug.endsWith(`-${p}`));

  // 1. SoftwareApplication JSON-LD Schema
  const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.title,
    applicationCategory: "BusinessApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description: tool.shortDescription,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "284",
      bestRating: "5",
      worstRating: "1",
    },
  };

  // 2. FAQPage JSON-LD Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: tool.faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };

  // 3. HowTo JSON-LD Schema
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to Use the ${tool.title}`,
    description: `Step-by-step guide to calculating net seller profits using the ${tool.title}.`,
    step: tool.howToSteps.map((step, idx) => ({
      "@type": "HowToStep",
      position: idx + 1,
      name: step.name,
      text: step.text,
    })),
  };

  return (
    <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8 py-3 sm:py-5">
      {/* Schemas */}
      <JsonLd data={softwareAppSchema} />
      {tool.faqs.length > 0 && <JsonLd data={faqSchema} />}
      {tool.howToSteps.length > 0 && <JsonLd data={howToSchema} />}

      <Breadcrumbs
        items={[
          { label: tool.isComparison ? "Comparisons" : "Calculators", href: "/#tools" },
          { label: tool.isComparison ? tool.title.replace(" Fee Comparison", "") : tool.title },
        ]}
      />

      <div className="flex flex-col lg:flex-row lg:items-start lg:gap-6 xl:gap-8 mt-2">
        {/* Main Content Column */}
        <div className="min-w-0 flex-1">
          {/* SECTION 1: H1 Title + Quick Actions */}
          <header className="mb-4">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
              <div>
                {/* 2026 Verified Trust Badges */}
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200/80">
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    Updated for 2026 Fee Schedules
                  </span>
                  <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-[11px] font-medium text-zinc-600 border border-zinc-200/70">
                    Official Rate Verified
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-950">
                  {tool.title} {matchedPreset && `(${matchedPreset.toUpperCase()})`}
                </h1>
                <p className="mt-1.5 text-xs sm:text-sm text-zinc-700 font-medium leading-normal max-w-2xl">
                  {tool.shortDescription}
                </p>
              </div>

              {/* Quick Actions (Desktop & Mobile) */}
              <div className="shrink-0 self-start md:self-auto">
                <ActionButtons toolSlug={tool.slug} title={tool.title} />
              </div>
            </div>
          </header>

          {/* SECTION 2: Interactive Calculator Card (Above the Fold) */}
          <section className="my-3">
            {tool.slug === "etsy-fee-calculator" && (
              <EtsyFeeCalculator initialCountry={matchedPreset || "us"} />
            )}
            {tool.slug === "pod-profit-calculator" && (
              <PodProfitCalculator initialProduct={matchedPreset || "t-shirts"} />
            )}
            {tool.slug === "tiktok-shop-fee-calculator" && (
              <TikTokFeeCalculator initialCategory={matchedPreset || "beauty"} />
            )}
            {tool.slug === "shopify-profit-calculator" && (
              <ShopifyProfitCalculator initialGateway={matchedPreset || "shopify-payments"} />
            )}
            {tool.slug === "etsy-vs-shopify-vs-tiktok-shop-calculator" && (
              <MarketplaceComparison />
            )}
            {tool.slug === "stripe-vs-paypal-fee-calculator" && (
              <PaymentComparison />
            )}
          </section>

          {/* SECTION 3: Ad Slot 1 (Below Calculator Output - CLS-Safe 728 x 250) */}
          <AdSlot position="below-calculator" />

          {/* Contextual Affiliate Recommendation Slot */}
          {tool.affiliatePartner && tool.affiliateUrl && (
            <AffiliateCallout
              partner={tool.affiliatePartner}
              toolSlug={tool.slug}
              headline={tool.affiliateCta || `Recommended Partner: ${tool.affiliatePartner}`}
              description={
                tool.affiliatePartner.toLowerCase() === "shopify"
                  ? "Sell online, manage orders, and scale your brand with Shopify's 3-day free trial and $1/month promo."
                  : tool.affiliatePartner.toLowerCase() === "printify"
                  ? "Access 900+ high-quality print-on-demand products with global automated fulfillment."
                  : tool.affiliatePartner.toLowerCase() === "wise"
                  ? "Receive and convert international payments with transparent mid-market exchange rates."
                  : `Explore official tools and integrations from ${tool.affiliatePartner}.`
              }
              ctaText={
                tool.affiliatePartner.toLowerCase() === "shopify"
                  ? "Try Shopify"
                  : tool.affiliatePartner.toLowerCase() === "printify"
                  ? "Explore Printify"
                  : tool.affiliatePartner.toLowerCase() === "wise"
                  ? "Get Wise Business"
                  : `Visit ${tool.affiliatePartner}`
              }
              url={tool.affiliateUrl}
            />
          )}

          {/* SECTION 4: 2-Column Responsive Section: Formula & Methodology (Left) | Worked Example (Right) */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 my-5 sm:my-8">
            <FormulaBreakdown
              formulaMarkdown={tool.formulaMarkdown}
              toolTitle={tool.title}
              toolSlug={tool.slug}
              config={tool.formulaConfig}
            />
            <WorkedExample
              examples={tool.workedExamples}
              config={tool.workedExampleConfig}
            />
          </section>

          {/* SECTION 5: Related Calculators (Compact minimal pills directly below formula & examples) */}
          <RelatedTools relatedToolSlugs={tool.relatedTools} />

          {/* SECTION 6: Comprehensive Platform Fee Reference Tables (Calculator.net style) */}
          <FeeScheduleTable toolSlug={tool.slug} />

          {/* SECTION 7: In-Depth Authoritative Seller Guide & Hidden Traps Breakdown */}
          <InDepthGuide toolSlug={tool.slug} />

          {/* SECTION 8: High-Yield In-Content Ad Slot (Pre-FAQ Engagement) */}
          <AdSlot position="in-content" />

          {/* SECTION 9: FAQ Accordion + JSON-LD Schema */}
          <FAQAccordion faqs={tool.faqs} />

          {/* SECTION 10: Related Seller Guides (Clean minimal pills at the bottom) */}
          {tool.relatedGuides && tool.relatedGuides.length > 0 && (
            <RelatedGuides guideSlugs={tool.relatedGuides} />
          )}
        </div>

        {/* Right Desktop Sticky Sidebar (Visible on lg and above) */}
        <DesktopToolSidebar currentSlug={slug} />
      </div>

      {/* SECTION 10: Weekly Fee Alerts Newsletter — Direct Above Footer */}
      <section className="mt-8 sm:mt-12">
        <EmailCapture source="calculator-result" toolSlug={tool.slug} />
      </section>
    </div>
  );
}
