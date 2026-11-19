import { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export const metadata: Metadata = {
  title: "About CalcDial — Our Mission & Calculation Methodology",
  description:
    "Learn about CalcDial, our commitment to transparent e-commerce fee calculations, and how we audit marketplace fee updates for online sellers.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "About Us" }]} />

      <header className="border-b border-zinc-200/90 pb-7">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200/80 bg-zinc-100/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-zinc-600">
          Methodology &amp; Transparency
        </div>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl">
          About CalcDial &amp; Our Calculation Methodology
        </h1>
        <p className="mt-3 text-base text-zinc-600 leading-relaxed">
          Building high-precision, client-side financial tools to protect online seller profit margins across the world’s major marketplace platforms.
        </p>
      </header>

      <div className="mt-8 space-y-6">
        {/* Top 2-Column Grid: Mission & Privacy */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Mission Card */}
          <section className="rounded-2xl border border-zinc-200/90 bg-white p-6 sm:p-7 shadow-xs flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-700 mb-2.5">
                Our Mission
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-zinc-950">
                Transparent Margin Protection
              </h2>
              <p className="mt-2.5 text-sm text-zinc-600 leading-relaxed">
                In modern e-commerce, platform fees are increasingly complicated. A seller listing a handmade mug or print-on-demand t-shirt does not simply pay a flat fee; they navigate base listing charges, category referral percentages, country-specific payment settlement surcharges, and advertising cuts.
              </p>
              <p className="mt-3 text-sm text-zinc-600 leading-relaxed">
                CalcDial was founded to deliver 100% free, transparent, and instant calculations. Our tools help makers, drop-shippers, digital creators, and direct-to-consumer founders price their products accurately so they never discover negative margins after fulfillment.
              </p>
            </div>
          </section>

          {/* Privacy Card */}
          <section className="rounded-2xl border border-zinc-200/90 bg-white p-6 sm:p-7 shadow-xs flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200/60 mb-2.5">
                Zero-Data Logging
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-zinc-950">
                100% Client-Side Privacy Guarantee
              </h2>
              <p className="mt-2.5 text-sm text-zinc-600 leading-relaxed">
                Unlike many commercial SaaS tools that require you to create an account, connect private store API keys, or upload sensitive financial records to remote databases, CalcDial performs every single calculation 100% locally in your web browser using pure TypeScript algorithms.
              </p>
              <p className="mt-3 text-sm text-zinc-600 leading-relaxed">
                Your item pricing, product manufacturing costs, customer shipping charges, and advertising spend never leave your computer. We do not store, log, or sell your product cost data.
              </p>
            </div>
          </section>
        </div>

        {/* Bottom 2-Column Grid: Accuracy & Disclaimer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Audit Cycle Card */}
          <section className="rounded-2xl border border-zinc-200/90 bg-white p-6 sm:p-7 shadow-xs flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200/60 mb-2.5">
                Verified Schedules
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-zinc-950">
                How We Maintain Accuracy (2026 Audit)
              </h2>
              <p className="mt-2.5 text-sm text-zinc-600 leading-relaxed">
                Online marketplaces adjust their fee schedules frequently. For example, Etsy reviews regulatory operating rates semi-annually, TikTok Shop has phased in standard category commissions, and payment gateways adjust interchange costs on international credit cards.
              </p>
              <p className="mt-3 text-sm text-zinc-600 leading-relaxed">
                Our editorial and research team conducts quarterly fee audits across official developer documentation and seller terms for Etsy, Shopify Payments, Stripe, PayPal, TikTok Shop, Printify, and Gelato.
              </p>
            </div>
          </section>

          {/* Disclaimer Card */}
          <section className="rounded-2xl border border-zinc-200/90 bg-white p-6 sm:p-7 shadow-xs flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-700 mb-2.5">
                Independent Publisher
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-zinc-950">
                Editorial Disclaimer
              </h2>
              <p className="mt-2.5 text-sm text-zinc-600 leading-relaxed">
                CalcDial is an independent educational publisher and tool provider. We are not officially affiliated with, endorsed by, or sponsored by Etsy, Inc., Shopify Inc., ByteDance Ltd., Stripe, Inc., or PayPal Holdings, Inc.
              </p>
              <p className="mt-3 text-sm text-zinc-600 leading-relaxed">
                All trademarks and brand names remain the property of their respective owners. Calculations are estimates intended for planning and educational purposes and should be verified against your official merchant settlement statements.
              </p>
            </div>
          </section>
        </div>

        {/* Feedback CTA Card */}
        <div className="rounded-2xl border border-zinc-200/90 bg-zinc-50/80 p-6 sm:p-7 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-zinc-950">Have a Question or Notice a Fee Update?</h3>
              <p className="mt-1 text-xs sm:text-sm text-zinc-600 max-w-xl">
                Our editorial team welcomes feedback from active sellers and platform partners. Report rate changes or request a new marketplace calculator.
              </p>
            </div>
            <Link
              href="/contact"
              prefetch={false}
              className="inline-flex items-center justify-center rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white px-5 py-2.5 text-xs sm:text-sm font-semibold shadow-xs transition-colors shrink-0 min-h-11"
            >
              Contact Our Team &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
