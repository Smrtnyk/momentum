<template>
    <v-container fluid class="pa-4 pa-sm-6 max-width-800 mx-auto">
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

                    <!-- Workout Duration (Strength only) -->
                    <v-col v-if="isStrengthWorkout(workout)" cols="12" md="3">
                        <v-text-field
                            v-model.number="workout.workoutDurationMinutes"
                            label="Duration (minutes)"
                            type="number"
                            variant="outlined"
                            :rules="[required, positiveNumber]"
                            suffix="minutes"
                        />
                    </v-col>

                    <v-col cols="12" md="6">
                        <v-menu>
                            <template #activator="{ props }">
                                <v-text-field
                                    v-model="formattedWorkoutDate"
                                    variant="outlined"
                                    density="comfortable"
                                    label="Workout Date"
                                    prepend-inner-icon="mdi-calendar"
                                    readonly
                                    v-bind="props"
                                />
                            </template>
                            <v-date-picker v-model="workoutDate" />
                        </v-menu>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>

        <!-- Exercise Sections -->
        <div class="text-h5 mb-4">Exercises</div>

        <transition-group name="slide-fade">
            <template v-if="isStrengthWorkout(workout)">
                <div v-for="(entry, idx) in workout.exerciseEntries" :key="idx" class="mb-4">
                    <v-expansion-panels>
                        <!-- Strength Exercise -->
                        <v-expansion-panel elevation="2">
                            <v-expansion-panel-title class="d-flex align-center">
                                <v-icon left size="small" class="mr-2">mdi-dumbbell</v-icon>
                                {{ getExerciseName(entry) || `Exercise ${idx + 1}` }}
                                <v-spacer />
                                <v-btn icon @click="removeExercise(idx)" size="small" flat>
                                    <v-icon>mdi-close</v-icon>
                                </v-btn>
                            </v-expansion-panel-title>

                            <v-expansion-panel-text>
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

                                <div class="text-subtitle-1 mt-4 mb-2">Sets</div>

                                <v-table density="compact">
                                    <thead>
                                        <tr>
                                            <th>Set</th>
                                            <th>Reps</th>
                                            <th>Weight</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(set, sIdx) in entry.sets" :key="sIdx">
                                            <td>{{ sIdx + 1 }}</td>
                                            <td>
                                                <v-text-field
                                                    v-model.number="set.reps"
                                                    type="number"
                                                    variant="underlined"
                                                    density="compact"
                                                />
                                            </td>
                                            <td>
                                                <v-text-field
                                                    v-model.number="set.weight"
                                                    type="number"
                                                    variant="underlined"
                                                    density="compact"
                                                    suffix="kg"
                                                />
                                            </td>
                                            <td>
                                                <v-btn
                                                    icon
                                                    variant="text"
                                                    color="error"
                                                    @click="removeSet(idx, sIdx)"
                                                >
                                                    <v-icon>mdi-delete</v-icon>
                                                </v-btn>
                                            </td>
                                        </tr>
                                    </tbody>
                                </v-table>

                                <v-btn
                                    color="primary"
                                    variant="text"
                                    @click="addSet(idx)"
                                    class="mt-2"
                                >
                                    <v-icon left>mdi-plus</v-icon>
                                    Add Set
                                </v-btn>
                            </v-expansion-panel-text>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </div>
            </template>

            <template v-if="isCardioWorkout(workout)">
                <div v-for="(entry, idx) in workout.exerciseEntries" :key="idx" class="mb-4">
                    <!-- Cardio Exercise -->
                    <v-expansion-panels>
                        <v-expansion-panel elevation="2">
                            <v-expansion-panel-title class="d-flex align-center">
                                <v-icon left class="mr-2" size="small">mdi-run</v-icon>
                                {{ getExerciseName(entry) || `Cardio Activity ${idx + 1}` }}
                                <v-spacer />
                                <v-btn icon @click="removeExercise(idx)" size="small" flat>
                                    <v-icon>mdi-close</v-icon>
                                </v-btn>
                            </v-expansion-panel-title>

                            <v-expansion-panel-text>
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
                                    <v-col cols="12" md="4">
                                        <v-text-field
                                            v-model.number="entry.durationMinutes"
                                            type="number"
                                            label="Duration"
                                            suffix="minutes"
                                            variant="outlined"
                                            :rules="[required, positiveNumber]"
                                        />
                                    </v-col>

                                    <v-col cols="12" md="4">
                                        <v-text-field
                                            v-model.number="entry.distanceKm"
                                            type="number"
                                            label="Distance"
                                            suffix="km"
                                            variant="outlined"
                                            step="0.1"
                                        />
                                    </v-col>

                                    <v-col cols="12" md="4">
                                        <v-select
                                            v-model="entry.intensity"
                                            :items="intensityLevels"
                                            label="Intensity"
                                            variant="outlined"
                                        />
                                    </v-col>

                                    <v-col cols="12" md="4">
                                        <v-text-field
                                            v-model.number="entry.calories"
                                            type="number"
                                            label="Calories"
                                            suffix="kcal"
                                            variant="outlined"
                                            class="mt-2"
                                        />
                                    </v-col>
                                </v-row>
                            </v-expansion-panel-text>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </div>
            </template>
        </transition-group>

        <!-- Add Exercise Button -->
        <v-btn block color="primary" variant="tonal" class="my-4" @click="addExercise">
            <v-icon left>mdi-plus</v-icon>
            Add {{ isStrengthWorkout(workout) ? "Exercise" : "Activity" }}
        </v-btn>

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
            <v-card-text class="text-center">
                <v-btn x-large color="success" :loading="isSubmitting" @click="submitWorkout">
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

