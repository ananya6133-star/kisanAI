import React from 'react';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Sprout } from 'lucide-react';

export function CropInformationSection({ formData, onChange, errors }) {
  const cropCategories = [
    { value: 'Cereals & Grains', label: 'Cereals & Grains (Rice, Wheat, Maize, Millets)' },
    { value: 'Pulses & Legumes', label: 'Pulses & Legumes (Chickpea, Lentil, Pigeon Pea, Soy)' },
    { value: 'Cash & Oilseeds', label: 'Cash & Oilseeds (Cotton, Sugarcane, Mustard, Peanut)' },
    { value: 'Vegetables', label: 'Vegetables (Tomato, Onion, Potato, Chilli, Brinjal)' },
    { value: 'Fruits & Orchard', label: 'Fruits & Orchard (Mango, Banana, Citrus, Apple)' },
    { value: 'Spices & Plantation', label: 'Spices & Plantation (Turmeric, Ginger, Cardamom)' },
    { value: 'Fodder & Forage', label: 'Fodder & Forage Crops' }
  ];

  const seasons = [
    { value: 'Kharif (Monsoon)', label: 'Kharif (Monsoon / Summer Sown)' },
    { value: 'Rabi (Winter)', label: 'Rabi (Winter / Post-Monsoon)' },
    { value: 'Zaid / Summer', label: 'Zaid / Summer (March - June)' },
    { value: 'Perennial / Year-Round', label: 'Perennial / Year-Round' },
    { value: 'Spring Cycle', label: 'Spring Cycle' },
    { value: 'Autumn Cycle', label: 'Autumn Cycle' }
  ];

  const growthStages = [
    { value: 'Pre-Sowing / Land Preparation', label: 'Pre-Sowing / Land Preparation' },
    { value: 'Seedling / Germination (0-20 Days)', label: 'Seedling / Germination (0-20 Days)' },
    { value: 'Vegetative Growth (Tillering/Branching)', label: 'Vegetative Growth (Tillering/Branching)' },
    { value: 'Flowering / Anthesis Stage', label: 'Flowering / Anthesis Stage' },
    { value: 'Fruit / Grain Filling Stage', label: 'Fruit / Grain Filling Stage' },
    { value: 'Maturity / Pre-Harvest', label: 'Maturity / Pre-Harvest' },
    { value: 'Post-Harvest / Storage Planning', label: 'Post-Harvest / Storage Planning' }
  ];

  return (
    <div className="space-y-4">
      <div className="border-b border-slate-100 pb-3">
        <h4 className="text-base font-semibold text-slate-800 font-display">Crop & Seasonal Profile</h4>
        <p className="text-xs text-slate-500">Specify the target crop, crop category, and current growth phase.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Crop Name"
          required
          placeholder="e.g. Paddy / Rice, Wheat, Tomato, Cotton"
          value={formData.cropName || ''}
          onChange={(e) => onChange('cropName', e.target.value)}
          error={errors.cropName}
          icon={Sprout}
          helperText="Target crop under advisory"
        />

        <Select
          label="Crop Category"
          required
          options={cropCategories}
          value={formData.category || 'Cereals & Grains'}
          onChange={(e) => onChange('category', e.target.value)}
          error={errors.category}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Select
          label="Cropping Season / Climate"
          options={seasons}
          value={formData.season || 'Kharif (Monsoon)'}
          onChange={(e) => onChange('season', e.target.value)}
          error={errors.season}
        />

        <Select
          label="Current Growth Stage"
          options={growthStages}
          value={formData.growthStage || 'Vegetative Growth (Tillering/Branching)'}
          onChange={(e) => onChange('growthStage', e.target.value)}
          error={errors.growthStage}
        />

        <Input
          label="Previous Crop in Field"
          placeholder="e.g. Maize, Fallow, Legume"
          value={formData.previousCrop || ''}
          onChange={(e) => onChange('previousCrop', e.target.value)}
          error={errors.previousCrop}
          helperText="For crop rotation & residue analysis"
        />
      </div>
    </div>
  );
}
