<template>
    <div>
        <v-card-text>
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
import { ref } from "vue";

import type { ActiveExercise } from "../../types/workout";

import { isCardioExercise } from "../../services/workout";

interface EditExerciseDialogProps {
    exercise: ActiveExercise;
}

const { exercise } = defineProps<EditExerciseDialogProps>();
const emit = defineEmits(["save"]);

const editingExerciseNotes = ref(exercise.exerciseNotes ?? "");
const editingExerciseDuration = ref<number>(0);
const editingExerciseDistance = ref<number>(0);
const calories = ref<number>(0);
const editingExerciseIntensity = ref<"high" | "low" | "medium">("medium");

if (isCardioExercise(exercise)) {
    editingExerciseDuration.value = exercise.durationSeconds ?? 0;
    editingExerciseDistance.value = exercise.distanceKm ?? 0;
    calories.value = exercise.calories ?? 0;
    editingExerciseIntensity.value = exercise.intensity ?? "medium";
}

function onSave(): void {
    const updatedExercise = cloneDeep(exercise);

    updatedExercise.exerciseNotes = editingExerciseNotes.value;

    if (isCardioExercise(exercise)) {
        updatedExercise.durationSeconds = editingExerciseDuration.value;
        updatedExercise.distanceKm = editingExerciseDistance.value;
        updatedExercise.calories = calories.value;
        updatedExercise.intensity = editingExerciseIntensity.value;
    }

    emit("save", updatedExercise);
}
</script>
