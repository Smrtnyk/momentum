import type { Timestamp } from "firebase/firestore";

import type { FoodItem } from "./food";

export interface HealthMetrics {
    bodyFat?: {
        // Measurement method (e.g., "calipers", "bioimpedance")
        method?: null | string;
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
