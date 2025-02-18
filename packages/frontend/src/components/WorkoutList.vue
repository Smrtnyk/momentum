<template>
    <v-container fluid class="pa-4">
        <v-list two-line>
            <WorkoutListItem
                v-for="workout in workouts"
                :key="workout.id"
                :workout="workout"
                @click="viewWorkout(workout)"
            />
        </v-list>
    </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

import WorkoutListItem from "../components/WorkoutListItem.vue";
import { auth } from "../firebase";
import { getWorkouts, type WorkoutWithId } from "../services/workout";

const workouts = ref<WorkoutWithId[]>([]);

async function fetchWorkouts(): Promise<void> {
    if (auth.currentUser) {
        try {
            workouts.value = await getWorkouts(auth.currentUser.uid);
        } catch (error) {
            console.error("Error fetching workouts:", error);
        }
    }
}

onMounted(() => {
    fetchWorkouts();
});

function viewWorkout(workout: WorkoutWithId): void {
    // For now, simply log the workout.
    // Later you might navigate to a detailed view.
    console.log("Workout clicked:", workout);
}
</script>
