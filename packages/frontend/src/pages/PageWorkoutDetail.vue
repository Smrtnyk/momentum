<template>
    <!-- Loading State -->
    <v-container v-if="isLoading" class="pa-2 mx-auto">
        <!-- Main Workout Card Skeleton -->
        <v-card variant="flat" class="mb-6" elevation="2">
            <v-card-item class="pt-4 pb-0">
                <div class="d-flex align-center w-100">
                    <div class="flex-grow-1">
                        <v-skeleton-loader type="text" width="70%"></v-skeleton-loader>
                    </div>
                    <div class="d-flex gap-2">
                        <v-skeleton-loader
                            type="avatar"
                            size="small"
                            width="36"
                        ></v-skeleton-loader>
                        <v-skeleton-loader
                            type="avatar"
                            size="small"
                            width="36"
                        ></v-skeleton-loader>
                    </div>
                </div>
            </v-card-item>

            <v-card-text>
                <div class="d-flex flex-column gap-y-4">
                    <v-skeleton-loader type="text" width="40%"></v-skeleton-loader>

                    <div class="d-flex flex-wrap align-center">
                        <v-skeleton-loader
                            type="text"
                            width="60px"
                            class="me-4"
                        ></v-skeleton-loader>
                        <v-skeleton-loader
                            type="text"
                            width="60px"
                            class="me-4"
                        ></v-skeleton-loader>
                        <v-skeleton-loader type="text" width="60px"></v-skeleton-loader>
                    </div>
                </div>
            </v-card-text>
        </v-card>

        <!-- Exercises Section Title Skeleton -->
        <v-skeleton-loader type="text" class="mb-4" width="120px"></v-skeleton-loader>

        <!-- Exercise Items Skeleton -->
        <div class="mb-4">
            <v-card variant="outlined" class="pa-4">
                <div class="d-flex gap-x-4">
                    <v-skeleton-loader type="text" width="20px"></v-skeleton-loader>
                    <div class="flex-grow-1">
                        <v-skeleton-loader type="text" width="70%"></v-skeleton-loader>
                        <v-skeleton-loader type="text" width="90%" class="mt-4"></v-skeleton-loader>
                        <v-skeleton-loader type="table" class="mt-4"></v-skeleton-loader>
                    </div>
                </div>
            </v-card>
        </div>
    </v-container>

    <!-- Loaded State -->
    <div v-else-if="workout">
        <ShowStrengthWorkout
            v-if="isStrengthWorkout(workout)"
            :workout="workout"
            @delete="handleDeleteWorkout"
            @edit="handleEditWorkout"
        />

        <ShowCardioWorkout
            v-else-if="isCardioWorkout(workout)"
            :workout="workout"
            @delete="handleDeleteWorkout"
            @edit="handleEditWorkout"
        />

        <ShowCircuitWorkout
            v-else-if="isCircuitWorkout(workout)"
            :workout="workout"
            @delete="handleDeleteWorkout"
            @edit="handleEditWorkout"
        />
    </div>

    <!-- Not Found State -->
    <div v-else>
        <v-alert type="error" variant="tonal" border="start" class="my-8" icon="mdi-alert-circle">
            <h3 class="text-h6 font-weight-medium">Workout not found</h3>
            <p class="text-body-1 mt-2">The requested workout could not be located</p>
        </v-alert>
    </div>
</template>

<script setup lang="ts">
import { useAsyncState } from "@vueuse/core";
import { watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import type { WorkoutWithId } from "../types/workout";

import ShowCardioWorkout from "../components/workout/ShowCardioWorkout.vue";
import ShowCircuitWorkout from "../components/workout/ShowCircuitWorkout.vue";
import ShowStrengthWorkout from "../components/workout/ShowStrengthWorkout.vue";
import { globalDialog } from "../composables/useDialog";
import {
    deleteWorkout as deleteWorkoutService,
    getWorkoutById,
    isCardioWorkout,
    isCircuitWorkout,
    isStrengthWorkout,
} from "../services/workout";
import { useAuthStore } from "../stores/auth";
import { useGlobalStore } from "../stores/global";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const globalStore = useGlobalStore();
const workoutId = route.params.id as string;

const {
    error,
    isLoading,
    state: workout,
} = useAsyncState<null | WorkoutWithId>(
    () => getWorkoutById(authStore.nonNullableUser.uid, workoutId),
    null,
);

watch(error, function (err) {
    if (err) {
        globalStore.notifyError(err);
    }
});

async function handleDeleteWorkout(): Promise<void> {
    if (!workout.value) return;

    const confirmed = await globalDialog.confirm({
        message: "Are you sure you want to delete this workout? This action cannot be undone.",
        title: "Confirm Delete",
    });

    if (!confirmed) {
        return;
    }

    try {
        await deleteWorkoutService(authStore.nonNullableUser.uid, workout.value.id);
        globalStore.notify("Workout deleted successfully!");
        await router.replace({ name: "WorkoutLogs" });
    } catch (e) {
        globalStore.notifyError(e);
    }
}

function handleEditWorkout(): void {
    if (!workout.value) {
        return;
    }
    router.push({ name: "WorkoutEdit", params: { id: workout.value.id } });
}
</script>
