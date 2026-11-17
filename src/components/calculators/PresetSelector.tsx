interface PresetOption {
  id: string;
  label: string;
}

interface PresetSelectorProps {
  label: string;
  selectedId: string;
  options: PresetOption[];
  onSelect: (id: string) => void;
  helpText?: string;
}

export function PresetSelector({
  label,
  selectedId,
  options,
  onSelect,
  helpText,
}: PresetSelectorProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-slate-700">{label}</label>
      <div className="relative">
        <select
          value={selectedId}
          onChange={(e) => onSelect(e.target.value)}
          className="h-11 min-h-[44px] w-full cursor-pointer appearance-none rounded-xl border border-slate-300 bg-white px-3.5 pr-8 text-base sm:text-sm font-medium text-slate-800 shadow-2xs transition-all focus:border-emerald-600 focus:outline-hidden focus:ring-3 focus:ring-emerald-500/15"
        >
          {options.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
          <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {helpText && <p className="text-[11px] text-slate-500">{helpText}</p>}
    </div>
  );
}
