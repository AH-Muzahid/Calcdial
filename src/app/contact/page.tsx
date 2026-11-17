import { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export const metadata: Metadata = {
  title: "Contact FeeSnap — Support, Feedback & Fee Inquiries",
  description:
    "Get in touch with the FeeSnap team for calculator feedback, fee schedule corrections, partnerships, or tool suggestions.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Contact Us" }]} />

      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
        Contact the FeeSnap Team
      </h1>
      <p className="mt-3 text-base text-gray-600 leading-relaxed">
        We value feedback from e-commerce sellers, developers, and platform partners. Have a question, noticed a fee change, or want to suggest a new tool? Reach out below.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-12 border-t border-gray-200 pt-8">
        <div className="md:col-span-7">
          <form className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
            <div>
              <label className="block text-xs font-semibold text-gray-700">Your Name</label>
              <input
                type="text"
                placeholder="Sarah Jenkins"
                className="mt-1 h-11 w-full rounded-xl border border-gray-300 px-3.5 text-sm text-gray-900 focus:border-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700">Email Address</label>
              <input
                type="email"
                placeholder="sarah@example.com"
                className="mt-1 h-11 w-full rounded-xl border border-gray-300 px-3.5 text-sm text-gray-900 focus:border-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700">Subject</label>
              <select className="mt-1 h-11 w-full rounded-xl border border-gray-300 px-3.5 text-sm text-gray-900 focus:border-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20">
                <option>Report Fee Schedule Change / Outdated Rate</option>
                <option>Suggest a New Calculator / Feature</option>
                <option>Partnership or Advertising Inquiry</option>
                <option>General Question</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700">Message</label>
              <textarea
                rows={4}
                placeholder="Tell us what you need or provide a link to the updated fee schedule..."
                className="mt-1 w-full rounded-xl border border-gray-300 p-3 text-sm text-gray-900 focus:border-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <button
              type="button"
              className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white shadow-xs transition hover:bg-emerald-700"
            >
              Send Message
            </button>
            <p className="text-[11px] text-gray-400 text-center">
              We generally respond within 24–48 business hours.
            </p>
          </form>
        </div>

        <div className="md:col-span-5 space-y-6 text-sm text-gray-600">
          <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-6">
            <h3 className="font-bold text-gray-900">Direct Inquiries</h3>
            <p className="mt-2 text-xs leading-relaxed text-gray-600">
              For editorial corrections, developer inquiries, or partnership discussions, you can reach our editorial desk directly:
            </p>
            <div className="mt-3 font-mono text-xs font-semibold text-emerald-700">
              support@feesnap.com
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-6">
            <h3 className="font-bold text-gray-900">Quarterly Audits</h3>
            <p className="mt-2 text-xs leading-relaxed text-gray-600">
              We review fee schedules every 90 days. If you operate an e-commerce platform and updated your fee structure, send documentation directly so we can verify and update our registry.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
