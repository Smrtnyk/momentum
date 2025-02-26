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
                        color="white"
                        variant="elevated"
                        prepend-icon="mdi-plus"
                        class="mt-4 mt-md-0 px-6"
                        rounded="pill"
                        size="large"
                        @click="goToWorkoutLogger"
                    >
                        New Workout
                    </v-btn>
                </div>
            </div>

            <!-- Quick Stats Cards -->
            <v-row class="px-2 pb-2">
                <v-col cols="4" sm="4">
                    <v-card class="rounded-lg" flat>
                        <v-card-text class="text-center py-4">
                            <div class="text-h5 font-weight-bold text-primary mb-1">
                                {{ workoutsThisWeek }}
                            </div>
                            <div class="text-caption text-medium-emphasis">Workouts this week</div>
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col cols="4" sm="4">
                    <v-card class="rounded-lg" flat>
                        <v-card-text class="text-center py-4">
                            <div class="text-h5 font-weight-bold text-primary mb-1">
                                {{ strengthPercentage }}%
                            </div>
                            <div class="text-caption text-medium-emphasis">Strength training</div>
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col cols="4" sm="4">
                    <v-card class="rounded-lg" flat>
                        <v-card-text class="text-center py-4">
                            <div class="text-h5 font-weight-bold text-primary mb-1">
                                {{ totalMinutesThisWeek }}
                            </div>
                            <div class="text-caption text-medium-emphasis">Minutes active</div>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-card>

        <!-- View Selector and Filters -->
        <div class="d-flex flex-column flex-sm-row align-start align-sm-center mb-4 gap-y-2">
            <!-- View Toggle -->
            <v-btn-toggle
                v-model="view"
                mandatory
                color="primary"
                rounded="pill"
                border
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

            <!-- Workout Type Filter -->
            <v-chip-group
                v-model="selectedFilter"
                class="ml-0 ml-sm-4"
                selected-class="bg-primary text-white"
            >
                <v-chip value="all" variant="outlined" size="small" label> All </v-chip>
                <v-chip
                    value="strength"
                    variant="outlined"
                    size="small"
                    label
                    prepend-icon="mdi-weight-lifter"
                >
                    Strength
                </v-chip>
                <v-chip value="cardio" variant="outlined" size="small" label prepend-icon="mdi-run">
                    Cardio
                </v-chip>
            </v-chip-group>

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
        <v-card class="rounded-lg" elevation="1">
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
                        @click:event="onEventClick"
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
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
import { useStorage } from "@vueuse/core";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

import type { WorkoutWithId } from "../types/workout";

import WorkoutListItem from "../components/WorkoutListItem.vue";
import { isStrengthWorkout } from "../services/workout";

const { workouts } = defineProps<{ workouts: WorkoutWithId[] }>();
const router = useRouter();
const view = useStorage("workout-view-preference", "list");

const selectedFilter = ref("all");
const selectedSort = ref(0);
const sortOptions = [
    { label: "Newest first", value: "dateDesc" },
    { label: "Oldest first", value: "dateAsc" },
    { label: "Alphabetical", value: "name" },
];

const workoutsThisWeek = computed(() => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    return workouts.filter((workout) => {
        const workoutDate = workout.date.toDate();
        return workoutDate >= oneWeekAgo;
    }).length;
});

const strengthPercentage = computed(() => {
    if (workouts.length === 0) return 0;
    const strengthCount = workouts.filter((workout) => isStrengthWorkout(workout)).length;
    return Math.round((strengthCount / workouts.length) * 100);
});

const totalMinutesThisWeek = computed(() => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    return workouts
        .filter((workout) => workout.date.toDate() >= oneWeekAgo)
        .reduce((total, workout) => {
            if (isStrengthWorkout(workout)) {
                return total + workout.workoutDurationMinutes;
            }
            // For cardio workouts, sum up all exercise durations
            return (
                total +
                workout.exerciseEntries.reduce((sum, entry) => sum + entry.durationMinutes, 0)
            );
        }, 0);
});

const lastWorkoutMessage = computed(() => {
    if (workouts.length === 0) {
        return "Track your fitness journey";
    }

    const sortedWorkouts = [...workouts].sort(
        (a, b) => b.date.toDate().getTime() - a.date.toDate().getTime(),
    );
    const lastWorkout = sortedWorkouts[0];
    const lastWorkoutDate = lastWorkout.date.toDate();

    // Format date to show relative time (today, yesterday, or date)
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
    let result = [...workouts];

    // Apply filter
    if (selectedFilter.value === "strength") {
        result = result.filter((workout) => isStrengthWorkout(workout));
    } else if (selectedFilter.value === "cardio") {
        result = result.filter((workout) => !isStrengthWorkout(workout));
    }

    // Apply sort
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
    return workout && isStrengthWorkout(workout) ? "indigo" : "teal";
}

function viewWorkout(workout: WorkoutWithId): void {
    router.push({ name: "WorkoutDetail", params: { id: workout.id } });
}

const calendarEvents = computed(() => {
    return workouts.map((workout) => {
        const date = workout.date.toDate();
        return {
            category: isStrengthWorkout(workout) ? "strength" : "cardio",
            color: isStrengthWorkout(workout) ? "indigo" : "teal",
            end: date,
            id: workout.id,
            name: workout.name,
            start: date,
            timed: false,
            title: workout.name,
        };
    });
});

function goToWorkoutLogger(): void {
    router.push({ name: "WorkoutLogger" });
}

function onEventClick({ event }: { event: any }): void {
    const workout = workouts.find(({ id }) => id === event.id);
    if (workout) {
        viewWorkout(workout);
    }
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
