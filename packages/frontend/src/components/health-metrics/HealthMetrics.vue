<template>
    <v-card class="rounded-lg mb-4" elevation="2">
        <v-card-title class="d-flex align-center">
            <v-icon color="primary" class="mr-2">mdi-chart-line</v-icon>
            Health Metrics
        </v-card-title>

        <v-card-text>
            <!-- Loading State -->
            <v-row v-if="isLoading">
                <v-col v-for="i in 4" :key="i" cols="12" sm="6" md="3">
                    <div class="metric-card">
                        <div class="d-flex justify-space-between align-center mb-2">
                            <v-skeleton-loader type="text" width="100px"></v-skeleton-loader>
                            <v-skeleton-loader type="button" width="24px"></v-skeleton-loader>
                        </div>
                        <div
                            class="d-flex flex-column align-center justify-center"
                            style="min-height: 120px"
                        >
                            <v-skeleton-loader
                                v-if="i === 1"
                                type="avatar"
                                size="80"
                                class="mb-2"
                            ></v-skeleton-loader>
                            <v-skeleton-loader
                                v-else
                                type="text"
                                width="120px"
                                class="mb-2"
                            ></v-skeleton-loader>
                            <v-skeleton-loader type="text" width="80px"></v-skeleton-loader>
                        </div>
                    </div>
                </v-col>
            </v-row>

            <!-- Loaded State -->
            <v-row v-else-if="!healthDataError">
                <!-- Water Intake Metric Card -->
                <v-col cols="12" sm="6" md="3">
                    <metric-card
                        title="Water Intake"
                        icon="mdi-water"
                        color="blue"
                        action-icon="mdi-plus"
                        @action="openWaterMenu"
                    >
                        <div class="d-flex flex-column align-center">
                            <div class="position-relative">
                                <v-progress-circular
                                    :model-value="healthData.waterProgress.percentage"
                                    :size="80"
                                    :width="7"
                                    color="blue"
                                >
                                    {{ healthData.waterProgress.percentage }}%
                                </v-progress-circular>
                            </div>

                            <div class="text-body-2 text-center mt-2">
                                {{ healthData.waterProgress.current }}ml /
                                {{ healthData.waterProgress.target }}ml
                            </div>
                        </div>
                    </metric-card>
                </v-col>

                <!-- Weight Metric Card -->
                <v-col cols="12" sm="6" md="3">
                    <metric-card
                        title="Weight"
                        icon="mdi-scale-bathroom"
                        color="deep-purple"
                        @action="openWeightDialog"
                    >
                        <div v-if="healthData.latestWeight" class="text-center">
                            <div class="text-h4 font-weight-bold">
                                {{ healthData.latestWeight.weight.toFixed(1) }} kg
                            </div>
                            <div class="text-caption">
                                {{ formatDate(healthData.latestWeight.date) }}
                            </div>
                        </div>
                        <div v-else class="text-center py-4">
                            <v-icon size="x-large" color="grey-lighten-1"
                                >mdi-scale-bathroom</v-icon
                            >
                            <p class="text-grey mt-2">No data recorded</p>
                        </div>
                    </metric-card>
                </v-col>

                <!-- Body Fat Metric Card -->
                <v-col cols="12" sm="6" md="3">
                    <metric-card
                        title="Body Fat"
                        icon="mdi-percent"
                        color="amber-darken-2"
                        @action="openBodyFatDialog"
                    >
                        <div v-if="healthData.latestBodyFat" class="text-center">
                            <div class="text-h4 font-weight-bold">
                                {{ healthData.latestBodyFat.percentage.toFixed(1) }}%
                            </div>
                            <div class="text-caption">
                                {{ formatDate(healthData.latestBodyFat.date) }}
                            </div>
                        </div>
                        <div v-else class="text-center py-4">
                            <v-icon size="x-large" color="grey-lighten-1">mdi-percent</v-icon>
                            <p class="text-grey mt-2">No data recorded</p>
                        </div>
                    </metric-card>
                </v-col>

                <!-- Steps Metric Card -->
                <v-col cols="12" sm="6" md="3">
                    <metric-card
                        title="Daily Steps"
                        icon="mdi-shoe-print"
                        color="green"
                        @action="openStepsDialog"
                    >
                        <div v-if="healthData.latestSteps" class="text-center">
                            <div class="text-h4 font-weight-bold">
                                {{ formatNumber(healthData.latestSteps.steps) }}
                            </div>
                            <div class="text-caption">
                                {{ formatDate(healthData.latestSteps.date) }}
                            </div>
                        </div>
                        <div v-else class="text-center py-4">
                            <v-icon size="x-large" color="grey-lighten-1">mdi-shoe-print</v-icon>
                            <p class="text-grey mt-2">No steps logged</p>
                        </div>
                    </metric-card>
                </v-col>
            </v-row>

            <RetryFetcher
                title=""
                message="Failed to fetch health data"
                v-if="healthDataError"
                :fetcher="refreshHealthData"
            />
        </v-card-text>

        <!-- Water Bottom Sheet Menu -->
        <v-bottom-sheet v-model="waterMenuOpen" max-width="500" class="mx-auto">
            <v-card>
                <v-card-title class="d-flex align-center">
                    <v-icon color="blue" class="mr-2">mdi-water</v-icon>
                    Water Management
                </v-card-title>

                <v-tabs v-model="waterTab" color="blue">
                    <v-tab value="add">Add Water</v-tab>
                    <v-tab value="log">View Log</v-tab>
                </v-tabs>

                <v-window v-model="waterTab">
                    <!-- Add Water Tab -->
                    <v-window-item value="add">
                        <v-card-text>
                            <v-row>
                                <v-col cols="6">
                                    <v-btn
                                        block
                                        variant="tonal"
                                        color="blue"
                                        @click="logWater(250)"
                                        class="mb-2"
                                    >
                                        <v-icon class="mr-1">mdi-cup-water</v-icon>
                                        250ml
                                    </v-btn>
                                </v-col>
                                <v-col cols="6">
                                    <v-btn
                                        block
                                        variant="tonal"
                                        color="blue"
                                        @click="logWater(500)"
                                        class="mb-2"
                                    >
                                        <v-icon class="mr-1">mdi-bottle-water</v-icon>
                                        500ml
                                    </v-btn>
                                </v-col>
                                <v-col cols="6">
                                    <v-btn
                                        block
                                        variant="tonal"
                                        color="blue"
                                        @click="logWater(750)"
                                        class="mb-2"
                                    >
                                        <v-icon class="mr-1">mdi-bottle-water</v-icon>
                                        750ml
                                    </v-btn>
                                </v-col>
                                <v-col cols="6">
                                    <v-btn
                                        block
                                        variant="tonal"
                                        color="blue"
                                        @click="logWater(1000)"
                                        class="mb-2"
                                    >
                                        <v-icon class="mr-1">mdi-bottle-water-large</v-icon>
                                        1000ml
                                    </v-btn>
                                </v-col>
                                <v-col cols="12">
                                    <v-btn
                                        block
                                        variant="elevated"
                                        color="blue"
                                        @click="openWaterCustomDialog"
                                    >
                                        <v-icon class="mr-1">mdi-pencil</v-icon>
                                        Custom Amount
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-window-item>

                    <!-- Water Log Tab -->
                    <v-window-item value="log">
                        <WaterLogMenu
                            :entries="healthData.waterProgress.waterIntakeLog || []"
                            @remove="handleWaterRemove"
                        />
                    </v-window-item>
                </v-window>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text @click="waterMenuOpen = false">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-bottom-sheet>
    </v-card>
