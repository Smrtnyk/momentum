<template>
    <div v-if="plan" class="pa-4 flex-grow-1 overflow-auto">
        <!-- Plan Header -->
        <div class="rounded-lg pa-4 mb-4">
            <div class="d-flex align-center mb-3">
                <div
                    class="text-uppercase text-caption font-weight-bold mr-2 px-2 py-1 rounded"
                    :class="getLevelClass(plan.level)"
                >
                    {{ plan.level }}
                </div>
                <div
                    class="text-uppercase text-caption font-weight-bold px-2 py-1 rounded"
                    :class="getCategoryClass(plan.type)"
                >
                    {{ plan.type }}
                </div>
            </div>

            <p class="text-body-1 mb-3">{{ plan.description }}</p>

            <div class="d-flex flex-wrap">
                <v-chip
                    v-for="(goal, i) in plan.goals"
                    :key="i"
                    size="small"
                    color="grey-lighten-3"
                    class="mr-2 mb-2"
                >
                    {{ goal }}
                </v-chip>
            </div>
        </div>

        <!-- Plan Details -->
        <v-card class="mb-4 rounded-lg">
            <v-card-text>
                <div class="d-flex flex-wrap justify-space-between">
                    <div class="text-center pa-2" style="min-width: 80px">
                        <div class="text-h6 font-weight-bold">
                            {{ plan.durationWeeks }}
                        </div>
                        <div class="text-caption text-grey-darken-1">Weeks</div>
                    </div>
                    <v-divider vertical></v-divider>
                    <div class="text-center pa-2" style="min-width: 80px">
                        <div class="text-h6 font-weight-bold">
                            {{ plan.frequency }}
                        </div>
                        <div class="text-caption text-grey-darken-1">Days/Week</div>
                    </div>
                    <v-divider vertical></v-divider>
                    <div class="text-center pa-2" style="min-width: 80px">
                        <div class="text-h6 font-weight-bold">
                            {{ plan.workoutDays.length }}
                        </div>
                        <div class="text-caption text-grey-darken-1">Workouts</div>
                    </div>
                    <v-divider vertical></v-divider>
                    <div class="text-center pa-2" style="min-width: 80px">
                        <div class="text-h6 font-weight-bold">
                            {{ getTotalExercises(plan) }}
                        </div>
                        <div class="text-caption text-grey-darken-1">Exercises</div>
                    </div>
                </div>
            </v-card-text>
        </v-card>

        <!-- Plan Science Reference -->
        <v-card class="mb-4 rounded-lg" v-if="plan.scienceReference">
            <v-card-text>
                <div class="d-flex align-start">
                    <v-icon color="primary" class="mt-1 mr-3">mdi-book-open-variant</v-icon>
                    <div>
                        <div class="text-subtitle-2 font-weight-bold mb-1">Science-Based</div>
                        <div class="text-body-2">
                            {{ plan.scienceReference }}
                        </div>
                    </div>
                </div>
            </v-card-text>
        </v-card>

        <!-- Workout Days -->
        <h3 class="text-h6 font-weight-bold mb-3">Workout Schedule</h3>

        <v-expansion-panels class="mb-6">
            <v-expansion-panel
                v-for="day in plan.workoutDays"
                :key="day.id"
                class="mb-3 rounded-lg"
            >
                <v-expansion-panel-title>
                    <div class="d-flex align-center w-100">
                        <div class="text-subtitle-1 font-weight-bold">
                            {{ day.name }}
                        </div>
                        <v-spacer></v-spacer>
                        <div class="text-caption text-grey-lighten-1">
                            {{ day.exerciseEntries.length }} exercises
                        </div>
                    </div>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                    <v-list class="pa-0">
                        <v-list-item
                            v-for="(exercise, index) in day.exerciseEntries"
                            :key="index"
                            class="pl-0 rounded-lg"
                        >
                            <div class="d-flex w-100 py-2">
                                <div
                                    class="mr-3 bg-grey-lighten-3 rounded-lg d-flex align-center justify-center"
                                    style="min-width: 48px; height: 48px"
                                >
                                    <v-icon size="24">{{
                                        getExerciseIcon(exercise.exerciseId)
                                    }}</v-icon>
                                </div>
                                <div class="flex-grow-1">
                                    <div class="text-subtitle-2 font-weight-medium">
                                        {{ getExerciseName(exercise.exerciseId) }}
                                    </div>
                                    <div class="text-caption text-grey-lighten-1">
                                        <span v-if="exercise.setsCount"
                                            >{{ exercise.setsCount }} sets</span
                                        >
                                        <span v-if="exercise.reps">
                                            • {{ exercise.reps }} reps</span
                                        >
                                        <span v-if="exercise.durationSeconds">
                                            •
                                            {{ formatDuration(exercise.durationSeconds) }}</span
                                        >
                                        <span v-if="exercise.restTime">
                                            •
                                            {{ formatDuration(exercise.restTime) }}
                                            rest</span
                                        >
                                    </div>
                                    <div
                                        v-if="exercise.exerciseNotes"
                                        class="text-caption text-grey-lighten-2 mt-1 font-italic"
                                    >
                                        {{ exercise.exerciseNotes }}
                                    </div>
                                </div>
                            </div>
                        </v-list-item>
                    </v-list>
                    <div
                        v-if="day.overallNotes"
                        class="mt-2 text-caption text-grey-lighten-2 font-italic pa-2 rounded"
                    >
                        <v-icon size="16" class="mr-1">mdi-information-outline</v-icon>
                        {{ day.overallNotes }}
                    </div>

                    <div class="d-flex justify-center mt-4">
                        <StartWorkoutButton :plan="plan" :day="day" />
                    </div>
                </v-expansion-panel-text>
            </v-expansion-panel>
        </v-expansion-panels>

        <!-- Add Exercise Button -->
        <v-card class="mb-8 rounded-lg">
            <v-card-text class="text-center">
                <p class="text-body-2 mb-3">
                    Don't see an exercise you need? Add it to the library!
                </p>
                <v-btn
                    color="primary"
                    variant="outlined"
                    prepend-icon="mdi-plus"
                    @click="handleAddExercise"
                >
                    Add Exercise
                </v-btn>
            </v-card-text>
        </v-card>

        <v-card-actions>
            <v-btn color="primary" variant="elevated" @click="handleAddToFavorites">
                Add to Favorites
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="success" variant="elevated" @click="handleStartPlan"> Start Plan </v-btn>
        </v-card-actions>
    </div>
