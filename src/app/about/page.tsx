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

      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
        About CalcDial & Our Calculation Methodology
      </h1>
      <p className="mt-3 text-base text-gray-600 leading-relaxed">
        Building high-precision, client-side financial tools to protect online seller profit margins across the world’s major marketplace platforms.
      </p>

      <div className="mt-8 space-y-8 text-sm sm:text-base text-gray-700 leading-relaxed border-t border-gray-200 pt-8">
        <section>
          <h2 className="text-xl font-bold text-gray-900">Our Mission</h2>
          <p className="mt-2">
            In modern e-commerce, platform fees are increasingly complicated. A seller listing a handmade mug or print-on-demand t-shirt does not simply pay a flat fee; they navigate base listing charges, category referral percentages, country-specific payment settlement surcharges, buyer currency exchange spreads, regulatory operating fees, and mandatory offsite advertising cuts.
          </p>
          <p className="mt-3">
            CalcDial was founded to deliver 100% free, transparent, and instant calculations. Our tools help makers, drop-shippers, digital creators, and direct-to-consumer founders price their products accurately so they never discover negative margins after fulfillment.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">100% Client-Side Privacy Guarantee</h2>
          <p className="mt-2">
            Unlike many commercial SaaS tools that require you to create an account, connect private store API keys, or upload sensitive financial records to remote databases, CalcDial performs every single calculation 100% locally in your web browser using pure TypeScript algorithms.
          </p>
          <p className="mt-3">
            Your item pricing, product manufacturing costs, customer shipping charges, and advertising spend never leave your computer. We do not store, log, or sell your product cost data.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">How We Maintain Accuracy (2026 Audit Cycle)</h2>
          <p className="mt-2">
            Online marketplaces adjust their fee schedules frequently. For example, Etsy reviews regulatory operating rates semi-annually, TikTok Shop has phased in standard category commissions, and payment gateways adjust interchange costs on international credit cards.
          </p>
          <p className="mt-3">
            Our editorial and research team conducts quarterly fee audits across official developer documentation and seller terms for Etsy, Shopify Payments, Stripe, PayPal, TikTok Shop, Printify, and Gelato. Every calculator on our site displays a visible <strong>Last updated</strong> badge reflecting the date of its most recent verification against official merchant fee tables.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">Editorial Disclaimer</h2>
          <p className="mt-2">
            CalcDial is an independent educational publisher and tool provider. We are not officially affiliated with, endorsed by, or sponsored by Etsy, Inc., Shopify Inc., ByteDance Ltd., Stripe, Inc., or PayPal Holdings, Inc. All trademarks and brand names remain the property of their respective owners. Calculations are estimates intended for planning and educational purposes and should be verified against your official merchant settlement statements.
          </p>
        </section>

        <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-6">
          <h3 className="font-semibold text-emerald-950">Have a Question or Notice a Fee Update?</h3>
          <p className="mt-1 text-sm text-emerald-800">
            Our team welcomes feedback from active sellers. Reach out via our{" "}
            <Link href="/contact" className="underline font-semibold hover:text-emerald-900">
              Contact Page
            </Link>{" "}
            to report rate changes or request a new marketplace calculator.
          </p>
        </div>
      </div>
    </div>
  );
}
