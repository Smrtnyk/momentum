interface UnitConversion {
    fromUnit: string;
    ratio: number;
    threshold: number;
    toUnit: string;
}

type UnitSystem = "cooking" | "custom" | "imperial" | "metric";
type UnitType = "custom" | "volume" | "weight";

// Units classification maps
const WEIGHT_UNITS = ["g", "kg", "oz", "lb"];
const VOLUME_UNITS = ["ml", "l", "L", "liter", "fl_oz", "cup", "cups", "tbsp", "tsp"];
const METRIC_UNITS = ["g", "kg", "ml", "l", "L", "liter"];
const IMPERIAL_UNITS = ["oz", "lb", "fl_oz"];
const COOKING_UNITS = ["cup", "cups", "tbsp", "tsp"];
const STANDARD_UNITS = [...WEIGHT_UNITS, ...VOLUME_UNITS];

// Conversion ratios and thresholds
const UNIT_CONVERSIONS: UnitConversion[] = [
    // Weight conversions
    { fromUnit: "kg", ratio: 1000, threshold: 0.1, toUnit: "g" },
    { fromUnit: "lb", ratio: 16, threshold: 0.5, toUnit: "oz" },
    { fromUnit: "oz", ratio: 28.35, threshold: 0, toUnit: "g" },
    { fromUnit: "g", ratio: 1 / 28.35, threshold: 0, toUnit: "oz" },

    // Volume conversions
    { fromUnit: "L", ratio: 1000, threshold: 0.1, toUnit: "ml" },
    { fromUnit: "l", ratio: 1000, threshold: 0.1, toUnit: "ml" },
    { fromUnit: "liter", ratio: 1000, threshold: 0.1, toUnit: "ml" },
    { fromUnit: "fl_oz", ratio: 29.57, threshold: 0, toUnit: "ml" },
    { fromUnit: "ml", ratio: 1 / 29.57, threshold: 0, toUnit: "fl_oz" },

    // Cooking measurement conversions
    { fromUnit: "cup", ratio: 16, threshold: 0.25, toUnit: "tbsp" },
    { fromUnit: "cups", ratio: 16, threshold: 0.25, toUnit: "tbsp" },
    { fromUnit: "tbsp", ratio: 3, threshold: 1, toUnit: "tsp" },

    // Cross-system conversions (for cooking)
    // liquid ounce approximation
    { fromUnit: "oz", ratio: 2, threshold: 1, toUnit: "tbsp" },
];

/**
 * Converts cooking measurement units (cups, tbsp, tsp)
 */
export function convertCookingMeasure(value: number, fromUnit: string, toUnit: string): number {
    if (fromUnit === toUnit) return value;

    const normalizedFromUnit = fromUnit === "cups" ? "cup" : fromUnit;
    const normalizedToUnit = toUnit === "cups" ? "cup" : toUnit;

    //  everything to teaspoons first as the base unit
    let tspValue = value;

    if (normalizedFromUnit === "cup") {
        // 1 cup = 16 tbsp = 48 tsp
        tspValue = value * 48;
    } else if (normalizedFromUnit === "tbsp") {
        // 1 tbsp = 3 tsp
        tspValue = value * 3;
    }

    // Then convert from teaspoons to target unit
    if (normalizedToUnit === "tsp") {
        return formatConvertedValue(tspValue, normalizedToUnit);
    } else if (normalizedToUnit === "tbsp") {
        return formatConvertedValue(tspValue / 3, normalizedToUnit);
    } else if (normalizedToUnit === "cup") {
        return formatConvertedValue(tspValue / 48, normalizedToUnit);
    }

    return value;
}

/**
 * Converts a quantity from one unit to another
 */
export function convertQuantity(value: number, fromUnit: string, toUnit: string): number {
    if (!fromUnit || !toUnit || fromUnit === toUnit) return value;

    // direct conversion first
    const directConversion = findDirectConversion(fromUnit, toUnit);
    if (directConversion) {
        return formatConvertedValue(value * directConversion.ratio, toUnit);
    }

    const fromType = getUnitType(fromUnit);
    const toType = getUnitType(toUnit);

    // Cannot convert between different types
    if (fromType !== toType && fromType !== "custom" && toType !== "custom") {
        return value;
    }

    // conversions by unit type
    if (fromType === "weight" && toType === "weight") {
        return handleWeightConversion(value, fromUnit, toUnit);
    }

    if (fromType === "volume" && toType === "volume") {
        return handleVolumeConversion(value, fromUnit, toUnit);
    }

    return value;
}

