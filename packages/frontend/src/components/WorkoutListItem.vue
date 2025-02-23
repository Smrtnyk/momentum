<template>
    <v-list-item @click="handleClick" class="workout-list-item" lines="three" density="comfortable">
        <template #prepend>
            <v-icon icon="mdi-dumbbell" color="primary" class="mr-0" size="small"></v-icon>
        </template>

        <v-list-item-title class="font-weight-medium">
            {{ workout.name }}
        </v-list-item-title>

        <v-list-item-subtitle class="text-caption">
            <div class="d-flex align-center gap-xs">
                <v-icon icon="mdi-calendar" size="small"></v-icon>
                {{ formattedDate }}
                <v-divider vertical thickness="2" class="mx-2"></v-divider>
                <v-icon icon="mdi-clock-outline" size="small"></v-icon>
                {{ formattedDuration }}
            </div>
        </v-list-item-subtitle>

        <v-list-item-subtitle class="mt-1">
            <WorkoutHitMusclesChips :workout="workout" />
        </v-list-item-subtitle>

        <template #append>
            <v-icon icon="mdi-chevron-right" color="grey-lighten-1"></v-icon>
        </template>
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
.gap-xs {
    gap: 4px;
}
.workout-list-item {
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
</style>
