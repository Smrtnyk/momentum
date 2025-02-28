<template>
    <v-container fluid class="pa-4 pa-sm-6 mx-auto">
        <!-- Workout Type Selection -->
        <WorkoutTypeSelector :model-value="workout.type" @update:model-value="handleTypeChange" />

        <!-- Workout Metadata -->
        <v-card class="mb-6" elevation="2">
            <v-card-text>
                <v-row dense>
                    <v-col cols="12" md="6">
                        <v-text-field
                            v-model="workout.name"
                            variant="outlined"
                            label="Workout Name"
                            density="comfortable"
                            :rules="[required]"
                            clearable
                        />
                    </v-col>

                    <v-col cols="6">
                        <v-menu>
                            <template #activator="{ props }">
                                <v-text-field
                                    v-model="formattedWorkoutDate"
                                    variant="outlined"
                                    density="comfortable"
                                    label="Date"
                                    prepend-inner-icon="mdi-calendar"
                                    readonly
                                    v-bind="props"
                                />
                            </template>
                            <v-date-picker v-model="workoutDate" />
                        </v-menu>
                    </v-col>

                    <v-col cols="6">
                        <v-menu>
                            <template #activator="{ props }">
                                <v-text-field
                                    v-model="formattedWorkoutTime"
                                    variant="outlined"
                                    density="comfortable"
                                    label="Start time"
                                    prepend-inner-icon="mdi-clock-outline"
                                    readonly
                                    v-bind="props"
                                />
                            </template>
                            <v-time-picker v-model="workoutTime" />
                        </v-menu>
                    </v-col>

                    <!-- Workout Duration (Strength only) -->
                    <v-col v-if="isStrengthWorkout(workout)" cols="12" md="3">
                        <v-text-field
                            v-model.number="workout.workoutDurationMinutes"
                            label="Duration (minutes)"
                            type="number"
                            variant="outlined"
                            :rules="[required, positiveNumber]"
                        />
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>

        <!-- Exercise Section Header with Count -->
        <div class="d-flex align-center mb-2">
            <div class="text-h5">Exercises</div>
            <v-chip class="ml-2 text-caption" size="small" color="primary" variant="tonal">
                {{ workout.exerciseEntries.length }}
            </v-chip>
            <v-spacer></v-spacer>
            <v-btn
                color="primary"
                variant="tonal"
                size="small"
                @click="addExercise"
                prepend-icon="mdi-plus"
            >
                Add {{ isStrengthWorkout(workout) ? "Exercise" : "Activity" }}
            </v-btn>
        </div>

        <!-- Exercise Carousel Section -->
        <v-card v-if="workout.exerciseEntries.length > 0" class="mb-6" elevation="2">
            <v-card-text class="pa-0">
                <!-- Carousel Navigation Header -->
                <div class="d-flex align-center px-4 pt-4">
                    <v-btn
                        icon="mdi-chevron-left"
                        variant="text"
                        :disabled="activeExerciseIndex === 0"
                        @click="navigateExercise(-1)"
                        density="comfortable"
                    ></v-btn>

                    <div
                        class="text-subtitle-1 font-weight-medium mx-auto text-center exercise-title"
                    >
                        {{
                            getExerciseName(workout.exerciseEntries[activeExerciseIndex]) ||
                            (isStrengthWorkout(workout)
                                ? `Exercise ${activeExerciseIndex + 1}`
                                : `Cardio Activity ${activeExerciseIndex + 1}`)
                        }}
                    </div>

                    <v-btn
                        icon="mdi-chevron-right"
                        variant="text"
                        :disabled="activeExerciseIndex === workout.exerciseEntries.length - 1"
                        @click="navigateExercise(1)"
                        density="comfortable"
                    ></v-btn>

                    <v-btn
                        icon="mdi-delete"
                        variant="text"
                        color="error"
                        @click="removeExercise(activeExerciseIndex)"
                        :disabled="workout.exerciseEntries.length <= 1"
                        density="comfortable"
                    ></v-btn>
                </div>

                <!-- Carousel Indicators -->
                <div class="d-flex justify-center my-2">
                    <div class="exercise-indicators">
                        <div
                            v-for="(_, idx) in workout.exerciseEntries"
                            :key="idx"
                            class="exercise-indicator"
                            :class="{ active: idx === activeExerciseIndex }"
                            @click="activeExerciseIndex = idx"
                        ></div>
                    </div>
                </div>

                <!-- Exercise Content -->
                <v-window v-model="activeExerciseIndex" class="exercise-carousel">
                    <template v-if="isStrengthWorkout(workout)">
                        <v-window-item
                            v-for="(entry, idx) in workout.exerciseEntries"
                            :key="idx"
                            class="pa-4"
                        >
                            <!-- Strength Exercise Content -->
                            <v-autocomplete
                                v-model="entry.exerciseId"
                                :items="exercises"
                                item-title="name"
                                item-value="id"
                                label="Select Exercise"
                                variant="outlined"
                                :rules="[required]"
                                clearable
                            />

                            <div class="text-subtitle-1 mt-4 mb-2 d-flex align-center">
                                <span>Sets</span>
                                <v-spacer></v-spacer>
                                <v-btn
                                    density="comfortable"
                                    size="small"
                                    color="primary"
                                    variant="text"
                                    @click="addSet(idx)"
                                    prepend-icon="mdi-plus"
                                >
                                    Add Set
                                </v-btn>
                            </div>

                            <v-table density="compact">
                                <thead>
                                    <tr>
                                        <th width="20%">Set</th>
                                        <th width="35%">Reps</th>
                                        <th width="35%">Weight</th>
                                        <th width="10%"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(set, sIdx) in entry.sets" :key="sIdx">
                                        <td class="text-center">{{ sIdx + 1 }}</td>
                                        <td>
                                            <v-text-field
                                                v-model.number="set.reps"
                                                type="number"
                                                variant="underlined"
                                                density="compact"
                                                hide-details
                                            />
                                        </td>
                                        <td>
                                            <v-text-field
                                                v-model.number="set.weight"
                                                type="number"
                                                variant="underlined"
                                                density="compact"
                                                suffix="kg"
                                                hide-details
                                            />
                                        </td>
                                        <td class="text-center">
                                            <v-btn
                                                icon
                                                variant="text"
                                                color="error"
                                                size="small"
                                                @click="removeSet(idx, sIdx)"
                                                :disabled="entry.sets.length <= 1"
                                            >
                                                <v-icon>mdi-delete</v-icon>
                                            </v-btn>
                                        </td>
                                    </tr>
                                </tbody>
                            </v-table>
                        </v-window-item>
                    </template>

                    <template v-if="isCardioWorkout(workout)">
                        <v-window-item
                            v-for="(entry, idx) in workout.exerciseEntries"
                            :key="idx"
                            class="pa-4"
                        >
                            <!-- Cardio Exercise Content -->
                            <v-autocomplete
                                v-model="entry.exerciseId"
                                :items="exercises"
                                item-title="name"
                                item-value="id"
                                label="Select Activity"
                                variant="outlined"
                                :rules="[required]"
                                clearable
                            />

                            <v-row class="mt-2">
                                <v-col cols="6">
                                    <v-text-field
                                        v-model.number="entry.durationMinutes"
                                        type="number"
                                        label="Duration"
                                        suffix="minutes"
                                        variant="outlined"
                                        :rules="[required]"
                                    />
                                </v-col>

                                <v-col cols="6">
                                    <v-text-field
                                        v-model.number="entry.distanceKm"
                                        type="number"
                                        label="Distance"
                                        suffix="km"
                                        variant="outlined"
                                        step="0.1"
                                    />
                                </v-col>

                                <v-col cols="6">
                                    <v-select
                                        v-model="entry.intensity"
                                        :items="intensityLevels"
                                        label="Intensity"
                                        variant="outlined"
                                    />
                                </v-col>

                                <v-col cols="6">
                                    <v-text-field
                                        v-model.number="entry.calories"
                                        type="number"
                                        label="Calories"
                                        suffix="kcal"
                                        variant="outlined"
                                    />
                                </v-col>
                            </v-row>
                        </v-window-item>
                    </template>
                </v-window>
            </v-card-text>
        </v-card>

        <!-- Workout Notes -->
        <v-card class="mb-6" elevation="2">
            <v-card-title class="text-h6">
                <v-icon left size="small" class="mr-2">mdi-note-text</v-icon>
                Workout Notes
            </v-card-title>
            <v-card-text>
                <v-textarea
                    v-model="workout.overallNotes"
                    variant="outlined"
                    label="Additional notes..."
                    rows="3"
                    auto-grow
                />
            </v-card-text>
        </v-card>

        <!-- Submit Section -->
        <v-card elevation="2">
            <v-card-text class="text-center py-4">
                <v-btn
                    size="large"
                    color="success"
                    :loading="isSubmitting"
                    @click="submitWorkout"
                    class="px-8"
                >
                    <v-icon left>mdi-check</v-icon>
                    {{ isEditing ? "Update Workout" : "Save Workout" }}
                </v-btn>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
