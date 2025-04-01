import { defineQuery, useMutation, useQuery, useQueryCache } from "@pinia/colada";
import { computed, ref } from "vue";

import type { FoodItem } from "../types/food";
import type { Meal } from "../types/health-metrics";

import { logger } from "../logger/app-logger";
import {
    addMeal,
    deleteMeal,
    getDailyCalorieSummary,
    getMealsForDay,
    setCalorieGoal,
} from "../services/calories";
import { createCustomFood } from "../services/custom-foods";
import { addRecentFood } from "../services/recent-food-db";
import { setDefaultCalorieGoal } from "../services/user";
import { useAuthStore } from "../stores/auth";
import { useGlobalStore } from "../stores/global";

function getCaloriesQueryKey(userId: string, date: string): string[] {
    return ["user", userId, "calories", date];
}

export const useDailyCaloriesQuery = defineQuery(() => {
    const authStore = useAuthStore();
    const userId = computed(() => authStore.nonNullableUser.uid);
    const defaultCalorieGoal = authStore.defaultCalorieGoal;
    const date = ref("");

    const caloriesQuery = useQuery({
        enabled() {
            return Boolean(userId.value && date.value);
        },
        key() {
            return getCaloriesQueryKey(userId.value, date.value);
        },
        async query() {
            try {
                const [summary, dayMeals] = await Promise.all([
                    getDailyCalorieSummary(userId.value, defaultCalorieGoal, date.value),
                    getMealsForDay(userId.value, date.value),
                ]);

                return { meals: dayMeals, summary };
            } catch (error) {
                logger.error(error, "useDailyCaloriesQuery", { date, userId });
                throw error;
            }
        },
    });

    return {
        ...caloriesQuery,
        calorieSummary: computed(function () {
            if (!caloriesQuery.data.value) {
                return {
                    byMeal: { breakfast: 0, dinner: 0, lunch: 0, snack: 0 },
                    carbs: 0,
                    fat: 0,
                    goal: defaultCalorieGoal,
                    protein: 0,
                    remaining: defaultCalorieGoal,
                    sugars: 0,
                    total: 0,
                };
            }

            const sugars = calculateTotalSugars(caloriesQuery.data.value.meals);
            const fiber = calculateTotalFiber(caloriesQuery.data.value.meals);
            const saturatedFat = calculateTotalSaturatedFat(caloriesQuery.data.value.meals);
            return {
                ...caloriesQuery.data.value.summary,
                fiber,
                saturatedFat,
                sugars,
            };
        }),
        date,
        getMealByType(type: Meal["mealType"]) {
            return caloriesQuery.data.value?.meals.find((meal) => meal.mealType === type);
        },
    };
});

