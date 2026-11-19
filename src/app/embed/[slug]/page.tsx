import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { TOOLS, getToolBySlug } from "@/data/tools-registry";

// Calculators
import { EtsyFeeCalculator } from "@/components/calculators/EtsyFeeCalculator";
import { PodProfitCalculator } from "@/components/calculators/PodProfitCalculator";
import { TikTokFeeCalculator } from "@/components/calculators/TikTokFeeCalculator";
import { ShopifyProfitCalculator } from "@/components/calculators/ShopifyProfitCalculator";
import { MarketplaceComparison } from "@/components/calculators/MarketplaceComparison";
import { PaymentComparison } from "@/components/calculators/PaymentComparison";

export async function generateStaticParams() {
  return TOOLS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return { title: "Widget Not Found" };

  return {
    title: `${tool.title} (Embed Widget)`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function EmbedPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  return (
    <div className="p-3 bg-white min-h-screen flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-200/80 gap-2">
          <h2 className="text-sm font-bold text-zinc-950 truncate">{tool.title}</h2>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-700 bg-zinc-100 px-2 py-0.5 rounded-md border border-zinc-200/60 whitespace-nowrap shrink-0">
            Free Widget
          </span>
        </div>

        {tool.slug === "etsy-fee-calculator" && <EtsyFeeCalculator isEmbed={true} />}
        {tool.slug === "pod-profit-calculator" && <PodProfitCalculator isEmbed={true} />}
        {tool.slug === "tiktok-shop-fee-calculator" && <TikTokFeeCalculator isEmbed={true} />}
        {tool.slug === "shopify-profit-calculator" && <ShopifyProfitCalculator isEmbed={true} />}
        {tool.slug === "etsy-vs-shopify-vs-tiktok-shop-calculator" && (
          <MarketplaceComparison isEmbed={true} />
        )}
        {tool.slug === "stripe-vs-paypal-fee-calculator" && (
          <PaymentComparison isEmbed={true} />
        )}
      </div>

      <footer className="mt-4 pt-2 border-t border-zinc-200/80 flex items-center justify-between text-[11px] text-zinc-500">
        <span>Updated for 2026</span>
        <Link
          href={`https://calcdial.pages.dev/tools/${tool.slug}`}
          target="_blank"
          rel="noopener"
          className="font-medium text-zinc-900 hover:text-blue-600 hover:underline transition-colors"
        >
          Powered by CalcDial &rarr;
        </Link>
      </footer>
    </div>
  );
}
