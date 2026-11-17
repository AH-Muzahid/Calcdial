import { WorkedExample as WorkedExampleType } from "@/data/tools-registry";

export function WorkedExample({ examples }: { examples: WorkedExampleType[] }) {
  if (!examples || examples.length === 0) return null;

  return (
    <section className="my-10 rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
      <div className="flex items-center gap-2 mb-2">
        <span className="size-2 rounded-full bg-emerald-500" />
        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500">
          Real Scenarios
        </span>
      </div>
      <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
        Realistic Worked Examples & Scenarios
      </h2>
      <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
        See how fee schedules and margins apply to real products and typical seller basket values.
      </p>

      <div className="mt-6 space-y-5">
        {examples.map((example, idx) => (
          <div key={idx} className="rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs">
            <div className="bg-slate-50/80 px-5 py-3 border-b border-slate-200/80 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">
                Scenario #{idx + 1}: {example.label}
              </h3>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                Verified Model
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 p-5 gap-5 text-xs">
              <div>
                <span className="block font-mono font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Seller Inputs
                </span>
                <dl className="space-y-1.5">
                  {Object.entries(example.inputs).map(([k, v]) => (
                    <div key={k} className="flex justify-between py-0.5">
                      <dt className="text-slate-500">{k}:</dt>
                      <dd className="font-mono font-medium text-slate-800">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="md:pl-5">
                <span className="block font-mono font-semibold uppercase tracking-wider text-emerald-600 mb-2">
                  Calculated Output
                </span>
                <dl className="space-y-1.5">
                  {Object.entries(example.result).map(([k, v]) => (
                    <div key={k} className="flex justify-between py-0.5">
                      <dt className="text-slate-500">{k}:</dt>
                      <dd className="font-mono font-bold text-slate-900">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
