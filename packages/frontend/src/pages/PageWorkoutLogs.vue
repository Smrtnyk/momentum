<script setup lang="ts">
import WorkoutList from "../components/WorkoutList.vue";
</script>

<template>
    <v-container fluid class="pa-4">
        <v-row>
            <v-col cols="12">
                <WorkoutList title="All Workouts" />
            </v-col>
        </v-row>
    </v-container>
</template>
