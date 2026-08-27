import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export function Alert({
  children,
  title,
  type = 'info',
  onClose,
  className = ''
}) {
  const types = {
    info: {
      bg: 'bg-blue-50/80 border-blue-200 text-blue-900',
      icon: Info,
      iconColor: 'text-blue-600'
    },
    success: {
      bg: 'bg-emerald-50/80 border-emerald-200 text-emerald-900',
      icon: CheckCircle2,
      iconColor: 'text-emerald-600'
    },
    warning: {
      bg: 'bg-amber-50/80 border-amber-200 text-amber-900',
      icon: AlertTriangle,
      iconColor: 'text-amber-600'
    },
    error: {
      bg: 'bg-red-50/80 border-red-200 text-red-900',
      icon: AlertCircle,
      iconColor: 'text-red-600'
    }
  };

  const current = types[type] || types.info;
  const Icon = current.icon;

  return (
    <div className={`flex items-start gap-3.5 p-4 rounded-xl border ${current.bg} ${className}`}>
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${current.iconColor}`} />
      <div className="flex-1 text-sm">
        {title && <h5 className="font-semibold mb-1">{title}</h5>}
        <div className="text-slate-700 leading-relaxed">{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
