import type { FoodItem } from "../types/food";

import { geminiModel } from "../firebase";
import { logger } from "../logger/app-logger";

interface AIFoodAnalysis {
    calories: number;
    carbs: number;
    confidence?: number;
    estimatedNutriScore?: {
        grade: "A" | "B" | "C" | "D" | "E";
        score: number;
    };
    fat: number;
    fiber?: number;
    fitnessInfo?: {
        dietCompatibility: {
            keto: boolean;
            lowCarb: boolean;
            paleo: boolean;
            vegan: boolean;
        };
        glycemicImpact: string;
        workoutSuitability: {
            postWorkout: number;
            preWorkout: number;
        };
    };
    name: string;
    protein: number;
    servingSize: number;
    servingUnit: string;
}

const FOOD_ANALYSIS_PROMPT = `Analyze this food description and extract detailed nutritional information.
Return ONLY a valid JSON object with these fields (all numeric values should be numbers, not strings):
- name: concise descriptive name for this food entry
- servingSize: estimated numeric portion size
- servingUnit: appropriate unit of measurement (g, oz, ml, cup, etc.)
- calories: estimated total calories
- protein: estimated grams of protein
- carbs: estimated grams of carbohydrates
- fat: estimated grams of fat
- fiber: estimated grams of fiber if applicable
- confidence: your confidence in this estimation (0-100)
- estimatedNutriScore: { score: number, grade: "A"|"B"|"C"|"D"|"E" }
- fitnessInfo: {
    workoutSuitability: { preWorkout: 0-100, postWorkout: 0-100 },
    glycemicImpact: string description,
    dietCompatibility: { keto: boolean, paleo: boolean, vegan: boolean, lowCarb: boolean }
  }

Return your best estimate based on standard nutritional databases. If the description is too vague, estimate based on typical preparation methods and portion sizes.`;

export async function analyzeFood(description: string): Promise<FoodItem | null> {
    try {
        logger.info("Analyzing food description", "FoodAIService", { description });

        const result = await geminiModel.generateContent([FOOD_ANALYSIS_PROMPT, description]);

        const textResponse = result.response.text();
        logger.info("AI response received", "FoodAIService", { textResponse });

        const jsonString = extractJsonFromText(textResponse);
        if (!jsonString) {
            logger.error("No JSON found in response", "FoodAIService");
            return null;
        }

        const parsedData = parseNutritionData(jsonString);
        if (!parsedData) {
            return null;
        }

        return convertToFoodItem(parsedData);
    } catch (error) {
        logger.error("Food analysis error:", "FoodAIService", error);
        return null;
    }
}

function convertToFoodItem(data: AIFoodAnalysis): FoodItem {
    return {
        aiMetadata: {
            confidence: data.confidence,
            fitnessInfo: data.fitnessInfo,
            nutriScore: data.estimatedNutriScore,
        },
        barcode: "",
        brand: "",
        calories: Math.round(data.calories),
        carbs: Number(data.carbs.toFixed(1)),
        fat: Number(data.fat.toFixed(1)),
        id: `ai-${Date.now()}`,
        name: data.name,
        protein: Number(data.protein.toFixed(1)),
        servingSize: data.servingSize,
        servingUnit: data.servingUnit,
        source: "AI Analysis",
    };
}

function extractJsonFromText(text: string): null | string {
    // First try to extract JSON between code blocks
    const jsonMatch = /```(?:json)?\n([\S\s]*?)\n```/.exec(text);
    if (jsonMatch?.[1]) {
        return jsonMatch[1];
    }

    // If no code blocks, try to find JSON object directly
    const directJsonMatch = /{[\S\s]*?}/.exec(text);
    return directJsonMatch ? directJsonMatch[0] : null;
}

function parseNutritionData(jsonString: string): AIFoodAnalysis | null {
    try {
        const parsedData = JSON.parse(jsonString) as AIFoodAnalysis;

        // Ensure required fields exist and are numbers
        const requiredFields = ["calories", "protein", "carbs", "fat", "servingSize"] as const;
        for (const field of requiredFields) {
            if (typeof parsedData[field] !== "number") {
                parsedData[field] = Number.parseFloat(String(parsedData[field])) || 0;
            }
        }

        return parsedData;
    } catch (e) {
        logger.error("Failed to parse nutrition JSON", "FoodAIService", e);
        return null;
    }
}
