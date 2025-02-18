<template>
    <v-container fluid class="pa-4">
        <div v-if="workout">
            <v-card outlined class="mb-4">
                <v-card-title class="text-h5">{{ workout.name }}</v-card-title>
                <v-card-subtitle>{{ formattedDate }}</v-card-subtitle>
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
                                <v-list-item-content>
                                    <v-list-item-title>
                                        Set {{ sIdx + 1 }}: {{ set.reps }} reps @
                                        {{ set.weight }} kg
                                    </v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </v-card-text>
                </v-card>
            </div>
        </div>
        <div v-else>
            <v-alert type="error" color="error"> Workout not found. </v-alert>
        </div>
    </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useDate } from "vuetify";

import type { Exercise } from "../data/excercises";
import type { WorkoutWithId } from "../services/workout";

import { notifyError } from "../composables/useNotify";
import { getExercises } from "../data/excercises";
import { getWorkoutById } from "../services/workout";

const route = useRoute();
const workoutId = route.params.id as string;

const workout = ref<null | WorkoutWithId>(null);

onMounted(async () => {
    try {
        workout.value = await getWorkoutById(workoutId);
    } catch (error) {
        notifyError(error);
        workout.value = null;
    }
});

const dateAdapter = useDate();
const formattedDate = computed(() => {
    if (!workout.value) return "";
    const dateObj = (workout.value.date as any).toDate
        ? (workout.value.date as any).toDate()
        : workout.value.date;
    return dateAdapter.format(dateObj, "fullDate");
});

const exercisesList: Exercise[] = getExercises();
function getExerciseName(id: string): string | undefined {
    const exercise = exercisesList.find((exer) => exer.id === id);
    return exercise?.name;
}
</script>