import { Timestamp } from "firebase/firestore";
import { computed, onBeforeMount, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useDate } from "vuetify";

import type { CardioWorkout, StrengthWorkout, Workout } from "../types/workout";

import WorkoutTypeSelector from "../components/workout-logger/WorkoutTypeSelector.vue";
import { cardioExercises } from "../data/cardio-exercises";
import { strengthExercises } from "../data/strength-exercises";
import { positiveNumber, required } from "../helpers/form-validators";
import {
    addWorkout,
    getWorkoutById,
    isCardioWorkout,
    isStrengthWorkout,
    updateWorkout,
} from "../services/workout";
import { useAuthStore } from "../stores/auth";
import { useGlobalStore } from "../stores/global";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const globalStore = useGlobalStore();
// If there's an ID parameter, we're editing
const workoutId = route.params.id as string | undefined;
const isEditing = ref(Boolean(workoutId));
const activeExerciseIndex = ref(0);

const workout = ref<CardioWorkout | StrengthWorkout>({
    date: Timestamp.fromDate(new Date()),
    exerciseEntries: [
        {
            exerciseId: "",
            sets: [{ reps: 0, weight: 0 }],
            type: "strength",
        },
    ],
    name: "Workout",
    overallNotes: "",
    type: "strength",
    userId: authStore.nonNullableUser.uid,
    workoutDurationMinutes: 0,
} as StrengthWorkout);
const workoutDate = ref(new Date());
const workoutTime = ref(
    new Date().toLocaleTimeString([], {
        hour: "2-digit",
        hour12: false,
        minute: "2-digit",
    }),
);
const formattedWorkoutTime = computed(function (): string {
    return workoutTime.value;
});

