export type GAEvent =
  | { name: "calculator_used"; params: { tool_slug: string; preset?: string } }
  | { name: "result_copied"; params: { tool_slug: string; method: "clipboard" | "url" | "print" } }
  | { name: "affiliate_clicked"; params: { tool_slug: string; partner: string; url: string } }
  | { name: "embed_copied"; params: { tool_slug: string } }
  | { name: "email_signup"; params: { source: string; tool_slug?: string } }
  | { name: "guide_read"; params: { guide_slug: string; scroll_depth: number } };

export function trackEvent(event: GAEvent): void {
  if (
    typeof window !== "undefined" &&
    typeof (window as unknown as { gtag?: (type: string, name: string, params: Record<string, unknown>) => void }).gtag === "function"
  ) {
    (window as unknown as { gtag: (type: string, name: string, params: Record<string, unknown>) => void }).gtag(
      "event",
      event.name,
      event.params
    );
  }
}
