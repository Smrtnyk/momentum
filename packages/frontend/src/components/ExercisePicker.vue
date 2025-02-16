<template>
    <v-autocomplete
        v-model="selectedExerciseId"
        :items="filteredExercises"
        item-title="name"
        item-value="id"
        label="Select Exercise"
        dense
        variant="outlined"
        clearable
        hide-details
    />
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

import type { Exercise } from "../data/excercises";

import { getExercises } from "../data/excercises";

const exercises: Exercise[] = getExercises();

const filteredExercises = computed((): Exercise[] => {
    return exercises;
});

const selectedExerciseId = ref<null | string>(null);
</script>