import WorkoutTypeSelector from "../components/WorkoutTypeSelector.vue";
import { getCardioExercises } from "../data/cardio-exercises";
import { getStrengthExercises } from "../data/strength-exercises";
import { auth } from "../firebase";
import { positiveNumber, required } from "../helpers/form-validators";
import {
    addWorkout,
    getWorkoutById,
    isCardioWorkout,
    isStrengthWorkout,
    updateWorkout,
} from "../services/workout";
import { useGlobalStore } from "../stores/global";

const router = useRouter();
const route = useRoute();
const globalStore = useGlobalStore();
// If there's an ID parameter, we're editing
const workoutId = route.params.id as string | undefined;
const isEditing = ref(Boolean(workoutId));

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
    userId: auth.currentUser?.uid || "",
    workoutDurationMinutes: 0,
} as StrengthWorkout);
const workoutDate = ref(new Date());
const exercises = computed(() => {
    return workout.value.type === "strength" ? getStrengthExercises() : getCardioExercises();
});
const intensityLevels = ["low", "medium", "high"];

function getExerciseName(entry: { exerciseId: string }): string {
    const exercise = exercises.value.find(({ id }) => id === entry.exerciseId);
    return exercise?.name || "";
}

const isSubmitting = ref(false);

const dateAdapter = useDate();
const formattedWorkoutDate = computed(() => dateAdapter.format(workoutDate.value, "keyboardDate"));

watch(workoutDate, function (newDate) {
    workout.value.date = Timestamp.fromDate(newDate);
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
}

onBeforeMount(() => {
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
}

async function loadWorkout(id: string): Promise<void> {
    try {
        const loadedWorkout = await getWorkoutById(id);
        workout.value = loadedWorkout;
        workoutDate.value = loadedWorkout.date.toDate();
    } catch (error) {
        globalStore.notifyError("Failed to load workout for editing.");
    }
}

function removeExercise(index: number): void {
    if (workout.value.exerciseEntries.length > 1) {
        workout.value.exerciseEntries.splice(index, 1);
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
    if (!auth.currentUser) {
        globalStore.notifyError("You must be logged in to log a workout.");
        return;
    }

    for (const entry of workout.value.exerciseEntries) {
        if (!entry.exerciseId) {
            globalStore.notifyError("Please select an exercise for all entries.");
            return;
        }
    }

    if (
        isStrengthWorkout(workout.value) &&
        (!workout.value.workoutDurationMinutes || workout.value.workoutDurationMinutes <= 0)
    ) {
        globalStore.notifyError("Please enter a valid workout duration");
        return;
    }

    workout.value.userId = auth.currentUser.uid;
    workout.value.date = Timestamp.fromDate(workout.value.date.toDate());

    try {
        if (isEditing.value && workoutId) {
            await updateWorkout(workoutId, workout.value);
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
.max-width-800 {
    max-width: 800px;
}

.slide-fade-enter-active {
    transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
    transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateX(20px);
    opacity: 0;
}
</style>
