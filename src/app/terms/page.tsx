import { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export const metadata: Metadata = {
  title: "Terms of Service & Calculator Disclaimer",
  description:
    "Terms of service, calculator accuracy disclaimer, intellectual property notices, and limitations of liability for CalcDial users.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Terms of Service" }]} />

      <header className="border-b border-zinc-200/90 pb-7">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200/80 bg-zinc-100/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-zinc-600">
          Terms &amp; Disclaimers
        </div>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl">
          Terms of Service &amp; Calculator Disclaimer
        </h1>
        <p className="mt-2 text-xs text-zinc-500">Last updated: November 1, 2026</p>
      </header>

      <div className="mt-8 space-y-6 text-sm sm:text-base text-zinc-700 leading-relaxed">
        {/* Financial & Tax Disclaimer Callout */}
        <section className="rounded-2xl border border-zinc-200/90 bg-zinc-50/80 p-5 sm:p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center rounded-md border border-amber-300/80 bg-amber-50 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-amber-800">
              Important Notice
            </span>
            <h2 className="text-sm font-bold text-zinc-950">
              Financial &amp; Tax Disclaimer
            </h2>
          </div>
          <p className="mt-1.5 text-xs sm:text-sm text-zinc-600 leading-relaxed">
            All calculators, fee models, gross-up formulas, worked examples, and editorial guides published on CalcDial are provided strictly for educational and general planning purposes. They do NOT constitute legal, financial, accounting, or tax advice. E-commerce platforms regularly revise their fee structures, seller tiers, and currency spreads. Always verify final figures directly with your platform seller dashboard and consult a certified CPA or tax advisor.
          </p>
        </section>

        <section className="rounded-2xl border border-zinc-200/90 bg-white p-6 sm:p-7 shadow-xs">
          <h2 className="text-lg font-bold text-zinc-950">1. Acceptance of Terms</h2>
          <p className="mt-2.5 text-zinc-600 leading-relaxed">
            By accessing or using the CalcDial website (https://calcdial.com) or embedding any of our calculator widgets via iframe, you agree to be bound by these Terms of Service. If you do not agree to these terms, you must discontinue using our tools immediately.
          </p>
        </section>

        <section className="rounded-2xl border border-zinc-200/90 bg-white p-6 sm:p-7 shadow-xs">
          <h2 className="text-lg font-bold text-zinc-950">2. Permitted Use &amp; Free Embed License</h2>
          <p className="mt-2.5 text-zinc-600 leading-relaxed">
            You are granted a free, non-exclusive, revocable license to use our calculators for your personal or commercial seller calculations. You are also permitted to embed our calculators on your personal or corporate website using our official embed codes (`/embed/[slug]`), provided you retain visible attribution (&quot;Powered by CalcDial&quot;) and do not alter or circumvent our embed scripts.
          </p>
        </section>

        <section className="rounded-2xl border border-zinc-200/90 bg-white p-6 sm:p-7 shadow-xs">
          <h2 className="text-lg font-bold text-zinc-950">3. Intellectual Property Rights</h2>
          <p className="mt-2.5 text-zinc-600 leading-relaxed">
            All proprietary code, site design, text content, illustrations, and database configurations on CalcDial are the intellectual property of CalcDial. You may not scrape, reproduce, reverse engineer, or republish our codebase or entire guides for distribution without prior written authorization.
          </p>
        </section>

        <section className="rounded-2xl border border-zinc-200/90 bg-white p-6 sm:p-7 shadow-xs">
          <h2 className="text-lg font-bold text-zinc-950">4. Third-Party Trademarks</h2>
          <p className="mt-2.5 text-zinc-600 leading-relaxed">
            Etsy, Shopify, TikTok Shop, Printify, Stripe, PayPal, and all other company names, logos, and trademarks referenced on this website are the property of their respective trademark holders. Reference to them does not imply affiliation, sponsorship, or endorsement.
          </p>
        </section>

        <section className="rounded-2xl border border-zinc-200/90 bg-white p-6 sm:p-7 shadow-xs">
          <h2 className="text-lg font-bold text-zinc-950">5. Limitation of Liability</h2>
          <p className="mt-2.5 text-zinc-600 leading-relaxed">
            In no event shall CalcDial or its creators be liable for any direct, indirect, incidental, punitive, or consequential damages resulting from the use or inability to use our calculation tools, including but not limited to loss of profits, inventory mispricing, advertising overspend, or unexpected platform settlement deductions.
          </p>
        </section>

        <section className="rounded-2xl border border-zinc-200/90 bg-white p-6 sm:p-7 shadow-xs">
          <h2 className="text-lg font-bold text-zinc-950">6. Modifications to Terms</h2>
          <p className="mt-2.5 text-zinc-600 leading-relaxed">
            We reserve the right to revise these Terms of Service at any time. Material changes will be noted with an updated &quot;Last updated&quot; date at the top of this document. Continued use of our site signifies your acceptance of any revisions.
          </p>
        </section>
      </div>
    </div>
  );
}
