import React from 'react';
import { Textarea } from '../common/Textarea';
import { MessageSquare } from 'lucide-react';

export function AdditionalInformationSection({ formData, onChange, errors }) {
  return (
    <div className="space-y-4">
      <div className="border-b border-slate-100 pb-3">
        <h4 className="text-base font-semibold text-slate-800 font-display">Farmer Inquiries & Context</h4>
        <p className="text-xs text-slate-500">Ask any specific question or provide field observations for the AI agronomist.</p>
      </div>

      <Textarea
        label="Specific Question or Additional Field Observations"
        placeholder="e.g. 'We are anticipating sudden high temperatures next week—how should we adjust watering?' or 'Looking for organic bio-stimulant recommendations...'"
        rows={3}
        value={formData.additionalInformation || ''}
        onChange={(e) => onChange('additionalInformation', e.target.value)}
        error={errors.additionalInformation}
        helperText="The AI will directly address these context notes in the final advisory summary and priority actions."
      />
    </div>
  );
}
