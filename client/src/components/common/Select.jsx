import React from 'react';
import { ChevronDown } from 'lucide-react';

export function Select({
  label,
  error,
  helperText,
  required = false,
  options = [],
  className = '',
  id,
  ...props
}) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-slate-700 flex items-center justify-between">
          <span>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </span>
          {!required && (
            <span className="text-xs text-slate-400 font-normal">Optional</span>
          )}
        </label>
      )}

      <div className="relative">
        <select
          id={selectId}
          className={`w-full appearance-none rounded-xl border bg-white text-slate-900 text-sm transition-all duration-150 pl-3.5 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-slate-50 disabled:text-slate-500 ${
            error
              ? 'border-red-400 focus:ring-red-400 focus:border-red-400 bg-red-50/20'
              : 'border-slate-300 hover:border-slate-400'
          }`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {error && (
        <p className="text-xs text-red-600 font-medium">{error}</p>
      )}
      {!error && helperText && (
        <p className="text-xs text-slate-500">{helperText}</p>
      )}
    </div>
  );
}
