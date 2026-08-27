import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Bug, Shield, AlertTriangle, ShieldCheck } from 'lucide-react';

export function PestDiseaseRisks({ risks = [] }) {
  if (!risks || risks.length === 0) return null;

  return (
    <Card className="p-6 bg-white border-slate-200">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-4">
        <div className="p-2.5 rounded-xl bg-red-100 text-red-700">
          <Bug className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-base font-bold text-slate-900 font-display">Pest & Disease Risk Factors</h4>
          <p className="text-xs text-slate-500">Differential risk analysis and Integrated Pest Management (IPM)</p>
        </div>
      </div>

      <div className="space-y-4">
        {risks.map((item, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-red-50/30 border border-red-100/80 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h5 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                {item.issue}
              </h5>
              <Badge variant={item.likelihood.toLowerCase() === 'high' ? 'high' : item.likelihood.toLowerCase() === 'medium' ? 'medium' : 'low'} size="sm">
                Likelihood: {item.likelihood}
              </Badge>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              <strong className="text-slate-700">Underlying Cause: </strong>
              {item.reason}
            </p>

            <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-200/60 text-xs text-emerald-950 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold text-emerald-900">Preventive / IPM Action: </strong>
                {item.preventive_action}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function RiskAssessment({ risks = [] }) {
  if (!risks || risks.length === 0) return null;

  return (
    <Card className="p-6 bg-white border-slate-200">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-4">
        <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-base font-bold text-slate-900 font-display">Operational & Climate Risk Matrix</h4>
          <p className="text-xs text-slate-500">Environmental threats and mitigation protocols</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {risks.map((item, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-2 flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-900 truncate">{item.risk}</span>
                <Badge variant={item.severity.toLowerCase()} size="sm">
                  {item.severity} Severity
                </Badge>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/60 text-xs text-slate-600 leading-relaxed">
              <strong className="text-slate-700">Mitigation: </strong>
              {item.mitigation}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
