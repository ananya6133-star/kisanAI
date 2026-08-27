import React, { useState } from 'react';
import { Card, CardHeader, CardBody } from '../common/Card';
import { Badge } from '../common/Badge';
import { Zap, Clock, CheckCircle } from 'lucide-react';

export function PriorityActions({ actions = [] }) {
  const [completed, setCompleted] = useState({});

  const toggleAction = (idx) => {
    setCompleted((prev) => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  if (!actions || actions.length === 0) return null;

  return (
    <Card className="border-amber-200/80 bg-gradient-to-b from-amber-50/30 to-white shadow-sm overflow-hidden">
      <CardHeader className="bg-amber-50/50 border-amber-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500 text-white shadow-sm">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900 font-display">Immediate Action Plan</h4>
            <p className="text-xs text-slate-500">Prioritized operational steps for the farmer</p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900">
          {actions.length} Action Items
        </span>
      </CardHeader>

      <CardBody className="p-4 sm:p-6 space-y-3">
        {actions.map((item, idx) => {
          const isDone = Boolean(completed[idx]);

          return (
            <div
              key={idx}
              onClick={() => toggleAction(idx)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                isDone
                  ? 'bg-slate-50/80 border-slate-200 opacity-60'
                  : 'bg-white border-slate-200/90 hover:border-amber-300 hover:shadow-sm'
              }`}
            >
              <button
                type="button"
                className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-colors flex-shrink-0 ${
                  isDone
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'border-slate-300 bg-white hover:border-slate-400'
                }`}
              >
                {isDone && <CheckCircle className="w-3.5 h-3.5" />}
              </button>

              <div className="flex-1 space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className={`text-sm font-semibold ${isDone ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                    {item.action}
                  </p>
                  <Badge variant={item.priority} size="sm">
                    {item.priority} Priority
                  </Badge>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Timeframe: <strong className="text-slate-700">{item.timeframe}</strong></span>
                </div>
              </div>
            </div>
          );
        })}
      </CardBody>
    </Card>
  );
}

export function RecommendationCard({
  title,
  subtitle,
  icon: Icon,
  items = [],
  color = 'emerald'
}) {
  if (!items || items.length === 0) return null;

  const colorVariants = {
    emerald: {
      iconBg: 'bg-emerald-100 text-emerald-800',
      border: 'border-emerald-100'
    },
    blue: {
      iconBg: 'bg-blue-100 text-blue-800',
      border: 'border-blue-100'
    },
    amber: {
      iconBg: 'bg-amber-100 text-amber-800',
      border: 'border-amber-100'
    },
    purple: {
      iconBg: 'bg-purple-100 text-purple-800',
      border: 'border-purple-100'
    }
  };

  const style = colorVariants[color] || colorVariants.emerald;

  return (
    <Card className="p-6 bg-white border-slate-200">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-4">
        <div className={`p-2.5 rounded-xl ${style.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-base font-bold text-slate-900 font-display">{title}</h4>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </div>
      </div>

      <div className="space-y-3.5">
        {items.map((item, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-slate-50/60 border border-slate-100 space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <h5 className="text-sm font-semibold text-slate-800">{item.title}</h5>
              <Badge variant={item.priority} size="sm">
                {item.priority}
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
