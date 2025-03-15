<template>
    <v-container class="pa-2 mx-auto">
        <!-- Loading state -->
        <div v-if="isLoading" class="d-flex justify-center align-center" style="min-height: 200px">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </div>

        <!-- Workout content -->
        <div v-else-if="workout">
            <v-card class="mb-4 rounded-lg">
                <v-card-title class="d-flex align-center pa-4">
                    <div class="d-flex flex-column">
                        <div class="d-flex align-center">
                            <v-icon
                                :icon="getWorkoutTypeIcon()"
                                :color="getWorkoutTypeColor()"
                                class="mr-2"
                            ></v-icon>
                            <h2 class="text-h5 font-weight-bold">
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

                            <!-- Show elapsed time for active workouts -->
                            <v-chip
                                v-if="isActiveWorkout(workout)"
                                color="primary-lighten-2"
                                size="small"
                                class="ml-2"
                            >
                                {{ getElapsedTimeText() }}
                            </v-chip>
                        </div>
                        <div class="text-caption text-grey-lighten-1 mt-1">
                            <!-- Different text based on mode -->
                            <template v-if="isActiveWorkout(workout)">
                                Started at {{ formatStartTime() }}
                            </template>
                            <template v-else> Editing saved workout </template>
                        </div>
                    </div>
                    <v-spacer></v-spacer>

                    <!-- Different actions based on mode -->
                    <template v-if="isActiveWorkout(workout)">
                        <v-btn
                            color="error"
                            variant="outlined"
                            size="small"
                            @click="cancelWorkout"
                            class="mr-2"
                            icon="mdi-close"
                        />
                        <v-btn
                            color="success"
                            variant="elevated"
                            @click="finishWorkout"
                            icon="mdi-check"
                        />
                    </template>
                    <template v-else>
                        <v-btn
                            color="error"
                            variant="outlined"
                            size="small"
                            @click="discardChanges"
                            class="mr-2"
                            :disabled="!hasChanges"
                            icon="mdi-close"
                        />
                        <v-btn
                            color="success"
                            variant="elevated"
                            @click="saveWorkout"
                            :disabled="!hasChanges"
                            icon="mdi-check"
                        />
                    </template>
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

                <div v-else>
                    <!-- Exercises / Activities Cards -->
                    <v-card
                        v-for="(exercise, index) in exerciseEntries"
                        :key="index"
                        class="mb-3 rounded-lg"
                        :class="{
                            'completed-exercise': isActiveExercise(exercise) && exercise.completed,
                        }"
                    >
                        <div class="pa-3">
                            <div class="d-flex align-center">
                                <!-- Completion toggle (only for active workouts) -->
                                <v-btn
                                    v-if="isActiveExercise(exercise)"
                                    :icon="
                                        exercise.completed
                                            ? 'mdi-check-circle'
                                            : 'mdi-circle-outline'
                                    "
                                    :color="exercise.completed ? 'success' : 'grey-lighten-2'"
                                    variant="text"
                                    @click="toggleExercise(index)"
                                    class="mr-2"
                                ></v-btn>

                                <div class="flex-grow-1">
                                    <div class="font-weight-medium">
                                        {{ getExerciseName(exercise.exerciseId) }}
                                    </div>
                                    <div class="text-caption text-grey-lighten-1">
                                        <template v-if="isStrengthExercise(exercise)">
                                            {{ exercise.sets.length }} sets
                                        </template>
                                        <template v-if="isCardioExercise(exercise)">
                                            {{ exercise.durationSeconds / 60 }}
                                            min
                                        </template>
                                        <template v-if="isCardioExercise(exercise)">
                                            •
                                            {{ exercise.distanceKm }} km
                                        </template>
                                        <template v-if="isCardioExercise(exercise)">
                                            • {{ exercise.intensity }} intensity
                                        </template>
                                    </div>
                                </div>

                                <div class="d-flex">
                                    <v-btn
                                        icon="mdi-pencil"
                                        variant="text"
                                        color="grey-lighten-1"
                                        @click="editExercise(index, workout)"
                                        size="small"
                                        class="mr-1"
                                    ></v-btn>
                                    <v-btn
                                        icon="mdi-delete"
                                        variant="text"
                                        color="error"
                                        @click="confirmRemoveExercise(index)"
                                        size="small"
                                    ></v-btn>
                                </div>
                            </div>

                            <!-- Show sets for strength exercises -->
                            <div v-if="isStrengthExercise(exercise)" class="mt-3">
                                <v-expansion-panels variant="accordion">
                                    <v-expansion-panel>
                                        <v-expansion-panel-title>
                                            <div class="d-flex align-center">
                                                <v-icon size="small" class="mr-2"
                                                    >mdi-clipboard-list</v-icon
                                                >
                                                Sets
                                                <template v-if="isActiveExercise(exercise)">
                                                    <v-chip size="x-small" class="ml-2">
                                                        {{ getCompletedSetsCount(exercise) }}/{{
                                                            exercise.sets.length
                                                        }}
                                                    </v-chip>
                                                </template>
                                            </div>
                                        </v-expansion-panel-title>
                                        <v-expansion-panel-text>
                                            <!-- Add Set Button -->
                                            <div class="d-flex justify-end mb-2">
                                                <v-btn
                                                    color="primary"
                                                    size="small"
                                                    variant="text"
                                                    prepend-icon="mdi-plus"
                                                    @click="addSet(index)"
                                                >
                                                    Add Set
                                                </v-btn>
                                            </div>
                                            <v-table density="compact" class="rounded-lg">
                                                <thead>
                                                    <tr>
                                                        <th scope="col" class="set-column">Set</th>
                                                        <th scope="col" class="reps-column">
                                                            Reps
                                                        </th>
                                                        <th scope="col" class="weight-column">
                                                            Weight
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            class="complete-column"
                                                            v-if="isActiveWorkout(workout)"
                                                        ></th>
                                                        <th
                                                            scope="col"
                                                            class="action-column text-center"
                                                        ></th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    <tr
                                                        v-for="(set, setIndex) in exercise.sets"
                                                        :key="setIndex"
                                                    >
                                                        <td>{{ setIndex + 1 }}</td>
                                                        <td class="pa-1">
                                                            <v-text-field
                                                                v-model.number="set.reps"
                                                                type="number"
                                                                variant="outlined"
                                                                density="compact"
                                                                hide-details
                                                                class="narrow-input"
                                                                @update:model-value="
                                                                    updateSet(
                                                                        index,
                                                                        setIndex,
                                                                        set.reps,
                                                                        set.weight,
                                                                    )
                                                                "
                                                            ></v-text-field>
                                                        </td>
                                                        <td class="pa-1">
                                                            <v-text-field
                                                                v-model.number="set.weight"
                                                                type="number"
                                                                variant="outlined"
                                                                density="compact"
                                                                hide-details
                                                                class="narrow-input"
                                                                @update:model-value="
                                                                    updateSet(
                                                                        index,
                                                                        setIndex,
                                                                        set.reps,
                                                                        set.weight,
                                                                    )
                                                                "
                                                            ></v-text-field>
                                                        </td>
                                                        <td
                                                            v-if="isActiveExercise(exercise)"
                                                            class="text-center"
                                                        >
                                                            <v-checkbox
                                                                :model-value="
                                                                    (set as ActiveSet).completed
                                                                "
                                                                hide-details
                                                                @update:model-value="
                                                                    toggleSet(index, setIndex)
                                                                "
                                                            ></v-checkbox>
                                                        </td>

                                                        <td class="text-center">
                                                            <v-btn
                                                                icon="mdi-delete"
                                                                size="x-small"
                                                                color="error"
                                                                variant="text"
                                                                @click="removeSet(index, setIndex)"
                                                                :disabled="
                                                                    exercise.sets.length <= 1
                                                                "
                                                            ></v-btn>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </v-table>
                                        </v-expansion-panel-text>
                                    </v-expansion-panel>
                                </v-expansion-panels>
                            </div>

                            <!-- Notes if available -->
                            <div
                                v-if="exercise.exerciseNotes"
                                class="mt-3 text-caption text-grey-lighten-2"
                            >
                                <v-icon size="small" class="mr-1">mdi-note-text</v-icon>
                                {{ exercise.exerciseNotes }}
                            </div>
                        </div>
                    </v-card>
                </div>
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
    </v-container>
