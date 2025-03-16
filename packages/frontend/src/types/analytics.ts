import type { HealthMetrics } from "./health-metrics";
import type { WorkoutWithId } from "./workout";

export interface AnalyticsData {
    bodyMetrics: HealthMetrics[];
    nutrition: HealthMetrics[];
    workouts: WorkoutWithId[];
}

export interface DateRange {
    endDate: Date;
    startDate: Date;
}

export type DateRangeOption =
    | "allTime"
    | "last6Months"
    | "last7Days"
    | "last30Days"
    | "last90Days"
    | "lastYear";
