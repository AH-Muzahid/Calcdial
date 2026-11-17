import Link from "next/link";
import { TOOLS, GUIDES } from "@/data/tools-registry";
import { JsonLd } from "@/components/seo/JsonLd";
import { EmailCapture } from "@/components/layout/EmailCapture";
import { AdSlot } from "@/components/layout/AdSlot";
import { formatDate } from "@/lib/utils";
import { FlipWords } from "@/components/motion/flip-words";
import { HeroDialDemo } from "@/components/home/HeroDialDemo";
import { BlurText } from "@/components/motion/blur-text";
import { TiltCard } from "@/components/motion/tilt-card";
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

      {/* Hero Section */}
      <section className="text-center py-8 sm:py-14 relative">
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3.5 py-1 text-xs font-mono text-zinc-900 shadow-2xs mb-6">
          <span className="size-1.5 rounded-full bg-zinc-950" />
          <ShimmerText text="2026 E-COMMERCE FEE SCHEDULES ACTIVE" className="font-semibold text-[11px] tracking-wider text-zinc-900" />
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-950 max-w-4xl mx-auto leading-[1.12]">
          Know Your Real Profit Before You Sell.
        </h1>

        <div className="mt-4 flex items-center justify-center gap-2 text-xs sm:text-sm font-medium text-zinc-500">
          <span>Accurate fee schedules for</span>
          <span className="inline-flex items-center rounded-full bg-zinc-100 border border-zinc-200/80 px-3 py-1 text-zinc-950 font-semibold font-mono text-xs sm:text-sm shadow-2xs">
            <FlipWords
              words={["Etsy Sellers", "Shopify Stores", "TikTok Shops", "Print-on-Demand"]}
              className="inline-flex items-center"
              wordClassName="text-zinc-950 font-bold"
            />
          </span>
        </div>

        <div className="mx-auto mt-4 max-w-2xl">
          <BlurText
            text="Zero tracking lag, 100% private client-side calculators. Test your listing price, calculate transaction commissions, and uncover hidden margins in seconds."
            as="p"
            className="text-base sm:text-lg text-zinc-500 leading-relaxed font-normal"
            delay={0.1}
          />
        </div>

        {/* Live Interactive Hero Dial Widget */}
        <HeroDialDemo />

        {/* Subtle scroll cue to tools */}
        <div className="mt-8 flex justify-center">
          <a
            href="#tools"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-zinc-950 transition-colors"
          >
            <span>Explore All 6 Calculators</span>
            <span className="font-mono">↓</span>
          </a>
        </div>
      </section>

      {/* Did You Know? Data-Driven Fintech Insights with 3D TiltCards */}
      <section className="my-12 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <TiltCard
          maxTilt={6}
          hoverScale={1.01}
          glareOpacity={0.1}
          className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs transition-colors hover:border-zinc-400"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-900">
              Etsy Architecture
            </span>
            <span className="rounded-full bg-zinc-100 border border-zinc-200/70 px-2.5 py-0.5 text-[10px] font-mono font-medium text-zinc-800">
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
        </TiltCard>

        <TiltCard
          maxTilt={6}
          hoverScale={1.01}
          glareOpacity={0.1}
          className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs transition-colors hover:border-zinc-400"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-900">
              Shopify Gateways
            </span>
            <span className="rounded-full bg-zinc-100 border border-zinc-200/70 px-2.5 py-0.5 text-[10px] font-mono font-medium text-zinc-800">
              2.9% + $0.30
            </span>
          </div>
          <p className="mt-3 text-sm text-zinc-600 leading-relaxed">
            Shopify Payments charges only <strong>2.9% + $0.30</strong> on Basic plans. However, third-party gateways trigger an additional 0.5% to 2.0% platform penalty fee.
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
        </TiltCard>

        <TiltCard
          maxTilt={6}
          hoverScale={1.01}
          glareOpacity={0.1}
          className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs transition-colors hover:border-zinc-400"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-900">
              TikTok Shop Rules
            </span>
            <span className="rounded-full bg-zinc-100 border border-zinc-200/70 px-2.5 py-0.5 text-[10px] font-mono font-medium text-zinc-800">
              5% - 6% Referral
            </span>
          </div>
          <p className="mt-3 text-sm text-zinc-600 leading-relaxed">
            TikTok Shop category referral fees (5% to 6%) are taken directly from gross revenue <strong>before creator affiliate commissions</strong> and shipping deductions.
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
        </TiltCard>
      </section>

      <AdSlot position="in-content" />

      {/* Tools Directory */}
      <section id="tools" className="my-16 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8 pb-4 border-b border-zinc-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="size-1.5 rounded-full bg-zinc-950" />
              <span className="text-xs font-mono font-medium uppercase tracking-wider text-zinc-500">
                Precision Suite
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">
              Merchant Fee & Profit Calculators
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Choose an engineered tool below. Each includes country presets, fee breakdowns, and exportable summaries.
            </p>
          </div>
          <span className="mt-3 sm:mt-0 text-xs font-mono font-medium text-zinc-900 bg-zinc-100 border border-zinc-200 px-3 py-1 rounded-full w-fit">
            6 Calculators Ready
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool) => (
            <TiltCard
              key={tool.slug}
              maxTilt={5}
              hoverScale={1.01}
              glareOpacity={0.1}
              className="group flex flex-col justify-between rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs transition-colors hover:border-zinc-400"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-zinc-400 mb-3">
                  <span className="font-mono text-[11px] font-medium text-zinc-800 bg-zinc-100 border border-zinc-200/60 px-2.5 py-0.5 rounded-full">
                    {tool.isComparison ? "Comparison" : "Calculator"}
                  </span>
                  <span className="font-mono text-[11px]">{formatDate(tool.lastUpdated)}</span>
                </div>
                <h3 className="text-lg font-bold text-zinc-950 group-hover:underline transition-all">
                  <Link href={`/tools/${tool.slug}`}>
                    {tool.title}
                  </Link>
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-zinc-500 leading-relaxed">
                  {tool.shortDescription}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between">
                <span className="text-[11px] font-mono text-zinc-400">
                  {tool.pSEOPresets.length} presets
                </span>
                <Link
                  href={`/tools/${tool.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-zinc-950 group-hover:translate-x-1 transition-transform"
                >
                  <span>Dial in numbers</span>
                  <span>→</span>
                </Link>
              </div>
            </TiltCard>
          ))}
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
            <TiltCard
              key={guide.slug}
              maxTilt={5}
              hoverScale={1.01}
              glareOpacity={0.1}
              className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs transition-colors hover:border-zinc-400"
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
            </TiltCard>
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
