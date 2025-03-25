<template>
    <div class="workout-plan-exercises-list">
        <div v-if="modelValue.length === 0" class="text-center pa-4">
            <v-icon icon="mdi-dumbbell" size="40" color="grey-lighten-3" class="mb-3"></v-icon>
            <div class="text-body-1 text-medium-emphasis">No exercises added yet</div>
            <v-btn
                color="primary"
                variant="tonal"
                prepend-icon="mdi-plus"
                class="mt-3"
                @click="$emit('add-exercise')"
            >
                Add Exercise
            </v-btn>
        </div>

        <div v-else>
            <div class="d-flex align-center mb-3">
                <div class="text-subtitle-1 font-weight-medium">Exercises</div>
                <v-spacer></v-spacer>
                <v-btn
                    size="small"
                    variant="text"
                    color="primary"
                    prepend-icon="mdi-plus"
                    @click="$emit('add-exercise')"
                >
                    Add Exercise
                </v-btn>
            </div>

            <div class="exercise-list">
                <div
                    v-for="(exercise, index) in modelValue"
                    :key="index"
                    class="exercise-item pa-3 mb-2 rounded-lg"
                    :data-index="index"
                >
                    <div class="d-flex align-center">
                        <div class="flex-grow-1">
                            <div class="d-flex align-center">
                                <div
                                    class="text-subtitle-2 font-weight-medium"
                                    v-if="!exerciseStore.isLoading"
                                >
                                    {{ exercisesMap[exercise.exerciseId]?.name || "Not found" }}
                                </div>
                                <div class="text-subtitle-2 font-weight-medium" v-else>
                                    <v-skeleton-loader
                                        type="text"
                                        width="120px"
                                    ></v-skeleton-loader>
                                </div>
                            </div>

                            <div class="d-flex flex-wrap mt-1">
                                <v-text-field
                                    v-model.number="exercise.setsCount"
                                    label="Sets"
                                    type="number"
                                    min="1"
                                    max="10"
                                    density="compact"
                                    variant="outlined"
                                    hide-details
                                    class="mr-2 mb-2 exercise-input"
                                ></v-text-field>

                                <v-text-field
                                    v-model.number="exercise.reps"
                                    label="Reps"
                                    type="number"
                                    min="1"
                                    density="compact"
                                    variant="outlined"
                                    hide-details
                                    class="mr-2 mb-2 exercise-input"
                                ></v-text-field>

                                <v-text-field
                                    v-model.number="exercise.restTime"
                                    label="Rest (sec)"
                                    type="number"
                                    min="0"
                                    density="compact"
                                    variant="outlined"
                                    hide-details
                                    class="mb-2 exercise-input"
                                ></v-text-field>
                            </div>

                            <v-textarea
                                v-model="exercise.exerciseNotes"
                                label="Notes"
                                density="compact"
                                variant="outlined"
                                hide-details
                                rows="1"
                                class="mt-1"
                                auto-grow
                            ></v-textarea>
                        </div>

                        <v-btn
                            icon
                            variant="text"
                            density="compact"
                            color="error"
                            @click="removeExercise(index)"
                            class="ml-2"
                        >
                            <v-icon>mdi-delete</v-icon>
                        </v-btn>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";

import type { Exercise } from "../../types/exercise";
import type { ExercisePlanEntry } from "../../types/workout-plans";

import { logger } from "../../logger/app-logger";
import { useExerciseStore } from "../../stores/exercises";

const props = defineProps<{
    modelValue: ExercisePlanEntry[];
}>();

const emit = defineEmits<{
    (e: "update:modelValue", value: ExercisePlanEntry[]): void;
    (e: "add-exercise"): void;
}>();

const exerciseStore = useExerciseStore();
const exercisesMap = ref<Record<string, Exercise>>({});

onMounted(loadExerciseNames);

async function loadExerciseNames(): Promise<void> {
    try {
        const exerciseIds = props.modelValue.map((exercise) => exercise.exerciseId);
        const uniqueIds = [...new Set(exerciseIds)];

        exercisesMap.value = await exerciseStore.getExercisesByIds(uniqueIds);
    } catch (error) {
        logger.error("Failed to load exercise names:", "WorkoutPlanExercisesList", error);
    }
}

watch(() => props.modelValue, loadExerciseNames, { deep: true });

function removeExercise(index: number): void {
    const updatedExercises = [...props.modelValue];
    updatedExercises.splice(index, 1);
    emit("update:modelValue", updatedExercises);
}
</script>

<style scoped>
.exercise-list {
    position: relative;
}

.exercise-item {
    background-color: rgb(var(--v-theme-surface));
    border: 1px solid rgba(var(--v-theme-on-surface), 0.12);
    position: relative;
    z-index: 1;
    transition: box-shadow 0.2s ease;
}

.exercise-input {
    width: 80px;
}
</style>
