import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { advisoryResponseSchema } from '../schemas/advisoryResponse.schema.js';
import { AGRICULTURAL_SYSTEM_PROMPT, buildAdvisoryPrompt } from '../prompts/agriculturalAdvisor.prompt.js';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

let genAIClient = null;
if (apiKey && apiKey.trim() !== '' && !apiKey.includes('your-gemini-api-key')) {
  try {
    genAIClient = new GoogleGenAI({ apiKey: apiKey.trim() });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err.message);
  }
}

/**
 * Generates an agricultural advisory by calling Google Gemini via @google/genai
 * and validates the output strictly against the Zod schema.
 */
export async function generateCropAdvisory(farmData) {
  const prompt = buildAdvisoryPrompt(farmData);

  // If Gemini client is active, execute live inference
  if (genAIClient) {
    let attempts = 0;
    const maxAttempts = 2;
    let lastError = null;

    while (attempts < maxAttempts) {
      attempts++;
      try {
        const response = await genAIClient.models.generateContent({
          model: modelName,
          contents: attempts === 1 
            ? prompt 
            : `${prompt}\n\nIMPORTANT: The previous output failed schema validation. Please strictly output ONLY valid JSON adhering to the required fields.`,
          config: {
            systemInstruction: AGRICULTURAL_SYSTEM_PROMPT,
            responseMimeType: 'application/json',
            temperature: 0.2,
          }
        });

        const rawText = response.text || '';
        
        // Clean possible markdown fences if returned
        const cleanedText = rawText
          .replace(/^```json\s*/i, '')
          .replace(/^```\s*/i, '')
          .replace(/\s*```$/i, '')
          .trim();

        const parsedJson = JSON.parse(cleanedText);
        const validated = advisoryResponseSchema.safeParse(parsedJson);

        if (validated.success) {
          return validated.data;
        } else {
          lastError = new Error(`AI output validation failed: ${validated.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ')}`);
          console.warn(`[Gemini Attempt ${attempts}] Schema validation failed, retrying...`, lastError.message);
        }
      } catch (err) {
        lastError = err;
        console.warn(`[Gemini Attempt ${attempts}] Call failed:`, err.message);
      }
    }

    throw new Error(`Failed to generate valid advisory after ${maxAttempts} attempts. ${lastError?.message || ''}`);
  }

  // Developer Fallback Simulator (When API key is not configured)
  console.warn('⚠️ GEMINI_API_KEY is not configured or placeholder detected. Generating high-precision agrarian simulation for development.');
  return generateDeterministicAdvisory(farmData);
}

/**
 * Scientifically grounded fallback generator for testing & dev environments
 */
function generateDeterministicAdvisory(farmData) {
  const crop = farmData.cropName || 'Crop';
  const stage = farmData.growthStage || 'Vegetative';
  const soil = farmData.soilType || 'Loam';
  const season = farmData.season || 'Current Season';
  const hasIrrigation = farmData.irrigationAvailable === true;

  const mockAdvisory = {
    summary: `Based on your ${soil} soil conditions and ${stage} growth stage during the ${season}, ${crop} shows good potential. Priority focus is recommended on balanced moisture management and preventive disease monitoring.`,
    crop_assessment: {
      suitability: hasIrrigation ? 'Suitable' : 'Moderately Suitable',
      reason: `${crop} thrives in ${soil} soil when adequate moisture and root aeration are maintained. ${hasIrrigation ? 'Your available irrigation significantly reduces water-stress risk.' : 'Rainfed cultivation requires soil mulching to conserve moisture.'}`
    },
    soil_recommendations: [
      {
        title: 'Organic Matter Enrichment',
        description: `Incorporate well-rotted farmyard manure (5-10 tons/hectare equivalent) or compost to improve ${soil} structure and microbial activity.`,
        priority: 'High'
      },
      {
        title: 'Soil Aeration & Inter-row Weeding',
        description: 'Perform shallow inter-cultivation around crop base to reduce soil crusting and improve root oxygenation.',
        priority: 'Medium'
      }
    ],
    irrigation_recommendations: [
      {
        title: hasIrrigation ? 'Scheduled Deep Watering' : 'Moisture Conservation Mulching',
        description: hasIrrigation 
          ? `Provide uniform irrigation at critical ${stage} phase, avoiding standing water at root collar.`
          : 'Apply organic crop residue mulching around base to retain sub-soil moisture during dry spells.',
        priority: 'High'
      },
      {
        title: 'Drainage Channel Maintenance',
        description: 'Ensure field drains are clear to prevent waterlogging during unexpected heavy downpours.',
        priority: 'Medium'
      }
    ],
    nutrient_recommendations: [
      {
        title: 'Targeted NPK Top-Dressing',
        description: `Apply split nitrogen and potassium doses aligned with the ${stage} stage rather than heavy single applications.`,
        priority: 'High'
      },
      {
        title: 'Micronutrient Foliar Spray',
        description: 'Consider Zinc and Boron foliar application if leaf pale coloration or stunted terminal growth appears.',
        priority: 'Medium'
      }
    ],
    pest_disease_risks: [
      {
        issue: farmData.pestSymptoms ? 'Observed Pest Complex' : 'Early Sucking Pests / Caterpillars',
        likelihood: farmData.pestSymptoms ? 'High' : 'Medium',
        reason: farmData.pestSymptoms 
          ? `Reported symptoms (${farmData.pestSymptoms}) indicate active pest presence requiring IPM control.`
          : 'Warm seasonal conditions favor foliar pest proliferation during active vegetative growth.',
        preventive_action: 'Deploy yellow/blue sticky traps and apply 0.5% Neem oil emulsion (1500 ppm) as an initial biological deterrent.'
      },
      {
        issue: farmData.diseaseSymptoms ? 'Observed Fungal/Bacterial Blight' : 'Foliar Leaf Spot / Rust',
        likelihood: farmData.diseaseSymptoms ? 'High' : 'Low',
        reason: farmData.diseaseSymptoms 
          ? `Reported disease symptoms (${farmData.diseaseSymptoms}) suggest fungal or bacterial leaf infection.`
          : 'Humidity fluctuations can trigger fungal spore germination on mature lower foliage.',
        preventive_action: 'Ensure adequate plant spacing for canopy ventilation and avoid overhead sprinkler wetting during evenings.'
      }
    ],
    crop_management: [
      {
        title: 'Canopy & Weed Management',
        description: 'Maintain a weed-free zone within 30cm of the root zone to eliminate resource competition for water and nutrients.',
        priority: 'High'
      },
      {
        title: 'Growth Monitoring & Staking',
        description: 'Inspect underside of leaves twice weekly at sunrise to detect any pest egg masses before infestation escalates.',
        priority: 'Medium'
      }
    ],
    risk_assessment: [
      {
        risk: hasIrrigation ? 'Nutrient Leaching / Over-irrigation' : 'Mid-season Moisture Deficit Stress',
        severity: 'Medium',
        mitigation: hasIrrigation 
          ? 'Regulate water volume based on tensiometer or soil squeeze test before irrigating.'
          : 'Create conservation furrows to harvest sporadic rainfall and maintain mulch cover.'
      },
      {
        risk: 'Secondary Pest Escalation',
        severity: farmData.pestSymptoms ? 'High' : 'Low',
        mitigation: 'Avoid indiscriminate broad-spectrum chemical sprays that destroy beneficial predatory insects.'
      }
    ],
    priority_actions: [
      {
        action: 'Field Inspection & Sticky Trap Deployment',
        timeframe: 'Next 24 to 48 hours',
        priority: 'High'
      },
      {
        action: 'First Split Fertilizer & Compost Application',
        timeframe: 'Within the next 3 to 5 days',
        priority: 'Medium'
      },
      {
        action: 'Inspect Drainage Channels & Soil Moisture Level',
        timeframe: 'Before next scheduled irrigation',
        priority: 'High'
      }
    ],
    information_gaps: [
      farmData.soilPh ? null : 'Exact laboratory Soil pH and EC (Electrical Conductivity) values',
      farmData.pestSymptoms ? null : 'Specific pest population count or physical specimens',
      'Recent 14-day local microclimate rainfall and humidity data'
    ].filter(Boolean),
    professional_guidance: 'This agricultural advisory provides evidence-informed management principles. Prior to applying any synthetic chemicals, pesticides, or commercial fertilizers, please verify local registrations, product label directions, and consult with your district agricultural extension officer or certified agronomist.'
  };

  // Validate the simulated object to guarantee schema adherence
  return advisoryResponseSchema.parse(mockAdvisory);
}
