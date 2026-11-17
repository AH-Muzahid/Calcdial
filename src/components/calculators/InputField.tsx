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
  const inputId = id || label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const numValue = typeof value === "number" ? value : parseFloat(value) || 0;

  return (
    <div className="flex flex-col gap-1.5">
      {/* Label Row - 100% width, never collides with preset chips */}
      <div className="flex items-start justify-between gap-2">
        <label
          htmlFor={inputId}
          className="text-xs font-semibold text-zinc-900 leading-snug tracking-tight"
        >
          {label}
        </label>
      </div>

      {/* Input Box */}
      <div className="relative flex items-center rounded-xl border border-zinc-200 bg-white shadow-2xs transition-all focus-within:border-zinc-900 focus-within:ring-2 focus-within:ring-zinc-900/5">
        {prefix && (
          <span className="pl-3.5 pr-1 text-sm font-mono font-semibold text-zinc-400 select-none">
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
          className="h-11 min-h-[44px] w-full rounded-xl bg-transparent px-3 text-base sm:text-sm font-mono font-medium text-zinc-950 placeholder-zinc-400 focus:outline-hidden"
        />
        {suffix && (
          <span className="pr-3.5 pl-1 text-xs font-mono font-medium text-zinc-400 select-none">
            {suffix}
          </span>
        )}
      </div>

      {/* Quick Presets Row - positioned cleanly below input, completely isolated from label */}
      {presets && presets.length > 0 && (
        <div className="flex flex-wrap items-center gap-1 pt-0.5">
          <span className="text-[10px] font-mono text-zinc-400 mr-0.5 select-none">Presets:</span>
          {presets.map((preset) => {
            const isSelected = Math.abs(numValue - preset) < 0.001;
            const displayVal = suffix === "%" ? `${preset}%` : prefix ? `${prefix}${preset}` : `${preset}`;
            return (
              <button
                key={preset}
                type="button"
                onClick={() => onChange(preset)}
                className={`h-6 px-2 rounded-md text-[11px] font-mono font-medium transition-all cursor-pointer ${
                  isSelected
                    ? "bg-zinc-900 text-white font-medium shadow-2xs border border-zinc-900"
                    : "bg-zinc-100/90 text-zinc-600 hover:bg-zinc-200/80 hover:text-zinc-950 border border-zinc-200/70"
                }`}
              >
                {displayVal}
              </button>
            );
          })}
        </div>
      )}

      {helpText && <p className="text-[11px] text-zinc-400">{helpText}</p>}
    </div>
  );
}
