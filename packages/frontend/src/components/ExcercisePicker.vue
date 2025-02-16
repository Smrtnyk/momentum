<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">Select Muscle Group</h2>
    <!-- Use MorphingTabs to let the user select a muscle group -->
    <MorphingTabs
      :tabs="tabs"
      :active-tab="activeTab"
      @update:active-tab="activeTab = $event"
      class="mb-4"
    />
    <div class="mt-6">
      <h3 class="text-lg font-semibold mb-2">Exercises</h3>
      <ul class="list-disc list-inside">
        <li v-for="exercise in filteredExercises" :key="exercise.id">
          {{ exercise.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

import type { Exercise } from "../data/excercises";

import MorphingTabs from "../components/ui/MorphingTabs.vue";
import { getExercises } from "../data/excercises";

// Define tabs: first "All", then the muscle groups.
// The tabs are strings that will be displayed as-is.
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

// Active tab will be one of these strings. "All" means no filtering.
const activeTab = ref("All");

// Load all exercises from our data source.
const exercises: Exercise[] = getExercises();

// Compute filtered exercises based on the selected muscle group.
// We assume that exercise.muscleIds use lowercase (e.g. "chest").
// When activeTab is not "All", we convert it to lowercase for matching.
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
