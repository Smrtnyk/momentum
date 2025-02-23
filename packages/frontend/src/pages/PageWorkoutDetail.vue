<template>
    <v-container fluid class="pa-4">
        <div v-if="workout">
            <v-card outlined class="mb-4">
                <v-card-title class="d-flex align-center">
                    <div class="flex-grow-1 text-h5">{{ workout.name }}</div>
                    <!-- Edit Button -->
                    <v-btn icon color="primary" @click="handleEditWorkout" title="Edit Workout">
                        <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <!-- Delete Button -->
                    <v-btn icon color="error" @click="handleDeleteWorkout" title="Delete Workout">
                        <v-icon>mdi-trash-can</v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-subtitle>
                    {{ formattedDate }}
                    <span v-if="workout.workoutDurationMinutes" class="ml-2">
                        ({{ formatWorkoutDuration(workout.workoutDurationMinutes) }})
                    </span>
                </v-card-subtitle>
                <v-card-text>
                    <p>{{ workout.overallNotes }}</p>
                </v-card-text>
            </v-card>

            <div v-for="(entry, index) in workout.exerciseEntries" :key="index" class="mb-4">
                <v-card outlined>
                    <v-card-title class="d-flex align-center">
                        <div class="flex-grow-1">
                            {{ getExerciseName(entry.exerciseId) || "Unknown Exercise" }}
                        </div>
                    </v-card-title>
                    <v-card-subtitle v-if="entry.exerciseNotes">
                        {{ entry.exerciseNotes }}
                    </v-card-subtitle>
                    <v-card-text>
                        <v-list dense>
                            <v-list-item v-for="(set, sIdx) in entry.sets" :key="sIdx">
                                <v-list-item-title>
                                    Set {{ sIdx + 1 }}: {{ set.reps }} reps @ {{ set.weight }} kg
                                </v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-card-text>
                </v-card>
            </div>
        </div>
        <div v-else>
            <v-alert type="error" color="error">Workout not found.</v-alert>
        </div>
    </v-container>
</template>

<script setup lang="ts">
import { useAsyncState } from "@vueuse/core";
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useDate } from "vuetify";

import type { Exercise } from "../data/excercises";
import type { WorkoutWithId } from "../services/workout";

import { useGlobalConfirm } from "../composables/useConfirmDialog";
import { getExercises } from "../data/excercises";
import { deleteWorkout as deleteWorkoutService, getWorkoutById } from "../services/workout";
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
const dateAdapter = useDate();
const formattedDate = computed(() => {
    if (!workout.value) return "";
    const dateObj = (workout.value.date as any).toDate
        ? (workout.value.date as any).toDate()
        : workout.value.date;
    return dateAdapter.format(dateObj, "fullDate");
});

const exercisesList: Exercise[] = getExercises();
function formatWorkoutDuration(durationMinutes?: number): string {
    if (!durationMinutes || durationMinutes < 0) return "";
    return `${durationMinutes} minutes`;
}

function getExerciseName(id: string): string | undefined {
    const exercise = exercisesList.find((exer) => exer.id === id);
    return exercise?.name;
}

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
