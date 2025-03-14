<template>
    <div class="exercise-progression-chart">
        <div v-if="!exerciseId" class="text-center py-6">
            <v-icon icon="mdi-dumbbell" size="large" color="grey-lighten-3" class="mb-2"></v-icon>
            <div class="text-body-1 text-medium-emphasis">
                Select an exercise to view progression
            </div>
        </div>

        <template v-else>
            <template v-if="exerciseData.length > 0">
                <!-- Chart Container -->
                <apexchart
                    type="line"
                    height="300"
                    :options="chartOptions"
                    :series="series"
                ></apexchart>

                <!-- Stats Section -->
                <div class="d-flex flex-wrap justify-space-between mt-4">
                    <v-card variant="outlined" class="stat-card">
                        <v-card-text class="d-flex flex-column align-center pa-2">
                            <div class="text-caption text-medium-emphasis">Volume</div>
                            <div class="text-h6 font-weight-bold">
                                {{ formatNumber(totalVolume) }} kg
                            </div>
                            <div
                                v-if="volumeChange !== 0"
                                :class="volumeChange > 0 ? 'text-success' : 'text-error'"
                                class="text-caption"
                            >
                                <v-icon size="x-small">{{
                                    volumeChange > 0 ? "mdi-arrow-up" : "mdi-arrow-down"
                                }}</v-icon>
                                {{ Math.abs(volumeChange) }}% from first
                            </div>
                        </v-card-text>
                    </v-card>

                    <v-card variant="outlined" class="stat-card">
                        <v-card-text class="d-flex flex-column align-center pa-2">
                            <div class="text-caption text-medium-emphasis">One Rep Max</div>
                            <div class="text-h6 font-weight-bold">{{ estimatedOneRepMax }} kg</div>
                            <div
                                v-if="ormChange !== 0"
                                :class="ormChange > 0 ? 'text-success' : 'text-error'"
                                class="text-caption"
                            >
                                <v-icon size="x-small">{{
                                    ormChange > 0 ? "mdi-arrow-up" : "mdi-arrow-down"
                                }}</v-icon>
                                {{ Math.abs(ormChange) }}% from first
                            </div>
                        </v-card-text>
                    </v-card>

                    <v-card variant="outlined" class="stat-card">
                        <v-card-text class="d-flex flex-column align-center pa-2">
                            <div class="text-caption text-medium-emphasis">Avg Weight</div>
                            <div class="text-h6 font-weight-bold">{{ avgWeight }} kg</div>
                        </v-card-text>
                    </v-card>

                    <v-card variant="outlined" class="stat-card">
                        <v-card-text class="d-flex flex-column align-center pa-2">
                            <div class="text-caption text-medium-emphasis">Frequency</div>
                            <div class="text-h6 font-weight-bold">
                                {{ exerciseData.length }} times
                            </div>
                        </v-card-text>
                    </v-card>
                </div>

                <!-- Set History Table -->
                <div class="mt-4">
                    <div class="d-flex align-center">
                        <div class="text-subtitle-1 font-weight-medium">Recent Sets</div>
                        <v-spacer></v-spacer>
                        <v-checkbox
                            v-model="showAllSets"
                            label="Show all sets"
                            density="compact"
                            hide-details
                        ></v-checkbox>
                    </div>

                    <v-table density="compact" class="mt-2">
                        <thead>
                            <tr>
                                <th scope="col">Date</th>
                                <th scope="col">Set</th>
                                <th scope="col">Weight</th>
                                <th scope="col">Reps</th>
                                <th scope="col">Volume</th>
                            </tr>
                        </thead>
                        <tbody>
                            <template v-for="workout in visibleWorkouts" :key="workout.id">
                                <tr
                                    v-for="(set, setIndex) in workout.sets"
                                    :key="`${workout.id}-${setIndex}`"
                                    class="set-row"
                                >
                                    <td>{{ formatRelativeDate(workout.date) }}</td>
                                    <td>{{ setIndex + 1 }}</td>
                                    <td>{{ set.weight }} kg</td>
                                    <td>{{ set.reps }}</td>
                                    <td
                                        :class="
                                            isPersonalRecord(workout.date, set.weight * set.reps)
                                                ? 'font-weight-bold text-primary'
                                                : ''
                                        "
                                    >
                                        {{ set.weight * set.reps }} kg
                                        <v-icon
                                            v-if="
                                                isPersonalRecord(
                                                    workout.date,
                                                    set.weight * set.reps,
                                                )
                                            "
                                            icon="mdi-trophy"
                                            size="x-small"
                                            color="amber"
                                            class="ml-1"
                                        ></v-icon>
                                    </td>
                                </tr>
                            </template>
                        </tbody>
                    </v-table>
                </div>
            </template>

            <v-alert v-else type="info" variant="tonal" class="my-4">
                No data available for this exercise in the selected period
            </v-alert>
        </template>
    </div>
