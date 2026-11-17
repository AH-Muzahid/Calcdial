interface FormulaBreakdownProps {
  formulaMarkdown: string;
  toolTitle: string;
}

export function FormulaBreakdown({ formulaMarkdown, toolTitle }: FormulaBreakdownProps) {
  return (
    <section className="my-10 rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
      <div className="flex items-center gap-2 mb-2">
        <span className="size-2 rounded-full bg-emerald-500" />
        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500">
          Mathematical Model
        </span>
      </div>
      <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
        How the {toolTitle} Works (2026 Methodology)
      </h2>
      <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
        Our calculations use official published merchant fee schedules. We calculate all percentage rates on gross transaction order totals (item price plus buyer-paid shipping where applicable), add flat item transaction or listing fees, and compute net margin percentages.
      </p>

      <div className="mt-5 rounded-2xl bg-slate-950 p-5 text-emerald-400 font-mono text-xs sm:text-sm overflow-x-auto shadow-inner border border-slate-800">
        <div className="flex items-center gap-1.5 text-slate-500 text-[10px] uppercase font-bold mb-2">
          <span className="size-2 rounded-full bg-slate-700" />
          <span>Formula Engine</span>
        </div>
        <code>{formulaMarkdown.replace(/`/g, "")}</code>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs text-slate-600">
        <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/80">
          <strong className="block font-semibold text-slate-900 mb-1">Direct Gross Deductions</strong>
          Transaction commission and category referral percentages are deducted directly from gross customer checkout values.
        </div>
        <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/80">
          <strong className="block font-semibold text-slate-900 mb-1">Client-Side Computation</strong>
          Zero calculations touch an external server. Your financial inputs remain 100% private in your browser.
        </div>
      </div>
    </section>
  );
}
