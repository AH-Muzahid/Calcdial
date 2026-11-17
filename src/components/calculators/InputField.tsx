interface InputFieldProps {
  label: string;
  value: number | string;
  onChange: (val: number) => void;
  prefix?: string;
  suffix?: string;
  helpText?: string;
  min?: number;
  max?: number;
  step?: number | string;
  id?: string;
  presets?: number[];
}

export function InputField({
  label,
  value,
  onChange,
  prefix,
  suffix,
  helpText,
  min = 0,
  max,
  step = "any",
  id,
  presets,
}: InputFieldProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");
  const numValue = typeof value === "number" ? value : parseFloat(value) || 0;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={inputId} className="text-xs font-semibold text-slate-700">
          {label}
        </label>
        {presets && presets.length > 0 && (
          <div className="flex items-center gap-1">
            {presets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => onChange(preset)}
                className={`rounded-md px-1.5 py-0.5 text-[10px] font-mono font-medium transition-colors ${
                  numValue === preset
                    ? "bg-emerald-600 text-white font-bold"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                ${preset}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="relative flex items-center rounded-xl border border-slate-300 bg-white shadow-2xs transition-all focus-within:border-emerald-600 focus-within:ring-3 focus-within:ring-emerald-500/15">
        {prefix && (
          <span className="pl-3.5 pr-1 text-sm font-mono font-semibold text-slate-400 select-none">
            {prefix}
          </span>
        )}
        <input
          id={inputId}
          type="number"
          inputMode="decimal"
          min={min}
          max={max}
          step={step}
          value={value === 0 ? "" : value}
          onChange={(e) => {
            const parsed = parseFloat(e.target.value);
            onChange(isNaN(parsed) ? 0 : parsed);
          }}
          placeholder="0.00"
          className="h-11 min-h-[44px] w-full rounded-xl bg-transparent px-3 text-base sm:text-sm font-mono font-medium text-slate-900 placeholder-slate-400 focus:outline-hidden"
        />
        {suffix && (
          <span className="pr-3.5 pl-1 text-xs font-mono font-medium text-slate-400 select-none">
            {suffix}
          </span>
        )}
      </div>
      {helpText && <p className="text-[11px] text-slate-500">{helpText}</p>}
    </div>
  );
}
