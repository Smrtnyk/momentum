<template>
    <v-container class="pa-2 mx-auto">
        <!-- Loading state -->
        <div v-if="isLoading" class="d-flex justify-center align-center" style="min-height: 200px">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </div>

        <!-- Workout content -->
        <div v-else-if="workout" class="workout-container">
            <v-card class="mb-4 rounded-lg">
                <v-card-title class="d-flex align-center pa-4">
                    <div class="d-flex flex-column">
                        <div class="d-flex align-center">
                            <v-icon
                                size="xs"
                                icon="mdi-timer"
                                color="primary"
                                class="mr-1"
                            ></v-icon>
                            <h2 class="text-h6 font-weight-bold text-truncate">
                                <span
                                    v-if="!isEditingName"
                                    @click="startEditingName"
                                    class="workout-name"
                                >
                                    {{ workout.name }}
                                </span>
                                <v-text-field
                                    v-else
                                    v-model="editedName"
                                    variant="outlined"
                                    density="comfortable"
                                    hide-details
                                    autofocus
                                    @blur="saveWorkoutName"
                                    @keyup.enter="saveWorkoutName"
                                ></v-text-field>
                            </h2>
                        </div>
                        <div class="text-caption text-grey-lighten-1 mt-1">
                            <!-- Different text based on mode -->
                            <template v-if="isActiveWorkout(workout)">
                                Started at {{ formatStartTime() }}
                                <!-- Show elapsed time for active workouts -->
                                <v-chip
                                    v-if="isActiveWorkout(workout)"
                                    color="primary-lighten-2"
                                    size="small"
                                    class="ml-2"
                                >
                                    {{ getElapsedTimeText() }}
                                </v-chip>
                            </template>
                            <template v-else> Editing saved workout </template>
                        </div>
                    </div>
                </v-card-title>
            </v-card>

            <!-- Exercise List -->
            <div class="exercises-section mb-4">
                <div class="d-flex align-center mb-3">
                    <h3 class="text-h6 font-weight-medium">Exercises</h3>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="primary"
                        variant="text"
                        prepend-icon="mdi-plus"
                        @click="showAddExerciseDialog"
                        size="small"
                    >
                        Add Exercise
                    </v-btn>
                </div>

                <div v-if="exerciseEntries.length === 0" class="text-center pa-8 rounded-lg">
                    <v-icon size="48" color="grey-lighten-1">{{ "mdi-dumbbell" }}</v-icon>
                    <p class="text-body-1 mt-3 text-grey-darken-1">
                        No exercises added yet. Click the "Add Exercise" button to get started.
                    </p>
                </div>

                <v-form ref="exercisesForm" v-else>
                    <SortableExerciseList :workout="workout" :is-active="isActive" />
                </v-form>
            </div>

            <!-- Notes Section (for saved workouts) -->
            <div v-if="!isActiveWorkout" class="mt-4 mb-6">
                <div class="text-body-1 font-weight-medium text-grey-lighten-1 d-flex align-center">
                    <v-icon icon="mdi-text" size="small" class="mr-2"></v-icon>
                    Workout Notes
                    <v-btn
                        icon="mdi-pencil"
                        variant="text"
                        color="grey-lighten-1"
                        @click="isEditingNotes = true"
                        density="comfortable"
                        size="small"
                        class="ml-2"
                    ></v-btn>
                </div>
                <div v-if="!isEditingNotes" class="text-body-2 mt-2 px-2">
                    {{ editedNotes || "No notes added yet." }}
                </div>
                <v-textarea
                    v-else
                    v-model="editedNotes"
                    variant="outlined"
                    rows="3"
                    class="mt-2"
                    auto-grow
                    placeholder="Add workout notes here..."
                    @blur="isEditingNotes = false"
                ></v-textarea>
            </div>
        </div>

        <!-- Bottom fixed action buttons -->
        <v-footer app fixed class="px-4 py-2 justify-space-evenly" v-if="workout">
            <template v-if="isActiveWorkout(workout)">
                <v-btn
                    color="error"
                    variant="tonal"
                    @click="cancelWorkout"
                    class="mr-2"
                    prepend-icon="mdi-close"
                >
                    Cancel
                </v-btn>

                <v-btn
                    color="success"
                    variant="elevated"
                    @click="finishWorkout"
                    prepend-icon="mdi-check"
                    :disabled="!allExercisesCompleted"
                >
                    Finish
                </v-btn>
            </template>
            <template v-else>
                <v-btn
                    color="error"
                    variant="tonal"
                    @click="discardChanges"
                    class="mr-2"
                    :disabled="!hasChanges"
                    prepend-icon="mdi-close"
                >
                    Discard
                </v-btn>
                <v-btn
                    color="success"
                    variant="elevated"
                    @click="saveWorkout"
                    :disabled="!hasChanges"
                    prepend-icon="mdi-check"
                >
                    Save
                </v-btn>
            </template>
        </v-footer>
    </v-container>
</template>

