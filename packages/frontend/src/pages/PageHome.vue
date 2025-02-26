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

        <!-- Health Metrics Tracking -->
        <v-card class="rounded-lg mb-4" elevation="2">
            <v-card-title class="d-flex align-center">
                <v-icon color="primary" class="mr-2">mdi-chart-line</v-icon>
                Today's Health Metrics
            </v-card-title>

            <v-card-text>
                <v-row>
                    <!-- Water Intake Tracker -->
                    <v-col cols="12" sm="6">
                        <div class="d-flex flex-column align-center">
                            <div class="text-subtitle-1 mb-2">Water Intake</div>

                            <v-progress-circular
                                :model-value="waterProgress.percentage"
                                :size="100"
                                :width="12"
                                color="blue"
                                class="mb-3"
                            >
                                {{ waterProgress.percentage }}%
                            </v-progress-circular>

                            <div class="text-body-1">
                                {{ waterProgress.current }}ml / {{ waterProgress.target }}ml
                            </div>

                            <div class="d-flex mt-3">
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
                                    @click="showCustomWaterDialog = true"
                                >
                                    Custom
                                </v-btn>
                            </div>
                        </div>
                    </v-col>

                    <!-- Weight Tracker -->
                    <v-col cols="12" sm="6" class="d-flex flex-column">
                        <div class="text-subtitle-1 mb-2 text-center">Weight</div>

                        <div class="d-flex align-center justify-center flex-grow-1 mb-3">
                            <div v-if="latestWeight" class="text-center">
                                <div class="text-h4 font-weight-bold">
                                    {{ latestWeight.weight }} kg
                                </div>
                                <div class="text-caption">
                                    Last updated: {{ formatDate(latestWeight.date) }}
                                </div>
                            </div>
                            <div v-else class="text-center">
                                <div class="text-body-1">No weight data recorded</div>
                            </div>
                        </div>

                        <v-btn
                            block
                            variant="outlined"
                            color="primary"
                            @click="showWeightDialog = true"
                        >
                            <v-icon left>mdi-scale-bathroom</v-icon>
                            Log Today's Weight
                        </v-btn>
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
                        <v-list dense>
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

        <!-- Dialog for custom water amount -->
        <v-dialog v-model="showCustomWaterDialog" max-width="400">
            <v-card>
                <v-card-title>Log Water Intake</v-card-title>
                <v-card-text>
                    <v-text-field
                        v-model.number="customWaterAmount"
                        type="number"
                        label="Amount (ml)"
                        variant="outlined"
                        :rules="[
                            (v) => !!v || 'Amount is required',
                            (v) => v > 0 || 'Amount must be positive',
                        ]"
                    ></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="showCustomWaterDialog = false">Cancel</v-btn>
                    <v-btn
                        color="primary"
                        @click="logCustomWater"
                        :disabled="!customWaterAmount || customWaterAmount <= 0"
                    >
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Dialog for weight input -->
        <v-dialog v-model="showWeightDialog" max-width="400">
            <v-card>
                <v-card-title>Log Today's Weight</v-card-title>
                <v-card-text>
                    <v-text-field
                        v-model.number="weightInput"
                        type="number"
                        label="Weight (kg)"
                        variant="outlined"
                        step="0.1"
                        :rules="[
                            (v) => !!v || 'Weight is required',
                            (v) => v > 0 || 'Weight must be positive',
                        ]"
                    ></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="showWeightDialog = false">Cancel</v-btn>
                    <v-btn
                        color="primary"
                        @click="logTodayWeight"
                        :disabled="!weightInput || weightInput <= 0"
                    >
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script setup lang="ts">
import { useAsyncState } from "@vueuse/core";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useDate } from "vuetify";

import type { WorkoutWithId } from "../types/workout";

import FitnessTip from "../components/FitnessTip.vue";
import { motivationalMessages } from "../data/motivational-messages";
import {
    getLatestWeight,
    getTodayWaterProgress,
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

// Health metrics refs
const waterProgress = ref({ current: 0, percentage: 0, target: 2500 });
const latestWeight = ref<null | { date: Date; weight: number }>(null);
const showCustomWaterDialog = ref(false);
const showWeightDialog = ref(false);
const customWaterAmount = ref<null | number>(null);
const weightInput = ref<null | number>(null);

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

function formattedDate(date: Date): string {
    const dateObj = (date as any).toDate ? (date as any).toDate() : date;
    return dateAdapter.format(dateObj, "fullDate");
}

function goToWorkoutLogger(): void {
    router.push({ name: "WorkoutLogger" });
}

async function logCustomWater(): Promise<void> {
    if (!customWaterAmount.value) {
        return;
    }

    await logWater(customWaterAmount.value);
    showCustomWaterDialog.value = false;
    customWaterAmount.value = null;
}

async function logTodayWeight(): Promise<void> {
    if (!weightInput.value) {
        return;
    }

    try {
        const userId = authStore.nonNullableUser.uid;
        await logWeight(userId, weightInput.value);
        globalStore.notify("Weight logged successfully");
        await refreshHealthData();
        showWeightDialog.value = false;
        weightInput.value = null;
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

async function refreshHealthData(): Promise<void> {
    try {
        const userId = authStore.nonNullableUser.uid;
        waterProgress.value = await getTodayWaterProgress(userId);
        latestWeight.value = await getLatestWeight(userId);
    } catch (error) {
        globalStore.notifyError("Failed to load health metrics");
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
