<script setup lang="ts">
import { useAsyncState } from "@vueuse/core";
import { ref } from "vue";
import { useDate } from "vuetify";

import type { WaterLogEntry } from "../../types/health-metrics";

import { globalDialog } from "../../composables/useDialog";
import { logger } from "../../logger/app-logger";
import {
    getLatestBodyFat,
    getLatestSteps,
    getLatestWeight,
    getTodayWaterProgress,
    logBodyFat,
    logSteps,
    logWaterIntake,
    logWeight,
    removeWaterIntakeEntry,
} from "../../services/health-metrics";
import { useAuthStore } from "../../stores/auth";
import { useGlobalStore } from "../../stores/global";
import BodyFatDialog from "./BodyFatDialog.vue";
import StepsEntryDialog from "./StepsEntryDialog.vue";
import WaterIntakeDialog from "./WaterIntakeDialog.vue";
import WaterLogMenu from "./WaterLogMenu.vue";
import WeightEntryDialog from "./WeightEntryDialog.vue";

const authStore = useAuthStore();
const globalStore = useGlobalStore();
const dateAdapter = useDate();

const waterLogMenuOpen = ref(false);

async function fetchAllHealthData() {
    const userId = authStore.nonNullableUser.uid;
    const [waterData, weightData, bodyFatData, stepsData] = await Promise.all([
        getTodayWaterProgress(userId),
        getLatestWeight(userId),
        getLatestBodyFat(userId),
        getLatestSteps(userId),
    ]);

    return {
        latestBodyFat: bodyFatData,
        latestSteps: stepsData,
        latestWeight: weightData,
        waterProgress: waterData,
    };
}

const {
    execute: refreshHealthData,
    isLoading,
    state: healthData,
} = useAsyncState(
    fetchAllHealthData,
    {
        latestBodyFat: null,
        latestSteps: null,
        latestWeight: null,
        waterProgress: { current: 0, percentage: 0, target: 2500 },
    },
    {
        onError: (error) => {
            globalStore.notifyError("Failed to load health metrics");
            logger.error(error);
        },
    },
);

function formatDate(date: Date): string {
    const dateObj = (date as any).toDate ? (date as any).toDate() : date;
    return dateAdapter.format(dateObj, "shortDate");
}

function formatNumber(num: number): string {
    return num.toLocaleString();
}

async function handleWaterRemove(entry: WaterLogEntry): Promise<void> {
    try {
        waterLogMenuOpen.value = false;
        const userId = authStore.nonNullableUser.uid;
        await removeWaterIntakeEntry(userId, entry);
        globalStore.notify(`Removed ${entry.amount}ml of water`);
        await refreshHealthData();
    } catch (error) {
        globalStore.notifyError("Failed to remove water entry");
        logger.error(error);
    }
}

async function logBodyFatPercentage(percentage: number, method: string): Promise<void> {
    try {
        const userId = authStore.nonNullableUser.uid;
        await logBodyFat(userId, percentage, method);
        globalStore.notify("Body fat logged successfully");
        await refreshHealthData();
    } catch (error) {
        globalStore.notifyError("Failed to log body fat");
        logger.error(error);
    }
}

async function logDailySteps(steps: number): Promise<void> {
    try {
        const userId = authStore.nonNullableUser.uid;
        await logSteps(userId, steps);
        globalStore.notify("Steps logged successfully");
        await refreshHealthData();
    } catch (error) {
        globalStore.notifyError("Failed to log steps");
        logger.error(error);
    }
}

async function logTodayWeight(weight: number): Promise<void> {
    try {
        const userId = authStore.nonNullableUser.uid;
        await logWeight(userId, weight);
        globalStore.notify("Weight logged successfully");
        await refreshHealthData();
    } catch (error) {
        globalStore.notifyError("Failed to log weight");
    }
}

async function logWater(amount: number): Promise<void> {
    try {
        const userId = authStore.nonNullableUser.uid;
        await logWaterIntake(userId, amount);
        globalStore.notify(`Added ${amount}ml of water`);
        await refreshHealthData();
    } catch (error) {
        globalStore.notifyError("Failed to log water intake");
    }
}

function openBodyFatDialog(): void {
    globalDialog.openDialog(
        BodyFatDialog,
        {
            initialMethod: "calipers",
            onSave: async (percentage: number, method: string) => {
                await logBodyFatPercentage(percentage, method);
            },
        },
        {
            title: "Log Body Fat Percentage",
        },
    );
}

function openStepsDialog(): void {
    globalDialog.openDialog(
        StepsEntryDialog,
        {
            onSave: async (steps: number) => {
                await logDailySteps(steps);
            },
        },
        {
            title: "Log Daily Steps",
        },
    );
}

function openWaterDialog(): void {
    globalDialog.openDialog(
        WaterIntakeDialog,
        {
            onSave: async (amount: number) => {
                await logWater(amount);
            },
        },
        {
            title: "Log Water Intake",
        },
    );
}

