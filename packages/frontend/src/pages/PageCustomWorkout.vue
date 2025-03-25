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

                <div v-else>
                    <v-form ref="exercisesForm">
                        <!-- Exercises / Activities Cards -->
                        <v-card
                            v-for="(exercise, index) in exerciseEntries"
                            :key="index"
                            class="mb-3 rounded-lg"
                            :class="{
                                'completed-exercise':
                                    isActiveExercise(exercise) && exercise.completed,
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
                                        <v-skeleton-loader
                                            v-if="isLoadingNames"
                                            type="text"
                                            width="180"
                                            class="font-weight-medium my-1"
                                        ></v-skeleton-loader>
                                        <div v-else class="font-weight-medium">
                                            {{ getExerciseName(exercise.exerciseId) }}
                                        </div>
                                        <div class="text-caption text-grey-lighten-1">
                                            <template v-if="isCardioExercise(exercise)">
                                                {{
                                                    getMinutesFromSeconds(exercise.durationSeconds)
                                                }}
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
                                                    <v-chip size="x-small" class="ml-2">
                                                        <template v-if="isActiveExercise(exercise)">
                                                            {{ getCompletedSetsCount(exercise) }}/{{
                                                                exercise.sets?.length
                                                            }}
                                                        </template>
                                                        <template v-else>{{
                                                            exercise.sets?.length
                                                        }}</template>
                                                    </v-chip>
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
                                                            <th scope="col" class="set-column">
                                                                Set
                                                            </th>
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
                                                                    :rules="[nonZeroPositive]"
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
                                                                    :disabled="
                                                                        !set.reps || set.reps <= 0
                                                                    "
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
                                                                    @click="
                                                                        removeSet(index, setIndex)
                                                                    "
                                                                    :disabled="
                                                                        exercise.sets?.length <= 1
                                                                    "
                                                                ></v-btn>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </v-table>

                                                <v-divider class="my-3"></v-divider>

                                                <!-- Notes field for strength exercises -->
                                                <v-textarea
                                                    v-model="exercise.exerciseNotes"
                                                    label="Notes"
                                                    variant="outlined"
                                                    density="comfortable"
                                                    hide-details
                                                    rows="2"
                                                    auto-grow
                                                    class="mt-2"
                                                    @update:model-value="updateStrengthNotes(index)"
                                                ></v-textarea>
                                            </v-expansion-panel-text>
                                        </v-expansion-panel>
                                    </v-expansion-panels>
                                </div>

                                <!-- Show details for cardio exercises  -->
                                <div v-if="isCardioExercise(exercise)" class="mt-3">
                                    <v-expansion-panels variant="accordion">
                                        <v-expansion-panel>
                                            <v-expansion-panel-title>
                                                <div class="d-flex align-center">
                                                    <v-icon size="small" class="mr-2"
                                                        >mdi-run</v-icon
                                                    >
                                                    Cardio Details
                                                </div>
                                            </v-expansion-panel-title>
                                            <v-expansion-panel-text>
                                                <v-row>
                                                    <v-col cols="6">
                                                        <v-text-field
                                                            :model-value="
                                                                getMinutesFromSeconds(
                                                                    exercise.durationSeconds,
                                                                )
                                                            "
                                                            @update:model-value="
                                                                updateDuration(
                                                                    index,
                                                                    Number($event),
                                                                )
                                                            "
                                                            label="Duration (minutes)"
                                                            type="number"
                                                            variant="outlined"
                                                            density="comfortable"
                                                            min="1"
                                                            :rules="[nonZeroPositive]"
                                                            hide-details
                                                            class="mb-2"
                                                        ></v-text-field>
                                                    </v-col>
                                                    <v-col cols="6">
                                                        <v-text-field
                                                            v-model.number="exercise.distanceKm"
                                                            label="Distance (km)"
                                                            type="number"
                                                            variant="outlined"
                                                            density="comfortable"
                                                            min="0"
                                                            step="0.1"
                                                            hide-details
                                                            class="mb-2"
                                                        ></v-text-field>
                                                    </v-col>
                                                    <v-col cols="6">
                                                        <v-text-field
                                                            v-model.number="exercise.calories"
                                                            label="Calories (Kcal)"
                                                            type="number"
                                                            variant="outlined"
                                                            density="comfortable"
                                                            min="0"
                                                            hide-details
                                                            class="mb-2"
                                                        ></v-text-field>
                                                    </v-col>
                                                    <v-col cols="6">
                                                        <v-select
                                                            v-model="exercise.intensity"
                                                            label="Intensity"
                                                            :items="intensityOptions"
                                                            variant="outlined"
                                                            density="comfortable"
                                                            hide-details
                                                            class="mb-2"
                                                        ></v-select>
                                                    </v-col>
                                                    <v-col cols="12">
                                                        <v-textarea
                                                            v-model="exercise.exerciseNotes"
                                                            label="Notes"
                                                            variant="outlined"
                                                            density="comfortable"
                                                            hide-details
                                                            rows="2"
                                                            auto-grow
                                                            class="mb-2"
                                                        ></v-textarea>
                                                    </v-col>
                                                </v-row>
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
                    </v-form>
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
import { storeToRefs } from "pinia";
import { computed, onMounted, ref, useTemplateRef, watch } from "vue";
import { useRouter } from "vue-router";

