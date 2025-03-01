<template>
    <v-container class="pa-2 mx-auto">
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
        <ExerciseCarousel v-model="activeExerciseIndex" :workout="workout" />

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

import type { CardioWorkout, CircuitWorkout, StrengthWorkout, Workout } from "../types/workout";

import ExerciseCarousel from "../components/workout-logger/ExerciseCarousel.vue";
import WorkoutTypeSelector from "../components/workout-logger/WorkoutTypeSelector.vue";
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

const workout = ref<CardioWorkout | CircuitWorkout | StrengthWorkout>({
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
    } else if (isCardioWorkout(workout.value)) {
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

onBeforeMount(function () {
    if (isEditing.value && workoutId) {
        loadWorkout(workoutId);
    }
});

function handleTypeChange(type: Workout["type"]): void {
    if (type === "circuit") {
        globalStore.notify("Circuit workout logging coming soon!");
        return;
    }

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
