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
          class="flex space-x-2 items-center"
        >
          <v-text-field
            v-model.number="set.reps"
            variant="outlined"
            type="number"
            label="Reps"
            min="1"
            class="w-20"
          />
          <v-text-field
            v-model.number="set.weight"
            variant="outlined"
            type="number"
            label="Weight (kg)"
            min="0"
            class="w-20"
          />
          <v-btn
            type="button"
            @click="removeSet(index)"
            class="text-destructive"
          >
            Remove
          </v-btn>
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

import { auth } from "../firebase";
import { addWorkout } from "../services/workout";
import ExercisePicker from "./ExercisePicker.vue";

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
