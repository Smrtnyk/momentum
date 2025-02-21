<template>
    <v-container fluid class="pa-4 pa-sm-6">
        <v-card flat class="mb-6" color="surface">
            <v-card-text>
                <v-row dense>
                    <v-col cols="12" md="8">
                        <v-text-field
                            v-model="workoutName"
                            variant="outlined"
                            label="Workout Name"
                            density="comfortable"
                            bg-color="background"
                            hide-details
                            class="mb-4"
                        />
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-menu v-model="menu" :close-on-content-click="false">
                            <template #activator="{ props }">
                                <v-text-field
                                    v-model="formattedWorkoutDate"
                                    variant="outlined"
                                    density="comfortable"
                                    readonly
                                    v-bind="props"
                                    label="Workout Date"
                                    prepend-inner-icon="mdi-calendar"
                                    bg-color="background"
                                    hide-details
                                />
                            </template>
                            <v-date-picker v-model="workoutDate" />
                        </v-menu>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>

        <!-- Exercise Cards -->
        <transition-group name="list" tag="div">
            <v-card v-for="(entry, idx) in exerciseEntries" :key="idx" class="mb-4" elevation="2">
                <v-card-title class="d-flex align-center">
                    <span class="text-h6 text-white">Exercise {{ idx + 1 }}</span>
                    <v-spacer />
                    <v-btn icon variant="text" color="white" @click="removeExercise(idx)">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>

                <v-card-text class="pt-4">
                    <v-autocomplete
                        v-model="entry.exerciseId"
                        :items="exercises"
                        item-title="name"
                        item-value="id"
                        label="Select Exercise"
                        variant="outlined"
                        density="comfortable"
                        :rules="[required]"
                        clearable
                        class="mb-4"
                    />

                    <v-textarea
                        v-model="entry.exerciseNotes"
                        variant="outlined"
                        label="Exercise Notes"
                        density="comfortable"
                        rows="2"
                        auto-grow
                        class="mb-4"
                    />

                    <v-divider class="my-4" />

                    <div class="text-subtitle-1 mb-1">Sets</div>

                    <transition-group name="list" tag="div">
                        <v-row v-for="(set, sIdx) in entry.sets" :key="sIdx" align="center">
                            <v-col cols="12" class="pb-0">
                                <div class="text-caption text-medium-emphasis">
                                    Set {{ sIdx + 1 }}
                                </div>
                            </v-col>
                            <v-col cols="5" class="pb-0">
                                <v-number-input
                                    v-model.number="set.reps"
                                    variant="outlined"
                                    control-variant="split"
                                    label="Reps"
                                    density="comfortable"
                                    :rules="[positiveNumber]"
                                />
                            </v-col>
                            <v-col cols="5" class="pb-0">
                                <v-number-input
                                    v-model.number="set.weight"
                                    variant="outlined"
                                    control-variant="split"
                                    label="Weight (kg)"
                                    density="comfortable"
                                    :rules="[positiveNumber]"
                                />
                            </v-col>
                            <v-col cols="2" class="text-center pa-0">
                                <v-btn
                                    icon
                                    variant="text"
                                    color="error"
                                    @click="removeSet(idx, sIdx)"
                                >
                                    <v-icon>mdi-delete</v-icon>
                                </v-btn>
                            </v-col>
                        </v-row>
                    </transition-group>

                    <v-btn
                        color="secondary"
                        variant="tonal"
                        prepend-icon="mdi-plus"
                        @click="addSet(idx)"
                    >
                        Add Set
                    </v-btn>
                </v-card-text>
            </v-card>
        </transition-group>

        <!-- Add Exercise Button -->
        <v-btn
            block
            color="primary"
            variant="flat"
            class="my-4"
            prepend-icon="mdi-dumbbell"
            @click="addExercise"
        >
            Add Exercise
        </v-btn>

        <!-- Workout Notes -->
        <v-card class="mb-4" elevation="2">
            <v-card-title>
                <span class="text-h6 text-white">Workout Notes</span>
            </v-card-title>
            <v-card-text>
                <v-textarea
                    v-model="overallNotes"
                    variant="outlined"
                    label="Overall workout notes"
                    density="comfortable"
                    rows="3"
                    auto-grow
                    hide-details
                />
            </v-card-text>
        </v-card>

        <!-- Submit Button -->
        <v-btn
            block
            color="success"
            size="large"
            :loading="isSubmitting"
            prepend-icon="mdi-content-save"
            @click="submitWorkout"
        >
            {{ isEditing ? "Update Workout" : "Save Workout" }}
        </v-btn>
    </v-container>
