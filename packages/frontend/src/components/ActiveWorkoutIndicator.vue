<template>
    <v-slide-y-transition>
        <div v-if="activeWorkout && !isOnWorkoutPlansPage" class="active-workout-indicator">
            <v-card color="primary" elevation="8" class="px-4 py-2 d-flex align-center">
                <div>
                    <div class="text-subtitle-2 font-weight-medium">
                        <v-icon size="small" class="mr-1">mdi-arm-flex</v-icon>
                        {{ activeWorkout.name }}
                    </div>
                    <div class="text-caption">Workout in progress ({{ getElapsedTimeText() }})</div>
                </div>
                <v-spacer></v-spacer>
                <v-btn variant="tonal" color="white" @click="goToWorkout" size="small">
                    Continue
                </v-btn>
            </v-card>
        </div>
    </v-slide-y-transition>
</template>

<script setup lang="ts">
import { useNow } from "@vueuse/core";
import { isString } from "es-toolkit";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

import { getDateFromMaybeTimestamp, ONE_HOUR, ONE_MINUTE, ONE_SECOND } from "../helpers/date-utils";
import { useActiveWorkoutStore } from "../stores/active-workout";

const activeWorkoutStore = useActiveWorkoutStore();
const router = useRouter();
const route = useRoute();
const now = useNow({ interval: 1000 });

const activeWorkout = computed(() => activeWorkoutStore.activeWorkout);
const isOnWorkoutPlansPage = computed(
    () => isString(route.name) && Boolean(/CustomWorkout|WorkoutLogs/.exec(route.name)),
);

function getElapsedTimeText(): string {
    if (!activeWorkout.value) return "";

    const startTime = getDateFromMaybeTimestamp(activeWorkout.value.date);
    const elapsedMs = now.value.getTime() - startTime.getTime();

    const hours = Math.floor(elapsedMs / ONE_HOUR);
    const minutes = Math.floor((elapsedMs % ONE_HOUR) / ONE_MINUTE);
    const seconds = Math.floor((elapsedMs % ONE_MINUTE) / ONE_SECOND);

    if (hours > 0) {
        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

function goToWorkout(): void {
    router.push({ name: "CustomWorkout" });
}
</script>

<style scoped>
.active-workout-indicator {
    position: fixed;
    bottom: 20px;
    left: 0;
    right: 0;
    z-index: 100;
    padding: 0 16px;
}
</style>
