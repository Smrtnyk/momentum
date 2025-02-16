<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">Log a New Workout</h2>
    <form @submit.prevent="submitWorkout" class="space-y-4">
      <div>
        <ExercisePicker v-model="selectedExercise" />
      </div>
      <div>
        <h3 class="text-lg font-semibold mb-2">Sets</h3>
        <div
          v-for="(set, index) in sets"
          :key="index"
          class="flex items-center space-x-2"
        >
          <v-row class="align-center">
            <v-col cols="auto">
              <v-text-field
                v-model.number="set.reps"
                variant="outlined"
                type="number"
                label="Reps"
                dense
                style="max-width: 6rem"
              />
            </v-col>
            <v-col cols="auto">
              <v-text-field
                v-model.number="set.weight"
                variant="outlined"
                type="number"
                label="Weight (kg)"
                dense
                style="max-width: 6rem"
              />
            </v-col>
            <v-col cols="auto">
              <v-btn
                @click="removeSet(index)"
                icon="mdi-trash-can"
                color="error"
                size="small"
              />
            </v-col>
          </v-row>
        </div>

        <v-btn type="button" @click="addSet"> Add Set </v-btn>
      </div>
      <div>
        <v-textarea
          variant="outlined"
          id="notes"
          v-model="notes"
          label="Notes"
          class="w-full"
        />
      </div>
      <v-btn type="submit">Log Workout</v-btn>
    </form>
  </div>
</template>

<script setup lang="ts">
import { Timestamp } from "firebase/firestore";
import { ref } from "vue";

import type { Workout, WorkoutSet } from "../services/workout";

import { initializeFirebase } from "../firebase";
import { addWorkout } from "../services/workout";
import ExercisePicker from "./ExercisePicker.vue";

const { auth } = initializeFirebase();

const selectedExercise = ref("");

const sets = ref<WorkoutSet[]>([{ reps: 0, weight: 0 }]);
const notes = ref("");

function addSet(): void {
  sets.value.push({ reps: 0, weight: 0 });
}

function removeSet(index: number): void {
  if (sets.value.length > 1) {
    sets.value.splice(index, 1);
  }
}

async function submitWorkout(): Promise<void> {
  if (!auth.currentUser) {
    alert("You must be logged in to log a workout.");
    return;
  }
  if (!selectedExercise.value) {
    alert("Please select an exercise.");
    return;
  }

  const workout: Workout = {
    date: Timestamp.now(),
    exercise: selectedExercise.value,
    notes: notes.value,
    sets: sets.value,
    userId: auth.currentUser.uid,
  };

  try {
    await addWorkout(workout);
    alert("Workout logged successfully!");
    // Reset fields
    selectedExercise.value = "";
    sets.value = [{ reps: 0, weight: 0 }];
    notes.value = "";
  } catch (error: any) {
    alert(`Error logging workout: ${error.message}`);
  }
}
</script>

<style scoped>
form > div {
  margin-bottom: 1rem;
}
</style>
