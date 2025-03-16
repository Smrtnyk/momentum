<template>
    <div class="d-flex align-center flex-wrap gap-1 workout-chips">
        <v-chip
            v-for="muscle in hitMuscles"
            :key="muscle.exerciseId"
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

import type { WorkoutWithId } from "../../types/workout";

import { getExerciseById, getMuscleById } from "../../helpers/exercise-utils";

const { workout } = defineProps<{ workout: WorkoutWithId }>();

const hitMuscles = computed(() => {
    const exerciseIds = workout.exerciseEntries.map((entry) => entry.exerciseId);
    const exercises = exerciseIds.map(getExerciseById);
    const muscleIds = exercises.flatMap((exercise) => exercise.muscleIds);
    const uniqueMuscleIds = [...new Set(muscleIds)];
    return uniqueMuscleIds.map(getMuscleById);
});
</script>

<style scoped>
@media (max-width: 600px) {
    .workout-chips :deep(.v-chip) {
        height: 24px;
        font-size: 11px;
        padding: 0 8px;
    }
}
</style>
