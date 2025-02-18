<template>
    <v-list-item @click="handleClick" class="workout-list-item">
        <v-list-item-content>
            <v-list-item-title class="text-h6">{{ workout.name }}</v-list-item-title>
            <v-list-item-subtitle>
                {{ formattedDate }} • {{ workout.exerciseEntries.length }} exercises
            </v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-icon>
            <v-icon>mdi-chevron-right</v-icon>
        </v-list-item-icon>
    </v-list-item>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useDate } from "vuetify";

import type { WorkoutWithId } from "../services/workout";

const props = defineProps<{ workout: WorkoutWithId }>();
const emit = defineEmits<(e: "click", workout: WorkoutWithId) => void>();

// Use Vuetify's date composable for formatting
const dateAdapter = useDate();
const formattedDate = computed(() => {
    // If workout.date is a Firestore Timestamp, convert it to a native Date
    const date = (props.workout.date as any).toDate
        ? (props.workout.date as any).toDate()
        : props.workout.date;
    return dateAdapter.format(date, "fullDate");
});

function handleClick(): void {
    emit("click", props.workout);
}
</script>

<style scoped>
.workout-list-item {
    cursor: pointer;
}
</style>
