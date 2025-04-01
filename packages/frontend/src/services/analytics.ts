import { collection, getDocs, query, where } from "firebase/firestore";

import type { AnalyticsData, DateRangeOption } from "../types/analytics";
import type { HealthMetrics } from "../types/health-metrics";

import { firestore } from "../firebase";
import { dateToIsoString, getDateRangeFromOption } from "../helpers/date-utils";
import { logger } from "../logger/app-logger";
import { getWorkoutsInDateRange } from "./workout";

/**
 * Calculates nutrition metrics for analytics
 */
export function calculateNutritionMetrics(healthMetrics: HealthMetrics[]): {
    avgCalories: number;
    avgCarbs: number;
    avgFat: number;
    avgProtein: number;
} {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let daysWithNutrition = 0;

    for (const day of healthMetrics) {
        if (day.calories) {
            daysWithNutrition++;
            totalCalories += day.calories.total ?? 0;
            totalProtein += day.calories.protein ?? 0;
            totalCarbs += day.calories.carbs ?? 0;
            totalFat += day.calories.fat ?? 0;
        }
    }

    return {
        avgCalories: daysWithNutrition > 0 ? Math.round(totalCalories / daysWithNutrition) : 0,
        avgCarbs: daysWithNutrition > 0 ? Math.round(totalCarbs / daysWithNutrition) : 0,
        avgFat: daysWithNutrition > 0 ? Math.round(totalFat / daysWithNutrition) : 0,
        avgProtein: daysWithNutrition > 0 ? Math.round(totalProtein / daysWithNutrition) : 0,
    };
}

export async function getAnalyticsData(
    userId: string,
    dateRangeOption: DateRangeOption,
): Promise<AnalyticsData> {
    try {
        const { endDate, startDate } = getDateRangeFromOption(dateRangeOption);

        const startDateISOString = dateToIsoString(startDate);
        const endDateISOString = dateToIsoString(endDate);

        const [workouts, healthMetrics] = await Promise.all([
            getWorkoutsInDateRange(userId, startDate, endDate),
            getHealthMetricsInDateRange(userId, startDateISOString, endDateISOString),
        ]);

        return {
            bodyMetrics: healthMetrics,
            nutrition: healthMetrics,
            workouts,
        };
    } catch (error) {
        logger.error(error, "AnalyticsService", { dateRangeOption, userId });
        throw new Error(`Failed to fetch analytics data: ${error}`);
    }
}

async function getHealthMetricsInDateRange(
    userId: string,
    startDateString: string,
    endDateString: string,
): Promise<HealthMetrics[]> {
    try {
        const metricsRef = collection(firestore, "users", userId, "health_metrics");
        const queryVal = query(
            metricsRef,
            where("dateString", ">=", startDateString),
            where("dateString", "<=", endDateString),
        );

        const querySnapshot = await getDocs(queryVal);

        return querySnapshot.docs.map((doc) => doc.data() as HealthMetrics);
    } catch (error) {
        logger.error(error, "AnalyticsService", { endDateString, startDateString, userId });
        throw new Error(`Failed to fetch health metrics: ${error}`);
    }
}
