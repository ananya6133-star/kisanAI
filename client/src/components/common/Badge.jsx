import React from 'react';

export function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  icon: Icon,
  className = '',
  ...props
}) {
  const variants = {
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    amber: 'bg-amber-50 text-amber-800 border-amber-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    
    // Priority mappings
    high: 'bg-red-50 text-red-700 border-red-200 font-semibold',
    medium: 'bg-amber-50 text-amber-800 border-amber-200 font-medium',
    low: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-medium',
    
    // Suitability mappings
    suitable: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold',
    'moderately suitable': 'bg-amber-100 text-amber-800 border-amber-300 font-bold',
    unsuitable: 'bg-red-100 text-red-800 border-red-300 font-bold',
    'insufficient information': 'bg-slate-100 text-slate-700 border-slate-300 font-medium',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  };

  const key = variant.toLowerCase();
  const selectedVariant = variants[key] || variants.neutral;

  return (
    <span
      className={`inline-flex items-center rounded-full border ${selectedVariant} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {children}
    </span>
  );
}
