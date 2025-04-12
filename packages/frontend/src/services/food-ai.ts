import { isNil } from "es-toolkit";
import { getGenerativeModel, Schema } from "firebase/vertexai";

import type { FoodItem } from "../types/food";

import { vertexAI } from "../firebase";
import { normalizeUnit } from "../helpers/units-utils";
import { logger } from "../logger/app-logger";

interface AIFoodAnalysis {
    calories: number;
    carbs: number;
    confidence: number;
    estimatedNutriScore: {
        grade: "A" | "B" | "C" | "D" | "E";
        score: number;
    };
    fat: number;
    fiber: number;
    fitnessInfo: {
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
    saturatedFat: number;
    servingSize: number;
    servingUnit: string;
    sugars: number;
}

const FOOD_ANALYSIS_SCHEMA = Schema.object({
    properties: {
        calories: Schema.number(),
        carbs: Schema.number(),
        confidence: Schema.number(),
        estimatedNutriScore: Schema.object({
            properties: {
                grade: Schema.enumString({
                    enum: ["A", "B", "C", "D", "E"],
                }),
                score: Schema.number(),
            },
        }),
        fat: Schema.number(),
        fiber: Schema.number(),
        fitnessInfo: Schema.object({
            properties: {
                dietCompatibility: Schema.object({
                    properties: {
                        keto: Schema.boolean(),
                        lowCarb: Schema.boolean(),
                        paleo: Schema.boolean(),
                        vegan: Schema.boolean(),
                    },
                }),
                glycemicImpact: Schema.string(),
                workoutSuitability: Schema.object({
                    properties: {
                        postWorkout: Schema.number(),
                        preWorkout: Schema.number(),
                    },
                }),
            },
        }),
        name: Schema.string(),
        protein: Schema.number(),
        saturatedFat: Schema.number(),
        servingSize: Schema.number(),
        servingUnit: Schema.string(),
        sugars: Schema.number(),
    },
});

const foodAnalysisModel = getGenerativeModel(vertexAI, {
    generationConfig: {
        responseMimeType: "application/json",
        responseSchema: FOOD_ANALYSIS_SCHEMA,
    },
    model: "gemini-2.0-flash-001",
});

export async function analyzeFood(description: string): Promise<FoodItem> {
    logger.info("Analyzing food description", "FoodAIService", { description });

    const result = await foodAnalysisModel.generateContent(description);
    const textResponse = result.response.text();
    logger.debug("Raw Gemini response", "FoodAIService", { textResponse });

    const parsedData = JSON.parse(textResponse) as AIFoodAnalysis;
    const requiredFields = [
        "name",
        "calories",
        "protein",
        "carbs",
        "fat",
        "servingSize",
        "servingUnit",
    ] as const;
    for (const field of requiredFields) {
        if (isNil(parsedData[field])) {
            throw new TypeError(`Missing required field: ${field}`);
        }
    }

    return convertToFoodItem(parsedData);
}

function convertToFoodItem(data: AIFoodAnalysis): FoodItem {
    const normalizedServingUnit = normalizeUnit(data.servingUnit);

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
        fiber: Number(data.fiber.toFixed(1)),
        id: `gemini-${Date.now()}`,
        name: data.name.trim(),
        protein: Number(data.protein.toFixed(1)),
        saturatedFat: Number(data.saturatedFat.toFixed(1)),
        servingSize: data.servingSize,
        servingUnit: normalizedServingUnit,
        source: "Gemini AI Analysis",
        sugars: Number(data.sugars.toFixed(1)),
    };
}
