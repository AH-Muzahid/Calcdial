import { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export const metadata: Metadata = {
  title: "Terms of Service & Calculator Disclaimer — FeeSnap",
  description:
    "Terms of service, calculator accuracy disclaimer, intellectual property notices, and limitations of liability for FeeSnap users.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Terms of Service" }]} />

      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
        Terms of Service & Calculator Disclaimer
      </h1>
      <p className="mt-2 text-xs text-gray-500">Last updated: November 1, 2026</p>

      <div className="mt-8 space-y-6 text-sm text-gray-700 leading-relaxed border-t border-gray-200 pt-6">
        <section className="rounded-xl border border-amber-200 bg-amber-50/70 p-5">
          <h2 className="text-base font-bold text-amber-900">
            IMPORTANT FINANCIAL & TAX DISCLAIMER
          </h2>
          <p className="mt-1.5 text-xs text-amber-800 leading-relaxed">
            All calculators, fee models, gross-up formulas, worked examples, and editorial guides published on FeeSnap are provided strictly for educational and general planning purposes. They do NOT constitute legal, financial, accounting, or tax advice. E-commerce platforms regularly revise their fee structures, seller tiers, and currency spreads. Always verify final figures directly with your platform seller dashboard and consult a certified CPA or tax advisor.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">1. Acceptance of Terms</h2>
          <p className="mt-2">
            By accessing or using the FeeSnap website (https://feesnap.com) or embedding any of our calculator widgets via iframe, you agree to be bound by these Terms of Service. If you do not agree to these terms, you must discontinue using our tools immediately.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">2. Permitted Use & Free Embed License</h2>
          <p className="mt-2">
            You are granted a free, non-exclusive, revocable license to use our calculators for your personal or commercial seller calculations. You are also permitted to embed our calculators on your personal or corporate website using our official embed codes (`/embed/[slug]`), provided you retain visible attribution (&quot;Powered by FeeSnap&quot;) and do not alter or circumvent our embed scripts.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">3. Intellectual Property Rights</h2>
          <p className="mt-2">
            All proprietary code, site design, text content, illustrations, and database configurations on FeeSnap are the intellectual property of FeeSnap. You may not scrape, reproduce, reverse engineer, or republish our codebase or entire guides for distribution without prior written authorization.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">4. Third-Party Trademarks</h2>
          <p className="mt-2">
            Etsy, Shopify, TikTok Shop, Printify, Stripe, PayPal, and all other company names, logos, and trademarks referenced on this website are the property of their respective trademark holders. Reference to them does not imply affiliation, sponsorship, or endorsement.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">5. Limitation of Liability</h2>
          <p className="mt-2">
            In no event shall FeeSnap or its creators be liable for any direct, indirect, incidental, punitive, or consequential damages resulting from the use or inability to use our calculation tools, including but not limited to loss of profits, inventory mispricing, advertising overspend, or unexpected platform settlement deductions.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">6. Modifications to Terms</h2>
          <p className="mt-2">
            We reserve the right to revise these Terms of Service at any time. Material changes will be noted with an updated &quot;Last updated&quot; date at the top of this document. Continued use of our site signifies your acceptance of any revisions.
          </p>
        </section>
      </div>
    </div>
  );
}
