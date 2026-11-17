import Link from "next/link";
import { TOOLS, GUIDES } from "@/data/tools-registry";
import { JsonLd } from "@/components/seo/JsonLd";
import { EmailCapture } from "@/components/layout/EmailCapture";
import { AdSlot } from "@/components/layout/AdSlot";
import { ToolsDirectory } from "@/components/home/ToolsDirectory";
import { formatDate } from "@/lib/utils";
import { ShimmerText } from "@/components/motion/shimmer-text";

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
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <JsonLd data={websiteSchema} />
      <JsonLd data={organizationSchema} />

      {/* Hero Header: Clean, Punchy, Toolhub-Style */}
      <section className="pt-4 pb-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3.5 py-1 text-xs font-mono text-zinc-900 shadow-2xs mb-4">
          <span className="size-1.5 rounded-full bg-emerald-600" />
          <ShimmerText text="2026 E-COMMERCE FEE SCHEDULES ACTIVE" className="font-semibold text-[11px] tracking-wider text-zinc-900" />
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-950 leading-tight max-w-4xl">
          E-Commerce Profit & Fee Calculators
        </h1>

        <p className="mt-3 text-sm sm:text-base text-zinc-500 max-w-2xl leading-relaxed">
          Instant, 100% private client-side calculators for Etsy, Shopify, TikTok Shop, and Print-on-Demand sellers. Test your listing price, calculate transaction commissions, and uncover hidden margins before you sell.
        </p>
      </section>

      {/* Directory Search & Filterable Calculator Grid (Toolhub Pattern) */}
      <ToolsDirectory tools={TOOLS} />

      {/* Ad Placement */}
      <AdSlot position="in-content" />

      {/* Fintech Insights: Fee Traps Sellers Miss */}
      <section className="my-12">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="size-1.5 rounded-full bg-zinc-950" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
              Platform Economics
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950">
            Hidden Platform Fee Traps to Watch in 2026
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-900">
                Etsy Architecture
              </span>
              <span className="rounded-full bg-zinc-100 border border-zinc-200 px-2.5 py-0.5 text-[10px] font-mono font-medium text-zinc-800">
                6.5% + 3% + $0.25
              </span>
            </div>
            <p className="mt-3 text-sm text-zinc-600 leading-relaxed">
              Etsy deducts its 6.5% transaction commission on <strong>both item price AND buyer shipping charge</strong>, pushing total effective deductions to 15–20% on typical sales.
            </p>
            <div className="mt-4 pt-3 border-t border-zinc-100">
              <Link
                href="/tools/etsy-fee-calculator"
                className="inline-flex items-center gap-1 text-xs font-mono font-medium text-zinc-900 hover:underline"
              >
                <span>Test Etsy listing</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-900">
                Shopify Gateways
              </span>
              <span className="rounded-full bg-zinc-100 border border-zinc-200 px-2.5 py-0.5 text-[10px] font-mono font-medium text-zinc-800">
                2.9% + $0.30
              </span>
            </div>
            <p className="mt-3 text-sm text-zinc-600 leading-relaxed">
              Shopify Payments charges <strong>2.9% + $0.30</strong> on Basic plans. Third-party gateways trigger an additional 0.5% to 2.0% platform penalty fee unless using Shopify Payments.
            </p>
            <div className="mt-4 pt-3 border-t border-zinc-100">
              <Link
                href="/tools/shopify-profit-calculator"
                className="inline-flex items-center gap-1 text-xs font-mono font-medium text-zinc-900 hover:underline"
              >
                <span>Calculate Shopify profit</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-900">
                TikTok Shop Rules
              </span>
              <span className="rounded-full bg-zinc-100 border border-zinc-200 px-2.5 py-0.5 text-[10px] font-mono font-medium text-zinc-800">
                5% - 6% Referral
              </span>
            </div>
            <p className="mt-3 text-sm text-zinc-600 leading-relaxed">
              TikTok Shop category referral fees (5% to 6%) are taken directly from gross customer revenue <strong>before creator affiliate commissions</strong> and shipping deductions.
            </p>
            <div className="mt-4 pt-3 border-t border-zinc-100">
              <Link
                href="/tools/tiktok-shop-fee-calculator"
                className="inline-flex items-center gap-1 text-xs font-mono font-medium text-zinc-900 hover:underline"
              >
                <span>Calculate TikTok cuts</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Seller Pillar Guides */}
      <section id="guides" className="my-16 scroll-mt-24">
        <div className="mb-8 pb-4 border-b border-zinc-200">
          <div className="flex items-center gap-2 mb-1">
            <span className="size-1.5 rounded-full bg-zinc-950" />
            <span className="text-xs font-mono font-medium uppercase tracking-wider text-zinc-500">
              Knowledge Base
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">
            In-Depth Merchant Guides
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Comprehensive strategies, pricing formulas, and policy breakdowns for 2026.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {GUIDES.map((guide) => (
            <div
              key={guide.slug}
              className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs transition-all hover:border-zinc-300"
            >
              <div className="flex items-center justify-between text-xs text-zinc-400 mb-2 font-mono">
                <span>{guide.estimatedReadMinutes} min read</span>
                <span>{formatDate(guide.publishedAt)}</span>
              </div>
              <h3 className="text-lg font-bold text-zinc-950">
                <Link href={`/guides/${guide.slug}`} className="hover:underline">
                  {guide.title}
                </Link>
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-zinc-500 leading-relaxed">
                {guide.description}
              </p>
              <div className="mt-4 pt-3 border-t border-zinc-100">
                <Link
                  href={`/guides/${guide.slug}`}
                  className="text-xs font-mono font-medium text-zinc-950 hover:underline inline-flex items-center gap-1"
                >
                  <span>Read Full Guide</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Email Capture Newsletter */}
      <section className="my-16">
        <EmailCapture source="homepage" />
      </section>
    </div>
  );
}
