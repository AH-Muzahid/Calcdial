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
}: InputFieldProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-xs font-semibold text-gray-700">
        {label}
      </label>
      <div className="relative flex items-center rounded-xl border border-gray-300 bg-white shadow-xs focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20">
        {prefix && (
          <span className="pl-3.5 pr-1 text-sm font-medium text-gray-400 select-none">
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
          className="h-11 min-h-[44px] w-full rounded-xl bg-transparent px-3 text-base sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-hidden"
        />
        {suffix && (
          <span className="pr-3.5 pl-1 text-xs font-medium text-gray-400 select-none">
            {suffix}
          </span>
        )}
      </div>
      {helpText && <p className="text-[11px] text-gray-500">{helpText}</p>}
    </div>
  );
}
