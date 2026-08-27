import React from 'react';

export function Textarea({
  label,
  error,
  helperText,
  required = false,
  rows = 3,
  className = '',
  id,
  ...props
}) {
  const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={textareaId} className="text-sm font-medium text-slate-700 flex items-center justify-between">
          <span>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </span>
          {!required && (
            <span className="text-xs text-slate-400 font-normal">Optional</span>
          )}
        </label>
      )}

      <textarea
        id={textareaId}
        rows={rows}
        className={`w-full rounded-xl border bg-white text-slate-900 text-sm transition-all duration-150 p-3 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-slate-50 disabled:text-slate-500 ${
          error
            ? 'border-red-400 focus:ring-red-400 focus:border-red-400 bg-red-50/20'
            : 'border-slate-300 hover:border-slate-400'
        }`}
        {...props}
      />

      {error && (
        <p className="text-xs text-red-600 font-medium">{error}</p>
      )}
      {!error && helperText && (
        <p className="text-xs text-slate-500">{helperText}</p>
      )}
    </div>
  );
}
