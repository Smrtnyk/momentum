export interface FoodItem {
    // Alternative serving sizes (from Nutritionix)
    altMeasures?: AlternativeMeasure[] | null;
    // Optional barcode for packaged foods
    barcode: null | string;
    // Brand name if applicable
    brand?: null | string;
    // Nutrition information
    // Calories per serving
    calories: number;
    // Carbs in grams
    carbs: number;
    // Fat in grams
    fat: number;
    // Classification type
    foodType?: FoodType;
    // Full nutrient data (when available)
    fullNutrients?: null | Nutrient[];
    // Database ID or API ID
    id: string;
    // Optional image URL
    imageUrl?: null | string;
    // Food name
    name: string;
    // Protein in grams
    protein: number;
    // Provider name from combined API
    provider?: string;
    // Amount per serving
    servingSize: number;
    // Unit of measurement (g, ml, oz, etc.)
    servingUnit: string;
    // Source API or database
    source?: string;
}

export interface FoodSearchResult {
    currentPage: number;
    foods: FoodItem[];
    totalCount: number;
    totalPages: number;
}

export interface NutritionixFood {
    alt_measures?: AlternativeMeasure[];
    brand_name?: string;
    food_name: string;
    full_nutrients?: Nutrient[];
    ndb_no?: string;
    nf_calories: number;
    nf_protein: number;
    nf_total_carbohydrate: number;
    nf_total_fat: number;
    photo?: {
        highres: string;
        thumb: string;
    };
    serving_qty: number;
    serving_unit: string;
    serving_weight_grams: number;
}

export interface OpenFoodFactsProduct {
    brands?: string;
    code: string;
    id: string;
    image_url?: string;
    nutriments: {
        carbohydrates_100g?: number;
        "energy-kcal_100g"?: number;
        fat_100g?: number;
        proteins_100g?: number;
    };
    popularity_key?: number;
    product_name: string;
    quantity?: string;
    serving_size?: string;
}

export interface OpenFoodRepoProduct {
    brands?: Array<{ name: string }>;
    display_name_translations?: Record<string, string>;
    id: number;
    images?: Array<{
        medium: string;
    }>;
    name: string;
    name_translations?: Record<string, string>;
    nutrients?: Array<{
        name: string;
        per_hundred_grams: number;
    }>;
}

interface AlternativeMeasure {
    measure: string;
    qty: number;
    seq?: null | number;
    serving_weight: number;
}

type FoodType = "ingredient" | "product";

interface Nutrient {
    attr_id: number;
    value: number;
}
