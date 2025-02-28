<template>
    <v-container fluid class="pa-4">
        <h1 class="text-h4 mb-4">Calories & Nutrition</h1>
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
                    <template v-if="getMealByType(mealType)">
                        <MealCard
                            :meal="getMealByType(mealType)!"
                            @delete="confirmDeleteMeal(getMealByType(mealType)!.id)"
                            @add-food="openFoodSearch(mealType)"
                            @add-macros="openManualMacrosDialog(mealType)"
                            @remove-food="(index) => removeFoodFromMeal(mealType, index)"
                        />
                    </template>

                    <!-- If no meal exists for this type yet, show the add meal card -->
                    <template v-else>
                        <v-card class="meal-empty-card" height="100%" elevation="1">
                            <v-card-text
                                class="d-flex flex-column align-center justify-center text-center py-8"
                            >
                                <v-avatar
                                    :icon="getMealIcon(mealType)"
                                    :color="getMealColor(mealType)"
                                    size="56"
                                    class="mb-4"
                                ></v-avatar>
                                <div class="text-h6 text-capitalize mb-1">{{ mealType }}</div>
                                <div class="text-body-2 text-medium-emphasis mb-4">
                                    No foods logged yet
                                </div>
                                <div class="d-flex">
                                    <v-btn
                                        color="primary"
                                        variant="outlined"
                                        rounded
                                        prepend-icon="mdi-food"
                                        @click="openFoodSearch(mealType)"
                                        class="mr-2"
                                    >
                                        Add Food
                                    </v-btn>
                                    <v-btn
                                        color="secondary"
                                        variant="outlined"
                                        rounded
                                        prepend-icon="mdi-calculator"
                                        @click="openManualMacrosDialog(mealType)"
                                    >
                                        Log Macros
                                    </v-btn>
                                </div>
                            </v-card-text>
                        </v-card>
                    </template>
                </v-col>
            </v-row>
        </template>
    </v-container>
</template>

<script setup lang="ts">
import { useAsyncState, useDateFormat, useStorage, whenever } from "@vueuse/core";
import { computed, ref } from "vue";
import { useDate } from "vuetify";

import type { FoodItem } from "../types/food";
import type { Meal } from "../types/health-metrics";

import CaloriesSummary from "../components/calories/CaloriesSummary.vue";
import FoodPortionDialog from "../components/calories/FoodPortionDialog.vue";
import FoodSearch from "../components/calories/FoodSearch.vue";
import ManualMacrosDialog from "../components/calories/ManualMacrosDialog.vue";
import MealCard from "../components/calories/MealCard.vue";
import { useGlobalConfirm } from "../composables/useConfirmDialog";
import { useDialog } from "../composables/useDialog";
import { logger } from "../logger/app-logger";
import {
    addMeal,
    deleteMeal,
    getDailyCalorieSummary,
    getMealsForDay,
    setCalorieGoal,
} from "../services/calories";
import { useAuthStore } from "../stores/auth";
import { useGlobalStore } from "../stores/global";

const authStore = useAuthStore();
const globalStore = useGlobalStore();
const dateAdapter = useDate();
const { openDialog } = useDialog();
const { openConfirm } = useGlobalConfirm();

const today = new Date();
const selectedDate = useStorage("calories-selected-date", today.toISOString().split("T")[0]);
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
            getDailyCalorieSummary(userId, dateString),
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

async function addFoodToMeal(
    food: FoodItem,
    mealType: "breakfast" | "dinner" | "lunch" | "snack",
): Promise<void> {
    try {
        globalStore.setLoading(true);
        const userId = authStore.nonNullableUser.uid;
        const dateString = selectedDate.value;

        const existingMeal = getMealByType(mealType);

        if (existingMeal) {
            const updatedFoods = [...existingMeal.foods, food];
            // Delete old meal and add new one with updated foods
            await deleteMeal(userId, existingMeal.id, dateString);
            await addMeal(userId, mealType, updatedFoods, dateString);
        } else {
            await addMeal(userId, mealType, [food], dateString);
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

    // Don't allow future dates
    if (date > today) {
        return;
    }

    selectedDate.value = date.toISOString().split("T")[0];
}

async function confirmDeleteMeal(mealId: string): Promise<void> {
    const confirmed = await openConfirm({
        message: "Are you sure you want to delete this meal?",
        title: "Delete Meal",
    });

    if (!confirmed) {
        return;
    }

    await removeMeal(mealId);
}

function getMealByType(type: "breakfast" | "dinner" | "lunch" | "snack"): Meal | undefined {
    return meals.value.find((meal) => meal.mealType === type);
}

function getMealColor(mealType: string): string {
    switch (mealType) {
        case "breakfast":
            return "amber-lighten-1";
        case "dinner":
            return "deep-purple-lighten-1";
        case "lunch":
            return "light-green-lighten-1";
        case "snack":
            return "light-blue-lighten-1";
        default:
            return "grey-lighten-1";
    }
}

function getMealIcon(mealType: string): string {
    switch (mealType) {
        case "breakfast":
            return "mdi-coffee";
        case "dinner":
            return "mdi-food-turkey";
        case "lunch":
            return "mdi-food";
        case "snack":
            return "mdi-food-apple";
        default:
            return "mdi-food";
    }
}

function openFoodPortionDialog(
    food: FoodItem,
    mealType: "breakfast" | "dinner" | "lunch" | "snack",
): void {
    openDialog(FoodPortionDialog, {
        componentProps: {
            food,
            mealType,
            onAdd: async (adjustedFood: FoodItem) => {
                await addFoodToMeal(adjustedFood, mealType);
            },
        },
        title: food.name,
    });
}

function openFoodSearch(mealType: "breakfast" | "dinner" | "lunch" | "snack"): void {
    openDialog(FoodSearch, {
        componentProps: {
            limitRecent: 5,
            mealType,
            onSelect: (food: FoodItem) => {
                openFoodPortionDialog(food, mealType);
            },
        },
        title: "Add Food",
    });
}

function openManualMacrosDialog(mealType: "breakfast" | "dinner" | "lunch" | "snack"): void {
    openDialog(ManualMacrosDialog, {
        componentProps: {
            mealType,
            onSave: async (food: FoodItem) => {
                await addFoodToMeal(food, mealType);
            },
        },
    });
}

async function removeFoodFromMeal(
    mealType: "breakfast" | "dinner" | "lunch" | "snack",
    index: number,
): Promise<void> {
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
            await deleteMeal(userId, existingMeal.id, dateString);
        } else {
            // Otherwise update the meal with the remaining foods
            await deleteMeal(userId, existingMeal.id, dateString);
            await addMeal(userId, mealType, updatedFoods, dateString);
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

async function removeMeal(mealId: string): Promise<void> {
    try {
        globalStore.setLoading(true);
        const userId = authStore.nonNullableUser.uid;
        await deleteMeal(userId, mealId, selectedDate.value);
        await refreshData();
        globalStore.notify("Meal deleted successfully");
    } catch (error) {
        logger.error(error, "PageCalories", { mealId });
        globalStore.notifyError("Failed to delete meal");
    } finally {
        globalStore.setLoading(false);
    }
}

async function updateCalorieGoal(goal: number): Promise<void> {
    try {
        const userId = authStore.nonNullableUser.uid;
        await setCalorieGoal(userId, goal, selectedDate.value);
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

<style scoped>
.meal-empty-card {
    border-radius: 8px;
    min-height: 200px;
    transition: all 0.2s ease;
}

.meal-empty-card:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
}
</style>
