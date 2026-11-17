"use client";

import { FAQItem } from "@/data/tools-registry";
import { BlurAccordion } from "@/components/motion/blur-accordion";

export function FAQAccordion({ faqs }: { faqs: FAQItem[] }) {
  if (!faqs || faqs.length === 0) return null;

  const items = faqs.map((faq, idx) => ({
    id: `faq-${idx}`,
    title: faq.question,
    content: (
      <div className="leading-relaxed text-slate-600 dark:text-slate-400">
        {faq.answer}
      </div>
    ),
  }));

  return (
    <section className="my-10 rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
      <div className="flex items-center gap-2 mb-2">
        <span className="size-2 rounded-full bg-emerald-500" />
        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500">
          Official Fee Breakdown
        </span>
      </div>
      <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
        Frequently Asked Questions
      </h2>
      <p className="mt-1 text-xs sm:text-sm text-slate-500 mb-6">
        Click to expand verified merchant policy details and 2026 platform rules.
      </p>

      <BlurAccordion items={items} multiple={false} />
    </section>
  );
}
