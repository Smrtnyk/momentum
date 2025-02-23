<script setup lang="ts">
import { computed } from "vue";
import { useDate } from "vuetify";

import type { Workout } from "../services/workout";
const { workout } = defineProps<{ workout: Workout }>();
const dateAdapter = useDate();
const formattedDate = computed(() => {
    const date = workout.date.toDate();
    return dateAdapter.format(date, "fullDate");
});

const formattedDuration = computed(() => {
    return `${workout.workoutDurationMinutes} minutes`;
});
</script>

<template>
    <div class="d-flex align-center gap-xs">
        <v-icon icon="mdi-calendar" size="small"></v-icon>
        {{ formattedDate }}
        <v-divider vertical thickness="2" class="mx-2"></v-divider>
        <v-icon icon="mdi-clock-outline" size="small"></v-icon>
        {{ formattedDuration }}
    </div>
</template>

<style scoped></style>
