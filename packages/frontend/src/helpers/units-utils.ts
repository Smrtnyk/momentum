enum UnitSystem {
    COOKING = "cooking",
    CUSTOM = "custom",
    IMPERIAL = "imperial",
    METRIC = "metric",
}

enum UnitType {
    CUSTOM = "custom",
    VOLUME = "volume",
    WEIGHT = "weight",
}

enum VolumeUnit {
    CUP = "cup",
    CUPS = "cups",
    FLUID_OUNCE = "fl_oz",
    LITER = "l",
    LITER_CAP = "L",
    LITER_FULL = "liter",
    MILLILITER = "ml",
    TABLESPOON = "tbsp",
    TEASPOON = "tsp",
}

enum WeightUnit {
    GRAM = "g",
    KILOGRAM = "kg",
    OUNCE = "oz",
    POUND = "lb",
}

const UNIT_VARIATIONS: Record<string, string> = {
    c: "cup",
    cup: "cup",
    cups: "cups",
    "fl oz": "fl_oz",
    "fluid ounce": "fl_oz",
    "fluid ounces": "fl_oz",
    gm: "g",
    gr: "g",
    gram: "g",
    gramme: "g",
    grammes: "g",
    grams: "g",
    kilo: "kg",
    kilogram: "kg",
    kilogramme: "kg",
    kilogrammes: "kg",
    kilograms: "kg",
    kilos: "kg",
    lbs: "lb",
    liter: "l",
    liters: "l",
    litre: "l",
    litres: "l",
    milliliter: "ml",
    milliliters: "ml",
    millilitre: "ml",
    millilitres: "ml",
    ounce: "oz",
    ounces: "oz",
    pound: "lb",
    pounds: "lb",
    tablespoon: "tbsp",
    tablespoons: "tbsp",
    tb: "tbsp",
    tbl: "tbsp",
    tbs: "tbsp",
    teaspoon: "tsp",
    teaspoons: "tsp",
};

type CookingConversionTable = Record<string, number>;

type Unit = string | VolumeUnit | WeightUnit;

/**
 * Normalizes unit string to handle case insensitivity
 */
export function normalizeUnit(unit: Unit): Unit {
    if (!unit) return unit;

    const lowercased = unit.toString().toLowerCase();

    if (lowercased in UNIT_VARIATIONS) {
        return UNIT_VARIATIONS[lowercased];
    }

    const allUnits = { ...WeightUnit, ...VolumeUnit };
    for (const [, enumValue] of Object.entries(allUnits)) {
        if (enumValue.toLowerCase() === lowercased) {
            return enumValue;
        }
    }

    return lowercased;
}

const CONVERSION_FACTORS = {
    // 1 cup = 236.59 ml
    [VolumeUnit.CUP]: { fromBase: 1 / 236.59, toBase: 236.59 },
    // Same as cup
    [VolumeUnit.CUPS]: { fromBase: 1 / 236.59, toBase: 236.59 },
    // 1 fl_oz = 29.57 ml
    [VolumeUnit.FLUID_OUNCE]: { fromBase: 1 / 29.57, toBase: 29.57 },
    // 1 L = 1000 ml
    [VolumeUnit.LITER]: { fromBase: 0.001, toBase: 1000 },
    // 1 L = 1000 ml
    [VolumeUnit.LITER_CAP]: { fromBase: 0.001, toBase: 1000 },
    // 1 liter = 1000 ml
    [VolumeUnit.LITER_FULL]: { fromBase: 0.001, toBase: 1000 },
    // Base unit for volume
    [VolumeUnit.MILLILITER]: { fromBase: 1, toBase: 1 },
    // 1 tbsp = 14.79 ml
    [VolumeUnit.TABLESPOON]: { fromBase: 1 / 14.79, toBase: 14.79 },
    // 1 tsp = 4.93 ml
    [VolumeUnit.TEASPOON]: { fromBase: 1 / 4.93, toBase: 4.93 },
    // Base unit for weight
    [WeightUnit.GRAM]: { fromBase: 1, toBase: 1 },
    // 1 kg = 1000 g
    [WeightUnit.KILOGRAM]: { fromBase: 0.001, toBase: 1000 },
    // 1 oz = 28.35 g
    [WeightUnit.OUNCE]: { fromBase: 1 / 28.35, toBase: 28.35 },
    // 1 lb = 453.59 g
    [WeightUnit.POUND]: { fromBase: 1 / 453.59, toBase: 453.59 },
};