</template>

<script setup lang="ts">
import type { DifficultyLevel, TrainingPlan } from "../../types/workout-plans";

import { getExerciseById } from "../../helpers/exercise-utils";
import StartWorkoutButton from "./StartWorkoutButton.vue";

const props = defineProps<{
    onAddExercise?: () => void;
    onAddToFavorites?: (plan: TrainingPlan) => void;
    onStartPlan?: (plan: TrainingPlan) => void;
    plan: TrainingPlan;
}>();

const emit = defineEmits<(e: "close") => void>();

function formatDuration(seconds: number): string {
    if (seconds < 60) {
        return `${seconds}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
}

function getCategoryClass(category: TrainingPlan["type"]): string {
    switch (category) {
        case "cardio":
            return "bg-teal-lighten-5 text-teal-darken-3";
        case "circuit":
            return "bg-amber-lighten-5 text-amber-darken-3";
        case "strength":
            return "bg-red-lighten-5 text-red-darken-3";
        default:
            return "bg-grey-lighten-3";
    }
}

function getExerciseIcon(exerciseId: string): string {
    if (exerciseId.includes("bench") || exerciseId.includes("press")) {
        return "mdi-weight";
    } else if (exerciseId.includes("run") || exerciseId.includes("walk")) {
        return "mdi-run";
    } else if (exerciseId.includes("cycle") || exerciseId.includes("bike")) {
        return "mdi-bike";
    } else if (exerciseId.includes("row")) {
        return "mdi-rowing";
    } else if (exerciseId.includes("squat") || exerciseId.includes("leg")) {
        return "mdi-human-handsdown";
    } else if (exerciseId.includes("pull") || exerciseId.includes("curl")) {
        return "mdi-arm-flex";
    } else if (exerciseId.includes("plank") || exerciseId.includes("core")) {
        return "mdi-human-handsup";
    }
    return "mdi-dumbbell";
}

function getExerciseName(exerciseId: string): string {
    const exercise = getExerciseById(exerciseId);
    return exercise.name;
}

function getLevelClass(level: DifficultyLevel): string {
    switch (level) {
        case "advanced":
            return "bg-purple-lighten-5 text-purple-darken-3";
        case "beginner":
            return "bg-green-lighten-5 text-green-darken-3";
        case "intermediate":
            return "bg-blue-lighten-5 text-blue-darken-3";
        default:
            return "bg-grey-lighten-3";
    }
}

function getTotalExercises(plan: TrainingPlan): number {
    return plan.workoutDays.reduce(function (total, day) {
        return total + day.exerciseEntries.length;
    }, 0);
}

function handleAddExercise(): void {
    emit("close");
    if (props.onAddExercise) {
        props.onAddExercise();
    }
}

function handleAddToFavorites(): void {
    if (props.onAddToFavorites) {
        props.onAddToFavorites(props.plan);
    }
}

function handleStartPlan(): void {
    if (props.onStartPlan) {
        props.onStartPlan(props.plan);
    }
    emit("close");
}
</script>
