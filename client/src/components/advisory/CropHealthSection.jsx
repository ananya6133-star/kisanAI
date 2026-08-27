import React from 'react';
import { Textarea } from '../common/Textarea';
import { Bug, Stethoscope, Sparkles } from 'lucide-react';

export function CropHealthSection({ formData, onChange, errors }) {
  const quickPestChips = [
    'Aphids / Sucking pests on tender shoots',
    'Leaf-eating caterpillars / armyworm',
    'Stem/Fruit borer damage',
    'Whiteflies & thrips',
    'No pests observed'
  ];

  const quickDiseaseChips = [
    'Yellowing of lower leaves (Chlorosis)',
    'Brown necrotic spots on leaf margin',
    'Powdery white coating on foliage',
    'Root collar wilting / damping off',
    'No visible disease symptoms'
  ];

  const appendChip = (field, text) => {
    const current = formData[field] || '';
    if (text.startsWith('No ')) {
      onChange(field, text);
      return;
    }
    if (!current) {
      onChange(field, text);
    } else if (!current.includes(text)) {
      onChange(field, `${current}, ${text}`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-b border-slate-100 pb-3">
        <h4 className="text-base font-semibold text-slate-800 font-display">Crop Health, Symptoms & Nutrition</h4>
        <p className="text-xs text-slate-500">Record any observed symptoms, pest activity, or current fertilizer dosages.</p>
      </div>

      {/* Pest Symptoms */}
      <div className="space-y-2">
        <Textarea
          label="Observed Pest Symptoms"
          placeholder="Describe any insects, leaf damage, webbing, or fruit piercing observed..."
          rows={2}
          value={formData.pestSymptoms || ''}
          onChange={(e) => onChange('pestSymptoms', e.target.value)}
          error={errors.pestSymptoms}
        />
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
            <Bug className="w-3 h-3 text-slate-400" /> Quick tags:
          </span>
          {quickPestChips.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => appendChip('pestSymptoms', chip)}
              className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 transition-colors"
            >
              + {chip.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Disease Symptoms */}
      <div className="space-y-2">
        <Textarea
          label="Observed Disease & Foliar Symptoms"
          placeholder="Describe leaf spots, wilting, discoloration, mildew, or lesions..."
          rows={2}
          value={formData.diseaseSymptoms || ''}
          onChange={(e) => onChange('diseaseSymptoms', e.target.value)}
          error={errors.diseaseSymptoms}
        />
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
            <Stethoscope className="w-3 h-3 text-slate-400" /> Quick tags:
          </span>
          {quickDiseaseChips.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => appendChip('diseaseSymptoms', chip)}
              className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 transition-colors"
            >
              + {chip.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Fertilizer Info */}
      <Textarea
        label="Fertilizers / Nutrients Applied So Far"
        placeholder="e.g. Basal dose: 50kg DAP + 2 tons Farmyard Manure. Top dressing: 25kg Urea applied 10 days ago."
        rows={2}
        value={formData.fertilizerInformation || ''}
        onChange={(e) => onChange('fertilizerInformation', e.target.value)}
        error={errors.fertilizerInformation}
        helperText="Helps the AI avoid recommending duplicate or excessive nitrogen/phosphorus dosages."
      />
    </div>
  );
}
