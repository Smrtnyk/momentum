import type { FoodItem } from "../types/food";

import { geminiModel } from "../firebase";
import { logger } from "../logger/app-logger";

interface RawNutritionData {
    brand?: null | string;
    calories?: null | number | string;
    carbs?: null | number | string;
    fat?: null | number | string;
    fiber?: null | number | string;
    name?: null | string;
    protein?: null | number | string;
    servingSize?: null | number | string;
    servingUnit?: null | string;
}

export async function scanNutritionLabel(imageData: string): Promise<FoodItem | null> {
    try {
        const imagePart = {
            inlineData: {
                data: imageData,
                mimeType: "image/jpeg",
            },
        };
        const prompt = createPrompt();

        const result = await geminiModel.generateContent([prompt, imagePart]);
        const textResponse = result.response.text();
        logger.info(textResponse, "NutritionScanner");

        const jsonString = extractJsonFromText(textResponse);
        if (!jsonString) {
            logger.error("No JSON found in response");
            return null;
        }

        const parsedData = parseNutritionData(jsonString);
        if (!parsedData) {
            return null;
        }

        return convertToFoodItem(parsedData);
    } catch (error) {
        logger.error("Nutrition scanning error:", "NutritionScanner", error);
        return null;
    }
}

function convertToFoodItem(data: RawNutritionData): FoodItem {
    return {
        barcode: "",
        brand: data.brand ?? "",
        calories: normalizeNumericValue(data.calories),
        carbs: normalizeNumericValue(data.carbs),
        fat: normalizeNumericValue(data.fat),
        id: `scanned-${Date.now()}`,
        name: data.name ?? "Scanned Product",
        protein: normalizeNumericValue(data.protein),
        servingSize: normalizeNumericValue(data.servingSize) || 1,
        servingUnit: data.servingUnit ?? "serving",
    };
}

function createPrompt(): string {
    return `Analyze this nutrition facts label image and extract the exact nutritional information.
Return ONLY a JSON object with these fields (use numeric values, not strings):
- name: the product name if visible (string or null)
- servingSize: the numeric portion size (number)
- servingUnit: the unit of measurement (g, oz, ml, etc.)
- calories: total calories per serving (number)
- protein: grams of protein (number)
- carbs: grams of carbohydrates (number)
- fat: grams of fat (number)
- fiber: grams of fiber if available (number or 0)

Example format:
{"name":"Protein Bar","servingSize":100,"servingUnit":"g","calories":200,"protein":20,"carbs":25,"fat":8,"fiber":5}`;
}

function extractJsonFromText(text: string): null | string {
    const jsonMatch = /```json\n([\S\s]*?)\n```/.exec(text) ?? /{[\S\s]*?}/.exec(text);
    return jsonMatch ? (jsonMatch[1] ?? jsonMatch[0]) : null;
}

function normalizeNumericValue(value: null | number | string | undefined): number {
    if (value === null || value === undefined) {
        return 0;
    }

    return typeof value === "string" ? Number.parseFloat(value) : value;
}

function parseNutritionData(jsonString: string): null | RawNutritionData {
    try {
        let parsedData: RawNutritionData = JSON.parse(jsonString);

        if (Array.isArray(parsedData)) {
            parsedData = parsedData[0];
        }

        return parsedData;
    } catch (e) {
        logger.error("Failed to parse JSON", "NutritionScanner", e);
        return null;
    }
}
