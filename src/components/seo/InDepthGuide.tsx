import { ShopifyInDepthGuide } from "./guides/ShopifyInDepthGuide";
import { EtsyInDepthGuide } from "./guides/EtsyInDepthGuide";
import { MarketplaceInDepthGuide } from "./guides/MarketplaceInDepthGuide";
import { PodInDepthGuide } from "./guides/PodInDepthGuide";
import { TikTokInDepthGuide } from "./guides/TikTokInDepthGuide";
import { PaymentInDepthGuide } from "./guides/PaymentInDepthGuide";

interface InDepthGuideProps {
  toolSlug: string;
}

export function InDepthGuide({ toolSlug }: InDepthGuideProps) {
  if (toolSlug === "shopify-profit-calculator") return <ShopifyInDepthGuide />;
  if (toolSlug === "etsy-fee-calculator") return <EtsyInDepthGuide />;
  if (toolSlug === "etsy-vs-shopify-vs-tiktok-shop-calculator") return <MarketplaceInDepthGuide />;
  if (toolSlug === "pod-profit-calculator") return <PodInDepthGuide />;
  if (toolSlug === "tiktok-shop-fee-calculator") return <TikTokInDepthGuide />;
  if (toolSlug === "stripe-vs-paypal-fee-calculator") return <PaymentInDepthGuide />;

  return null;
}
