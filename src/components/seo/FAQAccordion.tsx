"use client";

import { useState } from "react";
import { FAQItem } from "@/data/tools-registry";
import { HelpCircle, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export function FAQAccordion({ faqs }: { faqs: FAQItem[] }) {
  if (!faqs || faqs.length === 0) return null;

  // First item open by default for immediate value & zero CLS
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="my-10 pt-8 sm:pt-10 border-t border-zinc-200 print:hidden font-sans">
      {/* Header - Clean, No outer card wrapper */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1.5">
          <HelpCircle className="size-5 text-zinc-900" />
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-zinc-950">
            Frequently Asked Questions
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-zinc-600 font-medium">
          Verified answers regarding transaction fee calculations, gateway deductions, and net profit margins.
        </p>
      </div>

      {/* Clean Divider-Based Accordion List — Zero Box-in-Box, Zero Double Padding */}
      <div className="divide-y divide-zinc-200/80 border-y border-zinc-200/80">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          const panelId = `faq-panel-${idx}`;
          const buttonId = `faq-btn-${idx}`;

          return (
            <div key={idx} className="transition-colors">
              <h3>
                <button
                  type="button"
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between py-4 sm:py-5 text-left text-sm sm:text-base font-bold text-zinc-950 hover:text-blue-600 transition-colors cursor-pointer gap-4 group"
                >
                  <span className="leading-snug">{faq.question}</span>
                  <span
                    className={cn(
                      "size-7 shrink-0 grid place-items-center rounded-full bg-zinc-100 text-zinc-600 group-hover:bg-zinc-200 group-hover:text-zinc-950 transition-all duration-200",
                      isOpen && "rotate-180 bg-zinc-950 text-white group-hover:bg-zinc-900 group-hover:text-white"
                    )}
                  >
                    <ChevronDown className="size-4" />
                  </span>
                </button>
              </h3>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="pb-5 pt-0.5 text-xs sm:text-sm text-zinc-700 leading-relaxed font-medium max-w-3xl">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
