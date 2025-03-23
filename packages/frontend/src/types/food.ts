import type { Timestamp } from "firebase/firestore";

export interface CustomFood extends FoodItem {
    createdAt: Timestamp;
    isCustom: true;
    updatedAt: Timestamp;
    userId: string;
}

export interface FoodItem {
    aiMetadata?: AIFoodMetadata;
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
    barcode?: string | string[];
    brands?: { name: string }[];
    country?: string;
    display_name_translations?: Record<string, string>;
    id: number;
    images?: {
        categories?: string[];
        large?: string;
        medium: string;
        thumb?: string;
        xlarge?: string;
    }[];
    name?: string;
    name_translations?: Record<string, string>;
    nutrients?:
        | {
              [key: string]:
                  | undefined
                  | {
                        name_translations?: Record<string, string>;
                        per_hundred: number;
                        per_portion: null | number;
                        unit?: string;
                    };
              carbohydrates?: {
                  name_translations?: Record<string, string>;
                  per_hundred: number;
                  per_portion: null | number;
                  unit?: string;
              };
              energy?: {
                  name_translations?: Record<string, string>;
                  per_hundred: number;
                  per_portion: null | number;
                  unit?: string;
              };
              energy_calories_kcal?: {
                  name_translations?: Record<string, string>;
                  per_hundred: number;
                  per_portion: null | number;
                  unit?: string;
              };
              fat?: {
                  name_translations?: Record<string, string>;
                  per_hundred: number;
                  per_portion: null | number;
                  unit?: string;
              };
              protein?: {
                  name_translations?: Record<string, string>;
                  per_hundred: number;
                  per_portion: null | number;
                  unit?: string;
              };
              proteins?: {
                  name_translations?: Record<string, string>;
                  per_hundred: number;
                  per_portion: null | number;
                  unit?: string;
              };
          }
        | {
              name: string;
              per_hundred_grams: number;
          }[];
}

interface AIFoodMetadata {
    confidence?: number | undefined;
    fitnessInfo?:
        | undefined
        | {
              dietCompatibility: {
                  keto: boolean;
                  lowCarb: boolean;
                  paleo: boolean;
                  vegan: boolean;
              };
              glycemicImpact: string;
              workoutSuitability: {
                  postWorkout: number;
                  preWorkout: number;
              };
          };
    nutriScore?:
        | undefined
        | {
              grade: "A" | "B" | "C" | "D" | "E";
              score: number;
          };
}

type FoodType = "ingredient" | "product";

interface Nutrient {
    attr_id: number;
    value: number;
}
