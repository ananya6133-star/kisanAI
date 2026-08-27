import React from 'react';
import { Sprout, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export function EmptyState({
  icon: Icon = Sprout,
  title = 'No records found',
  description = 'There is currently no data available to display.',
  actionLabel,
  onAction,
  actionIcon,
  className = ''
}) {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 ${className}`}>
      <div className="w-14 h-14 rounded-2xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center mb-4 shadow-sm">
        <Icon className="w-7 h-7" />
      </div>
      <h4 className="text-base sm:text-lg font-semibold text-slate-800 font-display mb-1">{title}</h4>
      <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction} icon={actionIcon}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'An unexpected error occurred while loading this section.',
  onRetry,
  className = ''
}) {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-red-200 bg-red-50/50 ${className}`}>
      <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h4 className="text-base font-semibold text-red-900 font-display mb-1">{title}</h4>
      <p className="text-sm text-red-700 max-w-md mb-5 leading-relaxed">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} icon={RefreshCw}>
          Try Again
        </Button>
      )}
    </div>
  );
}
