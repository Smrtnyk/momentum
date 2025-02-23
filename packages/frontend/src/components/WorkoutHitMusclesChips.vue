<template>
    <div v-if="hitMuscles && hitMuscles.length > 0" class="d-flex">
        <v-chip
            v-for="muscle in hitMuscles"
            :key="muscle.id"
            class="mr-1"
            variant="tonal"
            size="small"
        >
            {{ muscle.name }}
        </v-chip>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

import type { Muscle } from "../data/strength-exercises";
import type { Exercise } from "../types/exercise";
import type { Workout } from "../types/workout";

import { getMuscleGroups, getStrengthExercises } from "../data/strength-exercises";

const { workout } = defineProps<{
    workout: Workout;
}>();

const exercisesList: Exercise[] = getStrengthExercises();
const muscleGroups: Muscle[] = getMuscleGroups();

const hitMuscles = computed<Muscle[]>(() => {
    if (!workout) {
        return [];
    }

    const muscleIds = new Set<string>();
    for (const entry of workout.exerciseEntries) {
        const exercise = exercisesList.find((exer) => exer.id === entry.exerciseId);
        if (exercise) {
            exercise.muscleIds.forEach((muscleId) => muscleIds.add(muscleId));
        }
    }

    const muscles: Muscle[] = [];
    muscleIds.forEach(function (muscleId) {
        const muscle = muscleGroups.find((muscleGroup) => muscleGroup.id === muscleId);
        if (muscle) {
            muscles.push(muscle);
        }
    });
    return muscles;
});
</script>