const CONVERSION_THRESHOLDS = [
    { fromUnit: WeightUnit.KILOGRAM, ratio: 1000, threshold: 0.1, toUnit: WeightUnit.GRAM },
    { fromUnit: WeightUnit.POUND, ratio: 16, threshold: 0.5, toUnit: WeightUnit.OUNCE },
    { fromUnit: VolumeUnit.LITER, ratio: 1000, threshold: 0.1, toUnit: VolumeUnit.MILLILITER },
    { fromUnit: VolumeUnit.LITER_CAP, ratio: 1000, threshold: 0.1, toUnit: VolumeUnit.MILLILITER },
    { fromUnit: VolumeUnit.LITER_FULL, ratio: 1000, threshold: 0.1, toUnit: VolumeUnit.MILLILITER },
    { fromUnit: VolumeUnit.CUP, ratio: 16, threshold: 0.25, toUnit: VolumeUnit.TABLESPOON },
    { fromUnit: VolumeUnit.CUPS, ratio: 16, threshold: 0.25, toUnit: VolumeUnit.TABLESPOON },
    { fromUnit: VolumeUnit.TABLESPOON, ratio: 3, threshold: 1, toUnit: VolumeUnit.TEASPOON },
    // Liquid ounce approx
    { fromUnit: WeightUnit.OUNCE, ratio: 2, threshold: 1, toUnit: VolumeUnit.TABLESPOON },
];

const UNIT_METADATA = {
    [VolumeUnit.CUP]: { precision: 1, system: UnitSystem.COOKING, type: UnitType.VOLUME },
    [VolumeUnit.CUPS]: { precision: 1, system: UnitSystem.COOKING, type: UnitType.VOLUME },
    [VolumeUnit.FLUID_OUNCE]: { precision: 1, system: UnitSystem.IMPERIAL, type: UnitType.VOLUME },
    [VolumeUnit.LITER]: { precision: 2, system: UnitSystem.METRIC, type: UnitType.VOLUME },
    [VolumeUnit.LITER_CAP]: { precision: 2, system: UnitSystem.METRIC, type: UnitType.VOLUME },
    [VolumeUnit.LITER_FULL]: { precision: 2, system: UnitSystem.METRIC, type: UnitType.VOLUME },
    [VolumeUnit.MILLILITER]: { precision: 0, system: UnitSystem.METRIC, type: UnitType.VOLUME },
    [VolumeUnit.TABLESPOON]: { precision: 1, system: UnitSystem.COOKING, type: UnitType.VOLUME },
    [VolumeUnit.TEASPOON]: { precision: 1, system: UnitSystem.COOKING, type: UnitType.VOLUME },

    [WeightUnit.GRAM]: { precision: 0, system: UnitSystem.METRIC, type: UnitType.WEIGHT },
    [WeightUnit.KILOGRAM]: { precision: 2, system: UnitSystem.METRIC, type: UnitType.WEIGHT },
    [WeightUnit.OUNCE]: { precision: 1, system: UnitSystem.IMPERIAL, type: UnitType.WEIGHT },
    [WeightUnit.POUND]: { precision: 1, system: UnitSystem.IMPERIAL, type: UnitType.WEIGHT },
};

const COOKING_CONVERSIONS: Record<string, CookingConversionTable> = {
    [VolumeUnit.CUP]: {
        [VolumeUnit.TABLESPOON]: 16,
        [VolumeUnit.TEASPOON]: 48,
    },
    [VolumeUnit.CUPS]: {
        [VolumeUnit.TABLESPOON]: 16,
        [VolumeUnit.TEASPOON]: 48,
    },
    [VolumeUnit.TABLESPOON]: {
        [VolumeUnit.CUP]: 1 / 16,
        [VolumeUnit.CUPS]: 1 / 16,
        [VolumeUnit.TEASPOON]: 3,
    },
    [VolumeUnit.TEASPOON]: {
        [VolumeUnit.CUP]: 1 / 48,
        [VolumeUnit.CUPS]: 1 / 48,
        [VolumeUnit.TABLESPOON]: 1 / 3,
    },
};

/**
 * Converts cooking measurement units (cups, tbsp, tsp) using direct ratios
 */
export function convertCookingMeasure(value: number, fromUnit: Unit, toUnit: Unit): number {
    if (fromUnit === toUnit) {
        return value;
    }

    const normalizedFromUnit = normalizeUnit(fromUnit);
    const normalizedToUnit = normalizeUnit(toUnit);

    if (normalizedFromUnit === normalizedToUnit) {
        return value;
    }

    const cookingConversions = COOKING_CONVERSIONS[normalizedFromUnit];
    if (cookingConversions && normalizedToUnit in cookingConversions) {
        const ratio = cookingConversions[normalizedToUnit];
        return formatConvertedValue(value * ratio, normalizedToUnit);
    }

    return convertQuantity(value, fromUnit, toUnit);
}

/**
 * Converts a quantity from one unit to another
 */
export function convertQuantity(value: number, fromUnit: Unit, toUnit: Unit): number {
    if (!fromUnit || !toUnit) {
        return value;
    }

    const normalizedFromUnit = normalizeUnit(fromUnit);
    const normalizedToUnit = normalizeUnit(toUnit);

    if (normalizedFromUnit === normalizedToUnit) {
        return value;
    }

    // Handle direct cooking conversions for better precision
    if (isCookingUnit(normalizedFromUnit) && isCookingUnit(normalizedToUnit)) {
        return convertCookingMeasure(value, normalizedFromUnit, normalizedToUnit);
    }

    const fromType = getUnitType(normalizedFromUnit);
    const toType = getUnitType(normalizedToUnit);
    // Cannot convert between different types
    if (fromType !== toType && fromType !== UnitType.CUSTOM && toType !== UnitType.CUSTOM) {
        return value;
    }
    // Convert to base unit first, then to target unit
    const baseQuantity = normalizeToBaseUnit(value, normalizedFromUnit);
    const convertedValue = convertFromBaseUnit(baseQuantity, normalizedToUnit);

    return formatConvertedValue(convertedValue, normalizedToUnit);
}

