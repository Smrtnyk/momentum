<template>
    <v-container fluid class="pa-4">
        <!-- Personalized Greeting -->
        <div class="mb-4">
            <v-card class="rounded-lg" elevation="2">
                <v-card-text>
                    <div class="d-flex align-center mb-4">
                        <v-icon color="red" size="x-large">mdi-heart-pulse</v-icon>
                        <div class="ml-4">
                            <h2 class="text-h5 font-weight-bold">{{ greeting }}, {{ userName }}</h2>
                        </div>
                    </div>

                    <p class="text-subtitle-1">{{ motivationalMessage }}</p>
                </v-card-text>
            </v-card>
        </div>

        <!-- Health Metrics Section -->
        <v-card class="rounded-lg mb-4" elevation="2">
            <v-card-title class="d-flex align-center">
                <v-icon color="primary" class="mr-2">mdi-chart-line</v-icon>
                Health Metrics
            </v-card-title>

            <v-card-text>
                <v-row>
                    <!-- Water Intake Tracker -->
                    <v-col cols="12" sm="6" md="3">
                        <div class="d-flex flex-column align-center">
                            <div class="text-subtitle-1 mb-2">Water Intake</div>

                            <v-progress-circular
                                :model-value="waterProgress.percentage"
                                :size="80"
                                :width="8"
                                color="blue"
                                class="mb-2"
                            >
                                {{ waterProgress.percentage }}%
                            </v-progress-circular>

                            <div class="text-body-2">
                                {{ waterProgress.current }}ml / {{ waterProgress.target }}ml
                            </div>

                            <div class="d-flex mt-2">
                                <v-btn
                                    v-for="amount in [250, 500]"
                                    :key="amount"
                                    variant="outlined"
                                    color="blue"
                                    size="small"
                                    class="mx-1"
                                    @click="logWater(amount)"
                                >
                                    +{{ amount }}ml
                                </v-btn>

                                <v-btn
                                    variant="outlined"
                                    color="blue"
                                    size="small"
                                    class="mx-1"
                                    @click="openWaterDialog()"
                                >
                                    Custom
                                </v-btn>
                            </div>
                        </div>
                    </v-col>

                    <!-- Weight Tracker -->
                    <v-col cols="12" sm="6" md="3">
                        <div class="d-flex flex-column align-center">
                            <div class="text-subtitle-1 mb-2">Weight</div>

                            <div class="d-flex align-center justify-center" style="height: 80px">
                                <div v-if="latestWeight" class="text-center">
                                    <div class="text-h5 font-weight-bold">
                                        {{ latestWeight.weight }} kg
                                    </div>
                                    <div class="text-caption">
                                        {{ formatDate(latestWeight.date) }}
                                    </div>
                                </div>
                                <div v-else class="text-center">
                                    <div class="text-body-2">No data</div>
                                </div>
                            </div>

                            <div class="mt-2">
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
                    </v-col>

                    <!-- Body Fat Tracker  -->
                    <v-col cols="12" sm="6" md="3">
                        <div class="d-flex flex-column align-center">
                            <div class="text-subtitle-1 mb-2">Body Fat</div>

                            <div class="d-flex align-center justify-center" style="height: 80px">
                                <div v-if="latestBodyFat" class="text-center">
                                    <div class="text-h5 font-weight-bold">
                                        {{ latestBodyFat.percentage }}%
                                    </div>
                                    <div class="text-caption">
                                        {{ formatDate(latestBodyFat.date) }}
                                    </div>
                                </div>
                                <div v-else class="text-center">
                                    <div class="text-body-2">No data</div>
                                </div>
                            </div>

                            <div class="mt-2">
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
                    </v-col>

                    <!-- Steps Tracker -->
                    <v-col cols="12" sm="6" md="3">
                        <div class="d-flex flex-column align-center">
                            <div class="text-subtitle-1 mb-2">Daily Steps</div>

                            <div class="d-flex align-center justify-center" style="height: 80px">
                                <div v-if="latestSteps" class="text-center">
                                    <div class="text-h5 font-weight-bold">
                                        {{ formatNumber(latestSteps.steps) }}
                                    </div>
                                    <div class="text-caption">
                                        {{ formatDate(latestSteps.date) }}
                                    </div>
                                </div>
                                <div v-else class="text-center">
                                    <div class="text-body-2">No steps logged</div>
                                </div>
                            </div>

                            <div class="mt-2">
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
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>

        <!-- Today's Focus Section -->
        <div class="mb-4">
            <v-card class="rounded-lg" elevation="2">
                <v-card-title>Today's Focus</v-card-title>
                <v-card-text>
                    <div v-if="todaysWorkouts.length > 0">
                        <p class="mb-2">Here are your workouts for today:</p>
                        <v-list density="compact">
                            <v-list-item
                                v-for="workout in todaysWorkouts"
                                :key="workout.id"
                                @click="viewWorkout(workout)"
                                link
                            >
                                <v-list-item-title>{{ workout.name }}</v-list-item-title>
                                <v-list-item-subtitle>
                                    {{ formattedDate(workout.date.toDate()) }}
                                </v-list-item-subtitle>
                            </v-list-item>
                        </v-list>
                    </div>
                    <div v-else>
                        <p class="mb-2">No workouts logged for today yet.</p>
                    </div>

                    <v-btn block color="primary" class="mt-4" @click="goToWorkoutLogger">
                        Log Workout
                    </v-btn>
                </v-card-text>
            </v-card>
        </div>

        <!-- Progress Snippet -->
        <v-row class="mb-6">
            <v-col cols="12" md="6">
                <v-card class="rounded-lg" elevation="2">
                    <v-card-title>Weekly Progress</v-card-title>
                    <v-card-text>
                        <p class="text-h6 font-weight-bold">{{ workoutsThisWeekCount }} Workouts</p>
                        <p class="text-caption">Completed this week</p>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" md="6">
                <FitnessTip />
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { useAsyncState } from "@vueuse/core";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useDate } from "vuetify";

