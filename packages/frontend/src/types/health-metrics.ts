import type { Timestamp } from "firebase/firestore";

import type { FoodItem } from "./food";

export interface HealthMetrics {
    bodyFat?: {
        method?: null | string;
        percentage: number;
        timestamp: Timestamp;
    };
    calories?: {
        byMeal: {
            breakfast: number;
            dinner: number;
            lunch: number;
            snack: number;
        };
        carbs: number;
        fat: number;
        goal: number;
        protein: number;
        remaining: number;
        total: number;
    };
    date: Timestamp;
    dateString: string;
    steps?: number;
    stepsTimestamp?: Timestamp;
    waterIntake: number;
    waterIntakeLog?: WaterLogEntry[];
    weight?: number;
    weightTimestamp?: Timestamp;
}

export interface Meal {
    dateString: string;
    foods: FoodItem[];
    id: string;
    macros: {
        carbs: number;
        fat: number;
        protein: number;
    };
    mealType: "breakfast" | "dinner" | "lunch" | "snack";
    timestamp: Timestamp;
    totalCalories: number;
}

export interface WaterLogEntry {
    amount: number;
    timestamp: Timestamp;
}