</template>

<script setup lang="ts">
import { useNow } from "@vueuse/core";
import { cloneDeep } from "es-toolkit";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import type {
    ActiveExercise,
    ActiveSet,
    ActiveWorkout,
    ExerciseEntry,
    Workout,
    WorkoutWithId,
} from "../types/workout";

import AddExerciseToWorkout from "../components/workout/AddExerciseToWorkout.vue";
import EditExerciseDialog from "../components/workout/EditExerciseDialog.vue";
import { globalDialog } from "../composables/useDialog";
import { getDateFromMaybeTimestamp, ONE_HOUR, ONE_MINUTE, ONE_SECOND } from "../helpers/date-utils";
import { getExerciseById } from "../helpers/exercise-utils";
import { logger } from "../logger/app-logger";
import {
    getWorkoutById,
    isActiveExercise,
    isActiveWorkout,
    isCardioExercise,
    isStrengthExercise,
    updateWorkout,
} from "../services/workout";
import { useActiveWorkoutStore } from "../stores/active-workout";
import { useAuthStore } from "../stores/auth";
import { useGlobalStore } from "../stores/global";

const route = useRoute();
const router = useRouter();
const activeWorkoutStore = useActiveWorkoutStore();
const globalStore = useGlobalStore();
const authStore = useAuthStore();

