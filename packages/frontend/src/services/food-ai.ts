import { isNil } from "es-toolkit";

import type { FoodItem } from "../types/food";

import { logger } from "../logger/app-logger";
import { DEEP_SEEK_MODEL, openai } from "./ai";

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
    sugars: number;
}

const FOOD_ANALYSIS_SYSTEM_PROMPT = `You are a professional nutritionist AI. Analyze food descriptions and:
1. Calculate nutrition FOR THE EXACT PORTION SPECIFIED IN THE INPUT
2. Never default to 100g - use the described serving size
3. For countable items (like eggs):
   - Calculate total weight based on standard sizes
   - Provide nutrition totals for the specified quantity

Example conversions:
- "2 eggs" → ~100g total (50g per egg)
- "1 banana" → ~120g (medium size)
- "1 cup rice" → ~185g cooked`;

export async function analyzeFood(description: string): Promise<FoodItem | null> {
    try {
        logger.info("Analyzing food description", "FoodAIService", { description });

        const response = await openai.chat.completions.create({
            max_tokens: 500,
            messages: [
                { content: FOOD_ANALYSIS_SYSTEM_PROMPT, role: "system" },
                { content: foodAnalysisUserPrompt(description), role: "user" },
            ],
            model: DEEP_SEEK_MODEL,
            response_format: { type: "json_object" },
            temperature: 1,
        });

        const jsonContent = response.choices[0]?.message?.content;
        if (!jsonContent) {
            logger.error("Empty response from DeepSeek", "FoodAIService");
            return null;
        }

        const jsonString = extractJsonFromText(jsonContent);
        if (!jsonString) {
            logger.error("Invalid JSON structure", "FoodAIService", { jsonContent });
            return null;
        }

        const parsedData = parseNutritionData(jsonString);
        return parsedData ? convertToFoodItem(parsedData) : null;
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
        id: `deepseek-${Date.now()}`,
        name: data.name.trim(),
        protein: Number(data.protein.toFixed(1)),
        servingSize: data.servingSize,
        servingUnit: data.servingUnit,
        source: "DeepSeek AI Analysis",
        sugars: Number(data.sugars.toFixed(1)),
    };
}

function extractJsonFromText(text: string): null | string {
    try {
        JSON.parse(text);
        return text;
    } catch {
        const match = /({[\S\s]*})/.exec(text);
        return match ? match[1] : null;
    }
}

function foodAnalysisUserPrompt(description: string): string {
    return `Food description: ${description}

Generate JSON with:
- "servingSize": TOTAL GRAMS for specified portion
- Nutritional values FOR ENTIRE SERVING
- No per-100g calculations

Required JSON structure:
{
    "name": "Descriptive food name",
    "servingSize": number, // TOTAL grams for specified portion
    "servingUnit": "g",
    "calories": number,    // TOTAL for specified portion
    "protein": number,     // TOTAL for specified portion
    "carbs": number,       // TOTAL for specified portion
    "sugars": number,      // TOTAL for specified portion
    "fat": number,         // TOTAL for specified portion
    "fiber": number?,      // TOTAL for specified portion
    "confidence": number,
    "estimatedNutriScore": { "score": number, "grade": "A"-"E" },
    "fitnessInfo": {
        "workoutSuitability": { "preWorkout": 0-100, "postWorkout": 0-100 },
        "glycemicImpact": "low|medium|high",
        "dietCompatibility": {
            "keto": boolean,
            "paleo": boolean,
            "vegan": boolean,
            "lowCarb": boolean
        }
    }
}`;
}

function parseNutritionData(jsonString: string): AIFoodAnalysis | null {
    try {
        const data = JSON.parse(jsonString) as AIFoodAnalysis;

        const numericFields = ["calories", "protein", "carbs", "fat", "servingSize"] as const;
        const required = ["name", ...numericFields] as const;

        for (const field of required) {
            if (isNil(data[field])) {
                throw new TypeError(`Missing required field: ${field}`);
            }
        }

        numericFields.forEach(function (field) {
            data[field] = Number(data[field]);
        });

        return data;
    } catch (error) {
        logger.error("Nutrition data parsing failed", "FoodAIService", error);
        return null;
    }
}
