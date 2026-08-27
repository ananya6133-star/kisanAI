import React from 'react';
import { Loader2 } from 'lucide-react';

export function Spinner({ size = 'md', className = '', label }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
    xl: 'w-14 h-14'
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <Loader2 className={`${sizes[size] || sizes.md} animate-spin text-emerald-600`} />
      {label && <p className="text-sm text-slate-500 font-medium">{label}</p>}
    </div>
  );
}

export function Skeleton({ className = '' }) {
  return (
    <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`} />
  );
}
