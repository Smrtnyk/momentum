<template>
    <v-container fluid class="pa-4">
        <!-- Toggle between List and Calendar views -->
        <v-tabs v-model="view" background-color="primary" dark>
            <v-tab value="list">List</v-tab>
            <v-tab value="calendar">Calendar</v-tab>
        </v-tabs>

        <!-- List View -->
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
    </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

import WorkoutListItem from "../components/WorkoutListItem.vue";
import { notifyError } from "../composables/useNotify";
import { auth } from "../firebase";
import { getWorkouts, type WorkoutWithId } from "../services/workout";

const workouts = ref<WorkoutWithId[]>([]);
const router = useRouter();
const view = ref<"calendar" | "list">("list");

async function fetchWorkouts(): Promise<void> {
    if (auth.currentUser) {
        try {
            workouts.value = await getWorkouts(auth.currentUser.uid);
        } catch (error) {
            notifyError(error);
        }
    }
}

onMounted(() => {
    fetchWorkouts();
});

function viewWorkout(workout: WorkoutWithId): void {
    router.push({ name: "WorkoutDetail", params: { id: workout.id } });
}

const calendarEvents = computed(() => {
    return workouts.value.map(function (workout) {
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
    const workout = workouts.value.find(function ({ id }) {
        return id === event.id;
    });
    if (workout) {
        viewWorkout(workout);
    }
}
</script>
