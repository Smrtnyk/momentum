<script setup lang="ts">
import { useAsyncState } from "@vueuse/core";
import { watch } from "vue";

import type { WorkoutWithId } from "../types/workout";

import WorkoutList from "../components/WorkoutList.vue";
import { auth } from "../firebase";
import { getWorkouts } from "../services/workout";
import { useGlobalStore } from "../stores/global";

const globalStore = useGlobalStore();
const { error, state: workouts } = useAsyncState<WorkoutWithId[]>(() => {
    if (auth.currentUser) {
        return getWorkouts(auth.currentUser.uid);
    }
    return Promise.resolve([]);
}, []);

watch(error, function (err) {
    if (err) {
        globalStore.notifyError(err);
    }
});
</script>

<template>
    <v-container fluid class="pa-4">
        <v-row v-if="workouts.length > 0">
            <v-col cols="12">
                <WorkoutList :workouts="workouts" />
            </v-col>
        </v-row>
        <div v-else>
            <v-alert type="info" variant="tonal" class="mt-4" border="start" rounded="lg">
                <template #prepend>
                    <v-icon icon="mdi-information" class="mr-3"></v-icon>
                </template>
                <h3 class="text-body-1 font-weight-medium mb-2">No workouts found</h3>
                <p class="text-caption">Start by creating your first workout routine</p>
            </v-alert>
        </div>
    </v-container>
</template>