/**
 * Converts units if below a threshold
 * Used in recipes to make small amounts more readable (e.g., 0.25 cup -> 4 tbsp)
 */
export function convertUnitIfNeeded(
    amount: number,
    unit: string,
): { amount: number; unit: string } {
    if (!unit) return { amount, unit };

    const conversion = UNIT_CONVERSIONS.find(
        (conv) =>
            conv.fromUnit.toLowerCase() === unit.toLowerCase() &&
            amount < conv.threshold &&
            conv.threshold > 0,
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
 * Converts volume units
 */
export function convertVolume(value: number, fromUnit: string, toUnit: string): number {
    if (fromUnit === toUnit) return value;

    if (fromUnit === "ml" && toUnit === "fl_oz") {
        return formatConvertedValue(value / 29.57, toUnit);
    } else if (fromUnit === "fl_oz" && toUnit === "ml") {
        return formatConvertedValue(value * 29.57, toUnit);
    }

    return value;
}

/**
 * Converts weight units
 */
export function convertWeight(value: number, fromUnit: string, toUnit: string): number {
    if (fromUnit === toUnit) return value;

    if (fromUnit === "g" && toUnit === "oz") {
        return formatConvertedValue(value / 28.35, toUnit);
    } else if (fromUnit === "oz" && toUnit === "g") {
        return formatConvertedValue(value * 28.35, toUnit);
    }

    return value;
}

/**
 * Gets available units for conversion based on the current unit
 */
export function getAvailableUnits(unit: string): string[] {
    if (!isStandardUnit(unit)) {
        return [unit];
    }

    const unitType = getUnitType(unit);
    if (unitType === "weight") {
        return ["g", "oz"];
    } else if (unitType === "volume") {
        if (["cup", "cups", "tbsp", "tsp"].includes(unit.toLowerCase())) {
            return ["cup", "tbsp", "tsp"];
        }
        return ["ml", "fl_oz"];
    }

    return [unit];
}

/**
 * Determines the system a unit belongs to (metric, imperial, cooking, custom)
 */
export function getUnitSystem(unit: string): UnitSystem {
    if (!unit) return "custom";

    const normalizedUnit = unit.toLowerCase();
    if (METRIC_UNITS.includes(normalizedUnit)) return "metric";
    if (IMPERIAL_UNITS.includes(normalizedUnit)) return "imperial";
    if (COOKING_UNITS.includes(normalizedUnit)) return "cooking";
    return "custom";
}

/**
 * Determines the type of unit (weight, volume, or custom)
 */
export function getUnitType(unit: string): UnitType {
    if (!unit) return "custom";

    const normalizedUnit = unit.toLowerCase();
    if (WEIGHT_UNITS.includes(normalizedUnit)) return "weight";
    if (VOLUME_UNITS.includes(normalizedUnit)) return "volume";
    return "custom";
}

/**
 * Checks if a unit is a liquid volume unit
 */
export function isLiquidUnit(unit: string): boolean {
    if (!unit) return false;
    return VOLUME_UNITS.includes(unit.toLowerCase());
}

/**
 * Checks if a unit is a standard unit (not custom)
 */
export function isStandardUnit(unit: string): boolean {
    if (!unit) return false;
    return STANDARD_UNITS.includes(unit.toLowerCase());
}

/**
 * Checks if a unit is a weight unit
 */
export function isWeightUnit(unit: string): boolean {
    if (!unit) return false;
    return WEIGHT_UNITS.includes(unit.toLowerCase());
}

/**
 * Normalizes to base units (g for weight, ml for volume)
 */
export function normalizeToBaseUnit(quantity: number, unit: string): number {
    if (!unit) return quantity;

    const unitType = getUnitType(unit);

    if (unitType === "weight") {
        if (unit === "g") {
            return quantity;
        } else if (unit === "oz") {
            return quantity * 28.35;
        } else if (unit === "kg") {
            return quantity * 1000;
        } else if (unit === "lb") {
            // 1 lb = 16 oz = 453.59g
            return quantity * 453.59;
        }
    } else if (unitType === "volume") {
        if (unit === "ml") {
            return quantity;
        } else if (unit === "fl_oz") {
            return quantity * 29.57;
        } else if (unit === "L" || unit === "l" || unit === "liter") {
            return quantity * 1000;
        } else if (unit === "cup" || unit === "cups") {
            // 1 cup ≈ 236.59ml
            return quantity * 236.59;
        } else if (unit === "tbsp") {
            // 1 tbsp ≈ 14.79ml
            return quantity * 14.79;
        } else if (unit === "tsp") {
            // 1 tsp ≈ 4.93ml
            return quantity * 4.93;
        }
    }

    return quantity;
}

/**
 * Helper function to find a direct conversion in the unit conversions list
 */
function findDirectConversion(fromUnit: string, toUnit: string): undefined | UnitConversion {
    return UNIT_CONVERSIONS.find(
        (conv) =>
            conv.fromUnit.toLowerCase() === fromUnit.toLowerCase() &&
            conv.toUnit.toLowerCase() === toUnit.toLowerCase(),
    );
}

/**
 * Formats the converted value with the appropriate precision based on unit type
 */
function formatConvertedValue(value: number, unit: string): number {
    if (isWeightUnit(unit) && (unit === "g" || unit === "oz" || unit === "lb")) {
        return unit === "g"
            ? Math.round(value)
            : value < 1
              ? Number(value.toFixed(1))
              : Number(value.toFixed(1));
    }

    if (isLiquidUnit(unit)) {
        if (unit === "ml") {
            // Round to nearest integer for ml
            return Math.round(value);
        } else if (unit === "fl_oz") {
            // 1 decimal place for fl_oz
            return Number(value.toFixed(1));
        } else if (unit === "L" || unit === "l" || unit === "liter") {
            // 2 decimal places for liters
            return Number(value.toFixed(2));
        } else if (unit === "cup" || unit === "cups") {
            return Number(value.toFixed(1));
        } else if (unit === "tbsp" || unit === "tsp") {
            return Number(value.toFixed(1));
        }
    }

    return Number(value.toFixed(1));
}

function handleVolumeConversion(value: number, fromUnit: string, toUnit: string): number {
    if ((fromUnit === "ml" && toUnit === "fl_oz") || (fromUnit === "fl_oz" && toUnit === "ml")) {
        return convertVolume(value, fromUnit, toUnit);
    }

    if (isCookingUnit(fromUnit) && isCookingUnit(toUnit)) {
        return convertCookingMeasure(value, fromUnit, toUnit);
    }

    if (isLiterUnit(fromUnit) && toUnit === "ml") {
        return formatConvertedValue(value * 1000, toUnit);
    }
    if (fromUnit === "ml" && isLiterUnit(toUnit)) {
        return formatConvertedValue(value / 1000, toUnit);
    }

    return value;
}

/**
 * Helper function to handle weight unit conversions
 */
function handleWeightConversion(value: number, fromUnit: string, toUnit: string): number {
    if ((fromUnit === "g" && toUnit === "oz") || (fromUnit === "oz" && toUnit === "g")) {
        return convertWeight(value, fromUnit, toUnit);
    }

    if (fromUnit === "g" && toUnit === "kg") {
        return formatConvertedValue(value / 1000, toUnit);
    }
    if (fromUnit === "kg" && toUnit === "g") {
        return formatConvertedValue(value * 1000, toUnit);
    }

    if (fromUnit === "oz" && toUnit === "lb") {
        return formatConvertedValue(value / 16, toUnit);
    }
    if (fromUnit === "lb" && toUnit === "oz") {
        return formatConvertedValue(value * 16, toUnit);
    }

    return value;
}

function isCookingUnit(unit: string): boolean {
    return ["cup", "cups", "tbsp", "tsp"].includes(unit.toLowerCase());
}

function isLiterUnit(unit: string): boolean {
    return ["L", "l", "liter"].includes(unit);
}