const exercises = computed(function () {
    return workout.value.type === "strength" ? strengthExercises : cardioExercises;
});
const intensityLevels = ["low", "medium", "high"];

function getExerciseName(entry: { exerciseId: string }): string {
    const exercise = exercises.value.find(function ({ id }) {
        return id === entry.exerciseId;
    });
    return exercise?.name || "";
}

const isSubmitting = ref(false);

const dateAdapter = useDate();
const formattedWorkoutDate = computed(function (): string {
    return dateAdapter.format(workoutDate.value, "keyboardDate");
});

watch(workoutDate, function (newDate) {
    const combinedDateTime = combineDateAndTime(newDate, workoutTime.value);
    workout.value.date = Timestamp.fromDate(combinedDateTime);
});

watch(workoutTime, function (newTime) {
    const combinedDateTime = combineDateAndTime(workoutDate.value, newTime);
    workout.value.date = Timestamp.fromDate(combinedDateTime);
});

function addExercise(): void {
    if (isStrengthWorkout(workout.value)) {
        workout.value.exerciseEntries.push({
            exerciseId: "",
            sets: [{ reps: 0, weight: 0 }],
            type: "strength",
        });
    } else {
        workout.value.exerciseEntries.push({
            calories: 0,
            durationMinutes: 30,
            exerciseId: "",
            intensity: "medium",
            type: "cardio",
        });
    }
    // Auto-navigate to the new exercise
    activeExerciseIndex.value = workout.value.exerciseEntries.length - 1;
}

