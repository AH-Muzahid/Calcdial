import Link from "next/link";
import { TOOLS, GUIDES } from "@/data/tools-registry";
import { JsonLd } from "@/components/seo/JsonLd";
import { EmailCapture } from "@/components/layout/EmailCapture";
import { AdSlot } from "@/components/layout/AdSlot";
import { formatDate } from "@/lib/utils";
import { FlipWords } from "@/components/motion/flip-words";
import { HeroDialDemo } from "@/components/home/HeroDialDemo";

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
      <section className="text-center py-10 sm:py-14 relative">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50/80 px-3.5 py-1 text-xs font-semibold text-emerald-800 shadow-xs mb-6">
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>2026 E-Commerce Fee Schedules Active</span>
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl max-w-4xl mx-auto leading-tight">
          Know Your Real Profit on{" "}
          <FlipWords
            before=""
            words={["Etsy.", "Shopify.", "TikTok Shop.", "Print-on-Demand."]}
            after="Before You Sell."
            wordClassName="text-emerald-600 font-extrabold underline decoration-emerald-300 decoration-wavy decoration-2 underline-offset-6"
            className="inline"
          />
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
          Zero tracking lag, 100% private client-side calculators. Test your listing price, calculate transaction commissions, and uncover hidden margins in seconds.
        </p>

        {/* Live Interactive Hero Dial Widget */}
        <HeroDialDemo />
      </section>

      {/* Did You Know? Data-Driven Fintech Insights */}
      <section className="my-12 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs transition hover:border-slate-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-600">
              Etsy Architecture
            </span>
            <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-mono font-bold text-amber-700">
              6.5% + 3% + $0.25
            </span>
          </div>
          <p className="mt-3 text-sm text-slate-700 leading-relaxed">
            Etsy deducts its 6.5% transaction commission on <strong>both item price AND buyer shipping charge</strong>, pushing total effective deductions to 15–20% on typical sales.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs transition hover:border-slate-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600">
              Shopify Gateways
            </span>
            <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-700">
              2.9% + $0.30
            </span>
          </div>
          <p className="mt-3 text-sm text-slate-700 leading-relaxed">
            Shopify Payments charges only <strong>2.9% + $0.30</strong> on Basic plans. However, third-party gateways trigger an additional 0.5% to 2.0% platform penalty fee.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs transition hover:border-slate-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600">
              TikTok Shop Rules
            </span>
            <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-mono font-bold text-indigo-700">
              5% - 6% Referral
            </span>
          </div>
          <p className="mt-3 text-sm text-slate-700 leading-relaxed">
            TikTok Shop category referral fees (5% to 6%) are taken directly from gross revenue <strong>before creator affiliate commissions</strong> and shipping deductions.
          </p>
        </div>
      </section>

      <AdSlot position="in-content" />

      {/* Tools Directory */}
      <section id="tools" className="my-16 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="size-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500">
                Precision Suite
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Merchant Fee & Profit Calculators
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Choose an engineered tool below. Each includes country presets, fee breakdowns, and exportable summaries.
            </p>
          </div>
          <span className="mt-3 sm:mt-0 text-xs font-mono font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full w-fit">
            6 Calculators Ready
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool) => (
            <div
              key={tool.slug}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition-all duration-300 hover:border-emerald-500/80 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                  <span className="font-mono text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {tool.isComparison ? "Comparison" : "Calculator"}
                  </span>
                  <span className="font-mono text-[11px]">{formatDate(tool.lastUpdated)}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  <Link href={`/tools/${tool.slug}`}>
                    {tool.title}
                  </Link>
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {tool.shortDescription}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-500">
                  {tool.pSEOPresets.length} presets
                </span>
                <Link
                  href={`/tools/${tool.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Dial in numbers</span>
                  <span className="font-mono">→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Seller Pillar Guides */}
      <section id="guides" className="my-16 scroll-mt-20">
        <div className="mb-8 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2 mb-1">
            <span className="size-2 rounded-full bg-slate-900" />
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500">
              Knowledge Base
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            In-Depth Merchant Guides
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Comprehensive strategies, pricing formulas, and policy breakdowns for 2026.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {GUIDES.map((guide) => (
            <article
              key={guide.slug}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition hover:border-slate-300 hover:shadow-md"
            >
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
                <span>{guide.estimatedReadMinutes} min read</span>
                <span>{formatDate(guide.publishedAt)}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                <Link href={`/guides/${guide.slug}`} className="hover:text-emerald-600">
                  {guide.title}
                </Link>
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                {guide.description}
              </p>
              <div className="mt-4">
                <Link
                  href={`/guides/${guide.slug}`}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1"
                >
                  <span>Read Full Guide</span>
                  <span className="font-mono">→</span>
                </Link>
              </div>
            </article>
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
