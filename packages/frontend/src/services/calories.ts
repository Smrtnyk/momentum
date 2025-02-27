import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    increment,
    limit,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
    Timestamp,
    updateDoc,
    where,
} from "firebase/firestore";

import type { FavoriteFood, FoodItem, Meal } from "../types/health-metrics";

import { firestore } from "../firebase";
import { logger } from "../logger/app-logger";
import { updateHealthMetrics } from "./health-metrics";

const DEFAULT_CALORIE_GOAL = 2000;

/**
 * Add a meal with food items
 * @param userId User ID
 * @param mealType Meal type (breakfast, lunch, dinner, snack)
 * @param foods Array of food items in the meal
 * @param dateString Date string in YYYY-MM-DD format (defaults to today)
 */
export async function addMeal(
    userId: string,
    mealType: "breakfast" | "dinner" | "lunch" | "snack",
    foods: FoodItem[],
    dateString: string = new Date().toISOString().split("T")[0],
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
        await updateDailyCalorieTotals(userId, dateString);

        for (const food of foods) {
            // eslint-disable-next-line no-await-in-loop
            await incrementFoodUsageCount(userId, food);
        }

        return mealDocRef.id;
    } catch (error) {
        logger.error(error, "CaloriesService", { foods, mealType, userId });
        throw new Error("Failed to add meal");
    }
}

/**
 * Delete a meal and update calorie totals
 * @param userId User ID
 * @param mealId Meal ID to delete
 * @param dateString Date string of the meal
 */
export async function deleteMeal(
    userId: string,
    mealId: string,
    dateString: string,
): Promise<void> {
    try {
        const mealRef = doc(firestore, "users", userId, "meals", mealId);
        await deleteDoc(mealRef);
        await updateDailyCalorieTotals(userId, dateString);
    } catch (error) {
        logger.error(error, "CaloriesService", { mealId, userId });
        throw new Error("Failed to delete meal");
    }
}

/**
 * Get the daily calorie summary for a user
 * @param userId User ID
 * @param dateString Date string in YYYY-MM-DD format (defaults to today)
 */
export async function getDailyCalorieSummary(
    userId: string,
    dateString: string = new Date().toISOString().split("T")[0],
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
                goal: calories.goal || DEFAULT_CALORIE_GOAL,
                protein: calories.protein || 0,
                remaining: (calories.goal || DEFAULT_CALORIE_GOAL) - (calories.total || 0),
                total: calories.total || 0,
            };
        }

        // Return default values if no data found
        return {
            byMeal: { breakfast: 0, dinner: 0, lunch: 0, snack: 0 },
            carbs: 0,
            fat: 0,
            goal: DEFAULT_CALORIE_GOAL,
            protein: 0,
            remaining: DEFAULT_CALORIE_GOAL,
            total: 0,
        };
    } catch (error) {
        logger.error(error, "CaloriesService", { dateString, userId });
        throw new Error("Failed to get daily calorie summary");
    }
}

/**
 * Get all meals for a specific day
 * @param userId User ID
 * @param dateString Date string in YYYY-MM-DD format (defaults to today)
 */
export async function getMealsForDay(
    userId: string,
    dateString: string = new Date().toISOString().split("T")[0],
): Promise<Meal[]> {
    try {
        const mealsRef = collection(firestore, "users", userId, "meals");
        const queryVal = query(
            mealsRef,
            where("dateString", "==", dateString),
            where("userId", "==", userId),
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

/**
 * Get a user's recent food entries
 * @param userId User ID
 * @param limitVal Maximum number of items to return
 */
export async function getRecentFoods(userId: string, limitVal = 10): Promise<FavoriteFood[]> {
    try {
        const favoritesRef = collection(firestore, "users", userId, "favorite_foods");
        const queryVal = query(favoritesRef, orderBy("lastUsed", "desc"), limit(limitVal));

        const querySnapshot = await getDocs(queryVal);
        return querySnapshot.docs.map(
            (document) =>
                ({
                    id: document.id,
                    ...document.data(),
                }) as FavoriteFood,
        );
    } catch (error) {
        logger.error(error, "CaloriesService", { userId });
        throw new Error("Failed to get recent foods");
    }
}

/**
 * Set or update the user's daily calorie goal
 * @param userId User ID
 * @param goal Daily calorie goal
 * @param dateString Date string in YYYY-MM-DD format (defaults to today)
 */
export async function setCalorieGoal(
    userId: string,
    goal: number,
    dateString: string = new Date().toISOString().split("T")[0],
): Promise<void> {
    try {
        const summary = await getDailyCalorieSummary(userId, dateString);
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

/**
 * Increment usage count for a food item
 * @param userId User ID
 * @param food Food item to increment usage for
 */
async function incrementFoodUsageCount(userId: string, food: FoodItem): Promise<void> {
    try {
        const favoriteRef = doc(firestore, "users", userId, "favorite_foods", food.id);

        // Check if food already exists in favorites
        const docSnap = await getDoc(favoriteRef);

        if (docSnap.exists()) {
            // Increment usage count
            await updateDoc(favoriteRef, {
                lastUsed: serverTimestamp(),
                useCount: increment(1),
            });
        } else {
            // Add with initial count
            await setDoc(favoriteRef, {
                ...food,
                lastUsed: serverTimestamp(),
                useCount: 1,
            });
        }
    } catch (error) {
        logger.error(error, "CaloriesService", { food, userId });
        // Don't throw - this is an enhancement, not critical
    }
}

/**
 * Update daily calorie totals based on all meals for the day
 * @param userId User ID
 * @param dateString Date string in YYYY-MM-DD format
 */
async function updateDailyCalorieTotals(userId: string, dateString: string): Promise<void> {
    try {
        // Get all meals for the day
        const meals = await getMealsForDay(userId, dateString);

        // Calculate totals
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
            // Add to meal type totals
            mealTypeTotals[meal.mealType] += meal.totalCalories;

            // Add to macros
            totalProtein += meal.macros.protein;
            totalCarbs += meal.macros.carbs;
            totalFat += meal.macros.fat;
        }

        // Calculate total calories
        const totalCalories = Object.values(mealTypeTotals).reduce(
            (sum, calories) => sum + calories,
            0,
        );

        // Get current calorie goal
        const currentSummary = await getDailyCalorieSummary(userId, dateString);
        const goal = currentSummary.goal || DEFAULT_CALORIE_GOAL;

        // Update health metrics with new totals
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
