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
const {
    error,
    isLoading,
    state: workouts,
} = useAsyncState<WorkoutWithId[]>(() => {
    return getWorkouts(authStore.nonNullableUser.uid);
}, []);

watch(error, function (err) {
    if (err) {
        globalStore.notifyError(err);
    }
});

function goToWorkoutLogger(): void {
    router.push({ name: "WorkoutLogs" });
}
</script>

<template>
    <v-container class="pa-2 mx-auto">
        <!-- Loading State -->
        <div v-if="isLoading">
            <!-- Dashboard Header Skeleton -->
            <v-card class="mb-4 rounded-lg" elevation="1">
                <div class="pa-4">
                    <div class="d-flex flex-column flex-md-row justify-space-between align-center">
                        <div>
                            <v-skeleton-loader
                                type="text"
                                width="200px"
                                class="mb-1"
                            ></v-skeleton-loader>
                            <v-skeleton-loader type="text" width="250px"></v-skeleton-loader>
                        </div>
                        <v-skeleton-loader
                            type="button"
                            width="150px"
                            class="mt-4 mt-md-0"
                        ></v-skeleton-loader>
                    </div>
                </div>
            </v-card>

            <!-- View Selector Skeleton -->
            <div class="d-flex flex-column flex-sm-row align-start align-sm-center mb-4 gap-y-2">
                <v-skeleton-loader
                    type="button"
                    width="120px"
                    class="mb-2 mb-sm-0"
                ></v-skeleton-loader>
                <v-skeleton-loader
                    type="chip"
                    width="250px"
                    class="ml-0 ml-sm-4"
                ></v-skeleton-loader>
                <v-spacer></v-spacer>
                <v-skeleton-loader
                    type="button"
                    width="120px"
                    class="ml-0 ml-sm-auto"
                ></v-skeleton-loader>
            </div>

            <!-- Workout Item Skeletons -->
            <div v-for="i in 5" :key="i" class="mb-2">
                <v-card elevation="0" class="rounded-lg">
                    <div class="workout-type-indicator-skeleton"></div>
                    <div class="pa-3 pa-sm-4">
                        <div class="d-flex align-center mb-2">
                            <v-skeleton-loader
                                type="avatar"
                                width="18"
                                height="18"
                                class="mr-2"
                            ></v-skeleton-loader>
                            <v-skeleton-loader type="text" width="60%"></v-skeleton-loader>
                        </div>

                        <div class="d-flex flex-wrap align-center">
                            <v-skeleton-loader
                                type="text"
                                width="80px"
                                class="me-3"
                            ></v-skeleton-loader>
                            <v-skeleton-loader type="text" width="100px"></v-skeleton-loader>
                            <v-spacer></v-spacer>
                            <v-skeleton-loader
                                type="avatar"
                                width="24"
                                height="24"
                            ></v-skeleton-loader>
                        </div>
                    </div>
                </v-card>
            </div>
        </div>

        <!-- Loaded State with Content -->
        <v-row v-else-if="workouts.length > 0">
            <v-col cols="12">
                <WorkoutList :workouts="workouts" />
            </v-col>
        </v-row>

        <!-- Empty State -->
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

<style scoped>
.workout-type-indicator-skeleton {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background-color: rgba(0, 0, 0, 0.1);
}
</style>
