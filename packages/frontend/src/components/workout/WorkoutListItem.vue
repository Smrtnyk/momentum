<template>
    <v-card @click="handleClick" class="workout-list-item mb-2 rounded-lg" :elevation="0">
        <!-- Color indicator based on workout content -->
        <div
            class="workout-type-indicator"
            :class="{
                'strength-indicator': hasStrengthOnly,
                'cardio-indicator': hasCardioOnly,
                'mixed-indicator': hasMixedExercises,
            }"
        ></div>

        <div class="pa-3 pa-sm-4">
            <!-- Header: Title with integrated small icon -->
            <div class="d-flex align-center mb-2">
                <v-icon
                    :icon="getWorkoutIcon()"
                    :color="getWorkoutColor()"
                    size="18"
                    class="mr-2"
                ></v-icon>
                <div class="text-subtitle-1 font-weight-medium text-truncate">
                    {{ workout.name }}
                </div>
            </div>

            <!-- Metrics row -->
            <div class="d-flex flex-wrap align-center">
                <!-- Date -->
                <div class="workout-metric me-3">
                    <v-icon
                        icon="mdi-calendar"
                        size="14"
                        class="me-1 text-medium-emphasis"
                    ></v-icon>
                    <span class="text-caption text-medium-emphasis">
                        <WorkoutDateInfo :workout="workout" />
                    </span>
                </div>

                <!-- Duration/Distance -->
                <div class="workout-metric">
                    <v-icon
                        :icon="getMetricsIcon()"
                        size="14"
                        class="me-1 text-medium-emphasis"
                    ></v-icon>
                    <span class="text-caption text-medium-emphasis">
                        {{ workoutMetrics }}
                    </span>
                </div>

                <!-- Chevron (pushed to right) -->
                <v-btn
                    icon="mdi-chevron-right"
                    variant="text"
                    density="compact"
                    color="medium-emphasis"
                    class="ms-auto"
                    size="small"
                ></v-btn>
            </div>

            <div class="mt-2 muscles-container">
                <WorkoutHitMusclesChips :workout="workout" />
            </div>
        </div>
    </v-card>
</template>

<script setup lang="ts">
import { computed } from "vue";

import type { ExerciseEntry, WorkoutWithId } from "../../types/workout";

import { isCardioExercise, isStrengthExercise } from "../../services/workout";
import WorkoutDateInfo from "./WorkoutDateInfo.vue";
import WorkoutHitMusclesChips from "./WorkoutHitMusclesChips.vue";

const props = defineProps<{ workout: WorkoutWithId }>();
const emit = defineEmits<(e: "click", workout: WorkoutWithId) => void>();

const strengthExercises = computed((): ExerciseEntry[] => {
    return props.workout.exerciseEntries.filter(isStrengthExercise);
});

const cardioExercises = computed((): ExerciseEntry[] => {
    return props.workout.exerciseEntries.filter(isCardioExercise);
});

const hasStrengthOnly = computed((): boolean => {
    return strengthExercises.value.length > 0 && cardioExercises.value.length === 0;
});

const hasCardioOnly = computed((): boolean => {
    return cardioExercises.value.length > 0 && strengthExercises.value.length === 0;
});

const hasMixedExercises = computed((): boolean => {
    return strengthExercises.value.length > 0 && cardioExercises.value.length > 0;
});

function getMetricsIcon(): string {
    if (hasCardioOnly.value && getTotalDistance() > 0) {
        return "mdi-map-marker-distance";
    }
    return "mdi-clock-outline";
}

function getTotalDistance(): number {
    return cardioExercises.value.reduce(function (sum, entry) {
        return sum + (entry.distanceKm ?? 0);
    }, 0);
}

function getTotalDurationMinutes(): number {
    if (props.workout.workoutDurationMinutes) {
        return props.workout.workoutDurationMinutes;
    }

    if (cardioExercises.value.length > 0) {
        return cardioExercises.value.reduce(function (sum, entry) {
            return sum + (entry.durationSeconds ? entry.durationSeconds / 60 : 0);
        }, 0);
    }

    return 0;
}

function getTotalSets(): number {
    return strengthExercises.value.reduce(function (sum, entry) {
        return sum + (entry.sets?.length ?? 0);
    }, 0);
}

function getWorkoutColor(): string {
    if (hasStrengthOnly.value) return "primary";
    if (hasCardioOnly.value) return "teal";
    return "amber";
}

function getWorkoutIcon(): string {
    if (hasStrengthOnly.value) return "mdi-dumbbell";
    if (hasCardioOnly.value) return "mdi-run";
    return "mdi-timer";
}

const workoutMetrics = computed(function (): string {
    const totalMinutes = getTotalDurationMinutes();
    const totalSets = getTotalSets();
    const totalDistance = getTotalDistance();

    // Mixed workout with strength focus
    if (hasMixedExercises.value && strengthExercises.value.length >= cardioExercises.value.length) {
        return `${totalMinutes} min · ${totalSets} sets`;
    }

    // Mixed workout with cardio focus or cardio-only
    if (hasCardioOnly.value || hasMixedExercises.value) {
        if (totalDistance > 0) {
            return `${totalDistance.toFixed(1)} km · ${totalMinutes} min`;
        }
        return `${totalMinutes} min`;
    }

    // Strength workout
    return `${totalMinutes} min · ${totalSets} sets`;
});

function handleClick(): void {
    emit("click", props.workout);
}
</script>

<style scoped>
.workout-list-item {
    overflow: hidden;
    transition: all 0.2s ease;
    position: relative;
    border-left: none;
}

.workout-type-indicator {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
}

.strength-indicator {
    background-color: rgb(92, 107, 192); /* blue-ish */
}

.cardio-indicator {
    background-color: rgb(38, 166, 154); /* teal-ish */
}

.mixed-indicator {
    background-color: rgb(255, 167, 38); /* amber-ish */
}

.workout-metric {
    display: flex;
    align-items: center;
    margin-bottom: 2px;
}

.muscles-container {
    overflow-x: auto;
    white-space: nowrap;
    scrollbar-width: none;
}

.muscles-container::-webkit-scrollbar {
    display: none;
}
</style>
