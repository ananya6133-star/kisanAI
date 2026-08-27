import { z } from 'zod';

const priorityEnum = z.enum(['High', 'Medium', 'Low']);
const suitabilityEnum = z.enum(['Suitable', 'Moderately Suitable', 'Unsuitable', 'Insufficient Information']);
const likelihoodEnum = z.enum(['Low', 'Medium', 'High', 'Unknown']);
const severityEnum = z.enum(['Low', 'Medium', 'High']);

export const recommendationItemSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  priority: priorityEnum
});

export const pestDiseaseRiskSchema = z.object({
  issue: z.string().min(1),
  likelihood: likelihoodEnum,
  reason: z.string().min(1),
  preventive_action: z.string().min(1)
});

export const riskAssessmentSchema = z.object({
  risk: z.string().min(1),
  severity: severityEnum,
  mitigation: z.string().min(1)
});

export const priorityActionSchema = z.object({
  action: z.string().min(1),
  timeframe: z.string().min(1),
  priority: priorityEnum
});

export const cropAssessmentSchema = z.object({
  suitability: suitabilityEnum,
  reason: z.string().min(1)
});

export const advisoryResponseSchema = z.object({
  summary: z.string().min(1),
  crop_assessment: cropAssessmentSchema,
  soil_recommendations: z.array(recommendationItemSchema).default([]),
  irrigation_recommendations: z.array(recommendationItemSchema).default([]),
  nutrient_recommendations: z.array(recommendationItemSchema).default([]),
  pest_disease_risks: z.array(pestDiseaseRiskSchema).default([]),
  crop_management: z.array(recommendationItemSchema).default([]),
  risk_assessment: z.array(riskAssessmentSchema).default([]),
  priority_actions: z.array(priorityActionSchema).default([]),
  information_gaps: z.array(z.string()).default([]),
  professional_guidance: z.string().min(1)
});
