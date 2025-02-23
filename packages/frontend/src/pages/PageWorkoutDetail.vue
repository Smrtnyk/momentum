<template>
    <div v-if="workout">
        <ShowStrengthWorkout
            v-if="isStrengthWorkout(workout)"
            :workout="workout"
            @delete="handleDeleteWorkout"
            @edit="handleEditWorkout"
        />

        <ShowCardioWorkout
            v-if="workout && isCardioWorkout(workout)"
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
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import type { WorkoutWithId } from "../types/workout";

import ShowCardioWorkout from "../components/ShowCardioWorkout.vue";
import ShowStrengthWorkout from "../components/ShowStrengthWorkout.vue";
import { useGlobalConfirm } from "../composables/useConfirmDialog";
import {
    deleteWorkout as deleteWorkoutService,
    getWorkoutById,
    isCardioWorkout,
    isStrengthWorkout,
} from "../services/workout";
import { useGlobalStore } from "../stores/global";

const route = useRoute();
const router = useRouter();
const globalStore = useGlobalStore();
const workoutId = route.params.id as string;

const confirmDelete = ref(false);

const { error, state: workout } = useAsyncState<null | WorkoutWithId>(
    () => getWorkoutById(workoutId),
    null,
);

watch(error, function (err) {
    if (err) {
        globalStore.notifyError(err);
    }
});
const { openConfirm } = useGlobalConfirm();

async function handleDeleteWorkout(): Promise<void> {
    if (!workout.value) return;

    const confirmed = await openConfirm({
        message: "Are you sure you want to delete this workout? This action cannot be undone.",
        title: "Confirm Delete",
    });

    if (!confirmed) {
        return;
    }

    try {
        await deleteWorkoutService(workout.value.id);
        globalStore.notify("Workout deleted successfully!");
        await router.replace({ name: "Home" });
    } catch (e) {
        globalStore.notifyError(e);
    } finally {
        confirmDelete.value = false;
    }
}

function handleEditWorkout(): void {
    if (!workout.value) {
        return;
    }
    router.push({ name: "WorkoutEdit", params: { id: workout.value.id } });
}
</script>
