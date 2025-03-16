<template>
    <v-container class="pa-2 mx-auto">
        <!-- Personalized Greeting -->
        <div class="mb-4">
            <v-card class="rounded-lg" elevation="2">
                <v-card-text>
                    <div class="d-flex align-center mb-4">
                        <h2 class="text-h5 font-weight-bold">
                            {{ greeting }}, {{ authStore.userProfile?.name }}
                        </h2>
                    </div>
                    <blockquote>
                        {{ motivationalMessage }}
                    </blockquote>
                </v-card-text>
            </v-card>
        </div>

        <!-- Health Metrics Section -->
        <HealthMetrics />

        <!-- Weekly Workout Stats Section -->
        <div class="mb-4">
            <WeeklyWorkoutStats />
        </div>

        <!-- Fitness Tip -->
        <div class="mb-6">
            <FitnessTip />
        </div>
    </v-container>
</template>

<script setup lang="ts">
import { computed } from "vue";

import FitnessTip from "../components/FitnessTip.vue";
import HealthMetrics from "../components/health-metrics/HealthMetrics.vue";
import WeeklyWorkoutStats from "../components/workout/WeeklyWorkoutStats.vue";
import { motivationalMessages } from "../data/motivational-messages";
import { useAuthStore } from "../stores/auth";

const authStore = useAuthStore();

const currentHour = new Date().getHours();
const greeting = computed(() => {
    if (currentHour < 12) {
        return "Good Morning";
    } else if (currentHour < 18) {
        return "Good Afternoon";
    }
    return "Good Evening";
});

const motivationalMessage = computed(() => {
    return motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
});
</script>
