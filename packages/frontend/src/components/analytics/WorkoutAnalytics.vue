<template>
    <div>
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
                    <MuscleGroupChart :workout-data="workoutData" />
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
                        <ExerciseFrequencyTable :workout-data="workoutData" type="strength" />
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
                    />
                </v-card>

                <v-alert v-else type="info" variant="tonal" class="mt-2">
                    Track more workouts to see your exercise performance trends over time.
                </v-alert>
            </v-col>
        </v-row>
    </div>
</template>

<script setup lang="ts">
import { isNotNil } from "es-toolkit";
import { computed, ref } from "vue";

import type { DateRangeOption } from "../../types/analytics";
import type { WorkoutWithId } from "../../types/workout";

import { getExerciseById } from "../../helpers/exercise-utils";
import ExerciseProgressionChart from "./charts/ExerciseProgressionChart.vue";
import MuscleGroupChart from "./charts/MuscleGroupChart.vue";
import VolumeProgressionChart from "./charts/VolumeProgressionChart.vue";
import WorkoutFrequencyChart from "./charts/WorkoutFrequencyChart.vue";
import ExerciseFrequencyTable from "./ExerciseFrequencyTable.vue";

const props = defineProps<{
    dateRange: DateRangeOption;
    workoutData: WorkoutWithId[];
}>();

const selectedExercise = ref("");

const topExercises = computed(() => {
    if (props.workoutData.length === 0) return [];

    const exerciseCounts: Record<string, number> = {};

    for (const workout of props.workoutData) {
        for (const entry of workout.exerciseEntries) {
            exerciseCounts[entry.exerciseId] = (exerciseCounts[entry.exerciseId] ?? 0) + 1;
        }
    }

    const topExerciseIds = Object.entries(exerciseCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map((entry) => entry[0]);

    const exercises = topExerciseIds
        .map(function (id) {
            const exercise = getExerciseById(id);
            return {
                id: exercise.exerciseId,
                name: exercise.name,
            };
        })
        .filter(isNotNil);

    if (exercises.length > 0 && !selectedExercise.value) {
        selectedExercise.value = exercises[0].id;
    }

    return exercises;
});
</script>
