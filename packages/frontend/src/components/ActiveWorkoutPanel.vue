<template>
    <div v-if="isWorkoutActive && !!activeWorkout" class="active-workout-panel">
        <v-card color="background" class="mb-4">
            <v-card-title class="text-white d-flex align-center">
                <v-icon color="white" class="mr-2">mdi-arm-flex</v-icon>
                Active Workout: {{ activeWorkout.dayName }}
                <v-chip color="primary-lighten-2" size="small" class="ml-2">
                    {{ getElapsedTimeText() }}
                </v-chip>
            </v-card-title>
            <v-card-subtitle class="text-white">
                {{ activeWorkout.planName }}
            </v-card-subtitle>
            <v-card-text>
                <v-list density="compact" bg-color="primary-lighten-1" class="rounded">
                    <v-list-item
                        v-for="(exercise, index) in activeWorkout.exercises"
                        :key="index"
                        :subtitle="exercise.notes || ''"
                        class="rounded-lg mb-2"
                        :class="{ 'completed-exercise': exercise.completed }"
                    >
                        <template #prepend>
                            <v-btn
                                :icon="
                                    exercise.completed ? 'mdi-check-circle' : 'mdi-circle-outline'
                                "
                                :color="exercise.completed ? 'success' : 'grey-lighten-2'"
                                variant="text"
                                @click="toggleExercise(index)"
                            ></v-btn>
                        </template>

                        <template #title>
                            <span class="font-weight-medium">{{
                                getExerciseName(exercise.exerciseId)
                            }}</span>
                            <span class="text-caption ml-2">
                                <span v-if="exercise.sets">{{ exercise.sets }}×</span>
                                <span v-if="exercise.reps">{{ exercise.reps }}</span>
                                <span v-if="exercise.duration">
                                    • {{ formatDuration(exercise.duration) }}</span
                                >
                            </span>
                        </template>

                        <template #append>
                            <v-btn
                                variant="tonal"
                                size="small"
                                color="white"
                                @click="openExerciseDetails(index)"
                            >
                                Details
                            </v-btn>
                        </template>
                    </v-list-item>
                </v-list>
            </v-card-text>
            <v-card-actions class="px-4 pb-4">
                <v-spacer></v-spacer>
                <v-btn variant="outlined" color="error" @click="cancelWorkout"> Cancel </v-btn>
                <v-btn variant="elevated" color="success" @click="endWorkout" class="ml-3">
                    Finish Workout
                </v-btn>
            </v-card-actions>
        </v-card>

        <!-- Exercise Details Dialog -->
        <v-dialog v-model="exerciseDialogOpen" max-width="500">
            <v-card v-if="selectedExercise">
                <v-card-title>
                    {{ getExerciseName(selectedExercise.exerciseId) }}
                </v-card-title>
                <v-card-text>
                    <div
                        v-if="selectedExercise.actualSets && selectedExercise.actualSets.length > 0"
                    >
                        <v-table>
                            <thead>
                                <tr>
                                    <th>Set</th>
                                    <th>Reps</th>
                                    <th>Weight (kg)</th>
                                    <th>Done</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    v-for="(set, setIndex) in selectedExercise.actualSets"
                                    :key="setIndex"
                                >
                                    <td>{{ setIndex + 1 }}</td>
                                    <td>
                                        <v-text-field
                                            v-model.number="set.reps"
                                            type="number"
                                            variant="outlined"
                                            density="compact"
                                            hide-details
                                            @change="
                                                updateSet(
                                                    selectedExerciseIndex,
                                                    setIndex,
                                                    set.reps,
                                                    set.weight,
                                                )
                                            "
                                        ></v-text-field>
                                    </td>
                                    <td>
                                        <v-text-field
                                            v-model.number="set.weight"
                                            type="number"
                                            variant="outlined"
                                            density="compact"
                                            hide-details
                                            @change="
                                                updateSet(
                                                    selectedExerciseIndex,
                                                    setIndex,
                                                    set.reps,
                                                    set.weight,
                                                )
                                            "
                                        ></v-text-field>
                                    </td>
                                    <td class="text-center">
                                        <v-checkbox
                                            :model-value="set.completed"
                                            hide-details
                                            @change="toggleSet(selectedExerciseIndex, setIndex)"
                                        ></v-checkbox>
                                    </td>
                                </tr>
                            </tbody>
                        </v-table>
                    </div>
                    <div v-else-if="selectedExercise.actualDuration !== undefined" class="mt-3">
                        <v-text-field
                            v-model.number="selectedExercise.actualDuration"
                            label="Duration (minutes)"
                            type="number"
                            variant="outlined"
                        ></v-text-field>
                    </div>

                    <v-textarea
                        v-model="selectedExercise.notes"
                        label="Notes"
                        variant="outlined"
                        rows="2"
                        class="mt-3"
                    ></v-textarea>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="exerciseDialogOpen = false">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

