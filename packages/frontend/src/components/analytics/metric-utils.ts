import type { HealthMetrics } from "../../types/health-metrics";

import { ONE_DAY, timestampToDate } from "../../helpers/date-utils";

export function calculateAverage<T>(
    items: T[],
    valueAccessor: (item: T) => number,
    filterFn?: (item: T) => boolean,
): number {
    const filteredItems = filterFn ? items.filter(filterFn) : items;
    if (filteredItems.length === 0) return 0;

    const total = filteredItems.reduce((sum, item) => sum + valueAccessor(item), 0);
    return Math.round(total / filteredItems.length);
}

export function calculateMovingAverage<T>(
    data: T[],
    valueAccessor: (item: T) => number,
    windowSize = 3,
): Array<{ x: number; y: number }> {
    if (data.length < 2) return [];

    const result: Array<{ x: number; y: number }> = [];
    function getX(item: T): number {
        return (item as any).date?.getTime?.() ?? 0;
    }

    for (let i = 0; i < data.length; i++) {
        let sum = 0;
        let count = 0;

        for (let j = Math.max(0, i - windowSize + 1); j <= i; j++) {
            sum += valueAccessor(data[j]);
            count++;
        }

        result.push({
            x: getX(data[i]),
            y: Math.round(sum / count),
        });
    }

    return result;
}

export function calculateTrendLine<T>(
    data: T[],
    valueAccessor: (item: T) => number,
    timeAccessor: (item: T) => number,
): Array<{ meta?: number; x: number; y: number }> {
    if (data.length < 2) return [];

    const n = data.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumX2 = 0;

    // Use reference time to avoid numerical issues
    const referenceTime = timeAccessor(data[0]);

    for (let i = 0; i < n; i++) {
        const x = (timeAccessor(data[i]) - referenceTime) / ONE_DAY;
        const y = valueAccessor(data[i]);

        sumX += x;
        sumY += y;
        sumXY += x * y;
        sumX2 += x * x;
    }

    // Avoid division by zero
    if (sumX2 === (sumX * sumX) / n) return [];

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    const weeklyRate = slope * 7;

    // Calculate y values for first and last points
    const firstX = 0;
    const lastX = (timeAccessor(data[n - 1]) - referenceTime) / ONE_DAY;
    const firstY = intercept + slope * firstX;
    const lastY = intercept + slope * lastX;

    return [
        {
            meta: weeklyRate,
            x: timeAccessor(data[0]),
            y: firstY,
        },
        {
            meta: weeklyRate,
            x: timeAccessor(data[n - 1]),
            y: lastY,
        },
    ];
}

export function filterHealthMetricsBy(
    metrics: HealthMetrics[],
    metricType: "bodyFat" | "calories" | "steps" | "waterIntake" | "weight",
    sortDirection: "asc" | "desc" = "asc",
): HealthMetrics[] {
    const filteredMetrics = metrics.filter(function (metric) {
        switch (metricType) {
            case "bodyFat":
                return metric.bodyFat !== undefined;
            case "calories":
                return metric.calories?.total !== undefined && metric.calories.total > 0;
            case "steps":
                return metric.steps !== undefined && metric.steps > 0;
            case "waterIntake":
                return metric.waterIntake > 0;
            case "weight":
                return metric.weight !== undefined;
            default:
                return false;
        }
    });

    return filteredMetrics.sort((a, b) => {
        const timeA = timestampToDate(a.date).getTime();
        const timeB = timestampToDate(b.date).getTime();
        return sortDirection === "asc" ? timeA - timeB : timeB - timeA;
    });
}

export function getFirstLastAndChange<T>(
    items: T[],
    valueAccessor: (item: T) => number,
): { change: number; first: null | number; last: null | number } {
    if (items.length === 0) return { change: 0, first: null, last: null };

    const first = valueAccessor(items[0]);
    const last = valueAccessor(items[items.length - 1]);
    const change = first && last ? Number((last - first).toFixed(1)) : 0;

    return { change, first, last };
}

export function getMaxValue<T>(items: T[], valueAccessor: (item: T) => number): number {
    if (items.length === 0) return 0;
    return Math.max(...items.map(valueAccessor));
}

export function getMinValue<T>(items: T[], valueAccessor: (item: T) => number): number {
    if (items.length === 0) return 0;
    return Math.min(...items.map(valueAccessor));
}