</template>

<script setup lang="ts">
import type { ApexOptions } from "apexcharts";

import { computed, ref, watch } from "vue";

import type { WorkoutWithId } from "../../../types/workout";

import { formatRelativeDate } from "../../../helpers/date-utils";
import { getExerciseById } from "../../../helpers/exercise-utils";
import { isStrengthExercise } from "../../../services/workout";

const props = defineProps<{
    exerciseId: string;
    workoutData: WorkoutWithId[];
}>();

const showAllSets = ref(false);

const exerciseData = computed(() => {
    if (!props.exerciseId) {
        return [];
    }

    const data = [];

    for (const workout of props.workoutData) {
        const exercises = workout.exerciseEntries.filter(isStrengthExercise);
        for (const entry of exercises) {
            if (entry.exerciseId !== props.exerciseId) continue;

            const totalVolume = entry.sets.reduce((sum, set) => sum + set.weight * set.reps, 0);
            const maxWeight = Math.max(...entry.sets.map((set) => set.weight));
            const maxReps = Math.max(...entry.sets.map((set) => set.reps));
            const maxSetVolume = Math.max(...entry.sets.map((set) => set.weight * set.reps));

            const estimatedOneRepMax = entry.sets
                .map((set) => calculateOneRepMax(set.weight, set.reps))
                .reduce((max, current) => Math.max(max, current), 0);

            data.push({
                avgWeight: entry.sets.reduce((sum, set) => sum + set.weight, 0) / entry.sets.length,
                date: workout.date.toDate(),
                estimatedOneRepMax,
                id: workout.id,
                maxReps,
                maxSetVolume,
                maxWeight,
                sets: entry.sets,
                totalVolume,
                workoutName: workout.name,
            });
        }
    }

    return data.sort((a, b) => a.date.getTime() - b.date.getTime());
});

const totalVolume = computed(() => {
    const latestData = exerciseData.value[exerciseData.value.length - 1];
    return latestData ? latestData.totalVolume : 0;
});

const estimatedOneRepMax = computed(() => {
    const latestData = exerciseData.value[exerciseData.value.length - 1];
    return latestData ? Math.round(latestData.estimatedOneRepMax) : 0;
});

const avgWeight = computed(() => {
    const latestData = exerciseData.value[exerciseData.value.length - 1];
    return latestData ? Math.round(latestData.avgWeight) : 0;
});

const volumeChange = computed(() => {
    if (exerciseData.value.length < 2) return 0;

    const firstVolume = exerciseData.value[0].totalVolume;
    const latestVolume = exerciseData.value[exerciseData.value.length - 1].totalVolume;

    if (firstVolume === 0) return 0;
    return Math.round(((latestVolume - firstVolume) / firstVolume) * 100);
});

const ormChange = computed(() => {
    if (exerciseData.value.length < 2) return 0;

    const firstORM = exerciseData.value[0].estimatedOneRepMax;
    const latestORM = exerciseData.value[exerciseData.value.length - 1].estimatedOneRepMax;

    if (firstORM === 0) return 0;
    return Math.round(((latestORM - firstORM) / firstORM) * 100);
});

const visibleWorkouts = computed(() => {
    if (showAllSets.value) {
        return exerciseData.value;
    }
    return exerciseData.value.slice(-3);
});

function formatNumber(value: number): string {
    return value.toLocaleString();
}

function isPersonalRecord(date: Date, volume: number): boolean {
    const index = exerciseData.value.findIndex((w) => w.date.getTime() === date.getTime());
    if (index === -1) return false;

    const maxVolumeBefore = Math.max(
        ...exerciseData.value.slice(0, index).map((w) => w.maxSetVolume),
        0,
    );

    return volume > maxVolumeBefore;
}

const series = computed(() => {
    if (exerciseData.value.length === 0) return [];

    return [
        {
            data: exerciseData.value.map((d) => ({
                x: d.date.getTime(),
                y: d.totalVolume,
            })),
            name: "Volume",
            type: "column",
        },
        {
            data: exerciseData.value.map((d) => ({
                x: d.date.getTime(),
                y: d.estimatedOneRepMax,
            })),
            name: "Est. 1RM",
            type: "line",
        },
    ];
});