</template>

<script setup lang="ts">
import { useAsyncState } from "@vueuse/core";
import { ref } from "vue";
import { useDate } from "vuetify";

import type { BodyFatProgress, WaterProgress } from "../../services/health-metrics";
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
import RetryFetcher from "../ui/RetryFetcher.vue";
import BodyFatDialog from "./BodyFatDialog.vue";
import MetricCard from "./MetricCard.vue";
import StepsEntryDialog from "./StepsEntryDialog.vue";
import WaterIntakeDialog from "./WaterIntakeDialog.vue";
import WaterLogMenu from "./WaterLogMenu.vue";
import WeightEntryDialog from "./WeightEntryDialog.vue";

const authStore = useAuthStore();
const globalStore = useGlobalStore();
const dateAdapter = useDate();

const waterMenuOpen = ref(false);
const waterTab = ref("add");

interface HealthData {
    latestBodyFat: BodyFatProgress | null;
    latestSteps: null | {
        date: Date;
        steps: number;
    };
    latestWeight: null | {
        date: Date;
        weight: number;
    };
    waterProgress: WaterProgress;
}

async function fetchAllHealthData(): Promise<HealthData> {
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
    error: healthDataError,
    execute: refreshHealthData,
    isLoading,
    state: healthData,
} = useAsyncState<HealthData>(
    fetchAllHealthData,
    {
        latestBodyFat: null,
        latestSteps: null,
        latestWeight: null,
        waterProgress: { current: 0, percentage: 0, target: 2500, waterIntakeLog: [] },
    },
    {
        onError(error) {
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
        logger.error(error);
    }
}

async function logWater(amount: number): Promise<void> {
    try {
        const userId = authStore.nonNullableUser.uid;
        await logWaterIntake(userId, amount);
        globalStore.notify(`Added ${amount}ml of water`);
        await refreshHealthData();
        waterMenuOpen.value = false;
    } catch (error) {
        globalStore.notifyError("Failed to log water intake");
        logger.error(error);
    }
}

function openBodyFatDialog(): void {
    globalDialog.openDialog(
        BodyFatDialog,
        {
            initialMethod: "calipers",
            onSave: logBodyFatPercentage,
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
            onSave: logDailySteps,
        },
        {
            title: "Log Daily Steps",
        },
    );
}

function openWaterCustomDialog(): void {
    waterMenuOpen.value = false;
    globalDialog.openDialog(
        WaterIntakeDialog,
        {
            onSave: logWater,
        },
        {
            title: "Custom Water Intake",
        },
    );
}

function openWaterMenu(): void {
    waterMenuOpen.value = true;
    waterTab.value = "add";
}

function openWeightDialog(): void {
    globalDialog.openDialog(
        WeightEntryDialog,
        {
            onSave: logTodayWeight,
        },
        {
            title: "Log Today's Weight",
        },
    );
}
</script>

<style scoped>
.metric-card {
    height: 100%;
    padding: 12px;
    border-radius: 16px;
    background-color: rgb(var(--v-theme-surface));
    border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}
</style>