function openWeightDialog(): void {
    globalDialog.openDialog(
        WeightEntryDialog,
        {
            onSave: async (weight: number) => {
                await logTodayWeight(weight);
            },
        },
        {
            title: "Log Today's Weight",
        },
    );
}
</script>

<template>
    <v-card class="rounded-lg mb-4" elevation="2">
        <v-card-title class="d-flex align-center">
            <v-icon color="primary" class="mr-2">mdi-chart-line</v-icon>
            Health Metrics
        </v-card-title>

        <v-card-text>
            <!-- Loading State -->
            <v-row v-if="isLoading">
                <!-- Water Intake Skeleton -->
                <v-col cols="12" sm="6" md="3">
                    <div class="d-flex flex-column">
                        <div class="d-flex justify-space-between align-center mb-2">
                            <v-skeleton-loader type="text" width="100px"></v-skeleton-loader>
                        </div>

                        <div class="d-flex align-center justify-space-between">
                            <div class="d-flex flex-column align-center">
                                <v-skeleton-loader type="avatar" size="65"></v-skeleton-loader>
                                <v-skeleton-loader
                                    type="text"
                                    width="80px"
                                    class="mt-1"
                                ></v-skeleton-loader>
                            </div>

                            <div class="d-flex flex-column">
                                <div class="d-flex mb-1">
                                    <v-skeleton-loader
                                        type="button"
                                        width="65px"
                                        class="mr-1"
                                    ></v-skeleton-loader>
                                    <v-skeleton-loader
                                        type="button"
                                        width="65px"
                                    ></v-skeleton-loader>
                                </div>
                                <v-skeleton-loader type="button" width="75px"></v-skeleton-loader>
                            </div>
                        </div>
                    </div>
                </v-col>

                <!-- Weight Skeleton -->
                <v-col cols="12" sm="6" md="3">
                    <div class="d-flex flex-column">
                        <v-skeleton-loader
                            type="text"
                            width="80px"
                            class="mb-2"
                        ></v-skeleton-loader>

                        <div class="d-flex align-center justify-space-between">
                            <div>
                                <v-skeleton-loader
                                    type="text"
                                    width="60px"
                                    class="mb-1"
                                ></v-skeleton-loader>
                                <v-skeleton-loader type="text" width="80px"></v-skeleton-loader>
                            </div>

                            <div>
                                <v-skeleton-loader type="button" width="110px"></v-skeleton-loader>
                            </div>
                        </div>
                    </div>
                </v-col>

                <!-- Body Fat Skeleton -->
                <v-col cols="12" sm="6" md="3">
                    <div class="d-flex flex-column">
                        <v-skeleton-loader
                            type="text"
                            width="80px"
                            class="mb-2"
                        ></v-skeleton-loader>

                        <div class="d-flex align-center justify-space-between">
                            <div>
                                <v-skeleton-loader
                                    type="text"
                                    width="60px"
                                    class="mb-1"
                                ></v-skeleton-loader>
                                <v-skeleton-loader type="text" width="80px"></v-skeleton-loader>
                            </div>

                            <div>
                                <v-skeleton-loader type="button" width="120px"></v-skeleton-loader>
                            </div>
                        </div>
                    </div>
                </v-col>

                <!-- Steps Skeleton -->
                <v-col cols="12" sm="6" md="3">
                    <div class="d-flex flex-column">
                        <v-skeleton-loader
                            type="text"
                            width="90px"
                            class="mb-2"
                        ></v-skeleton-loader>

                        <div class="d-flex align-center justify-space-between">
                            <div>
                                <v-skeleton-loader
                                    type="text"
                                    width="70px"
                                    class="mb-1"
                                ></v-skeleton-loader>
                                <v-skeleton-loader type="text" width="80px"></v-skeleton-loader>
                            </div>

                            <div>
                                <v-skeleton-loader type="button" width="100px"></v-skeleton-loader>
                            </div>
                        </div>
                    </div>
                </v-col>
            </v-row>

            <!-- Loaded State -->
            <v-row v-else>
                <!-- Water Intake Tracker -->
                <v-col cols="12" sm="6" md="3">
                    <div class="d-flex flex-column">
                        <div class="d-flex justify-space-between align-center mb-2">
                            <div class="text-subtitle-1">Water Intake</div>
                            <!-- Water Log Menu -->
                            <v-menu
                                v-model="waterLogMenuOpen"
                                :close-on-content-click="false"
                                location="bottom"
                                min-width="300"
                            >
                                <template #activator="{ props }">
                                    <v-btn
                                        v-bind="props"
                                        variant="text"
                                        density="comfortable"
                                        color="blue"
                                        size="small"
                                        class="ml-auto"
                                        v-if="
                                            healthData.waterProgress.waterIntakeLog &&
                                            healthData.waterProgress.waterIntakeLog.length > 0
                                        "
                                    >
                                        <v-icon small class="mr-1">mdi-history</v-icon>
                                        View Log
                                    </v-btn>
                                </template>

                                <v-card>
                                    <v-card-title class="d-flex align-center">
                                        <v-icon color="blue" class="mr-2">mdi-water</v-icon>
                                        Water Intake Log
                                    </v-card-title>

                                    <WaterLogMenu
                                        :entries="healthData.waterProgress.waterIntakeLog || []"
                                        @remove="handleWaterRemove"
                                    />
                                </v-card>
                            </v-menu>
                        </div>

                        <div class="d-flex align-center justify-space-between">
                            <div class="d-flex flex-column align-center">
                                <v-progress-circular
                                    :model-value="healthData.waterProgress.percentage"
                                    :size="65"
                                    :width="7"
                                    color="blue"
                                >
                                    {{ healthData.waterProgress.percentage }}%
                                </v-progress-circular>

                                <div class="text-body-2 text-center mt-1">
                                    {{ healthData.waterProgress.current }}ml /
                                    {{ healthData.waterProgress.target }}ml
                                </div>
                            </div>

                            <div class="d-flex flex-column">
                                <div class="d-flex mb-1">
                                    <v-btn
                                        variant="outlined"
                                        color="blue"
                                        density="compact"
                                        class="mr-1"
                                        @click="logWater(250)"
                                    >
                                        +250ml
                                    </v-btn>
                                    <v-btn
                                        variant="outlined"
                                        color="blue"
                                        density="compact"
                                        @click="logWater(500)"
                                    >
                                        +500ml
                                    </v-btn>
                                </div>
                                <v-btn
                                    variant="outlined"
                                    color="blue"
                                    size="small"
                                    @click="openWaterDialog()"
                                >
                                    Custom
                                </v-btn>
                            </div>
                        </div>
                    </div>
                </v-col>

                <!-- Weight Tracker -->
                <v-col cols="12" sm="6" md="3">
                    <div class="d-flex flex-column">
                        <div class="text-subtitle-1 mb-2">Weight</div>

                        <div class="d-flex align-center justify-space-between">
                            <div>
                                <div v-if="healthData.latestWeight" class="text-left">
                                    <div class="text-h5 font-weight-bold">
                                        {{ healthData.latestWeight.weight }} kg
                                    </div>
                                    <div class="text-caption">
                                        {{ formatDate(healthData.latestWeight.date) }}
                                    </div>
                                </div>
                                <div v-else class="text-left">
                                    <div class="text-body-2">No data</div>
                                </div>
                            </div>

                            <div>
                                <v-btn
                                    variant="outlined"
                                    color="deep-purple"
                                    size="small"
                                    @click="openWeightDialog()"
                                >
                                    <v-icon small class="mr-1">mdi-scale-bathroom</v-icon>
                                    Log Weight
                                </v-btn>
                            </div>
                        </div>
                    </div>
                </v-col>

                <!-- Body Fat Tracker  -->
                <v-col cols="12" sm="6" md="3">
                    <div class="d-flex flex-column">
                        <div class="text-subtitle-1 mb-2">Body Fat</div>

                        <div class="d-flex align-center justify-space-between">
                            <div>
                                <div v-if="healthData.latestBodyFat" class="text-left">
                                    <div class="text-h5 font-weight-bold">
                                        {{ healthData.latestBodyFat.percentage }}%
                                    </div>
                                    <div class="text-caption">
                                        {{ formatDate(healthData.latestBodyFat.date) }}
                                    </div>
                                </div>
                                <div v-else class="text-left">
                                    <div class="text-body-2">No data</div>
                                </div>
                            </div>

                            <div>
                                <v-btn
                                    variant="outlined"
                                    color="amber-darken-2"
                                    size="small"
                                    @click="openBodyFatDialog()"
                                >
                                    <v-icon small class="mr-1">mdi-percent</v-icon>
                                    Log Body Fat
                                </v-btn>
                            </div>
                        </div>
                    </div>
                </v-col>

                <!-- Steps Tracker -->
                <v-col cols="12" sm="6" md="3">
                    <div class="d-flex flex-column">
                        <div class="text-subtitle-1 mb-2">Daily Steps</div>

                        <div class="d-flex align-center justify-space-between">
                            <div>
                                <div v-if="healthData.latestSteps" class="text-left">
                                    <div class="text-h5 font-weight-bold">
                                        {{ formatNumber(healthData.latestSteps.steps) }}
                                    </div>
                                    <div class="text-caption">
                                        {{ formatDate(healthData.latestSteps.date) }}
                                    </div>
                                </div>
                                <div v-else class="text-left">
                                    <div class="text-body-2">No steps logged</div>
                                </div>
                            </div>

                            <div>
                                <v-btn
                                    variant="outlined"
                                    color="green"
                                    size="small"
                                    @click="openStepsDialog()"
                                >
                                    <v-icon small class="mr-1">mdi-shoe-print</v-icon>
                                    Log Steps
                                </v-btn>
                            </div>
                        </div>
                    </div>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>
