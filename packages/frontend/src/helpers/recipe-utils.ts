import type { Ingredient, Macros } from "../types/recipe";

interface UnitConversion {
    fromUnit: string;
    // How many of toUnit equals 1 fromUnit
    ratio: number;
    // Below this amount, conversion should happen
    threshold: number;
    toUnit: string;
}

const unitConversions: UnitConversion[] = [
    { fromUnit: "tbsp", ratio: 3, threshold: 1, toUnit: "tsp" },
    { fromUnit: "cup", ratio: 16, threshold: 0.25, toUnit: "tbsp" },
    { fromUnit: "cups", ratio: 16, threshold: 0.25, toUnit: "tbsp" },
    // liquid ounce approximation
    { fromUnit: "oz", ratio: 2, threshold: 1, toUnit: "tbsp" },
    { fromUnit: "lb", ratio: 16, threshold: 0.5, toUnit: "oz" },
    { fromUnit: "kg", ratio: 1000, threshold: 0.1, toUnit: "g" },
    { fromUnit: "l", ratio: 1000, threshold: 0.1, toUnit: "ml" },
    { fromUnit: "liter", ratio: 1000, threshold: 0.1, toUnit: "ml" },
];

/**
 * Adjusts ingredient amounts based on serving ratio
 * Ensures no ingredient goes to zero unless it was already zero
 * Converts units when appropriate (e.g., tablespoons to teaspoons for small quantities)
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
 * Potentially converts units based on amount (e.g., tbsp to tsp when amount is small)
 */
export function convertUnitIfNeeded(
    amount: number,
    unit: string,
): { amount: number; unit: string } {
    if (!unit) return { amount, unit };

    const conversion = unitConversions.find(
        (conv) => conv.fromUnit.toLowerCase() === unit.toLowerCase() && amount < conv.threshold,
    );

    if (conversion) {
        return {
            amount: amount * conversion.ratio,
            unit: conversion.toUnit,
        };
    }

    return { amount, unit };
}

/**
 * Calculates the percentage contribution of a specific calorie value to total calories
 */
export function getCaloriePercentage(calorieValue: number, totalCalories: number): number {
    if (totalCalories <= 0) return 0;
    return (calorieValue / totalCalories) * 100;
}

/**
 * Gets calorie value from a specific macronutrient
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
