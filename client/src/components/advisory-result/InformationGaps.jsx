import React from 'react';
import { Card } from '../common/Card';
import { HelpCircle, AlertCircle, ShieldCheck } from 'lucide-react';

export function InformationGaps({ gaps = [] }) {
  if (!gaps || gaps.length === 0) return null;

  return (
    <Card className="p-5 bg-slate-50/80 border-slate-200">
      <div className="flex items-center gap-2.5 mb-3 text-slate-800">
        <HelpCircle className="w-5 h-5 text-slate-500" />
        <h4 className="text-sm font-bold font-display">Identified Information Limitations</h4>
      </div>
      <p className="text-xs text-slate-500 mb-3">
        The following parameters were either unspecified or estimated. Resolving these will increase advisory precision:
      </p>
      <ul className="space-y-1.5 pl-4 list-disc text-xs text-slate-600">
        {gaps.map((gap, idx) => (
          <li key={idx}>{gap}</li>
        ))}
      </ul>
    </Card>
  );
}

export function ProfessionalGuidance({ disclaimer }) {
  const defaultDisclaimer = 'This agricultural advisory is powered by artificial intelligence and is designed for general agronomic decision support. It does not replace on-field assessment by certified agronomists or official laboratory soil tests. Always follow local government regulations and pesticide manufacturer labels.';

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 text-amber-950 space-y-2">
      <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
        <ShieldCheck className="w-4 h-4 text-amber-700" />
        <span>Responsible AI Agricultural Disclaimer</span>
      </div>
      <p className="text-xs leading-relaxed text-amber-900/90">
        {disclaimer || defaultDisclaimer}
      </p>
    </div>
  );
}
