import React from 'react';
import { Card } from '../common/Card';

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'emerald',
  className = ''
}) {
  const colorMap = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    amber: 'bg-amber-50 text-amber-800 border-amber-100',
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
    purple: 'bg-purple-50 text-purple-700 border-purple-100',
  };

  return (
    <Card className={`p-5 relative overflow-hidden ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">{title}</p>
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display tracking-tight">{value}</h3>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1 font-medium">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-2xl border ${colorMap[color] || colorMap.emerald}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      {trend && (
        <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center gap-1.5">
          <span className="text-emerald-600 font-semibold">{trend}</span>
        </div>
      )}
    </Card>
  );
}
