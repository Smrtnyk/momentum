import type { StrengthExerciseEntry } from "../types/workout";

export interface ExerciseComparison {
    maxWeight: ComparisonMetric;
    previousDate?: Date | undefined;
    setsCount: ComparisonMetric;
    totalVolume: ComparisonMetric;
}

interface ComparisonMetric {
    current: number;
    isImprovement: boolean;
    percentChange: number;
    previous: number;
}

const IMPROVEMENT_THRESHOLD = 0.01;

export function calculateExerciseComparison(
    currentExercise: StrengthExerciseEntry,
    previousExercise: StrengthExerciseEntry,
    previousDate?: Date,
): ExerciseComparison | null {
    if (!currentExercise.sets?.length || !previousExercise.sets?.length) {
        return null;
    }

    const currentSets = currentExercise.sets;
    const currentTotalSets = currentSets.length;
    const currentMaxWeight = Math.max(...currentSets.map((set) => set.weight ?? 0));
    const currentTotalVolume = currentSets.reduce(
        (sum, set) => sum + set.reps * (set.weight ?? 0),
        0,
    );

    const previousSets = previousExercise.sets;
    const previousTotalSets = previousSets.length;
    const previousMaxWeight = Math.max(...previousSets.map((set) => set.weight ?? 0));
    const previousTotalVolume = previousSets.reduce(
        (sum, set) => sum + set.reps * (set.weight ?? 0),
        0,
    );

    const volumePercentChange = calculatePercentChange(previousTotalVolume, currentTotalVolume);
    const maxWeightPercentChange = calculatePercentChange(previousMaxWeight, currentMaxWeight);
    const setsPercentChange = calculatePercentChange(previousTotalSets, currentTotalSets);

    return {
        maxWeight: {
            current: currentMaxWeight,
            isImprovement: maxWeightPercentChange > IMPROVEMENT_THRESHOLD,
            percentChange: maxWeightPercentChange,
            previous: previousMaxWeight,
        },
        previousDate,
        setsCount: {
            current: currentTotalSets,
            isImprovement: setsPercentChange > IMPROVEMENT_THRESHOLD,
            percentChange: setsPercentChange,
            previous: previousTotalSets,
        },
        totalVolume: {
            current: currentTotalVolume,
            isImprovement: volumePercentChange > IMPROVEMENT_THRESHOLD,
            percentChange: volumePercentChange,
            previous: previousTotalVolume,
        },
    };
}

export function formatPercentChange(value: number): string {
    if (Math.abs(value) < 0.1) return "0%";
    const formatted = Math.abs(value).toFixed(1);
    return value > 0 ? `+${formatted}%` : `-${formatted}%`;
}

function calculatePercentChange(previous: number, current: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
}
