import { describe, expect, it } from "vitest";

import {
    convertCookingMeasure,
    convertQuantity,
    convertUnitIfNeeded,
    convertVolume,
    convertWeight,
    getAvailableUnits,
    getUnitSystem,
    getUnitType,
    isLiquidUnit,
    isStandardUnit,
    isWeightUnit,
    normalizeToBaseUnit,
} from "./units-utils";

describe("units-utils", function () {
    describe("Unit Classification", function () {
        it("getUnitType identifies unit types correctly", function () {
            // Weight units
            expect(getUnitType("g")).toBe("weight");
            expect(getUnitType("kg")).toBe("weight");
            expect(getUnitType("oz")).toBe("weight");
            expect(getUnitType("lb")).toBe("weight");

            // Volume units
            expect(getUnitType("ml")).toBe("volume");
            expect(getUnitType("L")).toBe("volume");
            expect(getUnitType("fl_oz")).toBe("volume");
            expect(getUnitType("cup")).toBe("volume");
            expect(getUnitType("tbsp")).toBe("volume");
            expect(getUnitType("tsp")).toBe("volume");

            // Custom units
            expect(getUnitType("piece")).toBe("custom");
            expect(getUnitType("serving")).toBe("custom");
            expect(getUnitType("")).toBe("custom");
        });

        it("getUnitSystem identifies unit systems correctly", function () {
            // Metric units
            expect(getUnitSystem("g")).toBe("metric");
            expect(getUnitSystem("kg")).toBe("metric");
            expect(getUnitSystem("ml")).toBe("metric");
            expect(getUnitSystem("L")).toBe("metric");

            // Imperial units
            expect(getUnitSystem("oz")).toBe("imperial");
            expect(getUnitSystem("lb")).toBe("imperial");
            expect(getUnitSystem("fl_oz")).toBe("imperial");

            // Cooking units
            expect(getUnitSystem("cup")).toBe("cooking");
            expect(getUnitSystem("cups")).toBe("cooking");
            expect(getUnitSystem("tbsp")).toBe("cooking");
            expect(getUnitSystem("tsp")).toBe("cooking");

            // Custom units
            expect(getUnitSystem("piece")).toBe("custom");
            expect(getUnitSystem("serving")).toBe("custom");
            expect(getUnitSystem("")).toBe("custom");
        });

        it("isLiquidUnit identifies liquid units correctly", function () {
            expect(isLiquidUnit("ml")).toBe(true);
            expect(isLiquidUnit("L")).toBe(true);
            expect(isLiquidUnit("fl_oz")).toBe(true);
            expect(isLiquidUnit("cup")).toBe(true);
            expect(isLiquidUnit("tbsp")).toBe(true);
            expect(isLiquidUnit("tsp")).toBe(true);

            expect(isLiquidUnit("g")).toBe(false);
            expect(isLiquidUnit("kg")).toBe(false);
            expect(isLiquidUnit("oz")).toBe(false);
            expect(isLiquidUnit("lb")).toBe(false);
            expect(isLiquidUnit("piece")).toBe(false);
            expect(isLiquidUnit("")).toBe(false);
        });

        it("isWeightUnit identifies weight units correctly", function () {
            expect(isWeightUnit("g")).toBe(true);
            expect(isWeightUnit("kg")).toBe(true);
            expect(isWeightUnit("oz")).toBe(true);
            expect(isWeightUnit("lb")).toBe(true);

            expect(isWeightUnit("ml")).toBe(false);
            expect(isWeightUnit("L")).toBe(false);
            expect(isWeightUnit("cup")).toBe(false);
            expect(isWeightUnit("tbsp")).toBe(false);
            expect(isWeightUnit("piece")).toBe(false);
            expect(isWeightUnit("")).toBe(false);
        });

        it("isStandardUnit identifies standard units correctly", function () {
            // Weight units
            expect(isStandardUnit("g")).toBe(true);
            expect(isStandardUnit("kg")).toBe(true);
            expect(isStandardUnit("oz")).toBe(true);
            expect(isStandardUnit("lb")).toBe(true);

            // Volume units
            expect(isStandardUnit("ml")).toBe(true);
            expect(isStandardUnit("L")).toBe(true);
            expect(isStandardUnit("fl_oz")).toBe(true);
            expect(isStandardUnit("cup")).toBe(true);
            expect(isStandardUnit("tbsp")).toBe(true);
            expect(isStandardUnit("tsp")).toBe(true);

            // Custom units
            expect(isStandardUnit("piece")).toBe(false);
            expect(isStandardUnit("serving")).toBe(false);
            expect(isStandardUnit("")).toBe(false);
        });

        it("getAvailableUnits returns correct units for different unit types", function () {
            // Weight units
            expect(getAvailableUnits("g")).toEqual(["g", "oz"]);
            expect(getAvailableUnits("oz")).toEqual(["g", "oz"]);

            // Volume units
            expect(getAvailableUnits("ml")).toEqual(["ml", "fl_oz"]);
            expect(getAvailableUnits("fl_oz")).toEqual(["ml", "fl_oz"]);

            // Cooking units
            expect(getAvailableUnits("cup")).toEqual(["cup", "tbsp", "tsp"]);
            expect(getAvailableUnits("tbsp")).toEqual(["cup", "tbsp", "tsp"]);
            expect(getAvailableUnits("tsp")).toEqual(["cup", "tbsp", "tsp"]);

            // Custom units
            expect(getAvailableUnits("piece")).toEqual(["piece"]);
            expect(getAvailableUnits("serving")).toEqual(["serving"]);
            expect(getAvailableUnits("")).toEqual([""]);
        });
    });

    describe("Unit Conversion", function () {
        it("convertWeight converts between weight units correctly", function () {
            // g to oz
            expect(convertWeight(100, "g", "oz")).toBe(3.5);
            expect(convertWeight(28.35, "g", "oz")).toBe(1);

            // oz to g
            expect(convertWeight(1, "oz", "g")).toBe(28);
            expect(convertWeight(3.5, "oz", "g")).toBe(99);

            // Same unit
            expect(convertWeight(100, "g", "g")).toBe(100);
            expect(convertWeight(3, "oz", "oz")).toBe(3);
        });

        it("convertVolume converts between volume units correctly", function () {
            // ml to fl_oz
            expect(convertVolume(100, "ml", "fl_oz")).toBe(3.4);
            expect(convertVolume(29.57, "ml", "fl_oz")).toBe(1);

            // fl_oz to ml
            expect(convertVolume(1, "fl_oz", "ml")).toBe(30);
            expect(convertVolume(3.4, "fl_oz", "ml")).toBe(101);

            // Same unit
            expect(convertVolume(100, "ml", "ml")).toBe(100);
            expect(convertVolume(2, "fl_oz", "fl_oz")).toBe(2);
        });

        it("convertCookingMeasure converts between cooking units correctly", function () {
            // cup to tbsp
            expect(convertCookingMeasure(1, "cup", "tbsp")).toBe(16);
            expect(convertCookingMeasure(0.5, "cup", "tbsp")).toBe(8);
            expect(convertCookingMeasure(0.25, "cup", "tbsp")).toBe(4);

            // cup to tsp
            expect(convertCookingMeasure(1, "cup", "tsp")).toBe(48);
            expect(convertCookingMeasure(0.5, "cup", "tsp")).toBe(24);

            // tbsp to tsp
            expect(convertCookingMeasure(1, "tbsp", "tsp")).toBe(3);
            expect(convertCookingMeasure(2, "tbsp", "tsp")).toBe(6);

            // tbsp to cup
            expect(convertCookingMeasure(16, "tbsp", "cup")).toBe(1);
            expect(convertCookingMeasure(8, "tbsp", "cup")).toBe(0.5);

            // tsp to tbsp
            expect(convertCookingMeasure(3, "tsp", "tbsp")).toBe(1);
            expect(convertCookingMeasure(6, "tsp", "tbsp")).toBe(2);

            // tsp to cup
            expect(convertCookingMeasure(48, "tsp", "cup")).toBe(1);
            expect(convertCookingMeasure(24, "tsp", "cup")).toBe(0.5);

            // Handle "cups" plural form
            expect(convertCookingMeasure(1, "cups", "tbsp")).toBe(16);
        });

        it("convertQuantity handles multiple unit types correctly", function () {
            // Weight conversions
            expect(convertQuantity(100, "g", "oz")).toBe(3.5);
            expect(convertQuantity(1, "oz", "g")).toBe(28);

            // Volume conversions
            expect(convertQuantity(100, "ml", "fl_oz")).toBe(3.4);
            expect(convertQuantity(1, "fl_oz", "ml")).toBe(30);

            // Cooking measure conversions
            expect(convertQuantity(1, "cup", "tbsp")).toBe(16);
            expect(convertQuantity(1, "tbsp", "tsp")).toBe(3);

            // Multi-level conversions (cup to ml would require normalization)
            // Note: Direct implementation of cup to ml might not exist in the base function

            // Same unit (no conversion)
            expect(convertQuantity(100, "g", "g")).toBe(100);
            expect(convertQuantity(250, "ml", "ml")).toBe(250);

            // Different unit types (should not convert)
            expect(convertQuantity(100, "g", "ml")).toBe(100);

            // Custom units (should not convert)
            expect(convertQuantity(2, "piece", "g")).toBe(2);
        });

        it("normalizeToBaseUnit converts to base units correctly", function () {
            // Weight normalization
            expect(normalizeToBaseUnit(100, "g")).toBe(100);
            expect(normalizeToBaseUnit(1, "oz")).toBe(28.35);
            expect(normalizeToBaseUnit(1, "kg")).toBe(1000);
            expect(normalizeToBaseUnit(1, "lb")).toBe(453.59);

            // Volume normalization
            expect(normalizeToBaseUnit(100, "ml")).toBe(100);
            expect(normalizeToBaseUnit(1, "fl_oz")).toBe(29.57);
            expect(normalizeToBaseUnit(1, "L")).toBe(1000);
            expect(normalizeToBaseUnit(1, "cup")).toBe(236.59);
            expect(normalizeToBaseUnit(1, "tbsp")).toBe(14.79);
            expect(normalizeToBaseUnit(1, "tsp")).toBe(4.93);

            // Custom units
            expect(normalizeToBaseUnit(2, "piece")).toBe(2);
        });

        it("convertUnitIfNeeded converts units below thresholds", function () {
            // Below threshold conversions

            // 0.5 tbsp -> 1.5 tsp (threshold 1 tbsp)
            expect(convertUnitIfNeeded(0.5, "tbsp")).toEqual({
                amount: 1.5,
                unit: "tsp",
            });

            // 0.2 cup -> 3.2 tbsp (threshold 0.25 cup)
            expect(convertUnitIfNeeded(0.2, "cup")).toEqual({
                amount: 3.2,
                unit: "tbsp",
            });

            // 0.05 kg -> 50 g (threshold 0.1 kg)
            expect(convertUnitIfNeeded(0.05, "kg")).toEqual({
                amount: 50,
                unit: "g",
            });

            // Above threshold (no conversion)

            // 1 tbsp stays as 1 tbsp (>= threshold)
            expect(convertUnitIfNeeded(1, "tbsp")).toEqual({
                amount: 1,
                unit: "tbsp",
            });

            // 0.3 cup stays as 0.3 cup (>= threshold)
            expect(convertUnitIfNeeded(0.3, "cup")).toEqual({
                amount: 0.3,
                unit: "cup",
            });

            // Unknown unit (no conversion)
            expect(convertUnitIfNeeded(0.5, "piece")).toEqual({
                amount: 0.5,
                unit: "piece",
            });
        });
    });

    describe("Edge Cases", function () {
        it("handles null or empty units gracefully", function () {
            expect(getUnitType("")).toBe("custom");
            expect(getUnitSystem("")).toBe("custom");
            expect(isLiquidUnit("")).toBe(false);
            expect(isWeightUnit("")).toBe(false);
            expect(isStandardUnit("")).toBe(false);

            expect(convertQuantity(100, "", "g")).toBe(100);
            expect(convertQuantity(100, "g", "")).toBe(100);
            expect(convertQuantity(100, "", "")).toBe(100);

            expect(normalizeToBaseUnit(100, "")).toBe(100);
        });

        it("handles case insensitivity", function () {
            expect(convertQuantity(100, "G", "oz")).toBe(3.5);
            expect(convertQuantity(100, "g", "OZ")).toBe(3.5);
            expect(convertQuantity(1, "Cup", "TBSP")).toBe(16);

            expect(isLiquidUnit("ML")).toBe(true);
            expect(isWeightUnit("KG")).toBe(true);
        });

        it("handles unit spelling variants", function () {
            // Test with different spellings like "cups" vs "cup"
            expect(convertQuantity(1, "cups", "tbsp")).toBe(16);
            expect(convertQuantity(1, "cup", "tbsp")).toBe(16);

            expect(convertQuantity(1, "liter", "ml")).toBe(1000);
            expect(convertQuantity(1, "L", "ml")).toBe(1000);
        });
    });
});