export function useCalorieMutations(date: string) {
    const queryCache = useQueryCache();
    const authStore = useAuthStore();
    const globalStore = useGlobalStore();

    const userId = authStore.nonNullableUser.uid;
    const defaultCalorieGoal = authStore.defaultCalorieGoal;
    const queryKey = getCaloriesQueryKey(userId, date);

    const addFoodToMealMutation = useMutation({
        async mutation(params: {
            food: FoodItem;
            mealType: Meal["mealType"];
            originalFood?: FoodItem | undefined;
        }) {
            try {
                globalStore.setLoading(true);
                const { food, mealType, originalFood } = params;
                const cachedData = queryCache.getQueryData<{ meals: Meal[] }>(queryKey);
                const meals = cachedData?.meals ?? [];
                const existingMeal = meals.find((meal) => meal.mealType === mealType);

                if (existingMeal) {
                    const updatedFoods = [...existingMeal.foods, food];
                    await deleteMeal(userId, existingMeal.id, date, defaultCalorieGoal);
                    await addMeal(userId, mealType, updatedFoods, defaultCalorieGoal, date);
                } else {
                    await addMeal(userId, mealType, [food], defaultCalorieGoal, date);
                }

                if (originalFood) {
                    await addRecentFood(userId, originalFood);
                }
            } finally {
                globalStore.setLoading(false);
            }
        },
        onError(error, variables) {
            logger.error(error, "addFoodToMealMutation", { mealType: variables.mealType });
            globalStore.notifyError("Failed to add food to meal");
        },
        async onSuccess() {
            await queryCache.invalidateQueries({ key: queryKey });
            globalStore.notify("Food added successfully");
        },
    });

    const removeFoodFromMealMutation = useMutation({
        async mutation(params: { index: number; mealType: Meal["mealType"] }) {
            try {
                globalStore.setLoading(true);
                const { index, mealType } = params;
                const cachedData = queryCache.getQueryData<{ meals: Meal[] }>(queryKey);
                const meals = cachedData?.meals ?? [];
                const existingMeal = meals.find((meal) => meal.mealType === mealType);
                if (!existingMeal) return;

                const updatedFoods = [...existingMeal.foods];
                updatedFoods.splice(index, 1);

                // If no foods left, delete meal entirely
                if (updatedFoods.length === 0) {
                    await deleteMeal(userId, existingMeal.id, date, defaultCalorieGoal);
                } else {
                    await deleteMeal(userId, existingMeal.id, date, defaultCalorieGoal);
                    await addMeal(userId, mealType, updatedFoods, defaultCalorieGoal, date);
                }
            } finally {
                globalStore.setLoading(false);
            }
        },
        onError(error, variables) {
            logger.error(error, "removeFoodFromMealMutation", {
                index: variables.index,
                mealType: variables.mealType,
            });
            globalStore.notifyError("Failed to remove food");
        },
        async onSuccess() {
            await queryCache.invalidateQueries({ key: queryKey });
            globalStore.notify("Food removed");
        },
    });

    const editFoodInMealMutation = useMutation({
        async mutation(params: {
            adjustedFood: FoodItem;
            index: number;
            mealType: Meal["mealType"];
        }) {
            try {
                globalStore.setLoading(true);
                const { adjustedFood, index, mealType } = params;

                const cachedData = queryCache.getQueryData<{ meals: Meal[] }>(queryKey);
                const meals = cachedData?.meals ?? [];

                const existingMeal = meals.find((meal) => meal.mealType === mealType);
                if (!existingMeal) return;

                const updatedFoods = [...existingMeal.foods];
                updatedFoods[index] = adjustedFood;

                await deleteMeal(userId, existingMeal.id, date, defaultCalorieGoal);
                await addMeal(userId, mealType, updatedFoods, defaultCalorieGoal, date);
            } finally {
                globalStore.setLoading(false);
            }
        },
        onError(error, variables) {
            logger.error(error, "editFoodInMealMutation", {
                index: variables.index,
                mealType: variables.mealType,
            });
            globalStore.notifyError("Failed to update food");
        },
        async onSuccess() {
            globalStore.notify("Food updated successfully");
            await queryCache.invalidateQueries({ key: queryKey });
        },
    });

    const updateCalorieGoalMutation = useMutation({
        async mutation(params: { goal: number; setAsDefault: boolean }) {
            const { goal, setAsDefault } = params;
            await setCalorieGoal(userId, goal, defaultCalorieGoal, date);
            if (setAsDefault) {
                await setDefaultCalorieGoal(userId, goal);
            }
        },
        onError(error) {
            globalStore.notifyError("Failed to update calorie goal");
            logger.error(error, "updateCalorieGoalMutation");
        },
        async onSuccess() {
            globalStore.notify("Calorie goal updated successfully");
            await queryCache.invalidateQueries({ key: queryKey });
        },
    });

    const saveCustomFoodMutation = useMutation({
        mutation(params: { food: FoodItem }) {
            return createCustomFood(userId, params.food);
        },
        onError(error, food) {
            logger.error(error, "saveCustomFoodMutation", { food });
            globalStore.notifyError("Failed to save custom food");
        },
        onSuccess(_data, vars) {
            globalStore.notify(`"${vars.food.name}" saved to your custom foods`);
        },
    });

    return {
        addFoodToMealMutation,
        editFoodInMealMutation,
        removeFoodFromMealMutation,
        saveCustomFoodMutation,
        updateCalorieGoalMutation,
    };
}

function calculateTotalFiber(meals: Meal[]): number {
    if (!meals || meals.length === 0) return 0;

    let fiberTotal = 0;
    for (const meal of meals) {
        for (const food of meal.foods) {
            const fiber = Number(food.fiber);
            if (!Number.isNaN(fiber)) {
                fiberTotal += fiber;
            }
        }
    }
    return fiberTotal;
}

function calculateTotalSaturatedFat(meals: Meal[]): number {
    if (!meals || meals.length === 0) return 0;

    let saturatedFatTotal = 0;
    for (const meal of meals) {
        for (const food of meal.foods) {
            const fat = Number(food.saturatedFat);
            if (!Number.isNaN(fat)) {
                saturatedFatTotal += fat;
            }
        }
    }
    return saturatedFatTotal;
}

function calculateTotalSugars(meals: Meal[]): number {
    if (!meals || meals.length === 0) return 0;

    let sugarsTotal = 0;
    for (const meal of meals) {
        for (const food of meal.foods) {
            const sugars = Number(food.sugars);
            if (!Number.isNaN(sugars)) {
                sugarsTotal += sugars;
            }
        }
    }
    return sugarsTotal;
}
