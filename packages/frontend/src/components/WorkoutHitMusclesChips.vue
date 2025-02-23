<template>
    <v-card-text v-if="hitMuscles && hitMuscles.length > 0" class="pa-0">
        <v-chip-group column>
            <v-chip
                v-for="muscle in hitMuscles"
                :key="muscle.id"
                class="ma-1"
                variant="tonal"
                size="small"
            >
                {{ muscle.name }}
            </v-chip>
        </v-chip-group>
    </v-card-text>
</template>

<script setup lang="ts">
import { computed } from "vue";

import type { Exercise, Muscle } from "../data/excercises";
import type { Workout } from "../services/workout";

import { getExercises, getMuscleGroups } from "../data/excercises";

const { workout } = defineProps<{
    workout: Workout;
}>();

const exercisesList: Exercise[] = getExercises();
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
