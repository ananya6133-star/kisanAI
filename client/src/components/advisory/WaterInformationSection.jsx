import React from 'react';
import { Select } from '../common/Select';
import { Droplet, Waves } from 'lucide-react';

export function WaterInformationSection({ formData, onChange, errors }) {
  const waterSources = [
    { value: 'Canal Irrigation System', label: 'Canal / Gravity Channel' },
    { value: 'Borewell / Tube-well (Groundwater)', label: 'Borewell / Tube-well (Groundwater)' },
    { value: 'Open Well', label: 'Open Dug Well' },
    { value: 'Drip Micro-irrigation', label: 'Drip Micro-irrigation Line' },
    { value: 'Sprinkler System', label: 'Overhead Sprinkler System' },
    { value: 'Rainfed / Natural Rainfall Only', label: 'Rainfed (No artificial irrigation)' },
    { value: 'Farm Pond / Reservoir', label: 'Farm Pond / Rainwater Harvesting Pond' },
    { value: 'River / Stream Lift', label: 'River / Stream Lift' }
  ];

  return (
    <div className="space-y-4">
      <div className="border-b border-slate-100 pb-3">
        <h4 className="text-base font-semibold text-slate-800 font-display">Irrigation & Water Management</h4>
        <p className="text-xs text-slate-500">Specify water availability and primary supply infrastructure.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Irrigation Facility Available?</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onChange('irrigationAvailable', true)}
              className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-sm font-medium transition-all ${
                formData.irrigationAvailable === true
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-semibold shadow-sm'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Droplet className={`w-4 h-4 ${formData.irrigationAvailable === true ? 'text-emerald-600' : 'text-slate-400'}`} />
              Yes, Irrigated
            </button>

            <button
              type="button"
              onClick={() => onChange('irrigationAvailable', false)}
              className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-sm font-medium transition-all ${
                formData.irrigationAvailable === false
                  ? 'bg-amber-50 border-amber-500 text-amber-800 font-semibold shadow-sm'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Waves className={`w-4 h-4 ${formData.irrigationAvailable === false ? 'text-amber-600' : 'text-slate-400'}`} />
              No, Rainfed
            </button>
          </div>
        </div>

        <Select
          label="Primary Water Source"
          options={waterSources}
          value={formData.waterSource || 'Canal Irrigation System'}
          onChange={(e) => onChange('waterSource', e.target.value)}
          error={errors.waterSource}
        />
      </div>
    </div>
  );
}
