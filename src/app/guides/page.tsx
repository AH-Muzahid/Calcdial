import type { Metadata } from "next";
import { GuidesDirectory } from "@/components/directory/GuidesDirectory";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { EmailCapture } from "@/components/layout/EmailCapture";

export const metadata: Metadata = {
  title: "Seller Guides & Platform Fee Strategies",
  description:
    "In-depth seller fee masterclasses, margin defense strategies, and payment gross-up tutorials verified for 2026. Avoid hidden platform deductions on Etsy, Shopify, TikTok, and Stripe.",
  alternates: {
    canonical: "https://calcdial.com/guides/",
  },
  openGraph: {
    title: "Seller Guides & Platform Fee Strategies",
    description:
      "Actionable e-commerce and seller guides: Etsy fee schedules, Shopify vs. TikTok comparisons, POD margin rules, and invoice gross-up formulas.",
    url: "https://calcdial.com/guides/",
    siteName: "CalcDial",
    type: "website",
  },
};

export default function GuidesPage() {
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Seller Guides & Fee Strategies",
    description:
      "A curated collection of verified guides explaining seller fees, margin protection, and payment processing.",
    url: "https://calcdial.com/guides/",
    publisher: {
      "@type": "Organization",
      name: "CalcDial",
      url: "https://calcdial.com",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://calcdial.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Guides",
        item: "https://calcdial.com/guides/",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <JsonLd data={collectionSchema} />
      <JsonLd data={breadcrumbSchema} />

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Guides" }]} />

        {/* Page Hero Header */}
        <header className="mb-8 pt-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-950 font-sans">
            Seller Guides & Fee Strategies
          </h1>
          <p className="mt-1.5 text-sm sm:text-base text-zinc-500 font-normal leading-relaxed max-w-2xl">
            Verified fee schedules, margin defense playbooks, and payment gross-up tutorials for online merchants.
          </p>
        </header>

        {/* Interactive Guides Directory */}
        <GuidesDirectory />

        {/* Newsletter Section */}
        <section className="mt-16 sm:mt-20">
          <EmailCapture source="guide-footer" />
        </section>
      </div>
    </div>
  );
}
