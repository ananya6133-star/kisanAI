import React from 'react';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { MapPin, Layers } from 'lucide-react';

export function FarmInformationSection({ formData, onChange, errors }) {
  const areaUnits = [
    { value: 'acres', label: 'Acres' },
    { value: 'hectares', label: 'Hectares' },
    { value: 'bigha', label: 'Bigha' },
    { value: 'guntha', label: 'Guntha' },
    { value: 'cents', label: 'Cents / Cents (South Asia)' },
    { value: 'sq_meters', label: 'Square Meters' }
  ];

  const farmingMethods = [
    { value: 'Conventional', label: 'Conventional / Standard' },
    { value: 'Organic Certified', label: 'Organic (Certified)' },
    { value: 'Natural Farming / ZBNF', label: 'Natural Farming / ZBNF' },
    { value: 'Integrated Nutrient Management', label: 'Integrated Farming (INM/IPM)' },
    { value: 'Hydroponic / Polyhouse', label: 'Protected / Polyhouse' }
  ];

  return (
    <div className="space-y-4">
      <div className="border-b border-slate-100 pb-3">
        <h4 className="text-base font-semibold text-slate-800 font-display">Farm & Field Overview</h4>
        <p className="text-xs text-slate-500">Provide details about your farm location and land holding size.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Farm Location / Region"
          placeholder="e.g. Hyderabad, Telangana or California Central Valley"
          value={formData.location || ''}
          onChange={(e) => onChange('location', e.target.value)}
          error={errors.location}
          icon={MapPin}
          helperText="District, state, or agro-climatic region"
        />

        <Select
          label="Farming Method / Practice"
          options={farmingMethods}
          value={formData.farmingMethod || 'Conventional'}
          onChange={(e) => onChange('farmingMethod', e.target.value)}
          error={errors.farmingMethod}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Total Cultivated Area"
          type="number"
          step="0.1"
          min="0"
          placeholder="e.g. 2.5"
          value={formData.farmArea !== null && formData.farmArea !== undefined ? formData.farmArea : ''}
          onChange={(e) => onChange('farmArea', e.target.value)}
          error={errors.farmArea}
          icon={Layers}
          helperText="Land area for this specific crop cycle"
        />

        <Select
          label="Area Measurement Unit"
          options={areaUnits}
          value={formData.areaUnit || 'acres'}
          onChange={(e) => onChange('areaUnit', e.target.value)}
          error={errors.areaUnit}
        />
      </div>
    </div>
  );
}
