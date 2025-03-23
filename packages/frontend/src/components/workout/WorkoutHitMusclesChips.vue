<template>
    <div>
        <div v-if="isLoading" class="d-flex align-center flex-wrap gap-1 workout-chips">
            <div v-for="i in 4" :key="i" class="skeleton-chip mr-1"></div>
        </div>

        <div v-else-if="error" class="text-caption text-error">Failed to load muscles</div>

        <div v-else class="d-flex align-center flex-wrap gap-1 workout-chips">
            <v-chip
                v-for="muscle in state"
                :key="muscle"
                size="x-small"
                density="comfortable"
                variant="tonal"
                class="text-body-2 font-weight-medium mr-1"
            >
                {{ muscle }}
            </v-chip>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAsyncState } from "@vueuse/core";

import type { WorkoutWithId } from "../../types/workout";

import { useExerciseStore } from "../../stores/exercises";

const props = defineProps<{ workout: WorkoutWithId }>();
const exerciseStore = useExerciseStore();

async function fetchMuscles(): Promise<string[]> {
    const exerciseIds = props.workout.exerciseEntries.map((entry) => entry.exerciseId);
    const exercises = await Promise.all(exerciseIds.map(exerciseStore.getExerciseById));
    const allMuscles = exercises.flatMap((exercise) => {
        return exercise.primaryMuscles;
    });

    return [...new Set(allMuscles)].sort();
}

const { error, isLoading, state } = useAsyncState(fetchMuscles, [], { immediate: true });
</script>

<style scoped>
.skeleton-chip {
    height: 24px;
    width: 60px;
    border-radius: 16px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
    0% {
        background-position: -200% 0;
    }
    100% {
        background-position: 200% 0;
    }
}

@media (max-width: 600px) {
    .workout-chips :deep(.v-chip) {
        height: 24px;
        font-size: 11px;
        padding: 0 8px;
    }

    .skeleton-chip {
        height: 24px;
        width: 50px;
    }
}
</style>
