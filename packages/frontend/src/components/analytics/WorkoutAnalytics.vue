<template>
    <div>
        <!-- Loading state for entire analytics dashboard -->
        <div v-if="exercisesIsLoading" class="d-flex justify-center align-center py-8">
            <v-progress-circular indeterminate color="primary" size="60"></v-progress-circular>
            <div class="ml-4 text-body-1">Loading exercise data...</div>
        </div>

        <!-- Error state for entire analytics dashboard -->
        <div v-else-if="exercisesLoadError" class="text-center py-8">
            <v-icon size="48" color="error">mdi-alert-circle-outline</v-icon>
            <div class="text-h6 mt-4">Failed to load exercise data</div>
            <v-btn color="primary" class="mt-4" @click="loadExercises"> Retry </v-btn>
        </div>

        <!-- Content when data is loaded -->
        <div v-else>
            <v-row class="mb-6">
                <v-col cols="12">
                    <div class="text-h6 mb-2 text-center">Workout Frequency</div>
                    <v-card elevation="0">
                        <WorkoutFrequencyChart :workout-data="workoutData" />
                    </v-card>
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12" md="6">
                    <div class="text-h6 mb-2 text-center">Muscle Group Balance</div>
                    <v-card elevation="0">
                        <MuscleGroupChart
                            :workout-data="workoutData"
                            :exercises-map="exercisesMap"
                        />
                    </v-card>
                </v-col>

                <v-col cols="12" md="6">
                    <div class="text-h6 mb-2 text-center">Volume Progression</div>
                    <v-card elevation="0">
                        <VolumeProgressionChart :workout-data="workoutData" />
                    </v-card>
                </v-col>
            </v-row>

            <v-row class="mt-4">
                <v-col cols="12">
                    <div class="text-h6 mb-2 text-center">Exercise Frequency</div>
                    <v-card elevation="0">
                        <v-window-item value="strength">
                            <ExerciseFrequencyTable
                                :workout-data="workoutData"
                                :exercises-map="exercisesMap"
                                type="strength"
                            />
                        </v-window-item>
                    </v-card>
                </v-col>
            </v-row>

            <v-row class="mt-4">
                <v-col cols="12">
                    <div class="text-h6 mb-2 text-center">Performance Trends</div>

                    <v-card v-if="topExercises.length > 0" elevation="0">
                        <v-select
                            v-model="selectedExercise"
                            :items="topExercises"
                            item-title="name"
                            item-value="id"
                            label="Select Exercise"
                            variant="outlined"
                            density="comfortable"
                            hide-details
                            class="px-4 mb-2 mt-2"
                        ></v-select>

                        <ExerciseProgressionChart
                            :workout-data="workoutData"
                            :exercise-id="selectedExercise"
                            :exercises-map="exercisesMap"
                        />
                    </v-card>

                    <v-alert v-else type="info" variant="tonal" class="mt-2">
                        Track more workouts to see your exercise performance trends over time.
                    </v-alert>
                </v-col>
            </v-row>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAsyncState } from "@vueuse/core";
import { computed, ref, watch } from "vue";

import type { DateRangeOption } from "../../types/analytics";
import type { Exercise } from "../../types/exercise";
import type { WorkoutWithId } from "../../types/workout";

import { useExerciseStore } from "../../stores/exercises";
import ExerciseProgressionChart from "./charts/ExerciseProgressionChart.vue";
import MuscleGroupChart from "./charts/MuscleGroupChart.vue";
import VolumeProgressionChart from "./charts/VolumeProgressionChart.vue";
import WorkoutFrequencyChart from "./charts/WorkoutFrequencyChart.vue";
import ExerciseFrequencyTable from "./ExerciseFrequencyTable.vue";

const props = defineProps<{
    dateRange: DateRangeOption;
    workoutData: WorkoutWithId[];
}>();

const exerciseStore = useExerciseStore();
const selectedExercise = ref("");

const allExerciseIds = computed(() => {
    if (props.workoutData.length === 0) return [];

    const uniqueIds = new Set<string>();

    for (const workout of props.workoutData) {
        for (const entry of workout.exerciseEntries) {
            uniqueIds.add(entry.exerciseId);
        }
    }

    return Array.from(uniqueIds);
});

const topExerciseIds = computed(() => {
    if (props.workoutData.length === 0) return [];

    const exerciseCounts: Record<string, number> = {};

    for (const workout of props.workoutData) {
        for (const entry of workout.exerciseEntries) {
            exerciseCounts[entry.exerciseId] = (exerciseCounts[entry.exerciseId] ?? 0) + 1;
        }
    }

    return Object.entries(exerciseCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map((entry) => entry[0]);
});

function fetchAllExerciseData(): Promise<Record<string, Exercise>> {
    if (allExerciseIds.value.length === 0) return Promise.resolve({});

    return exerciseStore.getExercisesByIds(allExerciseIds.value);
}

const {
    error: exercisesLoadError,
    execute: loadExercises,
    isLoading: exercisesIsLoading,
    state: exercisesMap,
} = useAsyncState(() => fetchAllExerciseData(), {}, { immediate: false, resetOnExecute: false });

const topExercises = computed(() => {
    if (exercisesIsLoading.value || exercisesLoadError.value || topExerciseIds.value.length === 0) {
        return [];
    }

    const exercises = topExerciseIds.value.map(function (id) {
        const exercise = exercisesMap.value[id];

        return {
            id: exercise.id,
            name: exercise.name,
        };
    });

    if (exercises.length > 0 && !selectedExercise.value) {
        selectedExercise.value = exercises[0].id;
    }

    return exercises;
});

watch(
    [() => props.workoutData, allExerciseIds],
    () => {
        if (allExerciseIds.value.length > 0) {
            loadExercises();
        }
    },
    { immediate: true },
);
</script>
