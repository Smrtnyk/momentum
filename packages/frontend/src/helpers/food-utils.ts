import type { FoodItem } from "../types/food";

import { isStandardUnit, normalizeToBaseUnit } from "./units-utils";

type NutritionValues = Pick<
    FoodItem,
    "calories" | "carbs" | "fat" | "fiber" | "protein" | "saturatedFat" | "sugars"
>;

export function calculateNutrition(
    food: FoodItem,
    quantity: number,
    unit: string,
): NutritionValues {
    if (!quantity || quantity <= 0) {
        return { calories: 0, carbs: 0, fat: 0, protein: 0, sugars: 0 };
    }

    if (!isStandardUnit(unit) && unit === food.servingUnit) {
        return {
            calories: Math.round(food.calories * quantity),
            carbs: food.carbs * quantity,
            fat: food.fat * quantity,
            protein: food.protein * quantity,
            sugars: Number(food.sugars) * quantity,
        };
    }

    const baseAmount = normalizeToBaseUnit(quantity, unit);
    const baseServingSize = normalizeToBaseUnit(food.servingSize, food.servingUnit);
    const factor = baseAmount / baseServingSize;

    return {
        calories: Math.round(food.calories * factor),
        carbs: food.carbs * factor,
        fat: food.fat * factor,
        fiber: factor * (food.fiber ?? 0),
        protein: food.protein * factor,
        saturatedFat: factor * (food.saturatedFat ?? 0),
        sugars: (food.sugars ?? 0) * factor,
    };
}
