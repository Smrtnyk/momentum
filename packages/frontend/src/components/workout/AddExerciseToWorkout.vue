<template>
    <div class="pa-2">
        <v-autocomplete
            v-model="selectedExercise"
            :items="exerciseOptions"
            label="Search Exercise"
            variant="outlined"
            density="comfortable"
            item-title="name"
            item-value="id"
            return-object
            clearable
            class="mb-4"
        ></v-autocomplete>

        <div v-if="selectedExercise" class="mt-3">
            <v-row v-if="isStrengthExercise(selectedExercise)">
                <v-col cols="6">
                    <v-text-field
                        v-model.number="sets"
                        label="Sets"
                        type="number"
                        variant="outlined"
                        density="comfortable"
                        min="1"
                    ></v-text-field>
                </v-col>
                <v-col cols="6">
                    <v-text-field
                        v-model.number="reps"
                        label="Reps"
                        type="number"
                        variant="outlined"
                        density="comfortable"
                        min="1"
                    ></v-text-field>
                </v-col>
            </v-row>

            <v-row v-if="isCardioExercise(selectedExercise)">
                <v-col cols="6">
                    <v-text-field
                        v-model.number="duration"
                        label="Duration (minutes)"
                        type="number"
                        variant="outlined"
                        density="comfortable"
                        min="1"
                    ></v-text-field>
                </v-col>
                <v-col cols="6">
                    <v-text-field
                        v-model.number="distance"
                        label="Distance (km)"
                        type="number"
                        variant="outlined"
                        density="comfortable"
                        min="0"
                        step="0.1"
                    ></v-text-field>
                </v-col>
                <v-col cols="12">
                    <v-text-field
                        v-model.number="calories"
                        label="Calories (Kcal)"
                        type="number"
                        variant="outlined"
                        density="comfortable"
                        min="0"
                    ></v-text-field>
                </v-col>
            </v-row>

            <v-row v-if="isCardioExercise(selectedExercise)">
                <v-col cols="12">
                    <v-select
                        v-model="intensity"
                        label="Intensity"
                        :items="intensityOptions"
                        variant="outlined"
                        density="comfortable"
                    ></v-select>
                </v-col>
            </v-row>

            <v-textarea
                v-model="exerciseNotes"
                label="Notes"
                variant="outlined"
                density="comfortable"
                rows="2"
                class="mt-3"
            ></v-textarea>

            <v-btn color="primary" block @click="addExercise" class="mt-3"> Add Exercise </v-btn>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

import type { Exercise } from "../../types/exercise";
import type { ActiveExercise, ExerciseEntry } from "../../types/workout";

import { cardioExercises } from "../../data/cardio-exercises";
import { strengthExercises } from "../../data/strength-exercises";
import { isCardioExercise, isStrengthExercise } from "../../services/workout";

const emit = defineEmits(["add"]);

const selectedExercise = ref<Exercise | null>(null);
const sets = ref(3);
const reps = ref(10);
const duration = ref(10);
const distance = ref(0);
const calories = ref(0);
const exerciseNotes = ref("");
const intensity = ref<NonNullable<ActiveExercise["intensity"]>>("medium");

const intensityOptions = ["low", "medium", "high"];

const exerciseOptions = computed<Exercise[]>(function (): Exercise[] {
    return [...strengthExercises, ...cardioExercises];
});

function addExercise(): void {
    if (!selectedExercise.value) return;

    const exercise: ExerciseEntry = {
        durationSeconds: duration.value * 60,
        exerciseId: selectedExercise.value.exerciseId,
        exerciseNotes: exerciseNotes.value,
    };

    if (isStrengthExercise(selectedExercise.value)) {
        (exercise as ActiveExercise).setsCount = sets.value;
        (exercise as ActiveExercise).reps = reps.value;
        exercise.sets = Array.from({ length: sets.value }).map(() => ({
            completed: false,
            reps: reps.value,
            weight: 0,
        }));
    }

    if (isCardioExercise(selectedExercise.value)) {
        exercise.intensity = intensity.value;
        exercise.calories = calories.value;
        exercise.distanceKm = distance.value;
    }

    emit("add", exercise);

    selectedExercise.value = null;
    exerciseNotes.value = "";
}
</script>
