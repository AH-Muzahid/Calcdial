import { JsonLd } from "@/components/seo/JsonLd";
import { EmailCapture } from "@/components/layout/EmailCapture";
import { ToolsDirectory } from "@/components/home/ToolsDirectory";
import { FeeTrapCard } from "@/components/home/FeeTrapCard";
import { ToolIcon } from "@/components/common/ToolIcons";

const FEE_TRAPS = [
  {
    platform: "Etsy",
    trapTitle: "Shipping Deduction",
    badge: "6.5% + 3% + $0.25",
    description:
      "Etsy deducts its 6.5% commission on item price plus shipping. With processing and ads, total cuts can exceed 20%.",
    href: "/tools/etsy-fee-calculator",
    actionText: "Test Etsy listing fees",
    icon: <ToolIcon slug="etsy" size="sm" />,
  },
  {
    platform: "Shopify",
    trapTitle: "Gateway Surcharge",
    badge: "2.9% + $0.30",
    description:
      "External gateways like PayPal or Stripe trigger an added 0.5%–2.0% platform penalty fee on top of processor rates.",
    href: "/tools/shopify-profit-calculator",
    actionText: "Calculate Shopify profit",
    icon: <ToolIcon slug="shopify" size="sm" />,
  },
  {
    platform: "TikTok Shop",
    trapTitle: "Top-Line Cuts",
    badge: "6% Referral",
    description:
      "The 6% referral commission is deducted from gross buyer revenue before seller coupons, shipping, and creator cuts.",
    href: "/tools/tiktok-shop-fee-calculator",
    actionText: "Calculate TikTok cuts",
    icon: <ToolIcon slug="tiktok" size="sm" />,
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
      <ToolsDirectory />

      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        {/* Fintech Insights: Hidden Platform Fee Traps */}
        <section id="fee-traps" className="mb-16 sm:mb-24 scroll-mt-24">
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-950 font-sans">
              Hidden Platform Fee Traps
            </h2>
            <p className="mt-2 text-sm text-zinc-600 font-normal max-w-xl">
              Critical fee nuances and stealth deductions to watch before pricing your items.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 items-stretch">
            {FEE_TRAPS.map((trap) => (
              <FeeTrapCard key={trap.platform} {...trap} />
            ))}
          </div>
        </section>

        {/* Email Capture Newsletter */}
        <section>
          <EmailCapture source="homepage" />
        </section>
      </div>
    </div>
  );
}
