import { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ContactForm } from "@/components/common/ContactForm";

export const metadata: Metadata = {
  title: "Contact Support & Inquiries",
  description:
    "Get in touch with the CalcDial team for calculator feedback, fee schedule corrections, partnerships, or tool suggestions.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Contact Us" }]} />

      <header className="border-b border-zinc-200/90 pb-7">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200/80 bg-zinc-100/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-zinc-600">
          Get in Touch
        </div>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl">
          Contact the CalcDial Team
        </h1>
        <p className="mt-3 text-base text-zinc-600 leading-relaxed">
          We value feedback from e-commerce sellers, developers, and platform partners. Have a question, noticed a fee change, or want to suggest a new tool? Reach out below.
        </p>
      </header>

      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-12">
        <div className="md:col-span-7">
          <ContactForm />
        </div>

        <div className="md:col-span-5 space-y-5 text-sm text-zinc-600">
          <div className="rounded-2xl border border-zinc-200/90 bg-zinc-50/70 p-6 shadow-2xs">
            <h3 className="font-bold text-zinc-950">Direct Inquiries</h3>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-zinc-600">
              For editorial corrections, developer inquiries, or partnership discussions, you can reach our editorial desk directly:
            </p>
            <div className="mt-3.5 inline-flex items-center gap-2 rounded-xl border border-zinc-200/90 bg-white px-3.5 py-2 font-mono text-xs font-semibold text-zinc-950 shadow-2xs">
              support@calcdial.com
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200/90 bg-zinc-50/70 p-6 shadow-2xs">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
                Quarterly Audits
              </span>
            </div>
            <h3 className="font-bold text-zinc-950">Platform Fee Submissions</h3>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-zinc-600">
              We review fee schedules every 90 days. If you operate an e-commerce platform and updated your fee structure, send documentation directly so we can verify and update our registry.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
