"use client";

import { useState } from "react";
import { FAQItem } from "@/data/tools-registry";

export function FAQAccordion({ faqs }: { faqs: FAQItem[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="my-8 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-xs">
      <h2 className="text-xl font-bold tracking-tight text-gray-900">
        Frequently Asked Questions
      </h2>
      <p className="mt-2 text-sm text-gray-600">
        Common questions and official merchant fee schedule details for online sellers.
      </p>

      <div className="mt-6 divide-y divide-gray-200 border-t border-gray-200">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div key={idx} className="py-4">
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="flex w-full items-center justify-between text-left text-sm font-semibold text-gray-900 focus:outline-hidden"
              >
                <span>{faq.question}</span>
                <span className="ml-4 shrink-0 text-emerald-600 text-lg">
                  {isOpen ? "−" : "+"}
                </span>
              </button>
              {isOpen && (
                <p className="mt-2.5 text-xs sm:text-sm text-gray-600 leading-relaxed pr-4">
                  {faq.answer}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
