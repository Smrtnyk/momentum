<template>
    <v-container fluid class="pa-0">
        <!-- Dashboard Header with Stats -->
        <v-card class="mb-4 rounded-lg" elevation="1">
            <div class="pa-4">
                <div class="d-flex flex-column flex-md-row justify-space-between align-center">
                    <div>
                        <h1 class="text-h4 font-weight-bold text-white mb-1">Workout Tracker</h1>
                    </div>
                    <v-btn
                        v-if="!isWorkoutActive"
                        color="white"
                        variant="elevated"
                        prepend-icon="mdi-plus"
                        class="mt-4 mt-md-0 px-6"
                        rounded="pill"
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
                        @click="goToCustomWorkout"
                        v-else
                    >
                        Continue workout
                    </v-btn>
                </div>
            </div>
        </v-card>

        <div class="mb-2">
            <v-btn
                variant="text"
                density="comfortable"
                color="primary"
                prepend-icon="mdi-food-apple-outline"
                class="text-none"
                to="/exercises-library"
                size="small"
            >
                Exercises Library
            </v-btn>
            <v-btn
                variant="text"
                density="comfortable"
                color="primary"
                prepend-icon="mdi-clipboard-text-outline"
                class="text-none"
                to="/workout-plans"
                size="small"
            >
                Workout plans
            </v-btn>
        </div>

        <template v-if="workouts.length > 0">
            <div class="d-flex flex-column flex-sm-row align-start align-sm-center mb-4 gap-y-2">
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
                <WorkoutListItem
                    v-for="workout in filteredWorkouts"
                    :key="workout.id"
                    :workout="workout"
                    @click="viewWorkout(workout)"
                />
            </div>
        </template>
        <!-- Empty State -->
        <div v-else class="pa-8 text-center">
            <v-icon icon="mdi-dumbbell" size="64" color="grey-lighten-3" class="mb-4"></v-icon>
            <h3 class="text-h6 text-medium-emphasis mb-2">No workouts found</h3>
            <p class="text-body-2 text-medium-emphasis mb-6">
                {{ "You haven't logged any workouts yet." }}
            </p>
        </div>
    </v-container>
</template>

<script setup lang="ts">
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

const selectedSort = ref(0);
const sortOptions = [
    { label: "Newest first", value: "dateDesc" },
    { label: "Oldest first", value: "dateAsc" },
    { label: "Alphabetical", value: "name" },
];

const isWorkoutActive = computed(() => activeWorkoutStore.isWorkoutActive);

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

function viewWorkout(workout: WorkoutWithId): void {
    router.push({ name: "WorkoutDetail", params: { id: workout.id } });
}
</script>
