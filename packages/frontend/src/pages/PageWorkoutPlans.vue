<template>
    <v-container class="pa-2 mx-auto">
        <v-row>
            <v-col cols="12">
                <div class="d-flex flex-column">
                    <!-- Page Header -->
                    <v-card class="px-4 py-6 rounded-lg mb-4">
                        <h1 class="text-h4 text-white font-weight-bold mb-2">Training Programs</h1>
                        <p class="text-body-1 text-white mb-0">
                            Science-based workout plans for all fitness levels
                        </p>
                    </v-card>

                    <!-- Filters -->
                    <v-card class="mb-4 rounded-lg">
                        <v-card-text>
                            <v-row dense>
                                <v-col cols="12" class="pa-0 pb-2">
                                    <v-tabs
                                        v-model="activeTab"
                                        color="primary"
                                        class="fitness-tabs rounded-lg overflow-hidden"
                                        density="compact"
                                    >
                                        <v-tab
                                            v-for="tab in tabOptions"
                                            :key="tab.value"
                                            :value="tab.value"
                                            class="text-body-1 font-weight-medium"
                                            :ripple="false"
                                        >
                                            <v-icon :icon="tab.icon" class="mr-2" size="small" />
                                            {{ tab.title }}
                                        </v-tab>
                                    </v-tabs>
                                </v-col>
                            </v-row>

                            <v-row class="mt-2">
                                <v-col cols="6" sm="4">
                                    <v-select
                                        v-model="selectedLevel"
                                        label="Level"
                                        :items="difficultyLevels"
                                        variant="outlined"
                                        density="comfortable"
                                        hide-details
                                        class="text-body-2"
                                    ></v-select>
                                </v-col>
                                <v-col cols="6" sm="4">
                                    <v-select
                                        v-model="selectedDuration"
                                        label="Duration"
                                        :items="durationOptions"
                                        variant="outlined"
                                        density="comfortable"
                                        hide-details
                                        class="text-body-2"
                                    ></v-select>
                                </v-col>
                                <v-col cols="12" sm="4">
                                    <v-text-field
                                        v-model="searchQuery"
                                        label="Search"
                                        prepend-inner-icon="mdi-magnify"
                                        variant="outlined"
                                        density="comfortable"
                                        hide-details
                                        class="text-body-2"
                                    ></v-text-field>
                                </v-col>

                                <v-col cols="6" sm="4">
                                    <v-select
                                        v-model="selectedLocation"
                                        label="Location"
                                        :items="locationOptions"
                                        variant="outlined"
                                        density="comfortable"
                                        hide-details
                                        class="text-body-2"
                                    ></v-select>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>

                    <!-- Programs List -->
                    <div class="flex-grow-1 rounded-lg">
                        <div class="pa-0">
                            <div
                                v-if="filteredPlans.length === 0"
                                class="d-flex flex-column align-center justify-center pa-8"
                            >
                                <v-icon size="64" color="grey-lighten-1">mdi-dumbbell</v-icon>
                                <p class="text-body-1 text-center mt-4 text-grey-darken-1">
                                    No training plans match your filters.<br />
                                    Try adjusting your search criteria.
                                </p>
                                <v-btn
                                    color="primary"
                                    variant="text"
                                    @click="resetFilters"
                                    class="mt-2"
                                >
                                    Reset Filters
                                </v-btn>
                            </div>

                            <v-list v-else class="pa-0 bg-transparent">
                                <template v-for="plan in filteredPlans" :key="plan.id">
                                    <v-list-item
                                        @click="openPlanDetails(plan)"
                                        class="plan-item pa-0 mb-3"
                                    >
                                        <v-card flat class="pa-0 ma-0 rounded-lg">
                                            <div class="d-flex flex-column flex-sm-row">
                                                <!-- Image for plan -->
                                                <div
                                                    class="plan-image d-flex align-center justify-center"
                                                    :class="{
                                                        'bg-grey-lighten-3': !hasBackgroundImage(
                                                            plan.type,
                                                        ),
                                                    }"
                                                    :style="{
                                                        minHeight: '150px',
                                                        minWidth: '120px',
                                                        backgroundImage: hasBackgroundImage(
                                                            plan.type,
                                                        )
                                                            ? `url('${getWorkoutImageUrl(plan.type)}')`
                                                            : '',
                                                        backgroundSize: 'cover',
                                                        backgroundPosition: 'center',
                                                    }"
                                                >
                                                    <v-icon
                                                        v-if="!hasBackgroundImage(plan.type)"
                                                        size="64"
                                                        color="grey-lighten-1"
                                                        >{{ getPlanIcon(plan.type) }}</v-icon
                                                    >
                                                </div>

                                                <!-- Plan content -->
                                                <div class="d-flex flex-column flex-grow-1 pa-4">
                                                    <div class="d-flex align-center mb-2">
                                                        <div
                                                            class="text-uppercase text-caption font-weight-bold mr-2 px-2 py-1 rounded"
                                                            :class="getLevelClass(plan.level)"
                                                        >
                                                            {{ plan.level }}
                                                        </div>
                                                        <div
                                                            class="text-uppercase text-caption font-weight-bold px-2 py-1 rounded"
                                                            :class="getCategoryClass(plan.type)"
                                                        >
                                                            {{ plan.type }}
                                                        </div>
                                                        <v-spacer></v-spacer>
                                                        <div
                                                            class="text-caption text-grey-lighten-1"
                                                        >
                                                            {{ plan.durationWeeks }} weeks •
                                                            {{ plan.frequency }}x/week
                                                        </div>
                                                    </div>

                                                    <h3 class="text-h6 font-weight-bold mb-1">
                                                        {{ plan.name }}
                                                    </h3>
                                                    <p
                                                        class="text-body-2 text-grey-lighten-1 mb-2 line-clamp-2"
                                                    >
                                                        {{ plan.description }}
                                                    </p>

                                                    <div
                                                        class="d-flex align-center flex-wrap mt-auto pt-2"
                                                    >
                                                        <v-chip
                                                            v-for="(goal, i) in plan.goals.slice(
                                                                0,
                                                                2,
                                                            )"
                                                            :key="i"
                                                            size="small"
                                                            color="grey-lighten-3"
                                                            class="mr-2 mb-2 text-caption"
                                                        >
                                                            {{ goal }}
                                                        </v-chip>
                                                        <v-chip
                                                            v-if="plan.goals.length > 2"
                                                            size="small"
                                                            color="grey-lighten-3"
                                                            class="mb-2 text-caption"
                                                        >
                                                            +{{ plan.goals.length - 2 }} more
                                                        </v-chip>
                                                    </div>
                                                </div>
                                            </div>
                                        </v-card>
                                    </v-list-item>
                                </template>
                            </v-list>
                        </div>
                    </div>
                </div>
            </v-col>
        </v-row>

        <!-- Floating Action Button -->
        <v-btn
            color="primary"
            icon="mdi-clipboard-text-outline"
            size="large"
            style="position: fixed; bottom: 80px; right: 16px"
            @click="showCreatePlanDialog"
        ></v-btn>
    </v-container>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

