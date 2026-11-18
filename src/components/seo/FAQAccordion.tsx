"use client";

import { FAQItem } from "@/data/tools-registry";
import { HelpCircle } from "lucide-react";
import { BlurAccordion } from "@/components/motion/blur-accordion";

export function FAQAccordion({ faqs }: { faqs: FAQItem[] }) {
  if (!faqs || faqs.length === 0) return null;

  const items = faqs.map((faq, idx) => ({
    id: `faq-${idx}`,
    title: faq.question,
    content: (
      <div className="leading-relaxed text-sm text-zinc-800 font-medium pt-1">
        {faq.answer}
      </div>
    ),
  }));

  return (
    <section className="my-10 rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-2xs">
      <div className="flex items-center gap-2 mb-4">
        <HelpCircle className="size-5 text-zinc-900" />
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950">
          Frequently Asked Questions
        </h2>
      </div>

      <BlurAccordion items={items} multiple={false} />
    </section>
  );
}
