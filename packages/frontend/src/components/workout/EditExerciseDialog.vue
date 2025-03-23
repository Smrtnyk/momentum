<template>
    <div>
        <v-card-text>
            <div class="mb-4">
                <div v-if="exerciseStore.isLoading" class="mb-4">
                    <v-skeleton-loader type="text" height="56"></v-skeleton-loader>
                </div>
                <v-autocomplete
                    v-else
                    v-model="selectedExercise"
                    :items="filteredExercises"
                    label="Change Exercise"
                    variant="outlined"
                    density="comfortable"
                    item-title="name"
                    item-value="id"
                    return-object
                    clearable
                    :no-data-text="
                        exerciseLoadError
                            ? 'Error loading exercises'
                            : 'No compatible exercises found'
                    "
                ></v-autocomplete>
            </div>

            <v-text-field
                v-model="editingExerciseNotes"
                label="Notes"
                variant="outlined"
                density="comfortable"
            ></v-text-field>

            <!-- Cardio-specific edits -->
            <div v-if="isCardioExercise(exercise)">
                <v-text-field
                    v-model.number="editingExerciseDuration"
                    label="Duration (minutes)"
                    type="number"
                    variant="outlined"
                    density="comfortable"
                    min="1"
                    class="mt-3"
                ></v-text-field>

                <v-text-field
                    v-model.number="editingExerciseDistance"
                    label="Distance (km)"
                    type="number"
                    variant="outlined"
                    density="comfortable"
                    min="0"
                    step="0.1"
                    class="mt-3"
                ></v-text-field>

                <v-text-field
                    v-model.number="calories"
                    label="Calories (Kcal)"
                    type="number"
                    variant="outlined"
                    density="comfortable"
                    min="0"
                    class="mt-3"
                ></v-text-field>

                <v-select
                    v-model="editingExerciseIntensity"
                    label="Intensity"
                    :items="['low', 'medium', 'high']"
                    variant="outlined"
                    density="comfortable"
                    class="mt-3"
                ></v-select>
            </div>
        </v-card-text>
        <v-card-actions>
            <v-btn color="primary" @click="onSave">Save</v-btn>
        </v-card-actions>
    </div>
</template>

<script setup lang="ts">
import { cloneDeep } from "es-toolkit";
import { computed, onMounted, ref } from "vue";

import type { Exercise } from "../../types/exercise";
import type { ActiveExercise } from "../../types/workout";

import { isCardioExercise } from "../../services/workout";
import { useExerciseStore } from "../../stores/exercises";
import { useGlobalStore } from "../../stores/global";

interface EditExerciseDialogProps {
    exercise: ActiveExercise;
    hasActualSets?: boolean;
    isActiveWorkout?: boolean;
}

const { exercise } = defineProps<EditExerciseDialogProps>();
const emit = defineEmits(["save"]);

const exerciseStore = useExerciseStore();
const globalStore = useGlobalStore();
const exerciseLoadError = ref(false);

const selectedExercise = ref<Exercise | null>(null);
const editingExerciseNotes = ref(exercise.exerciseNotes ?? "");
const editingExerciseDuration = ref<number>(0);
const editingExerciseDistance = ref<number>(0);
const calories = ref<number>(0);
const editingExerciseIntensity = ref<"high" | "low" | "medium">("medium");

if (isCardioExercise(exercise)) {
    editingExerciseDuration.value = exercise.durationSeconds / 60;
    editingExerciseDistance.value = exercise.distanceKm ?? 0;
    calories.value = exercise.calories ?? 0;
    editingExerciseIntensity.value = exercise.intensity ?? "medium";
}

const filteredExercises = computed(function () {
    if (exerciseStore.exercises.length === 0) {
        return [];
    }

    return exerciseStore.exercises.filter(function (ex) {
        return ex.category === exercise.category;
    });
});

async function loadExercisesData(): Promise<void> {
    exerciseLoadError.value = false;
    try {
        await exerciseStore.loadAllExercises();
    } catch (err) {
        exerciseLoadError.value = true;
        globalStore.notifyError("Failed to load exercises");
    }
}

function onSave(): void {
    const updatedExercise = cloneDeep(exercise);

    if (selectedExercise.value) {
        updatedExercise.exerciseId = selectedExercise.value.id;
    }

    updatedExercise.exerciseNotes = editingExerciseNotes.value;

    if (isCardioExercise(exercise)) {
        updatedExercise.durationSeconds = editingExerciseDuration.value * 60;
        updatedExercise.distanceKm = editingExerciseDistance.value;
        updatedExercise.calories = calories.value;
        updatedExercise.intensity = editingExerciseIntensity.value;
    }

    emit("save", updatedExercise);
}

onMounted(loadExercisesData);
</script>
