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
            :label="isEditMode ? 'Change Exercise' : 'Search Exercise'"
            variant="outlined"
            density="comfortable"
            item-title="name"
            item-value="id"
            return-object
            clearable
            :no-filter="!isEditMode"
            class="mb-4"
            :no-data-text="
                exerciseLoadError
                    ? 'Error loading exercises'
                    : isEditMode
                      ? 'No compatible exercises found'
                      : 'No exercises found'
            "
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

        <div v-if="selectedExercise" class="mt-3">
            <v-btn color="primary" block @click="submitExercise" class="mt-3">
                {{ isEditMode ? "Save Changes" : "Add Exercise" }}
            </v-btn>
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
import { cloneDeep } from "es-toolkit";
import { computed, onMounted, ref, watch } from "vue";

import type { Exercise } from "../../types/exercise";
import type { ActiveExercise, ExerciseEntry } from "../../types/workout";

import { isActiveExercise, isCardioExercise, isStrengthExercise } from "../../services/workout";
import { useExerciseStore } from "../../stores/exercises";
import { useGlobalStore } from "../../stores/global";

interface ExerciseSelectorProps {
    existingExercise?: ActiveExercise | ExerciseEntry;
    isEditMode?: boolean;
}

const { existingExercise, isEditMode = false } = defineProps<ExerciseSelectorProps>();

type Emits = {
    (e: "add", value: ExerciseEntry): void;
    (e: "save", value: ActiveExercise | ExerciseEntry): void;
};

const emit = defineEmits<Emits>();
const exerciseStore = useExerciseStore();
const globalStore = useGlobalStore();
const exerciseLoadError = ref(false);

const selectedExercise = ref<Exercise | null>(null);
const duration = ref(10);
const DEFAULT_DISTANCE = 0;
const DEFAULT_CALORIES = 0;
const DEFAULT_INTENSITY = "medium";

const searchText = ref("");
const filteredExercises = computed(() => {
    if (exerciseStore.exercises.length === 0) {
        return [];
    }

    if (isEditMode && existingExercise) {
        return exerciseStore.exercises.filter((ex) => {
            return ex.category === existingExercise?.category;
        });
    }

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

onMounted(() => {
    if (isEditMode && existingExercise) {
        async function findCurrentExercise(): Promise<void> {
            await loadExercisesData();
            const currentExerciseId = existingExercise?.exerciseId;
            if (currentExerciseId) {
                const exercise = exerciseStore.exercises.find((ex) => ex.id === currentExerciseId);
                if (exercise) {
                    // Pre-select the current exercise
                    selectedExercise.value = exercise;
                }
            }
        }
        findCurrentExercise();
    } else {
        loadExercisesData();
    }
});

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

function submitExercise(): void {
    if (!selectedExercise.value) return;

    if (isEditMode && existingExercise) {
        // In edit mode, maintain all existing properties and only update the exercise ID
        const updatedExercise = cloneDeep(existingExercise);
        updatedExercise.exerciseId = selectedExercise.value.id;
        emit("save", updatedExercise);
    } else {
        // In add mode, create a new exercise entry
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
            exercise.intensity = DEFAULT_INTENSITY;
            exercise.calories = DEFAULT_CALORIES;
            exercise.distanceKm = DEFAULT_DISTANCE;
        }

        emit("add", exercise);
    }

    selectedExercise.value = null;
}
</script>
