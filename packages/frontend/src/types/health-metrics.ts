import type { Timestamp } from "firebase/firestore";

export interface HealthMetrics {
    bodyFat?: {
        // Measurement method (e.g., "calipers", "bioimpedance")
        method?: string;
        // Body fat percentage
        percentage: number;
        // When measured
        timestamp: Timestamp;
    };
    // Total calories for the day
    calories?: number;
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
