<template>
    <v-card class="rounded-lg" elevation="2">
        <v-card-title class="d-flex align-center">
            <v-icon color="primary" class="mr-2">mdi-calendar-week</v-icon>
            <span>Weekly Workout Stats</span>
            <v-spacer></v-spacer>
            <v-chip size="small" color="primary" variant="flat">
                Week {{ getCurrentWeekNumber() }}
            </v-chip>
        </v-card-title>

        <v-card-text>
            <v-fade-transition>
                <div v-if="isLoading" class="py-2">
                    <!-- Skeleton loader -->
                    <div class="mb-4">
                        <div class="d-flex justify-space-between align-center mb-2">
                            <v-skeleton-loader
                                type="text"
                                width="120"
                                class="ma-0 pa-0"
                            ></v-skeleton-loader>
                            <v-skeleton-loader
                                type="text"
                                width="60"
                                class="ma-0 pa-0"
                            ></v-skeleton-loader>
                        </div>
                    </div>

                    <v-row>
                        <v-col cols="6" sm="4" v-for="i in 4" :key="i" class="py-2">
                            <div class="d-flex flex-column align-center">
                                <v-skeleton-loader
                                    type="avatar"
                                    size="36"
                                    class="mb-2"
                                ></v-skeleton-loader>
                                <v-skeleton-loader
                                    type="text"
                                    width="50"
                                    class="ma-0 pa-0 mb-1"
                                ></v-skeleton-loader>
                                <v-skeleton-loader
                                    type="text"
                                    width="70"
                                    class="ma-0 pa-0"
                                ></v-skeleton-loader>
                            </div>
                        </v-col>
                    </v-row>

                    <div class="mt-4">
                        <v-skeleton-loader
                            type="text"
                            width="140"
                            class="ma-0 pa-0 mb-2"
                        ></v-skeleton-loader>
                        <v-skeleton-loader
                            type="button, button, button"
                            class="ma-0 pa-0"
                        ></v-skeleton-loader>
                    </div>
                </div>

                <div v-else-if="error" class="text-center py-4">
                    <v-icon size="large" color="error" class="mb-2">mdi-alert-circle</v-icon>
                    <div class="text-body-1 text-error">{{ error }}</div>
                    <v-btn
                        color="primary"
                        class="mt-3"
                        size="small"
                        prepend-icon="mdi-refresh"
                        variant="tonal"
                        @click="executeAsync"
                    >
                        Retry
                    </v-btn>
                </div>

                <div v-else-if="workoutsThisWeek.length === 0" class="text-center py-4">
                    <v-icon size="x-large" color="grey" class="mb-2">mdi-calendar-blank</v-icon>
                    <div class="text-body-1 text-grey">No workouts this week yet</div>
                    <v-btn
                        color="primary"
                        class="mt-3"
                        size="small"
                        prepend-icon="mdi-plus"
                        variant="tonal"
                        @click="goToWorkoutLogger"
                    >
                        Add Workout
                    </v-btn>
                </div>

                <div v-else>
                    <!-- Weekly progress -->
                    <div class="mb-4">
                        <div class="d-flex justify-space-between align-center mb-1">
                            <span class="text-subtitle-1">Weekly Target</span>
                            <span class="text-h6 font-weight-bold"
                                >{{ workoutsThisWeek.length }} / 5</span
                            >
                        </div>
                        <v-progress-linear
                            :model-value="(workoutsThisWeek.length / 5) * 100"
                            color="primary"
                            height="8"
                            rounded
                            striped
                        >
                            <template #default="{ value }">
                                <span class="text-caption">{{ Math.ceil(value) }}%</span>
                            </template>
                        </v-progress-linear>
                    </div>

                    <!-- Detailed stats -->
                    <v-row>
                        <v-col
                            v-for="(stat, index) in workoutStats"
                            :key="index"
                            cols="6"
                            sm="4"
                            class="py-2"
                        >
                            <v-scale-transition>
                                <div class="d-flex flex-column align-center text-center">
                                    <v-icon :color="stat.color" size="large">{{
                                        stat.icon
                                    }}</v-icon>
                                    <div class="text-h6 font-weight-bold mt-1">
                                        {{ stat.value }}{{ stat.unit }}
                                    </div>
                                    <p class="text-caption">{{ stat.label }}</p>
                                </div>
                            </v-scale-transition>
                        </v-col>
                    </v-row>

                    <!-- Most trained muscles -->
                    <div v-if="topMuscles.length > 0" class="mt-4">
                        <div class="text-subtitle-1 font-weight-medium mb-2">
                            <v-icon class="mr-2" size="small">mdi-arm-flex</v-icon>
                            Most Trained Muscles
                        </div>
                        <v-chip-group>
                            <v-chip
                                v-for="muscle in topMuscles"
                                :key="muscle.id"
                                size="small"
                                color="primary"
                                variant="tonal"
                                class="ma-1"
                            >
                                {{ muscle.name }} ({{ muscle.count }})
                            </v-chip>
                        </v-chip-group>
                    </div>
                </div>
            </v-fade-transition>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import { useAsyncState } from "@vueuse/core";
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useDate } from "vuetify";

import type { WorkoutWithId } from "../../types/workout";

import { ONE_DAY } from "../../helpers/date-utils";
import { getExerciseById, getMuscleById } from "../../helpers/exercise-utils";
import { logger } from "../../logger/app-logger";
import {
    getWorkoutsInDateRange,
    isCardioExercise,
    isStrengthExercise,
} from "../../services/workout";
import { useAuthStore } from "../../stores/auth";
import { useGlobalStore } from "../../stores/global";