import type { DifficultyLevel, TrainingPlan } from "../types/workout-plans";

import PlanDetailsDialog from "../components/workout-plans/PlanDetailsDialog.vue";
import { globalDialog } from "../composables/useDialog";
import { allTrainingPlans, cardioPlans, hybridPlans, strengthPlans } from "../data/training-plans";
import { logger } from "../logger/app-logger";

type WorkoutImageMap = {
    [key in TrainingPlan["type"]]: string;
};

const workoutImages: WorkoutImageMap = {
    cardio: "/workout-images/cardio-workout.jpg",
    circuit: "/workout-images/circuit-workout.jpg",
    strength: "/workout-images/strength-workout.jpg",
};

function getWorkoutImageUrl(category: TrainingPlan["type"]): string {
    return workoutImages[category] ?? "";
}

function hasBackgroundImage(type: TrainingPlan["type"]): boolean {
    return Boolean(getWorkoutImageUrl(type));
}

const activeTab = ref<string>("all");
const searchQuery = ref<string>("");
const selectedDuration = ref<string>("all");
const selectedLevel = ref<string>("all");

const locationOptions = [
    { title: "Any Location", value: "all" },
    { title: "Home Workouts", value: "home" },
    { title: "Gym Workouts", value: "gym" },
    { title: "Anywhere", value: "anywhere" },
] as const;

const selectedLocation = ref<string>("all");

type TabOption = {
    icon: string;
    title: string;
    value: string;
};

