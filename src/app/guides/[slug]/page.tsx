import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { DETAILED_GUIDES } from "@/content/guides/guide-data";
import { GUIDES } from "@/data/tools-registry";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { FAQAccordion } from "@/components/seo/FAQAccordion";
import { AdSlot } from "@/components/layout/AdSlot";
import { EmailCapture } from "@/components/layout/EmailCapture";
import { EtsyFeeCalculator } from "@/components/calculators/EtsyFeeCalculator";
import { MarketplaceComparison } from "@/components/calculators/MarketplaceComparison";
import { PodProfitCalculator } from "@/components/calculators/PodProfitCalculator";
import { PaymentComparison } from "@/components/calculators/PaymentComparison";
import { ShopifyProfitCalculator } from "@/components/calculators/ShopifyProfitCalculator";
import { TikTokFeeCalculator } from "@/components/calculators/TikTokFeeCalculator";

export async function generateStaticParams() {
  return GUIDES.map((guide) => ({
    slug: guide.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = DETAILED_GUIDES[slug];
  if (!guide) return { title: "Guide Not Found" };

  const canonicalUrl = `https://calcdial.com/guides/${slug}`;

  return {
    title: `${guide.title} | CalcDial`,
    description: guide.metaDescription,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: "article",
      title: guide.title,
      description: guide.metaDescription,
      url: canonicalUrl,
      publishedTime: guide.publishedAt,
      modifiedTime: guide.updatedAt,
      authors: [guide.author],
    },
    twitter: {
      card: "summary_large_image",
      title: guide.title,
      description: guide.metaDescription,
    },
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = DETAILED_GUIDES[slug];
  if (!guide) notFound();

  // Article JSON-LD Schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.metaDescription,
    author: {
      "@type": "Organization",
      name: guide.author,
    },
    publisher: {
      "@type": "Organization",
      name: "CalcDial",
      logo: {
        "@type": "ImageObject",
        url: "https://calcdial.com/favicon.ico",
      },
    },
    datePublished: guide.publishedAt,
    dateModified: guide.updatedAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://calcdial.com/guides/${slug}`,
    },
  };

  // FAQPage JSON-LD Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: guide.faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };

  return (
    <article className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd data={articleSchema} />
      {guide.faqs.length > 0 && <JsonLd data={faqSchema} />}

      <Breadcrumbs
        items={[
          { label: "Guides", href: "/guides" },
          { label: guide.title },
        ]}
      />

      <header className="border-b border-zinc-200/90 pb-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200/80 bg-zinc-100/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-zinc-600">
          <span>Seller Masterclass</span>
          <span className="text-zinc-400">•</span>
          <span>{guide.readTime}</span>
        </div>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl leading-tight">
          {guide.title}
        </h1>
        <p className="mt-3 text-base text-zinc-600 leading-relaxed">
          {guide.subtitle}
        </p>
        <div className="mt-4 flex items-center gap-3 text-xs text-zinc-500">
          <span>By {guide.author}</span>
          <span>•</span>
          <span>Updated {new Date(guide.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
        </div>
      </header>

      {/* Table of Contents */}
      <nav aria-label="Table of contents" className="my-6 rounded-2xl border border-zinc-200 bg-zinc-50/70 p-4 sm:p-5 print:hidden">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
          In This Guide
        </h2>
        <ul className="mt-2.5 space-y-1.5 text-xs sm:text-sm text-zinc-700 font-medium">
          {guide.sections.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="hover:text-zinc-950 hover:underline transition-colors">
                {s.title}
              </a>
            </li>
          ))}
          <li>
            <a href="#interactive-tool" className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700 hover:underline">
              <span>Interactive Calculator</span>
              <span>&rarr;</span>
            </a>
          </li>
          <li>
            <a href="#frequently-asked-questions" className="hover:text-zinc-950 hover:underline transition-colors">
              Frequently Asked Questions
            </a>
          </li>
        </ul>
      </nav>

      <AdSlot position="in-content" />

      {/* Guide Editorial Sections */}
      <div className="space-y-8 text-base text-zinc-700 leading-relaxed">
        {guide.sections.map((sec) => (
          <section key={sec.id} id={sec.id} className="scroll-mt-20">
            <h2 className="text-xl font-bold text-zinc-950 mb-3">{sec.title}</h2>
            {sec.content.map((p, pIdx) => (
              <p key={pIdx} className="mb-3">
                {p}
              </p>
            ))}
          </section>
        ))}
      </div>

      {/* Embedded Mini-Calculator */}
      <section id="interactive-tool" className="my-10 scroll-mt-20">
        <div className="rounded-2xl border border-zinc-200/90 bg-white p-3.5 sm:p-5 shadow-xs">
          <div className="mb-4 px-1">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-zinc-700">
              Live Calculator Tool
            </span>
            <h3 className="mt-1.5 text-lg font-bold text-zinc-950">
              Try It with Your Product Numbers
            </h3>
          </div>
          {guide.primaryToolSlug === "etsy-fee-calculator" && <EtsyFeeCalculator isEmbed={true} />}
          {guide.primaryToolSlug === "shopify-profit-calculator" && (
            <ShopifyProfitCalculator isEmbed={true} />
          )}
          {guide.primaryToolSlug === "tiktok-shop-fee-calculator" && (
            <TikTokFeeCalculator isEmbed={true} />
          )}
          {guide.primaryToolSlug === "etsy-vs-shopify-vs-tiktok-shop-calculator" && (
            <MarketplaceComparison isEmbed={true} />
          )}
          {guide.primaryToolSlug === "pod-profit-calculator" && <PodProfitCalculator isEmbed={true} />}
          {guide.primaryToolSlug === "stripe-vs-paypal-fee-calculator" && (
            <PaymentComparison isEmbed={true} />
          )}
        </div>
      </section>

      {/* Mid-Guide Ad Placement */}
      <AdSlot position="in-content" />

      {/* Frequently Asked Questions */}
      <div id="frequently-asked-questions" className="scroll-mt-20">
        <FAQAccordion faqs={guide.faqs} />
      </div>

      {/* Contextual Link to Full Calculator */}
      <div className="my-8 rounded-2xl border border-zinc-200 bg-zinc-50/80 p-6 sm:p-7 text-center print:hidden">
        <h3 className="text-base font-bold text-zinc-950">Need more advanced options or country presets?</h3>
        <p className="mt-1 text-xs sm:text-sm text-zinc-600">
          Open the full standalone calculator for additional currencies and worked examples.
        </p>
        <Link
          href={`/tools/${guide.primaryToolSlug}`}
          prefetch={false}
          className="mt-3.5 inline-flex items-center gap-1.5 rounded-xl bg-zinc-950 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-zinc-800 transition-colors"
        >
          Open Full Calculator &rarr;
        </Link>
      </div>

      <EmailCapture source="guide-footer" toolSlug={guide.primaryToolSlug} />
    </article>
  );
}
