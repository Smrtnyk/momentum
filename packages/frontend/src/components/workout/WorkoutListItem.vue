<template>
    <v-card @click="handleClick" class="workout-list-item mb-2 rounded-lg" :elevation="0">
        <!-- Color indicator based on workout type -->
        <div
            class="workout-type-indicator"
            :class="{
                'strength-indicator': isStrengthWorkout(workout),
                'cardio-indicator': isCardioWorkout(workout),
                'circuit-indicator': isCircuitWorkout(workout),
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

import type {
    CardioWorkout,
    CircuitWorkout,
    StrengthWorkout,
    WorkoutWithId,
} from "../../types/workout";

import { isCardioWorkout, isCircuitWorkout, isStrengthWorkout } from "../../services/workout";
import WorkoutDateInfo from "./WorkoutDateInfo.vue";
import WorkoutHitMusclesChips from "./WorkoutHitMusclesChips.vue";

const props = defineProps<{ workout: WorkoutWithId }>();
const emit = defineEmits<(e: "click", workout: WorkoutWithId) => void>();

function getMetricsIcon(): string {
    if (isStrengthWorkout(props.workout) || isCircuitWorkout(props.workout)) {
        return "mdi-clock-outline";
    }
    return "mdi-map-marker-distance";
}

function getWorkoutColor(): string {
    if (isStrengthWorkout(props.workout)) {
        return "primary";
    } else if (isCircuitWorkout(props.workout)) {
        return "amber-darken-2";
    }
    return "secondary";
}

function getWorkoutIcon(): string {
    if (isStrengthWorkout(props.workout)) {
        return "mdi-weight-lifter";
    } else if (isCircuitWorkout(props.workout)) {
        return "mdi-timer";
    }
    return "mdi-run";
}

const workoutMetrics = computed(function (): string {
    if (isStrengthWorkout(props.workout)) {
        const strengthWorkout = props.workout as StrengthWorkout;
        return `${strengthWorkout.workoutDurationMinutes} min`;
    } else if (isCircuitWorkout(props.workout)) {
        const circuitWorkout = props.workout as CircuitWorkout;

        const totalSets = circuitWorkout.exerciseEntries.reduce(function (sum, entry) {
            return sum + entry.sets.length;
        }, 0);

        return `${circuitWorkout.workoutDurationMinutes} min · ${totalSets} sets`;
    }
    const cardioWorkout = props.workout as CardioWorkout;
    const totalMinutes = cardioWorkout.exerciseEntries.reduce(function (sum, entry) {
        return sum + entry.durationMinutes;
    }, 0);

    const totalDistance = cardioWorkout.exerciseEntries.reduce(function (sum, entry) {
        return sum + (entry.distanceKm || 0);
    }, 0);

    if (totalDistance > 0) {
        return `${totalDistance.toFixed(1)} km · ${totalMinutes} min`;
    }

    return `${totalMinutes} min`;
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
    background-color: rgb(92, 107, 192);
}

.cardio-indicator {
    background-color: rgb(38, 166, 154);
}

.circuit-indicator {
    background-color: rgb(255, 167, 38);
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
