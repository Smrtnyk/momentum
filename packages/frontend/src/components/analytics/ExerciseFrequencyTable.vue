<template>
    <div class="exercise-frequency-table">
        <v-data-table
            v-if="sortedExercises.length > 0"
            :headers="headers"
            :items="sortedExercises"
            :items-per-page="5"
            :no-data-text="'No exercises found for the selected period'"
            density="comfortable"
            class="exercise-table"
        >
            <template v-slot:item.name="{ item }">
                <div class="d-flex align-center">
                    <v-badge
                        :color="getBadgeColor(item.rank)"
                        :content="item.rank"
                        inline
                        class="mr-2"
                    ></v-badge>
                    {{ item.name }}
                    <v-chip
                        size="x-small"
                        :color="item.exerciseType === 'strength' ? 'primary' : 'teal'"
                        variant="flat"
                        class="ml-2"
                    >
                        {{ item.exerciseType === "strength" ? "Strength" : "Cardio" }}
                    </v-chip>
                </div>
            </template>

            <template v-slot:item.frequency="{ item }">
                <div class="d-flex align-center">
                    <div
                        class="frequency-bar"
                        :style="{
                            width: `${getBarWidth(item.count)}px`,
                            backgroundColor:
                                item.exerciseType === 'strength'
                                    ? 'var(--v-primary-base, #5C6BC0)'
                                    : 'var(--v-teal-base, #26A69A)',
                        }"
                    ></div>
                    <span class="ml-2">{{ item.count }}</span>
                </div>
            </template>

            <template v-slot:item.muscles="{ item }">
                <div class="d-flex flex-wrap gap-1">
                    <v-chip
                        v-for="muscle in item.muscles"
                        :key="muscle"
                        size="x-small"
                        color="secondary"
                        variant="tonal"
                    >
                        {{ muscle }}
                    </v-chip>
                    <span v-if="item.muscles.length === 0">-</span>
                </div>
            </template>

            <template v-slot:item.lastUsed="{ item }">
                {{ formatRelativeDate(item.lastUsed) }}
            </template>
        </v-data-table>

        <v-alert
            v-else
            type="info"
            variant="tonal"
            text="No exercises found for the selected period"
            class="mt-2"
        ></v-alert>
    </div>
</template>

<script setup lang="ts">
import { isNotNil } from "es-toolkit";
import { computed } from "vue";

import type { WorkoutWithId } from "../../types/workout";

import { cardioExercises } from "../../data/cardio-exercises";
import { strengthExercises } from "../../data/strength-exercises";
import { formatRelativeDate } from "../../helpers/date-utils";
import { getMuscleById } from "../../helpers/exercise-utils";
import { isStrengthExercise } from "../../services/workout";
import { CHART_COLORS } from "./colors";

const props = defineProps<{
    workoutData: WorkoutWithId[];
}>();

const headers = [
    { key: "name", sortable: true, title: "Exercise" },
    { key: "frequency", sortable: true, title: "Frequency" },
    { key: "muscles", sortable: false, title: "Muscles" },
    { key: "lastUsed", sortable: true, title: "Last Used" },
];

const exerciseFrequency = computed(() => {
    const frequencyMap = new Map<
        string,
        {
            count: number;
            exerciseType: "cardio" | "strength";
            lastUsed: Date;
        }
    >();

    props.workoutData.forEach(function (workout) {
        workout.exerciseEntries.forEach(function (entry) {
            const exerciseType = isStrengthExercise(entry) ? "strength" : "cardio";

            if (!frequencyMap.has(entry.exerciseId)) {
                frequencyMap.set(entry.exerciseId, {
                    count: 0,
                    exerciseType,
                    lastUsed: workout.date.toDate(),
                });
            }

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- we just set it above
            const data = frequencyMap.get(entry.exerciseId)!;
            data.count++;

            // Update last used date if newer
            const workoutDate = workout.date.toDate();
            if (workoutDate > data.lastUsed) {
                data.lastUsed = workoutDate;
            }
        });
    });

    return frequencyMap;
});

const sortedExercises = computed(() => {
    const exercises = Array.from(exerciseFrequency.value.entries())
        .map(([id, data]) => {
            const isStrength = data.exerciseType === "strength";
            const exerciseList = isStrength ? strengthExercises : cardioExercises;
            const exercise = exerciseList.find((e) => e.exerciseId === id);

            if (!exercise) return null;

            let muscles: string[] = [];
            if (isStrength && "muscleIds" in exercise) {
                muscles = exercise.muscleIds.map((mid) => {
                    const muscle = getMuscleById(mid);
                    return muscle ? muscle.name : "Unknown";
                });
            }

            return {
                count: data.count,
                exerciseType: data.exerciseType,
                id,
                lastUsed: data.lastUsed,
                muscles,
                name: exercise.name,
                // Will be assigned after sorting
                rank: 0,
            };
        })
        .filter(isNotNil)
        .sort((a, b) => b.count - a.count);

    return exercises.map((exercise, index) => ({
        ...exercise,
        rank: index + 1,
    }));
});

function getBadgeColor(rank: number): string {
    if (rank === 1) return CHART_COLORS.badges.first;
    if (rank === 2) return CHART_COLORS.badges.second;
    if (rank === 3) return CHART_COLORS.badges.third;
    return CHART_COLORS.badges.default;
}

function getBarWidth(count: number): number {
    const maxCount = sortedExercises.value.length > 0 ? sortedExercises.value[0].count : 1;

    // Scale from 0 to 100 pixels
    return Math.max(10, Math.round((count / maxCount) * 100));
}
</script>

<style scoped>
.exercise-frequency-table {
    width: 100%;
}

.frequency-bar {
    height: 6px;
    border-radius: 3px;
    min-width: 10px;
}

.gap-1 {
    gap: 4px;
}

.exercise-table :deep(th) {
    white-space: nowrap;
}
</style>
