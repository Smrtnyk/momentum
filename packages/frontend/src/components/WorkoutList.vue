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
import { useRouter } from "vue-router";

import WorkoutListItem from "../components/WorkoutListItem.vue";
import { notifyError } from "../composables/useNotify";
import { auth } from "../firebase";
import { getWorkouts, type WorkoutWithId } from "../services/workout";

const workouts = ref<WorkoutWithId[]>([]);
const router = useRouter();

async function fetchWorkouts(): Promise<void> {
    if (auth.currentUser) {
        try {
            workouts.value = await getWorkouts(auth.currentUser.uid);
        } catch (error) {
            notifyError(error);
        }
    }
}

onMounted(() => {
    fetchWorkouts();
});

function viewWorkout(workout: WorkoutWithId): void {
    router.push({ name: "WorkoutDetail", params: { id: workout.id } });
}
</script>
