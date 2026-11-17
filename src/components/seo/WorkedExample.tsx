import { WorkedExample as WorkedExampleType } from "@/data/tools-registry";

export function WorkedExample({ examples }: { examples: WorkedExampleType[] }) {
  if (!examples || examples.length === 0) return null;

  return (
    <section className="my-8 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-xs">
      <h2 className="text-xl font-bold tracking-tight text-gray-900">
        Realistic Worked Examples & Scenarios
      </h2>
      <p className="mt-2 text-sm text-gray-600 leading-relaxed">
        See how fee schedules and margins apply to real products and typical seller basket values.
      </p>

      <div className="mt-6 space-y-6">
        {examples.map((example, idx) => (
          <div key={idx} className="rounded-xl border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900">
                Example {idx + 1}: {example.label}
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200 p-4 gap-4 text-xs">
              <div>
                <span className="block font-semibold uppercase tracking-wider text-gray-400 mb-2">
                  Inputs Provided
                </span>
                <dl className="space-y-1.5">
                  {Object.entries(example.inputs).map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <dt className="text-gray-500">{k}:</dt>
                      <dd className="font-medium text-gray-800">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="md:pl-4">
                <span className="block font-semibold uppercase tracking-wider text-emerald-600 mb-2">
                  Calculated Net Result
                </span>
                <dl className="space-y-1.5">
                  {Object.entries(example.result).map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <dt className="text-gray-500">{k}:</dt>
                      <dd className="font-bold text-gray-900">{v}</dd>
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
