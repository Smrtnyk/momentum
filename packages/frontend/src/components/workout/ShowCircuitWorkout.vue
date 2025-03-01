<template>
    <v-container class="pa-2 mx-auto">
        <div>
            <!-- Main Workout Card -->
            <v-card variant="flat" class="mb-6" elevation="2">
                <v-card-item class="pt-4 pb-0">
                    <div class="d-flex align-center w-100">
                        <div class="title-container">
                            <v-card-title class="text-h5 font-weight-bold text-truncate">
                                {{ workout.name }}
                            </v-card-title>
                        </div>

                        <div class="action-buttons flex-shrink-0 ms-2">
                            <v-btn
                                icon="mdi-pencil"
                                variant="text"
                                color="grey-lighten-1"
                                @click="handleEditWorkout"
                                density="comfortable"
                            ></v-btn>
                            <v-btn
                                icon="mdi-delete"
                                variant="text"
                                color="error"
                                @click="handleDeleteWorkout"
                                density="comfortable"
                            ></v-btn>
                        </div>
                    </div>
                </v-card-item>

                <v-card-text>
                    <!-- Metadata Section -->
                    <div class="d-flex flex-column gap-y-4">
                        <WorkoutDateInfo :workout="workout" />

                        <div class="d-flex flex-wrap align-center">
                            <div
                                class="d-flex align-center text-body-2 text-grey-lighten-1 me-2 mb-2"
                            >
                                <v-icon icon="mdi-timer" size="small" class="mr-2"></v-icon>
                                {{ workout.exerciseEntries.length }} exercises
                            </div>
                            <v-divider vertical class="mx-2"></v-divider>
                            <div
                                class="d-flex align-center text-body-2 text-grey-lighten-1 me-2 mb-2"
                            >
                                <v-icon icon="mdi-recycle" size="small" class="mr-2"></v-icon>
                                {{ totalSets }} sets
                            </div>
                            <v-divider vertical class="mx-2"></v-divider>
                            <div class="d-flex align-center text-body-2 text-grey-lighten-1 mb-2">
                                <v-icon icon="mdi-clock-outline" size="small" class="mr-2"></v-icon>
                                {{ workout.workoutDurationMinutes }} min
                            </div>
                        </div>

                        <WorkoutHitMusclesChips :workout="workout" />
                    </div>
                </v-card-text>

                <v-divider v-if="workout.overallNotes" class="mx-4"></v-divider>

                <!-- Notes Section -->
                <v-card-text v-if="workout.overallNotes" class="pt-4">
                    <div class="text-body-1 font-weight-medium text-grey-lighten-1">
                        <v-icon icon="mdi-text" size="small" class="mr-2"></v-icon>
                        Workout Notes
                    </div>
                    <p class="text-body-2 mt-2">
                        {{ workout.overallNotes }}
                    </p>
                </v-card-text>
            </v-card>

            <!-- Exercises Section -->
            <div class="text-h5 font-weight-medium mb-4">Circuit Exercises</div>

            <div v-for="(entry, index) in workout.exerciseEntries" :key="index" class="mb-4">
                <v-card variant="outlined" class="pa-4">
                    <div class="d-flex gap-x-4">
                        <!-- Exercise Number -->
                        <div class="text-h6 text-amber-darken-2 font-weight-bold">
                            {{ index + 1 }}
                        </div>

                        <!-- Exercise Content -->
                        <div class="flex-grow-1">
                            <!-- Exercise Header -->
                            <div class="d-flex align-center justify-space-between">
                                <div class="text-h6 font-weight-medium text-truncate">
                                    {{ getExerciseName(entry.exerciseId) || "Unknown Exercise" }}
                                </div>

                                <!-- Intensity badge if available -->
                                <v-chip
                                    v-if="entry.intensity"
                                    :color="intensityColor(entry.intensity)"
                                    size="small"
                                    class="ml-2"
                                >
                                    {{ entry.intensity }}
                                </v-chip>
                            </div>

                            <!-- Exercise Notes -->
                            <div
                                v-if="entry.exerciseNotes"
                                class="text-body-2 text-grey-lighten-2 mt-2"
                            >
                                <v-icon icon="mdi-note-text" size="small" class="mr-2"></v-icon>
                                {{ entry.exerciseNotes }}
                            </div>

                            <!-- Sets Table -->
                            <div class="table-container mt-4">
                                <v-table density="compact">
                                    <thead>
                                        <tr>
                                            <th class="text-left">Set</th>
                                            <th class="text-left">Reps</th>
                                            <th class="text-left" v-if="hasWeights(entry)">
                                                Weight
                                            </th>
                                            <th class="text-left" v-if="entry.durationSeconds">
                                                Duration
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(set, sIdx) in entry.sets" :key="sIdx">
                                            <td class="font-weight-medium">#{{ sIdx + 1 }}</td>
                                            <td>{{ set.reps }}</td>
                                            <td v-if="hasWeights(entry)">{{ set.weight }} kg</td>
                                            <td v-if="entry.durationSeconds">
                                                {{ formatDuration(entry.durationSeconds) }}
                                            </td>
                                        </tr>
                                    </tbody>
                                </v-table>
                            </div>

                            <!-- Additional Cardio Metrics if available -->
                            <div
                                v-if="hasDuration(entry) || hasDistance(entry)"
                                class="mt-3 d-flex flex-wrap"
                            >
                                <v-chip
                                    v-if="hasDuration(entry)"
                                    class="mr-2 mb-2"
                                    size="small"
                                    color="grey-lighten-2"
                                >
                                    <v-icon size="small" start>mdi-clock-outline</v-icon>
                                    {{ formatDuration(entry.durationSeconds || 0) }}
                                </v-chip>

                                <v-chip
                                    v-if="hasDistance(entry)"
                                    class="mr-2 mb-2"
                                    size="small"
                                    color="grey-lighten-2"
                                >
                                    <v-icon size="small" start>mdi-map-marker-distance</v-icon>
                                    {{ entry.distanceKm?.toFixed(2) }} km
                                </v-chip>

                                <v-chip
                                    v-if="hasCalories(entry)"
                                    class="mb-2"
                                    size="small"
                                    color="grey-lighten-2"
                                >
                                    <v-icon size="small" start>mdi-fire</v-icon>
                                    {{ entry.calories }} kcal
                                </v-chip>
                            </div>
                        </div>
                    </div>
                </v-card>
            </div>
        </div>
    </v-container>
