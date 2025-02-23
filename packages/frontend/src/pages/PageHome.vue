<template>
    <v-container fluid class="pa-4">
        <!-- 1. Personalized Greeting -->
        <v-row class="mb-6">
            <v-col cols="12">
                <h2 class="text-h5 font-weight-bold">{{ greeting }}, {{ userName }}!</h2>
                <p class="text-subtitle-1">{{ motivationalMessage }}</p>
            </v-col>
        </v-row>

        <!-- 2. Today's Focus Section -->
        <v-row class="mb-6">
            <v-col cols="12">
                <v-card outlined>
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
            </v-col>
        </v-row>

        <!-- 3. Progress Snippet -->
        <v-row class="mb-6">
            <v-col cols="12" md="6">
                <v-card outlined>
                    <v-card-title>Weekly Progress</v-card-title>
                    <v-card-text>
                        <p class="text-h6 font-weight-bold">{{ workoutsThisWeekCount }} Workouts</p>
                        <p class="text-caption">Completed this week</p>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" md="6">
                <v-card outlined>
                    <v-card-title>Tip of the Day</v-card-title>
                    <v-card-text>
                        <p>{{ tipOfTheDay }}</p>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12">
                <WorkoutList title="All Workouts" />
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

import WorkoutList from "../components/WorkoutList.vue";
import { auth } from "../firebase";
import { getUserProfile } from "../services/user";
import { getWorkouts } from "../services/workout";
import { useGlobalStore } from "../stores/global";

const router = useRouter();
const globalStore = useGlobalStore();
const dateAdapter = useDate();

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
const motivationalMessages = [
    "Let's smash your fitness goals today!",
    "A little progress each day adds up to big results.",
    "Every workout is a step closer to a healthier you.",
    "You've got this! Let's make today count.",
];
const motivationalMessage = computed(() => {
    return motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
});

onMounted(async () => {
    if (auth.currentUser) {
        try {
            const profile = await getUserProfile(auth.currentUser.uid);
            userName.value = profile.name || userName.value;
        } catch (error) {
            globalStore.notifyError(error);
        }
    }
});

const { state: allWorkouts } = useAsyncState<WorkoutWithId[]>(() => {
    if (auth.currentUser) {
        return getWorkouts(auth.currentUser.uid);
    }
    return Promise.resolve([]);
}, []);

const todaysWorkouts = computed(() => {
    const today = new Date();
    return allWorkouts.value.filter((workout) => {
        const workoutDate = (workout.date as any).toDate
            ? (workout.date as any).toDate()
            : workout.date;
        return dateAdapter.isSameDay(workoutDate, today);
    });
});

function formattedDate(date: Date): string {
    const dateObj = (date as any).toDate ? (date as any).toDate() : date;
    return dateAdapter.format(dateObj, "fullDate");
}

function goToWorkoutLogger(): void {
    router.push({ name: "WorkoutLogger" });
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

const tips = [
    "Stay hydrated by drinking water throughout the day.",
    "Try adding a short walk after each meal to boost digestion.",
    "Focus on compound exercises for efficient full-body workouts.",
    "Prioritize sleep for optimal muscle recovery and growth.",
    "Warm up before every workout and cool down afterwards.",
];
const tipOfTheDay = computed(() => {
    return tips[Math.floor(Math.random() * tips.length)];
});
</script>
