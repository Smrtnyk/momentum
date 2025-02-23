<template>
    <v-btn-toggle v-model="view" mandatory color="primary" class="mb-4">
        <v-btn value="list" variant="tonal">
            <v-icon start icon="mdi-format-list-bulleted"></v-icon>
        </v-btn>
        <v-btn value="calendar" variant="tonal">
            <v-icon start icon="mdi-calendar-month"></v-icon>
        </v-btn>
    </v-btn-toggle>

    <div v-if="view === 'list'">
        <v-list two-line>
            <WorkoutListItem
                v-for="workout in workouts"
                :key="workout.id"
                :workout="workout"
                @click="viewWorkout(workout)"
            />
        </v-list>
    </div>

    <div v-else>
        <v-calendar
            :events="calendarEvents"
            @click:event="onEventClick"
            view-mode="month"
        ></v-calendar>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

import type { WorkoutWithId } from "../types/workout";

import WorkoutListItem from "../components/WorkoutListItem.vue";

const { workouts } = defineProps<{ workouts: WorkoutWithId[] }>();
const router = useRouter();
const view = ref<"calendar" | "list">("list");

function viewWorkout(workout: WorkoutWithId): void {
    router.push({ name: "WorkoutDetail", params: { id: workout.id } });
}

const calendarEvents = computed(() => {
    return workouts.map(function (workout) {
        return {
            allDay: true,
            color: "red",
            end: workout.date.toDate(),
            id: workout.id,
            start: workout.date.toDate(),
            title: workout.name || "Workout",
        };
    });
});

function onEventClick({ event }: { event: any }): void {
    const workout = workouts.find(function ({ id }) {
        return id === event.id;
    });
    if (workout) {
        viewWorkout(workout);
    }
}
</script>