function combineDateAndTime(date: Date, timeStr: string): Date {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes);
}

function navigateExercise(direction: number): void {
    const newIndex = activeExerciseIndex.value + direction;
    if (newIndex >= 0 && newIndex < workout.value.exerciseEntries.length) {
        activeExerciseIndex.value = newIndex;
    }
}

onBeforeMount(function () {
    if (isEditing.value && workoutId) {
        loadWorkout(workoutId);
    }
});

function addSet(exerciseIndex: number): void {
    if (isStrengthWorkout(workout.value)) {
        workout.value.exerciseEntries[exerciseIndex].sets.push({
            reps: 0,
            weight: 0,
        });
    }
}

function handleTypeChange(type: Workout["type"]): void {
    workout.value = {
        ...workout.value,
        exerciseEntries: [
            {
                exerciseId: "",
                ...(type === "strength"
                    ? { sets: [{ reps: 0, weight: 0 }], type: "strength" }
                    : { calories: 0, durationMinutes: 30, intensity: "medium", type: "cardio" }),
            },
        ],
        type,
    } as Workout;
    activeExerciseIndex.value = 0;
}

async function loadWorkout(id: string): Promise<void> {
    try {
        const loadedWorkout = await getWorkoutById(authStore.nonNullableUser.uid, id);
        workout.value = loadedWorkout;

        const dateTime = loadedWorkout.date.toDate();
        workoutDate.value = dateTime;

        workoutTime.value = dateTime.toLocaleTimeString([], {
            hour: "2-digit",
            hour12: false,
            minute: "2-digit",
        });
    } catch (error) {
        globalStore.notifyError("Failed to load workout for editing.");
    }
}

function removeExercise(index: number): void {
    if (workout.value.exerciseEntries.length > 1) {
        workout.value.exerciseEntries.splice(index, 1);

        if (activeExerciseIndex.value >= workout.value.exerciseEntries.length) {
            activeExerciseIndex.value = workout.value.exerciseEntries.length - 1;
        }
    }
}

function removeSet(exerciseIndex: number, setIndex: number): void {
    if (isStrengthWorkout(workout.value)) {
        const sets = workout.value.exerciseEntries[exerciseIndex].sets;
        if (sets.length > 1) {
            sets.splice(setIndex, 1);
        }
    }
}

async function submitWorkout(): Promise<void> {
    for (const entry of workout.value.exerciseEntries) {
        if (!entry.exerciseId) {
            globalStore.notifyError("Please select an exercise for all entries.");
            return;
        }
    }

    if (isStrengthWorkout(workout.value) && workout.value.workoutDurationMinutes < 0) {
        globalStore.notifyError("Please enter a valid workout duration");
        return;
    }

    workout.value.userId = authStore.nonNullableUser.uid;
    const combinedDateTime = combineDateAndTime(workoutDate.value, workoutTime.value);
    workout.value.date = Timestamp.fromDate(combinedDateTime);

    try {
        isSubmitting.value = true;
        if (isEditing.value && workoutId) {
            await updateWorkout(authStore.nonNullableUser.uid, workoutId, workout.value);
            globalStore.notify("Workout updated successfully!");
            await router.replace({ name: "WorkoutDetail", params: { id: workoutId } });
        } else {
            const newWorkoutId = await addWorkout(workout.value);
            globalStore.notify("Workout logged successfully!");
            await router.replace({ name: "WorkoutDetail", params: { id: newWorkoutId } });
        }
    } catch (error) {
        globalStore.notifyError(error);
    } finally {
        isSubmitting.value = false;
    }
}
</script>

<style>
.exercise-carousel {
    min-height: 300px;
    position: relative;
}

.exercise-indicators {
    display: flex;
    gap: 8px;
    margin: 12px 0;
}

.exercise-indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.2);
    cursor: pointer;
    transition: all 0.3s ease;
}

.exercise-indicator.active {
    background-color: rgb(var(--v-theme-primary));
    width: 24px;
    border-radius: 4px;
}

.exercise-title {
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* Fade transition for carousel */
.v-window-item {
    transition: opacity 0.5s ease;
}
</style>
