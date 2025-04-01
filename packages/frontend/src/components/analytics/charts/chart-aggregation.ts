import { getDaysBetween } from "../../../helpers/date-utils";

const AGGREGATION_THRESHOLD_DAYS = 30;
const WEEKLY_AGGREGATION_DAYS = 7;
const MONTHLY_AGGREGATION_DAYS = 30;

export type AggregationMode = "daily" | "monthly" | "weekly";

type AggregatedDataPoint = {
    avgGoal: number;
    avgTotal: number;
    endDate: Date;
    maxTotal: number;
    minTotal: number;
    startDate: Date;
};

type CalorieDataPoint = {
    date: Date;
    dateString: string;
    goal: number;
    total: number;
};

export function aggregateTimeSeriesData(
    data: CalorieDataPoint[],
    mode: AggregationMode,
): AggregatedDataPoint[] {
    if (mode === "daily" || data.length === 0) {
        return data.map((point) => ({
            avgGoal: point.goal,
            avgTotal: point.total,
            endDate: point.date,
            maxTotal: point.total,
            minTotal: point.total,
            startDate: point.date,
        }));
    }

    const sortedData = [...data].sort((a, b) => a.date.getTime() - b.date.getTime());
    const result: AggregatedDataPoint[] = [];

    const intervalDays = mode === "weekly" ? WEEKLY_AGGREGATION_DAYS : MONTHLY_AGGREGATION_DAYS;
    let currentGroup: CalorieDataPoint[] = [];
    let currentStartDate = new Date(sortedData[0].date);
    let currentEndDate = new Date(currentStartDate);
    currentEndDate.setDate(currentEndDate.getDate() + intervalDays - 1);

    for (const point of sortedData) {
        if (point.date.getTime() <= currentEndDate.getTime()) {
            currentGroup.push(point);
        } else {
            if (currentGroup.length > 0) {
                result.push(createAggregatedPoint(currentGroup));
            }

            currentGroup = [point];
            currentStartDate = new Date(point.date);
            currentEndDate = new Date(currentStartDate);
            currentEndDate.setDate(currentEndDate.getDate() + intervalDays - 1);
        }
    }

    if (currentGroup.length > 0) {
        result.push(createAggregatedPoint(currentGroup));
    }

    return result;
}

export function determineAggregationMode(startDate: Date, endDate: Date): AggregationMode {
    const daysDiff = getDaysBetween(startDate, endDate);

    if (daysDiff <= AGGREGATION_THRESHOLD_DAYS) {
        return "daily";
    } else if (daysDiff <= 90) {
        return "weekly";
    }
    return "monthly";
}

function createAggregatedPoint(group: CalorieDataPoint[]): AggregatedDataPoint {
    const totalSum = group.reduce((sum, point) => sum + point.total, 0);
    const goalSum = group.reduce((sum, point) => sum + point.goal, 0);
    const totals = group.map((point) => point.total);

    return {
        avgGoal: Math.round(goalSum / group.length),
        avgTotal: Math.round(totalSum / group.length),
        endDate: new Date(group[group.length - 1].date),
        maxTotal: Math.max(...totals),
        minTotal: Math.min(...totals),
        startDate: new Date(group[0].date),
    };
}
