interface FormulaBreakdownProps {
  formulaMarkdown: string;
  toolTitle: string;
}

export function FormulaBreakdown({ formulaMarkdown, toolTitle }: FormulaBreakdownProps) {
  return (
    <section className="my-8 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-xs">
      <h2 className="text-xl font-bold tracking-tight text-gray-900">
        How the {toolTitle} Works (2026 Methodology)
      </h2>
      <p className="mt-2 text-sm text-gray-600 leading-relaxed">
        Our calculations use official published merchant fee schedules. We calculate all percentage rates on gross transaction order totals (item price plus buyer-paid shipping where applicable), add flat item transaction or listing fees, and compute net margin percentages.
      </p>

      <div className="mt-4 rounded-xl bg-gray-900 p-4 text-emerald-400 font-mono text-xs sm:text-sm overflow-x-auto">
        <code>{formulaMarkdown.replace(/`/g, "")}</code>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs text-gray-600">
        <div className="rounded-lg bg-gray-50 p-3 border border-gray-100">
          <strong className="block font-semibold text-gray-800">Direct Deductions</strong>
          Transaction commission and category referral percentages are deducted directly from gross customer checkout values.
        </div>
        <div className="rounded-lg bg-gray-50 p-3 border border-gray-100">
          <strong className="block font-semibold text-gray-800">Client-Side Computation</strong>
          Zero calculations touch an external server. Your financial inputs remain 100% private in your browser.
        </div>
      </div>
    </section>
  );
}
