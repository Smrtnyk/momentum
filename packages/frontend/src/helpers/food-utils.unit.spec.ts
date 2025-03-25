import { describe, expect, it } from "vitest";

import type { FoodItem } from "../types/food";

import { calculateNutrition } from "./food-utils";

describe("food-utils", function () {
    describe("Nutrition Calculation", function () {
        const testFood: FoodItem = {
            barcode: null,
            calories: 100,
            carbs: 10,
            fat: 5,
            id: "test-food",
            name: "Test Food",
            protein: 2,
            servingSize: 100,
            servingUnit: "g",
        };

        it("calculateNutrition handles zero or negative quantity", function () {
            expect(calculateNutrition(testFood, 0, "g")).toEqual({
                calories: 0,
                carbs: 0,
                fat: 0,
                protein: 0,
                sugars: 0,
            });

            expect(calculateNutrition(testFood, -1, "g")).toEqual({
                calories: 0,
                carbs: 0,
                fat: 0,
                protein: 0,
                sugars: 0,
            });
        });

        it("calculateNutrition works with same units", function () {
            const result = calculateNutrition(testFood, 200, "g");

            expect(result.calories).toBe(200);
            expect(result.carbs).toBe(20);
            expect(result.fat).toBe(10);
            expect(result.protein).toBe(4);
        });

        it("calculateNutrition works with weight unit conversion", function () {
            const result = calculateNutrition(testFood, 1, "oz");

            expect(result.calories).toBe(28);
            expect(result.carbs).toBeCloseTo(2.835, 1);
            expect(result.fat).toBeCloseTo(1.418, 1);
            expect(result.protein).toBeCloseTo(0.567, 1);
        });

        it("calculateNutrition works with liquid foods", function () {
            const liquidFood: FoodItem = {
                ...testFood,
                servingUnit: "ml",
            };

            // Same unit
            const resultSameUnit = calculateNutrition(liquidFood, 200, "ml");
            expect(resultSameUnit.calories).toBe(200);

            // Different unit
            const resultDiffUnit = calculateNutrition(liquidFood, 1, "fl_oz");
            expect(resultDiffUnit.calories).toBe(30);
            expect(resultDiffUnit.carbs).toBeCloseTo(2.957, 1);
        });

        it("calculateNutrition works with custom units", function () {
            const customFood: FoodItem = {
                ...testFood,
                servingUnit: "piece",
            };

            const result = calculateNutrition(customFood, 2, "piece");

            expect(result.calories).toBe(200);
            expect(result.carbs).toBe(20);
            expect(result.fat).toBe(10);
            expect(result.protein).toBe(4);
        });
    });
});
