import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount: number,
  currency: string = "USD",
  locale: string = "en-US"
): string {
  if (isNaN(amount) || !isFinite(amount)) return "$0.00";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatMoney(amount: number, symbol: string = "$"): string {
  if (isNaN(amount) || !isFinite(amount)) return `${symbol}0.00`;
  const abs = Math.abs(amount);
  const formatted = abs.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  if (formatted === "0.00") return `${symbol}0.00`;
  const isNegative = amount < 0;
  return isNegative ? `-${symbol}${formatted}` : `${symbol}${formatted}`;
}

export const fmtUSD = (amount: number): string => formatCurrency(amount, "USD");

export function formatPercent(value: number, decimals: number = 2): string {
  if (isNaN(value) || !isFinite(value)) return "0.00%";
  return `${value.toFixed(decimals)}%`;
}

export function formatDate(isoDate: string): string {
  try {
    const date = new Date(isoDate);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  } catch {
    return isoDate;
  }
}
