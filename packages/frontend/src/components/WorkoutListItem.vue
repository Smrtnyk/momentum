<template>
    <v-list-item @click="handleClick" class="workout-list-item">
        <v-list-item-title class="text-h6">{{ workout.name }}</v-list-item-title>
        <v-list-item-subtitle>
            {{ formattedDate }} • {{ workout.exerciseEntries.length }} exercises
            <span class="workout-list-duration"> ({{ formattedDuration }}) </span>
        </v-list-item-subtitle>

        <v-list-item-subtitle>
            <WorkoutHitMusclesChips :workout="workout" />
        </v-list-item-subtitle>

        <v-list-item-action>
            <v-icon>mdi-chevron-right</v-icon>
        </v-list-item-action>
    </v-list-item>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useDate } from "vuetify";

import type { WorkoutWithId } from "../services/workout";

import WorkoutHitMusclesChips from "./WorkoutHitMusclesChips.vue";

const { workout } = defineProps<{ workout: WorkoutWithId }>();
const emit = defineEmits<(e: "click", workout: WorkoutWithId) => void>();

const dateAdapter = useDate();
const formattedDate = computed(() => {
    const date = workout.date.toDate();
    return dateAdapter.format(date, "fullDate");
});

const formattedDuration = computed(() => {
    return `${workout.workoutDurationMinutes} minutes`;
});

function handleClick(): void {
    emit("click", workout);
}
</script>

<style scoped>
.workout-list-item {
    cursor: pointer;
}
</style>
