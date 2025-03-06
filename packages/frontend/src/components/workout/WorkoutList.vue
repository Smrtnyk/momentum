<template>
    <v-container fluid class="workout-dashboard pa-0">
        <!-- Dashboard Header with Stats -->
        <v-card class="mb-4 rounded-lg" elevation="1">
            <div class="pa-4">
                <div class="d-flex flex-column flex-md-row justify-space-between align-center">
                    <div>
                        <h1 class="text-h4 font-weight-bold text-white mb-1">Workout Tracker</h1>
                        <p class="text-body-1 text-white text-opacity-70 mb-0">
                            {{ lastWorkoutMessage }}
                        </p>
                    </div>
                    <v-btn
                        v-if="!isWorkoutActive"
                        color="white"
                        variant="elevated"
                        prepend-icon="mdi-plus"
                        class="mt-4 mt-md-0 px-6"
                        rounded="pill"
                        size="large"
                        @click="showWorkoutStarter"
                    >
                        New Workout
                    </v-btn>
                    <v-btn
                        color="white"
                        variant="elevated"
                        prepend-icon="mdi-plus"
                        class="mt-4 mt-md-0 px-6"
                        rounded="pill"
                        size="large"
                        @click="goToCustomWorkout"
                        v-else
                    >
                        Continue workout
                    </v-btn>
                </div>
            </div>
        </v-card>

        <!-- View Selector and Filters -->
        <div class="d-flex flex-column flex-sm-row align-start align-sm-center mb-4 gap-y-2">
            <!-- View Toggle -->
            <v-btn-toggle
                v-model="view"
                mandatory
                color="primary"
                rounded="pill"
                density="comfortable"
                class="mb-2 mb-sm-0"
            >
                <v-btn value="list" variant="text" size="small">
                    <v-icon start icon="mdi-format-list-bulleted"></v-icon>
                    List
                </v-btn>
                <v-btn value="calendar" variant="text" size="small">
                    <v-icon start icon="mdi-calendar-month"></v-icon>
                    Calendar
                </v-btn>
            </v-btn-toggle>

            <v-spacer></v-spacer>

            <!-- Sort Option -->
            <v-menu>
                <template #activator="{ props }">
                    <v-btn
                        v-bind="props"
                        variant="text"
                        size="small"
                        class="ml-0 ml-sm-auto"
                        prepend-icon="mdi-sort"
                    >
                        {{ sortOptions[selectedSort].label }}
                    </v-btn>
                </template>
                <v-list density="compact" nav>
                    <v-list-item
                        v-for="(option, index) in sortOptions"
                        :key="index"
                        :value="index"
                        :title="option.label"
                        @click="selectedSort = index"
                    ></v-list-item>
                </v-list>
            </v-menu>
        </div>

        <!-- Main Content -->
        <div class="rounded-lg">
            <!-- List View -->
            <v-fade-transition>
                <div v-if="view === 'list'">
                    <WorkoutListItem
                        v-for="workout in filteredWorkouts"
                        :key="workout.id"
                        :workout="workout"
                        @click="viewWorkout(workout)"
                        class="workout-item-transition"
                    />
                </div>
            </v-fade-transition>

            <!-- Calendar View -->
            <v-fade-transition>
                <div v-if="view === 'calendar'" class="calendar-wrapper">
                    <v-calendar
                        :events="calendarEvents"
                        view-mode="month"
                        :event-ripple="false"
                        :event-more="true"
                        :event-overlap-threshold="30"
                        :event-color="getEventColor"
                        event-category="background"
                        class="workout-calendar"
                    ></v-calendar>
                </div>
            </v-fade-transition>
        </div>
    </v-container>
</template>

<script setup lang="ts">
import { useStorage } from "@vueuse/core";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

import type { WorkoutWithId } from "../../types/workout";

import { globalDialog } from "../../composables/useDialog";
import { useActiveWorkoutStore } from "../../stores/active-workout";
import CustomWorkoutStarter from "./CustomWorkoutStarter.vue";
import WorkoutListItem from "./WorkoutListItem.vue";

const { workouts } = defineProps<{ workouts: WorkoutWithId[] }>();
const router = useRouter();
const activeWorkoutStore = useActiveWorkoutStore();
const view = useStorage("workout-view-preference", "list");

const selectedSort = ref(0);
const sortOptions = [
    { label: "Newest first", value: "dateDesc" },
    { label: "Oldest first", value: "dateAsc" },
    { label: "Alphabetical", value: "name" },
];

const isWorkoutActive = computed(() => activeWorkoutStore.isWorkoutActive);

const lastWorkoutMessage = computed(() => {
    if (workouts.length === 0) {
        return "Track your fitness journey";
    }

    const sortedWorkouts = [...workouts].sort(
        (a, b) => b.date.toDate().getTime() - a.date.toDate().getTime(),
    );
    const lastWorkout = sortedWorkouts[0];
    const lastWorkoutDate = lastWorkout.date.toDate();

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    let dateStr: string;
    if (lastWorkoutDate.toDateString() === today.toDateString()) {
        dateStr = "Today";
    } else if (lastWorkoutDate.toDateString() === yesterday.toDateString()) {
        dateStr = "Yesterday";
    } else {
        dateStr = lastWorkoutDate.toLocaleDateString(undefined, {
            day: "numeric",
            month: "short",
        });
    }

    return `Last workout: ${dateStr} · ${lastWorkout.name}`;
});

const filteredWorkouts = computed(() => {
    const result = [...workouts];

    const sortOption = sortOptions[selectedSort.value].value;
    if (sortOption === "dateDesc") {
        result.sort((a, b) => b.date.toDate().getTime() - a.date.toDate().getTime());
    } else if (sortOption === "dateAsc") {
        result.sort((a, b) => a.date.toDate().getTime() - b.date.toDate().getTime());
    } else if (sortOption === "name") {
        result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
});

function getEventColor(event: WorkoutWithId): string {
    const workout = workouts.find(({ id }) => id === event.id);
    if (!workout) return "grey";

    return "amber-darken-2";
}

function viewWorkout(workout: WorkoutWithId): void {
    router.push({ name: "WorkoutDetail", params: { id: workout.id } });
}

const calendarEvents = computed(() => {
    return workouts.map((workout) => {
        const date = workout.date.toDate();
        const category = "circuit";
        const color = "amber-darken-2";

        return {
            category,
            color,
            end: date,
            id: workout.id,
            name: workout.name,
            start: date,
            timed: false,
            title: workout.name,
        };
    });
});

function goToCustomWorkout(): void {
    router.push({ name: "CustomWorkout" });
}

function showWorkoutStarter(): void {
    globalDialog.openDialog(
        CustomWorkoutStarter,
        {},
        { fullscreen: false, title: "Start a Custom Workout" },
    );
}
</script>

<style scoped>
.workout-item-transition {
    transition: all 0.3s ease;
}

.calendar-wrapper {
    min-height: 500px;
}

.workout-calendar {
    border-radius: 12px;
}

.workout-dashboard {
    min-height: 100vh;
}
</style>
