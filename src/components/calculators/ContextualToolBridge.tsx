import Link from "next/link";
import { ArrowRight, Sparkles, Scale, TrendingUp, ShoppingBag, CreditCard } from "lucide-react";

interface ContextualToolBridgeProps {
  currentTool: string;
  price?: number;
  cost?: number;
  currencySymbol?: string;
}

export function ContextualToolBridge({
  currentTool,
  price = 35,
  cost = 12,
  currencySymbol = "$",
}: ContextualToolBridgeProps) {
  const safePrice = Math.max(0, price || 0);
  const safeCost = Math.max(0, cost || 0);

  let title = "Compare your margins";
  let description = "Check how this product performs on other channels.";
  let href = "/tools/etsy-vs-shopify-vs-tiktok-shop-calculator";
  let ctaText = "Compare Channels";
  let Icon = Sparkles;

  switch (currentTool) {
    case "etsy-fee-calculator":
      Icon = Scale;
      title = "Selling this on TikTok Shop or Shopify?";
      description = `Compare your ${currencySymbol}${safePrice.toFixed(2)} item side-by-side to see which platform leaves you the highest net profit.`;
      href = `/tools/etsy-vs-shopify-vs-tiktok-shop-calculator?price=${safePrice.toFixed(2)}&cost=${safeCost.toFixed(2)}`;
      ctaText = "Compare 3 Marketplaces";
      break;

    case "pod-profit-calculator":
      Icon = ShoppingBag;
      title = "Ready to list this POD product?";
      description = `Calculate exact seller fees and offsite ads impact on Etsy for your ${currencySymbol}${safePrice.toFixed(2)} retail item.`;
      href = `/tools/etsy-fee-calculator?price=${safePrice.toFixed(2)}&cost=${safeCost.toFixed(2)}`;
      ctaText = "Calculate Etsy Fees";
      break;

    case "tiktok-shop-fee-calculator":
      Icon = Scale;
      title = "Compare TikTok Shop vs. Etsy & Shopify";
      description = `See if creator affiliate commissions or marketplace flat fees leave you higher net margin on a ${currencySymbol}${safePrice.toFixed(2)} sale.`;
      href = `/tools/etsy-vs-shopify-vs-tiktok-shop-calculator?price=${safePrice.toFixed(2)}&cost=${safeCost.toFixed(2)}`;
      ctaText = "Compare Side-by-Side";
      break;

    case "shopify-profit-calculator":
      Icon = CreditCard;
      title = "Which gateway saves you more per order?";
      description = `Compare domestic and international transaction fees between Stripe and PayPal for your store.`;
      href = `/tools/stripe-vs-paypal-fee-calculator?amount=${safePrice.toFixed(2)}`;
      ctaText = "Compare Stripe vs PayPal";
      break;

    case "etsy-vs-shopify-vs-tiktok-shop-calculator":
      Icon = TrendingUp;
      title = "Check Print-on-Demand base margins";
      description = `Test base unit costs for t-shirts, mugs, and hoodies across Printify & Printful with our dedicated POD engine.`;
      href = `/tools/pod-profit-calculator?price=${safePrice.toFixed(2)}&cost=${safeCost.toFixed(2)}`;
      ctaText = "Open POD Profit Tool";
      break;

    case "stripe-vs-paypal-fee-calculator":
      Icon = TrendingUp;
      title = "Calculate Store Profit & Break-Even ROAS";
      description = `Combine payment gateway deductions with ad spend and COGS to calculate your store's target advertising ROAS.`;
      href = `/tools/shopify-profit-calculator?price=${safePrice.toFixed(2)}`;
      ctaText = "Calculate Store Profit";
      break;
  }

  return (
    <div className="mt-4 pt-4 border-t border-zinc-100">
      <div className="rounded-xl border border-zinc-200/90 bg-zinc-50/60 p-3.5 shadow-2xs transition-all hover:border-zinc-300">
        <div className="flex items-center gap-2 mb-1.5">
          <Icon className="size-3.5 text-emerald-600 shrink-0" />
          <span className="text-xs font-semibold text-zinc-900">{title}</span>
        </div>

        <p className="text-[11px] text-zinc-500 leading-relaxed mb-3">
          {description}
        </p>

        <Link
          href={href}
          prefetch={false}
          className="group flex w-full items-center justify-between rounded-xl bg-white border border-zinc-200/90 hover:border-blue-400/80 px-3.5 py-2.5 text-xs font-bold text-zinc-900 hover:text-blue-600 shadow-2xs hover:shadow-[0_4px_16px_rgba(43,92,253,0.08)] transition-all cursor-pointer"
        >
          <span>{ctaText}</span>
          <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1 text-zinc-400 group-hover:text-blue-600" />
        </Link>
      </div>
    </div>
  );
}
