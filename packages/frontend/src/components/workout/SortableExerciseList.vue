<template>
    <div ref="sortableContainer" class="sortable-container">
        <v-card
            v-for="(exercise, index) in localExerciseEntries"
            :key="index"
            class="mb-3 rounded-lg sortable-item"
            :class="{
                'completed-exercise': isActiveExercise(exercise) && exercise.completed,
            }"
            :data-id="index"
        >
            <div class="pa-3 px-2">
                <div class="d-flex align-center">
                    <v-btn
                        icon="mdi-drag-horizontal-variant"
                        variant="text"
                        color="grey-lighten-1"
                        class="handle"
                        size="small"
                    ></v-btn>

                    <!-- Completion toggle (only for active workouts) -->
                    <v-btn
                        v-if="isActiveExercise(exercise)"
                        :icon="exercise.completed ? 'mdi-check-circle' : 'mdi-circle-outline'"
                        :color="exercise.completed ? 'success' : 'grey-lighten-2'"
                        variant="text"
                        @click="toggleExercise(index)"
                        :disabled="
                            !exercise.completed &&
                            isStrengthExercise(exercise) &&
                            !isExerciseEligibleForCompletion(exercise)
                        "
                    />

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
                                {{ getMinutesFromSeconds(exercise.durationSeconds) }}
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
                                    <v-icon size="small" class="mr-2">mdi-clipboard-list</v-icon>
                                    Sets
                                    <v-chip size="x-small" class="ml-2">
                                        <template v-if="isActiveExercise(exercise)">
                                            {{ getCompletedSetsCount(exercise) }}/{{
                                                exercise.sets?.length
                                            }}
                                        </template>
                                        <template v-else>{{ exercise.sets?.length }}</template>
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
                                            <th scope="col" class="set-column">Set</th>
                                            <th scope="col" class="reps-column">Reps</th>
                                            <th scope="col" class="weight-column">Weight</th>
                                            <th
                                                scope="col"
                                                class="complete-column"
                                                v-if="isActiveWorkout(workout)"
                                            ></th>
                                            <th scope="col" class="action-column text-center"></th>
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
                                                    :disabled="
                                                        isActiveExercise(exercise) &&
                                                        (set as ActiveSet).completed
                                                    "
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
                                                    :disabled="
                                                        isActiveExercise(exercise) &&
                                                        (set as ActiveSet).completed
                                                    "
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
                                                    :disabled="!set.reps || set.reps <= 0"
                                                    :model-value="(set as ActiveSet).completed"
                                                    hide-details
                                                    @update:model-value="toggleSet(index, setIndex)"
                                                ></v-checkbox>
                                            </td>

                                            <td class="text-center">
                                                <v-btn
                                                    icon="mdi-delete"
                                                    size="x-small"
                                                    color="error"
                                                    variant="text"
                                                    @click="removeSet(index, setIndex)"
                                                    :disabled="exercise.sets?.length <= 1"
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
                                    <v-icon size="small" class="mr-2">mdi-run</v-icon>
                                    Cardio Details
                                </div>
                            </v-expansion-panel-title>
                            <v-expansion-panel-text>
                                <v-row>
                                    <v-col cols="6">
                                        <v-text-field
                                            :model-value="
                                                getMinutesFromSeconds(exercise.durationSeconds)
                                            "
                                            @update:model-value="
                                                updateDuration(index, Number($event))
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
                <div v-if="exercise.exerciseNotes" class="mt-3 text-caption text-grey-lighten-2">
                    <v-icon size="small" class="mr-1">mdi-note-text</v-icon>
                    {{ exercise.exerciseNotes }}
                </div>
            </div>
        </v-card>
    </div>
</template>
<script setup lang="ts">
import { useSortable } from "@vueuse/integrations/useSortable";
import { cloneDeep } from "es-toolkit";
import { storeToRefs } from "pinia";
import { computed, nextTick, onMounted, ref } from "vue";

import type {
    ActiveExercise,
    ActiveSet,
    ActiveWorkout,
    ExerciseEntry,
    Workout,
    WorkoutWithId,
} from "../../types/workout";

import { globalDialog } from "../../composables/useDialog";
import { getMinutesFromSeconds, getSecondsFromMinutes } from "../../helpers/date-utils";
import { nonZeroPositive } from "../../helpers/form-validators";
import {
    isActiveExercise,
    isActiveWorkout,
    isCardioExercise,
    isStrengthExercise,
} from "../../services/workout";
import { useActiveWorkoutStore } from "../../stores/active-workout";
import { useExerciseStore } from "../../stores/exercises";
import { useGlobalStore } from "../../stores/global";
import AddExerciseToWorkout from "./AddExerciseToWorkout.vue";

const { isActive, workout } = defineProps<{
    isActive: boolean;
    workout: ActiveWorkout | WorkoutWithId;
}>();

const exerciseStore = useExerciseStore();
const globalStore = useGlobalStore();
const activeWorkoutStore = useActiveWorkoutStore();
const { exerciseCache, pendingLookups } = storeToRefs(exerciseStore);
const intensityOptions = ["low", "medium", "high"];

