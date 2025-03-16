import type { FoodItem } from "../types/food";

import { isStandardUnit, normalizeToBaseUnit } from "./units-utils";

interface NutritionValues {
    calories: number;
    carbs: number;
    fat: number;
    protein: number;
}

export function calculateNutrition(
    food: FoodItem,
    quantity: number,
    unit: string,
): NutritionValues {
    if (!quantity || quantity <= 0) {
        return { calories: 0, carbs: 0, fat: 0, protein: 0 };
    }

    if (!isStandardUnit(unit) && unit === food.servingUnit) {
        return {
            calories: Math.round(food.calories * quantity),
            carbs: food.carbs * quantity,
            fat: food.fat * quantity,
            protein: food.protein * quantity,
        };
    }

    const baseAmount = normalizeToBaseUnit(quantity, unit);
    const baseServingSize = normalizeToBaseUnit(food.servingSize, food.servingUnit);

    const factor = baseAmount / baseServingSize;

    return {
        calories: Math.round(food.calories * factor),
        carbs: food.carbs * factor,
        fat: food.fat * factor,
        protein: food.protein * factor,
    };
}
