<template>
    <v-container class="pa-2 mx-auto">
        <v-card class="px-4 py-4 rounded-lg mb-1">
            <div class="d-flex align-center">
                <h1 class="text-h5 text-white font-weight-bold">Calories & Nutrition</h1>
            </div>
        </v-card>
        <div class="mb-1">
            <v-btn
                variant="text"
                density="comfortable"
                color="primary"
                prepend-icon="mdi-food-apple-outline"
                class="text-none"
                to="/custom-food"
                size="small"
            >
                My Food
            </v-btn>

            <v-btn
                variant="text"
                density="comfortable"
                color="primary"
                prepend-icon="mdi-food-apple-outline"
                class="text-none"
                to="/recent-food"
                size="small"
            >
                Recent Food
            </v-btn>

            <v-btn
                to="/recipes"
                prepend-icon="mdi-silverware-fork-knife"
                variant="text"
                color="primary"
                size="small"
                class="text-none"
                density="comfortable"
            >
                Recipes
            </v-btn>
        </div>

        <!-- Date Selector -->
        <v-card class="mb-4" flat>
            <v-card-text class="d-flex justify-space-between align-center pa-2">
                <v-btn icon @click="changeDate(-1)">
                    <v-icon>mdi-chevron-left</v-icon>
                </v-btn>

                <div class="d-flex align-center">
                    <v-btn variant="text" @click="showDatePicker = true" class="text-h6">
                        {{ formattedDate }}
                    </v-btn>

                    <v-dialog v-model="showDatePicker" max-width="300">
                        <v-date-picker
                            v-model="selectedDate"
                            @update:model-value="showDatePicker = false"
                        ></v-date-picker>
                    </v-dialog>
                </div>

                <v-btn icon @click="changeDate(1)" :disabled="isToday">
                    <v-icon>mdi-chevron-right</v-icon>
                </v-btn>
            </v-card-text>
        </v-card>

        <!-- Loading State -->
        <template v-if="isLoading">
            <!-- Calories Summary Skeleton -->
            <v-skeleton-loader type="heading" class="mb-4" />
            <!-- Meals Skeleton mimicking the meal cards structure -->
            <v-row>
                <v-col v-for="n in 4" :key="n" cols="12" sm="6" lg="3">
                    <v-skeleton-loader type="card" class="mb-4" />
                </v-col>
            </v-row>
        </template>

        <!-- Loaded Content -->
        <template v-else>
            <!-- Calories Summary Section -->
            <CaloriesSummary :summary="calorieSummary" @update:goal="updateCalorieGoal" />
            <!-- Meals Section -->
            <v-row>
                <v-col v-for="mealType in mealTypes" :key="mealType" cols="12" sm="6" lg="3">
                    <MealCard
                        :meal="getMealByType(mealType)"
                        :meal-type="mealType"
                        @search-food="openFoodSearch(mealType)"
                        @add-macros="openManualMacrosDialog(mealType)"
                        @scan-label="openNutritionScanner(mealType)"
                        @describe-food="openFoodPromptDialog(mealType)"
                        @remove-food="(index) => removeFoodFromMeal(mealType, index)"
                    />
                </v-col>
            </v-row>
        </template>
    </v-container>
</template>

<script setup lang="ts">
import { useAsyncState, useDateFormat, whenever } from "@vueuse/core";
import { computed, ref } from "vue";
import { useDate } from "vuetify";

import type { FoodItem } from "../types/food";
import type { Meal } from "../types/health-metrics";

import CaloriesSummary from "../components/calories/CaloriesSummary.vue";
import FoodAIResultDialog from "../components/calories/FoodAIResultDialog.vue";
import FoodPortionDialog from "../components/calories/FoodPortionDialog.vue";
import FoodPromptDialog from "../components/calories/FoodPromptDialog.vue";
import FoodSearch from "../components/calories/FoodSearch.vue";
import ManualMacrosDialog from "../components/calories/ManualMacrosDialog.vue";
import MealCard from "../components/calories/MealCard.vue";
import NutritionScanner from "../components/calories/NutritionScanner.vue";
import { globalDialog } from "../composables/useDialog";
import { formatISODate } from "../helpers/date-utils";
import { logger } from "../logger/app-logger";
import {
    addMeal,
    deleteMeal,
    getDailyCalorieSummary,
    getMealsForDay,
    setCalorieGoal,
} from "../services/calories";
import { createCustomFood } from "../services/custom-foods";
import { setDefaultCalorieGoal } from "../services/user";
import { useAuthStore } from "../stores/auth";
import { useGlobalStore } from "../stores/global";

