<script setup lang="ts">
import { useDateFormat } from "@vueuse/core";
import { computed, ref, watch } from "vue";
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
import RetryFetcher from "../components/ui/RetryFetcher.vue";
import { globalDialog } from "../composables/useDialog";
import { dateToIsoString, formatISODate } from "../helpers/date-utils";
import { useCalorieMutations, useDailyCaloriesQuery } from "../queries/calories-queries";

const dateAdapter = useDate();
const today = new Date();
const selectedDate = ref(dateToIsoString(today));
const showDatePicker = ref(false);
const mealTypes = ["breakfast", "lunch", "dinner", "snack"] as const;
const caloriesQuery = useDailyCaloriesQuery();
const mutations = useCalorieMutations(selectedDate.value);

caloriesQuery.date.value = selectedDate.value;

watch(selectedDate, function (newDate) {
    caloriesQuery.date.value = newDate;
});

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

function addFoodToMeal(food: FoodItem, mealType: Meal["mealType"], originalFood?: FoodItem): void {
    mutations.addFoodToMealMutation.mutate({
        food,
        mealType,
        originalFood,
    });
}

function changeDate(dayOffset: number): void {
    const date = new Date(selectedDate.value);
    date.setDate(date.getDate() + dayOffset);

    if (date > today) {
        return;
    }

    selectedDate.value = formatISODate(date);
}

function editFoodInMeal(mealType: Meal["mealType"], index: number, adjustedFood: FoodItem): void {
    mutations.editFoodInMealMutation.mutate({
        adjustedFood,
        index,
        mealType,
    });
}

function onDateChangeFromDatePicker(newDate: string): void {
    showDatePicker.value = false;
    selectedDate.value = formatISODate(new Date(newDate));
}

function openEditFoodDialog(food: FoodItem, index: number, mealType: Meal["mealType"]): void {
    globalDialog.openDialog(
        FoodPortionDialog,
        {
            food,
            isEditing: true,
            mealType,
            onAdd(adjustedFood: FoodItem) {
                editFoodInMeal(mealType, index, adjustedFood);
            },
        },
        {
            title: `Edit ${food.name}`,
        },
    );
}

function openFoodAIResultDialog(food: FoodItem, mealType: Meal["mealType"]): void {
    globalDialog.openDialog(
        FoodAIResultDialog,
        {
            food,
            mealType,
            onAdd(adjustedFood: FoodItem, originalFood: FoodItem) {
                addFoodToMeal(adjustedFood, mealType, originalFood);
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
            onAdd(adjustedFood: FoodItem, originalFood: FoodItem) {
                addFoodToMeal(adjustedFood, mealType, originalFood);
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
            onSelect(food: FoodItem) {
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
            onCustomFoodSaved(food: FoodItem) {
                mutations.saveCustomFoodMutation.mutate({ food });
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

function refreshData(): void {
    caloriesQuery.refresh();
}

async function removeFoodFromMeal(mealType: Meal["mealType"], index: number): Promise<void> {
    const confirmed = await globalDialog.confirm({
        message: "Are you sure you want to delete this meal?",
        title: "Delete Meal",
    });

    if (!confirmed) {
        return;
    }

    mutations.removeFoodFromMealMutation.mutate({
        index,
        mealType,
    });
}

function updateCalorieGoal(goal: number, setAsDefault: boolean): void {
    mutations.updateCalorieGoalMutation.mutate({
        goal,
        setAsDefault,
    });
}
</script>

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
                            :model-value="selectedDate"
                            @update:model-value="onDateChangeFromDatePicker"
                        ></v-date-picker>
                    </v-dialog>
                </div>

                <v-btn icon @click="changeDate(1)" :disabled="isToday">
                    <v-icon>mdi-chevron-right</v-icon>
                </v-btn>
            </v-card-text>
        </v-card>

        <!-- Loading State -->
        <template v-if="caloriesQuery.asyncStatus.value === 'loading'">
            <!-- Calories Summary Skeleton -->
            <v-skeleton-loader type="heading" class="mb-4" />
            <!-- Meals Skeleton mimicking the meal cards structure -->
            <v-row>
                <v-col v-for="n in 4" :key="n" cols="12" sm="6" lg="3">
                    <v-skeleton-loader type="card" class="mb-4" />
                </v-col>
            </v-row>
        </template>

        <!-- Error State -->
        <template v-else-if="caloriesQuery.error.value">
            <RetryFetcher
                :fetcher="() => refreshData"
                title="Failed to load nutrition data"
                message="We couldn't load your nutrition data. Please check your connection and try again."
                height="60vh"
                icon="mdi-food-off"
            />
        </template>

        <!-- Loaded Content -->
        <template v-else>
            <!-- Calories Summary Section -->
            <CaloriesSummary
                :summary="caloriesQuery.calorieSummary.value"
                @update:goal="updateCalorieGoal"
            />
            <!-- Meals Section -->
            <v-row>
                <v-col v-for="mealType in mealTypes" :key="mealType" cols="12" sm="6" lg="3">
                    <MealCard
                        :meal="caloriesQuery.getMealByType(mealType)"
                        :meal-type="mealType"
                        @search-food="openFoodSearch(mealType)"
                        @add-macros="openManualMacrosDialog(mealType)"
                        @scan-label="openNutritionScanner(mealType)"
                        @describe-food="openFoodPromptDialog(mealType)"
                        @remove-food="(index) => removeFoodFromMeal(mealType, index)"
                        @edit-food="(food, index) => openEditFoodDialog(food, index, mealType)"
                    />
                </v-col>
            </v-row>
        </template>
    </v-container>
</template>
