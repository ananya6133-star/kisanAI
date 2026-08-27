import React from 'react';
import { RecommendationCard } from './PriorityActions';
import { Layers, Droplet, Beaker, Scissors } from 'lucide-react';

export function SoilRecommendations({ recommendations = [] }) {
  return (
    <RecommendationCard
      title="Soil & Land Management"
      subtitle="Nutrient preservation, pH buffering & aeration"
      icon={Layers}
      items={recommendations}
      color="amber"
    />
  );
}

export function IrrigationRecommendations({ recommendations = [] }) {
  return (
    <RecommendationCard
      title="Irrigation & Water Schedule"
      subtitle="Stage-specific water delivery & conservation"
      icon={Droplet}
      items={recommendations}
      color="blue"
    />
  );
}

export function NutrientRecommendations({ recommendations = [] }) {
  return (
    <RecommendationCard
      title="Fertilizer & Nutrition Strategy"
      subtitle="Balanced basal and split top-dressing doses"
      icon={Beaker}
      items={recommendations}
      color="emerald"
    />
  );
}

export function CropManagement({ recommendations = [] }) {
  return (
    <RecommendationCard
      title="Crop-Care & Cultural Practices"
      subtitle="Weeding, spacing, staking & canopy aeration"
      icon={Scissors}
      items={recommendations}
      color="purple"
    />
  );
}
