<template>
    <div class="workout-plans">
        <v-container fluid class="pa-0">
            <v-app-bar flat density="comfortable" color="background" class="sticky-header">
                <v-app-bar-title class="text-h6">Training Programs</v-app-bar-title>

                <v-btn icon variant="text" @click="showSortMenu = true">
                    <v-icon>mdi-sort</v-icon>
                </v-btn>

                <v-btn icon variant="text" @click="showFilterDrawer = true" class="ml-2">
                    <v-badge
                        :content="activeFiltersCount"
                        :model-value="activeFiltersCount > 0"
                        color="primary"
                        location="top end"
                    >
                        <v-icon>mdi-filter</v-icon>
                    </v-badge>
                </v-btn>
            </v-app-bar>

            <!-- Search bar -->
            <v-container class="pa-2">
                <v-text-field
                    v-model="searchQuery"
                    prepend-inner-icon="mdi-magnify"
                    label="Search programs"
                    density="comfortable"
                    variant="outlined"
                    hide-details
                    clearable
                ></v-text-field>
            </v-container>

            <v-container class="pa-2 mx-auto">
                <!-- Page Header -->
                <v-card class="px-4 py-6 rounded-lg mb-4">
                    <h1 class="text-h4 text-white font-weight-bold mb-2">Training Programs</h1>
                    <p class="text-body-1 text-white mb-0">
                        Science-based workout plans for all fitness levels
                    </p>
                </v-card>

                <!-- Empty state -->
                <v-fade-transition>
                    <div v-if="filteredPlans.length === 0" class="text-center pa-8">
                        <v-icon icon="mdi-dumbbell-off" size="56" color="grey"></v-icon>
                        <div class="mt-4 text-h6">No programs found</div>
                        <div class="text-body-2 text-grey mb-4">
                            Try adjusting your filters or search query
                        </div>
                        <v-btn color="primary" variant="tonal" @click="resetFilters">
                            Reset filters
                        </v-btn>
                    </div>
                </v-fade-transition>

                <!-- Programs List -->
                <div v-if="filteredPlans.length > 0">
                    <!-- Results count -->
                    <div class="text-body-2 text-grey mb-2">
                        {{ filteredPlans.length }} programs found
                    </div>

                    <!-- Program cards -->
                    <v-list class="pa-0 bg-transparent">
                        <template v-for="plan in filteredPlans" :key="plan.id">
                            <v-list-item @click="openPlanDetails(plan)" class="plan-item pa-0 mb-3">
                                <v-card flat class="pa-0 ma-0 rounded-lg">
                                    <div class="d-flex flex-column flex-sm-row">
                                        <!-- Image for plan -->
                                        <div
                                            class="plan-image d-flex align-center justify-center"
                                            :class="{
                                                'bg-grey-lighten-3': !hasBackgroundImage(plan.type),
                                            }"
                                            :style="{
                                                minHeight: '150px',
                                                minWidth: '120px',
                                                backgroundImage: hasBackgroundImage(plan.type)
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
                                                <div class="text-caption text-grey-lighten-1">
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

                                            <div class="d-flex align-center flex-wrap mt-auto pt-2">
                                                <v-chip
                                                    v-for="(goal, i) in plan.goals.slice(0, 2)"
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
            </v-container>
        </v-container>

        <!-- Filters drawer -->
        <v-bottom-sheet v-model="showFilterDrawer" class="filter-sheet">
            <v-card height="90vh">
                <v-card-title class="d-flex align-center py-4 px-4">
                    <span>Filters</span>
                    <v-spacer></v-spacer>
                    <v-btn variant="text" color="primary" @click="resetFilters"> Reset </v-btn>
                    <v-btn variant="text" icon @click="showFilterDrawer = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>

                <v-divider></v-divider>

                <v-card-text class="filter-content">
                    <div class="py-2">
                        <div class="text-subtitle-1 font-weight-bold mb-3">Program Type</div>
                        <v-chip-group
                            v-model="selectedTypes"
                            class="d-flex flex-wrap"
                            multiple
                            column
                        >
                            <v-chip
                                v-for="tab in tabOptions"
                                :key="tab.value"
                                :value="tab.value"
                                filter
                                variant="outlined"
                                class="text-capitalize ma-1"
                            >
                                <v-icon start :icon="tab.icon" size="small"></v-icon>
                                {{ tab.title }}
                            </v-chip>
                        </v-chip-group>
                    </div>

                    <v-divider class="my-3"></v-divider>

                    <div class="py-2">
                        <div class="text-subtitle-1 font-weight-bold mb-3">Level</div>
                        <v-radio-group v-model="selectedLevel" class="filter-radio-group">
                            <v-radio
                                v-for="level in difficultyLevels"
                                :key="level.value"
                                :label="level.title"
                                :value="level.value"
                                class="text-capitalize"
                            ></v-radio>
                        </v-radio-group>
                    </div>

                    <v-divider class="my-3"></v-divider>

                    <div class="py-2">
                        <div class="text-subtitle-1 font-weight-bold mb-3">Duration</div>
                        <v-radio-group v-model="selectedDuration" class="filter-radio-group">
                            <v-radio
                                v-for="duration in durationOptions"
                                :key="duration.value"
                                :label="duration.title"
                                :value="duration.value"
                                class="text-capitalize"
                            ></v-radio>
                        </v-radio-group>
                    </div>

                    <v-divider class="my-3"></v-divider>

                    <div class="py-2">
                        <div class="text-subtitle-1 font-weight-bold mb-3">Location</div>
                        <v-radio-group v-model="selectedLocation" class="filter-radio-group">
                            <v-radio
                                v-for="location in locationOptions"
                                :key="location.value"
                                :label="location.title"
                                :value="location.value"
                                class="text-capitalize"
                            ></v-radio>
                        </v-radio-group>
                    </div>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions class="pa-4">
                    <v-btn block color="primary" size="large" @click="applyFilters">
                        Apply Filters
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-bottom-sheet>

        <!-- Sort menu -->
        <v-dialog v-model="showSortMenu" max-width="300">
            <v-card>
                <v-card-title class="text-subtitle-1 font-weight-bold">
                    Sort Programs
                </v-card-title>
                <v-divider></v-divider>
                <v-list density="comfortable" nav>
                    <v-list-item
                        v-for="option in sortOptions"
                        :key="option.value"
                        :value="option.value"
                        @click="selectSortOption(option.value)"
                    >
                        <template v-slot:prepend>
                            <v-icon color="primary" v-if="sortBy === option.value">
                                mdi-check
                            </v-icon>
                        </template>
                        <v-list-item-title>{{ option.title }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-card>
        </v-dialog>

        <v-btn
            class="custom-plan-fab"
            color="primary"
            icon="mdi-plus"
            size="large"
            elevation="4"
            @click="openCustomPlanCreator"
        ></v-btn>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

import type { DifficultyLevel, TrainingPlan } from "../types/workout-plans";

import CustomWorkoutPlanCreator from "../components/workout-plans/CustomWorkoutPlanCreator.vue";
import PlanDetailsDialog from "../components/workout-plans/PlanDetailsDialog.vue";
import { globalDialog } from "../composables/useDialog";
import { allTrainingPlans } from "../data/training-plans";
import { logger } from "../logger/app-logger";
import { getCustomWorkoutPlans } from "../services/workout-plans";
import { useAuthStore } from "../stores/auth";

const LEVEL_ORDER = {
    advanced: 3,
    beginner: 1,
    intermediate: 2,
} as const;

type WorkoutImageMap = {
    [key in TrainingPlan["type"]]: string;
};

const workoutImages: WorkoutImageMap = {
    cardio: "/workout-images/cardio-workout.jpg",
    hybrid: "/workout-images/circuit-workout.jpg",
    strength: "/workout-images/strength-workout.jpg",
};

const authStore = useAuthStore();

const customPlans = ref<TrainingPlan[]>([]);
const isLoadingCustomPlans = ref(false);
const showFilterDrawer = ref<boolean>(false);
const showSortMenu = ref<boolean>(false);
const searchQuery = ref<string>("");
const selectedLevel = ref<string>("all");
const selectedDuration = ref<string>("all");
const selectedLocation = ref<string>("all");
const selectedTypes = ref<string[]>([]);
const sortBy = ref<string>("name");

type TabOption = {
    icon: string;
    title: string;
    value: string;
};

const tabOptions: TabOption[] = [
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

const locationOptions = [
    { title: "Any Location", value: "all" },
    { title: "Home Workouts", value: "home" },
    { title: "Gym Workouts", value: "gym" },
    { title: "Anywhere", value: "anywhere" },
] as const;

const sortOptions = [
    { title: "Name (A-Z)", value: "name" },
    { title: "Name (Z-A)", value: "-name" },
    { title: "Duration (Shortest first)", value: "duration" },
    { title: "Duration (Longest first)", value: "-duration" },
    { title: "Level (Beginner first)", value: "level" },
    { title: "Level (Advanced first)", value: "-level" },
];

const activeFiltersCount = computed<number>(function () {
    let count = 0;

    if (selectedTypes.value.length > 0) count++;
    if (selectedLevel.value !== "all") count++;
    if (selectedDuration.value !== "all") count++;
    if (selectedLocation.value !== "all") count++;

    return count;
});

const filteredPlans = computed<TrainingPlan[]>(function () {
    let plans: TrainingPlan[] = [...allTrainingPlans, ...customPlans.value];

    if (selectedTypes.value.length > 0) {
        plans = plans.filter((plan) => selectedTypes.value.includes(plan.type));
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

    if (searchQuery.value?.trim()) {
        const query = searchQuery.value.toLowerCase();
        plans = plans.filter(
            (plan) =>
                plan.name.toLowerCase().includes(query) ??
                plan.description.toLowerCase().includes(query) ??
                plan.goals.some((goal) => goal.toLowerCase().includes(query)),
        );
    }

    return sortPlans(plans);
});

function applyFilters(): void {
    showFilterDrawer.value = false;
}

function getCategoryClass(category: TrainingPlan["type"]): string {
    switch (category) {
        case "cardio":
            return "bg-teal-lighten-5 text-teal-darken-3";
        case "hybrid":
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
        case "hybrid":
            return "mdi-timer-outline";
        case "strength":
            return "mdi-weight-lifter";
        default:
            return "mdi-dumbbell";
    }
}

function getWorkoutImageUrl(category: TrainingPlan["type"]): string {
    return workoutImages[category] ?? "";
}

function hasBackgroundImage(type: TrainingPlan["type"]): boolean {
    return Boolean(getWorkoutImageUrl(type));
}

async function loadCustomPlans(): Promise<void> {
    isLoadingCustomPlans.value = true;
    try {
        customPlans.value = await getCustomWorkoutPlans(authStore.nonNullableUser.uid);
    } catch (error) {
        logger.error("Failed to load custom workout plans:", "PageWorkoutPlans", error);
    } finally {
        isLoadingCustomPlans.value = false;
    }
}

function openCustomPlanCreator(): void {
    globalDialog.openDialog(
        CustomWorkoutPlanCreator,
        {
            onSaved() {
                loadCustomPlans();
            },
        },
        {
            fullscreen: true,
            title: "Create Custom Workout Plan",
        },
    );
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
    selectedTypes.value = [];
    selectedLevel.value = "all";
    selectedDuration.value = "all";
    selectedLocation.value = "all";
    searchQuery.value = "";
}

function selectSortOption(option: string): void {
    sortBy.value = option;
    showSortMenu.value = false;
}

function sortPlans(plans: TrainingPlan[]): TrainingPlan[] {
    const result = [...plans];

    switch (sortBy.value) {
        case "-duration":
            return result.sort((a, b) => b.durationWeeks - a.durationWeeks);
        case "-level":
            return result.sort((a, b) => LEVEL_ORDER[b.level] - LEVEL_ORDER[a.level]);
        case "-name":
            return result.sort((a, b) => b.name.localeCompare(a.name));
        case "duration":
            return result.sort((a, b) => a.durationWeeks - b.durationWeeks);
        case "level":
            return result.sort((a, b) => LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level]);
        case "name":
            return result.sort((a, b) => a.name.localeCompare(b.name));
        default:
            return result;
    }
}

onMounted(loadCustomPlans);
</script>

<style scoped>
.workout-plans {
    position: relative;
    min-height: 100vh;
}

.sticky-header {
    position: sticky;
    top: 0;
    z-index: 3;
}

.filter-sheet {
    display: flex;
    flex-direction: column;
}

.filter-content {
    overflow-y: auto;
    flex-grow: 1;
    padding-bottom: 72px;
}

.filter-radio-group {
    display: flex;
    flex-wrap: wrap;
}

.filter-radio-group .v-radio {
    margin-right: 16px;
}

.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.custom-plan-fab {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 5;
}
</style>
