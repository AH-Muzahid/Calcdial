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

  const canonicalUrl = `https://feesnap.com/guides/${slug}`;

  return {
    title: `${guide.title} | FeeSnap`,
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
      name: "FeeSnap",
      logo: {
        "@type": "ImageObject",
        url: "https://feesnap.com/favicon.ico",
      },
    },
    datePublished: guide.publishedAt,
    dateModified: guide.updatedAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://feesnap.com/guides/${slug}`,
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
          { label: "Guides", href: "/#guides" },
          { label: guide.title },
        ]}
      />

      <header className="border-b border-gray-200 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-700">
          <span>Seller Masterclass</span>
          <span>•</span>
          <span>{guide.readTime}</span>
        </div>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl leading-tight">
          {guide.title}
        </h1>
        <p className="mt-3 text-base text-gray-600 leading-relaxed">
          {guide.subtitle}
        </p>
        <div className="mt-4 flex items-center gap-3 text-xs text-gray-500">
          <span>By {guide.author}</span>
          <span>•</span>
          <span>Updated {new Date(guide.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
        </div>
      </header>

      {/* Table of Contents */}
      <nav aria-label="Table of contents" className="my-6 rounded-xl border border-gray-200 bg-gray-50/70 p-4 print:hidden">
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">
          In This Guide
        </h2>
        <ul className="mt-2 space-y-1.5 text-xs sm:text-sm text-emerald-800 font-medium">
          {guide.sections.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="hover:underline">
                {s.title}
              </a>
            </li>
          ))}
          <li>
            <a href="#interactive-tool" className="hover:underline font-bold text-emerald-700">
              Interactive Calculator &rarr;
            </a>
          </li>
          <li>
            <a href="#frequently-asked-questions" className="hover:underline">
              Frequently Asked Questions
            </a>
          </li>
        </ul>
      </nav>

      <AdSlot position="in-content" />

      {/* Guide Editorial Sections */}
      <div className="space-y-8 text-base text-gray-700 leading-relaxed">
        {guide.sections.map((sec) => (
          <section key={sec.id} id={sec.id} className="scroll-mt-20">
            <h2 className="text-xl font-bold text-gray-900 mb-3">{sec.title}</h2>
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
        <div className="rounded-2xl border-2 border-emerald-500/30 bg-emerald-50/30 p-2 sm:p-4">
          <div className="mb-3 px-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Live Calculator Tool
            </span>
            <h3 className="text-lg font-bold text-gray-900">
              Try It with Your Product Numbers
            </h3>
          </div>
          {guide.primaryToolSlug === "etsy-fee-calculator" && <EtsyFeeCalculator isEmbed={true} />}
          {guide.primaryToolSlug === "etsy-vs-shopify-vs-tiktok-shop-calculator" && (
            <MarketplaceComparison isEmbed={true} />
          )}
          {guide.primaryToolSlug === "pod-profit-calculator" && <PodProfitCalculator isEmbed={true} />}
          {guide.primaryToolSlug === "stripe-vs-paypal-fee-calculator" && (
            <PaymentComparison isEmbed={true} />
          )}
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <div id="frequently-asked-questions" className="scroll-mt-20">
        <FAQAccordion faqs={guide.faqs} />
      </div>

      {/* Contextual Link to Full Calculator */}
      <div className="my-8 rounded-xl border border-gray-200 bg-gray-50 p-6 text-center print:hidden">
        <h3 className="text-base font-bold text-gray-900">Need more advanced options or country presets?</h3>
        <p className="mt-1 text-xs text-gray-600">
          Open the full standalone calculator for additional currencies and worked examples.
        </p>
        <Link
          href={`/tools/${guide.primaryToolSlug}`}
          className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700"
        >
          Open Full Calculator &rarr;
        </Link>
      </div>

      <EmailCapture source="guide-footer" toolSlug={guide.primaryToolSlug} />
    </article>
  );
}
