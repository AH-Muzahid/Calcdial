import Link from "next/link";
import { TOOLS, GUIDES } from "@/data/tools-registry";
import { JsonLd } from "@/components/seo/JsonLd";
import { EmailCapture } from "@/components/layout/EmailCapture";
import { AdSlot } from "@/components/layout/AdSlot";
import { formatDate } from "@/lib/utils";

export default function HomePage() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "CalcDial",
    url: "https://calcdial.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://calcdial.com/#tools",
      "query-input": "required name=search_term_string",
    },
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "CalcDial",
    url: "https://calcdial.com",
    logo: "https://calcdial.com/favicon.ico",
    description: "High-accuracy, client-side seller profit and platform fee calculators.",
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd data={websiteSchema} />
      <JsonLd data={organizationSchema} />

      {/* Hero Section */}
      <section className="text-center py-12 sm:py-16">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
          <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse"></span>
          2026 E-Commerce Fee Schedules Live
        </span>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          Know Your <span className="text-emerald-600">Real Profit</span> Before You Sell.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-gray-600 leading-relaxed">
          100% free, private, client-side fee calculators for Etsy, Shopify, TikTok Shop, and Print-on-Demand sellers. Never get surprised by hidden deductions.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/tools/etsy-fee-calculator"
            className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          >
            Launch Etsy Calculator &rarr;
          </Link>
          <Link
            href="/tools/etsy-vs-shopify-vs-tiktok-shop-calculator"
            className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-800 shadow-xs transition hover:bg-gray-50"
          >
            Compare All 3 Platforms
          </Link>
        </div>
      </section>

      {/* Did You Know? Data-Driven Fact Cards */}
      <section className="my-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Etsy Fact</span>
          <p className="mt-2 text-sm text-gray-700 leading-relaxed font-medium">
            Etsy takes 6.5% commission on your <strong>item price AND buyer shipping charge</strong>, pushing effective fees to 15–20% on typical orders.
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Shopify Fact</span>
          <p className="mt-2 text-sm text-gray-700 leading-relaxed font-medium">
            Shopify Payments charges only <strong>2.9% + $0.30</strong>, but using external gateways adds an extra 0.5% to 2.0% transaction fee.
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">TikTok Shop Fact</span>
          <p className="mt-2 text-sm text-gray-700 leading-relaxed font-medium">
            TikTok Shop category referral fees are now <strong>5% to 6%</strong>, deducted directly from gross revenue before creator affiliate cuts.
          </p>
        </div>
      </section>

      <AdSlot position="in-content" />

      {/* Tools Directory */}
      <section id="tools" className="my-16 scroll-mt-16">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Free Platform Fee Calculators
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Select a marketplace below for instant calculation and 10 country/gateway presets.
            </p>
          </div>
          <span className="mt-2 sm:mt-0 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full w-fit">
            Cluster A Live (Phase 1)
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool) => (
            <div
              key={tool.slug}
              className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-xs transition hover:border-emerald-500 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                  <span className="font-semibold text-emerald-700 uppercase tracking-wider">
                    {tool.isComparison ? "Comparison Engine" : "Calculator"}
                  </span>
                  <span>Updated {formatDate(tool.lastUpdated)}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  <Link href={`/tools/${tool.slug}`} className="hover:text-emerald-600">
                    {tool.title}
                  </Link>
                </h3>
                <p className="mt-2 text-xs text-gray-600 leading-relaxed line-clamp-3">
                  {tool.shortDescription}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] text-gray-500 font-medium">
                  {tool.pSEOPresets.length} Presets Available
                </span>
                <Link
                  href={`/tools/${tool.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                >
                  Calculate Now &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Supporting Guides Section */}
      <section id="guides" className="my-16 scroll-mt-16">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            In-Depth Seller Strategy Guides
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Learn the exact math and strategy behind seller fee optimization.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {GUIDES.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="group flex flex-col justify-between rounded-2xl border border-emerald-100 bg-emerald-50/30 p-6 transition hover:bg-emerald-50/70 hover:border-emerald-300"
            >
              <div>
                <div className="flex items-center gap-2 text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">
                  <span>Pillar Guide</span>
                  <span>•</span>
                  <span>{guide.estimatedReadMinutes} min read</span>
                </div>
                <h3 className="mt-2 text-lg font-bold text-gray-900 group-hover:text-emerald-700">
                  {guide.title}
                </h3>
                <p className="mt-2 text-xs text-gray-600 leading-relaxed line-clamp-3">
                  {guide.description}
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-emerald-600 group-hover:translate-x-1 transition">
                Read Master Guide &rarr;
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Email Capture Newsletter */}
      <EmailCapture source="homepage" />
    </div>
  );
}
