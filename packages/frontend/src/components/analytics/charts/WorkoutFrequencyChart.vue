<template>
    <div class="workout-frequency-chart">
        <apexchart
            v-if="hasData"
            type="bar"
            height="300"
            :options="chartOptions"
            :series="series"
        ></apexchart>

        <v-alert
            v-else
            type="info"
            variant="tonal"
            class="mt-2"
            icon="mdi-dumbbell"
            text="No workout data available for the selected period"
        ></v-alert>

        <div v-if="hasData" class="d-flex justify-center flex-wrap text-center mt-4">
            <div class="workout-stat mx-3">
                <div class="text-h5 font-weight-bold">{{ workoutStats.strengthCount }}</div>
                <div class="text-caption text-medium-emphasis">Strength Exercises</div>
            </div>
            <div class="workout-stat mx-3">
                <div class="text-h5 font-weight-bold">{{ workoutStats.cardioCount }}</div>
                <div class="text-caption text-medium-emphasis">Cardio Activities</div>
            </div>
            <div class="workout-stat mx-3">
                <div class="text-h5 font-weight-bold">{{ workoutStats.totalWorkouts }}</div>
                <div class="text-caption text-medium-emphasis">Total Workouts</div>
            </div>
            <div class="workout-stat mx-3">
                <div class="text-h5 font-weight-bold">
                    {{ workoutStats.avgDuration }}<span class="text-body-2">min</span>
                </div>
                <div class="text-caption text-medium-emphasis">Avg Duration</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";

import type { WorkoutWithId } from "../../../types/workout";

import {
    formatFullDate,
    formatISODate,
    formatShortDate,
    getWeekStart,
    timestampToDate,
} from "../../../helpers/date-utils";
import { isCardioExercise, isStrengthExercise } from "../../../services/workout";

interface WorkoutWeekData {
    cardioWorkouts: number;
    mixedWorkouts: number;
    strengthWorkouts: number;
    weekStart: string;
}

const props = defineProps<{
    workoutData: WorkoutWithId[];
}>();

const hasData = computed(() => props.workoutData.length > 0);

const processedData = computed((): WorkoutWeekData[] => {
    const workoutsByWeek = new Map<string, { cardio: number; mixed: number; strength: number }>();

    props.workoutData.forEach(function (workout) {
        const date = timestampToDate(workout.date);
        const weekStart = getWeekStart(date);
        const weekKey = formatISODate(weekStart);

        if (!workoutsByWeek.has(weekKey)) {
            workoutsByWeek.set(weekKey, { cardio: 0, mixed: 0, strength: 0 });
        }

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- we just set it above
        const weekData = workoutsByWeek.get(weekKey)!;

        const hasStrength = workout.exerciseEntries.some(isStrengthExercise);
        const hasCardio = workout.exerciseEntries.some(isCardioExercise);

        if (hasStrength && hasCardio) {
            weekData.mixed++;
        } else if (hasStrength) {
            weekData.strength++;
        } else if (hasCardio) {
            weekData.cardio++;
        } else {
            weekData.mixed++;
        }
    });

    return Array.from(workoutsByWeek.entries())
        .map(([weekStart, counts]) => ({
            cardioWorkouts: counts.cardio,
            mixedWorkouts: counts.mixed,
            strengthWorkouts: counts.strength,
            weekStart,
        }))
        .sort((a, b) => {
            const dateA = new Date(a.weekStart);
            const dateB = new Date(b.weekStart);
            return dateA.getTime() - dateB.getTime();
        });
});

const series = computed(() => {
    return [
        {
            data: processedData.value.map((week) => week.strengthWorkouts),
            name: "Strength",
        },
        {
            data: processedData.value.map((week) => week.cardioWorkouts),
            name: "Cardio",
        },
        {
            data: processedData.value.map((week) => week.mixedWorkouts),
            name: "Mixed",
        },
    ];
});

const categories = computed(() => {
    return processedData.value.map((week) => week.weekStart);
});

const chartOptions = ref({
    chart: {
        background: "transparent",
        fontFamily: "inherit",
        foreColor: "#E0E0E0",
        id: "workout-frequency-chart",
        stacked: true,
        toolbar: {
            show: false,
        },
        type: "bar",
    },
    colors: ["#5C6BC0", "#26A69A", "#FFA726"],
    dataLabels: {
        enabled: false,
    },
    fill: {
        opacity: 1,
    },
    grid: {
        borderColor: "#383853",
        strokeDashArray: 4,
        xaxis: {
            lines: {
                show: true,
            },
        },
        yaxis: {
            lines: {
                show: true,
            },
        },
    },
    legend: {
        horizontalAlign: "center",
        labels: {
            colors: "#E0E0E0",
        },
        position: "top",
    },
    plotOptions: {
        bar: {
            borderRadius: 4,
            columnWidth: "70%",
            dataLabels: {
                total: {
                    enabled: true,
                    style: {
                        color: "#E0E0E0",
                        fontSize: "12px",
                        fontWeight: 600,
                    },
                },
            },
            horizontal: false,
        },
    },
    stroke: {
        colors: ["#1E1E2F"],
        width: 1,
    },
    tooltip: {
        intersect: false,
        shared: true,
        theme: "dark",
        x: {
            formatter(value: string) {
                return `Week of ${formatFullDate(new Date(value))}`;
            },
        },
        y: {
            formatter(value: number) {
                return value + (value === 1 ? " workout" : " workouts");
            },
        },
    },
    xaxis: {
        axisBorder: {
            color: "#383853",
        },
        axisTicks: {
            color: "#383853",
        },
        categories: [] as string[],
        labels: {
            formatter(value: string) {
                return formatWeekLabel(value);
            },
            style: {
                colors: "#E0E0E0",
            },
        },
    },
    yaxis: {
        labels: {
            style: {
                colors: "#E0E0E0",
            },
        },
        title: {
            style: {
                color: "#E0E0E0",
            },
            text: "Workouts",
        },
    },
});

const workoutStats = computed(() => {
    let strengthCount = 0;
    let cardioCount = 0;
    let totalDuration = 0;

    props.workoutData.forEach(function (workout) {
        workout.exerciseEntries.forEach(function (entry) {
            if (isStrengthExercise(entry)) strengthCount++;
            if (isCardioExercise(entry)) cardioCount++;
        });

        if (workout.workoutDurationMinutes) {
            totalDuration += workout.workoutDurationMinutes;
        }
    });

    const avgDuration =
        props.workoutData.length > 0 ? Math.round(totalDuration / props.workoutData.length) : 0;

    return {
        avgDuration,
        cardioCount,
        strengthCount,
        totalWorkouts: props.workoutData.length,
    };
});

function formatWeekLabel(dateStr: string): string {
    const date = new Date(dateStr);
    return formatShortDate(date);
}

watch(
    () => props.workoutData,
    () => {
        chartOptions.value = {
            ...chartOptions.value,
            xaxis: {
                ...chartOptions.value.xaxis,
                categories: categories.value,
            },
        };
    },
);

watch(
    categories,
    () => {
        chartOptions.value = {
            ...chartOptions.value,
            xaxis: {
                ...chartOptions.value.xaxis,
                categories: categories.value,
            },
        };
    },
    { immediate: true },
);
</script>

<style scoped>
.workout-frequency-chart {
    width: 100%;
}

.workout-stat {
    min-width: 80px;
    transition: all 0.2s ease;
    padding: 8px 16px;
    border-radius: 8px;
}

.workout-stat:hover {
    background-color: rgba(255, 255, 255, 0.05);
}
</style>
