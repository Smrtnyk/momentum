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

import type { FoodItem } from "../types/food";

import { firestore } from "../firebase";
import { logger } from "../logger/app-logger";

export interface CustomFood extends FoodItem {
    createdAt: Timestamp;
    isCustom: true;
    updatedAt: Timestamp;
    userId: string;
}

export async function createCustomFood(
    userId: string,
    food: Omit<FoodItem, "id">,
): Promise<string> {
    try {
        const customFoodsRef = collection(firestore, "users", userId, "custom_foods");

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

export async function deleteCustomFood(userId: string, foodId: string): Promise<void> {
    try {
        const foodRef = doc(firestore, "users", userId, "custom_foods", foodId);
        await deleteDoc(foodRef);
    } catch (error) {
        logger.error(error, "CustomFoodsService", { foodId, userId });
        throw new Error("Failed to delete custom food");
    }
}

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
