<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">Log a New Workout</h2>
    <form @submit.prevent="submitWorkout" class="space-y-4">
      <!-- Exercise selection -->
      <div>
        <!-- ExercisePicker should be a component that allows the user to pick an exercise -->
        <ExercisePicker v-model="selectedExercise" />
      </div>
      <!-- Sets entry -->
      <div>
        <h3 class="text-lg font-semibold mb-2">Sets</h3>
        <div
          v-for="(set, index) in sets"
          :key="index"
          class="flex space-x-2 items-center"
        >
          <IInput
            v-model.number="set.reps"
            type="number"
            min="1"
            placeholder="Reps"
            class="w-20"
          />
          <IInput
            v-model.number="set.weight"
            type="number"
            min="0"
            placeholder="Weight (kg)"
            class="w-20"
          />
          <button
            type="button"
            @click="removeSet(index)"
            class="text-destructive"
          >
            Remove
          </button>
        </div>
        <RippleButton type="button" @click="addSet"> Add Set </RippleButton>
      </div>
      <!-- Notes -->
      <div>
        <label for="notes" class="block mb-1">Notes:</label>
        <ITextArea id="notes" v-model="notes" class="w-full" />
      </div>
      <!-- Submission -->
      <RippleButton type="submit">Log Workout</RippleButton>
    </form>
  </div>
</template>

<script setup lang="ts">
import { Timestamp } from "firebase/firestore";
import { ref } from "vue";

import type { Workout, WorkoutSet } from "../services/workout";

import IInput from "../components/ui/IInput.vue";
import ITextArea from "../components/ui/ITextArea.vue";
import RippleButton from "../components/ui/RippleButton.vue";
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
