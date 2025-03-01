<template>
    <v-slide-y-transition>
        <div v-if="activeWorkout && !isOnWorkoutPlansPage" class="active-workout-indicator">
            <v-card color="primary" elevation="8" class="px-4 py-2 d-flex align-center">
                <div>
                    <div class="text-subtitle-2 font-weight-medium">
                        <v-icon size="small" class="mr-1">mdi-arm-flex</v-icon>
                        {{ activeWorkout.dayName }}
                    </div>
                    <div class="text-caption">Workout in progress ({{ getElapsedTimeText() }})</div>
                </div>
                <v-spacer></v-spacer>
                <v-btn variant="tonal" color="white" @click="goToWorkoutPlans" size="small">
                    Continue
                </v-btn>
            </v-card>
        </div>
    </v-slide-y-transition>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

import { useActiveWorkoutStore } from "../stores/active-workout";

const activeWorkoutStore = useActiveWorkoutStore();
const router = useRouter();
const route = useRoute();

const activeWorkout = computed(() => activeWorkoutStore.activeWorkout);
const isOnWorkoutPlansPage = computed(() => route.name === "WorkoutPlans");

function getElapsedTimeText(): string {
    if (!activeWorkout.value) return "";

    const now = new Date();
    const startTime = activeWorkout.value.startTime;
    const elapsedMs = now.getTime() - startTime.getTime();

    const minutes = Math.floor(elapsedMs / 60_000);
    if (minutes < 60) {
        return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
}

function goToWorkoutPlans(): void {
    router.push({ name: "WorkoutPlans" });
}
</script>

<style scoped>
.active-workout-indicator {
    position: fixed;
    bottom: 70px;
    left: 0;
    right: 0;
    z-index: 100;
    padding: 0 16px;
}
</style>
