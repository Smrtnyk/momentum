import type { FoodItem } from "../types/health-metrics";

import { logger } from "../logger/app-logger";

// Type for storing recent foods with additional metadata
type RecentFood = FoodItem & {
    // Timestamp when the food was last used
    lastUsed: number;
    // Number of times the food has been used
    useCount: number;
};

const STORAGE_KEY = "recent-foods";
// Max number of foods to store
const MAX_RECENT_FOODS = 20;
// Maximum age in days before food is removed
const MAX_AGE_DAYS = 30;

/**
 * Add or update a food item in the recent foods list
 * @param userId User ID
 * @param food Food item to add/update
 */
export function addRecentFood(userId: string, food: FoodItem): void {
    try {
        const storageKey = `${STORAGE_KEY}-${userId}`;
        const storedData = localStorage.getItem(storageKey);
        let recentFoods: RecentFood[] = storedData ? JSON.parse(storedData) : [];

        // Look for existing food with the same ID
        const existingIndex = recentFoods.findIndex((item) => item.id === food.id);

        if (existingIndex === -1) {
            // Add new food
            recentFoods.push({
                ...food,
                lastUsed: Date.now(),
                useCount: 1,
            });
        } else {
            // Update existing food
            recentFoods[existingIndex] = {
                ...food,
                lastUsed: Date.now(),
                useCount: (recentFoods[existingIndex].useCount || 0) + 1,
            };
        }

        // Clean up the list if it exceeds maximum size
        if (recentFoods.length > MAX_RECENT_FOODS) {
            // Sort by use count first (keep most used), then by last used (keep most recent)
            recentFoods.sort((a, b) => {
                if (b.useCount !== a.useCount) {
                    return b.useCount - a.useCount;
                }
                return b.lastUsed - a.lastUsed;
            });

            // Trim to max size
            recentFoods = recentFoods.slice(0, MAX_RECENT_FOODS);
        }

        // Save back to localStorage
        localStorage.setItem(storageKey, JSON.stringify(recentFoods));
    } catch (error) {
        logger.error(error, "RecentFoodsService", { food, userId });
    }
}

/**
 * Get a user's recent food entries from localStorage
 * @param userId User ID (used for storage key)
 * @param limitVal Maximum number of items to return
 */
export function getRecentFoods(userId: string, limitVal = 10): FoodItem[] {
    try {
        const storageKey = `${STORAGE_KEY}-${userId}`;
        const storedData = localStorage.getItem(storageKey);

        if (!storedData) {
            return [];
        }

        const allFoods: RecentFood[] = JSON.parse(storedData);

        // Clean up any expired items
        const cleanedFoods = removeExpiredFoods(allFoods, userId);

        // Sort by last used (most recent first) and limit to requested number
        return cleanedFoods.sort((a, b) => b.lastUsed - a.lastUsed).slice(0, limitVal);
    } catch (error) {
        logger.error(error, "RecentFoodsService", { userId });
        return [];
    }
}

/**
 * Remove expired foods from the recent foods list
 * @param foods Array of recent foods
 * @param userId User ID for updating storage if needed
 * @returns Cleaned array of foods
 */
function removeExpiredFoods(foods: RecentFood[], userId: string): RecentFood[] {
    const now = Date.now();
    // Convert days to milliseconds
    const maxAge = MAX_AGE_DAYS * 24 * 60 * 60 * 1000;

    const validFoods = foods.filter((food) => {
        // Keep foods that have been used within the max age
        return now - food.lastUsed < maxAge;
    });

    // If we removed some foods, update localStorage
    if (validFoods.length < foods.length) {
        const storageKey = `${STORAGE_KEY}-${userId}`;
        localStorage.setItem(storageKey, JSON.stringify(validFoods));
    }

    return validFoods;
}