const authStore = useAuthStore();
const globalStore = useGlobalStore();
const dateAdapter = useDate();
const router = useRouter();

function fetchWeeklyWorkouts(): Promise<WorkoutWithId[]> {
    const startOfWeek = dateAdapter.startOfWeek(new Date()) as Date;
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = dateAdapter.endOfWeek(new Date()) as Date;
    endOfWeek.setHours(23, 59, 59, 999);

    logger.info(
        `Weekly date range: ${startOfWeek.toISOString()} - ${endOfWeek.toISOString()}`,
        "WeeklyWorkoutStats",
    );

    return getWorkoutsInDateRange(authStore.nonNullableUser.uid, startOfWeek, endOfWeek, {
        orderByDate: "asc",
    });
}

function getCurrentWeekNumber(): number {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff =
        now.getTime() -
        start.getTime() +
        (start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000;
    const oneWeek = ONE_DAY * 7;
    return Math.floor(diff / oneWeek) + 1;
}

const {
    error,
    execute: executeAsync,
    isLoading,
    state: workoutsThisWeek,
} = useAsyncState<WorkoutWithId[]>(fetchWeeklyWorkouts, [], {
    onError(e) {
        globalStore.notifyError("Failed loading weekly workouts");
        logger.error("Failed loading weekly workouts:", "WeeklyWorkoutStats", e);
    },
});

const strengthExercises = computed(() => {
    return workoutsThisWeek.value
        .flatMap((workout) => workout.exerciseEntries)
        .filter(isStrengthExercise);
});

const cardioExercises = computed(() => {
    return workoutsThisWeek.value
        .flatMap((workout) => workout.exerciseEntries)
        .filter(isCardioExercise);
});

const totalVolume = computed(() => {
    let volume = 0;

    for (const entry of strengthExercises.value) {
        if (entry.sets) {
            for (const set of entry.sets) {
                volume += set.weight * set.reps;
            }
        }
    }

    return Math.round(volume);
});

const totalSets = computed(() => {
    let sets = 0;

    for (const entry of strengthExercises.value) {
        sets += entry.sets?.length ?? 0;
    }

    return sets;
});

const totalCaloriesBurned = computed(() => {
    let calories = 0;

    for (const entry of cardioExercises.value) {
        if (entry.calories) {
            calories += entry.calories;
        }
    }

    for (const entry of strengthExercises.value) {
        if (entry.calories) {
            calories += entry.calories;
        } else if (entry.durationSeconds) {
            // Rough estimate: 5 calories per minute of strength training
            calories += (entry.durationSeconds / 60) * 5;
        }
    }

    return Math.round(calories);
});

const totalExercises = computed(() => {
    const exerciseIds = new Set<string>();

    for (const workout of workoutsThisWeek.value) {
        for (const entry of workout.exerciseEntries) {
            exerciseIds.add(entry.exerciseId);
        }
    }

    return exerciseIds.size;
});

const totalDuration = computed(() => {
    let duration = 0;

    for (const workout of workoutsThisWeek.value) {
        if (workout.workoutDurationMinutes) {
            duration += workout.workoutDurationMinutes;
            continue;
        }

        // Otherwise add up durations from individual exercises
        for (const entry of workout.exerciseEntries) {
            if (entry.durationSeconds) {
                duration += entry.durationSeconds / 60;
            }
        }
    }

    return Math.round(duration);
});

const topMuscles = computed(() => {
    const muscleCounts: Record<string, number> = {};

    for (const entry of strengthExercises.value) {
        const exercise = getExerciseById(entry.exerciseId);

        const exerciseWeight = entry.sets?.length ?? 1;

        for (const muscleId of exercise.muscleIds) {
            muscleCounts[muscleId] = (muscleCounts[muscleId] ?? 0) + exerciseWeight;
        }
    }

    return Object.entries(muscleCounts)
        .map(([id, count]) => {
            const muscle = getMuscleById(id);
            return {
                count,
                id,
                name: muscle ? muscle.name : "Unknown",
            };
        })
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);
});

function calculateAverageIntensity(): number {
    let intensitySum = 0;
    let intensityCount = 0;

    for (const entry of cardioExercises.value) {
        if (entry.intensity) {
            switch (entry.intensity) {
                case "high":
                    intensitySum += 100;
                    break;
                case "low":
                    intensitySum += 33;
                    break;
                case "medium":
                    intensitySum += 66;
                    break;
            }
            intensityCount++;
        }
    }

    return intensityCount > 0 ? Math.round(intensitySum / intensityCount) : 0;
}

const workoutStats = computed(() => {
    return [
        {
            color: "indigo",
            icon: "mdi-weight",
            label: "Total Volume",
            unit: "kg",
            value: totalVolume.value,
        },
        {
            color: "blue",
            icon: "mdi-repeat",
            label: "Sets Completed",
            unit: "",
            value: totalSets.value,
        },
        {
            color: "orange",
            icon: "mdi-fire",
            label: "Calories Burned",
            unit: "",
            value: totalCaloriesBurned.value,
        },
        {
            color: "teal",
            icon: "mdi-dumbbell",
            label: "Unique Exercises",
            unit: "",
            value: totalExercises.value,
        },
        {
            color: "purple",
            icon: "mdi-clock-outline",
            label: "Workout Minutes",
            unit: "m",
            value: totalDuration.value,
        },
        {
            color: "red",
            icon: "mdi-speedometer",
            label: "Avg. Intensity",
            unit: "%",
            value: calculateAverageIntensity(),
        },
    ];
});

function goToWorkoutLogger(): void {
    router.push({ name: "WorkoutLogs" });
}
</script>
