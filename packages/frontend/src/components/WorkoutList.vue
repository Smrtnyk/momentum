<template>
    <v-container fluid class="pa-0">
        <v-btn-toggle v-model="view" mandatory color="primary" class="mb-4">
            <v-btn value="list" variant="tonal">
                <v-icon start icon="mdi-format-list-bulleted"></v-icon>
            </v-btn>
            <v-btn value="calendar" variant="tonal">
                <v-icon start icon="mdi-calendar-month"></v-icon>
            </v-btn>
        </v-btn-toggle>

        <div v-if="view === 'list'">
            <div v-if="workouts.length === 0">
                <v-alert type="info" variant="tonal" class="mt-4" border="start" rounded="lg">
                    <template #prepend>
                        <v-icon icon="mdi-information" class="mr-3"></v-icon>
                    </template>
                    <h3 class="text-body-1 font-weight-medium mb-2">No workouts found</h3>
                    <p class="text-caption">Start by creating your first workout routine</p>
                </v-alert>
            </div>
            <v-list v-else two-line>
                <WorkoutListItem
                    v-for="workout in workouts"
                    :key="workout.id"
                    :workout="workout"
                    @click="viewWorkout(workout)"
                />
            </v-list>
        </div>

        <div v-else>
            <div v-if="workouts.length === 0" class="text-center mt-4">
                <v-alert type="info" variant="tonal" class="mt-4" border="start" rounded="lg">
                    <template #prepend>
                        <v-icon icon="mdi-information" class="mr-3"></v-icon>
                    </template>
                    <h3 class="text-body-1 font-weight-medium mb-2">No workouts found</h3>
                    <p class="text-caption">Start by creating your first workout routine</p>
                </v-alert>
            </div>
            <v-calendar
                :events="calendarEvents"
                @click:event="onEventClick"
                view-mode="month"
            ></v-calendar>
        </div>
    </v-container>
</template>

<script setup lang="ts">
import { useAsyncState } from "@vueuse/core";
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";

import WorkoutListItem from "../components/WorkoutListItem.vue";
import { auth } from "../firebase";
import { getWorkouts, type WorkoutWithId } from "../services/workout";
import { useGlobalStore } from "../stores/global";

const globalStore = useGlobalStore();
const router = useRouter();
const view = ref<"calendar" | "list">("list");

const { error, state: workouts } = useAsyncState<WorkoutWithId[]>(() => {
    if (auth.currentUser) {
        return getWorkouts(auth.currentUser.uid);
    }
    return Promise.resolve([]);
}, []);

watch(error, function (err) {
    if (err) {
        globalStore.notifyError(err);
    }
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
