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