import type {
    ActiveExercise,
    ActiveSet,
    ActiveWorkout,
    ExerciseEntry,
    Workout,
    WorkoutWithId,
} from "../types/workout";

import AddExerciseToWorkout from "../components/workout/AddExerciseToWorkout.vue";
import { globalDialog } from "../composables/useDialog";
import {
    getDateFromMaybeTimestamp,
    getMinutesFromSeconds,
    getSecondsFromMinutes,
    ONE_HOUR,
    ONE_MINUTE,
    ONE_SECOND,
} from "../helpers/date-utils";
import { nonZeroPositive } from "../helpers/form-validators";
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
import { useExerciseStore } from "../stores/exercises";
import { useGlobalStore } from "../stores/global";

const { id: workoutId } = defineProps<{ id?: string }>();

const router = useRouter();
const exerciseStore = useExerciseStore();
const activeWorkoutStore = useActiveWorkoutStore();
const globalStore = useGlobalStore();
const authStore = useAuthStore();

const { exerciseCache, pendingLookups } = storeToRefs(exerciseStore);

const isActive = computed(() => !workoutId);
const intensityOptions = ["low", "medium", "high"];
const exercisesForm = useTemplateRef("exercisesForm");
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

const exerciseIds = computed(() => {
    if (!workout.value) return [];
    return workout.value.exerciseEntries.map((entry) => entry.exerciseId);
});

const isLoadingNames = computed(() => {
    return exerciseIds.value.some((id) => pendingLookups.value.has(id));
});

function getExerciseName(exerciseId: string): string {
    if (pendingLookups.value.has(exerciseId)) {
        return "Loading...";
    }

    if (exerciseCache.value[exerciseId]) {
        return exerciseCache.value[exerciseId].name;
    }

    exerciseStore.getExerciseById(exerciseId);

    return "Loading...";
}

function updateDuration(index: number, minutes: number): void {
    if (!workout.value) return;

    const exercise = workout.value.exerciseEntries[index];
    if (!isCardioExercise(exercise)) return;

    exercise.durationSeconds = getSecondsFromMinutes(minutes);

    if (isActiveWorkout(workout.value)) {
        activeWorkoutStore.saveToLocalStorage();
    }
}

function updateStrengthNotes(index: number): void {
    if (!workout.value) return;

    const exercise = workout.value.exerciseEntries[index];
    if (!isStrengthExercise(exercise)) return;

    if (isActive.value && isActiveWorkout(workout.value)) {
        activeWorkoutStore.saveToLocalStorage();
    }
}

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

function addSet(exerciseIndex: number): void {
    if (!workout.value) {
        return;
    }

    const exercise = workout.value.exerciseEntries[exerciseIndex];
    if (!isStrengthExercise(exercise)) {
        return;
    }

    exercise.sets ??= [];
    const sets = exercise.sets;
    const setDefault = { reps: 0, weight: 0 };
    const newSet = isActive.value
        ? {
              completed: false,
              ...setDefault,
          }
        : setDefault;
    sets.push(newSet);

    if (isActive.value) {
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
        AddExerciseToWorkout,
        {
            existingExercise: cloneDeep(exercise),
            isEditMode: true,
            onSave(updatedExercise: ExerciseEntry) {
                handleSaveExercise(index, updatedExercise);
            },
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

function handleSaveExercise(index: number, updatedExercise: ExerciseEntry): void {
    if (!workout.value) return;

    if (
        isStrengthExercise(updatedExercise) &&
        workout.value.exerciseEntries[index] &&
        isStrengthExercise(workout.value.exerciseEntries[index]) &&
        (!updatedExercise.sets || updatedExercise.sets.length === 0)
    ) {
        updatedExercise.sets = workout.value.exerciseEntries[index].sets;
    }

    workout.value.exerciseEntries[index] = updatedExercise;

    globalStore.notify(`Exercise updated`);
    globalDialog.closeLatestDialog();
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

function toggleExercise(index: number): void {
    if (!workout.value) return;
    if (!isActiveWorkout(workout.value)) return;
    activeWorkoutStore.toggleExerciseCompletion(index);
}

function toggleSet(exerciseIndex: number, setIndex: number): void {
    if (!workout.value) return;
    if (!isActiveWorkout(workout.value)) return;

    activeWorkoutStore.toggleSetCompletion(exerciseIndex, setIndex);
    activeWorkoutStore.saveToLocalStorage();
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

.workout-container {
    padding-bottom: 72px;
}

@keyframes shimmer {
    0% {
        background-position: -200% 0;
    }
    100% {
        background-position: 200% 0;
    }
}

@media (min-width: 600px) {
    .workout-container {
        padding-bottom: 64px;
    }
}
</style>
