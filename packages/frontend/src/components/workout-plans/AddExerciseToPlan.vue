<template>
    <div class="pa-2">
        <div v-if="exerciseStore.isLoading" class="mb-4">
            <v-skeleton-loader type="text" height="56"></v-skeleton-loader>
        </div>

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
            :no-data-text="exerciseStore.error ? 'Error loading exercises' : 'No exercises found'"
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
            <div class="d-flex flex-wrap gap-4 mb-4">
                <v-text-field
                    v-model.number="setsCount"
                    label="Sets"
                    type="number"
                    min="1"
                    max="10"
                    variant="outlined"
                    density="comfortable"
                    class="flex-grow-1"
                ></v-text-field>

                <v-text-field
                    v-model.number="reps"
                    label="Reps"
                    type="number"
                    min="1"
                    variant="outlined"
                    density="comfortable"
                    class="flex-grow-1"
                ></v-text-field>

                <v-text-field
                    v-model.number="restTime"
                    label="Rest (seconds)"
                    type="number"
                    min="0"
                    variant="outlined"
                    density="comfortable"
                    class="flex-grow-1"
                ></v-text-field>
            </div>

            <v-textarea
                v-model="exerciseNotes"
                label="Exercise Notes"
                variant="outlined"
                density="comfortable"
                rows="2"
                class="mb-4"
            ></v-textarea>

            <v-btn color="primary" block @click="submitExercise"> Add Exercise </v-btn>
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
        <RetryFetcher
            v-else-if="exerciseStore.error"
            :fetcher="exerciseStore.loadAllExercises"
            icon="mdi-alert-circle"
            message="Failed to load exercises"
        />
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";

import type { Exercise } from "../../types/exercise";
import type { ExercisePlanEntry } from "../../types/workout-plans";

import { ONE_MINUTE } from "../../helpers/date-utils";
import { isCardioExercise } from "../../services/workout";
import { useExerciseStore } from "../../stores/exercises";
import RetryFetcher from "../ui/RetryFetcher.vue";

const DEFAULT_SETS_COUNT = 3;
const DEFAULT_REPS = 10;
const DEFAULT_REST_TIME = 60;

const emit = defineEmits<(e: "add", value: ExercisePlanEntry) => void>();

const exerciseStore = useExerciseStore();

const selectedExercise = ref<Exercise | null>(null);
const searchText = ref("");
const setsCount = ref(DEFAULT_SETS_COUNT);
const reps = ref(DEFAULT_REPS);
const restTime = ref(DEFAULT_REST_TIME);
const exerciseNotes = ref("");

const filteredExercises = computed(() => {
    if (exerciseStore.exercises.length === 0) {
        return [];
    }

    if (!searchText.value) return exerciseStore.exercises;
    return exerciseStore.searchExercises(searchText.value);
});

onMounted(() => exerciseStore.loadAllExercises());

watch(
    () => selectedExercise.value,
    () => {
        if (!selectedExercise.value) {
            searchText.value = "";
        }
    },
);

function submitExercise(): void {
    if (!selectedExercise.value) return;

    const exerciseEntry = {
        exerciseId: selectedExercise.value.id,
        exerciseNotes: exerciseNotes.value,
        reps: reps.value,
        restTime: restTime.value,
        setsCount: setsCount.value,
    };

    if (isCardioExercise(selectedExercise.value)) {
        Object.assign(exerciseEntry, {
            distanceKm: 0,
            durationSeconds: 10 * ONE_MINUTE,
        });
    }

    emit("add", exerciseEntry);

    selectedExercise.value = null;
    setsCount.value = DEFAULT_SETS_COUNT;
    reps.value = DEFAULT_REPS;
    restTime.value = DEFAULT_REST_TIME;
    exerciseNotes.value = "";
}
</script>

<style scoped>
.gap-4 {
    gap: 16px;
}
</style>
