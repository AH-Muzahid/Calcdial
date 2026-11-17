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
      <label className="text-xs font-semibold text-gray-700">{label}</label>
      <div className="relative">
        <select
          value={selectedId}
          onChange={(e) => onSelect(e.target.value)}
          className="h-11 min-h-[44px] w-full rounded-xl border border-gray-300 bg-white px-3.5 text-base sm:text-sm font-medium text-gray-800 shadow-xs focus:border-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
        >
          {options.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      {helpText && <p className="text-[11px] text-gray-500">{helpText}</p>}
    </div>
  );
}