const workoutId = route.params.id as string;

const isActive = computed(() => !workoutId);

const isLoading = ref(false);
const workout = ref<ActiveWorkout | null | WorkoutWithId>(null);
const originalWorkout = ref<null | WorkoutWithId>(null);
const isEditingName = ref(false);
const isEditingNotes = ref(false);
const editedName = ref("");
const editedNotes = ref("");
const now = useNow({ interval: 1000 });

const exerciseEntries = computed(() => {
    if (!workout.value) return [];
    return workout.value.exerciseEntries ?? [];
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
        if (!isActive.value) {
            isLoading.value = true;
            const loadedWorkout = await getWorkoutById(authStore.nonNullableUser.uid, workoutId);
            workout.value = cloneDeep(loadedWorkout);
            originalWorkout.value = cloneDeep(loadedWorkout);
            editedName.value = loadedWorkout.name;
            editedNotes.value = loadedWorkout.overallNotes ?? "";
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

function addSet(exerciseIndex: number): void {
    if (!workout.value) {
        return;
    }

    const exercise = workout.value.exerciseEntries[exerciseIndex];
    if (!isStrengthExercise(exercise)) {
        return;
    }

    const sets = exercise.sets;

    const setDefault = { reps: 10, weight: 0 };

    const newSet = isActive.value
        ? {
              completed: false,
              ...setDefault,
          }
        : setDefault;

    sets.push(newSet);

    if (!workoutId) {
        activeWorkoutStore.saveToLocalStorage();
    }
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

async function confirmRemoveExercise(index: number): Promise<void> {
    const confirmed = await globalDialog.confirm({
        confirmText: "Remove",
        message: `Are you sure you want to remove this exercise from your workout?`,
        title: `Remove exercise?`,
    });

    if (confirmed) {
        removeExercise(index);
    }
}

function discardChanges(): void {
    if (!originalWorkout.value) return;

    workout.value = cloneDeep(originalWorkout.value);
    editedName.value = originalWorkout.value.name;
    editedNotes.value = originalWorkout.value.overallNotes ?? "";

    globalStore.notify("Changes discarded");
}

function editExercise(index: number, currWorkout: ActiveWorkout | Workout): void {
    const exercise = currWorkout.exerciseEntries[index];
    if (!exercise) return;

    globalDialog.openDialog(
        EditExerciseDialog,
        {
            exercise: cloneDeep(exercise),
            hasActualSets: hasActualSets(index),
            isActiveWorkout: isActive.value,
            onSave: (updatedExercise: ExerciseEntry) => handleSaveExercise(index, updatedExercise),
        },
        {
            title: `Edit exercise`,
        },
    );
}

async function finishWorkout(): Promise<void> {
    try {
        if (!workout.value?.exerciseEntries.length) {
            globalStore.notifyError("Cannot finish an empty workout. Add at least one exercise.");
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

function getCompletedSetsCount(exercise: ActiveExercise): number {
    if (!exercise.sets) return 0;

    return exercise.sets.filter((set) => set.completed).length;
}

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

function getExerciseName(exerciseId: string): string {
    return getExerciseById(exerciseId).name;
}

function getWorkoutTypeColor(): string {
    return "primary";
}

function getWorkoutTypeIcon(): string {
    return "mdi-timer";
}

function handleSaveExercise(index: number, updatedExercise: ExerciseEntry): void {
    if (!workout.value) return;

    workout.value.exerciseEntries[index] = updatedExercise;

    globalStore.notify(`Exercise updated`);
    globalDialog.closeLatestDialog();
}

function hasActualSets(index: number): boolean {
    const exercise = workout.value?.exerciseEntries[index];
    if (!exercise) return false;

    return isStrengthExercise(exercise);
}

function removeExercise(index: number): void {
    if (!workout.value) {
        return;
    }

    if (isActive.value) {
        activeWorkoutStore.removeExerciseFromWorkout(index);
    } else {
        workout.value.exerciseEntries.splice(index, 1);
    }

    globalStore.notify(`Exercise removed`);
}

function removeSet(exerciseIndex: number, setIndex: number): void {
    if (!workout.value) {
        return;
    }

    const exercise = workout.value.exerciseEntries[exerciseIndex];

    if (!isStrengthExercise(exercise)) {
        return;
    }

    const sets = exercise.sets;

    if (!sets || sets.length <= 1) return;

    sets.splice(setIndex, 1);

    if (isActive.value) {
        activeWorkoutStore.saveToLocalStorage();
    }

    globalStore.notify("Set removed");
}

async function saveWorkout(): Promise<void> {
    if (!workout.value || isActiveWorkout(workout.value)) return;

    try {
        workout.value.overallNotes = editedNotes.value.trim();

        globalStore.setLoading(true);
        await updateWorkout(authStore.nonNullableUser.uid, workout.value.id, workout.value);

        // Update original to reflect the saved state
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

function toggleExercise(index: number): void {
    if (!workout.value) return;
    if (!isActiveWorkout(workout.value)) return;
    activeWorkoutStore.toggleExerciseCompletion(index);
}

function toggleSet(exerciseIndex: number, setIndex: number): void {
    if (!workout.value) return;
    if (!isActiveWorkout(workout.value)) return;

    activeWorkoutStore.toggleSetCompletion(exerciseIndex, setIndex);

    // Check all sets' status after toggling
    const exercise = (workout.value as ActiveWorkout).exerciseEntries[exerciseIndex];
    if (exercise.sets) {
        const allCompleted = exercise.sets.every((set) => set.completed);

        // Update exercise status without toggling sets again
        if (allCompleted && !exercise.completed) {
            // All sets completed but exercise marked incomplete - mark complete
            exercise.completed = true;
            activeWorkoutStore.saveToLocalStorage();
        } else if (!allCompleted && exercise.completed) {
            // Not all sets completed but exercise marked complete - mark incomplete
            exercise.completed = false;
            activeWorkoutStore.saveToLocalStorage();
        }
    }
}

function updateSet(exerciseIndex: number, setIndex: number, reps: number, weight: number): void {
    if (!workout.value) return;
    if (isActiveWorkout(workout.value)) {
        activeWorkoutStore.updateSetData(exerciseIndex, setIndex, reps, weight);
        return;
    }

    const exercise = workout.value.exerciseEntries[exerciseIndex];
    if (!isStrengthExercise(exercise)) {
        return;
    }

    // For saved workouts, just update the values directly
    const sets = exercise.sets;
    sets[setIndex].reps = reps;
    sets[setIndex].weight = weight;
}
</script>

<style scoped>
.completed-exercise {
    opacity: 0.7;
    background-color: rgba(76, 175, 80, 0.1);
}

.narrow-input {
    max-width: 85px;
}

.workout-name {
    cursor: pointer;
}

.workout-name:hover {
    text-decoration: underline;
    text-decoration-style: dotted;
}

:deep(.v-expansion-panel-text__wrapper) {
    padding-left: 10px !important;
    padding-right: 10px !important;
}

/* Column width classes */
.set-column {
    width: 15%;
}

.reps-column,
.weight-column {
    width: 25%;
}

.complete-column {
    width: 15%;
}

.action-column {
    width: 5%;
}
</style>
