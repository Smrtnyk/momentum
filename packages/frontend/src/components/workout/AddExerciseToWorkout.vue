<template>
    <div class="pa-2">
        <div v-if="exerciseStore.isLoading" class="mb-4">
            <v-skeleton-loader type="text" height="56"></v-skeleton-loader>
        </div>

        <!-- Autocomplete when data is loaded -->
        <v-autocomplete
            v-else
            v-model="selectedExercise"
            v-model:search="searchText"
            :items="filteredExercises"
            label="Search Exercise"
            variant="outlined"
            density="comfortable"
            item-title="name"
            item-value="id"
            return-object
            clearable
            no-filter
            class="mb-4"
            :no-data-text="exerciseLoadError ? 'Error loading exercises' : 'No exercises found'"
        >
            <template v-slot:item="{ item, props }">
                <v-list-item v-bind="props">
                    <v-list-item>
                        <span>
                            Primary: {{ item.raw.primaryMuscles.join(", ") }}
                            <template v-if="item.raw.secondaryMuscles.length > 0">
                                <br />
                                Secondary: {{ item.raw.secondaryMuscles.join(", ") }}
                            </template>
                        </span>
                    </v-list-item>
                </v-list-item>
            </template>
        </v-autocomplete>

        <!-- Form fields for selected exercise -->
        <div v-if="selectedExercise" class="mt-3">
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

            <v-btn color="primary" block @click="addExercise" class="mt-3"> Add Exercise </v-btn>
        </div>

        <!-- No exercise selected but exercises loaded state -->
        <div
            v-else-if="!exerciseStore.isLoading && exerciseStore.exercises.length > 0"
            class="text-center pa-4"
        >
            <v-icon size="48" color="grey-lighten-2">mdi-dumbbell</v-icon>
            <div class="text-body-1 mt-2">Select an exercise to continue</div>
        </div>

        <!-- Error state -->
        <div v-else-if="exerciseLoadError" class="text-center pa-4">
            <v-icon size="48" color="error-lighten-2">mdi-alert-circle</v-icon>
            <div class="text-body-1 mt-2">Failed to load exercises</div>
            <v-btn color="primary" variant="text" @click="retryLoading" class="mt-2"> Retry </v-btn>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";

import type { Exercise } from "../../types/exercise";
import type { ActiveExercise, ExerciseEntry } from "../../types/workout";

import { isActiveExercise, isCardioExercise, isStrengthExercise } from "../../services/workout";
import { useExerciseStore } from "../../stores/exercises";
import { useGlobalStore } from "../../stores/global";

const emit = defineEmits(["add"]);
const exerciseStore = useExerciseStore();
const globalStore = useGlobalStore();
const exerciseLoadError = ref(false);

const selectedExercise = ref<Exercise | null>(null);
const duration = ref(10);
const distance = ref(0);
const calories = ref(0);
const intensity = ref<NonNullable<ActiveExercise["intensity"]>>("medium");

const intensityOptions = ["low", "medium", "high"];

const searchText = ref("");
const filteredExercises = computed(() => {
    if (!searchText.value) return exerciseStore.exercises;

    return exerciseStore.searchExercises(searchText.value);
});

watch(
    () => selectedExercise.value,
    () => {
        if (!selectedExercise.value) {
            searchText.value = "";
        }
    },
);

function addExercise(): void {
    if (!selectedExercise.value) return;

    const exercise: ActiveExercise | ExerciseEntry = {
        category: selectedExercise.value.category,
        durationSeconds: duration.value * 60,
        exerciseId: selectedExercise.value.id,
        exerciseNotes: "",
    };

    if (isStrengthExercise(selectedExercise.value)) {
        const set = { reps: 0, weight: 0 };
        if (isActiveExercise(selectedExercise.value)) {
            Object.assign(set, { completed: false });
        }
        exercise.sets = [set];
    }

    if (isCardioExercise(selectedExercise.value)) {
        exercise.intensity = intensity.value;
        exercise.calories = calories.value;
        exercise.distanceKm = distance.value;
    }

    emit("add", exercise);

    selectedExercise.value = null;
}

async function loadExercisesData(): Promise<void> {
    exerciseLoadError.value = false;
    try {
        await exerciseStore.loadAllExercises();
    } catch (err) {
        exerciseLoadError.value = true;
        globalStore.notifyError(err);
    }
}

function retryLoading(): void {
    loadExercisesData();
}

onMounted(function () {
    loadExercisesData();
});
</script>
