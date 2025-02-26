<template>
    <v-hover v-slot="{ isHovering, props }">
        <v-card
            v-bind="props"
            @click="handleClick"
            class="workout-list-item mb-3 rounded-lg"
            :elevation="0"
            :class="{ 'on-hover': isHovering }"
        >
            <v-row no-gutters>
                <!-- Color Accent based on workout type -->
                <div
                    class="workout-type-indicator"
                    :class="isStrength ? 'strength-indicator' : 'cardio-indicator'"
                ></div>

                <!-- Workout Icon -->
                <v-col cols="auto" class="pa-3 pr-2 pa-sm-4 d-flex align-center">
                    <v-avatar
                        :color="isStrength ? 'indigo-lighten-5' : 'teal-lighten-5'"
                        :size="$vuetify.display.xs ? 48 : 56"
                        class="workout-icon"
                    >
                        <v-icon
                            :icon="isStrength ? 'mdi-weight-lifter' : 'mdi-run'"
                            :color="isStrength ? 'indigo' : 'teal'"
                            :size="$vuetify.display.xs ? 28 : 32"
                        ></v-icon>
                    </v-avatar>
                </v-col>

                <!-- Workout Info -->
                <v-col class="py-3 py-sm-4 px-2 px-sm-3">
                    <div class="d-flex flex-column h-100 justify-space-between">
                        <div class="workout-content">
                            <v-card-title class="pa-0 text-h6 font-weight-bold mb-1 text-truncate">
                                {{ workout.name }}
                            </v-card-title>

                            <div class="d-flex align-center mb-2 flex-wrap">
                                <div class="d-flex align-center me-2">
                                    <v-icon
                                        icon="mdi-calendar"
                                        size="small"
                                        class="me-1 text-medium-emphasis"
                                    ></v-icon>
                                    <span class="text-caption text-medium-emphasis text-no-wrap">
                                        <WorkoutDateInfo :workout="workout" />
                                    </span>
                                </div>

                                <div class="d-flex align-center">
                                    <v-divider
                                        vertical
                                        class="d-none d-sm-flex mx-2"
                                        thickness="2"
                                    ></v-divider>

                                    <v-icon
                                        :icon="
                                            isStrength
                                                ? 'mdi-clock-outline'
                                                : 'mdi-map-marker-distance'
                                        "
                                        size="small"
                                        class="me-1 text-medium-emphasis"
                                    ></v-icon>
                                    <span class="text-caption text-medium-emphasis text-no-wrap">
                                        {{ workoutMetrics }}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <WorkoutHitMusclesChips :workout="workout" />
                    </div>
                </v-col>

                <!-- Workout Progress & Action Button -->
                <v-col cols="auto" class="pa-2 pa-sm-4 d-flex align-center ms-auto">
                    <v-btn
                        icon="mdi-chevron-right"
                        variant="text"
                        density="comfortable"
                        color="medium-emphasis"
                        class="ms-auto chevron-btn"
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

.text-no-wrap {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.workout-content {
    min-width: 0; /* Important for text truncation to work */
}

.workout-chips {
    max-width: 100%;
    overflow-x: hidden;
}

.chevron-btn {
    margin-left: auto;
    flex-shrink: 0;
}
</style>
