import { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export const metadata: Metadata = {
  title: "Privacy Policy — FeeSnap",
  description:
    "FeeSnap Privacy Policy: Details on cookie usage, Google Analytics 4, advertising partners, and our 100% client-side data privacy architecture.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Privacy Policy" }]} />

      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
        Privacy Policy
      </h1>
      <p className="mt-2 text-xs text-gray-500">Last updated: November 1, 2026</p>

      <div className="mt-8 space-y-6 text-sm text-gray-700 leading-relaxed border-t border-gray-200 pt-6">
        <section>
          <h2 className="text-lg font-bold text-gray-900">1. Overview & Core Philosophy</h2>
          <p className="mt-2">
            FeeSnap (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) operates the website at https://feesnap.com. We believe seller financial data should remain strictly confidential. Our interactive calculator engines operate entirely in client-side JavaScript within your web browser. When you input item prices, production costs, shipping rates, or ad spends, that financial information is never uploaded, recorded, or stored on our servers.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">2. Information We Collect Automatically</h2>
          <p className="mt-2">
            When you navigate our website, we may automatically collect limited technical information through standard web logs and analytics services, including:
          </p>
          <ul className="mt-2 list-disc list-inside space-y-1 text-gray-600">
            <li>Browser type, version, and operating system.</li>
            <li>Approximate geographic location (country or region-level).</li>
            <li>Referring website, pages visited, time spent, and scroll depth.</li>
            <li>Anonymized tool interactions (such as which calculator was viewed or if a result was copied).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">3. Google Analytics 4 (GA4)</h2>
          <p className="mt-2">
            We use Google Analytics 4 to understand website traffic patterns, popular calculators, and technical issues. Google Analytics collects anonymized IP addresses and uses first-party cookies to track session interactions. You may opt out of Google Analytics tracking by installing the official Google Analytics Opt-out Browser Add-on or by enabling &quot;Do Not Track&quot; in your browser settings.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">4. Advertising & Third-Party Cookies</h2>
          <p className="mt-2">
            FeeSnap is monetized in part through third-party advertising networks, such as Google AdSense and Journey by Mediavine. These advertising partners may use cookies, web beacons, and device identifiers to serve relevant advertisements based on your prior visits to this website or other sites on the Internet.
          </p>
          <p className="mt-2">
            Users may opt out of personalized advertising by visiting Google Ads Settings (https://adssettings.google.com) or the Network Advertising Initiative opt-out page (https://optout.networkadvertising.org).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">5. Affiliate Disclosure & Links</h2>
          <p className="mt-2">
            Certain pages contain contextual affiliate links to vetted seller services (such as Printify, Shopify, or Wise). When you click an affiliate link marked &quot;Sponsored&quot; and subsequently purchase or register an account, FeeSnap may earn a small referral commission at no additional cost to you. Affiliate relationships never influence our mathematical formulas or platform fee audit conclusions.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">6. Newsletter & Email Data</h2>
          <p className="mt-2">
            If you voluntarily subscribe to our quarterly fee update newsletter, we collect your email address solely to deliver fee alerts, seller cheat sheets, and site announcements. We never sell, rent, or trade subscriber email lists to third parties. Every email contains an immediate, one-click unsubscribe link.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">7. GDPR and CCPA Rights</h2>
          <p className="mt-2">
            Depending on your location, you have rights regarding your personal information, including the right to request access, correction, or deletion of any email data you have provided to us. To exercise your rights, please reach out via our contact page or at support@feesnap.com.
          </p>
        </section>
      </div>
    </div>
  );
}
