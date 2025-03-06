<template>
    <v-container class="pa-2 mx-auto">
        <!-- Loading State -->
        <template v-if="isLoading">
            <v-skeleton-loader type="heading" class="mb-4" />
            <v-row>
                <v-col v-for="n in 4" :key="n" cols="12" sm="6" lg="3">
                    <v-skeleton-loader type="card" class="mb-4" />
                </v-col>
            </v-row>
            <v-skeleton-loader type="image" class="mb-4" />
        </template>

        <!-- Error State -->
        <template v-else-if="error">
            <v-alert
                type="error"
                variant="tonal"
                border="start"
                class="my-8"
                icon="mdi-alert-circle"
            >
                <h3 class="text-h6 font-weight-medium">Failed to load analytics</h3>
                <p class="text-body-1 mt-2">{{ error }}</p>
                <v-btn
                    prepend-icon="mdi-refresh"
                    variant="tonal"
                    color="primary"
                    class="mt-4"
                    @click="refreshData"
                >
                    Retry
                </v-btn>
            </v-alert>
        </template>

        <!-- Content State -->
        <template v-else>
            <!-- Page Header -->
            <v-card class="mb-4" flat>
                <v-card-title class="d-flex align-center justify-space-between">
                    <h1 class="text-h5 font-weight-bold">Fitness Analytics</h1>
                    <DateRangeSelector v-model="dateRange" />
                </v-card-title>
            </v-card>

            <!-- Main Content Tabs -->
            <v-card>
                <v-tabs
                    v-model="activeTab"
                    bg-color="background"
                    slider-color="primary"
                    density="compact"
                    grow
                    align-tabs="center"
                    class="tabs-container"
                >
                    <v-tab value="nutrition" prepend-icon="mdi-food-apple" class="tab-item">
                        <span :class="{ 'text-caption': $vuetify.display.xs }">Nutrition</span>
                    </v-tab>
                    <v-tab value="workouts" prepend-icon="mdi-dumbbell" class="tab-item">
                        <span :class="{ 'text-caption': $vuetify.display.xs }">Workouts</span>
                    </v-tab>
                    <v-tab value="body" prepend-icon="mdi-human" class="tab-item">
                        <span :class="{ 'text-caption': $vuetify.display.xs }">Body</span>
                    </v-tab>
                </v-tabs>

                <v-divider></v-divider>

                <v-window v-model="activeTab" class="px-2 py-4" :touch="false">
                    <!-- Nutrition Tab -->
                    <v-window-item value="nutrition">
                        <NutritionAnalytics
                            :date-range="dateRange"
                            :nutrition-data="nutritionData"
                        />
                    </v-window-item>

                    <!-- Workouts Tab -->
                    <v-window-item value="workouts">
                        <WorkoutAnalytics :date-range="dateRange" :workout-data="workoutData" />
                    </v-window-item>

                    <!-- Body Tab -->
                    <v-window-item value="body">
                        <BodyAnalytics :date-range="dateRange" :body-data="bodyData" />
                    </v-window-item>
                </v-window>
            </v-card>
        </template>
    </v-container>
</template>

<script setup lang="ts">
import { useAsyncState, useStorage } from "@vueuse/core";
import { computed, watch } from "vue";

import type { AnalyticsData, DateRangeOption } from "../types/analytics";

import BodyAnalytics from "../components/analytics/BodyAnalytics.vue";
import DateRangeSelector from "../components/analytics/DateRangeSelector.vue";
import NutritionAnalytics from "../components/analytics/NutritionAnalytics.vue";
import WorkoutAnalytics from "../components/analytics/WorkoutAnalytics.vue";
import { getAnalyticsData } from "../services/analytics";
import { useAuthStore } from "../stores/auth";

const authStore = useAuthStore();
const activeTab = useStorage("momentum-analytics-tab", "nutrition");
const dateRange = useStorage<DateRangeOption>("momentum-analytics-daterange", "last30Days");

const {
    error,
    execute: refreshData,
    isLoading,
    state: analyticsData,
} = useAsyncState<AnalyticsData>(
    () => getAnalyticsData(authStore.nonNullableUser.uid, dateRange.value),
    { bodyMetrics: [], nutrition: [], workouts: [] },
);

watch(dateRange, () => {
    refreshData();
});

const nutritionData = computed(() => analyticsData.value.nutrition);
const workoutData = computed(() => analyticsData.value.workouts);
const bodyData = computed(() => analyticsData.value.bodyMetrics);
</script>
