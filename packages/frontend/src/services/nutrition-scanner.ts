import { isNil, isString } from "es-toolkit";
import { Timestamp } from "firebase/firestore";
import { getGenerativeModel, Schema } from "firebase/vertexai";

import type { FoodItem } from "../types/food";

import { vertexAI } from "../firebase";
import { logger } from "../logger/app-logger";

interface RawNutritionData {
    brand?: null | string;
    calories?: null | number;
    carbs?: null | number;
    fat?: null | number;
    fiber?: null | number;
    name?: null | string;
    protein?: null | number;
    servingSize?: null | number;
    servingUnit?: null | string;
    sugars?: null | number;
}

const NUTRITION_SCHEMA = Schema.object({
    optionalProperties: ["name", "brand", "fiber"],
    properties: {
        brand: Schema.string(),
        calories: Schema.number(),
        carbs: Schema.number(),
        fat: Schema.number(),
        fiber: Schema.number(),
        name: Schema.string(),
        protein: Schema.number(),
        servingSize: Schema.number(),
        servingUnit: Schema.string(),
        sugars: Schema.number(),
    },
});

const nutritionScannerModel = getGenerativeModel(vertexAI, {
    generationConfig: {
        responseMimeType: "application/json",
        responseSchema: NUTRITION_SCHEMA,
    },
    model: "gemini-2.5-flash-preview-04-17",
});

export async function scanNutritionLabel(imageData: string): Promise<FoodItem | null> {
    const imagePart = {
        inlineData: {
            data: imageData,
            mimeType: "image/jpeg",
        },
    };
    const prompt = createPrompt();
    const result = await nutritionScannerModel.generateContent([prompt, imagePart]);
    const textResponse = result.response.text();
    logger.debug(textResponse, "NutritionScanner");
    const parsedData = JSON.parse(textResponse) as RawNutritionData;
    return convertToFoodItem(parsedData);
}

function convertToFoodItem(data: RawNutritionData): FoodItem {
    return {
        barcode: "",
        brand: data.brand ?? "",
        calories: normalizeNumericValue(data.calories),
        carbs: normalizeNumericValue(data.carbs),
        fat: normalizeNumericValue(data.fat),
        id: `scanned-${Date.now()}`,
        loggedTimestamp: Timestamp.now(),
        name: data.name ?? "",
        protein: normalizeNumericValue(data.protein),
        servingSize: normalizeNumericValue(data.servingSize) || 1,
        servingUnit: data.servingUnit ?? "serving",
        sugars: normalizeNumericValue(data.sugars),
    };
}

function createPrompt(): string {
    return `Analyze this nutrition facts label image and extract the exact nutritional information.
Return nutritional information as JSON with the following structure:
- name: the product name if visible (string)
- brand: the brand name if visible (string, optional)
- servingSize: the numeric portion size (number)
- servingUnit: the unit of measurement (g, oz, ml, etc.)
- calories: total calories per serving (number)
- protein: grams of protein (number)
- carbs: grams of carbohydrates (number)
- sugars: grams of sugars (number)
- fat: grams of fat (number)
- fiber: grams of fiber if available (number, optional)`;
}

function normalizeNumericValue(value: null | number | string | undefined): number {
    if (isNil(value)) {
        return 0;
    }

    return isString(value) ? Number.parseFloat(value) : value;
}
