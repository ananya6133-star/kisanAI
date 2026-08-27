import React from 'react';

export function Input({
  label,
  error,
  helperText,
  icon: Icon,
  required = false,
  className = '',
  id,
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-slate-700 flex items-center justify-between">
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
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        
        <input
          id={inputId}
          className={`w-full rounded-xl border bg-white text-slate-900 text-sm transition-all duration-150 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-slate-50 disabled:text-slate-500 ${
            Icon ? 'pl-10' : 'pl-3.5'
          } pr-3.5 py-2.5 ${
            error
              ? 'border-red-400 focus:ring-red-400 focus:border-red-400 bg-red-50/20'
              : 'border-slate-300 hover:border-slate-400'
          }`}
          {...props}
        />
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
