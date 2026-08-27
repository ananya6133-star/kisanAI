import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Sparkles, CheckCircle2, AlertTriangle, XCircle, HelpCircle } from 'lucide-react';

export function SummaryCard({ summary, cropName, date }) {
  return (
    <Card className="p-6 bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-950 text-white relative overflow-hidden shadow-xl border-emerald-800/50">
      <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="relative z-10 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-400/20">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs uppercase tracking-wider font-bold text-emerald-300">
              Executive AI Advisory Summary
            </span>
          </div>
          {date && (
            <span className="text-xs text-emerald-200/60">
              Generated {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          )}
        </div>

        <h3 className="text-xl sm:text-2xl font-bold font-display text-white leading-snug">
          Advisory Synthesis for {cropName}
        </h3>

        <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
          {summary}
        </p>
      </div>
    </Card>
  );
}

export function CropAssessmentCard({ assessment }) {
  if (!assessment) return null;

  const suitabilityIcons = {
    'Suitable': CheckCircle2,
    'Moderately Suitable': AlertTriangle,
    'Unsuitable': XCircle,
    'Insufficient Information': HelpCircle
  };

  const Icon = suitabilityIcons[assessment.suitability] || CheckCircle2;

  return (
    <Card className="p-6 bg-white border-slate-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            Crop Suitability Assessment
          </h4>
          <div className="flex items-center gap-2.5">
            <Badge variant={assessment.suitability} size="lg" icon={Icon}>
              {assessment.suitability}
            </Badge>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Agronomic Rationale</h5>
        <p className="text-sm text-slate-700 leading-relaxed">
          {assessment.reason}
        </p>
      </div>
    </Card>
  );
}
