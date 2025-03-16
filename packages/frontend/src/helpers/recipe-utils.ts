import type { Ingredient, Macros } from "../types/recipe";

import { convertUnitIfNeeded } from "./units-utils";

/**
 * Adjusts ingredient amounts based on serving ratio
 * Ensures no ingredient goes to zero unless it was already zero
 */
export function adjustIngredientAmount(
    originalAmount: string,
    servingsRatio: number,
    unit: string,
): { amount: string; unit: string } {
    const parsedAmount = Number.parseFloat(originalAmount);

    if (Number.isNaN(parsedAmount)) {
        return { amount: originalAmount, unit };
    }

    const adjustedAmount = parsedAmount * servingsRatio;
    const converted = convertUnitIfNeeded(adjustedAmount, unit);

    if (
        parsedAmount > 0 &&
        converted.amount > 0 &&
        converted.amount < 0.1 &&
        converted.unit === unit
    ) {
        converted.amount = 0.1;
    }

    const decimalPlaces = converted.amount % 1 === 0 ? 0 : 1;

    return {
        amount: converted.amount.toFixed(decimalPlaces),
        unit: converted.unit,
    };
}

/**
 * Adjusts all ingredients in a recipe based on desired servings
 */
export function adjustIngredients(
    ingredients: Ingredient[],
    originalServings: number,
    desiredServings: number,
): Ingredient[] {
    const ratio = calculateServingsRatio(originalServings, desiredServings);

    return ingredients.map((ingredient) => {
        const { amount, unit } = adjustIngredientAmount(ingredient.amount, ratio, ingredient.unit);

        return {
            amount,
            name: ingredient.name,
            unit,
        };
    });
}

/**
 * Calculates the percentage of calories from a specific macronutrient
 */
export function calculateMacroPercentage(macros: Macros, macroType: keyof Macros): number {
    const { carbs, fat, protein } = macros;
    const carbCalories = carbs * 4;
    const fatCalories = fat * 9;
    const proteinCalories = protein * 4;
    const totalCalories = carbCalories + fatCalories + proteinCalories;

    if (totalCalories === 0) return 0;

    let macroCalories = 0;
    switch (macroType) {
        case "carbs":
            macroCalories = carbCalories;
            break;
        case "fat":
            macroCalories = fatCalories;
            break;
        case "protein":
            macroCalories = proteinCalories;
            break;
    }

    return Math.round((macroCalories / totalCalories) * 100);
}

/**
 * Calculates the ratio of desired servings to original recipe servings
 */
export function calculateServingsRatio(originalServings: number, desiredServings: number): number {
    if (!originalServings || originalServings <= 0) return 1;
    return desiredServings / originalServings;
}

/**
 * Calculates the percentage contribution of a specific calorie value to total calories
 */
export function getCaloriePercentage(calorieValue: number, totalCalories: number): number {
    if (totalCalories <= 0) return 0;
    return Math.round((calorieValue / totalCalories) * 100);
}

/**
 * Gets calorie value from macronutrients
 */
export function getCalorieValue(macros: Macros): number {
    return macros.protein * 4 + macros.carbs * 4 + macros.fat * 9;
}

/**
 * Gets total calories for all servings
 * Used when calories represent per-serving value
 */
export function getTotalCalories(caloriesPerServing: number, servings: number): number {
    return caloriesPerServing * servings;
}
