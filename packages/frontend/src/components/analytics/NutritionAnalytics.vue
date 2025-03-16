<template>
    <div class="nutrition-analytics">
        <v-row>
            <v-col cols="12" class="d-flex justify-end align-center">
                <v-tooltip location="top" content-class="bg-surface-dark text-body-2">
                    <template v-slot:activator="{ props }">
                        <v-icon v-bind="props" size="small" color="info" class="mr-2">
                            mdi-information-outline
                        </v-icon>
                    </template>
                    Today's data is excluded by default as it's incomplete
                </v-tooltip>

                <v-switch
                    v-model="includeToday"
                    density="compact"
                    color="primary"
                    hide-details
                    label="Include Today"
                ></v-switch>
            </v-col>
        </v-row>

        <v-row class="mb-6">
            <v-col cols="12">
                <div class="text-h6 mb-2 text-center">Calorie Summary</div>
                <v-card elevation="0">
                    <CaloriesTimeChart :nutrition-data="activeNutritionData" />
                </v-card>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12" md="6">
                <div class="text-h6 mb-2 text-center">Macronutrient Breakdown</div>
                <v-card elevation="0">
                    <MacronutrientChart :nutrition-data="activeNutritionData" />

                    <v-card-text>
                        <v-row>
                            <v-col cols="4">
                                <div class="nutrient-stat">
                                    <div class="d-flex align-center">
                                        <v-avatar
                                            color="red-lighten-2"
                                            size="20"
                                            class="mr-2"
                                        ></v-avatar>
                                        <span class="text-caption">Protein</span>
                                    </div>
                                    <div class="text-h6">{{ avgProtein }}g</div>
                                    <div class="text-caption">{{ proteinPercentage }}%</div>
                                </div>
                            </v-col>

                            <v-col cols="4">
                                <div class="nutrient-stat">
                                    <div class="d-flex align-center">
                                        <v-avatar
                                            color="blue-lighten-2"
                                            size="20"
                                            class="mr-2"
                                        ></v-avatar>
                                        <span class="text-caption">Carbs</span>
                                    </div>
                                    <div class="text-h6">{{ avgCarbs }}g</div>
                                    <div class="text-caption">{{ carbsPercentage }}%</div>
                                </div>
                            </v-col>

                            <v-col cols="4">
                                <div class="nutrient-stat">
                                    <div class="d-flex align-center">
                                        <v-avatar
                                            color="yellow-lighten-2"
                                            size="20"
                                            class="mr-2"
                                        ></v-avatar>
                                        <span class="text-caption">Fat</span>
                                    </div>
                                    <div class="text-h6">{{ avgFat }}g</div>
                                    <div class="text-caption">{{ fatPercentage }}%</div>
                                </div>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" md="6">
                <div class="text-h6 mb-2 text-center">Meal Distribution</div>
                <v-card elevation="0">
                    <MealDistributionChart :nutrition-data="activeNutritionData" />
                </v-card>
            </v-col>
        </v-row>

        <v-row class="mt-4">
            <v-col cols="12">
                <div class="text-h6 mb-2 text-center">Goal Achievement</div>
                <v-card elevation="0">
                    <CalorieGoalChart :nutrition-data="activeNutritionData" />
                </v-card>
            </v-col>
        </v-row>

        <!-- Most Frequent Foods section -->
        <v-row class="mt-4">
            <v-col cols="12">
                <div class="text-h6 mb-2 text-center">Most Frequent Foods</div>
                <v-card elevation="0" ref="foodSectionRef">
                    <v-list>
                        <!-- Loading Skeleton State -->
                        <template v-if="isLoadingMeals || (isFoodSectionVisible && !mealsLoaded)">
                            <v-list-item v-for="i in 5" :key="i">
                                <template v-slot:prepend>
                                    <v-skeleton-loader type="avatar" />
                                </template>

                                <v-list-item-title>
                                    <v-skeleton-loader type="text" />
                                </v-list-item-title>

                                <v-list-item-subtitle>
                                    <v-skeleton-loader type="text" width="120" />
                                </v-list-item-subtitle>

                                <template v-slot:append>
                                    <v-skeleton-loader type="chip" width="70" />
                                </template>
                            </v-list-item>
                        </template>

                        <!-- Content State - Only render when visible and loaded -->
                        <template v-else-if="isFoodSectionVisible && frequentFoods.length > 0">
                            <v-list-item v-for="(food, index) in frequentFoods" :key="index">
                                <template v-slot:prepend>
                                    <v-avatar color="primary" size="40" class="mr-3">
                                        <span class="text-caption text-white font-weight-bold">{{
                                            index + 1
                                        }}</span>
                                    </v-avatar>
                                </template>

                                <v-list-item-title>{{ food.name }}</v-list-item-title>
                                <v-list-item-subtitle>
                                    Logged {{ food.count }} times
                                </v-list-item-subtitle>

                                <template v-slot:append>
                                    <v-chip size="small" color="primary" variant="tonal">
                                        {{ food.calories || "?" }} kcal
                                    </v-chip>
                                </template>
                            </v-list-item>
                        </template>

                        <!-- Empty State -->
                        <v-list-item
                            v-else-if="
                                isFoodSectionVisible && mealsLoaded && frequentFoods.length === 0
                            "
                        >
                            <v-list-item-title>No food data available</v-list-item-title>
                            <v-list-item-subtitle>
                                Log more meals to see your most frequent foods
                            </v-list-item-subtitle>
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script setup lang="ts">
import { useIntersectionObserver } from "@vueuse/core";
import { computed, ref, watch } from "vue";

