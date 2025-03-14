export interface FoodItem {
    // Alternative serving sizes (from Nutritionix)
    altMeasures?: AlternativeMeasure[] | null;
    barcode: null | string;
    brand?: null | string;
    calories: number;
    carbs: number;
    fat: number;
    foodType?: FoodType;
    fullNutrients?: null | Nutrient[];
    id: string;
    imageUrl?: null | string;
    name: string;
    protein: number;
    provider?: string;
    servingSize: number;
    servingUnit: string;
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
        carbohydrate_100g?: number;
        carbohydrates?: number;
        carbohydrates_100g?: number;
        energy?: number;

        "energy-kcal"?: number;
        "energy-kcal_100g"?: number;
        energy_100g?: number;
        energy_kcal?: number;
        energy_kcal_100g?: number;

        fat?: number;
        fat_100g?: number;
        fats_100g?: number;
        protein_100g?: number;
        proteins?: number;
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
