<template>
    <div class="d-flex align-center flex-wrap gap-1">
        <v-chip
            v-for="muscle in hitMuscles"
            :key="muscle.id"
            size="x-small"
            density="comfortable"
            variant="tonal"
            class="text-body-2 font-weight-medium mr-1"
        >
            {{ muscle.name }}
        </v-chip>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

import type { Exercise } from "../types/exercise";
import type { WorkoutWithId } from "../types/workout";

import { getExerciseById, getMuscleById } from "../data/strength-exercises";

const { workout } = defineProps<{ workout: WorkoutWithId }>();

const hitMuscles = computed(() => {
    const exerciseIds = workout.exerciseEntries.map((entry) => entry.exerciseId);
    const exercises = exerciseIds.map((id) => getExerciseById(id)) as Exercise[];
    const muscleIds = exercises.flatMap((exercise) => exercise.muscleIds);
    const uniqueMuscleIds = [...new Set(muscleIds)];
    return uniqueMuscleIds.map((id) => getMuscleById(id));
});
</script>
