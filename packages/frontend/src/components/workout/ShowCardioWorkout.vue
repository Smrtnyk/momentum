<template>
    <v-container class="pa-2 mx-auto">
        <div>
            <!-- Main Workout Card -->
            <v-card variant="flat" class="mb-6" elevation="2">
                <v-card-item class="pt-4 pb-0">
                    <!-- Header with improved layout to prevent button overflow -->
                    <div class="d-flex align-center w-100">
                        <div class="title-container">
                            <v-card-title class="text-h6 font-weight-bold text-truncate">
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
                                <v-icon icon="mdi-run-fast" size="small" class="mr-2"></v-icon>
                                {{ workout.exerciseEntries.length }} activities
                            </div>
                            <v-divider vertical class="mx-2"></v-divider>

                            <div
                                class="d-flex align-center text-body-2 text-grey-lighten-1 me-2 mb-2"
                            >
                                <v-icon
                                    icon="mdi-map-marker-distance"
                                    size="small"
                                    class="mr-2"
                                ></v-icon>
                                {{
                                    workout.exerciseEntries
                                        .reduce(function (total, entry) {
                                            return total + (entry.distanceKm || 0);
                                        }, 0)
                                        .toFixed(1)
                                }}
                                km
                            </div>

                            <v-divider vertical class="mx-2"></v-divider>

                            <div class="d-flex align-center text-body-2 text-grey-lighten-1 mb-2">
                                <v-icon icon="mdi-fire" size="small" class="mr-2"></v-icon>
                                {{
                                    workout.exerciseEntries.reduce(function (total, entry) {
                                        return total + (entry.calories || 0);
                                    }, 0)
                                }}
                                kcal
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

            <!-- Activities Section -->
            <div class="text-h5 font-weight-medium mb-4">Activities</div>

            <div v-for="(entry, index) in workout.exerciseEntries" :key="index" class="mb-4">
                <v-card variant="outlined" class="pa-4">
                    <div class="d-flex gap-x-4">
                        <!-- Activity Number -->
                        <div class="text-h6 text-secondary font-weight-bold">
                            {{ index + 1 }}
                        </div>

                        <!-- Activity Content -->
                        <div class="flex-grow-1 min-width-0">
                            <!-- Activity Header -->
                            <div class="d-flex align-center justify-space-between">
                                <div class="text-h6 font-weight-medium text-truncate">
                                    {{ getExerciseName(entry.exerciseId) || "Unknown Activity" }}
                                </div>
                            </div>

                            <!-- Activity Notes -->
                            <div
                                v-if="entry.exerciseNotes"
                                class="text-body-2 text-grey-lighten-2 mt-2"
                            >
                                <v-icon icon="mdi-note-text" size="small" class="mr-2"></v-icon>
                                {{ entry.exerciseNotes }}
                            </div>

                            <!-- Activity Metrics -->
                            <v-row class="mt-4 activity-metrics">
                                <v-col cols="6" sm="4">
                                    <div class="d-flex align-center gap-2">
                                        <v-icon
                                            icon="mdi-clock-outline"
                                            color="secondary"
                                            class="mr-2"
                                        />
                                        <div>
                                            <div class="text-caption">Duration</div>
                                            <div class="text-h7">
                                                {{ entry.durationMinutes }} min
                                            </div>
                                        </div>
                                    </div>
                                </v-col>

                                <v-col cols="6" sm="4" v-if="entry.distanceKm">
                                    <div class="d-flex align-center gap-2">
                                        <v-icon
                                            icon="mdi-map-marker-distance"
                                            color="secondary"
                                            class="mr-2"
                                        />
                                        <div>
                                            <div class="text-caption">Distance</div>
                                            <div class="text-h7">{{ entry.distanceKm }} km</div>
                                        </div>
                                    </div>
                                </v-col>

                                <v-col cols="6" sm="4">
                                    <div class="d-flex align-center gap-2">
                                        <v-icon icon="mdi-fire" color="secondary" class="mr-2" />
                                        <div>
                                            <div class="text-caption">Calories</div>
                                            <div class="text-h7">
                                                {{ entry.calories || 0 }} kcal
                                            </div>
                                        </div>
                                    </div>
                                </v-col>

                                <v-col cols="6" sm="4">
                                    <div class="d-flex align-center gap-2">
                                        <v-icon
                                            icon="mdi-speedometer"
                                            color="secondary"
                                            class="mr-2"
                                        />
                                        <div>
                                            <div class="text-caption">Intensity</div>
                                            <v-chip
                                                :color="intensityColor(entry.intensity)"
                                                variant="flat"
                                                size="small"
                                            >
                                                {{ entry.intensity }}
                                            </v-chip>
                                        </div>
                                    </div>
                                </v-col>
                            </v-row>
                        </div>
                    </div>
                </v-card>
            </div>
        </div>
    </v-container>
</template>

<script setup lang="ts">
import type { CardioWorkout } from "../../types/workout";

import { cardioExercises } from "../../data/cardio-exercises";
import WorkoutDateInfo from "./WorkoutDateInfo.vue";
import WorkoutHitMusclesChips from "./WorkoutHitMusclesChips.vue";

const { workout } = defineProps<{ workout: CardioWorkout }>();
const emit = defineEmits<(e: "delete" | "edit") => void>();

function getExerciseName(id: string): string | undefined {
    const exercise = cardioExercises.find(function (exer) {
        return exer.id === id;
    });
    return exercise?.name;
}

function handleDeleteWorkout(): void {
    emit("delete");
}

function handleEditWorkout(): void {
    emit("edit");
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

.activity-metrics .v-col {
    padding-top: 8px;
    padding-bottom: 8px;
}

.min-width-0 {
    min-width: 0;
}
</style>