const tabOptions: TabOption[] = [
    { icon: "mdi-view-dashboard-outline", title: "All", value: "all" },
    { icon: "mdi-weight-lifter", title: "Strength", value: "strength" },
    { icon: "mdi-run", title: "Cardio", value: "cardio" },
    { icon: "mdi-timer-outline", title: "Hybrid", value: "hybrid" },
];

const difficultyLevels = [
    { title: "All Levels", value: "all" },
    { title: "Beginner", value: "beginner" },
    { title: "Intermediate", value: "intermediate" },
    { title: "Advanced", value: "advanced" },
] as const;

const durationOptions = [
    { title: "Any Duration", value: "all" },
    { title: "8 weeks or less", value: "short" },
    { title: "8-12 weeks", value: "medium" },
    { title: "12+ weeks", value: "long" },
] as const;

const filteredPlans = computed<TrainingPlan[]>(function () {
    let plans: TrainingPlan[];

    switch (activeTab.value) {
        case "cardio":
            plans = [...cardioPlans];
            break;
        case "hybrid":
            plans = [...hybridPlans];
            break;
        case "strength":
            plans = [...strengthPlans];
            break;
        default:
            plans = [...allTrainingPlans];
            break;
    }

    if (selectedLevel.value !== "all") {
        plans = plans.filter((plan) => plan.level === selectedLevel.value);
    }

    if (selectedDuration.value !== "all") {
        switch (selectedDuration.value) {
            case "long":
                plans = plans.filter((plan) => plan.durationWeeks > 12);
                break;
            case "medium":
                plans = plans.filter((plan) => plan.durationWeeks > 8 && plan.durationWeeks <= 12);
                break;
            case "short":
                plans = plans.filter((plan) => plan.durationWeeks <= 8);
                break;
        }
    }

    if (selectedLocation.value !== "all") {
        plans = plans.filter((plan) => plan.location === selectedLocation.value);
    }

    if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase();
        plans = plans.filter(
            (plan) =>
                plan.name.toLowerCase().includes(query) ??
                plan.description.toLowerCase().includes(query) ??
                plan.goals.some((goal) => goal.toLowerCase().includes(query)),
        );
    }

    return plans;
});

function getCategoryClass(category: TrainingPlan["type"]): string {
    switch (category) {
        case "cardio":
            return "bg-teal-lighten-5 text-teal-darken-3";
        case "circuit":
            return "bg-amber-lighten-5 text-amber-darken-3";
        case "strength":
            return "bg-red-lighten-5 text-red-darken-3";
        default:
            return "bg-grey-lighten-3";
    }
}

function getLevelClass(level: DifficultyLevel): string {
    switch (level) {
        case "advanced":
            return "bg-purple-lighten-5 text-purple-darken-3";
        case "beginner":
            return "bg-green-lighten-5 text-green-darken-3";
        case "intermediate":
            return "bg-blue-lighten-5 text-blue-darken-3";
        default:
            return "bg-grey-lighten-3";
    }
}

function getPlanIcon(category: TrainingPlan["type"]): string {
    switch (category) {
        case "cardio":
            return "mdi-run";
        case "circuit":
            return "mdi-timer-outline";
        case "strength":
            return "mdi-weight-lifter";
        default:
            return "mdi-dumbbell";
    }
}

function openPlanDetails(plan: TrainingPlan): void {
    globalDialog.openDialog(
        PlanDetailsDialog,
        {
            onAddToFavorites(planData: TrainingPlan): void {
                logger.info("Adding plan to Favorites");
                logger.info(`Added ${planData.name} to favorites!`);
            },
            plan,
        },
        {
            title: plan.name,
        },
    );
}

function resetFilters(): void {
    activeTab.value = "all";
    selectedLevel.value = "all";
    selectedDuration.value = "all";
    searchQuery.value = "";
}

function showCreatePlanDialog(): void {
    logger.info("Create custom plan functionality coming soon!");
}
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.fitness-tabs :deep(.v-tab) {
    border-radius: 12px 12px 0 0;
    opacity: 0.75;
    transition: all 0.2s ease;
    margin: 0 4px;
}

.fitness-tabs :deep(.v-tab--selected) {
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
    opacity: 1;
    font-weight: bold;
}

.fitness-tabs :deep(.v-tabs-slider) {
    height: 3px;
    border-radius: 3px;
}
</style>
