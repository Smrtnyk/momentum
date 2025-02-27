import type { Timestamp } from "firebase/firestore";

export interface FavoriteFood extends FoodItem {
    // When it was last used
    lastUsed: Timestamp;
    // How many times it's been used
    useCount: number;
}

export interface FoodItem {
    // Alternative serving sizes (from Nutritionix)
    altMeasures?: {
        measure: string;
        qty: number;
        serving_weight: number;
    }[];
    // Optional barcode for packaged foods
    barcode?: string;
    // Brand name if applicable
    brand?: string;
    // Calories per serving
    calories: number;
    // Carbs in grams
    carbs: number;
    // Fat in grams
    fat: number;
    foodType?: "ingredient" | "product";
    // Full nutrient data (when available)
    fullNutrients?: {
        attr_id: number;
        value: number;
    }[];
    // Database ID or API ID
    id: string;
    // Optional image URL
    imageUrl: null | string;
    // Food name
    name: string;

    // Protein in grams
    protein: number;

    // Provider name from combined API
    provider?: string;

    // Amount consumed
    servingSize: number;

    // Unit of measurement (g, ml, oz, etc.)
    servingUnit: string;

    // Source API or database
    source?: string;
}

export interface HealthMetrics {
    bodyFat?: {
        // Measurement method (e.g., "calipers", "bioimpedance")
        method?: string;
        // Body fat percentage
        percentage: number;
        // When measured
        timestamp: Timestamp;
    };
    // Calories tracking
    calories?: {
        // Breakdown by meal type
        byMeal: {
            breakfast: number;
            dinner: number;
            lunch: number;
            snack: number;
        };
        // In grams
        carbs: number;
        // In grams
        fat: number;
        // Daily calorie goal
        goal: number;
        // In grams
        protein: number;
        // Calories remaining for the day
        remaining: number;
        // Total calories consumed
        total: number;
    };
    // Full timestamp for the day (set to midnight)
    date: Timestamp;
    // YYYY-MM-DD format for easy querying
    dateString: string;
    // Daily step count
    steps?: number;
    // When steps were recorded
    stepsTimestamp?: Timestamp;
    // Total water in ml
    waterIntake: number;
    // Optional detailed log of water intake throughout day
    waterIntakeLog?: {
        // Amount in ml
        amount: number;
        timestamp: Timestamp;
    }[];
    // Weight in kg (optional, user might not log every day)
    weight?: number;
    // When the weight was recorded
    weightTimestamp?: Timestamp;
}

export interface Meal {
    // YYYY-MM-DD format
    dateString: string;
    // Array of food items in this meal
    foods: FoodItem[];
    // Firestore document ID
    id: string;
    // Total macros for the meal
    macros: {
        carbs: number;
        fat: number;
        protein: number;
    };
    mealType: "breakfast" | "dinner" | "lunch" | "snack";
    // When the meal was logged
    timestamp: Timestamp;
    // Sum of calories from all foods
    totalCalories: number;
}
