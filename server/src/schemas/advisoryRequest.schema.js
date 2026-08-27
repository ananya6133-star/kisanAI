import { z } from 'zod';

export const advisoryRequestSchema = z.object({
  cropName: z.string({
    required_error: 'Crop name is required'
  }).trim().min(1, 'Crop name cannot be empty').max(100, 'Crop name is too long'),
  
  category: z.string({
    required_error: 'Category is required'
  }).trim().min(1, 'Category cannot be empty').max(100, 'Category is too long'),
  
  farmArea: z.preprocess((val) => {
    if (val === '' || val === null || val === undefined) return null;
    const parsed = Number(val);
    return isNaN(parsed) ? val : parsed;
  }, z.number().positive('Farm area must be a positive number').max(100000, 'Farm area is too large').nullable().optional()),
  
  areaUnit: z.string().trim().max(30).optional().default('acres'),
  soilType: z.string().trim().max(100).optional().default(''),
  
  soilPh: z.preprocess((val) => {
    if (val === '' || val === null || val === undefined) return null;
    const parsed = Number(val);
    return isNaN(parsed) ? val : parsed;
  }, z.number().min(0, 'Soil pH must be between 0 and 14').max(14, 'Soil pH must be between 0 and 14').nullable().optional()),
  
  irrigationAvailable: z.preprocess((val) => {
    if (val === 'true' || val === true) return true;
    if (val === 'false' || val === false) return false;
    if (val === null || val === undefined || val === '') return null;
    return val;
  }, z.boolean().nullable().optional()),
  
  waterSource: z.string().trim().max(100).optional().default(''),
  location: z.string().trim().max(150).optional().default(''),
  season: z.string().trim().max(100).optional().default(''),
  previousCrop: z.string().trim().max(100).optional().default(''),
  farmingMethod: z.string().trim().max(100).optional().default(''),
  growthStage: z.string().trim().max(100).optional().default(''),
  pestSymptoms: z.string().trim().max(5000).optional().default(''),
  diseaseSymptoms: z.string().trim().max(5000).optional().default(''),
  fertilizerInformation: z.string().trim().max(5000).optional().default(''),
  additionalInformation: z.string().trim().max(5000).optional().default('')
});
