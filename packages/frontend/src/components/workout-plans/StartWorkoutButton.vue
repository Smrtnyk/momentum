<template>
    <div>
        <v-btn
            color="success"
            size="large"
            prepend-icon="mdi-play"
            @click="startWorkout"
            :disabled="isWorkoutActive"
            :loading="loading"
            class="px-4"
        >
            {{ isWorkoutActive ? "Workout in Progress" : "Start Workout" }}
        </v-btn>

        <div v-if="isWorkoutActive && activeWorkoutInfo" class="mt-2 text-caption">
            <v-alert type="info" variant="tonal" density="compact" class="text-caption mb-0 pa-2">
                <span class="font-weight-medium">{{ activeWorkoutInfo.name }}</span> workout in
                progress. Complete or cancel it before starting a new one.
            </v-alert>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

import type { TrainingPlan, WorkoutDay } from "../../types/workout-plans";

import { useActiveWorkoutStore } from "../../stores/active-workout";
import { useGlobalStore } from "../../stores/global";

const props = defineProps<{
    day: WorkoutDay;
    plan: TrainingPlan;
}>();

const activeWorkoutStore = useActiveWorkoutStore();
const globalStore = useGlobalStore();
const loading = ref(false);

const isWorkoutActive = computed(() => activeWorkoutStore.isWorkoutActive);
const activeWorkoutInfo = computed(() => activeWorkoutStore.activeWorkout);

function startWorkout(): void {
    try {
        loading.value = true;
        activeWorkoutStore.startWorkout(props.plan, props.day);
        globalStore.notify(`Started workout: ${props.day.name}`);
    } catch {
        globalStore.notifyError("Failed to start workout");
    } finally {
        loading.value = false;
    }
}
</script>