const sortableContainer = ref<HTMLElement | null>(null);
const sortableInitialized = ref(false);
const localExerciseEntries = computed({
    get() {
        return workout.exerciseEntries;
    },
    set(newEntries: ExerciseEntry[]): void {
        workout.exerciseEntries = newEntries;
    },
});
const exerciseIds = computed(() => {
    return workout.exerciseEntries.map((entry) => entry.exerciseId);
});

const isLoadingNames = computed(() => {
    return exerciseIds.value.some((id) => pendingLookups.value.has(id));
});

onMounted(async () => {
    await nextTick();

    if (
        sortableContainer.value &&
        localExerciseEntries.value.length > 0 &&
        !sortableInitialized.value
    ) {
        useSortable(sortableContainer.value, localExerciseEntries.value, {
            animation: 150,
            handle: ".handle",
            onUpdate: handleSortEnd,
        });

        sortableInitialized.value = true;
    }
});

function addSet(exerciseIndex: number): void {
    const exercise = workout.exerciseEntries[exerciseIndex];
    if (!isStrengthExercise(exercise)) {
        return;
    }

    exercise.sets ??= [];
    const sets = exercise.sets;
    const setDefault = { reps: 0, weight: 0 };
    const newSet = isActive
        ? {
              completed: false,
              ...setDefault,
          }
        : setDefault;
    sets.push(newSet);

    if (isActive) {
        activeWorkoutStore.saveToLocalStorage();
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

function getCompletedSetsCount(exercise: ActiveExercise): number {
    if (!exercise.sets) return 0;

    return exercise.sets.filter((set) => set.completed).length;
}

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

function handleSaveExercise(index: number, updatedExercise: ExerciseEntry): void {
    if (
        isStrengthExercise(updatedExercise) &&
        workout.exerciseEntries[index] &&
        isStrengthExercise(workout.exerciseEntries[index]) &&
        (!updatedExercise.sets || updatedExercise.sets.length === 0)
    ) {
        updatedExercise.sets = workout.exerciseEntries[index].sets;
    }

    workout.exerciseEntries[index] = updatedExercise;

    globalStore.notify(`Exercise updated`);
    globalDialog.closeLatestDialog();
}

function handleSortEnd(): void {
    if (isActiveWorkout(workout)) {
        activeWorkoutStore.saveToLocalStorage();
    }
}

function isExerciseEligibleForCompletion(exercise: ActiveExercise): boolean {
    if (!isStrengthExercise(exercise) || !exercise.sets?.length) {
        return true;
    }

    return exercise.sets.every((set) => set.reps && set.reps > 0);
}

function removeExercise(index: number): void {
    if (isActive) {
        activeWorkoutStore.removeExerciseFromWorkout(index);
    } else {
        workout.exerciseEntries.splice(index, 1);
    }

    globalStore.notify(`Exercise removed`);
}

function removeSet(exerciseIndex: number, setIndex: number): void {
    const exercise = workout.exerciseEntries[exerciseIndex];

    if (!isStrengthExercise(exercise)) {
        return;
    }

    const sets = exercise.sets;

    if (!sets || sets.length <= 1) return;

    sets.splice(setIndex, 1);

    if (isActive) {
        activeWorkoutStore.saveToLocalStorage();
    }

    globalStore.notify("Set removed");
}

function toggleExercise(index: number): void {
    if (!isActiveWorkout(workout)) return;

    const exercise = workout.exerciseEntries[index];
    if (!isActiveExercise(exercise)) return;

    if (
        !exercise.completed &&
        isStrengthExercise(exercise) &&
        !isExerciseEligibleForCompletion(exercise)
    ) {
        globalStore.notifyError("Cannot complete exercise: one or more sets have invalid reps");
        return;
    }

    activeWorkoutStore.toggleExerciseCompletion(index);
}

function toggleSet(exerciseIndex: number, setIndex: number): void {
    if (!isActiveWorkout(workout)) return;

    activeWorkoutStore.toggleSetCompletion(exerciseIndex, setIndex);
    activeWorkoutStore.saveToLocalStorage();
}

function updateDuration(index: number, minutes: number): void {
    const exercise = workout.exerciseEntries[index];
    if (!isCardioExercise(exercise)) return;

    exercise.durationSeconds = getSecondsFromMinutes(minutes);

    if (isActiveWorkout(workout)) {
        activeWorkoutStore.saveToLocalStorage();
    }
}

function updateSet(exerciseIndex: number, setIndex: number, reps: number, weight: number): void {
    if (isActiveWorkout(workout)) {
        activeWorkoutStore.updateSetData(exerciseIndex, setIndex, reps, weight);
        return;
    }

    const exercise = workout.exerciseEntries[exerciseIndex];
    if (!isStrengthExercise(exercise)) {
        return;
    }

    const sets = exercise.sets;
    sets[setIndex].reps = reps;
    sets[setIndex].weight = weight;
}

function updateStrengthNotes(index: number): void {
    const exercise = workout.exerciseEntries[index];
    if (!isStrengthExercise(exercise)) return;

    if (isActive && isActiveWorkout(workout)) {
        activeWorkoutStore.saveToLocalStorage();
    }
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

.sortable-container {
    width: 100%;
}

.handle {
    cursor: grab;
    touch-action: none;
}

.handle:active {
    cursor: grabbing;
}
</style>
