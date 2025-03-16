import { describe, expect, it } from "vitest";

import type { Ingredient, Macros } from "../types/recipe";

import {
    adjustIngredientAmount,
    adjustIngredients,
    calculateMacroPercentage,
    calculateServingsRatio,
    getCaloriePercentage,
    getCalorieValue,
    getTotalCalories,
} from "./recipe-utils";

describe("recipe-utils", () => {
    describe("calculateServingsRatio", function () {
        it("calculates the correct ratio", function () {
            expect(calculateServingsRatio(4, 1)).toBe(0.25);
            expect(calculateServingsRatio(2, 6)).toBe(3);
        });

        it("handles edge cases", function () {
            expect(calculateServingsRatio(0, 5)).toBe(1);
            expect(calculateServingsRatio(-1, 5)).toBe(1);
            expect(calculateServingsRatio(null as unknown as number, 5)).toBe(1);
        });
    });

    describe("adjustIngredientAmount", function () {
        it("adjusts whole numbers correctly", function () {
            expect(adjustIngredientAmount("4", 0.5, "").amount).toBe("2");
            expect(adjustIngredientAmount("3", 2, "").amount).toBe("6");
        });

        it("adjusts decimal numbers correctly", function () {
            expect(adjustIngredientAmount("1.5", 0.5, "").amount).toBe("0.8");
            expect(adjustIngredientAmount("0.5", 3, "").amount).toBe("1.5");
        });

        it("prevents very small amounts from going to zero", function () {
            expect(adjustIngredientAmount("0.5", 0.1, "").amount).toBe("0.1");
            expect(adjustIngredientAmount("0.2", 0.1, "").amount).toBe("0.1");
            expect(adjustIngredientAmount("0.01", 0.1, "").amount).toBe("0.1");
        });

        it("handles non-numeric values", function () {
            expect(adjustIngredientAmount("to taste", 0.5, "").amount).toBe("to taste");
            expect(adjustIngredientAmount("pinch", 2, "").amount).toBe("pinch");
        });

        it("converts units for small quantities", function () {
            // Tablespoon to teaspoon conversion (1 tbsp = 3 tsp)
            const tbspResult = adjustIngredientAmount("2", 0.25, "tbsp");
            expect(tbspResult.amount).toBe("1.5");
            expect(tbspResult.unit).toBe("tsp");

            // Cup to tablespoon conversion (1 cup = 16 tbsp)
            const cupResult = adjustIngredientAmount("1", 0.2, "cup");
            expect(cupResult.amount).toBe("3.2");
            expect(cupResult.unit).toBe("tbsp");

            // Kilogram to gram conversion
            const kgResult = adjustIngredientAmount("1", 0.05, "kg");
            expect(kgResult.amount).toBe("50");
            expect(kgResult.unit).toBe("g");
        });

        it("doesn't convert units when above threshold", function () {
            // 1 tbsp stays as 1 tbsp (not converted to tsp)
            const tbspResult = adjustIngredientAmount("4", 0.25, "tbsp");
            expect(tbspResult.amount).toBe("1");
            expect(tbspResult.unit).toBe("tbsp");

            // 0.25 cup stays as 0.25 cup (not converted to tbsp)
            const cupResult = adjustIngredientAmount("1", 0.25, "cup");
            expect(cupResult.amount).toBe("0.3");
            expect(cupResult.unit).toBe("cup");
        });
    });

    describe("adjustIngredients", function () {
        const testIngredients: Ingredient[] = [
            { amount: "4", name: "chicken breast", unit: "oz" },
            { amount: "1.5", name: "olive oil", unit: "tbsp" },
            { amount: "to taste", name: "salt", unit: "" },
            { amount: "0.5", name: "garlic powder", unit: "tsp" },
            { amount: "1", name: "milk", unit: "cup" },
        ];

        it("adjusts all ingredients correctly", function () {
            const adjusted = adjustIngredients(testIngredients, 4, 2);
            expect(adjusted[0].amount).toBe("2");
            expect(adjusted[0].unit).toBe("oz");

            // 1.5 tbsp * 0.5 = 0.75 tbsp, which is < 1 tbsp threshold so converts to tsp
            expect(adjusted[1].amount).toBe("2.3");
            expect(adjusted[1].unit).toBe("tsp");

            expect(adjusted[2].amount).toBe("to taste");
            expect(adjusted[3].amount).toBe("0.3");
            expect(adjusted[3].unit).toBe("tsp");
            expect(adjusted[4].amount).toBe("0.5");
            expect(adjusted[4].unit).toBe("cup");
        });

        it("handles reduction to single serving with unit conversions", function () {
            const adjusted = adjustIngredients(testIngredients, 4, 1);
            expect(adjusted[0].amount).toBe("1");
            expect(adjusted[0].unit).toBe("oz");

            // 1.5 tbsp * 0.25 = 0.375 tbsp, which is < 1 tbsp, so converts to tsp (0.375 * 3 = 1.1)
            expect(adjusted[1].amount).toBe("1.1");
            expect(adjusted[1].unit).toBe("tsp");

            expect(adjusted[2].amount).toBe("to taste");

            expect(adjusted[3].amount).toBe("0.1");
            expect(adjusted[3].unit).toBe("tsp");

            // 1 cup * 0.25 = 0.25 cup, which is exactly at threshold, so stays as cup
            expect(adjusted[4].amount).toBe("0.3");
            expect(adjusted[4].unit).toBe("cup");
        });

        it("handles increasing servings", function () {
            const adjusted = adjustIngredients(testIngredients, 2, 8);
            expect(adjusted[0].amount).toBe("16");
            expect(adjusted[0].unit).toBe("oz");
            expect(adjusted[1].amount).toBe("6");
            expect(adjusted[1].unit).toBe("tbsp");
            expect(adjusted[2].amount).toBe("to taste");
            expect(adjusted[3].amount).toBe("2");
            expect(adjusted[3].unit).toBe("tsp");
            expect(adjusted[4].amount).toBe("4");
            expect(adjusted[4].unit).toBe("cup");
        });
    });

    describe("getTotalCalories", function () {
        it("calculates total calories correctly", function () {
            expect(getTotalCalories(520, 1)).toBe(520);
            expect(getTotalCalories(520, 4)).toBe(2080);
            expect(getTotalCalories(350, 2)).toBe(700);
        });
    });

    describe("calculateMacroPercentage", function () {
        it("calculates correct percentage of calories from each macro", function () {
            const macros: Macros = { carbs: 50, fat: 20, protein: 30 };
            // carbs: 50 * 4 = 200 calories
            // fat: 20 * 9 = 180 calories
            // protein: 30 * 4 = 120 calories
            // total: 500 calories

            // 200/500 = 0.4
            expect(calculateMacroPercentage(macros, "carbs")).toBe(40);
            // 180/500 = 0.36
            expect(calculateMacroPercentage(macros, "fat")).toBe(36);
            // 120/500 = 0.24
            expect(calculateMacroPercentage(macros, "protein")).toBe(24);
        });

        it("handles zero macros", function () {
            const macros: Macros = { carbs: 0, fat: 0, protein: 0 };
            expect(calculateMacroPercentage(macros, "carbs")).toBe(0);
            expect(calculateMacroPercentage(macros, "fat")).toBe(0);
            expect(calculateMacroPercentage(macros, "protein")).toBe(0);
        });
    });

    describe("getCalorieValue", function () {
        it("calculates total calories correctly from macros", function () {
            const macros: Macros = { carbs: 50, fat: 20, protein: 30 };
            // carbs: 50 * 4 = 200 calories
            // fat: 20 * 9 = 180 calories
            // protein: 30 * 4 = 120 calories
            // total: 500 calories

            expect(getCalorieValue(macros)).toBe(500);
        });

        it("handles zero macros", function () {
            const macros: Macros = { carbs: 0, fat: 0, protein: 0 };
            expect(getCalorieValue(macros)).toBe(0);
        });
    });

    describe("getCaloriePercentage", function () {
        it("calculates percentage correctly", function () {
            expect(getCaloriePercentage(120, 500)).toBe(24);
            expect(getCaloriePercentage(200, 500)).toBe(40);
        });

        it("handles zero total calories", function () {
            expect(getCaloriePercentage(120, 0)).toBe(0);
        });
    });
});