/**
 * Converts units if below a threshold
 * Used in recipes to make small amounts more readable (e.g., 0.25 cup -> 4 tbsp)
 */
export function convertUnitIfNeeded(amount: number, unit: Unit): { amount: number; unit: Unit } {
    if (!unit) {
        return { amount, unit };
    }

    const normalizedUnit = normalizeUnit(unit);

    const conversionThreshold = CONVERSION_THRESHOLDS.find(
        (conv) =>
            normalizeUnit(conv.fromUnit) === normalizedUnit &&
            amount < conv.threshold &&
            conv.threshold > 0,
    );

    if (conversionThreshold) {
        const converted = amount * conversionThreshold.ratio;

        return {
            amount: formatConvertedValue(converted, conversionThreshold.toUnit),
            unit: conversionThreshold.toUnit,
        };
    }

    return { amount, unit };
}

/**
 * Gets available units for conversion based on the current unit
 */
export function getAvailableUnits(unit: Unit): Unit[] {
    if (!isStandardUnit(unit)) {
        return [unit];
    }

    const unitType = getUnitType(unit);

    if (unitType === UnitType.WEIGHT) {
        return [WeightUnit.GRAM, WeightUnit.OUNCE];
    }

    if (unitType === UnitType.VOLUME) {
        if (isCookingUnit(unit)) {
            return [VolumeUnit.CUP, VolumeUnit.TABLESPOON, VolumeUnit.TEASPOON];
        }
        return [VolumeUnit.MILLILITER, VolumeUnit.FLUID_OUNCE];
    }

    return [unit];
}

/**
 * Gets unit system (METRIC, IMPERIAL, COOKING or CUSTOM)
 */
export function getUnitSystem(unit: Unit): UnitSystem {
    const normalizedUnit = normalizeUnit(unit);
    const metadata = UNIT_METADATA[normalizedUnit as keyof typeof UNIT_METADATA];
    return metadata?.system ?? UnitSystem.CUSTOM;
}

/**
 * Gets unit type (WEIGHT, VOLUME or CUSTOM)
 */
export function getUnitType(unit: Unit): UnitType {
    const normalizedUnit = normalizeUnit(unit);
    const metadata = UNIT_METADATA[normalizedUnit as keyof typeof UNIT_METADATA];
    return metadata?.type ?? UnitType.CUSTOM;
}

/**
 * Checks if unit is a volume/liquid unit
 */
export function isLiquidUnit(unit: Unit): boolean {
    return getUnitType(unit) === UnitType.VOLUME;
}

/**
 * Checks if unit is a standard unit (not custom)
 */
export function isStandardUnit(unit: Unit): boolean {
    const normalizedUnit = normalizeUnit(unit);
    return normalizedUnit in UNIT_METADATA;
}

/**
 * Checks if unit is a weight unit
 */
export function isWeightUnit(unit: Unit): boolean {
    return getUnitType(unit) === UnitType.WEIGHT;
}

/**
 * Normalizes to base units (g for weight, ml for volume)
 */
export function normalizeToBaseUnit(quantity: number, unit: Unit): number {
    if (!isStandardUnit(unit)) {
        return quantity;
    }

    const normalizedUnit = normalizeUnit(unit);
    const conversionFactor = CONVERSION_FACTORS[normalizedUnit as keyof typeof CONVERSION_FACTORS];
    if (!conversionFactor) {
        return quantity;
    }

    return quantity * conversionFactor.toBase;
}

/**
 * Convert from base unit to target unit
 */
function convertFromBaseUnit(baseQuantity: number, targetUnit: Unit): number {
    if (!isStandardUnit(targetUnit)) {
        return baseQuantity;
    }

    const normalizedUnit = normalizeUnit(targetUnit);
    const conversionFactor = CONVERSION_FACTORS[normalizedUnit as keyof typeof CONVERSION_FACTORS];
    if (!conversionFactor) {
        return baseQuantity;
    }

    return baseQuantity * conversionFactor.fromBase;
}

/**
 * Formats the converted value with appropriate precision based on unit type
 */
function formatConvertedValue(value: number, unit: Unit): number {
    const normalizedUnit = normalizeUnit(unit);
    const metadata = UNIT_METADATA[normalizedUnit as keyof typeof UNIT_METADATA];

    if (!metadata) {
        return Number(value.toFixed(1));
    }

    return Number(value.toFixed(metadata.precision));
}

/**
 * Checks if unit is a cooking measurement
 */
function isCookingUnit(unit: Unit): boolean {
    return getUnitSystem(unit) === UnitSystem.COOKING;
}