<script setup lang="ts">
import { useNow } from "@vueuse/core";
import { cloneDeep } from "es-toolkit";
import { computed, onMounted, ref, useTemplateRef, watch } from "vue";
import { useRouter } from "vue-router";

import type { ActiveExercise, ActiveWorkout, ExerciseEntry, WorkoutWithId } from "../types/workout";

import AddExerciseToWorkout from "../components/workout/AddExerciseToWorkout.vue";
import SortableExerciseList from "../components/workout/SortableExerciseList.vue";
import { globalDialog } from "../composables/useDialog";
import { getDateFromMaybeTimestamp, ONE_HOUR, ONE_MINUTE, ONE_SECOND } from "../helpers/date-utils";
import { logger } from "../logger/app-logger";
import {
    getWorkoutById,
    isActiveExercise,
    isActiveWorkout,
    isStrengthExercise,
    updateWorkout,
} from "../services/workout";
import { useActiveWorkoutStore } from "../stores/active-workout";
import { useAuthStore } from "../stores/auth";
import { useExerciseStore } from "../stores/exercises";
import { useGlobalStore } from "../stores/global";

const { id: workoutId } = defineProps<{ id?: string }>();

const router = useRouter();
const activeWorkoutStore = useActiveWorkoutStore();
const globalStore = useGlobalStore();
const authStore = useAuthStore();
const exerciseStore = useExerciseStore();
const exercisesForm = useTemplateRef("exercisesForm");

const isLoading = ref(false);
const workout = ref<ActiveWorkout | null | WorkoutWithId>(null);
const originalWorkout = ref<null | WorkoutWithId>(null);
const isEditingName = ref(false);
const isEditingNotes = ref(false);
const editedName = ref("");
const editedNotes = ref("");
const now = useNow({ interval: 1000 });

const isActive = computed(() => !workoutId);
const exerciseEntries = computed(() => {
    if (!workout.value) return [];
    return workout.value.exerciseEntries ?? [];
});

const allExercisesCompleted = computed(() => {
    if (!workout.value || !isActiveWorkout(workout.value)) return false;
    if (workout.value.exerciseEntries.length === 0) return false;

    return workout.value.exerciseEntries.every(
        (exercise) => isActiveExercise(exercise) && exercise.completed,
    );
});

const hasChanges = computed(() => {
    if (isActive.value) {
        return false;
    }

    if (!originalWorkout.value || !workout.value) {
        return false;
    }

    return JSON.stringify(workout.value) !== JSON.stringify(originalWorkout.value);
});

onMounted(async () => {
    try {
        if (!isActive.value && workoutId) {
            isLoading.value = true;
            const loadedWorkout = await getWorkoutById(authStore.nonNullableUser.uid, workoutId);
            workout.value = cloneDeep(loadedWorkout);
            originalWorkout.value = cloneDeep(loadedWorkout);
            editedName.value = loadedWorkout.name;
            editedNotes.value = loadedWorkout.overallNotes ?? "";

            if (loadedWorkout.exerciseEntries.length > 0) {
                const ids = loadedWorkout.exerciseEntries.map((entry) => entry.exerciseId);
                await exerciseStore.getExercisesByIds(ids);
            }
        } else if (activeWorkoutStore.isWorkoutActive) {
            workout.value = activeWorkoutStore.activeWorkout;
        } else {
            await router.push({ name: "WorkoutLogs" });
        }
    } catch (error) {
        logger.error("Error initializing workout:", "PageCustomWorkout", error);
        globalStore.notifyError("Failed to load workout");
    } finally {
        isLoading.value = false;
    }
});

watch(
    () => activeWorkoutStore.activeWorkout,
    (newWorkout) => {
        if (newWorkout) {
            workout.value = newWorkout;
        }
    },
);

function addExerciseToWorkout(exercise: Omit<ActiveExercise, "id">): void {
    if (!workout.value) {
        return;
    }

    if (isActiveWorkout(workout.value)) {
        activeWorkoutStore.addExerciseToWorkout(exercise);
        globalDialog.closeLatestDialog();
        return;
    }

    const newEntry: ExerciseEntry = {
        calories: 0,
        category: exercise.category,
        distanceKm: exercise.distanceKm ?? 0,
        durationSeconds: exercise.durationSeconds ?? 0,
        exerciseId: exercise.exerciseId,
        exerciseNotes: exercise.exerciseNotes ?? "",
        intensity: exercise.intensity ?? "medium",
    };

    if (isStrengthExercise(exercise)) {
        const strengthEntry: Partial<ExerciseEntry> = {
            exerciseId: exercise.exerciseId,
            exerciseNotes: exercise.exerciseNotes ?? "",
            sets: [],
        };

        const numSets = exercise.setsCount ?? 3;
        const reps = exercise.reps ?? 10;

        for (let i = 0; i < numSets; i++) {
            newEntry.sets?.push({
                reps,
                weight: 0,
            });
        }

        Object.assign(newEntry, strengthEntry);
    }

    workout.value.exerciseEntries.push(newEntry);
    globalDialog.closeLatestDialog();
}

