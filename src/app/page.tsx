import { TOOLS } from "@/data/tools-registry";
import { JsonLd } from "@/components/seo/JsonLd";
import { EmailCapture } from "@/components/layout/EmailCapture";
import { AdSlot } from "@/components/layout/AdSlot";
import { ToolsDirectory } from "@/components/home/ToolsDirectory";
import { FeeTrapCard } from "@/components/home/FeeTrapCard";

const FEE_TRAPS = [
  {
    platform: "Etsy",
    trapTitle: "Shipping Deduction",
    badge: "6.5% + 3% + $0.25",
    description:
      "Etsy deducts its 6.5% commission on item price plus shipping. With processing and ads, total cuts can exceed 20%.",
    href: "/tools/etsy-fee-calculator",
    actionText: "Test Etsy listing fees",
    icon: (
      <div className="flex size-8.5 items-center justify-center rounded-lg bg-[#F1641E] text-white shadow-2xs font-serif font-black text-base select-none">
        E
      </div>
    ),
  },
  {
    platform: "Shopify",
    trapTitle: "Gateway Surcharge",
    badge: "2.9% + $0.30",
    description:
      "External gateways like PayPal or Stripe trigger an added 0.5%–2.0% platform penalty fee on top of processor rates.",
    href: "/tools/shopify-profit-calculator",
    actionText: "Calculate Shopify profit",
    icon: (
      <div className="flex size-8.5 items-center justify-center rounded-lg bg-white border border-zinc-200/90 shadow-2xs p-1.5">
        <svg viewBox="0 0 109 123" fill="none" className="size-full">
          <path d="M74.7 15.6c-.3-1.4-1.2-6.5-4.8-9.4C66.1 3.2 61.2 3 59.4 3c-.7 0-1.2.1-1.3.1-.9.2-2.3.8-3.7 2-3.1 2.8-5.3 7.8-6.4 13.9l-19.4 6c-2.3.7-2.3.9-2.6 3.1L12.5 106.6l54.8 13.4 39.8-13.4-32.4-91z" fill="#95BF47" />
          <path d="M58.1 3.1c-.7 0-1.2.1-1.3.1-.9.2-2.3.8-3.7 2-3.1 2.8-5.3 7.8-6.4 13.9l-18 5.6 15 95.3 23.6-7.9 3.4-94.6c-.3-1.4-1.2-6.5-4.8-9.4-3.8-3-8.7-3.2-10.5-3.2z" fill="#5E8E3E" />
          <path d="M52.3 35.8c-1.3-.8-2.9-.6-3.8.3-.9 1-1.2 2.6-.4 3.9l9.3 14.5c.8 1.3 2.5 1.7 3.8.9 1.3-.8 1.7-2.5.9-3.8l-9.8-15.8z" fill="#fff" />
          <path d="M68.5 48.7c-4.9-1.2-10.1-.5-14.5 1.9-4.8 2.6-7.8 7.3-8.2 12.8-.5 7.1 4.5 13.4 11.4 14.5 5.6.9 11.2.8 16.8 0 .8-.1 1.4-.8 1.3-1.6-.1-.8-.8-1.4-1.6-1.3-5.2.7-10.4.8-15.6 0-5.3-.8-9.2-5.7-8.8-11.2.3-4.3 2.7-8 6.5-10 3.5-1.9 7.6-2.5 11.6-1.5 2.8.7 5.5 2.1 7.8 4.1.6.5 1.5.5 2.1-.1.6-.6.5-1.5-.1-2.1-2.8-2.4-6.1-4.2-9.6-5.1z" fill="#fff" />
        </svg>
      </div>
    ),
  },
  {
    platform: "TikTok Shop",
    trapTitle: "Top-Line Cuts",
    badge: "6% Referral",
    description:
      "The 6% referral commission is deducted from gross buyer revenue before seller coupons, shipping, and creator cuts.",
    href: "/tools/tiktok-shop-fee-calculator",
    actionText: "Calculate TikTok cuts",
    icon: (
      <div className="flex size-8.5 items-center justify-center rounded-lg bg-black text-white shadow-2xs p-1.5">
        <svg viewBox="0 0 24 24" fill="none" className="size-full">
          <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.209 1.747 2.89 2.89 0 0 1 2.313-4.639c.314 0 .619.05.904.144V9.42a6.33 6.33 0 0 0-.904-.067 6.337 6.337 0 0 0-6.337 6.338 6.337 6.337 0 0 0 10.82 4.48 6.29 6.29 0 0 0 1.854-4.48V8.97a8.21 8.21 0 0 0 5.01 1.706V7.234a4.836 4.836 0 0 1-1.236-.548z" fill="#fff" />
          <path d="M16.5 6.4a4.8 4.8 0 0 1-3.6-4.1h-.6v13.4a2.9 2.9 0 0 1-5.2 1.7 2.9 2.9 0 0 1 2.3-4.6c.3 0 .6 0 .9.1V9.4a6.3 6.3 0 0 0-.9-.1 6.3 6.3 0 0 0-6.3 6.3 6.3 6.3 0 0 0 10.8 4.5 6.3 6.3 0 0 0 1.9-4.5V9a8.2 8.2 0 0 0 4.9 1.6V7.2a4.8 4.8 0 0 1-4.2-.8z" fill="#25F4EE" opacity="0.9" />
          <path d="M17 6.8a4.8 4.8 0 0 1-3.6-4.1h.5v13.4a2.9 2.9 0 0 1-5.2 1.7 2.9 2.9 0 0 1 2.3-4.6c.3 0 .6 0 .9.1V9.8a6.3 6.3 0 0 0-.9-.1 6.3 6.3 0 0 0-6.3 6.3 6.3 6.3 0 0 0 10.8 4.5 6.3 6.3 0 0 0 1.9-4.5V9.4a8.2 8.2 0 0 0 4.9 1.6V7.6a4.8 4.8 0 0 1-4.6-.8z" fill="#FE2C55" opacity="0.9" />
        </svg>
      </div>
    ),
  },
];

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
    <div className="w-full">
      <JsonLd data={websiteSchema} />
      <JsonLd data={organizationSchema} />

      {/* Directory Search, Hero Banner & Filterable Calculator Grid + Guides */}
      <ToolsDirectory tools={TOOLS} />

      <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        {/* Fintech Insights: Hidden Platform Fee Traps (High SEO Value & Authority) */}
        <section className="mb-20 sm:mb-24">
          <div className="mb-6 pb-4 border-b border-zinc-200/70">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 block mb-1">
              Margin Protections
            </span>
            <h2 className="text-2xl sm:text-3xl font-medium tracking-[-0.8px] text-zinc-950 font-sans">
              Hidden Platform Fee Traps
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-zinc-500 font-normal max-w-xl">
              Critical fee nuances and stealth deductions to watch before pricing your items.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
            {FEE_TRAPS.map((trap) => (
              <FeeTrapCard key={trap.platform} {...trap} />
            ))}
          </div>
        </section>

        {/* Email Capture Newsletter */}
        <section className="mb-14 sm:mb-16">
          <EmailCapture source="homepage" />
        </section>
      </div>
    </div>
  );
}
