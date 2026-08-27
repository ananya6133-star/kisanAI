import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { advisoryService } from '../services/advisoryService';
import { 
  Sprout, 
  Sparkles, 
  Send, 
  RotateCcw, 
  HelpCircle,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { FarmInformationSection } from '../components/advisory/FarmInformationSection';
import { CropInformationSection } from '../components/advisory/CropInformationSection';
import { SoilInformationSection } from '../components/advisory/SoilInformationSection';
import { WaterInformationSection } from '../components/advisory/WaterInformationSection';
import { CropHealthSection } from '../components/advisory/CropHealthSection';
import { AdditionalInformationSection } from '../components/advisory/AdditionalInformationSection';
import { AdvisoryLoading } from '../components/advisory/AdvisoryLoading';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Alert } from '../components/common/Alert';

const INITIAL_FORM_STATE = {
  cropName: '',
  category: 'Cereals & Grains',
  farmArea: 2.5,
  areaUnit: 'acres',
  location: '',
  farmingMethod: 'Conventional',
  season: 'Kharif (Monsoon)',
  growthStage: 'Vegetative Growth (Tillering/Branching)',
  previousCrop: '',
  soilType: 'Clay Loam',
  soilPh: 6.5,
  irrigationAvailable: true,
  waterSource: 'Canal Irrigation System',
  pestSymptoms: '',
  diseaseSymptoms: '',
  fertilizerInformation: '',
  additionalInformation: ''
};

const PRESETS = [
  {
    name: '🌾 Paddy / Rice (Kharif Season)',
    data: {
      cropName: 'Paddy / Rice',
      category: 'Cereals & Grains',
      farmArea: 3.0,
      areaUnit: 'acres',
      location: 'Krishna Delta Basin, AP',
      farmingMethod: 'Conventional',
      season: 'Kharif (Monsoon)',
      growthStage: 'Vegetative Growth (Tillering/Branching)',
      previousCrop: 'Black Gram / Pulse Fallow',
      soilType: 'Clay Loam',
      soilPh: 6.8,
      irrigationAvailable: true,
      waterSource: 'Canal Irrigation System',
      pestSymptoms: 'Early stem borer dead-hearts observed on border rows',
      diseaseSymptoms: 'Slight yellowing on lower leaves',
      fertilizerInformation: 'Basal application: 50kg DAP + 25kg MOP applied at transplanting',
      additionalInformation: 'Anticipating heavy monsoon rainfall over the next 10 days. Need water drainage & top dressing advice.'
    }
  },
  {
    name: '🌿 Wheat (Rabi Season)',
    data: {
      cropName: 'Wheat (HD-2967)',
      category: 'Cereals & Grains',
      farmArea: 4.5,
      areaUnit: 'acres',
      location: 'Punjab Plains',
      farmingMethod: 'Integrated Nutrient Management',
      season: 'Rabi (Winter)',
      growthStage: 'Crown Root Initiation / CRI (21 Days)',
      previousCrop: 'Paddy',
      soilType: 'Alluvial Soil',
      soilPh: 7.2,
      irrigationAvailable: true,
      waterSource: 'Borewell / Tube-well (Groundwater)',
      pestSymptoms: 'No significant insect pests observed',
      diseaseSymptoms: 'No visible foliar spots',
      fertilizerInformation: 'Basal dose: 55kg DAP + 10 tons Farmyard Manure',
      additionalInformation: 'First critical CRI irrigation is due tomorrow. What nitrogen split dosage is optimal?'
    }
  },
  {
    name: '🍅 Tomato (Drip / Polyhouse)',
    data: {
      cropName: 'Tomato (Hybrid)',
      category: 'Vegetables',
      farmArea: 1.2,
      areaUnit: 'acres',
      location: 'Kolar, Karnataka',
      farmingMethod: 'Integrated Nutrient Management',
      season: 'Zaid / Summer',
      growthStage: 'Flowering / Anthesis Stage',
      previousCrop: 'French Beans',
      soilType: 'Red Sandy Loam',
      soilPh: 6.4,
      irrigationAvailable: true,
      waterSource: 'Drip Micro-irrigation',
      pestSymptoms: 'Whiteflies clustering under leaf canopy and leaf miner trails',
      diseaseSymptoms: 'Slight early blight spots on lower canopy leaves',
      fertilizerInformation: 'Fertigation via drip: 19:19:19 water-soluble twice weekly',
      additionalInformation: 'Daytime temperatures are reaching 36°C. How to prevent flower drop organically?'
    }
  },
  {
    name: '🌱 Cotton (Black Soil, Rainfed)',
    data: {
      cropName: 'Bt Cotton',
      category: 'Cash & Oilseeds',
      farmArea: 5.0,
      areaUnit: 'acres',
      location: 'Vidarbha, Maharashtra',
      farmingMethod: 'Conventional',
      season: 'Kharif (Monsoon)',
      growthStage: 'Square / Boll Formation Stage',
      previousCrop: 'Soybean',
      soilType: 'Black Cotton / Vertisol',
      soilPh: 7.8,
      irrigationAvailable: false,
      waterSource: 'Rainfed / Natural Rainfall Only',
      pestSymptoms: 'Sucking pests (thrips & jassids) causing leaf upward curling',
      diseaseSymptoms: 'Bacterial blight angular leaf spots',
      fertilizerInformation: 'Applied 1 bag Urea and 1 bag SSP at 30 days after sowing',
      additionalInformation: 'Extended dry spell of 12 days. How to conserve moisture and control thrips?'
    }
  }
];

