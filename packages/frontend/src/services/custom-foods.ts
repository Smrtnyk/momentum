import type { Timestamp } from "firebase/firestore";

import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
} from "firebase/firestore";

import type { FoodItem } from "../types/health-metrics";

import { firestore } from "../firebase";
import { logger } from "../logger/app-logger";

/**
 * Interface for custom foods stored in database
 * Extends FoodItem with metadata for user-created foods
 */
export interface CustomFood extends FoodItem {
    createdAt: Timestamp;
    isCustom: true;
    updatedAt: Timestamp;
    userId: string;
}

/**
 * Create a new custom food
 * @param userId User ID
 * @param food Food item details
 */
export async function createCustomFood(
    userId: string,
    food: Omit<FoodItem, "id">,
): Promise<string> {
    try {
        const customFoodsRef = collection(firestore, "users", userId, "custom_foods");

        // Add metadata to the food
        const customFoodData = {
            ...food,
            createdAt: serverTimestamp(),
            isCustom: true,
            updatedAt: serverTimestamp(),
            userId,
        };

        const docRef = await addDoc(customFoodsRef, customFoodData);
        return docRef.id;
    } catch (error) {
        logger.error(error, "CustomFoodsService", { food, userId });
        throw new Error("Failed to create custom food");
    }
}

/**
 * Delete a custom food
 * @param userId User ID
 * @param foodId Food ID
 */
export async function deleteCustomFood(userId: string, foodId: string): Promise<void> {
    try {
        const foodRef = doc(firestore, "users", userId, "custom_foods", foodId);
        await deleteDoc(foodRef);
    } catch (error) {
        logger.error(error, "CustomFoodsService", { foodId, userId });
        throw new Error("Failed to delete custom food");
    }
}

/**
 * Get all custom foods for a user
 * @param userId User ID
 */
export async function getUserCustomFoods(userId: string): Promise<CustomFood[]> {
    try {
        const customFoodsRef = collection(firestore, "users", userId, "custom_foods");
        const queryVal = query(customFoodsRef, orderBy("updatedAt", "desc"));

        const snapshot = await getDocs(queryVal);
        return snapshot.docs.map(
            (document) =>
                ({
                    ...document.data(),
                    id: document.id,
                }) as CustomFood,
        );
    } catch (error) {
        logger.error(error, "CustomFoodsService", { userId });
        throw new Error("Failed to fetch custom foods");
    }
}

/**
 * Update an existing custom food
 * @param userId User ID
 * @param foodId Food ID
 * @param updates Updates to apply
 */
export async function updateCustomFood(
    userId: string,
    foodId: string,
    updates: Partial<Omit<FoodItem, "id">>,
): Promise<void> {
    try {
        const foodRef = doc(firestore, "users", userId, "custom_foods", foodId);

        await updateDoc(foodRef, {
            ...updates,
            updatedAt: serverTimestamp(),
        });
    } catch (error) {
        logger.error(error, "CustomFoodsService", { foodId, updates, userId });
        throw new Error("Failed to update custom food");
    }
}
