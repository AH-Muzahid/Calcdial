import type { Metadata } from "next";
import { ComparisonsDirectory } from "@/components/directory/ComparisonsDirectory";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { EmailCapture } from "@/components/layout/EmailCapture";

export const metadata: Metadata = {
  title: "Multi-Platform & Gateway Fee Comparisons | CalcDial",
  description:
    "Compare seller fees side-by-side across Etsy, Shopify, and TikTok Shop, or evaluate payment processor take rates between Stripe and PayPal with invoice gross-up calculations.",
  alternates: {
    canonical: "https://calcdial.com/comparisons/",
  },
  openGraph: {
    title: "Multi-Platform & Gateway Fee Comparisons | CalcDial",
    description:
      "Interactive head-to-head comparison engines: Etsy vs. Shopify vs. TikTok Shop margins, and Stripe vs. PayPal invoice gross-up calculator.",
    url: "https://calcdial.com/comparisons/",
    siteName: "CalcDial",
    type: "website",
  },
};

export default function ComparisonsPage() {
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Multi-Platform & Gateway Fee Comparisons",
    description:
      "Interactive side-by-side comparison calculators for e-commerce marketplaces and payment processors.",
    url: "https://calcdial.com/comparisons/",
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
        name: "Comparisons",
        item: "https://calcdial.com/comparisons/",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <JsonLd data={collectionSchema} />
      <JsonLd data={breadcrumbSchema} />

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Comparisons" }]} />

        {/* Page Hero Header */}
        <header className="mb-8 pt-2">
          {/* Trust Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700 border border-blue-200/80">
              <span className="size-1.5 rounded-full bg-blue-500" />
              Side-by-Side Fee Modeling
            </span>
            <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-[11px] font-medium text-zinc-600 border border-zinc-200/70">
              Real-time Profit Winner Algorithm
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-950 font-sans">
            Platform & Gateway Comparisons
          </h1>
          <p className="mt-2 text-sm sm:text-base text-zinc-600 font-normal leading-relaxed max-w-3xl">
            Simulate actual order revenues across competing channels. Discover real net take-home differences between marketplaces and independent storefronts, and compare payment gateway fee structures before you send client invoices.
          </p>
        </header>

        {/* Interactive Comparison Directory */}
        <ComparisonsDirectory />

        {/* Newsletter Section */}
        <section className="mt-16 sm:mt-20">
          <EmailCapture source="homepage" />
        </section>
      </div>
    </div>
  );
}
