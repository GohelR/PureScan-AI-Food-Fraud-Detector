
import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    status: {
      type: Type.STRING,
      enum: ['Safe', 'Fraudulent', 'Uncertain'],
      description: "The final classification of the food sample."
    },
    summary: {
      type: Type.STRING,
      description: "A concise, one-sentence summary explaining the reasoning behind the classification. E.g., 'High levels of starch (+0.45 influence) and abnormal fat ratio (+0.31) indicate possible milk adulteration.'"
    },
    fraudProbability: {
      type: Type.NUMBER,
      description: "A score from 0.0 to 1.0 representing the probability of the sample being fraudulent. 0.0 is completely safe, 1.0 is definitely fraudulent."
    },
    features: {
      type: Type.ARRAY,
      description: "A list of features that influenced the decision. Include 3-5 of the most impactful features.",
      items: {
        type: Type.OBJECT,
        properties: {
          feature: {
            type: Type.STRING,
            description: "The name of the influential feature (e.g., 'Starch Level', 'Fat Ratio')."
          },
          influence: {
            type: Type.NUMBER,
            description: "The SHAP-like influence score. Positive values contribute to a 'Fraudulent' classification, negative values contribute to a 'Safe' classification."
          },
          description: {
            type: Type.STRING,
            description: "A brief explanation of why this feature is significant for the analysis."
          }
        },
        required: ["feature", "influence", "description"]
      }
    }
  },
  required: ["status", "summary", "fraudProbability", "features"]
};


export const analyzeFoodSample = async (
  foodData: string,
  imageBase64?: string,
  mimeType?: string
): Promise<AnalysisResult> => {
  const model = 'gemini-2.5-flash';
  
  const systemInstruction = `You are an Explainable Artificial Intelligence (XAI) system named PureScan, specializing in food fraud and adulteration detection. 
  Your task is to analyze food sample data and provide a clear, evidence-based assessment.
  Analyze the provided food data (and optional packaging image). Classify the sample as 'Safe', 'Fraudulent', or 'Uncertain'.
  A 'Safe' status means there are no signs of fraud. A 'Fraudulent' status means there are clear indicators of adulteration or mislabeling. An 'Uncertain' status should be used if the data is ambiguous or insufficient.
  Provide a detailed explanation for your decision, highlighting the key features and their influence on the outcome.
  Your response MUST be a valid JSON object matching the provided schema. Do not include any text outside the JSON object.`;

  const prompt = `Please analyze the following food sample data:
  
  **Chemical Composition / Ingredient List / Sensor Readings:**
  ${foodData}
  
  **Instructions:**
  1. Determine the food type from the data.
  2. Compare the data against typical standards for that food type.
  3. Identify anomalies that suggest fraud or adulteration (e.g., unexpected ingredients, abnormal chemical levels, inconsistencies with packaging).
  4. Quantify the influence of each anomaly as a positive (fraudulent) or negative (safe) score.
  5. Summarize your findings and provide a final classification.
  6. Generate the JSON output as specified.`;

  const parts: any[] = [{ text: prompt }];

  if (imageBase64 && mimeType) {
    parts.push({
      inlineData: {
        mimeType: mimeType,
        data: imageBase64,
      },
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: parts },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
        temperature: 0.2,
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    return result as AnalysisResult;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error && error.message.includes('SAFETY')) {
        throw new Error('The analysis was blocked due to safety concerns with the input data. Please revise your input.');
    }
    throw new Error('Failed to get a valid analysis from the AI model. Please try again.');
  }
};
