import React, { useState } from 'react';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Beaker } from 'lucide-react';

export function SoilInformationSection({ formData, onChange, errors }) {
  const [isPhKnown, setIsPhKnown] = useState(
    formData.soilPh !== null && formData.soilPh !== undefined && formData.soilPh !== ''
  );

  const soilTypes = [
    { value: 'Clay Loam', label: 'Clay Loam (Rich, good moisture holding)' },
    { value: 'Black Cotton / Vertisol', label: 'Black Soil / Vertisol (High clay, deep cracking)' },
    { value: 'Alluvial Soil', label: 'Alluvial (Fertile river plains)' },
    { value: 'Red Sandy Loam', label: 'Red Sandy Loam (Well-draining, porous)' },
    { value: 'Sandy / Coarse Soil', label: 'Sandy Soil (Fast draining, low retention)' },
    { value: 'Laterite / Acidic Hill Soil', label: 'Laterite (High iron/aluminum, acidic)' },
    { value: 'Saline / Alkaline Soil', label: 'Saline / Sodic (High salts / high pH)' },
    { value: 'Peat / High Organic', label: 'Peaty / High Organic Muck' }
  ];

  const handlePhToggle = (checked) => {
    setIsPhKnown(checked);
    if (!checked) {
      onChange('soilPh', null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-b border-slate-100 pb-3">
        <h4 className="text-base font-semibold text-slate-800 font-display">Soil Characteristics</h4>
        <p className="text-xs text-slate-500">Provide soil classification or laboratory test readings if known.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
        <Select
          label="Primary Soil Texture / Type"
          options={soilTypes}
          value={formData.soilType || 'Clay Loam'}
          onChange={(e) => onChange('soilType', e.target.value)}
          error={errors.soilType}
        />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700">Soil pH Level</label>
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-500 font-normal">
              <input
                type="checkbox"
                checked={isPhKnown}
                onChange={(e) => handlePhToggle(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
              />
              <span>I know my soil pH</span>
            </label>
          </div>

          {isPhKnown ? (
            <Input
              type="number"
              step="0.1"
              min="0"
              max="14"
              placeholder="e.g. 6.5 (Neutral is ~7.0)"
              value={formData.soilPh !== null && formData.soilPh !== undefined ? formData.soilPh : ''}
              onChange={(e) => onChange('soilPh', e.target.value)}
              error={errors.soilPh}
              icon={Beaker}
              helperText="Values between 0.0 (strongly acidic) and 14.0 (strongly alkaline)"
            />
          ) : (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center justify-between">
              <span>Soil pH marked as <strong>Unknown / Not Tested</strong></span>
              <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                AI will estimate based on soil type
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
