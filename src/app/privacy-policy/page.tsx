import { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export const metadata: Metadata = {
  title: "Privacy Policy — CalcDial",
  description:
    "CalcDial Privacy Policy: Details on cookie usage, Google Analytics 4, advertising partners, and our 100% client-side data privacy architecture.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Privacy Policy" }]} />

      <header className="border-b border-zinc-200/90 pb-7">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200/80 bg-zinc-100/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-zinc-600">
          Legal Policy
        </div>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-2 text-xs text-zinc-500">Last updated: November 1, 2026</p>
      </header>

      {/* 100% Client-Side Privacy Guarantee Card */}
      <div className="mt-6 rounded-2xl border border-emerald-200/90 bg-emerald-50/70 p-5 sm:p-6 text-zinc-900 shadow-2xs">
        <div className="flex items-center gap-2.5 mb-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-600 text-white shrink-0">
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </span>
          <h2 className="text-base font-bold text-emerald-950">
            100% Client-Side Privacy Architecture
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed">
          Your numbers are your business. Every single calculation — including item costs, retail pricing, advertising spend, revenue volumes, and profit margins — is processed <strong>locally in your browser</strong> using client-side JavaScript. No pricing or profit figures are ever transmitted, saved, or logged to our servers.
        </p>
      </div>

      <div className="mt-8 space-y-7 text-sm sm:text-base text-zinc-700 leading-relaxed">
        <section className="rounded-2xl border border-zinc-200/90 bg-white p-6 sm:p-7 shadow-xs">
          <h2 className="text-lg font-bold text-zinc-950">1. Overview &amp; Core Philosophy</h2>
          <p className="mt-2.5 text-zinc-600 leading-relaxed">
            CalcDial (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) operates the website at https://calcdial.com. We believe seller financial data should remain strictly confidential. Our interactive calculator engines operate entirely in client-side JavaScript within your web browser. When you input item prices, production costs, shipping rates, or ad spends, that financial information is never uploaded, recorded, or stored on our servers.
          </p>
        </section>

        <section className="rounded-2xl border border-zinc-200/90 bg-white p-6 sm:p-7 shadow-xs">
          <h2 className="text-lg font-bold text-zinc-950">2. Information We Collect Automatically</h2>
          <p className="mt-2.5 text-zinc-600 leading-relaxed">
            When you navigate our website, we may automatically collect limited technical information through standard web logs and analytics services, including:
          </p>
          <ul className="mt-3 list-disc list-inside space-y-1.5 text-zinc-600 pl-1">
            <li>Browser type, version, and operating system.</li>
            <li>Approximate geographic location (country or region-level).</li>
            <li>Referring website, pages visited, time spent, and scroll depth.</li>
            <li>Anonymized tool interactions (such as which calculator was viewed or if a result was copied).</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-zinc-200/90 bg-white p-6 sm:p-7 shadow-xs">
          <h2 className="text-lg font-bold text-zinc-950">3. Google Analytics 4 (GA4)</h2>
          <p className="mt-2.5 text-zinc-600 leading-relaxed">
            We use Google Analytics 4 to understand website traffic patterns, popular calculators, and technical issues. Google Analytics collects anonymized IP addresses and uses first-party cookies to track session interactions. You may opt out of Google Analytics tracking by installing the official Google Analytics Opt-out Browser Add-on or by enabling &quot;Do Not Track&quot; in your browser settings.
          </p>
        </section>

        <section className="rounded-2xl border border-zinc-200/90 bg-white p-6 sm:p-7 shadow-xs">
          <h2 className="text-lg font-bold text-zinc-950">4. Advertising &amp; Third-Party Cookies</h2>
          <p className="mt-2.5 text-zinc-600 leading-relaxed">
            CalcDial is monetized in part through third-party advertising networks, such as Google AdSense and Journey by Mediavine. These advertising partners may use cookies, web beacons, and device identifiers to serve relevant advertisements based on your prior visits to this website or other sites on the Internet.
          </p>
          <p className="mt-2.5 text-zinc-600 leading-relaxed">
            Users may opt out of personalized advertising by visiting Google Ads Settings (https://adssettings.google.com) or the Network Advertising Initiative opt-out page (https://optout.networkadvertising.org).
          </p>
        </section>

        <section className="rounded-2xl border border-zinc-200/90 bg-white p-6 sm:p-7 shadow-xs">
          <h2 className="text-lg font-bold text-zinc-950">5. Affiliate Disclosure &amp; Links</h2>
          <p className="mt-2.5 text-zinc-600 leading-relaxed">
            Certain pages contain contextual affiliate links to vetted seller services (such as Printify, Shopify, or Wise). When you click an affiliate link marked &quot;Sponsored&quot; and subsequently purchase or register an account, CalcDial may earn a small referral commission at no additional cost to you. Affiliate relationships never influence our mathematical formulas or platform fee audit conclusions.
          </p>
        </section>

        <section className="rounded-2xl border border-zinc-200/90 bg-white p-6 sm:p-7 shadow-xs">
          <h2 className="text-lg font-bold text-zinc-950">6. Newsletter &amp; Email Data</h2>
          <p className="mt-2.5 text-zinc-600 leading-relaxed">
            If you voluntarily subscribe to our quarterly fee update newsletter, we collect your email address solely to deliver fee alerts, seller cheat sheets, and site announcements. We never sell, rent, or trade subscriber email lists to third parties. Every email contains an immediate, one-click unsubscribe link.
          </p>
        </section>

        <section className="rounded-2xl border border-zinc-200/90 bg-white p-6 sm:p-7 shadow-xs">
          <h2 className="text-lg font-bold text-zinc-950">7. GDPR and CCPA Rights</h2>
          <p className="mt-2.5 text-zinc-600 leading-relaxed">
            Depending on your location, you have rights regarding your personal information, including the right to request access, correction, or deletion of any email data you have provided to us. To exercise your rights, please reach out via our contact page or at support@calcdial.com.
          </p>
        </section>
      </div>
    </div>
  );
}
