import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Sprout, Calendar, MapPin, ArrowRight, ShieldAlert } from 'lucide-react';

export function RecentAdvisoryCard({ advisory }) {
  if (!advisory) return null;

  const result = advisory.advisory_result || {};
  const suitability = result.crop_assessment?.suitability || 'Suitable';
  const priorityActionsCount = result.priority_actions?.length || 0;
  const dateFormatted = new Date(advisory.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <Card hoverEffect className="p-5 sm:p-6 bg-gradient-to-br from-white via-white to-emerald-50/20 border-slate-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100/90 text-emerald-800 flex items-center justify-center font-bold shadow-sm">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-lg font-bold text-slate-900 font-display">{advisory.crop_name}</h4>
              <Badge variant={suitability}>{suitability}</Badge>
            </div>
            <p className="text-xs text-slate-500 font-medium">{advisory.category} • {advisory.growth_stage || 'General stage'}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {dateFormatted}
          </span>
          {advisory.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {advisory.location}
            </span>
          )}
        </div>
      </div>

      <div className="py-4">
        <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed mb-3">
          {result.summary || 'Crop advisory generated based on soil, irrigation, and seasonal factors.'}
        </p>

        {result.priority_actions && result.priority_actions[0] && (
          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-2.5 text-xs text-amber-900">
            <ShieldAlert className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-amber-800">Next Priority Action: </span>
              {result.priority_actions[0].action} ({result.priority_actions[0].timeframe})
            </div>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-400">
          {priorityActionsCount} recommended actions
        </span>
        <Link
          to={`/advisory/${advisory.id}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800 group"
        >
          View Full Advisory
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </Card>
  );
}

export function QuickActionCard({
  title,
  description,
  buttonLabel,
  onClick,
  to,
  icon: Icon = Sprout,
  gradient = 'from-emerald-700 to-emerald-900'
}) {
  const content = (
    <div className={`p-6 rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg relative overflow-hidden group hover:shadow-glow transition-all`}>
      <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform pointer-events-none" />
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-white/15 backdrop-blur-md text-white border border-white/20">
            <Icon className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-display">{title}</h3>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-md">{description}</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-emerald-900 font-semibold text-sm shadow hover:bg-emerald-50 transition-colors">
          {buttonLabel}
          <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </div>
  );

  if (to) {
    return <Link to={to} className="block">{content}</Link>;
  }

  return <div onClick={onClick} className="cursor-pointer">{content}</div>;
}
