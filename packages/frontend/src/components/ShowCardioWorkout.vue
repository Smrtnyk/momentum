<template>
    <v-container fluid class="pa-4 pa-sm-6">
        <div>
            <!-- Main Workout Card -->
            <v-card variant="flat" class="mb-6" elevation="2">
                <v-card-item class="pt-4 pb-0">
                    <div class="d-flex align-center justify-space-between">
                        <v-card-title class="text-h4 font-weight-bold">
                            {{ workout.name }}
                        </v-card-title>

                        <div class="d-flex gap-xs">
                            <v-btn
                                icon="mdi-pencil"
                                variant="text"
                                color="grey-darken-1"
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

                        <div class="d-flex align-center gap-x-4">
                            <div class="d-flex align-center text-body-2 text-grey-darken-1">
                                <v-icon icon="mdi-run-fast" size="small" class="mr-2"></v-icon>
                                {{ workout.exerciseEntries.length }} activities
                            </div>
                            <v-divider vertical></v-divider>

                            <div class="d-flex align-center text-body-2 text-grey-darken-1">
                                <v-icon
                                    icon="mdi-map-marker-distance"
                                    size="small"
                                    class="mr-2"
                                ></v-icon>
                                {{
                                    workout.exerciseEntries.reduce(
                                        (total, entry) => total + (entry.distanceKm || 0),
                                        0,
                                    )
                                }}
                                km
                            </div>
                        </div>

                        <WorkoutHitMusclesChips :workout="workout" />
                    </div>
                </v-card-text>

                <v-divider v-if="workout.overallNotes" class="mx-4"></v-divider>

                <!-- Notes Section -->
                <v-card-text v-if="workout.overallNotes" class="pt-4">
                    <div class="text-body-1 font-weight-medium text-grey-darken-1">
                        <v-icon icon="mdi-text" size="small" class="mr-2"></v-icon>
                        Workout Notes
                    </div>
                    <p class="text-body-1 mt-2">
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
                        <div class="flex-grow-1">
                            <!-- Activity Header -->
                            <div class="d-flex align-center justify-space-between">
                                <div class="text-h6 font-weight-medium">
                                    {{ getExerciseName(entry.exerciseId) || "Unknown Activity" }}
                                </div>
                            </div>

                            <!-- Activity Notes -->
                            <div
                                v-if="entry.exerciseNotes"
                                class="text-body-2 text-grey-darken-2 mt-2"
                            >
                                <v-icon icon="mdi-note-text" size="small" class="mr-2"></v-icon>
                                {{ entry.exerciseNotes }}
                            </div>

                            <!-- Activity Metrics -->
                            <v-row class="mt-4">
                                <v-col cols="12" md="4">
                                    <div class="d-flex align-center gap-2">
                                        <v-icon
                                            icon="mdi-clock-outline"
                                            color="secondary"
                                            class="mr-2"
                                        />
                                        <div>
                                            <div class="text-caption">Duration</div>
                                            <div class="text-h6">
                                                {{ entry.durationMinutes }} min
                                            </div>
                                        </div>
                                    </div>
                                </v-col>

                                <v-col cols="12" md="4">
                                    <div v-if="entry.distanceKm" class="d-flex align-center gap-2">
                                        <v-icon
                                            icon="mdi-map-marker-distance"
                                            color="secondary"
                                            class="mr-2"
                                        />
                                        <div>
                                            <div class="text-caption">Distance</div>
                                            <div class="text-h6">{{ entry.distanceKm }} km</div>
                                        </div>
                                    </div>
                                </v-col>

                                <v-col cols="12" md="4">
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
import type { Exercise } from "../types/exercise";
import type { CardioWorkout } from "../types/workout";

import WorkoutDateInfo from "../components/WorkoutDateInfo.vue";
import WorkoutHitMusclesChips from "../components/WorkoutHitMusclesChips.vue";
import { getCardioExercises } from "../data/cardio-exercises";

const { workout } = defineProps<{ workout: CardioWorkout }>();
const emit = defineEmits<(e: "delete" | "edit") => void>();

const exercisesList: Exercise[] = getCardioExercises();

function getExerciseName(id: string): string | undefined {
    const exercise = exercisesList.find((exer) => exer.id === id);
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
</style>
