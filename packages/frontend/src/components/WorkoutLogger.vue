<template>
  <div>
    <h2>Log a New Workout</h2>
    <form @submit.prevent="submitWorkout">
      <div>
        <label for="exercise">Exercise:</label>
        <input id="exercise" v-model="exercise" type="text" required />
      </div>
      <div>
        <label for="sets">Sets:</label>
        <input id="sets" v-model.number="sets" type="number" min="1" required />
      </div>
      <div>
        <label for="reps">Reps:</label>
        <input id="reps" v-model.number="reps" type="number" min="1" required />
      </div>
      <div>
        <label for="notes">Notes:</label>
        <textarea id="notes" v-model="notes"></textarea>
      </div>
      <button type="submit">Log Workout</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { Timestamp } from "firebase/firestore";
import { ref } from "vue";

import { auth } from "../firebase";
import { addWorkout } from "../services/workout";

const exercise = ref("");
const sets = ref(1);
const reps = ref(1);
const notes = ref("");

async function submitWorkout(): Promise<void> {
  if (!auth.currentUser) {
    alert("You must be logged in to log a workout.");
    return;
  }

  const workout = {
    date: Timestamp.now(),
    exercise: exercise.value,
    notes: notes.value,
    reps: reps.value,
    sets: sets.value,
    userId: auth.currentUser.uid,
  };

  try {
    await addWorkout(workout);
    alert("Workout logged successfully!");
    // Reset form fields
    exercise.value = "";
    sets.value = 1;
    reps.value = 1;
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
