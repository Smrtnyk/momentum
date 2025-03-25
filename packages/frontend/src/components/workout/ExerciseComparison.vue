<template>
    <div v-if="comparison" class="exercise-comparison mt-2">
        <v-expansion-panels variant="accordion">
            <v-expansion-panel>
                <v-expansion-panel-title class="py-1">
                    <div class="d-flex align-center">
                        <v-icon icon="mdi-history" size="small" class="mr-2"></v-icon>
                        <span class="text-caption">VS previous ({{ formatDate }})</span>
                        <v-spacer></v-spacer>

                        <!-- Quick summary indicators -->
                        <div class="d-flex align-center">
                            <v-icon
                                :icon="getTrendIcon(comparison.totalVolume.percentChange)"
                                :color="getTrendColor(comparison.totalVolume.isImprovement)"
                                size="small"
                            ></v-icon>
                            <span
                                class="text-caption font-weight-medium ml-1"
                                :class="getTrendTextClass(comparison.totalVolume.isImprovement)"
                            >
                                {{ formatPercentChange(comparison.totalVolume.percentChange) }}
                            </span>
                        </div>
                    </div>
                </v-expansion-panel-title>

                <v-expansion-panel-text class="py-2">
                    <div class="d-flex flex-wrap gap-2">
                        <!-- Volume Comparison -->
                        <v-chip
                            size="small"
                            :color="getTrendColor(comparison.totalVolume.isImprovement)"
                            variant="outlined"
                            class="comparison-chip"
                        >
                            <v-icon
                                :icon="getTrendIcon(comparison.totalVolume.percentChange)"
                                size="x-small"
                                class="mr-1"
                            ></v-icon>
                            <span class="text-caption"
                                >Volume:
                                {{
                                    formatPercentChange(comparison.totalVolume.percentChange)
                                }}</span
                            >
                            <span class="text-caption text-body-2 ms-1">
                                ({{ comparison.totalVolume.previous }} →
                                {{ comparison.totalVolume.current }} kg)
                            </span>
                        </v-chip>

                        <!-- Max Weight Comparison -->
                        <v-chip
                            size="small"
                            :color="getTrendColor(comparison.maxWeight.isImprovement)"
                            variant="outlined"
                            class="comparison-chip"
                        >
                            <v-icon
                                :icon="getTrendIcon(comparison.maxWeight.percentChange)"
                                size="x-small"
                                class="mr-1"
                            ></v-icon>
                            <span class="text-caption"
                                >Max:
                                {{ formatPercentChange(comparison.maxWeight.percentChange) }}</span
                            >
                            <span class="text-caption text-body-2 ms-1">
                                ({{ comparison.maxWeight.previous }} →
                                {{ comparison.maxWeight.current }} kg)
                            </span>
                        </v-chip>

                        <!-- Sets Comparison -->
                        <v-chip
                            v-if="comparison.setsCount.percentChange !== 0"
                            size="small"
                            :color="getTrendColor(comparison.setsCount.isImprovement)"
                            variant="outlined"
                            class="comparison-chip"
                        >
                            <v-icon
                                :icon="getTrendIcon(comparison.setsCount.percentChange)"
                                size="x-small"
                                class="mr-1"
                            ></v-icon>
                            <span class="text-caption"
                                >Sets:
                                {{ formatPercentChange(comparison.setsCount.percentChange) }}</span
                            >
                            <span class="text-caption text-body-2 ms-1">
                                ({{ comparison.setsCount.previous }} →
                                {{ comparison.setsCount.current }})
                            </span>
                        </v-chip>
                    </div>
                </v-expansion-panel-text>
            </v-expansion-panel>
        </v-expansion-panels>
    </div>

    <div v-else-if="isLoading" class="exercise-comparison mt-2">
        <div class="pa-2">
            <v-skeleton-loader type="text" width="150px" class="mb-1"></v-skeleton-loader>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

import type { StrengthExerciseEntry, Workout } from "../../types/workout";

import {
    calculateExerciseComparison,
    type ExerciseComparison,
    formatPercentChange,
} from "../../helpers/exercise-comparison";
import { logger } from "../../logger/app-logger";
import { getPreviousExerciseExecution, getWorkoutsInDateRange } from "../../services/workout";
import { useAuthStore } from "../../stores/auth";

interface ExerciseComparisonProps {
    exercise: StrengthExerciseEntry;
    workout: Workout;
}

const props = defineProps<ExerciseComparisonProps>();
const authStore = useAuthStore();

const isLoading = ref(true);
const previousExercise = ref<null | StrengthExerciseEntry>(null);
const comparison = ref<ExerciseComparison | null>(null);

const formatDate = computed(() => {
    if (!comparison.value?.previousDate) return "";

    const date = comparison.value.previousDate;
    return date.toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
    });
});

async function findPreviousWorkoutDate(
    userId: string,
    exerciseId: string,
    currentDate: Date,
): Promise<Date | undefined> {
    const workouts = await getWorkoutsInDateRange(
        userId,
        // Start from earliest date
        new Date(0),
        currentDate,
        { orderByDate: "desc" },
    );

    const previousWorkout = workouts.find((workout) =>
        workout.exerciseEntries.some((entry) => entry.exerciseId === exerciseId),
    );

    return previousWorkout?.date.toDate();
}

function getTrendColor(isImprovement: boolean): string {
    return isImprovement ? "success" : "error";
}

function getTrendIcon(percentChange: number): string {
    if (Math.abs(percentChange) < 0.1) return "mdi-minus";
    return percentChange > 0 ? "mdi-arrow-up" : "mdi-arrow-down";
}

function getTrendTextClass(isImprovement: boolean): string {
    return isImprovement ? "text-success" : "text-error";
}

async function loadExerciseComparisonData(): Promise<void> {
    try {
        isLoading.value = true;

        if (!authStore.nonNullableUser || !props.exercise.exerciseId) {
            return;
        }

        const userId = authStore.nonNullableUser.uid;
        const { exerciseId } = props.exercise;

        previousExercise.value = await getPreviousExerciseExecution(
            userId,
            exerciseId,
            props.workout.date,
        );

        if (!previousExercise.value) {
            return;
        }

        const previousDate = await findPreviousWorkoutDate(
            userId,
            exerciseId,
            props.workout.date.toDate(),
        );

        comparison.value = calculateExerciseComparison(
            props.exercise,
            previousExercise.value,
            previousDate,
        );
    } catch (error) {
        logger.error("Failed to fetch previous exercise data:", "ExerciseComparison", error);
    } finally {
        isLoading.value = false;
    }
}

onMounted(() => {
    loadExerciseComparisonData();
});
</script>

<style scoped>
.exercise-comparison {
    border-radius: 8px;
}

.comparison-chip {
    height: 24px !important;
}

:deep(.v-expansion-panel-title) {
    min-height: 36px !important;
}

:deep(.v-expansion-panel-text__wrapper) {
    padding: 0 12px 8px 12px !important;
}

.gap-2 {
    gap: 8px;
}

@media (max-width: 600px) {
    .comparison-chip {
        font-size: 11px !important;
        padding: 0 6px !important;
    }
}
</style>
