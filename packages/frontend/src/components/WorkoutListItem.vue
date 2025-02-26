<template>
    <v-hover v-slot="{ isHovering, props }">
        <v-card
            v-bind="props"
            @click="handleClick"
            class="workout-list-item mb-3 rounded-lg"
            :elevation="isHovering ? 2 : 0"
            :class="{ 'on-hover': isHovering }"
        >
            <v-row no-gutters>
                <!-- Color Accent based on workout type -->
                <div
                    class="workout-type-indicator"
                    :class="isStrength ? 'strength-indicator' : 'cardio-indicator'"
                ></div>

                <!-- Workout Icon -->
                <v-col cols="auto" class="pa-4 d-flex align-center">
                    <v-avatar
                        :color="isStrength ? 'indigo-lighten-5' : 'teal-lighten-5'"
                        size="56"
                        class="workout-icon"
                    >
                        <v-icon
                            :icon="isStrength ? 'mdi-weight-lifter' : 'mdi-run'"
                            :color="isStrength ? 'indigo' : 'teal'"
                            size="24"
                        ></v-icon>
                    </v-avatar>
                </v-col>

                <!-- Workout Info -->
                <v-col class="py-4 px-3">
                    <div class="d-flex flex-column h-100 justify-space-between">
                        <div>
                            <v-card-title class="pa-0 text-h6 font-weight-bold mb-1">
                                {{ workout.name }}
                            </v-card-title>

                            <div class="d-flex align-center mb-2">
                                <v-icon
                                    icon="mdi-calendar"
                                    size="small"
                                    class="me-1 text-medium-emphasis"
                                ></v-icon>
                                <span class="text-caption text-medium-emphasis">
                                    <WorkoutDateInfo :workout="workout" />
                                </span>

                                <v-divider vertical class="mx-2" thickness="2"></v-divider>

                                <v-icon
                                    :icon="
                                        isStrength ? 'mdi-clock-outline' : 'mdi-map-marker-distance'
                                    "
                                    size="small"
                                    class="me-1 text-medium-emphasis"
                                ></v-icon>
                                <span class="text-caption text-medium-emphasis">
                                    {{ workoutMetrics }}
                                </span>
                            </div>
                        </div>

                        <div>
                            <WorkoutHitMusclesChips :workout="workout" />
                        </div>
                    </div>
                </v-col>

                <!-- Workout Progress -->
                <v-col cols="auto" class="pa-4 d-flex align-center">
                    <div class="d-none d-sm-flex flex-column align-center me-2">
                        <v-progress-circular
                            :model-value="progressValue"
                            :color="isStrength ? 'indigo' : 'teal'"
                            size="44"
                            width="4"
                        >
                            <span class="text-caption font-weight-medium">{{ progressLabel }}</span>
                        </v-progress-circular>
                    </div>
                    <v-btn
                        icon="mdi-chevron-right"
                        variant="text"
                        density="comfortable"
                        color="medium-emphasis"
                    ></v-btn>
                </v-col>
            </v-row>
        </v-card>
    </v-hover>
</template>

<script setup lang="ts">
import { computed } from "vue";

import type { CardioWorkout, StrengthWorkout, WorkoutWithId } from "../types/workout";

import { isStrengthWorkout } from "../services/workout";
import WorkoutDateInfo from "./WorkoutDateInfo.vue";
import WorkoutHitMusclesChips from "./WorkoutHitMusclesChips.vue";

const { workout } = defineProps<{ workout: WorkoutWithId }>();
const emit = defineEmits<(e: "click", workout: WorkoutWithId) => void>();

const isStrength = computed(() => isStrengthWorkout(workout));

const workoutMetrics = computed(() => {
    if (isStrength.value) {
        const strengthWorkout = workout as StrengthWorkout;
        return `${strengthWorkout.workoutDurationMinutes} min`;
    }
    const cardioWorkout = workout as CardioWorkout;
    const totalMinutes = cardioWorkout.exerciseEntries.reduce(
        (sum, entry) => sum + entry.durationMinutes,
        0,
    );

    // Get distance if available
    const totalDistance = cardioWorkout.exerciseEntries.reduce(
        (sum, entry) => sum + (entry.distanceKm || 0),
        0,
    );

    if (totalDistance > 0) {
        return `${totalDistance.toFixed(1)} km · ${totalMinutes} min`;
    }

    return `${totalMinutes} min`;
});

// Mock progress value (would come from real data in a production app)
const progressValue = computed(() => {
    // This is a placeholder - in a real app, you'd calculate this based on
    // workout goals, personal records, etc.
    if (isStrength.value) {
        const sets = (workout as StrengthWorkout).exerciseEntries.reduce(
            (total, entry) => total + entry.sets.length,
            0,
        );
        // Normalize to percentage (assuming 20 sets is 100%)
        return Math.min(100, Math.round((sets / 20) * 100));
    }
    // For cardio workouts, use duration (assume 60 min is 100%)
    const totalMinutes = (workout as CardioWorkout).exerciseEntries.reduce(
        (sum, entry) => sum + entry.durationMinutes,
        0,
    );
    return Math.min(100, Math.round((totalMinutes / 60) * 100));
});

const progressLabel = computed(() => {
    if (isStrength.value) {
        const exerciseCount = (workout as StrengthWorkout).exerciseEntries.length;
        return `${exerciseCount}`;
    }
    const intensities = (workout as CardioWorkout).exerciseEntries.map((e) => e.intensity);
    const highIntensity = intensities.filter((i) => i === "high").length;
    if (highIntensity > 0) {
        return "HI";
    }
    return "LI";
});

function handleClick(): void {
    emit("click", workout);
}
</script>

<style scoped>
.workout-list-item {
    overflow: hidden;
    transition: all 0.2s ease;
    position: relative;
}

.on-hover {
    transform: translateY(-2px);
}

.workout-type-indicator {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
}

.strength-indicator {
    background-color: rgb(92, 107, 192);
}

.cardio-indicator {
    background-color: rgb(38, 166, 154);
}

.workout-icon {
    transition: transform 0.2s ease;
}

.on-hover .workout-icon {
    transform: scale(1.05);
}
</style>