const authStore = useAuthStore();
const globalStore = useGlobalStore();
const dateAdapter = useDate();

const today = new Date();
const selectedDate = ref(today.toISOString().split("T")[0]);
const showDatePicker = ref(false);

const mealTypes = ["breakfast", "lunch", "dinner", "snack"] as const;

const defaultSummary = {
    byMeal: { breakfast: 0, dinner: 0, lunch: 0, snack: 0 },
    carbs: 0,
    fat: 0,
    goal: 2000,
    protein: 0,
    remaining: 2000,
    total: 0,
};

const {
    execute: refreshData,
    isLoading,
    state: caloriesData,
} = useAsyncState(
    async () => {
        const userId = authStore.nonNullableUser.uid;
        const dateString = selectedDate.value;

        const [summary, dayMeals] = await Promise.all([
            getDailyCalorieSummary(userId, authStore.defaultCalorieGoal, dateString),
            getMealsForDay(userId, dateString),
        ]);

        return { meals: dayMeals, summary };
    },
    { meals: [], summary: defaultSummary },
    {
        immediate: false,
        onError: (error) => {
            logger.error(error, "PageCalories");
            globalStore.notifyError("Failed to load nutrition data");
        },
    },
);

const calorieSummary = computed(() => caloriesData.value.summary);
const meals = computed(() => caloriesData.value.meals);

const formattedDate = computed(() => {
    const date = new Date(selectedDate.value);

    if (dateAdapter.isSameDay(date, today)) {
        return "Today";
    }

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (dateAdapter.isSameDay(date, yesterday)) {
        return "Yesterday";
    }

    return useDateFormat(date, "MMMM D, YYYY").value;
});

const isToday = computed(() => {
    return dateAdapter.isSameDay(new Date(selectedDate.value), today);
});

async function addFoodToMeal(food: FoodItem, mealType: Meal["mealType"]): Promise<void> {
    try {
        globalStore.setLoading(true);
        const userId = authStore.nonNullableUser.uid;
        const dateString = selectedDate.value;

        const existingMeal = getMealByType(mealType);

        if (existingMeal) {
            const updatedFoods = [...existingMeal.foods, food];
            // Delete old meal and add new one with updated foods
            await deleteMeal(userId, existingMeal.id, dateString, authStore.defaultCalorieGoal);
            await addMeal(userId, mealType, updatedFoods, authStore.defaultCalorieGoal, dateString);
        } else {
            await addMeal(userId, mealType, [food], authStore.defaultCalorieGoal, dateString);
        }

        await refreshData();
        globalStore.notify("Food added successfully");
    } catch (error) {
        logger.error(error, "PageCalories", { mealType });
        globalStore.notifyError("Failed to add food to meal");
    } finally {
        globalStore.setLoading(false);
    }
}

function changeDate(dayOffset: number): void {
    const date = new Date(selectedDate.value);
    date.setDate(date.getDate() + dayOffset);

    if (date > today) {
        return;
    }

    selectedDate.value = formatISODate(date);
}

function getMealByType(type: Meal["mealType"]): Meal | undefined {
    return meals.value.find((meal) => meal.mealType === type);
}

function openFoodAIResultDialog(food: FoodItem, mealType: Meal["mealType"]): void {
    globalDialog.openDialog(
        FoodAIResultDialog,
        {
            food,
            mealType,
            onAdd(adjustedFood: FoodItem) {
                addFoodToMeal(adjustedFood, mealType);
            },
        },
        {
            title: "AI Food Analysis",
        },
    );
}

