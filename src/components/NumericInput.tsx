import React, { useState, useEffect } from 'react';

interface NumericInputProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  step?: string | number;
  min?: number;
  max?: number;
  unit?: string;
  helperText?: string;
  placeholder?: string;
  className?: string;
}

export const NumericInput: React.FC<NumericInputProps> = ({
  label,
  value,
  onChange,
  step = 'any',
  min,
  max,
  unit,
  helperText,
  placeholder,
  className = ''
}) => {
  // Keep local string state so user can clear the field completely, type decimals, commas, etc.
  const [localStr, setLocalStr] = useState<string>(
    value !== undefined && !isNaN(value) ? String(value) : ''
  );

  useEffect(() => {
    const parsedLocal = parseFloat(localStr.replace(',', '.'));
    if (parsedLocal !== value && !isNaN(value)) {
      setLocalStr(String(value));
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setLocalStr(raw);

    if (raw.trim() === '') {
      // User cleared the input - allow it to remain blank while typing!
      return;
    }

    const clean = raw.replace(',', '.');
    const parsed = parseFloat(clean);
    if (!isNaN(parsed)) {
      onChange(parsed);
    }
  };

  const handleBlur = () => {
    const clean = localStr.replace(',', '.').trim();
    if (clean === '' || isNaN(parseFloat(clean))) {
      // If left blank upon blur, restore a sensible default
      const fallback = min !== undefined ? min : (value || 0);
      setLocalStr(String(fallback));
      onChange(fallback);
    } else {
      const parsed = parseFloat(clean);
      let clamped = parsed;
      if (min !== undefined && clamped < min) clamped = min;
      if (max !== undefined && clamped > max) clamped = max;
      setLocalStr(String(clamped));
      onChange(clamped);
    }
  };

  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex justify-between items-center">
        <label className="text-xs font-semibold text-slate-700">{label}</label>
        {unit && <span className="text-[11px] font-mono text-slate-500 font-medium">{unit}</span>}
      </div>

      <div className="relative">
        <input
          type="text"
          inputMode="decimal"
          value={localStr}
          onChange={handleChange}
          onBlur={handleBlur}
          step={step}
          placeholder={placeholder || (min !== undefined ? `Mín: ${min}` : '')}
          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-mono text-slate-900 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 focus:outline-hidden transition-all shadow-2xs"
        />
      </div>

      {helperText && <p className="text-[11px] text-slate-500 leading-tight">{helperText}</p>}
    </div>
  );
};
