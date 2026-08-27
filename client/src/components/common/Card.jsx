import React from 'react';

export function Card({
  children,
  className = '',
  hoverEffect = false,
  glass = false,
  ...props
}) {
  const baseStyles = 'rounded-2xl border transition-all duration-200';
  const surfaceStyles = glass
    ? 'glass-panel shadow-glass'
    : 'bg-white border-slate-200/80 shadow-sm';
  const hoverStyles = hoverEffect ? 'hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5' : '';

  return (
    <div
      className={`${baseStyles} ${surfaceStyles} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`p-5 sm:p-6 border-b border-slate-100 ${className}`}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = '' }) {
  return (
    <div className={`p-5 sm:p-6 ${className}`}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={`p-4 sm:p-5 bg-slate-50/60 border-t border-slate-100 rounded-b-2xl ${className}`}>
      {children}
    </div>
  );
}