function openFoodPortionDialog(food: FoodItem, mealType: Meal["mealType"]): void {
    globalDialog.openDialog(
        FoodPortionDialog,
        {
            food,
            mealType,
            onAdd(adjustedFood: FoodItem) {
                addFoodToMeal(adjustedFood, mealType);
            },
        },
        {
            title: food.name,
        },
    );
}

function openFoodPromptDialog(mealType: Meal["mealType"]): void {
    const dialogId = globalDialog.openDialog(
        FoodPromptDialog,
        {
            mealType,
            onFoodAnalyzed(food: FoodItem) {
                globalDialog.closeDialog(dialogId);
                openFoodAIResultDialog(food, mealType);
            },
        },
        {
            title: "Describe Your Food",
        },
    );
}

function openFoodSearch(mealType: Meal["mealType"]): void {
    globalDialog.openDialog(
        FoodSearch,
        {
            mealType,
            onSelect: (food: FoodItem) => {
                openFoodPortionDialog(food, mealType);
            },
        },
        {
            title: "Add Food",
        },
    );
}

function openManualMacrosDialog(mealType: Meal["mealType"]): void {
    globalDialog.openDialog(ManualMacrosDialog, {
        mealType,
        onSave(food: FoodItem) {
            return addFoodToMeal(food, mealType);
        },
    });
}

function openNutritionScanner(mealType: Meal["mealType"]): void {
    const dialogId = globalDialog.openDialog(
        NutritionScanner,
        {
            mealType,
            async onCustomFoodSaved(food: FoodItem) {
                try {
                    const userId = authStore.nonNullableUser.uid;
                    await createCustomFood(userId, food);
                    globalStore.notify(`"${food.name}" saved to your custom foods`);
                } catch (error) {
                    logger.error(error, "PageCalories", { food });
                    globalStore.notifyError("Failed to save custom food");
                }
            },
            onFoodAdded(food: FoodItem) {
                globalDialog.closeDialog(dialogId);
                openFoodPortionDialog(food, mealType);
            },
        },
        {
            title: "Scan Nutrition Label",
        },
    );
}

async function removeFoodFromMeal(mealType: Meal["mealType"], index: number): Promise<void> {
    const confirmed = await globalDialog.confirm({
        message: "Are you sure you want to delete this meal?",
        title: "Delete Meal",
    });

    if (!confirmed) {
        return;
    }

    try {
        globalStore.setLoading(true);
        const userId = authStore.nonNullableUser.uid;
        const dateString = selectedDate.value;

        const existingMeal = getMealByType(mealType);
        if (!existingMeal) return;

        // Create a new foods array without the removed item
        const updatedFoods = [...existingMeal.foods];
        updatedFoods.splice(index, 1);

        // If no foods left delete the meal
        if (updatedFoods.length === 0) {
            await deleteMeal(userId, existingMeal.id, dateString, authStore.defaultCalorieGoal);
        } else {
            // Otherwise update the meal with the remaining foods
            await deleteMeal(userId, existingMeal.id, dateString, authStore.defaultCalorieGoal);
            await addMeal(userId, mealType, updatedFoods, authStore.defaultCalorieGoal, dateString);
        }

        await refreshData();
        globalStore.notify("Food removed");
    } catch (error) {
        logger.error(error, "PageCalories", { index, mealType });
        globalStore.notifyError("Failed to remove food");
    } finally {
        globalStore.setLoading(false);
    }
}

async function updateCalorieGoal(goal: number, setAsDefault: boolean): Promise<void> {
    try {
        const userId = authStore.nonNullableUser.uid;
        await setCalorieGoal(userId, goal, authStore.defaultCalorieGoal, selectedDate.value);
        if (setAsDefault) {
            await setDefaultCalorieGoal(userId, goal);
        }
        await refreshData();
        globalStore.notify("Calorie goal updated successfully");
    } catch (error) {
        logger.error(error, "PageCalories", { goal });
        globalStore.notifyError("Failed to update calorie goal");
    }
}

whenever(
    () => selectedDate.value,
    () => refreshData(),
    { immediate: true },
);
</script>
