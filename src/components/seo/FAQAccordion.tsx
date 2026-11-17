"use client";

import { FAQItem } from "@/data/tools-registry";
import { BlurAccordion } from "@/components/motion/blur-accordion";

export function FAQAccordion({ faqs }: { faqs: FAQItem[] }) {
  if (!faqs || faqs.length === 0) return null;

  const items = faqs.map((faq, idx) => ({
    id: `faq-${idx}`,
    title: faq.question,
    content: (
      <div className="leading-relaxed text-zinc-600">
        {faq.answer}
      </div>
    ),
  }));

  return (
    <section className="my-10 rounded-3xl border border-zinc-200/80 bg-white p-6 sm:p-8 shadow-xs">
      <div className="flex items-center gap-2 mb-2">
        <span className="size-1.5 rounded-full bg-zinc-950" />
        <span className="text-xs font-mono font-medium uppercase tracking-wider text-zinc-500">
          Official Fee Breakdown
        </span>
      </div>
      <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950">
        Frequently Asked Questions
      </h2>
      <p className="mt-1 text-xs sm:text-sm text-zinc-500 mb-6">
        Click to expand verified merchant policy details and 2026 platform rules.
      </p>

      <BlurAccordion items={items} multiple={false} />
    </section>
  );
}
