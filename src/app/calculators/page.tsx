import type { Metadata } from "next";
import { CalculatorsDirectory } from "@/components/directory/CalculatorsDirectory";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { EmailCapture } from "@/components/layout/EmailCapture";

export const metadata: Metadata = {
  title: "All Seller Profit & Fee Calculators | CalcDial",
  description:
    "Explore our complete suite of client-side seller fee and profit margin calculators for Etsy, Shopify, TikTok Shop, Print-on-Demand, Stripe, and PayPal.",
  alternates: {
    canonical: "https://calcdial.com/calculators/",
  },
  openGraph: {
    title: "All Seller Profit & Fee Calculators | CalcDial",
    description:
      "High-accuracy, client-side seller fee and profit calculators for e-commerce, handmade, POD, and payment processing.",
    url: "https://calcdial.com/calculators/",
    siteName: "CalcDial",
    type: "website",
  },
};

export default function CalculatorsPage() {
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Seller Profit & Fee Calculators",
    description:
      "A complete directory of verified 2026 e-commerce fee and profit margin calculators.",
    url: "https://calcdial.com/calculators/",
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
        name: "Calculators",
        item: "https://calcdial.com/calculators/",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <JsonLd data={collectionSchema} />
      <JsonLd data={breadcrumbSchema} />

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Calculators" }]} />

        {/* Page Hero Header */}
        <header className="mb-8 pt-2">
          {/* Trust Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200/80">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              2026 Rate Schedules Verified
            </span>
            <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-[11px] font-medium text-zinc-600 border border-zinc-200/70">
              Zero Data Logging • 100% Client-Side
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-950 font-sans">
            Seller Profit & Fee Calculators
          </h1>
          <p className="mt-2 text-sm sm:text-base text-zinc-600 font-normal leading-relaxed max-w-3xl">
            Precision financial calculators designed for e-commerce store owners, marketplace sellers, and creators. Model transaction cuts, platform referral commissions, and hidden deductions before you price.
          </p>
        </header>

        {/* Interactive Directory with Search & Category Filters */}
        <CalculatorsDirectory />

        {/* Newsletter Section */}
        <section className="mt-16 sm:mt-20">
          <EmailCapture source="homepage" />
        </section>
      </div>
    </div>
  );
}
