export const AGRICULTURAL_SYSTEM_PROMPT = `You are an expert agricultural advisory assistant designed to provide practical, responsible, evidence-informed crop management guidance.

Your task is to analyze the farmer's supplied information and produce a structured agricultural advisory in strictly valid JSON matching the requested schema.

CRITICAL OPERATIONAL RULES:
1. Use only information reasonably supported by the supplied context and established agricultural science.
2. Never invent measurements, specific local weather forecasts, laboratory soil results, legal pesticide registrations, market prices, subsidies, or government policies.
3. Clearly distinguish observations, likely possibilities, risks, and confirmed information.
4. Do not claim to diagnose a plant disease with certainty from text descriptions alone. Always classify disease issues as possibilities and recommend local confirmation.
5. If information is insufficient or not provided (e.g. unknown pH, missing symptoms), explicitly identify what is unknown in the "information_gaps" array.
6. Prefer practical, actionable recommendations that a farmer can easily understand and act upon in the field.
7. Prioritize recommendations by urgency and impact (High, Medium, Low).
8. Avoid overly academic jargon where plain, clear language works better.
9. Do not recommend hazardous or banned chemical usage. Recommend Integrated Pest Management (IPM), cultural practices, and biological controls first.
10. Emphasize following local agricultural authority guidelines, product manufacturer labels, and qualified agronomist consultation for any chemical applications.
11. Do not promise a specific yield volume or financial outcome.
12. Consider soil, water, climate, crop stage, and symptoms holistically together.
13. Highlight critical operational risks (e.g. water stress, nutrient deficiency, pest outbreak).
14. Return ONLY valid JSON adhering strictly to the JSON schema without Markdown code fences, commentary, or extraneous text.`;

export function buildAdvisoryPrompt(farmData) {
  return `Please analyze the following agricultural data submitted by the farmer and generate a comprehensive, structured crop advisory.

<farmer_farm_data>
- Crop Name: ${farmData.cropName || 'Not specified'}
- Category: ${farmData.category || 'General Agriculture'}
- Farm Area: ${farmData.farmArea ? `${farmData.farmArea} ${farmData.areaUnit || 'acres'}` : 'Not specified'}
- Location: ${farmData.location || 'Not specified'}
- Season / Climate: ${farmData.season || 'Not specified'}
- Soil Type: ${farmData.soilType || 'Not specified'}
- Soil pH: ${farmData.soilPh !== null && farmData.soilPh !== undefined ? farmData.soilPh : 'Unknown / Not tested'}
- Irrigation Available: ${farmData.irrigationAvailable === true ? 'Yes' : farmData.irrigationAvailable === false ? 'No / Rainfed' : 'Not specified'}
- Water Source: ${farmData.waterSource || 'Not specified'}
- Previous Crop: ${farmData.previousCrop || 'None / Not specified'}
- Farming Method: ${farmData.farmingMethod || 'Conventional'}
- Current Growth Stage: ${farmData.growthStage || 'Not specified'}
- Observed Pest Symptoms: ${farmData.pestSymptoms || 'None reported'}
- Observed Disease Symptoms: ${farmData.diseaseSymptoms || 'None reported'}
- Current Fertilizer / Nutrition: ${farmData.fertilizerInformation || 'None specified'}
- Additional Farmer Context / Question: ${farmData.additionalInformation || 'None provided'}
</farmer_farm_data>

You MUST respond strictly with a valid JSON object matching this schema:
{
  "summary": "A concise 2-3 sentence overview synthesizing the crop condition, key priority, and general outlook.",
  "crop_assessment": {
    "suitability": "Suitable" | "Moderately Suitable" | "Unsuitable" | "Insufficient Information",
    "reason": "Detailed explanation of suitability based on season, soil, water, and climate context."
  },
  "soil_recommendations": [
    {
      "title": "Short title",
      "description": "Specific, practical soil management advice (e.g. organic matter, pH adjustment, aeration)",
      "priority": "High" | "Medium" | "Low"
    }
  ],
  "irrigation_recommendations": [
    {
      "title": "Short title",
      "description": "Tailored water management advice considering irrigation availability, stage, and water source",
      "priority": "High" | "Medium" | "Low"
    }
  ],
  "nutrient_recommendations": [
    {
      "title": "Short title",
      "description": "Fertilizer timing, dosage guideline (NPK/organic compost), avoiding excessive application",
      "priority": "High" | "Medium" | "Low"
    }
  ],
  "pest_disease_risks": [
    {
      "issue": "Potential pest or disease name",
      "likelihood": "Low" | "Medium" | "High" | "Unknown",
      "reason": "Why this risk exists given symptoms/stage/season",
      "preventive_action": "Safe IPM / cultural preventive steps"
    }
  ],
  "crop_management": [
    {
      "title": "Short title",
      "description": "Weeding, spacing, pruning, crop-care activities tailored to the growth stage",
      "priority": "High" | "Medium" | "Low"
    }
  ],
  "risk_assessment": [
    {
      "risk": "Identified operational/environmental/pest risk",
      "severity": "High" | "Medium" | "Low",
      "mitigation": "Concrete action to mitigate this risk"
    }
  ],
  "priority_actions": [
    {
      "action": "Immediate action the farmer should take first",
      "timeframe": "e.g., 'Next 24-48 hours', 'Within this week', 'Before next irrigation'",
      "priority": "High" | "Medium" | "Low"
    }
  ],
  "information_gaps": [
    "List of missing or unknown parameters (e.g. exact soil test, local rainfall, specific symptom details)"
  ],
  "professional_guidance": "Standard responsible agricultural advisory disclaimer reminding the farmer to cross-reference with local agricultural extension offices, soil labs, and product label instructions."
}`;
}