export function NewAdvisoryPage() {
  const { getAccessToken } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleApplyPreset = (presetData) => {
    setFormData({ ...presetData });
    setErrors({});
    setApiError(null);
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.cropName || formData.cropName.trim() === '') {
      errs.cropName = 'Crop name is required.';
    }
    if (!formData.category || formData.category.trim() === '') {
      errs.category = 'Crop category is required.';
    }
    if (formData.farmArea !== null && formData.farmArea !== undefined && formData.farmArea <= 0) {
      errs.farmArea = 'Farm area must be a positive number.';
    }
    if (formData.soilPh !== null && formData.soilPh !== undefined && (formData.soilPh < 0 || formData.soilPh > 14)) {
      errs.soilPh = 'Soil pH must be between 0.0 and 14.0.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    setApiError(null);

    try {
      const token = await getAccessToken();
      const payload = {

        ...formData,
        farmArea: formData.farmArea ? Number(formData.farmArea) : null,
        soilPh: formData.soilPh !== null && formData.soilPh !== undefined && formData.soilPh !== '' ? Number(formData.soilPh) : null
      };

      const response = await advisoryService.createAdvisory(payload, token);

      if (response.success && response.data?.id) {
        // Confetti celebration
        try {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 }
          });
        } catch (e) {
          // ignore if canvas not supported
        }

        // Navigate to advisory result page
        navigate(`/advisory/${response.data.id}`);
      } else {
        throw new Error(response.error || 'Failed to generate advisory.');
      }
    } catch (err) {
      console.error('Advisory submission error:', err);
      setApiError(err.message || 'An error occurred while communicating with the AI agronomist.');
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (isSubmitting) {
    return <AdvisoryLoading cropName={formData.cropName || 'Target Crop'} />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Agricultural Intelligence</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 font-display">
          Generate New Crop Advisory
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Provide your farm parameters below. Our Google Gemini AI reasoning engine will generate a structured, scientific management protocol.
        </p>
      </div>

      {/* Quick Fill Demo Presets Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200/80 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-emerald-600 text-white">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <h3 className="text-xs sm:text-sm font-bold text-emerald-950 font-display">
              Quick-Fill Presets for Instant Testing
            </h3>
          </div>
          <span className="text-[11px] text-emerald-700 hidden sm:inline">
            Click any scenario to pre-fill the form
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => handleApplyPreset(preset.data)}
              className="text-left p-2.5 rounded-xl bg-white/90 hover:bg-white border border-emerald-200 text-xs font-semibold text-emerald-900 shadow-sm hover:border-emerald-400 hover:shadow transition-all"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Error Alert */}
      {apiError && (
        <Alert type="error" title="Submission Failed" onClose={() => setApiError(null)}>
          {apiError}
        </Alert>
      )}

      {/* Main Form Form Container */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6 sm:p-8 bg-white border-slate-200 shadow-sm space-y-8">
          {/* Section 1: Crop Profile */}
          <CropInformationSection
            formData={formData}
            onChange={handleFieldChange}
            errors={errors}
          />

          {/* Section 2: Farm & Field */}
          <FarmInformationSection
            formData={formData}
            onChange={handleFieldChange}
            errors={errors}
          />

          {/* Section 3: Soil Profile */}
          <SoilInformationSection
            formData={formData}
            onChange={handleFieldChange}
            errors={errors}
          />

          {/* Section 4: Water & Irrigation */}
          <WaterInformationSection
            formData={formData}
            onChange={handleFieldChange}
            errors={errors}
          />

          {/* Section 5: Health, Symptoms & Fertilizer */}
          <CropHealthSection
            formData={formData}
            onChange={handleFieldChange}
            errors={errors}
          />

          {/* Section 6: Specific Farmer Inquiry */}
          <AdditionalInformationSection
            formData={formData}
            onChange={handleFieldChange}
            errors={errors}
          />

          {/* Action Buttons */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setFormData(INITIAL_FORM_STATE)}
              icon={RotateCcw}
            >
              Reset Form
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full sm:w-auto shadow-glow px-8"
              icon={Send}
            >
              Generate AI Advisory
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