</template>

<script setup lang="ts">
import { Timestamp } from "firebase/firestore";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useDate } from "vuetify";

import type { Exercise } from "../data/excercises";
import type { ExerciseEntry, Workout } from "../services/workout";

import { getExercises } from "../data/excercises";
import { auth } from "../firebase";
import { addWorkout, getWorkoutById, updateWorkout } from "../services/workout";
import { useGlobalStore } from "../stores/global";

const exercises: Exercise[] = getExercises();
const router = useRouter();
const route = useRoute();
const globalStore = useGlobalStore();

// If there's an ID parameter, we're editing
const workoutId = route.params.id as string | undefined;
const isEditing = ref(Boolean(workoutId));

const workoutName = ref("Workout");
const workoutDate = ref(new Date());
const menu = ref(false);

function positiveNumber(value: number): boolean | string {
    return value >= 0 || "Must be zero or positive";
}
function required(value: unknown): boolean | string {
    return Boolean(value) || "Required";
}
const isSubmitting = ref(false);

const dateAdapter = useDate();
const formattedWorkoutDate = computed(() => dateAdapter.format(workoutDate.value, "keyboardDate"));

const overallNotes = ref("");
const exerciseEntries = ref<ExerciseEntry[]>([
    { exerciseId: "", exerciseNotes: "", sets: [{ reps: 0, weight: 0 }] },
]);

function addExercise(): void {
    exerciseEntries.value.push({
        exerciseId: "",
        exerciseNotes: "",
        sets: [{ reps: 0, weight: 0 }],
    });
}

onMounted(() => {
    if (isEditing.value && workoutId) {
        loadWorkout(workoutId);
    }
});

function addSet(exerciseIndex: number): void {
    exerciseEntries.value[exerciseIndex].sets.push({ reps: 0, weight: 0 });
}

async function loadWorkout(id: string): Promise<void> {
    try {
        const workoutData = await getWorkoutById(id);
        workoutName.value = workoutData.name;
        overallNotes.value = workoutData.overallNotes;

        workoutDate.value = workoutData.date.toDate();
        exerciseEntries.value = workoutData.exerciseEntries;
    } catch (error) {
        globalStore.notifyError("Failed to load workout for editing.");
    }
}

function removeExercise(index: number): void {
    if (exerciseEntries.value.length > 1) {
        exerciseEntries.value.splice(index, 1);
    }
}

function removeSet(exerciseIndex: number, setIndex: number): void {
    const sets = exerciseEntries.value[exerciseIndex].sets;
    if (sets.length > 1) {
        sets.splice(setIndex, 1);
    }
}

async function submitWorkout(): Promise<void> {
    if (!auth.currentUser) {
        globalStore.notifyError("You must be logged in to log a workout.");
        return;
    }

    for (const entry of exerciseEntries.value) {
        if (!entry.exerciseId) {
            globalStore.notifyError("Please select an exercise for all entries.");
            return;
        }
    }
    const workout: Workout = {
        date: Timestamp.now(),
        exerciseEntries: exerciseEntries.value,
        name: workoutName.value,
        overallNotes: overallNotes.value,
        userId: auth.currentUser.uid,
    };

    try {
        const isValid = exerciseEntries.value.every(
            (entry) =>
                entry.exerciseId &&
                entry.sets.every(
                    (set) => typeof set.reps === "number" && typeof set.weight === "number",
                ),
        );

        if (!isValid) {
            globalStore.notifyError("Please fill all required fields correctly");
            return;
        }

        if (isEditing.value && workoutId) {
            await updateWorkout(workoutId, workout);
            globalStore.notify("Workout updated successfully!");
            await router.replace({ name: "WorkoutDetail", params: { id: workoutId } });
        } else {
            const newWorkoutId = await addWorkout(workout);
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
