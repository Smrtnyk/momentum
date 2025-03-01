<template>
    <v-container class="pa-2 mx-auto">
        <div>
            <!-- Main Workout Card -->
            <v-card variant="flat" class="mb-6" elevation="2">
                <v-card-item class="pt-4 pb-0">
                    <div class="d-flex align-center w-100">
                        <div class="title-container">
                            <v-card-title class="text-h5 font-weight-bold text-truncate">
                                {{ workout.name }}
                            </v-card-title>
                        </div>

                        <div class="action-buttons flex-shrink-0 ms-2">
                            <v-btn
                                icon="mdi-pencil"
                                variant="text"
                                color="grey-lighten-1"
                                @click="handleEditWorkout"
                                density="comfortable"
                            ></v-btn>
                            <v-btn
                                icon="mdi-delete"
                                variant="text"
                                color="error"
                                @click="handleDeleteWorkout"
                                density="comfortable"
                            ></v-btn>
                        </div>
                    </div>
                </v-card-item>

                <v-card-text>
                    <!-- Metadata Section -->
                    <div class="d-flex flex-column gap-y-4">
                        <WorkoutDateInfo :workout="workout" />

                        <div class="d-flex flex-wrap align-center">
                            <div
                                class="d-flex align-center text-body-2 text-grey-lighten-1 me-2 mb-2"
                            >
                                <v-icon icon="mdi-dumbbell" size="small" class="mr-2"></v-icon>
                                {{ workout.exerciseEntries.length }} exercises
                            </div>
                            <v-divider vertical class="mx-2"></v-divider>
                            <div
                                class="d-flex align-center text-body-2 text-grey-lighten-1 me-2 mb-2"
                            >
                                <v-icon icon="mdi-recycle" size="small" class="mr-2"></v-icon>
                                {{ totalSets }} sets
                            </div>
                            <v-divider vertical class="mx-2"></v-divider>
                            <div class="d-flex align-center text-body-2 text-grey-lighten-1 mb-2">
                                <v-icon icon="mdi-weight" size="small" class="mr-2"></v-icon>
                                {{ totalVolume }} kg
                            </div>
                        </div>

                        <WorkoutHitMusclesChips :workout="workout" />
                    </div>
                </v-card-text>

                <v-divider v-if="workout.overallNotes" class="mx-4"></v-divider>

                <!-- Notes Section -->
                <v-card-text v-if="workout.overallNotes" class="pt-4">
                    <div class="text-body-1 font-weight-medium text-grey-lighten-1">
                        <v-icon icon="mdi-text" size="small" class="mr-2"></v-icon>
                        Workout Notes
                    </div>
                    <p class="text-body-2 mt-2">
                        {{ workout.overallNotes }}
                    </p>
                </v-card-text>
            </v-card>

            <!-- Exercises Section -->
            <div class="text-h5 font-weight-medium mb-4">Exercises</div>

            <div v-for="(entry, index) in workout.exerciseEntries" :key="index" class="mb-4">
                <v-card variant="outlined" class="pa-4">
                    <div class="d-flex gap-x-4">
                        <!-- Exercise Number -->
                        <div class="text-h6 text-primary font-weight-bold">
                            {{ index + 1 }}
                        </div>

                        <!-- Exercise Content -->
                        <div class="flex-grow-1">
                            <!-- Exercise Header -->
                            <div class="d-flex align-center justify-space-between">
                                <div class="text-h6 font-weight-medium text-truncate">
                                    {{ getExerciseName(entry.exerciseId) || "Unknown Exercise" }}
                                </div>
                            </div>

                            <!-- Exercise Notes -->
                            <div
                                v-if="entry.exerciseNotes"
                                class="text-body-2 text-grey-lighten-2 mt-2"
                            >
                                <v-icon icon="mdi-note-text" size="small" class="mr-2"></v-icon>
                                {{ entry.exerciseNotes }}
                            </div>

                            <!-- Sets Table -->
                            <div class="table-container mt-4">
                                <v-table density="compact">
                                    <thead>
                                        <tr>
                                            <th class="text-left">Set</th>
                                            <th class="text-left">Reps</th>
                                            <th class="text-left">Weight</th>
                                            <th class="text-left">Volume</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(set, sIdx) in entry.sets" :key="sIdx">
                                            <td class="font-weight-medium">#{{ sIdx + 1 }}</td>
                                            <td>{{ set.reps }}</td>
                                            <td>{{ set.weight }} kg</td>
                                            <td class="text-primary font-weight-medium">
                                                {{ set.reps * set.weight }} kg
                                            </td>
                                        </tr>
                                    </tbody>
                                </v-table>
                            </div>
                        </div>
                    </div>
                </v-card>
            </div>
        </div>
    </v-container>
</template>

<script setup lang="ts">
import { computed } from "vue";

import type { StrengthWorkout } from "../../types/workout";

import { strengthExercises } from "../../data/strength-exercises";
import WorkoutDateInfo from "./WorkoutDateInfo.vue";
import WorkoutHitMusclesChips from "./WorkoutHitMusclesChips.vue";

const props = defineProps<{ workout: StrengthWorkout }>();
const emit = defineEmits<(e: "delete" | "edit") => void>();

const totalSets = computed(function (): number {
    return props.workout.exerciseEntries.reduce(function (total, entry) {
        return total + entry.sets.length;
    }, 0);
});

const totalVolume = computed(function (): number {
    return props.workout.exerciseEntries.reduce(function (total, entry) {
        return entry.sets.reduce(function (sum, set) {
            return sum + set.reps * set.weight;
        }, total);
    }, 0);
});

function getExerciseName(id: string): string | undefined {
    const exercise = strengthExercises.find(function (exer) {
        return exer.id === id;
    });
    return exercise?.name;
}

function handleDeleteWorkout(): void {
    emit("delete");
}

function handleEditWorkout(): void {
    emit("edit");
}
</script>

<style scoped>
.gap-xs {
    gap: 8px;
}
.gap-x-4 {
    column-gap: 16px;
}
.gap-y-4 {
    row-gap: 16px;
}

.title-container {
    flex-grow: 1;
    min-width: 0;
    overflow: hidden;
}

.action-buttons {
    display: flex;
    gap: 4px;
}

.table-container {
    overflow-x: auto;
}
</style>
