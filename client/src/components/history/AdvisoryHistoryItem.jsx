import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Sprout, Calendar, MapPin, Trash2, ArrowRight, Layers, Droplet } from 'lucide-react';

export function AdvisoryHistoryItem({ advisory, onDelete }) {
  if (!advisory) return null;

  const result = advisory.advisory_result || {};
  const suitability = result.crop_assessment?.suitability || 'Suitable';
  const dateFormatted = new Date(advisory.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <Card hoverEffect className="p-5 bg-white border-slate-200 flex flex-col justify-between group">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold flex-shrink-0">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900 font-display group-hover:text-emerald-700 transition-colors">
                {advisory.crop_name}
              </h4>
              <p className="text-xs text-slate-500 font-medium">{advisory.category}</p>
            </div>
          </div>
          <Badge variant={suitability} size="sm">
            {suitability}
          </Badge>
        </div>

        {/* Details snippet */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
          {result.summary || 'Crop advisory with tailored soil, nutrient, and irrigation management guidelines.'}
        </p>

        {/* Metadata badges */}
        <div className="flex flex-wrap gap-2 text-[11px] text-slate-500 mb-4">
          <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
            <Calendar className="w-3 h-3 text-slate-400" />
            {dateFormatted}
          </span>
          {advisory.location && (
            <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
              <MapPin className="w-3 h-3 text-slate-400" />
              {advisory.location}
            </span>
          )}
          {advisory.soil_type && (
            <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
              <Layers className="w-3 h-3 text-slate-400" />
              {advisory.soil_type}
            </span>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onDelete(advisory)}
          className="text-xs text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-1"
          title="Delete Advisory"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Delete</span>
        </button>

        <Link
          to={`/advisory/${advisory.id}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </Card>
  );
}
