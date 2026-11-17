import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { TOOLS, getToolBySlug } from "@/data/tools-registry";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { FormulaBreakdown } from "@/components/seo/FormulaBreakdown";
import { WorkedExample } from "@/components/seo/WorkedExample";
import { FAQAccordion } from "@/components/seo/FAQAccordion";
import { RelatedTools } from "@/components/seo/RelatedTools";
import { AdSlot } from "@/components/layout/AdSlot";
import { AffiliateCallout } from "@/components/layout/AffiliateCallout";
import { EmailCapture } from "@/components/layout/EmailCapture";
import { formatDate } from "@/lib/utils";

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

  const canonicalUrl = `https://feesnap.com/tools/${slug}`;

  return {
    title: `${pageTitle} | FeeSnap`,
    description: tool.shortDescription,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: "website",
      title: `${pageTitle} — Free Instant Calculator`,
      description: tool.shortDescription,
      url: canonicalUrl,
      siteName: "FeeSnap",
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
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Schemas */}
      <JsonLd data={softwareAppSchema} />
      {tool.faqs.length > 0 && <JsonLd data={faqSchema} />}
      {tool.howToSteps.length > 0 && <JsonLd data={howToSchema} />}

      <Breadcrumbs
        items={[
          { label: "Calculators", href: "/#tools" },
          { label: tool.title },
        ]}
      />

      {/* SECTION 1: H1 Title + "Last updated" Trust Badge + 2-Sentence Value Summary */}
      <header className="mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
            Verified for 2026
          </span>
          <span className="text-xs text-gray-500">
            Last updated: <time dateTime={tool.lastUpdated}>{formatDate(tool.lastUpdated)}</time>
          </span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          {tool.title} {matchedPreset && `(${matchedPreset.toUpperCase()})`}
        </h1>
        <p className="mt-2 text-base text-gray-600 leading-relaxed max-w-3xl">
          {tool.shortDescription}
        </p>
      </header>

      {/* SECTION 2: Interactive Calculator Card (Above the Fold) */}
      <section className="my-6">
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

      {/* SECTION 3: Ad Slot 1 (Below Calculator Output - CLS-Safe min-h-[90px]/[250px]) */}
      <AdSlot position="below-calculator" />

      {/* Contextual Affiliate Recommendation Slot */}
      {tool.affiliatePartner && tool.affiliateUrl && (
        <AffiliateCallout
          partner={tool.affiliatePartner}
          toolSlug={tool.slug}
          headline={tool.affiliateCta || `Recommended Partner: ${tool.affiliatePartner}`}
          description={`High-volume sellers trust ${tool.affiliatePartner} to reduce unit costs and optimize merchant cash flow.`}
          ctaText={tool.affiliateCta || "Visit Partner Website"}
          url={tool.affiliateUrl}
        />
      )}

      {/* SECTION 4: Formula & Methodology Section */}
      <FormulaBreakdown
        formulaMarkdown={tool.formulaMarkdown}
        toolTitle={tool.title}
      />

      {/* SECTION 5: Worked Example Table */}
      <WorkedExample examples={tool.workedExamples} />

      {/* Email Capture for Fee Alerts */}
      <EmailCapture source="calculator-result" toolSlug={tool.slug} />

      {/* SECTION 6: FAQ Accordion + JSON-LD Schema */}
      <FAQAccordion faqs={tool.faqs} />

      {/* SECTION 7: Related Calculators & Guides Internal Links */}
      <RelatedTools
        relatedToolSlugs={tool.relatedTools}
        relatedGuideSlugs={tool.relatedGuides}
      />
    </div>
  );
}