const chartOptions = ref<ApexOptions>({
    annotations: {
        points: [],
    },
    chart: {
        background: "transparent",
        fontFamily: "inherit",
        foreColor: "#E0E0E0",
        id: "exercise-progression",
        stacked: false,
        toolbar: {
            show: false,
        },
        type: "line",
        zoom: {
            enabled: false,
        },
    },
    colors: ["#00BCD4", "#FF4081"],
    dataLabels: {
        enabled: false,
    },
    fill: {
        gradient: {
            opacityFrom: 0.7,
            opacityTo: 0.2,
            shade: "dark",
            shadeIntensity: 0.5,
            stops: [0, 100],
            type: "vertical",
        },
        opacity: [0.8, 0.4],
        type: ["solid", "gradient"],
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
        horizontalAlign: "right",
        labels: {
            colors: "#E0E0E0",
        },
        position: "top",
    },
    plotOptions: {
        bar: {
            borderRadius: 3,
            columnWidth: "60%",
        },
    },
    stroke: {
        curve: "smooth",
        width: [0, 3],
    },
    title: {},
    tooltip: {
        intersect: false,
        shared: true,
        theme: "dark",
        x: {
            format: "MMM dd, yyyy",
        },
        y: [
            {
                formatter(value: number) {
                    return `${value.toLocaleString()} kg`;
                },
            },
            {
                formatter(value: number) {
                    return `${value.toFixed(1)} kg`;
                },
            },
        ],
    },
    xaxis: {
        labels: {
            format: "MMM dd",
            style: {
                colors: "#E0E0E0",
            },
        },
        tooltip: {
            enabled: false,
        },
        type: "datetime",
    },
    yaxis: [
        {
            labels: {
                formatter(value: number) {
                    return value.toLocaleString();
                },
                style: {
                    colors: "#E0E0E0",
                },
            },
            title: {
                style: {
                    color: "#00BCD4",
                },
                text: "Volume (kg)",
            },
        },
        {
            labels: {
                formatter(value: number) {
                    return value.toFixed(0);
                },
                style: {
                    colors: "#E0E0E0",
                },
            },
            opposite: true,
            title: {
                style: {
                    color: "#FF4081",
                },
                text: "Estimated 1RM (kg)",
            },
        },
    ],
});

watch([() => props.exerciseId, () => props.workoutData], () => {
    if (exerciseData.value.length === 0) return;

    let exerciseName = "Exercise";
    if (props.exerciseId) {
        exerciseName = getExerciseById(props.exerciseId).name;
    }

    const prs = [];
    let maxVolume = 0;

    for (const workout of exerciseData.value) {
        if (workout.maxSetVolume > maxVolume) {
            maxVolume = workout.maxSetVolume;
            prs.push({
                label: {
                    borderColor: "#FFC107",
                    style: {
                        background: "#FFC107",
                        color: "#fff",
                    },
                    text: "PR",
                },
                marker: {
                    fillColor: "#FFC107",
                    radius: 5,
                    size: 7,
                    strokeColor: "#FFC107",
                },
                x: workout.date.getTime(),
                y: workout.totalVolume,
            });
        }
    }

    chartOptions.value = {
        ...chartOptions.value,
        annotations: {
            points: prs,
        },
        chart: {
            ...chartOptions.value.chart,
            id: `exercise-${props.exerciseId}`,
        },
        title: {
            align: "left",
            style: {
                color: "#E0E0E0",
                fontSize: "16px",
            },
            text: `${exerciseName} Progression`,
        },
    };
});

function calculateOneRepMax(weight: number, reps: number): number {
    if (reps <= 0) return 0;
    // Already a 1RM
    if (reps === 1) return weight;
    // Arbitrarily cap at 2x weight for very high reps
    if (reps >= 36) return weight * 2;

    // Choose formula based on rep range for better accuracy:
    if (reps <= 10) {
        // Brzycki formula - more accurate for lower rep ranges
        return weight * (36 / (37 - reps));
    } else if (reps <= 20) {
        // Epley formula - better for moderate rep ranges
        return weight * (1 + 0.0333 * reps);
    }
    // Lander formula - alternative for higher rep ranges
    return (weight * 100) / (101.3 - 2.671_23 * reps);
}
</script>

<style scoped>
.exercise-progression-chart {
    width: 100%;
}

.stat-card {
    flex: 1;
    min-width: 120px;
    margin-bottom: 8px;
    background-color: #27293d;
    border-radius: 8px;
    transition: all 0.2s ease;
}

.stat-card:hover {
    background-color: #2d2f44;
}

.text-success {
    color: #4caf50 !important;
}

.text-error {
    color: #f44336 !important;
}

.text-primary {
    color: #00bcd4 !important;
}

.set-row:nth-child(even) {
    background-color: rgba(0, 0, 0, 0.12);
}

@media (max-width: 600px) {
    .stat-card {
        width: calc(50% - 8px);
    }
}
</style>