import type { ActiveExercise } from "../stores/active-workout";

import { globalDialog } from "../composables/useDialog";
import { cardioExercises } from "../data/cardio-exercises";
import { getExerciseById } from "../data/strength-exercises";
import { useActiveWorkoutStore } from "../stores/active-workout";
import { useGlobalStore } from "../stores/global";

const activeWorkoutStore = useActiveWorkoutStore();
const globalStore = useGlobalStore();
const router = useRouter();

const activeWorkout = computed(() => activeWorkoutStore.activeWorkout);
const isWorkoutActive = computed(() => activeWorkoutStore.isWorkoutActive);

const exerciseDialogOpen = ref(false);
const selectedExerciseIndex = ref(0);
const selectedExercise = computed<ActiveExercise | null>(() => {
    if (!activeWorkout.value?.exercises[selectedExerciseIndex.value]) {
        return null;
    }
    return activeWorkout.value.exercises[selectedExerciseIndex.value];
});

async function cancelWorkout(): Promise<void> {
    const confirmed = await globalDialog.confirm({
        message: "Are you sure you want to cancel this workout? Your progress will be lost.",
        title: "Cancel Workout?",
    });

    if (!confirmed) {
        return;
    }

    await activeWorkoutStore.cancelWorkout();
    globalStore.notify("Workout cancelled");
}

async function endWorkout(): Promise<void> {
    const confirmed = await globalDialog.confirm({
        message:
            "Are you sure you want to finish this workout? Your progress will be saved to\n" +
            "                    your workout log.",
        title: "Finish Workout?",
    });

    if (!confirmed) {
        return;
    }

    try {
        globalStore.setLoading(true);
        const workoutId = await activeWorkoutStore.endWorkout();

        if (workoutId) {
            globalStore.notify("Workout completed and saved successfully!");
            await router.push({ name: "WorkoutDetail", params: { id: workoutId } });
        } else {
            globalStore.notifyError("Failed to save workout");
        }
    } catch (error) {
        globalStore.notifyError("Failed to save workout");
    } finally {
        globalStore.setLoading(false);
    }
}

function formatDuration(seconds: number): string {
    if (seconds < 60) {
        return `${seconds}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
}

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

function getExerciseName(exerciseId: string): string {
    const strengthExercise = getExerciseById(exerciseId);
    if (strengthExercise?.name) {
        return strengthExercise.name;
    }

    const cardioExercise = cardioExercises.find(({ id }) => id === exerciseId);
    if (cardioExercise) {
        return cardioExercise.name;
    }

    return exerciseId;
}

function openExerciseDetails(index: number): void {
    selectedExerciseIndex.value = index;
    exerciseDialogOpen.value = true;
}

function toggleExercise(index: number): void {
    activeWorkoutStore.toggleExerciseCompletion(index);
}

function toggleSet(exerciseIndex: number, setIndex: number): void {
    activeWorkoutStore.toggleSetCompletion(exerciseIndex, setIndex);
}

function updateSet(exerciseIndex: number, setIndex: number, reps: number, weight: number): void {
    activeWorkoutStore.updateSetData(exerciseIndex, setIndex, reps, weight);
}
</script>

<style scoped>
.active-workout-panel {
    position: relative;
    z-index: 10;
}

.completed-exercise {
    opacity: 0.7;
    background-color: rgba(76, 175, 80, 0.1);
}
</style>
