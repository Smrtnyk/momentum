import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    Timestamp,
    where,
} from "firebase/firestore";

import type { FoodItem } from "../types/food";
import type { Meal } from "../types/health-metrics";

import { firestore } from "../firebase";
import { logger } from "../logger/app-logger";
import { updateHealthMetrics } from "./health-metrics";
import { addRecentFood } from "./recent-food-db";

export async function addMeal(
    userId: string,
    mealType: "breakfast" | "dinner" | "lunch" | "snack",
    foods: FoodItem[],
    defaultCalorieGoal: number,
    dateString: string,
): Promise<string> {
    try {
        const totalCalories = foods.reduce((sum, food) => sum + food.calories, 0);
        const protein = foods.reduce((sum, food) => sum + food.protein, 0);
        const carbs = foods.reduce((sum, food) => sum + food.carbs, 0);
        const fat = foods.reduce((sum, food) => sum + food.fat, 0);

        const mealsRef = collection(firestore, "users", userId, "meals");
        const mealData: Omit<Meal, "id"> = {
            dateString,
            foods,
            macros: { carbs, fat, protein },
            mealType,
            timestamp: Timestamp.now(),
            totalCalories,
        };

        const mealDocRef = await addDoc(mealsRef, mealData);
        await updateDailyCalorieTotals(userId, dateString, defaultCalorieGoal);

        const addFoodPromises = foods.map(function (food) {
            return addRecentFood(userId, food);
        });
        await Promise.any(addFoodPromises);

        return mealDocRef.id;
    } catch (error) {
        logger.error(error, "CaloriesService", { foods, mealType, userId });
        throw new Error("Failed to add meal");
    }
}

export async function deleteMeal(
    userId: string,
    mealId: string,
    dateString: string,
    defaultCalorieGoal: number,
): Promise<void> {
    try {
        const mealRef = doc(firestore, "users", userId, "meals", mealId);
        await deleteDoc(mealRef);
        await updateDailyCalorieTotals(userId, dateString, defaultCalorieGoal);
    } catch (error) {
        logger.error(error, "CaloriesService", { mealId, userId });
        throw new Error("Failed to delete meal");
    }
}

export async function getDailyCalorieSummary(
    userId: string,
    defaultCalorieGoal: number,
    dateString: string,
): Promise<{
    byMeal: { breakfast: number; dinner: number; lunch: number; snack: number };
    carbs: number;
    fat: number;
    goal: number;
    protein: number;
    remaining: number;
    total: number;
}> {
    try {
        const metricsRef = doc(firestore, "users", userId, "health_metrics", dateString);
        const docSnap = await getDoc(metricsRef);

        if (docSnap.exists() && docSnap.data().calories) {
            const calories = docSnap.data().calories;
            return {
                byMeal: calories.byMeal || { breakfast: 0, dinner: 0, lunch: 0, snacks: 0 },
                carbs: calories.carbs || 0,
                fat: calories.fat || 0,
                goal: calories.goal || defaultCalorieGoal,
                protein: calories.protein || 0,
                remaining: (calories.goal || defaultCalorieGoal) - (calories.total || 0),
                total: calories.total || 0,
            };
        }

        return {
            byMeal: { breakfast: 0, dinner: 0, lunch: 0, snack: 0 },
            carbs: 0,
            fat: 0,
            goal: defaultCalorieGoal,
            protein: 0,
            remaining: defaultCalorieGoal,
            total: 0,
        };
    } catch (error) {
        logger.error(error, "CaloriesService", { dateString, userId });
        throw new Error("Failed to get daily calorie summary");
    }
}

export async function getMealsForDay(userId: string, dateString: string): Promise<Meal[]> {
    try {
        const mealsRef = collection(firestore, "users", userId, "meals");
        const queryVal = query(
            mealsRef,
            where("dateString", "==", dateString),
            orderBy("timestamp", "asc"),
        );

        const querySnapshot = await getDocs(queryVal);
        return querySnapshot.docs.map(
            (document) =>
                ({
                    id: document.id,
                    ...document.data(),
                }) as Meal,
        );
    } catch (error) {
        logger.error(error, "CaloriesService", { dateString, userId });
        throw new Error("Failed to get meals for day");
    }
}

export async function setCalorieGoal(
    userId: string,
    goal: number,
    defaultCalorieGoal: number,
    dateString: string,
): Promise<void> {
    try {
        const summary = await getDailyCalorieSummary(userId, defaultCalorieGoal, dateString);
        await updateHealthMetrics(userId, dateString, {
            calories: {
                ...summary,
                goal,
                remaining: goal - summary.total,
            },
        });
    } catch (error) {
        logger.error(error, "CaloriesService", { dateString, goal, userId });
        throw new Error("Failed to set calorie goal");
    }
}

async function updateDailyCalorieTotals(
    userId: string,
    dateString: string,
    defaultCalorieGoal: number,
): Promise<void> {
    try {
        const meals = await getMealsForDay(userId, dateString);

        const mealTypeTotals = {
            breakfast: 0,
            dinner: 0,
            lunch: 0,
            snack: 0,
        };

        let totalProtein = 0;
        let totalCarbs = 0;
        let totalFat = 0;

        for (const meal of meals) {
            mealTypeTotals[meal.mealType] += meal.totalCalories;

            totalProtein += meal.macros.protein;
            totalCarbs += meal.macros.carbs;
            totalFat += meal.macros.fat;
        }

        const totalCalories = Object.values(mealTypeTotals).reduce(
            (sum, calories) => sum + calories,
            0,
        );

        const currentSummary = await getDailyCalorieSummary(userId, defaultCalorieGoal, dateString);
        const goal = currentSummary.goal || defaultCalorieGoal;

        await updateHealthMetrics(userId, dateString, {
            calories: {
                byMeal: mealTypeTotals,
                carbs: totalCarbs,
                fat: totalFat,
                goal,
                protein: totalProtein,
                remaining: goal - totalCalories,
                total: totalCalories,
            },
        });
    } catch (error) {
        logger.error(error, "CaloriesService", { dateString, userId });
        throw new Error("Failed to update daily calorie totals");
    }
}
