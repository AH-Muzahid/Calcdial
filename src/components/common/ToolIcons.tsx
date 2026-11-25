import React from "react";
import {
  Store,
  ShoppingBag,
  Video,
  Shirt,
  ArrowLeftRight,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ToolIconProps {
  slug: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function ToolIcon({ slug, className = "", size = "md" }: ToolIconProps) {
  const sizeClasses = {
    sm: "size-8 rounded-lg",
    md: "size-10 rounded-xl",
    lg: "size-12 rounded-xl",
  }[size];

  const iconClasses = {
    sm: "size-4",
    md: "size-5",
    lg: "size-6",
  }[size];

  const renderIcon = () => {
    switch (slug) {
      case "etsy-fee-calculator":
      case "etsy":
        return <Store className={iconClasses} aria-hidden="true" />;
      case "shopify-profit-calculator":
      case "shopify":
        return <ShoppingBag className={iconClasses} aria-hidden="true" />;
      case "tiktok-shop-fee-calculator":
      case "tiktok":
        return <Video className={iconClasses} aria-hidden="true" />;
      case "pod-profit-calculator":
      case "pod":
        return <Shirt className={iconClasses} aria-hidden="true" />;
      case "etsy-vs-shopify-vs-tiktok-shop-calculator":
      case "comparison":
        return <ArrowLeftRight className={iconClasses} aria-hidden="true" />;
      case "stripe-vs-paypal-fee-calculator":
      case "stripe-paypal":
      case "payment":
      default:
        return <CreditCard className={iconClasses} aria-hidden="true" />;
    }
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center shrink-0 border border-zinc-200/80 bg-zinc-100 text-zinc-700",
        sizeClasses,
        className
      )}
    >
      {renderIcon()}
    </div>
  );
}
