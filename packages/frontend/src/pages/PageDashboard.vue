<template>
    <v-container fluid class="pa-4">
        <v-row class="mb-4">
            <v-col cols="12">
                <v-btn block color="primary" @click="goToWorkoutLogger"> Add Workout </v-btn>
            </v-col>
        </v-row>
        <WorkoutList />
    </v-container>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

import WorkoutList from "../components/WorkoutList.vue";

const router = useRouter();

function goToWorkoutLogger(): void {
    router.push({ name: "WorkoutLogger" });
}
</script>