import type { DateRangeOption } from "../../types/analytics";
import type { HealthMetrics, Meal } from "../../types/health-metrics";

import { isToday } from "../../helpers/date-utils";
import { logger } from "../../logger/app-logger";
import { calculateNutritionMetrics } from "../../services/analytics";
import { getMealsForDay } from "../../services/calories";
import { useAuthStore } from "../../stores/auth";
import CalorieGoalChart from "./charts/CalorieGoalChart.vue";
import CaloriesTimeChart from "./charts/CaloriesTimeChart.vue";
import MacronutrientChart from "./charts/MacronutrientChart.vue";
import MealDistributionChart from "./charts/MealDistributionChart.vue";

const props = defineProps<{
    dateRange: DateRangeOption;
    nutritionData: HealthMetrics[];
}>();

const authStore = useAuthStore();
const includeToday = ref(false);

const activeNutritionData = computed(() => {
    if (includeToday.value) {
        return props.nutritionData;
    }
    return props.nutritionData.filter((day) => !isToday(day.date));
});

const nutritionMetrics = computed(() => calculateNutritionMetrics(activeNutritionData.value));

const { avgCarbs, avgFat, avgProtein } = nutritionMetrics.value;

const macroSum = avgProtein * 4 + avgCarbs * 4 + avgFat * 9;
const proteinPercentage = computed(() =>
    macroSum > 0 ? Math.round(((avgProtein * 4) / macroSum) * 100) : 0,
);
const carbsPercentage = computed(() =>
    macroSum > 0 ? Math.round(((avgCarbs * 4) / macroSum) * 100) : 0,
);
const fatPercentage = computed(() =>
    macroSum > 0 ? Math.round(((avgFat * 9) / macroSum) * 100) : 0,
);

const mealsData = ref<Meal[]>([]);
const isLoadingMeals = ref(false);
const mealsLoaded = ref(false);
const foodSectionRef = ref<HTMLElement | null>(null);
const isFoodSectionVisible = ref(false);

useIntersectionObserver(
    foodSectionRef,
    ([{ isIntersecting }]) => {
        if (isIntersecting && !mealsLoaded.value) {
            isFoodSectionVisible.value = true;
            fetchMealsData();
        }
    },
    // Start loading when 10% of the element is visible
    { threshold: 0.1 },
);

async function fetchMealsData(): Promise<void> {
    if (props.nutritionData.length === 0 || mealsLoaded.value) return;

    isLoadingMeals.value = true;
    try {
        const dateStrings = [...new Set(props.nutritionData.map((day) => day.dateString))];

        const mealsPromises = dateStrings.map((dateString) =>
            getMealsForDay(authStore.nonNullableUser.uid, dateString),
        );
        const allMeals = await Promise.all(mealsPromises);
        mealsData.value = allMeals.flat();
        mealsLoaded.value = true;
    } catch (error) {
        logger.error("Failed to fetch meals data:", "NutritionAnalytics", error);
    } finally {
        isLoadingMeals.value = false;
    }
}

watch(
    () => props.dateRange,
    () => {
        if (isFoodSectionVisible.value) {
            mealsLoaded.value = false;
            fetchMealsData();
        }
    },
);

const frequentFoods = computed(() => {
    if (mealsData.value.length === 0) return [];

    const foodCounts: Record<
        string,
        {
            calories: number;
            count: number;
            name: string;
        }
    > = {};

    for (const meal of mealsData.value) {
        for (const food of meal.foods) {
            const foodId = food.id;

            if (!foodCounts[foodId]) {
                foodCounts[foodId] = {
                    calories: food.calories,
                    count: 0,
                    name: food.name,
                };
            }

            foodCounts[foodId].count++;
        }
    }

    return Object.values(foodCounts)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
});
</script>

<style scoped>
.nutrition-analytics {
    padding-bottom: 20px;
}

.nutrient-stat {
    text-align: center;
    padding: 8px;
    border-radius: 8px;
    transition: all 0.2s ease;
}

.nutrient-stat:hover {
    background-color: rgba(0, 0, 0, 0.05);
}
</style>