async function cancelWorkout(): Promise<void> {
    const confirmed = await globalDialog.confirm({
        message: "Are you sure you want to cancel this workout? Your progress will be lost.",
        title: "Cancel Workout",
    });

    if (confirmed) {
        activeWorkoutStore.cancelWorkout();
        globalStore.notify("Workout cancelled");
        await router.push({ name: "WorkoutLogs" });
    }
}

function discardChanges(): void {
    if (!originalWorkout.value) return;

    workout.value = cloneDeep(originalWorkout.value);
    editedName.value = originalWorkout.value.name;
    editedNotes.value = originalWorkout.value.overallNotes ?? "";

    globalStore.notify("Changes discarded");
}

async function finishWorkout(): Promise<void> {
    try {
        if (!workout.value?.exerciseEntries.length) {
            globalStore.notifyError("Cannot finish an empty workout. Add at least one exercise.");
            return;
        }

        if (exercisesForm.value?.isValid === false) {
            globalStore.notifyError("Please fix validation errors before saving");
            return;
        }

        const confirmed = await globalDialog.confirm({
            message: "Are you ready to finish and save this workout?",
            title: "Finish Workout",
        });

        if (!confirmed) return;

        globalStore.setLoading(true);
        const savedWorkoutId = await activeWorkoutStore.endWorkout();

        if (savedWorkoutId) {
            globalStore.notify("Workout completed and saved!");
            await router.push({ name: "WorkoutDetail", params: { id: savedWorkoutId } });
        } else {
            throw new Error("Failed to save workout");
        }
    } catch (error) {
        logger.error("Error finishing workout:", "PageCustomWorkout", error);
        globalStore.notifyError("Failed to save workout");
    } finally {
        globalStore.setLoading(false);
    }
}

function formatStartTime(): string {
    if (!workout.value) return "";
    const startTime = getDateFromMaybeTimestamp(workout.value.date);
    return startTime.toLocaleTimeString(undefined, {
        hour: "2-digit",
        hour12: true,
        minute: "2-digit",
    });
}

watch(
    () => workout.value?.exerciseEntries,
    function (newExercises) {
        if (!workout.value || !isActiveWorkout(workout.value) || !newExercises) return;

        for (const exercise of newExercises) {
            if (!isActiveExercise(exercise) || !exercise.sets?.length) continue;

            const allSetsCompleted = exercise.sets.every((set) => set.completed);

            if (exercise.completed !== allSetsCompleted) {
                exercise.completed = allSetsCompleted;
            }
        }
    },
    { deep: true },
);

function getElapsedTimeText(): string {
    if (!workout.value) return "";
    const startTime = getDateFromMaybeTimestamp(workout.value.date);
    const elapsedMs = now.value.getTime() - startTime.getTime();

    const hours = Math.floor(elapsedMs / ONE_HOUR);
    const minutes = Math.floor((elapsedMs % ONE_HOUR) / ONE_MINUTE);
    const seconds = Math.floor((elapsedMs % ONE_MINUTE) / ONE_SECOND);

    if (hours > 0) {
        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

async function saveWorkout(): Promise<void> {
    if (!workout.value || isActiveWorkout(workout.value)) return;

    if (exercisesForm.value?.isValid === false) {
        globalStore.notifyError("Please fix validation errors before saving");
        return;
    }

    try {
        workout.value.overallNotes = editedNotes.value.trim();
        globalStore.setLoading(true);
        await updateWorkout(authStore.nonNullableUser.uid, workout.value.id, workout.value);
        originalWorkout.value = cloneDeep(workout.value);
        globalStore.notify("Workout updated successfully!");
    } catch (error) {
        logger.error("Error saving workout:", "PageCustomWorkout", error);
        globalStore.notifyError("Failed to save workout");
    } finally {
        globalStore.setLoading(false);
    }
}

function saveWorkoutName(): void {
    if (!workout.value) {
        return;
    }

    isEditingName.value = false;
    if (editedName.value.trim()) {
        if (isActive.value) {
            workout.value.name = editedName.value.trim();
            activeWorkoutStore.saveToLocalStorage();
        } else {
            workout.value.name = editedName.value.trim();
        }
    } else {
        editedName.value = workout.value.name;
    }
}

function showAddExerciseDialog(): void {
    globalDialog.openDialog(
        AddExerciseToWorkout,
        {
            isEditMode: false,
            onAdd: addExerciseToWorkout,
        },
        {
            title: `Add exercise`,
        },
    );
}

function startEditingName(): void {
    isEditingName.value = true;
}
</script>

<style scoped>
.workout-name {
    cursor: pointer;
}

.workout-name:hover {
    text-decoration: underline;
    text-decoration-style: dotted;
}

.workout-container {
    padding-bottom: 72px;
}

@media (min-width: 600px) {
    .workout-container {
        padding-bottom: 64px;
    }
}
</style>
