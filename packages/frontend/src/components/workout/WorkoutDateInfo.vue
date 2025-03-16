<template>
    <span>
        {{ formattedDate }}
    </span>
</template>

<script setup lang="ts">
import { computed } from "vue";

import type { WorkoutWithId } from "../../types/workout";

import { ONE_DAY } from "../../helpers/date-utils";

const { workout } = defineProps<{ workout: WorkoutWithId }>();

const formattedDate = computed(() => {
    const workoutDate = workout.date.toDate();
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (workoutDate.toDateString() === today.toDateString()) {
        return `Today at ${formatTime(workoutDate)}`;
    }

    if (workoutDate.toDateString() === yesterday.toDateString()) {
        return `Yesterday at ${formatTime(workoutDate)}`;
    }

    const daysDiff = Math.floor((today.getTime() - workoutDate.getTime()) / ONE_DAY);
    if (daysDiff < 7) {
        return `${workoutDate.toLocaleDateString(undefined, { weekday: "long" })} at ${formatTime(workoutDate)}`;
    }

    return workoutDate.toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
});

function formatTime(date: Date): string {
    return date
        .toLocaleTimeString(undefined, {
            hour: "2-digit",
            hour12: true,
            minute: "2-digit",
        })
        .toLowerCase();
}
</script>
