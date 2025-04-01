<template>
    <v-container class="pa-2 mx-auto">
        <HealthMetrics />
        <WeeklyWorkoutStats class="mb-4" />
        <FitnessTip />
    </v-container>
</template>

<script setup lang="ts">
import FitnessTip from "../components/FitnessTip.vue";
import HealthMetrics from "../components/health-metrics/HealthMetrics.vue";
import WeeklyWorkoutStats from "../components/workout/WeeklyWorkoutStats.vue";
</script>
