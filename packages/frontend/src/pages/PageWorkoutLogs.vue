<script setup lang="ts">
import { useAsyncState } from "@vueuse/core";
import { watch } from "vue";
import { useRouter } from "vue-router";

import type { WorkoutWithId } from "../types/workout";

import WorkoutList from "../components/workout/WorkoutList.vue";
import { getWorkouts } from "../services/workout";
import { useAuthStore } from "../stores/auth";
import { useGlobalStore } from "../stores/global";

const router = useRouter();
const authStore = useAuthStore();
const globalStore = useGlobalStore();
const { error, state: workouts } = useAsyncState<WorkoutWithId[]>(() => {
    return getWorkouts(authStore.nonNullableUser.uid);
}, []);

watch(error, function (err) {
    if (err) {
        globalStore.notifyError(err);
    }
});

function goToWorkoutLogger(): void {
    router.push({ name: "WorkoutLogger" });
}
</script>

<template>
    <v-container fluid class="pa-4">
        <v-row v-if="workouts.length > 0">
            <v-col cols="12">
                <WorkoutList :workouts="workouts" />
            </v-col>
        </v-row>
        <div v-else class="pa-8 text-center">
            <v-icon icon="mdi-dumbbell" size="64" color="grey-lighten-3" class="mb-4"></v-icon>
            <h3 class="text-h6 text-medium-emphasis mb-2">No workouts found</h3>
            <p class="text-body-2 text-medium-emphasis mb-6">
                {{ "You haven't logged any workouts yet." }}
            </p>
            <v-btn
                color="primary"
                prepend-icon="mdi-plus"
                @click="goToWorkoutLogger"
                variant="tonal"
            >
                Add Your First Workout
            </v-btn>
        </div>
    </v-container>
</template>
