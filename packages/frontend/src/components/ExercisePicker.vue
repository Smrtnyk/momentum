<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">Select Muscle Group</h2>
    <v-tabs v-model="activeTab" class="mb-4" grow>
      <v-tab v-for="tab in tabs" :key="tab" :value="tab">
        {{ tab }}
      </v-tab>
    </v-tabs>

    <div class="mt-6">
      <h3 class="text-lg font-semibold mb-2">Exercises</h3>
      <v-list>
        <v-list-item v-for="exercise in filteredExercises" :key="exercise.id">
          <v-list-item-title>{{ exercise.name }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

import type { Exercise } from "../data/excercises";

import { getExercises } from "../data/excercises";

const tabs = ref([
  "All",
  "Chest",
  "Back",
  "Legs",
  "Shoulders",
  "Arms",
  "Core",
  "Calves",
]);

const activeTab = ref("All");

const exercises: Exercise[] = getExercises();

const filteredExercises = computed((): Exercise[] => {
  if (activeTab.value === "All") {
    return exercises;
  }
  const muscle = activeTab.value.toLowerCase();
  return exercises.filter(function (exercise) {
    return exercise.muscleIds.includes(muscle);
  });
});
</script>