</template>

<script setup lang="ts">
import { isNotNil } from "es-toolkit";
import { computed } from "vue";

import type { CircuitExerciseEntry, CircuitWorkout } from "../../types/workout";

import { cardioExercises } from "../../data/cardio-exercises";
import { strengthExercises } from "../../data/strength-exercises";
import WorkoutDateInfo from "./WorkoutDateInfo.vue";
import WorkoutHitMusclesChips from "./WorkoutHitMusclesChips.vue";

const props = defineProps<{ workout: CircuitWorkout }>();
const emit = defineEmits<(e: "delete" | "edit") => void>();

const totalSets = computed(function (): number {
    return props.workout.exerciseEntries.reduce(function (total, entry) {
        return total + entry.sets.length;
    }, 0);
});

function formatDuration(seconds: number): string {
    if (seconds < 60) {
        return `${seconds}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
}

function getExerciseName(id: string): string | undefined {
    const strengthExercise = strengthExercises.find((exer) => exer.id === id);
    if (strengthExercise) {
        return strengthExercise.name;
    }

    const cardioExercise = cardioExercises.find((exer) => exer.id === id);
    return cardioExercise?.name;
}

function handleDeleteWorkout(): void {
    emit("delete");
}

function handleEditWorkout(): void {
    emit("edit");
}

function hasCalories(entry: CircuitExerciseEntry): boolean {
    return isNotNil(entry.calories) && entry.calories > 0;
}

function hasDistance(entry: CircuitExerciseEntry): boolean {
    return isNotNil(entry.distanceKm) && entry.distanceKm > 0;
}

function hasDuration(entry: CircuitExerciseEntry): boolean {
    return isNotNil(entry.durationSeconds) && entry.durationSeconds > 0;
}

function hasWeights(entry: CircuitExerciseEntry): boolean {
    return entry.sets.some((set) => set.weight > 0);
}

function intensityColor(intensity: string): string {
    switch (intensity) {
        case "high":
            return "error";
        case "low":
            return "success";
        case "medium":
            return "warning";
        default:
            return "grey";
    }
}
</script>

<style scoped>
.gap-xs {
    gap: 8px;
}
.gap-x-4 {
    column-gap: 16px;
}
.gap-y-4 {
    row-gap: 16px;
}

.title-container {
    flex-grow: 1;
    min-width: 0;
    overflow: hidden;
}

.action-buttons {
    display: flex;
    gap: 4px;
}

.table-container {
    overflow-x: auto;
}
</style>
