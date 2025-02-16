<template>
    <v-container fluid class="pa-4">
        <!-- Workout Header with Title and Date Picker -->
        <v-row class="align-center mb-4">
            <v-col cols="8">
                <v-text-field
                    v-model="workoutName"
                    variant="outlined"
                    label="Workout Title"
                    dense
                    hide-details
                />
            </v-col>
            <v-col cols="4" class="d-flex align-center">
                <v-menu
                    v-model="menu"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                >
                    <template #activator="{ props }">
                        <v-btn icon v-bind="props">
                            <v-icon>mdi-calendar</v-icon>
                        </v-btn>
                    </template>
                    <v-date-picker v-model="workoutDate" />
                </v-menu>
                <span class="ml-2">{{ formattedWorkoutDate }}</span>
            </v-col>
        </v-row>

        <!-- Exercise Entries -->
        <v-row v-for="(entry, idx) in exerciseEntries" :key="idx" class="mb-4">
            <v-col cols="12">
                <v-card outlined>
                    <v-card-title class="d-flex align-center">
                        <v-autocomplete
                            v-model="entry.exerciseId"
                            :items="exercises"
                            item-title="name"
                            item-value="id"
                            label="Select Exercise"
                            dense
                            variant="outlined"
                            clearable
                            hide-details
                            class="flex-grow-1"
                        />
                        <v-btn icon color="error" @click="removeExercise(idx)">
                            <v-icon>mdi-trash-can</v-icon>
                        </v-btn>
                    </v-card-title>
                    <v-card-text>
                        <v-text-field
                            v-model="entry.exerciseNotes"
                            variant="outlined"
                            label="Exercise Notes"
                            dense
                            class="mb-2"
                        />
                        <div
                            v-for="(set, sIdx) in entry.sets"
                            :key="sIdx"
                            class="d-flex align-center mb-2"
                        >
                            <v-text-field
                                v-model.number="set.reps"
                                variant="outlined"
                                type="number"
                                label="Reps"
                                dense
                                style="max-width: 6rem"
                                class="mr-2"
                            />
                            <v-text-field
                                v-model.number="set.weight"
                                variant="outlined"
                                type="number"
                                label="Weight (kg)"
                                dense
                                style="max-width: 6rem"
                                class="mr-2"
                            />
                            <v-btn icon color="error" @click="removeSet(idx, sIdx)">
                                <v-icon>mdi-trash-can</v-icon>
                            </v-btn>
                        </div>
                        <v-btn small color="primary" @click="addSet(idx)"> Add Set </v-btn>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <!-- Add Exercise Button -->
        <v-row>
            <v-col cols="12">
                <v-btn color="secondary" @click="addExercise" class="mb-4"> Add Exercise </v-btn>
            </v-col>
        </v-row>

        <!-- Overall Workout Notes -->
        <v-row>
            <v-col cols="12">
                <v-textarea
                    v-model="overallNotes"
                    variant="outlined"
                    label="Workout Notes"
                    dense
                    rows="3"
                    class="mb-4"
                />
            </v-col>
        </v-row>

        <!-- Submit Workout -->
        <v-row>
            <v-col cols="12">
                <v-btn block color="primary" @click="submitWorkout"> Log Workout </v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { Timestamp } from "firebase/firestore";
import { computed, ref } from "vue";
import { useDate } from "vuetify";

import type { Exercise } from "../data/excercises";
import type { ExerciseEntry, Workout } from "../services/workout";

import { notify } from "../composables/useNotify";
import { getExercises } from "../data/excercises";
import { auth } from "../firebase";
import { addWorkout } from "../services/workout";

const exercises: Exercise[] = getExercises();

const workoutName = ref("Workout");
const workoutDate = ref(new Date());
const menu = ref(false);

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

function addSet(exerciseIndex: number): void {
    exerciseEntries.value[exerciseIndex].sets.push({ reps: 0, weight: 0 });
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
        notify("You must be logged in to log a workout.", "error");
        return;
    }
    for (const entry of exerciseEntries.value) {
        if (!entry.exerciseId) {
            notify("Please select an exercise for all entries.", "error");
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
        await addWorkout(workout);
        notify("Workout logged successfully!");
        workoutName.value = "Workout";
        workoutDate.value = new Date();
        overallNotes.value = "";
        exerciseEntries.value = [
            { exerciseId: "", exerciseNotes: "", sets: [{ reps: 0, weight: 0 }] },
        ];
    } catch (error: any) {
        notify(`Error logging workout: ${error.message}`, "error");
    }
}
</script>
