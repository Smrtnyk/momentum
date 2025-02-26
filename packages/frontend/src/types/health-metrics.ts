import type { Timestamp } from "firebase/firestore";

export interface HealthMetrics {
    // Total calories for the day
    calories?: number;
    // Full timestamp for the day (set to midnight)
    date: Timestamp;
    // YYYY-MM-DD format for easy querying
    dateString: string;
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
