<template>
    <div class="muscle-group-chart">
        <!-- Chart with data -->
        <apexchart
            v-if="muscleData.length > 0"
            type="bar"
            height="300"
            :options="chartOptions"
            :series="series"
        ></apexchart>

        <!-- No data state -->
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

import { computed, ref, watch } from "vue";

import type { Exercise } from "../../../types/exercise";
import type { WorkoutWithId } from "../../../types/workout";

import { isStrengthExercise } from "../../../services/workout";

const { exercisesMap, workoutData } = defineProps<{
    exercisesMap: Record<string, Exercise>;
    workoutData: WorkoutWithId[];
}>();

const muscleData = computed(() => {
    const muscleFrequency: Record<string, number> = {};

    workoutData.forEach(function (workout) {
        workout.exerciseEntries.filter(isStrengthExercise).forEach((entry) => {
            const exercise = exercisesMap[entry.exerciseId];
            if (!exercise) return;

            const volume = calculateExerciseVolume(entry.sets);

            for (const muscle of exercise.primaryMuscles) {
                muscleFrequency[muscle] = (muscleFrequency[muscle] ?? 0) + volume;
            }

            for (const muscle of exercise.secondaryMuscles) {
                muscleFrequency[muscle] = (muscleFrequency[muscle] ?? 0) + volume * 0.5;
            }
        });
    });

    return Object.entries(muscleFrequency)
        .map(([name, count]) => ({
            count: Math.round(count),
            name,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
});

const series = computed(() => {
    return [
        {
            data: muscleData.value.map((muscle) => muscle.count),
            name: "Training Volume",
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

watch([categories, muscleData], updateChart);

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