import type { WorkoutWithId } from "../types/workout";

import FitnessTip from "../components/FitnessTip.vue";
import BodyFatDialog from "../components/health-metrics/BodyFatDialog.vue";
import StepsEntryDialog from "../components/health-metrics/StepsEntryDialog.vue";
import WaterIntakeDialog from "../components/health-metrics/WaterIntakeDialog.vue";
import WeightEntryDialog from "../components/health-metrics/WeightEntryDialog.vue";
import { useDialog } from "../composables/useDialog";
import { motivationalMessages } from "../data/motivational-messages";
import { logger } from "../logger/app-logger";
import {
    getLatestBodyFat,
    getLatestSteps,
    getLatestWeight,
    getTodayWaterProgress,
    logBodyFat,
    logSteps,
    logWaterIntake,
    logWeight,
} from "../services/health-metrics";
import { getUserProfile } from "../services/user";
import { getWorkouts } from "../services/workout";
import { useAuthStore } from "../stores/auth";
import { useGlobalStore } from "../stores/global";

const router = useRouter();
const authStore = useAuthStore();
const globalStore = useGlobalStore();
const dateAdapter = useDate();
const { openDialog } = useDialog();

const waterProgress = ref({ current: 0, percentage: 0, target: 2500 });
const latestWeight = ref<null | { date: Date; weight: number }>(null);
const latestBodyFat = ref<null | { date: Date; method?: string; percentage: number }>(null);
const latestSteps = ref<null | { date: Date; steps: number }>(null);

const currentHour = new Date().getHours();
const greeting = computed(() => {
    if (currentHour < 12) {
        return "Good Morning";
    } else if (currentHour < 18) {
        return "Good Afternoon";
    }
    return "Good Evening";
});

const userName = ref("there");
const motivationalMessage = computed(() => {
    return motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
});

onMounted(async () => {
    try {
        const profile = await getUserProfile(authStore.nonNullableUser.uid);
        userName.value = profile.name || userName.value;

        await refreshHealthData();
    } catch (error) {
        globalStore.notifyError(error);
    }
});

const { state: allWorkouts } = useAsyncState<WorkoutWithId[]>(() => {
    return getWorkouts(authStore.nonNullableUser.uid);
}, []);

const todaysWorkouts = computed(() => {
    const today = new Date();
    return allWorkouts.value.filter((workout) => {
        const workoutDate = workout.date.toDate();
        return dateAdapter.isSameDay(workoutDate, today);
    });
});

function formatDate(date: Date): string {
    const dateObj = (date as any).toDate ? (date as any).toDate() : date;
    return dateAdapter.format(dateObj, "shortDate");
}

function formatNumber(num: number): string {
    return num.toLocaleString();
}

function formattedDate(date: Date): string {
    const dateObj = (date as any).toDate ? (date as any).toDate() : date;
    return dateAdapter.format(dateObj, "fullDate");
}

function goToWorkoutLogger(): void {
    router.push({ name: "WorkoutLogger" });
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
    openDialog(BodyFatDialog, {
        initialMethod: "calipers",
        onSave: async (percentage: number, method: string) => {
            await logBodyFatPercentage(percentage, method);
        },
    });
}

function openStepsDialog(): void {
    openDialog(StepsEntryDialog, {
        onSave: async (steps: number) => {
            await logDailySteps(steps);
        },
    });
}

function openWaterDialog(): void {
    openDialog(WaterIntakeDialog, {
        onSave: async (amount: number) => {
            await logWater(amount);
        },
    });
}

function openWeightDialog(): void {
    openDialog(WeightEntryDialog, {
        onSave: async (weight: number) => {
            await logTodayWeight(weight);
        },
    });
}

async function refreshHealthData(): Promise<void> {
    try {
        const userId = authStore.nonNullableUser.uid;
        waterProgress.value = await getTodayWaterProgress(userId);
        latestWeight.value = await getLatestWeight(userId);
        latestBodyFat.value = await getLatestBodyFat(userId);
        latestSteps.value = await getLatestSteps(userId);
    } catch (error) {
        globalStore.notifyError("Failed to load health metrics");
        logger.error(error);
    }
}

function viewWorkout(workout: WorkoutWithId): void {
    router.push({ name: "WorkoutDetail", params: { id: workout.id } });
}

const workoutsThisWeekCount = computed(() => {
    const startOfWeek = dateAdapter.startOfWeek(new Date());
    const endOfWeek = dateAdapter.endOfWeek(new Date());

    return allWorkouts.value.filter(function (workout) {
        const workoutDate = workout.date.toDate();
        return (
            dateAdapter.isAfter(workoutDate, startOfWeek) &&
            dateAdapter.isBefore(workoutDate, endOfWeek)
        );
    }).length;
});
</script>
