<template>
    <div class="muscle-group-chart">
        <apexchart
            v-if="muscleData.length > 0"
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
            icon="mdi-arm-flex"
            text="No muscle group data available for the selected period"
        ></v-alert>
    </div>
</template>

<script setup lang="ts">
import type { ApexOptions } from "apexcharts";

import { computed, ref } from "vue";

import type { WorkoutWithId } from "../../../types/workout";

import { getExerciseById, getMuscleById } from "../../../helpers/exercise-utils";
import { logger } from "../../../logger/app-logger";
import { isStrengthExercise } from "../../../services/workout";

const props = defineProps<{
    workoutData: WorkoutWithId[];
}>();

const muscleData = computed(() => {
    const muscleFrequency: Record<string, number> = {};
    const muscleNames: Record<string, string> = {};

    props.workoutData.forEach(function (workout) {
        workout.exerciseEntries.filter(isStrengthExercise).forEach((entry) => {
            try {
                const exercise = getExerciseById(entry.exerciseId);

                const volume = calculateExerciseVolume(entry.sets);

                for (const muscleId of exercise.muscleIds) {
                    muscleFrequency[muscleId] = (muscleFrequency[muscleId] ?? 0) + volume;
                    muscleNames[muscleId] = getMuscleById(muscleId).name;
                }
            } catch (e) {
                logger.error("Exercise not found:", entry.exerciseId);
            }
        });
    });

    return Object.entries(muscleFrequency)
        .map(([id, count]) => ({
            count,
            id,
            name: muscleNames[id],
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
});

const series = computed(() => {
    return [
        {
            data: muscleData.value.map((muscle) => muscle.count),
            name: "Training Frequency",
        },
    ];
});

const categories = computed(() => {
    return muscleData.value.map((muscle) => muscle.name);
});

const chartOptions = ref<ApexOptions>({
    chart: {
        background: "transparent",
        fontFamily: "inherit",
        foreColor: "#E0E0E0",
        id: "muscle-chart",
        toolbar: {
            show: false,
        },
        type: "bar",
    },
    colors: ["#3F51B5"],
    dataLabels: {
        enabled: true,
        offsetX: 5,
        style: {
            colors: ["#E0E0E0"],
            fontSize: "12px",
        },
    },

    fill: {
        gradient: {
            gradientToColors: ["#7986CB"],
            inverseColors: false,
            opacityFrom: 1,
            opacityTo: 0.8,
            shade: "dark",
            shadeIntensity: 0.2,
            stops: [0, 100],
            type: "horizontal",
        },
        type: "gradient",
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
                show: false,
            },
        },
    },
    legend: {
        show: false,
    },
    plotOptions: {
        bar: {
            borderRadius: 6,
            columnWidth: "70%",
            dataLabels: {
                position: "top",
            },
            distributed: false,
            horizontal: false,
        },
    },
    stroke: {
        width: 0,
    },
    tooltip: {
        theme: "dark",
        y: {
            formatter(value: number) {
                return `${value} volume`;
            },
        },
    },
    xaxis: {
        categories: [],
        labels: {
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
    },
});

function calculateExerciseVolume(sets: Array<{ reps: number; weight: number }>): number {
    return sets.reduce((total, set) => total + set.reps * set.weight, 0);
}

function updateChart(): void {
    chartOptions.value = {
        ...chartOptions.value,
        xaxis: {
            ...chartOptions.value.xaxis,
            categories: categories.value,
        },
    };
}

updateChart();
</script>

<style scoped>
.muscle-group-chart {
    width: 100%;
    height: 300px;
}
</style>
